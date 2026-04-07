// "use client";
// import { useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import Link from "next/link";

// export default function CreateTest() {
//   const router = useRouter();
//   const params = useParams();
//   const blockId = params.id;

//   const [title, setTitle] = useState("");
//   const [visibility, setVisibility] = useState("Private");
//   const [format, setFormat] = useState("txt");
//   const [rawText, setRawText] = useState("");
  
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState(""); // XATOLIK POP-UP UCHUN

//   // Formatni tozalab bazaga saqlash
//   const parseQuestions = (text) => {
//     const lines = text.split("\n").filter(line => line.trim() !== "");
//     const questions = [];
//     let currentQuestion = null;

//     lines.forEach(line => {
//       if (line.match(/^\d+\./)) {
//         if (currentQuestion) questions.push(currentQuestion);
//         currentQuestion = { text: line.replace(/^\d+\.\s*/, "").trim(), options: [], answer: "" };
//       } else if (line.match(/^[A-D]\)/)) {
//         const optionText = line.replace(/^[A-D]\)\s*/, "").trim();
//         if (currentQuestion) currentQuestion.options.push(optionText);
//       } else if (line.startsWith("Javob:")) {
//         if (currentQuestion) currentQuestion.answer = line.replace("Javob:", "").trim();
//       }
//     });
//     if (currentQuestion) questions.push(currentQuestion);
//     return questions;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMsg("");

//     if (!title) return setErrorMsg("Test nomini yozing");
    
//     const parsedQuestions = parseQuestions(rawText);
//     if (parsedQuestions.length === 0) return setErrorMsg("Savollarni to'g'ri formatda kiriting");

//     setIsLoading(true);

//     try {
//       const res = await fetch("/api/tests", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           blockId,
//           title,
//           visibility,
//           format,
//           questions: parsedQuestions,
//           questionCount: parsedQuestions.length,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         // Muvaffaqiyatli bo'lsa ortga qaytaramiz
//         router.push(`/dashboard/block/${blockId}`);
//         router.refresh();
//       } else {
//         // XATOLIK BO'LSA POP-UP KO'RSATAMIZ
//         setErrorMsg(data.message || "Xatolik yuz berdi");
//       }
//     } catch (err) {
//       setErrorMsg("Server bilan ulanishda xato");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4 sm:p-8 mt-4">
//       <Link href={`/dashboard/block/${blockId}`} className="text-blue-600 font-bold mb-6 block w-fit hover:underline">
//         ← Orqaga qaytish
//       </Link>
      
//       <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
//         <h1 className="text-3xl font-black text-gray-900 mb-8">Yangi Test Yaratish 📝</h1>

//         {/* XATOLIK POP-UPI */}
//         {errorMsg && (
//           <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 font-bold border border-red-100 flex items-center gap-3 animate-pop">
//             <span className="text-2xl">⚠️</span> {errorMsg}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-bold text-gray-700 mb-2">Test sarlavhasi</label>
//               <input 
//                 type="text" 
//                 value={title} 
//                 onChange={(e) => setTitle(e.target.value)} 
//                 placeholder="Masalan: 1-Mavzu yuzasidan" 
//                 className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium" 
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-bold text-gray-700 mb-2">Kimlar ko'ra oladi?</label>
//               <select 
//                 value={visibility} 
//                 onChange={(e) => setVisibility(e.target.value)} 
//                 className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium cursor-pointer"
//               >
//                 <option value="Private">🔒 Shaxsiy (Faqat men)</option>
//                 <option value="Public">🌍 Ommaviy (Hamma)</option>
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-2">Savollar matni (TXT formatda)</label>
//             <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm mb-3 border border-blue-100 font-medium">
//               Kiritish formati:<br/>
//               1. Savol matni<br/>
//               A) Variant 1<br/>
//               B) Variant 2<br/>
//               Javob: Variant 1 (To'g'ri javob matni)
//             </div>
//             <textarea 
//               value={rawText} 
//               onChange={(e) => setRawText(e.target.value)} 
//               rows="10" 
//               className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium resize-y" 
//               placeholder="Savollarni shu yerga tashlang..."
//             ></textarea>
//           </div>

