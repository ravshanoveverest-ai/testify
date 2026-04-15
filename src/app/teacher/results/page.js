// "use client";
// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";

// export default function TeacherResults() {
//   const [exams, setExams] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedExamId, setSelectedExamId] = useState("");
//   const [studentDetail, setStudentDetail] = useState(null); 
  
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     fetchExams();
//   }, []);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const fetchExams = async () => {
//     try {
//       const res = await fetch("/api/teacher/exams?t=" + new Date().getTime());
//       const data = await res.json();
//       if (res.ok) {
//         setExams(data.exams);
//         if (data.exams.length > 0) setSelectedExamId(data.exams[0]._id);
//       } else {
//         setError(data.message || "Xato yuz berdi");
//       }
//     } catch (err) {
//       setError("Server bilan ulanishda xato");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const downloadCSV = (exam) => {
//     const completedStudents = exam.passcodes.filter(p => p.status === "completed");
//     if (completedStudents.length === 0) return alert("Hali hech kim bu imtihonni topshirmagan!");

//     const maxScore = exam.maxScore || 100;
//     let csvContent = "data:text/csv;charset=utf-8,Ism Familiya,Parol,To'plangan Ball,Maksimal Ball,Foiz\n";

//     completedStudents.sort((a, b) => b.score - a.score).forEach(student => {
//       const percentage = Math.round((student.score / maxScore) * 100);
//       const formattedScore = Number.isInteger(Number(student.score)) ? student.score : Number(student.score).toFixed(1);
//       csvContent += `${student.usedBy},${student.code},${formattedScore},${maxScore},${percentage}%\n`;
//     });

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", `${exam.title.replace(/\s+/g, '_')}_Natijalar.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const formatNum = (num) => {
//     if (!num) return 0;
//     const n = Number(num);
//     return Number.isInteger(n) ? n : Number(n.toFixed(1));
//   };

//   if (isLoading) return <div className="text-center mt-20 font-bold text-gray-500 flex justify-center items-center gap-2"><span className="animate-spin text-xl">⏳</span> Natijalar yuklanmoqda...</div>;

//   const selectedExam = exams.find(e => e._id === selectedExamId);

//   return (
//     <>
//       <style dangerouslySetInnerHTML={{__html: `
//         .custom-horizontal-scroll::-webkit-scrollbar { height: 8px; }
//         .custom-horizontal-scroll::-webkit-scrollbar-track { background: #f8fafc; border-radius: 8px; }
//         .custom-horizontal-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
//         .custom-horizontal-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
//         @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//         .animate-fade-in { animation: 0.3s ease forwards fadeIn; }
//       `}} />

//       {/* ASOSIY SAHIFA */}
//       <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mt-4 animate-pop relative z-10">
        
//         {/* 1. YUQORI QISM VA PREMIUM CUSTOM DROPDOWN */}
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 relative z-20">
//           <div className="flex items-center gap-4">
//             <Link href="/teacher" className="w-12 h-12 flex-shrink-0 bg-white rounded-full flex items-center justify-center font-bold text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors shadow-sm border border-gray-100">&larr;</Link>
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-3"><span>📈</span> Natijalar (HEMIS)</h1>
//               <p className="text-gray-500 font-bold text-xs sm:text-sm mt-1">O'quvchilarning baholari va batafsil javoblari.</p>
//             </div>
//           </div>
          
//           {exams.length > 0 && (
//             <div className="relative w-full lg:w-80 group" ref={dropdownRef}>
//               {/* MANA SHU YERDA Z-INDEX TO'G'RILANDI (z-[12] qilindi) */}
//               <label className="absolute -top-2.5 left-4 bg-[#f8fafc] px-2 text-[10px] font-black text-gray-400 uppercase tracking-wider z-[12] rounded-md">
//                 Imtihonni tanlang
//               </label>
              
