"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ExamRoom() {
  const [name, setName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [step, setStep] = useState("login"); 
  const [examData, setExamData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null); 
  const [timeLeft, setTimeLeft] = useState(null); 

  const handleJoinExam = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !passcode.trim()) return setError("Barcha maydonlarni to'ldiring");
    setIsLoading(true);

    try {
      const res = await fetch("/api/exam/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, passcode })
      });
      const data = await res.json();

      if (res.ok) {
        setExamData(data);
        setStep("exam"); 
      } else {
        setError(data.message || "Xatolik yuz berdi");
      }
    } catch (err) {
      setError("Internet bilan ulanishda xato!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmitExam = async (isAutoSubmit = false) => {
    if (!isAutoSubmit) {
      const answeredCount = Object.keys(answers).length;
      if (answeredCount < examData.questions.length) {
        const confirmSubmit = confirm(`Siz ${examData.questions.length} ta savoldan ${answeredCount} tasiga javob berdingiz. Yakunlaysizmi?`);
        if (!confirmSubmit) return;
      }
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: examData.examId,
          passcode: passcode,
          answers: answers
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setStep("result"); 
      } else {
        alert(data.message || "Xatolik yuz berdi");
      }
    } catch (error) {
      alert("Server xatosi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (step === "exam" && examData?.endTime) {
      const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const end = new Date(examData.endTime).getTime();
        const distance = end - now;

        if (distance <= 0) {
          clearInterval(timerInterval);
          setTimeLeft(0);
          alert("⏰ Vaqt tugadi! Imtihon avtomatik yakunlanmoqda...");
          handleSubmitExam(true);
        } else {
          setTimeLeft(distance);
        }
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [step, examData]);

  const formatTime = (ms) => {
    if (ms === null) return "--:--";
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 1. NATIJA EKRANI
  if (step === "result" && result) {
    const percentage = Math.round((result.score / result.maxScore) * 100);
    let emoji = "🎉"; let color = "text-green-500"; let bg = "bg-green-50";
    if (percentage < 60) { emoji = "👍"; color = "text-blue-500"; bg = "bg-blue-50"; }
    if (percentage < 40) { emoji = "😕"; color = "text-red-500"; bg = "bg-red-50"; }

    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-500 opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-md w-full text-center animate-pop z-10 relative">
          <div className="text-6xl mb-6">{emoji}</div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Imtihon Yakunlandi!</h1>
          <p className="text-gray-500 font-medium mb-8">Natijangiz tizimga saqlandi</p>
          
          <div className={`${bg} rounded-3xl p-8 mb-8 border border-gray-100/50`}>
             <p className={`text-6xl font-black ${color} mb-2`}>{result.score} <span className="text-2xl text-gray-400">/ {result.maxScore}</span></p>
             <p className="text-gray-600 font-bold uppercase tracking-wider text-xs">Jami Ball ({percentage}%)</p>
          </div>

          <Link href="/">
            <button className="w-full py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-black transition-all shadow-lg active:scale-95">
              Bosh sahifaga qaytish
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // 2. IMTIHON ISHLASH EKRANI
  if (step === "exam" && examData) {
    const isWritten = examData.examType === "written";

    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mt-4 animate-pop">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 mb-8 sticky top-24 z-30">
          <div>
            <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider mb-2 inline-block ${isWritten ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
              {isWritten ? "✍️ Yozma Nazorat" : "📝 Test Nazorati"}
            </span>
            <h1 className="text-2xl font-black text-gray-900">{examData.title}</h1>
            <p className="text-gray-500 font-bold text-sm mt-1">O'quvchi: <span className="text-blue-600">{name}</span></p>
          </div>
          
          <div className="flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
             <div className="text-center bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                <p className={`text-2xl font-black ${timeLeft < 60000 ? "text-red-600 animate-pulse" : "text-gray-800"}`}>
                  {formatTime(timeLeft)}
                </p>
                <p className="text-[10px] text-red-500 font-bold uppercase">Qolgan vaqt</p>
             </div>
             <div className="w-px h-8 bg-gray-200"></div>
             <div className="text-center">
                <p className="text-2xl font-black text-blue-600">{Object.keys(answers).length} / {examData.questions.length}</p>
                <p className="text-[10px] text-blue-500 font-bold uppercase">Belgilandi</p>
             </div>
          </div>
        </div>

        <div className="space-y-8 mb-12">
          {examData.questions.map((q, index) => (
            <div key={q._id} className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex gap-3">
                <span className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full ${isWritten ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'}`}>{index + 1}</span> 
                {q.text}
              </h3>
              
              {/* SHU YERDA AJRALADI: Yozma ish uchun Input, Test uchun knopkalar */}
              <div className="pl-0 sm:pl-11">
                {isWritten ? (
                  <textarea 
                    value={answers[q._id] || ""}
                    onChange={(e) => handleOptionSelect(q._id, e.target.value)}
                    placeholder="Javobingizni to'liq va tushunarli qilib yozing..."
                    rows="4"
                    className="w-full p-5 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-900 font-medium outline-none focus:border-orange-500 focus:bg-white transition-all resize-y custom-scrollbar"
                  ></textarea>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((option, optIdx) => {
                      const isSelected = answers[q._id] === option;
                      return (
                        <button key={optIdx} onClick={() => handleOptionSelect(q._id, option)} className={`text-left p-4 rounded-xl border-2 font-bold text-sm transition-all flex items-start gap-3 group ${isSelected ? "border-purple-600 bg-purple-50 text-purple-800 shadow-sm" : "border-gray-100 bg-white text-gray-600 hover:border-purple-200"}`}>
                          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5 ${isSelected ? "border-purple-600" : "border-gray-300"}`}>{isSelected && <div className="w-2.5 h-2.5 bg-purple-600 rounded-full"></div>}</div>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 text-center">
          <button onClick={() => handleSubmitExam(false)} disabled={isLoading} className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-lg rounded-xl transition-all shadow-lg hover:shadow-green-500/30 active:scale-95 disabled:opacity-70">
            {isLoading ? "Yuborilmoqda..." : "Imtihonni Yakunlash 🏁"}
          </button>
        </div>
      </div>
    );
  }

  // 3. LOGIN EKRANI
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-white max-w-md w-full animate-pop z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-[1.5rem] flex items-center justify-center text-4xl mx-auto mb-6 rotate-3">🎯</div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Imtihonga kirish</h1>
          <p className="text-gray-500 font-medium">Ustozingiz bergan kodni kiriting</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold text-center">⚠️ {error}</div>}
        <form onSubmit={handleJoinExam} className="space-y-6">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-bold outline-none focus:border-purple-500 transition-all text-lg" placeholder="Ism Familiyangiz" />
          <input type="text" value={passcode} onChange={(e) => setPasscode(e.target.value.toUpperCase())} className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 font-black tracking-widest uppercase text-center outline-none focus:border-purple-500 transition-all text-xl" placeholder="TEST-XXXXX" maxLength={15}/>
          <button type="submit" disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black text-lg rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50">Kirish 🚀</button>
        </form>
      </div>
    </div>
  );
}