"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function TeacherResults() {
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");
  
  const [studentDetail, setStudentDetail] = useState(null); 

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await fetch("/api/teacher/exams");
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
      csvContent += `${student.usedBy},${student.code},${student.score},${maxScore},${percentage}%\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${exam.title.replace(/\s+/g, '_')}_Natijalar.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) return <div className="text-center mt-20 font-bold text-gray-500">Natijalar yuklanmoqda...</div>;

  const selectedExam = exams.find(e => e._id === selectedExamId);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mt-4 animate-pop">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/teacher" className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors shadow-sm">&larr;</Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2"><span>📈</span> Natijalar (HEMIS)</h1>
            <p className="text-gray-500 font-medium text-sm mt-1">O'quvchilarning baholari va batafsil javoblari.</p>
          </div>
        </div>
        
        {exams.length > 0 && (
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm min-w-[250px]">
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Imtihonni tanlang</label>
            <select value={selectedExamId} onChange={(e) => setSelectedExamId(e.target.value)} className="w-full bg-transparent font-bold text-gray-800 outline-none cursor-pointer">
              {exams.map(exam => <option key={exam._id} value={exam._id}>{exam.title}</option>)}
            </select>
          </div>
        )}
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold flex items-center gap-2"><span>⚠️</span> {error}</div>}

      {exams.length === 0 && !error ? (
        <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 shadow-sm">
          <span className="text-6xl mb-4 block">📭</span>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Hali imtihonlar yo'q</h3>
        </div>
      ) : (
        selectedExam && (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            
            <div className="p-6 sm:p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-1">{selectedExam.title}</h2>
                <p className="text-sm font-bold text-gray-500">Umumiy: <span className="text-blue-600">{selectedExam.passcodes.filter(p => p.status === "completed").length} kishi topshirdi</span></p>
              </div>
              <button onClick={() => downloadCSV(selectedExam)} className="bg-green-100 hover:bg-green-200 text-green-700 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"><span>📊</span> Excel (CSV) yuklash</button>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white border-b border-gray-100">
                  <tr>
                    <th className="p-5 font-bold text-sm text-gray-400 uppercase">#</th>
                    <th className="p-5 font-bold text-sm text-gray-400 uppercase">Ism Familiya</th>
                    <th className="p-5 font-bold text-sm text-gray-400 uppercase text-center">Parol</th>
                    <th className="p-5 font-bold text-sm text-gray-400 uppercase text-center">To'plangan Ball</th>
                    <th className="p-5 font-bold text-sm text-gray-400 uppercase text-center">Foiz (HEMIS)</th>
                    <th className="p-5 font-bold text-sm text-gray-400 uppercase text-center">Batafsil</th>
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
                          <td className="p-5 cursor-pointer" onClick={() => setStudentDetail(pass)}>
                            <p className="font-black text-blue-600 underline decoration-blue-300 hover:text-blue-800 transition-colors">{pass.usedBy}</p>
                          </td>
                          <td className="p-5 text-center"><span className="font-mono text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-500 tracking-widest">{pass.code}</span></td>
                          <td className="p-5 text-center">
                            <p className="font-black text-gray-800 text-lg">{pass.score} <span className="text-sm text-gray-400">/ {maxScore}</span></p>
                          </td>
                          <td className="p-5 text-center"><span className={`px-4 py-1.5 rounded-xl text-sm font-black ${badgeColor}`}>{percentage}%</span></td>
                          <td className="p-5 text-center">
                            <button onClick={() => setStudentDetail(pass)} className="bg-purple-50 text-purple-600 hover:bg-purple-100 px-4 py-2 rounded-lg text-xs font-bold transition-colors">Javoblar</button>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* ======================================================== */}
      {/* YANGILANGAN: O'QUVCHI JAVOBLARINI KO'RISH MODALI */}
      {/* ======================================================== */}
      {studentDetail && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-overlay">
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-4xl w-full shadow-2xl relative max-h-[90vh] flex flex-col animate-pop">
            <button onClick={() => setStudentDetail(null)} className="absolute top-6 right-6 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-bold transition-colors">✕</button>
            
            <div className="mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-black text-gray-900 mb-1">{studentDetail.usedBy} ning javoblari</h2>
              <p className="text-gray-500 font-bold text-sm">Parol: <span className="text-gray-900 tracking-widest bg-gray-100 px-2 py-0.5 rounded">{studentDetail.code}</span> | Umumiy Ball: <span className="text-blue-600">{studentDetail.score} / {selectedExam.maxScore || 100}</span></p>
            </div>

            <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 space-y-6">
              
              {!studentDetail.studentAnswers || Object.keys(studentDetail.studentAnswers).length === 0 ? (
                <div className="text-center p-10 bg-gray-50 rounded-2xl">
                  <span className="text-3xl mb-2 block">🤷‍♂️</span>
                  <p className="font-bold text-gray-500">Javoblar mavjud emas.</p>
                </div>
              ) : (
                Object.entries(studentDetail.studentAnswers).map(([questionId, studentAns], idx) => {
                  const qObj = selectedExam.questions.find(q => q._id === questionId);
                  if(!qObj) return null;

                  const aiFeedback = studentDetail.aiEvaluation ? studentDetail.aiEvaluation[questionId] : null;

                  return (
                    <div key={questionId} className="bg-white border border-gray-200 p-6 rounded-[1.5rem] shadow-sm">
                      
                      {/* 1. SAVOL */}
                      <p className="font-black text-gray-900 text-lg mb-4 flex gap-3">
                        <span className="bg-gray-100 text-gray-500 w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 text-sm">{idx + 1}</span>
                        {qObj.text}
                      </p>
                      
                      <div className="space-y-4 pl-0 sm:pl-11">
                        
                        {/* 2. O'QUVCHI JAVOBI */}
                        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                          <p className="text-[11px] font-black uppercase text-blue-500 mb-2 flex items-center gap-1"><span>👤</span> O'quvchi javobi:</p>
                          <p className="font-bold text-sm text-gray-800 leading-relaxed">
                            {studentAns || <i className="text-gray-400">Javob yozilmagan</i>}
                          </p>
                        </div>

                        {/* 3. AI IZOHI VA BALLI (Faqat yozma ish bo'lsa chiqadi) */}
                        {selectedExam.examType === "written" && aiFeedback && (
                          <div className="p-5 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 text-5xl">🤖</div>
                            <div className="flex justify-between items-start mb-2 relative z-10">
                              <p className="text-[11px] font-black uppercase text-purple-600 flex items-center gap-1"><span>🤖</span> AI Ekspert xulosasi:</p>
                              <span className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm font-black shadow-sm">
                                {aiFeedback.score} ball
                              </span>
                            </div>
                            <p className="font-medium text-sm text-purple-900 leading-relaxed relative z-10 italic">
                              "{aiFeedback.feedback}"
                            </p>
                          </div>
                        )}
                        
                        {/* 4. TO'G'RI (MUKAMMAL) JAVOB */}
                        <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                          <p className="text-[11px] font-black uppercase text-green-600 mb-2 flex items-center gap-1"><span>✅</span> To'g'ri / Mukammal javob:</p>
                          <p className="font-bold text-sm text-green-800 leading-relaxed">{qObj.answer}</p>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-right">
              <button onClick={() => setStudentDetail(null)} className="px-8 py-3 bg-gray-900 text-white font-black rounded-xl hover:bg-black transition-all shadow-lg active:scale-95">Yopish</button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}