//               <div 
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className={`w-full bg-white border-2 flex items-center justify-between text-gray-800 py-3.5 px-5 rounded-2xl font-black text-sm shadow-sm cursor-pointer transition-all select-none relative z-[11] ${isDropdownOpen ? 'border-purple-500 ring-4 ring-purple-500/10' : 'border-gray-200 hover:border-purple-300'}`}
//               >
//                 <span className="truncate pr-4">{selectedExam?.title || "Imtihon tanlang..."}</span>
//                 <svg className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-purple-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//               </div>

//               {isDropdownOpen && (
//                 <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden max-h-60 overflow-y-auto animate-fade-in z-[10]">
//                   <div className="py-2">
//                     {exams.map(exam => (
//                       <div 
//                         key={exam._id} 
//                         onClick={() => { setSelectedExamId(exam._id); setIsDropdownOpen(false); }}
//                         className={`px-5 py-3 cursor-pointer font-bold text-sm transition-colors border-l-4 ${selectedExamId === exam._id ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
//                       >
//                         {exam.title}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold flex items-center gap-2"><span>⚠️</span> {error}</div>}

//         {exams.length === 0 && !error ? (
//           <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 shadow-sm mt-10 relative z-0 animate-fade-in">
//             <span className="text-6xl mb-4 block">📭</span>
//             <h3 className="text-xl font-bold text-gray-800 mb-2">Hali imtihonlar yo'q</h3>
//           </div>
//         ) : (
//           selectedExam && (
//             <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mt-6 flex flex-col relative z-0">
//               <div className="p-5 sm:p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
//                 <div>
//                   <h2 className="text-xl font-black text-gray-900 mb-1 leading-tight break-words">{selectedExam.title}</h2>
//                   <p className="text-sm font-bold text-gray-500">Umumiy: <span className="text-blue-600">{selectedExam.passcodes.filter(p => p.status === "completed").length} kishi topshirdi</span></p>
//                 </div>
//                 <button onClick={() => downloadCSV(selectedExam)} className="bg-green-50 text-green-700 hover:bg-green-100 hover:shadow-sm px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 border border-green-100 w-full sm:w-auto active:scale-95 shrink-0">
//                   <span>📊</span> Excel yuklash
//                 </button>
//               </div>

//               <div className="overflow-x-auto w-full custom-horizontal-scroll">
//                 <table className="w-full text-left border-collapse min-w-[800px]">
//                   <thead className="bg-white border-b border-gray-100">
//                     <tr>
//                       <th className="p-5 font-black text-xs text-gray-400 uppercase tracking-wider w-12">#</th>
//                       <th className="p-5 font-black text-xs text-gray-400 uppercase tracking-wider">Ism Familiya</th>
//                       <th className="p-5 font-black text-xs text-gray-400 uppercase tracking-wider text-center">Parol</th>
//                       <th className="p-5 font-black text-xs text-gray-400 uppercase tracking-wider text-center">To'plangan Ball</th>
//                       <th className="p-5 font-black text-xs text-gray-400 uppercase tracking-wider text-center">Foiz (HEMIS)</th>
//                       <th className="p-5 font-black text-xs text-gray-400 uppercase tracking-wider text-center">Batafsil</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-50">
//                     {selectedExam.passcodes
//                       .filter(p => p.status === "completed")
//                       .sort((a, b) => b.score - a.score)
//                       .map((pass, index) => {
//                         const maxScore = selectedExam.maxScore || 100;
//                         const percentage = Math.round((pass.score / maxScore) * 100);
                        
//                         let badgeColor = "bg-green-100 text-green-700";
//                         if (percentage < 60) badgeColor = "bg-blue-100 text-blue-700";
//                         if (percentage < 40) badgeColor = "bg-red-100 text-red-700";

