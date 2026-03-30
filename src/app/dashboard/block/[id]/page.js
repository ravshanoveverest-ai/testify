// "use client";
// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";

// export default function BlockDetails() {
//   const { data: session, status } = useSession();
//   const params = useParams();
//   const router = useRouter();
//   const blockId = params.blockId || params.id;

//   const [block, setBlock] = useState(null);
//   const [tests, setTests] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // MODAL STATE
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

//   // YANGI TEST YARATISH STATE'LARI
//   const [title, setTitle] = useState("");
//   const [visibility, setVisibility] = useState("Public");
//   const [rawQuestions, setRawQuestions] = useState("");
  
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // 1. BLOK VA TESTLARNI YUKLASH
//   const fetchBlockData = async () => {
//     if (!blockId) return;
//     try {
//       const blockRes = await fetch(`/api/blocks?id=${blockId}`);
//       if (blockRes.ok) {
//         const blockData = await blockRes.json();
//         if (blockData.block) {
//            setBlock(blockData.block);
//         } else if (Array.isArray(blockData.blocks)) {
//            const foundBlock = blockData.blocks.find(b => b._id === blockId);
//            setBlock(foundBlock || null);
//         }
//       }

//       const testsRes = await fetch(`/api/tests?blockId=${blockId}`);
//       if (testsRes.ok) {
//          const testsData = await testsRes.json();
//          setTests(testsData.tests || []);
//       }
      
//     } catch (err) {
//       console.log("Ma'lumotlarni yuklashda xato", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/login");
//     } else if (status === "authenticated" && blockId) {
//       fetchBlockData();
//     }
//   }, [status, blockId, router]);

//   // 2. SAVOLLARNI PARS QILISH (TXT VA JSON)
//   const parseQuestions = (inputText) => {
//     const text = inputText.trim();
//     if (!text) return [];

//     try {
//       const parsedJson = JSON.parse(text);
//       if (Array.isArray(parsedJson)) {
//         let isValid = true;
//         const formattedQuestions = parsedJson.map((q) => {
//           if (!q.question || !Array.isArray(q.options) || !q.answer) isValid = false;
//           return { text: q.question, options: q.options, answer: q.answer };
//         });
//         if (isValid && formattedQuestions.length > 0) return formattedQuestions;
//       }
//     } catch (error) {}

//     const lines = text.split("\n").map(line => line.trim()).filter(line => line !== "");
//     const questions = [];
//     let currentQuestion = null;

//     for (let i = 0; i < lines.length; i++) {
//       const line = lines[i];
//       if (/^\d+[\.\)]/.test(line)) {
//         if (currentQuestion && currentQuestion.text && currentQuestion.options.length >= 2 && currentQuestion.answer) {
//           questions.push(currentQuestion);
//         }
//         currentQuestion = { text: line.replace(/^\d+[\.\)]\s*/, ""), options: [], answer: "" };
//       } 
//       else if (/^[A-Da-d][\)\.]/.test(line)) {
//         if (currentQuestion) currentQuestion.options.push(line.replace(/^[A-Da-d][\)\.]\s*/, ""));
//       } 
//       else if (/^Javob:/i.test(line)) {
//         if (currentQuestion) currentQuestion.answer = line.replace(/^Javob:\s*/i, "");
//       }
//     }

//     if (currentQuestion && currentQuestion.text && currentQuestion.options.length >= 2 && currentQuestion.answer) {
//       questions.push(currentQuestion);
//     }

//     return questions;
//   };

//   // 3. TEST YARATISH (SUBMIT)
//   const handleCreateTest = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!title.trim()) return setError("Test sarlavhasini kiriting!");
//     const parsedQuestions = parseQuestions(rawQuestions);
//     if (parsedQuestions.length === 0) return setError("Savollarni to'g'ri formatda kiriting (TXT yoki JSON)");

//     setIsSubmitting(true);

//     try {
//       const res = await fetch("/api/tests", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ title, visibility, blockId, questions: parsedQuestions }),
//       });

//       if (res.ok) {
//         setTitle("");
//         setRawQuestions("");
//         setVisibility("Public");
//         fetchBlockData();
//         setIsCreateModalOpen(false); // Modalni yopish
//       } else {
//         const data = await res.json();
//         setError(data.message || "Xatolik yuz berdi");
//       }
//     } catch (err) {
//       setError("Server xatosi. Qaytadan urinib ko'ring.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // 4. TESTNI O'CHIRISH
//   const handleDeleteTest = async (testId) => {
//     if (!confirm("Bu testni o'chirib yubormoqchimisiz?")) return;
//     try {
//       const res = await fetch(`/api/tests?id=${testId}`, { method: "DELETE" });
//       if (res.ok) fetchBlockData();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   if (isLoading || status === "loading") {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[70vh]">
//         <div className="w-14 h-14 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
//         <p className="font-bold text-gray-400 text-lg">Yuklanmoqda...</p>
//       </div>
//     );
//   }

