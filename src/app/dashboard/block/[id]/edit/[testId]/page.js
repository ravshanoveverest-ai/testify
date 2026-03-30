"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditTest() {
  const params = useParams();
  const router = useRouter();
  const blockId = params.id;
  const testId = params.testId;

  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modallar uchun holatlar (States)
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const formatQuestionsToText = (questionsArray) => {
    return questionsArray.map(q => {
      let txt = `Q: ${q.text}\n`;
      const alphabet = ['A', 'B', 'C', 'D', 'E'];
      q.options.forEach((opt, idx) => {
        txt += `${alphabet[idx]}) ${opt}\n`;
      });
      const correctIdx = q.options.indexOf(q.answer);
      txt += `ANSWER: ${alphabet[correctIdx]}`;
      return txt;
    }).join('\n\n');
  };

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await fetch(`/api/tests?blockId=${blockId}`);
        const data = await res.json();
        const currentTest = data.tests.find(t => t._id === testId);
        
        if (currentTest) {
          setTitle(currentTest.title);
          setVisibility(currentTest.visibility.toLowerCase());
          
          if (currentTest.format === 'json') {
            setContent(JSON.stringify(currentTest.questions, null, 2));
          } else {
            setContent(formatQuestionsToText(currentTest.questions));
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTest();
  }, [blockId, testId]);

  const parseTestContent = (text) => {
    if (!text) return [];
    try {
      const parsedJson = JSON.parse(text);
      if (Array.isArray(parsedJson)) {
        return parsedJson.map(q => ({
          text: q.text || q.question || "Savol kiritilmagan",
          options: q.options || [],
          answer: q.answer || ""
        }));
      }
    } catch (error) {}

    const questions = [];
    let currentQ = null;
    const lines = text.split('\n').map(l => l.trim()).filter(l => l !== '');

    lines.forEach(line => {
      if (line.toUpperCase().startsWith('Q:')) {
        if (currentQ) questions.push(currentQ);
        currentQ = { text: line.substring(2).trim(), options: [], answer: '' };
      } else if (line.match(/^[A-Ea-e]\)/)) { 
        if (currentQ) currentQ.options.push(line.substring(2).trim());
      } else if (line.toUpperCase().startsWith('ANSWER:')) {
        if (currentQ) {
          const letter = line.toUpperCase().replace('ANSWER:', '').trim(); 
          const index = letter.charCodeAt(0) - 65;
          currentQ.answer = currentQ.options[index] || letter; 
        }
      }
    });
    if (currentQ) questions.push(currentQ);
    return questions;
  };

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) return setErrorMsg("Iltimos, barcha maydonlarni to'ldiring!");
    
    const parsedQuestions = parseTestContent(content);
    if (parsedQuestions.length === 0) return setErrorMsg("Savollar formati noto'g'ri kiritilgan.");
    
    let formatType = 'txt';
    try { JSON.parse(content); formatType = 'json'; } catch (e) { formatType = 'txt'; }

    const updatedData = {
      title,
      visibility: visibility === 'public' ? 'Public' : 'Private',
      questions: parsedQuestions,
      questionCount: parsedQuestions.length,
      format: formatType
    };

    try {
      const res = await fetch(`/api/tests?id=${testId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        setSuccessMsg("Test muvaffaqiyatli yangilandi! ✏️"); // Modalni chaqiramiz
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Muvaffaqiyat modalidagi "OK" bosilganda sahifadan chiqib ketadi
  const handleCloseSuccess = () => {
    setSuccessMsg("");
    router.push(`/dashboard/block/${blockId}`);
  };

  if (isLoading) return <div className="p-20 text-center font-bold text-gray-500">Test yuklanmoqda...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 mt-4 relative">
      <div className="mb-8">
        <Link href={`/dashboard/block/${blockId}`} className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2 mb-4 w-fit font-medium">
          <span className="text-xl">←</span> Blokga qaytish
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900">Testni Tahrirlash ✏️</h1>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Test nomi</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium bg-gray-50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kimlarga ko'rinadi?</label>
              <select value={visibility} onChange={(e) => setVisibility(e.target.value)} className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium bg-gray-50 focus:bg-white">
                <option value="private">Private (Faqat menga)</option>
                <option value="public">Public (Hamma foydalanuvchilarga)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Test savollari (TXT yoki JSON formati)</label>
            <textarea rows="15" value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm bg-gray-50 focus:bg-white leading-relaxed"></textarea>
          </div>

          <button type="button" onClick={handleUpdate} className="w-full bg-orange-500 text-white font-extrabold py-4 rounded-xl hover:bg-orange-600 transition-all shadow-md text-lg">
            O'zgarishlarni Saqlash 💾
          </button>
        </form>
      </div>

      {/* ================================================= */}
      {/* 1. MUVAFFAQIYAT MODALI */}
      {/* ================================================= */}
      {successMsg && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-overlay">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center animate-pop">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">Ajoyib!</h3>
            <p className="text-gray-600 mb-8 font-medium">{successMsg}</p>
            <button onClick={handleCloseSuccess} className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors">
              Davom etish
            </button>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* 2. XATOLIK MODALI (Maydonlarni to'ldirmasa) */}
      {/* ================================================= */}
      {errorMsg && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-overlay">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center animate-pop">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">Xatolik yuz berdi!</h3>
            <p className="text-gray-600 mb-8 font-medium">{errorMsg}</p>
            <button onClick={() => setErrorMsg("")} className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors">
              Tushunarli
            </button>
          </div>
        </div>
      )}
    </div>
  );
}