//           <button 
//             type="submit" 
//             disabled={isLoading} 
//             className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-all shadow-md text-lg active:scale-95 disabled:opacity-50"
//           >
//             {isLoading ? "Saqlanmoqda..." : "Saqlash va Yaratish"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function CreateTest() {
  const router = useRouter();
  const params = useParams();
  const blockId = params.id;

  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("Private");
  const [format, setFormat] = useState("txt");
  const [rawText, setRawText] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); 

  const parseQuestions = (text) => {
    const lines = text.split("\n").filter(line => line.trim() !== "");
    const questions = [];
    let currentQuestion = null;

    lines.forEach(line => {
      if (line.match(/^\d+\./)) {
        if (currentQuestion) questions.push(currentQuestion);
        currentQuestion = { text: line.replace(/^\d+\.\s*/, "").trim(), options: [], answer: "" };
      } else if (line.match(/^[A-D]\)/)) {
        const optionText = line.replace(/^[A-D]\)\s*/, "").trim();
        if (currentQuestion) currentQuestion.options.push(optionText);
      } else if (line.startsWith("Javob:")) {
        if (currentQuestion) currentQuestion.answer = line.replace("Javob:", "").trim();
      }
    });
    if (currentQuestion) questions.push(currentQuestion);
    return questions;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title) return setErrorMsg("Test nomini yozing");
    
    const parsedQuestions = parseQuestions(rawText);
    if (parsedQuestions.length === 0) return setErrorMsg("Savollarni to'g'ri formatda kiriting");

    setIsLoading(true);

    try {
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blockId,
          title,
          visibility,
          format,
          questions: parsedQuestions,
          questionCount: parsedQuestions.length,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/dashboard/block/${blockId}`);
        router.refresh();
      } else {
        setErrorMsg(data.message || "Xatolik yuz berdi");
      }
    } catch (err) {
      setErrorMsg("Server bilan ulanishda xato");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 mt-4">
      <Link href={`/dashboard/block/${blockId}`} className="text-blue-600 font-bold mb-6 block w-fit hover:underline">
        ← Orqaga qaytish
      </Link>
      
      <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Yangi Test Yaratish 📝</h1>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 font-bold border border-red-100 flex items-center gap-3 animate-pop">
            <span className="text-2xl">⚠️</span> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Test sarlavhasi</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Masalan: 1-Mavzu yuzasidan" 
                className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kimlar ko'ra oladi?</label>
              <select 
                value={visibility} 
                onChange={(e) => setVisibility(e.target.value)} 
                className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium cursor-pointer"
              >
                <option value="Private">🔒 Shaxsiy (Faqat men)</option>
                <option value="Public">🌍 Ommaviy (Hamma)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Savollar matni (TXT formatda)</label>
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm mb-3 border border-blue-100 font-medium">
              Kiritish formati:<br/>
              1. Savol matni<br/>
              A) Variant 1<br/>
              B) Variant 2<br/>
              Javob: Variant 1 (To'g'ri javob matni)
            </div>
            <textarea 
              value={rawText} 
              onChange={(e) => setRawText(e.target.value)} 
              rows="10" 
              className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium resize-y custom-scrollbar placeholder:text-gray-400/80" 
              placeholder={`[JSON Formati]:\n[\n  {\n    "question": "O'zbekiston poytaxti?",\n    "options": ["Toshkent", "Samarqand"],\n    "answer": "Toshkent"\n  }\n]\n\nYOKI [TXT Formati]:\n1. O'zbekiston poytaxti?\nA) Toshkent\nB) Samarqand\nJavob: Toshkent`}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-all shadow-md text-lg active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Saqlanmoqda..." : "Saqlash va Yaratish"}
          </button>
        </form>
      </div>
    </div>
  );
}