//   if (!block) {
//     return (
//       <div className="text-center p-20">
//         <h1 className="text-3xl font-black text-gray-800">Blok topilmadi!</h1>
//         <Link href="/dashboard" className="text-blue-600 font-bold mt-4 inline-block hover:underline">Orqaga qaytish</Link>
//       </div>
//     );
//   }

//   // TESTLARNI IKKIGA AJRATAMIZ
//   const publicTests = tests.filter(test => test.visibility === "Public");
//   const privateTests = tests.filter(test => test.visibility === "Private");

//   return (
//     <div className="max-w-6xl mx-auto p-4 sm:p-6 mt-4">
      
//       {/* HEADER QISMI VA TUGMA */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
//         <div>
//           <Link href="/dashboard" className="text-gray-400 font-bold hover:text-blue-600 transition-colors text-sm mb-2 inline-block">
//             &larr; Bloklarga qaytish
//           </Link>
//           <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center gap-3 mt-1">
//             <span className="text-4xl">{block.icon}</span> {block.name}
//           </h1>
//         </div>
//         <button 
//           onClick={() => setIsCreateModalOpen(true)}
//           className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black hover:bg-blue-700 transition-all shadow-md active:scale-95 flex items-center gap-2 whitespace-nowrap"
//         >
//           <span className="text-xl">+</span> Yangi test yaratish
//         </button>
//       </div>

