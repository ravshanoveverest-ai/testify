"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function BlockDetails() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const blockId = params.blockId || params.id;

  const [block, setBlock] = useState(null);
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // YANGI TEST YARATISH STATE'LARI
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("Public");
  const [rawQuestions, setRawQuestions] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. BLOK VA TESTLARNI YUKLASH
  const fetchBlockData = async () => {
    try {
      const blockRes = await fetch(`/api/blocks?id=${blockId}`);
      const blockData = await blockRes.json();
      if (blockRes.ok) setBlock(blockData.block);

      const testsRes = await fetch(`/api/tests?blockId=${blockId}`);
      const testsData = await testsRes.json();
      if (testsRes.ok) setTests(testsData.tests || []);
      
    } catch (err) {
      console.log("Ma'lumotlarni yuklashda xato", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && blockId) {
      fetchBlockData();
    }
  }, [status, blockId, router]);

  // =========================================================================
  // 2. SAVOLLARNI PARS QILISH (TXT VA JSON QO'LLAB-QUVVATLANADI)
  // =========================================================================
  const parseQuestions = (inputText) => {
    const text = inputText.trim();
    if (!text) return [];

    // URINISH 1: JSON FORMATNI TEKSHIRISH
    try {
      const parsedJson = JSON.parse(text);
      
      if (Array.isArray(parsedJson)) {
        let isValid = true;
        const formattedQuestions = parsedJson.map((q) => {
          if (!q.question || !Array.isArray(q.options) || !q.answer) {
            isValid = false;
          }
          return {
            text: q.question, // API miz "text" deb qabul qiladi
            options: q.options,
            answer: q.answer
          };
        });

        if (isValid && formattedQuestions.length > 0) {
          return formattedQuestions; // JSON to'g'ri bo'lsa, qaytaramiz!
        }
      }
    } catch (error) {
      // JSON emas ekan. Xato bermaymiz, TXT deb o'ylab pastga o'tamiz.
    }

    // URINISH 2: ODATIY TXT FORMATNI TEKSHIRISH
    const lines = text.split("\n").map(line => line.trim()).filter(line => line !== "");
    const questions = [];
    let currentQuestion = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (/^\d+[\.\)]/.test(line)) {
        if (currentQuestion && currentQuestion.text && currentQuestion.options.length >= 2 && currentQuestion.answer) {
          questions.push(currentQuestion);
        }
        currentQuestion = { text: line.replace(/^\d+[\.\)]\s*/, ""), options: [], answer: "" };
      } 
      else if (/^[A-Da-d][\)\.]/.test(line)) {
        if (currentQuestion) {
          currentQuestion.options.push(line.replace(/^[A-Da-d][\)\.]\s*/, ""));
        }
      } 
      else if (/^Javob:/i.test(line)) {
        if (currentQuestion) {
          currentQuestion.answer = line.replace(/^Javob:\s*/i, "");
        }
      }
    }

    if (currentQuestion && currentQuestion.text && currentQuestion.options.length >= 2 && currentQuestion.answer) {
      questions.push(currentQuestion);
    }

    return questions;
  };

  // 3. TEST YARATISH (SUBMIT)
  const handleCreateTest = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim()) return setError("Test sarlavhasini kiriting!");
    
    const parsedQuestions = parseQuestions(rawQuestions);
    
    if (parsedQuestions.length === 0) {
      return setError("Savollarni to'g'ri formatda kiriting (TXT yoki JSON)");
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          visibility,
          blockId,
          questions: parsedQuestions
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(`Muvaffaqiyatli! ${parsedQuestions.length} ta savol qo'shildi.`);
        setTitle("");
        setRawQuestions("");
        setVisibility("Public");
        fetchBlockData(); // Testlar ro'yxatini yangilaymiz
      } else {
        setError(data.message || "Xatolik yuz berdi");
      }
    } catch (err) {
      setError("Server xatosi. Qaytadan urinib ko'ring.");
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  // 4. TESTNI O'CHIRISH
  const handleDeleteTest = async (testId) => {
    if (!confirm("Bu testni o'chirib yubormoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/tests?id=${testId}`, { method: "DELETE" });
      if (res.ok) fetchBlockData();
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading || status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-14 h-14 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-gray-400 text-lg">Yuklanmoqda...</p>
      </div>
    );
  }

  if (!block) {
    return (
      <div className="text-center p-20">
        <h1 className="text-3xl font-black text-gray-800">Blok topilmadi!</h1>
        <Link href="/dashboard" className="text-blue-600 font-bold mt-4 inline-block hover:underline">Orqaga qaytish</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 mt-4">
      
      {/* HEADER QISMI */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <Link href="/dashboard" className="text-gray-400 font-bold hover:text-blue-600 transition-colors text-sm mb-2 inline-block">
            &larr; Bloklarga qaytish
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center gap-3">
            <span className="text-4xl">{block.icon}</span> {block.name}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CHAP TOMON: TEST YARATISH FORMASI */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm animate-pop">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Yangi Test Yaratish 📝</h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2">
              <span>✅</span> {success}
            </div>
          )}

          <form onSubmit={handleCreateTest} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Test sarlavhasi</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: Tarix 1-qism" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 font-bold text-gray-800 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kimlar ko'ra oladi?</label>
                <select 
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 font-bold text-gray-800 outline-none transition-all"
                >
                  <option value="Public">🌍 Ommaviy (Hamma)</option>
                  <option value="Private">🔒 Shaxsiy (Faqat men)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Savollar matni (TXT yoki JSON formatda)</label>
              
              <div className="bg-blue-50 p-4 rounded-xl mb-3 border border-blue-100 text-sm">
                <p className="font-bold text-blue-700 mb-2">JSON formati namunasi:</p>
                <pre className="text-blue-600 text-xs overflow-x-auto whitespace-pre-wrap font-mono">
{`[
  {
    "question": "O'zbekiston poytaxti qayer?",
    "options": ["Samarqand", "Buxoro", "Toshkent", "Xiva"],
    "answer": "Toshkent"
  }
]`}
                </pre>
              </div>

              <textarea 
                rows="10" 
                value={rawQuestions}
                onChange={(e) => setRawQuestions(e.target.value)}
                placeholder="Bu yerga TXT yoki JSON formatda savollarni tashlang..." 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium text-gray-800 outline-none transition-all resize-y custom-scrollbar"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Yaratilmoqda..." : "Saqlash va Yaratish"}
            </button>
          </form>
        </div>

        {/* O'NG TOMON: MAVJUD TESTLAR RO'YXATI */}
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-6 px-2">Ushbu blokdagi testlar</h2>
          
          <div className="space-y-4">
            {tests.length > 0 ? (
              tests.map((test) => (
                <div key={test._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-blue-200 transition-colors group">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{test.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 font-medium">
                      <span>{test.questionCount} ta savol</span>
                      <span className="text-gray-300">&bull;</span>
                      <span className={`${test.visibility === "Public" ? "text-green-600" : "text-orange-500"}`}>
                        {test.visibility === "Public" ? "🌍 Ommaviy" : "🔒 Shaxsiy"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Link href={`/test/${test._id}`} className="flex-1 sm:flex-none text-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-colors text-sm">
                      Ko'rish
                    </Link>
                    <button 
                      onClick={() => handleDeleteTest(test._id)} 
                      className="flex-1 sm:flex-none px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors text-sm"
                    >
                      O'chirish
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-10 rounded-[2rem] border border-dashed border-gray-200 text-center">
                <span className="text-4xl block mb-3">👻</span>
                <p className="text-gray-500 font-bold">Bu blokda hali testlar yo'q.</p>
                <p className="text-sm text-gray-400 mt-1">Chap tomondagi formadan foydalanib test yarating.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}