//                         return (
//                           <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
//                             <td className="p-5 font-bold text-gray-400">{index + 1}</td>
//                             <td className="p-5">
//                               <button onClick={() => setStudentDetail(pass)} className="font-black text-blue-600 hover:text-blue-800 hover:underline decoration-blue-300 transition-colors text-lg whitespace-nowrap break-words">
//                                 {pass.usedBy}
//                               </button>
//                             </td>
//                             <td className="p-5 text-center">
//                               <span className="font-mono text-xs font-black bg-gray-100 px-3 py-1.5 rounded-lg text-gray-500 tracking-widest">{pass.code}</span>
//                             </td>
//                             <td className="p-5 text-center">
//                               <p className="font-black text-gray-900 text-xl whitespace-nowrap">
//                                 {formatNum(pass.score)} <span className="text-sm text-gray-400 font-bold">/ {maxScore}</span>
//                               </p>
//                             </td>
//                             <td className="p-5 text-center">
//                               <span className={`px-4 py-1.5 rounded-xl text-sm font-black min-w-[70px] inline-block ${badgeColor}`}>{percentage}%</span>
//                             </td>
//                             <td className="p-5 text-center">
//                               <button onClick={() => setStudentDetail(pass)} className="bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-sm active:scale-95 whitespace-nowrap">
//                                 Javoblar
//                               </button>
//                             </td>
//                           </tr>
//                         )
//                       })}
//                     {selectedExam.passcodes.filter(p => p.status === "completed").length === 0 && (
//                       <tr>
//                         <td colSpan="6" className="p-10 text-center font-bold text-gray-400 bg-gray-50/30">
//                           Hali hech kim imtihonni topshirmagan.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )
//         )}
//       </div>

//       {/* MODAL OYNASI */}
//       {studentDetail && (
//         <div className="fixed inset-0 bg-black/60 z-[99999] flex items-start justify-center p-4 sm:p-6 pb-10 backdrop-blur-sm animate-fade-in pt-24 sm:pt-28">
          
//           <div className="bg-white rounded-[2rem] p-5 sm:p-8 max-w-4xl w-full shadow-2xl relative flex flex-col h-auto max-h-[calc(100vh-10rem)] animate-pop">
//             <button onClick={() => setStudentDetail(null)} className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-black transition-colors z-10">✕</button>
            
//             <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-6 pr-10 sm:pr-12 shrink-0">
//                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xl sm:text-2xl font-black shrink-0">
//                  {studentDetail.usedBy.charAt(0).toUpperCase()}
//                </div>
//                <div>
//                   <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight break-all">{studentDetail.usedBy}</h2>
//                   <p className="text-gray-500 font-bold text-xs sm:text-sm mt-1 flex flex-wrap items-center gap-2">
//                     <span className="flex items-center">Parol: <span className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded ml-1 tracking-widest">{studentDetail.code}</span></span>
//                     <span className="hidden sm:inline">•</span>
//                     <span className="flex items-center">Umumiy Ball: <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded ml-1 whitespace-nowrap">{formatNum(studentDetail.score)} / {selectedExam.maxScore || 100}</span></span>
//                   </p>
//                </div>
//             </div>

//             <div className="overflow-y-auto custom-scrollbar pr-1 sm:pr-2 flex-1 space-y-4 sm:space-y-6 text-gray-900">
//               {!studentDetail.studentAnswers || Object.keys(studentDetail.studentAnswers).length === 0 ? (
//                 <div className="text-center p-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
//                   <span className="text-4xl mb-3 block">🤷‍♂️</span>
//                   <p className="font-bold text-gray-500 text-lg">Javoblar mavjud emas.</p>
//                 </div>
//               ) : (
//                 Object.entries(studentDetail.studentAnswers).map(([questionId, studentAns], idx) => {
//                   const qObj = selectedExam.questions.find(q => q._id === questionId);
//                   if(!qObj) return null;
//                   const aiFeedback = studentDetail.aiEvaluation ? studentDetail.aiEvaluation[questionId] : null;

