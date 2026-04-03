"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateAIExam() {
  const router = useRouter();
  
  // Asosiy ma'lumotlar
  const [examTitle, setExamTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [examType, setExamType] = useState("test"); // 'test' yoki 'written'
  const [maxScore, setMaxScore] = useState(100);
  
  // Sozlamalar
  const [totalQuestions, setTotalQuestions] = useState(10); 
  const [questionsPerStudent, setQuestionsPerStudent] = useState(5);
  const [studentCount, setStudentCount] = useState(15);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  
  // Holatlar
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Yaratilgandan so'ng yuklab olish uchun
  const [successData, setSuccessData] = useState(null); 

  const handleGenerateExam = async (e) => {
    e.preventDefault();
    setError("");

    if (!examTitle.trim() || !rawText.trim() || !startTime || !endTime || !maxScore) {
      return setError("Iltimos, barcha maydonlarni to'ldiring!");
    }
    if (new Date(startTime) >= new Date(endTime)) {
      return setError("Tugash vaqti boshlanishidan keyin bo'lishi shart!");
    }
    
    setIsLoading(true);

    try {
      const res = await fetch("/api/teacher/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: examTitle,
          text: rawText,
          examType,
          maxScore: Number(maxScore),
          totalQuestions: Number(totalQuestions),
          questionsPerStudent: Number(questionsPerStudent),
          studentCount: Number(studentCount),
          startTime,
          endTime
        })
      });

      const data = await res.json();
      if (res.ok) {
        // Muvaffaqiyatli yaratilsa, o'sha zahoti Word yuklab olish oynasini ochamiz
        setSuccessData({
          title: examTitle,
          type: examType,
          questions: data.generatedQuestions
        });
      } else {
        setError(data.message || "Xatolik yuz berdi");
      }
    } catch (err) {
      setError("Server bilan aloqa yo'q.");
    } finally {
      setIsLoading(false);
    }
  };

  // WORD FORMATDA YUKLAB OLISH (Frontend o'zi yasab beradi)
  const downloadWordDoc = () => {
    if(!successData) return;
    
    let content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Imtihon</title></head>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="text-align: center; color: #333;">${successData.title}</h1>
        <p style="text-align: center; color: #666;">Nazorat turi: <b>${successData.type === 'test' ? 'Test' : 'Yozma ish'}</b></p>
        <hr/>
    `;

    successData.questions.forEach((q, i) => {
      content += `<div style="margin-bottom: 20px;">`;
      content += `<h3 style="margin-bottom: 10px;">${i + 1}. ${q.question}</h3>`;
      
      if (successData.type === "test" && q.options) {
        content += `<ul style="list-style-type: none; padding-left: 10px;">`;
        q.options.forEach(opt => {
          content += `<li style="margin-bottom: 5px;">&#9711; ${opt}</li>`;
        });
        content += `</ul>`;
      } else {
        content += `<p style="color:#aaa;"><i>(O'quvchi javob yozish joyi...)</i></p>`;
      }
      
      content += `<div style="background-color: #f0fdf4; padding: 10px; border-left: 4px solid #16a34a; margin-top: 10px;">`;
      content += `<p style="margin:0; color: #166534;"><b>To'g'ri Javob (AI uchun):</b> ${q.answer}</p>`;
      content += `</div></div>`;
    });

    content += `</body></html>`;

    // Word formatida yuklab olish mantiqi
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${successData.title.replace(/\s+/g, '_')}_Savollar.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // MUVAFFAQIYATLI YARATILGANDA CHIQADIGAN OYNA
  if (successData) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-10 animate-pop text-center">
        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-2xl">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-inner">✅</div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Imtihon tayyor!</h1>
          <p className="text-gray-500 font-bold mb-8">Savollar va javoblar bazasi muvaffaqiyatli yaratildi. Parollar ro'yxatini xonalar bo'limidan olishingiz mumkin.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={downloadWordDoc}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              <span>📄</span> Word formatida yuklab olish
            </button>
            <Link href="/teacher/rooms">
              <button className="px-8 py-4 bg-gray-900 hover:bg-black text-white font-black rounded-xl shadow-lg transition-all w-full sm:w-auto">
                Parollarni ko'rish &rarr;
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ASOSIY YARATISH EKRANI
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 mt-4 animate-pop">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/teacher" className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-500 shadow-sm">&larr;</Link>
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2"><span>✨</span> AI Imtihon Yaratish</h1>
        </div>
      </div>

      <form onSubmit={handleGenerateExam} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6">1. Asosiy ma'lumotlar</h2>
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold">⚠️ {error}</div>}

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Imtihon nomi (Fani)</label>
              <input type="text" value={examTitle} onChange={(e) => setExamTitle(e.target.value)} placeholder="Masalan: Tarix yakuniy" className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 font-bold outline-none focus:ring-2 focus:ring-purple-500"/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nazorat turi</label>
                <div className="flex gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                  <button type="button" onClick={() => setExamType("test")} className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${examType === "test" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>📝 Test</button>
                  <button type="button" onClick={() => setExamType("written")} className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${examType === "written" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>✍️ Yozma ish</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Umumiy Maksimal Ball</label>
                <input type="number" min="1" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 font-bold outline-none focus:ring-2 focus:ring-purple-500" placeholder="100"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div><label className="block text-sm font-bold text-gray-700 mb-2">Boshlanish</label><input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 font-bold"/></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-2">Tugash</label><input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 font-bold"/></div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">AI tahlil qilishi uchun matn</label>
              <textarea rows="6" value={rawText} onChange={(e) => setRawText(e.target.value)} placeholder="Matnni tashlang..." className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 font-medium outline-none focus:ring-2 focus:ring-purple-500 resize-y"></textarea>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6">2. Sozlamalar</h2>
            <div className="space-y-5 mb-8">
              <div><label className="flex justify-between text-sm font-bold text-gray-700 mb-2"><span>Jami AI tuzadigan savollar</span></label><input type="number" min="1" value={totalQuestions} onChange={(e) => setTotalQuestions(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-bold outline-none focus:ring-2 focus:ring-purple-500"/></div>
              <div><label className="flex justify-between text-sm font-bold text-gray-700 mb-2"><span>O'quvchiga tushadigani</span></label><input type="number" min="1" value={questionsPerStudent} onChange={(e) => setQuestionsPerStudent(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-bold outline-none focus:ring-2 focus:ring-blue-500"/></div>
              <div><label className="flex justify-between text-sm font-bold text-gray-700 mb-2"><span>Parollar soni</span></label><input type="number" min="1" value={studentCount} onChange={(e) => setStudentCount(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-bold outline-none focus:ring-2 focus:ring-green-500"/></div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 disabled:opacity-70 flex justify-center gap-2">
              {isLoading ? "Generatsiya..." : "✨ Yaratishni boshlash"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}