//       <div className="space-y-12">
//         {/* ========================================= */}
//         {/* OMMAVIY TESTLAR (PUBLIC) */}
//         {/* ========================================= */}
//         <section>
//           <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
//             🌍 Ommaviy Testlar <span className="text-sm font-bold bg-blue-100 text-blue-600 px-3 py-1 rounded-full ml-2">{publicTests.length}</span>
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {publicTests.length > 0 ? (
//               publicTests.map((test) => (
//                 <div key={test._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group flex flex-col justify-between h-full">
//                   <div className="mb-4">
//                     <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">{test.title}</h3>
//                     <p className="text-sm text-gray-500 font-medium">{test.questionCount} ta savol • Barchaga ochiq</p>
//                   </div>
//                   <div className="flex flex-wrap gap-2 mt-auto">
//                     <Link href={`/test/${test._id}`} className="flex-1 bg-gray-900 text-white text-center px-4 py-2.5 rounded-xl font-bold hover:bg-black transition-colors text-sm">
//                       Ishlash
//                     </Link>
//                     <button onClick={() => alert("Tahrirlash funksiyasi tez kunda qo'shiladi!")} className="px-4 py-2.5 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 font-bold rounded-xl transition-colors text-sm">
//                       Tahrirlash
//                     </button>
//                     <button onClick={() => handleDeleteTest(test._id)} className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl transition-colors text-sm">
//                       O'chirish
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-full p-10 bg-white rounded-[2rem] border border-dashed border-gray-200 text-center">
//                 <p className="text-gray-500 font-bold">Ommaviy testlar mavjud emas.</p>
//               </div>
//             )}
//           </div>
//         </section>

//         {/* ========================================= */}
//         {/* SHAXSIY TESTLAR (PRIVATE) */}
//         {/* ========================================= */}
//         <section>
//           <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
//             🔒 Shaxsiy Testlar <span className="text-sm font-bold bg-orange-100 text-orange-600 px-3 py-1 rounded-full ml-2">{privateTests.length}</span>
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {privateTests.length > 0 ? (
//               privateTests.map((test) => (
//                 <div key={test._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group flex flex-col justify-between h-full opacity-90">
//                   <div className="mb-4">
//                     <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">{test.title}</h3>
//                     <p className="text-sm text-gray-500 font-medium">{test.questionCount} ta savol • Faqat o'zingiz uchun</p>
//                   </div>
//                   <div className="flex flex-wrap gap-2 mt-auto">
//                     <Link href={`/test/${test._id}`} className="flex-1 bg-gray-900 text-white text-center px-4 py-2.5 rounded-xl font-bold hover:bg-black transition-colors text-sm">
//                       Ishlash
//                     </Link>
//                     <button onClick={() => alert("Tahrirlash funksiyasi tez kunda qo'shiladi!")} className="px-4 py-2.5 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 font-bold rounded-xl transition-colors text-sm">
//                       Tahrirlash
//                     </button>
//                     <button onClick={() => handleDeleteTest(test._id)} className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl transition-colors text-sm">
//                       O'chirish
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-full p-10 bg-white rounded-[2rem] border border-dashed border-gray-200 text-center">
//                 <p className="text-gray-500 font-bold">Shaxsiy testlar mavjud emas.</p>
//               </div>
//             )}
//           </div>
//         </section>
//       </div>

//       {/* ================================================= */}
//       {/* YANGI TEST YARATISH MODALI (POP-UP) */}
//       {/* ================================================= */}
//       {isCreateModalOpen && (
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-overlay overflow-y-auto">
//           <div className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-pop relative my-8">
            
//             <button 
//               onClick={() => setIsCreateModalOpen(false)}
//               className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold transition-colors"
//             >
//               ✕
//             </button>

//             <h2 className="text-2xl font-black text-gray-900 mb-6 pr-10">Yangi Test Yaratish 📝</h2>
            
//             {error && (
//               <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2">
//                 <span>⚠️</span> {error}
//               </div>
//             )}

//             <form onSubmit={handleCreateTest} className="space-y-6">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 mb-2">Test sarlavhasi</label>
//                   <input 
//                     type="text" 
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     placeholder="Masalan: Tarix 1-qism" 
//                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 font-bold text-gray-800 outline-none transition-all"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 mb-2">Kimlar ko'ra oladi?</label>
//                   <select 
//                     value={visibility}
//                     onChange={(e) => setVisibility(e.target.value)}
//                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 font-bold text-gray-800 outline-none transition-all"
//                   >
//                     <option value="Public">🌍 Ommaviy (Hamma)</option>
//                     <option value="Private">🔒 Shaxsiy (Faqat men)</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-2">Savollar matni (TXT yoki JSON)</label>
                
//                 <div className="bg-blue-50 p-4 rounded-xl mb-3 border border-blue-100 text-sm">
//                   <p className="font-bold text-blue-700 mb-2">JSON formati namunasi:</p>
//                   <pre className="text-blue-600 text-xs overflow-x-auto whitespace-pre-wrap font-mono">
// {`[
//   {
//     "question": "O'zbekiston poytaxti qayer?",
//     "options": ["Samarqand", "Buxoro", "Toshkent", "Xiva"],
//     "answer": "Toshkent"
//   }
// ]`}
//                   </pre>
//                 </div>

//                 <textarea 
//                   rows="8" 
//                   value={rawQuestions}
//                   onChange={(e) => setRawQuestions(e.target.value)}
//                   placeholder="Bu yerga TXT yoki JSON formatda savollarni tashlang..." 
//                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium text-gray-800 outline-none transition-all resize-y custom-scrollbar"
//                 ></textarea>
//               </div>

//               <div className="flex gap-3 pt-2">
//                 <button 
//                   type="button" 
//                   onClick={() => setIsCreateModalOpen(false)}
//                   className="w-full sm:w-1/3 bg-gray-100 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors"
//                 >
//                   Bekor qilish
//                 </button>
//                 <button 
//                   type="submit" 
//                   disabled={isSubmitting}
//                   className="w-full sm:w-2/3 bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
//                 >
//                   {isSubmitting ? "Yaratilmoqda..." : "Saqlash va Yaratish"}
//             </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

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

  // MODAL UCHUN STATE ("closed", "create", "edit")
  const [modalMode, setModalMode] = useState("closed");
  const [editingTestId, setEditingTestId] = useState(null); // Qaysi test tahrirlanyapti?

  // FORM STATELARI
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("Public");
  const [rawQuestions, setRawQuestions] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. YUKLASH
  const fetchBlockData = async () => {
    if (!blockId) return;
    try {
      const blockRes = await fetch(`/api/blocks?id=${blockId}`);
      if (blockRes.ok) {
        const blockData = await blockRes.json();
        if (blockData.block) setBlock(blockData.block);
        else if (Array.isArray(blockData.blocks)) {
           const foundBlock = blockData.blocks.find(b => b._id === blockId);
           setBlock(foundBlock || null);
        }
      }

      const testsRes = await fetch(`/api/tests?blockId=${blockId}`);
      if (testsRes.ok) {
         const testsData = await testsRes.json();
         setTests(testsData.tests || []);
      }
    } catch (err) {
      console.log("Xato", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (status === "authenticated" && blockId) fetchBlockData();
  }, [status, blockId, router]);

  // 2. PARSER
  const parseQuestions = (inputText) => {
    const text = inputText.trim();
    if (!text) return [];

    try {
      const parsedJson = JSON.parse(text);
      if (Array.isArray(parsedJson)) {
        let isValid = true;
        const formattedQuestions = parsedJson.map((q) => {
          if (!q.question || !Array.isArray(q.options) || !q.answer) isValid = false;
          return { text: q.question, options: q.options, answer: q.answer };
        });
        if (isValid && formattedQuestions.length > 0) return formattedQuestions;
      }
    } catch (error) {}

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
        if (currentQuestion) currentQuestion.options.push(line.replace(/^[A-Da-d][\)\.]\s*/, ""));
      } 
      else if (/^Javob:/i.test(line)) {
        if (currentQuestion) currentQuestion.answer = line.replace(/^Javob:\s*/i, "");
      }
    }

    if (currentQuestion && currentQuestion.text && currentQuestion.options.length >= 2 && currentQuestion.answer) {
      questions.push(currentQuestion);
    }

    return questions;
  };

  // 3. MODALNI OCHISH (YARATISH UCHUN)
  const openCreateModal = () => {
    setError(""); setSuccess("");
    setTitle(""); setVisibility("Public"); setRawQuestions("");
    setEditingTestId(null);
    setModalMode("create");
  };

  // 4. MODALNI OCHISH (TAHRIRLASH UCHUN)
  const openEditModal = (test) => {
    setError(""); setSuccess("");
    setTitle(test.title);
    setVisibility(test.visibility);
    setEditingTestId(test._id);

    // Bazadagi test ma'lumotlarini yana chiroyli JSON holatiga qaytaramiz (O'zgartirish oson bo'lishi uchun)
    const formatForEdit = test.questions?.map(q => ({
      question: q.text,
      options: q.options,
      answer: q.answer
    })) || [];

    setRawQuestions(JSON.stringify(formatForEdit, null, 2));
    setModalMode("edit");
  };

  // 5. SAQLASH (CREATE VA EDIT UCHUN UMUMIY)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!title.trim()) return setError("Test sarlavhasini kiriting!");
    const parsedQuestions = parseQuestions(rawQuestions);
    if (parsedQuestions.length === 0) return setError("Savollarni to'g'ri formatda kiriting (TXT yoki JSON)");

    setIsSubmitting(true);

    try {
      const url = "/api/tests";
      const method = modalMode === "edit" ? "PUT" : "POST"; // Modega qarab API ga jo'natamiz
      const body = {
        title, visibility, blockId, questions: parsedQuestions,
        ...(modalMode === "edit" && { id: editingTestId }) // Edit bo'lsa ID ham qoshamiz
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setModalMode("closed");
        fetchBlockData(); // Qayta yuklaymiz
      } else {
        const data = await res.json();
        setError(data.message || "Xatolik yuz berdi");
      }
    } catch (err) {
      setError("Server xatosi. Qaytadan urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. O'CHIRISH
  const handleDeleteTest = async (testId) => {
    if (!confirm("Bu testni o'chirib yubormoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/tests?id=${testId}`, { method: "DELETE" });
      if (res.ok) fetchBlockData();
    } catch (err) {}
  };

  if (isLoading || status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-14 h-14 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      </div>
    );
  }

  if (!block) return <div className="text-center p-20"><h1 className="text-3xl font-black">Blok topilmadi!</h1></div>;

  const publicTests = tests.filter(test => test.visibility === "Public");
  const privateTests = tests.filter(test => test.visibility === "Private");

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 mt-4">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <Link href="/dashboard" className="text-gray-400 font-bold hover:text-blue-600 transition-colors text-sm mb-2 inline-block">
            &larr; Bloklarga qaytish
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center gap-3 mt-1">
            <span className="text-4xl">{block.icon}</span> {block.name}
          </h1>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black hover:bg-blue-700 transition-all shadow-md active:scale-95 flex items-center gap-2 whitespace-nowrap"
        >
          <span className="text-xl">+</span> Yangi test yaratish
        </button>
      </div>

      <div className="space-y-12">
        {/* ========================================= */}
        {/* OMMAVIY TESTLAR */}
        {/* ========================================= */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            🌍 Ommaviy Testlar <span className="text-sm font-bold bg-blue-100 text-blue-600 px-3 py-1 rounded-full ml-2">{publicTests.length}</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publicTests.length > 0 ? (
              publicTests.map((test) => (
                <div key={test._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group flex flex-col justify-between h-full">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">{test.title}</h3>
                    {/* NOL MASHMASHASI MANA SHU YERDA TO'G'IRLANDI 👇 */}
                    <p className="text-sm text-gray-500 font-medium">
                      {test.questions?.length || test.questionCount || 0} ta savol • Barchaga ochiq
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <Link href={`/test/${test._id}`} className="flex-1 bg-gray-900 text-white text-center px-4 py-2.5 rounded-xl font-bold hover:bg-black transition-colors text-sm">Ishlash</Link>
                    <button onClick={() => openEditModal(test)} className="px-4 py-2.5 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 font-bold rounded-xl transition-colors text-sm">Tahrirlash</button>
                    <button onClick={() => handleDeleteTest(test._id)} className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl transition-colors text-sm">O'chirish</button>
                  </div>
                </div>
              ))
            ) : (<div className="col-span-full p-10 bg-white rounded-[2rem] border border-dashed border-gray-200 text-center"><p className="text-gray-500 font-bold">Mavjud emas.</p></div>)}
          </div>
        </section>

        {/* ========================================= */}
        {/* SHAXSIY TESTLAR */}
        {/* ========================================= */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            🔒 Shaxsiy Testlar <span className="text-sm font-bold bg-orange-100 text-orange-600 px-3 py-1 rounded-full ml-2">{privateTests.length}</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {privateTests.length > 0 ? (
              privateTests.map((test) => (
                <div key={test._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group flex flex-col justify-between h-full opacity-90">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">{test.title}</h3>
                    <p className="text-sm text-gray-500 font-medium">{test.questions?.length || test.questionCount || 0} ta savol • Faqat siz uchun</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <Link href={`/test/${test._id}`} className="flex-1 bg-gray-900 text-white text-center px-4 py-2.5 rounded-xl font-bold hover:bg-black transition-colors text-sm">Ishlash</Link>
                    <button onClick={() => openEditModal(test)} className="px-4 py-2.5 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 font-bold rounded-xl transition-colors text-sm">Tahrirlash</button>
                    <button onClick={() => handleDeleteTest(test._id)} className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl transition-colors text-sm">O'chirish</button>
                  </div>
                </div>
              ))
            ) : (<div className="col-span-full p-10 bg-white rounded-[2rem] border border-dashed border-gray-200 text-center"><p className="text-gray-500 font-bold">Mavjud emas.</p></div>)}
          </div>
        </section>
      </div>

      {/* ================================================= */}
      {/* UMUMIY MODAL (YARATISH VA TAHRIRLASH UCHUN) */}
      {/* ================================================= */}
      {modalMode !== "closed" && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-overlay overflow-y-auto">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-pop relative my-8">
            
            <button 
              onClick={() => setModalMode("closed")}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold transition-colors"
            >
              ✕
            </button>

            <h2 className="text-2xl font-black text-gray-900 mb-6 pr-10">
              {modalMode === "edit" ? "Testni Tahrirlash ✏️" : "Yangi Test Yaratish 📝"}
            </h2>
            
            {error && (<div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2"><span>⚠️</span> {error}</div>)}

            <form onSubmit={handleSubmitForm} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Test sarlavhasi</label>
                  <input 
                    type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 font-bold text-gray-800 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kimlar ko'ra oladi?</label>
                  <select 
                    value={visibility} onChange={(e) => setVisibility(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 font-bold text-gray-800 outline-none transition-all"
                  >
                    <option value="Public">🌍 Ommaviy (Hamma)</option>
                    <option value="Private">🔒 Shaxsiy (Faqat men)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Savollar matni (TXT yoki JSON)</label>
                <textarea 
                  rows="10" value={rawQuestions} onChange={(e) => setRawQuestions(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium text-gray-800 outline-none transition-all resize-y custom-scrollbar"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" onClick={() => setModalMode("closed")}
                  className="w-full sm:w-1/3 bg-gray-100 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit" disabled={isSubmitting}
                  className={`w-full sm:w-2/3 text-white font-black py-4 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 ${modalMode === "edit" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {isSubmitting ? "Kutilmoqda..." : modalMode === "edit" ? "O'zgarishlarni saqlash" : "Saqlash va Yaratish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}