//                   return (
//                     <div key={questionId} className="bg-white border border-gray-200 p-5 sm:p-8 rounded-[1.5rem] shadow-sm">
//                       <p className="font-black text-gray-900 text-base sm:text-lg mb-5 flex gap-3 sm:gap-4 leading-relaxed break-words">
//                         <span className="bg-gray-900 text-white w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg sm:rounded-xl flex-shrink-0 text-xs sm:text-sm shadow-sm">{idx + 1}</span>
//                         {qObj.text}
//                       </p>
                      
//                       <div className="space-y-4 pl-0 sm:pl-12">
//                         <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
//                           <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-2"><span>👤</span> O'quvchi javobi:</p>
//                           <p className="font-bold text-sm sm:text-[15px] text-gray-800 leading-relaxed break-words">
//                             {studentAns || <i className="text-gray-400 font-medium">Javob yozilmagan</i>}
//                           </p>
//                         </div>

//                         {selectedExam.examType === "written" && aiFeedback && (
//                           <div className="p-4 sm:p-6 rounded-2xl bg-purple-50 border border-purple-100 relative overflow-hidden">
//                             <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl">🤖</div>
//                             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3 relative z-10">
//                               <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-purple-600 flex items-center gap-2"><span>🤖</span> AI Ekspert xulosasi:</p>
//                               <span className="bg-purple-600 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black shadow-sm self-start sm:self-auto whitespace-nowrap">
//                                 {formatNum(aiFeedback.score)} ball
//                               </span>
//                             </div>
//                             <p className="font-bold text-sm sm:text-[15px] text-purple-900 leading-relaxed relative z-10 italic break-words">
//                               "{aiFeedback.feedback}"
//                             </p>
//                           </div>
//                         )}
                        
//                         <div className="p-4 sm:p-5 rounded-2xl bg-green-50/80 border border-green-100">
//                           <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-green-700 mb-2 flex items-center gap-2"><span>✅</span> To'g'ri javob:</p>
//                           <p className="font-bold text-sm sm:text-[15px] text-green-900 leading-relaxed break-words">{qObj.answer}</p>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>

//             <div className="mt-6 pt-5 border-t border-gray-100 text-right shrink-0">
//               <button onClick={() => setStudentDetail(null)} className="px-8 sm:px-10 py-3.5 sm:py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-black transition-all shadow-lg active:scale-95 w-full sm:w-auto">
//                 Yopish
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function TeacherResults() {
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");
  const [studentDetail, setStudentDetail] = useState(null); 
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchExams = async () => {
    try {
      const res = await fetch("/api/teacher/exams?t=" + new Date().getTime());
      const data = await res.json();
      if (res.ok) {
        setExams(data.exams);
        if (data.exams.length > 0) setSelectedExamId(data.exams[0]._id);
      } else {
        setError(data.message || "Xato yuz berdi");
      }
    } catch (err) {
      setError("Server bilan ulanishda xato");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCSV = (exam) => {
    const completedStudents = exam.passcodes.filter(p => p.status === "completed");
    if (completedStudents.length === 0) return alert("Hali hech kim bu imtihonni topshirmagan!");

    const maxScore = exam.maxScore || 100;
    let csvContent = "data:text/csv;charset=utf-8,Ism Familiya,Parol,To'plangan Ball,Maksimal Ball,Foiz\n";

    completedStudents.sort((a, b) => b.score - a.score).forEach(student => {
      const percentage = Math.round((student.score / maxScore) * 100);
      const formattedScore = Number.isInteger(Number(student.score)) ? student.score : Number(student.score).toFixed(1);
      csvContent += `${student.usedBy},${student.code},${formattedScore},${maxScore},${percentage}%\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${exam.title.replace(/\s+/g, '_')}_Natijalar.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatNum = (num) => {
    if (!num) return 0;
    const n = Number(num);
    return Number.isInteger(n) ? n : Number(n.toFixed(1));
  };

  if (isLoading) {
    return (
      <div className="text-center mt-20 font-bold text-gray-500 flex justify-center items-center gap-2">
        <i className="fi fi-rr-spinner animate-spin text-xl"></i> Natijalar yuklanmoqda...
      </div>
    );
  }

  const selectedExam = exams.find(e => e._id === selectedExamId);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-horizontal-scroll::-webkit-scrollbar { height: 8px; }
        .custom-horizontal-scroll::-webkit-scrollbar-track { background: #f8fafc; border-radius: 8px; }
        .custom-horizontal-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
        .custom-horizontal-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: 0.3s ease forwards fadeIn; }
      `}} />

      {/* ASOSIY SAHIFA */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mt-4 animate-pop relative z-10">
        
        {/* 1. YUQORI QISM VA PREMIUM CUSTOM DROPDOWN */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 relative z-20">
          <div className="flex items-center gap-4">
            <Link href="/teacher" className="w-12 h-12 flex-shrink-0 bg-white rounded-full flex items-center justify-center font-bold text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors shadow-sm border border-gray-100">
              <i className="fi fi-rr-arrow-left translate-y-[1px]"></i>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-3">
                <i className="fi fi-rr-chart-histogram text-purple-600"></i> Natijalar (HEMIS)
              </h1>
              <p className="text-gray-500 font-bold text-xs sm:text-sm mt-1">O'quvchilarning baholari va batafsil javoblari.</p>
            </div>
          </div>
          
          {exams.length > 0 && (
            <div className="relative w-full lg:w-80 group" ref={dropdownRef}>
              <label className="absolute -top-2.5 left-4 bg-[#f8fafc] px-2 text-[10px] font-black text-gray-400 uppercase tracking-wider z-[12] rounded-md">
                Imtihonni tanlang
              </label>
              
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full bg-white border-2 flex items-center justify-between text-gray-800 py-3.5 px-5 rounded-2xl font-black text-sm shadow-sm cursor-pointer transition-all select-none relative z-[11] ${isDropdownOpen ? 'border-purple-500 ring-4 ring-purple-500/10' : 'border-gray-200 hover:border-purple-300'}`}
              >
                <span className="truncate pr-4 flex items-center gap-2">
                  <i className="fi fi-rr-document"></i> {selectedExam?.title || "Imtihon tanlang..."}
                </span>
                <i className={`fi fi-rr-angle-down flex-shrink-0 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-purple-500' : 'text-gray-400'}`}></i>
              </div>

              {isDropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden max-h-60 overflow-y-auto animate-fade-in z-[10] custom-scrollbar">
                  <div className="py-2">
                    {exams.map(exam => (
                      <div 
                        key={exam._id} 
                        onClick={() => { setSelectedExamId(exam._id); setIsDropdownOpen(false); }}
                        className={`px-5 py-3 cursor-pointer font-bold text-sm transition-colors border-l-4 ${selectedExamId === exam._id ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                      >
                        {exam.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold flex items-center gap-2">
            <i className="fi fi-rr-exclamation"></i> {error}
          </div>
        )}

        {exams.length === 0 && !error ? (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 shadow-sm mt-10 relative z-0 animate-fade-in">
            <span className="text-4xl mb-4 block text-gray-300">
              <i className="fi fi-rr-folder-open"></i>
            </span>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Hali imtihonlar yo'q</h3>
          </div>
        ) : (
          selectedExam && (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mt-6 flex flex-col relative z-0">
              <div className="p-5 sm:p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-1 leading-tight break-words">{selectedExam.title}</h2>
                  <p className="text-sm font-bold text-gray-500">
                    Umumiy: <span className="text-blue-600">{selectedExam.passcodes.filter(p => p.status === "completed").length} kishi topshirdi</span>
                  </p>
                </div>
                <button onClick={() => downloadCSV(selectedExam)} className="bg-green-50 text-green-700 hover:bg-green-100 hover:shadow-sm px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 border border-green-100 w-full sm:w-auto active:scale-95 shrink-0">
                  <i className="fi fi-rr-file-excel"></i> Excel yuklash
                </button>
              </div>

              <div className="overflow-x-auto w-full custom-horizontal-scroll">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="bg-white border-b border-gray-100">
                    <tr>
                      <th className="p-5 font-black text-xs text-gray-400 uppercase tracking-wider w-12">#</th>
                      <th className="p-5 font-black text-xs text-gray-400 uppercase tracking-wider">Ism Familiya</th>
                      <th className="p-5 font-black text-xs text-gray-400 uppercase tracking-wider text-center">Parol</th>
                      <th className="p-5 font-black text-xs text-gray-400 uppercase tracking-wider text-center">To'plangan Ball</th>
                      <th className="p-5 font-black text-xs text-gray-400 uppercase tracking-wider text-center">Foiz (HEMIS)</th>
                      <th className="p-5 font-black text-xs text-gray-400 uppercase tracking-wider text-center">Batafsil</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {selectedExam.passcodes
                      .filter(p => p.status === "completed")
                      .sort((a, b) => b.score - a.score)
                      .map((pass, index) => {
                        const maxScore = selectedExam.maxScore || 100;
                        const percentage = Math.round((pass.score / maxScore) * 100);
                        
                        let badgeColor = "bg-green-100 text-green-700";
                        if (percentage < 60) badgeColor = "bg-blue-100 text-blue-700";
                        if (percentage < 40) badgeColor = "bg-red-100 text-red-700";

                        return (
                          <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="p-5 font-bold text-gray-400">{index + 1}</td>
                            <td className="p-5">
                              <button onClick={() => setStudentDetail(pass)} className="font-black text-blue-600 hover:text-blue-800 hover:underline decoration-blue-300 transition-colors text-lg whitespace-nowrap break-words flex items-center gap-2">
                                <i className="fi fi-rr-user text-sm text-blue-400"></i> {pass.usedBy}
                              </button>
                            </td>
                            <td className="p-5 text-center">
                              <span className="font-mono text-xs font-black bg-gray-100 px-3 py-1.5 rounded-lg text-gray-500 tracking-widest">{pass.code}</span>
                            </td>
                            <td className="p-5 text-center">
                              <p className="font-black text-gray-900 text-xl whitespace-nowrap">
                                {formatNum(pass.score)} <span className="text-sm text-gray-400 font-bold">/ {maxScore}</span>
                              </p>
                            </td>
                            <td className="p-5 text-center">
                              <span className={`px-4 py-1.5 rounded-xl text-sm font-black min-w-[70px] inline-block ${badgeColor}`}>{percentage}%</span>
                            </td>
                            <td className="p-5 text-center">
                              <button onClick={() => setStudentDetail(pass)} className="bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-sm active:scale-95 whitespace-nowrap flex items-center gap-2 mx-auto">
                                <i className="fi fi-rr-eye"></i> Javoblar
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    {selectedExam.passcodes.filter(p => p.status === "completed").length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-10 text-center font-bold text-gray-400 bg-gray-50/30">
                          <i className="fi fi-rr-box text-3xl mb-2 block"></i>
                          Hali hech kim imtihonni topshirmagan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>

      {/* MODAL OYNASI */}
      {studentDetail && (
        <div className="fixed inset-0 bg-black/60 z-[99999] flex items-start justify-center p-4 sm:p-6 pb-10 backdrop-blur-sm animate-fade-in pt-24 sm:pt-28">
          
          <div className="bg-white rounded-[2rem] p-5 sm:p-8 max-w-4xl w-full shadow-2xl relative flex flex-col h-auto max-h-[calc(100vh-10rem)] animate-pop">
            <button onClick={() => setStudentDetail(null)} className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-black transition-colors z-10">
              <i className="fi fi-rr-cross-small text-xl translate-y-[1px]"></i>
            </button>
            
            <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-6 pr-10 sm:pr-12 shrink-0">
               <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xl sm:text-2xl font-black shrink-0">
                 {studentDetail.usedBy.charAt(0).toUpperCase()}
               </div>
               <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight break-all">{studentDetail.usedBy}</h2>
                  <p className="text-gray-500 font-bold text-xs sm:text-sm mt-1 flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1"><i className="fi fi-rr-key text-gray-400"></i> Parol: <span className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded tracking-widest">{studentDetail.code}</span></span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1"><i className="fi fi-rr-star text-blue-400"></i> Umumiy Ball: <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded whitespace-nowrap">{formatNum(studentDetail.score)} / {selectedExam.maxScore || 100}</span></span>
                  </p>
               </div>
            </div>

            <div className="overflow-y-auto custom-scrollbar pr-1 sm:pr-2 flex-1 space-y-4 sm:space-y-6 text-gray-900">
              {!studentDetail.studentAnswers || Object.keys(studentDetail.studentAnswers).length === 0 ? (
                <div className="text-center p-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <span className="text-4xl mb-3 block text-gray-300">
                    <i className="fi fi-rr-box-open-full"></i>
                  </span>
                  <p className="font-bold text-gray-500 text-lg">Javoblar mavjud emas.</p>
                </div>
              ) : (
                Object.entries(studentDetail.studentAnswers).map(([questionId, studentAns], idx) => {
                  const qObj = selectedExam.questions.find(q => q._id === questionId);
                  if(!qObj) return null;
                  const aiFeedback = studentDetail.aiEvaluation ? studentDetail.aiEvaluation[questionId] : null;

                  return (
                    <div key={questionId} className="bg-white border border-gray-200 p-5 sm:p-8 rounded-[1.5rem] shadow-sm">
                      <p className="font-black text-gray-900 text-base sm:text-lg mb-5 flex gap-3 sm:gap-4 leading-relaxed break-words">
                        <span className="bg-gray-900 text-white w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg sm:rounded-xl flex-shrink-0 text-xs sm:text-sm shadow-sm">{idx + 1}</span>
                        {qObj.text}
                      </p>
                      
                      <div className="space-y-4 pl-0 sm:pl-12">
                        <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
                          <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-2">
                            <i className="fi fi-rr-user-pen"></i> O'quvchi javobi:
                          </p>
                          <p className="font-bold text-sm sm:text-[15px] text-gray-800 leading-relaxed break-words">
                            {studentAns || <i className="text-gray-400 font-medium">Javob yozilmagan</i>}
                          </p>
                        </div>

                        {selectedExam.examType === "written" && aiFeedback && (
                          <div className="p-4 sm:p-6 rounded-2xl bg-purple-50 border border-purple-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl">
                              <i className="fi fi-rr-robot"></i>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3 relative z-10">
                              <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-purple-600 flex items-center gap-2">
                                <i className="fi fi-rr-robot"></i> AI Ekspert xulosasi:
                              </p>
                              <span className="bg-purple-600 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black shadow-sm self-start sm:self-auto whitespace-nowrap">
                                {formatNum(aiFeedback.score)} ball
                              </span>
                            </div>
                            <p className="font-bold text-sm sm:text-[15px] text-purple-900 leading-relaxed relative z-10 italic break-words">
                              "{aiFeedback.feedback}"
                            </p>
                          </div>
                        )}
                        
                        <div className="p-4 sm:p-5 rounded-2xl bg-green-50/80 border border-green-100">
                          <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-green-700 mb-2 flex items-center gap-2">
                            <i className="fi fi-rr-check-circle"></i> To'g'ri javob:
                          </p>
                          <p className="font-bold text-sm sm:text-[15px] text-green-900 leading-relaxed break-words">{qObj.answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 text-right shrink-0">
              <button onClick={() => setStudentDetail(null)} className="px-8 sm:px-10 py-3.5 sm:py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-black transition-all shadow-lg active:scale-95 w-full sm:w-auto flex justify-center items-center gap-2">
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}