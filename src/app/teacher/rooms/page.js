"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function TeacherRooms() {
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [selectedExamPasscodes, setSelectedExamPasscodes] = useState(null);
  const [selectedExamResults, setSelectedExamResults] = useState(null);
  
  const [editingExam, setEditingExam] = useState(null);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await fetch("/api/teacher/exams");
      const data = await res.json();
      if (res.ok) setExams(data.exams);
      else setError(data.message || "Xato yuz berdi");
    } catch (err) {
      setError("Server bilan ulanishda xato");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Parol nusxalandi: ${text}`);
  };

  const safeFormatDate = (dateStr) => {
    if (!dateStr) return "Vaqt belgilanmagan";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "Vaqt belgilanmagan" : d.toLocaleDateString('uz-UZ');
  };

  const safeFormatTime = (dateStr) => {
    if (!dateStr) return "--:--";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "--:--" : d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const formatForInput = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if(isNaN(d.getTime())) return "";
    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
  };

  const openEditModal = (exam) => {
    setEditingExam(exam);
    setNewStartTime(formatForInput(exam.startTime));
    setNewEndTime(formatForInput(exam.endTime));
  };

  const handleUpdateDates = async (e) => {
    e.preventDefault();
    if (!newStartTime || !newEndTime) return alert("Vaqtlarni to'liq kiriting!");
    if (new Date(newStartTime) >= new Date(newEndTime)) return alert("Tugash vaqti boshlanish vaqtidan keyin bo'lishi shart!");

    setIsUpdating(true);
    try {
      const res = await fetch("/api/teacher/exams", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: editingExam._id,
          startTime: newStartTime,
          endTime: newEndTime
        })
      });
      if (res.ok) {
        setEditingExam(null);
        fetchExams(); 
      } else {
        const data = await res.json();
        alert(data.message || "Xatolik yuz berdi");
      }
    } catch (error) {
      alert("Server xatosi");
    } finally {
      setIsUpdating(false);
    }
  };


  if (isLoading) return <div className="text-center mt-20 font-bold">Yuklanmoqda...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mt-4 animate-pop">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/teacher" className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-500 shadow-sm">&larr;</Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2"><span>🔑</span> Xonalar va Natijalar</h1>
          </div>
        </div>
        <Link href="/teacher/create-ai" className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg text-sm">+ Yangi yaratish</Link>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold">⚠️ {error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {exams.map((exam) => {
          const completedCount = exam.passcodes.filter(p => p.status === "completed").length;

          return (
            <div key={exam._id} className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${exam.startTime ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                    {safeFormatDate(exam.startTime)}
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${exam.examType === 'written' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'}`}>
                    {exam.examType === 'written' ? 'Yozma' : 'Test'}
                  </span>
                </div>
                
                <h3 className="text-xl font-black text-gray-900 mb-1">{exam.title}</h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                    ⏱️ {safeFormatTime(exam.startTime)} - {safeFormatTime(exam.endTime)}
                  </p>
                  <button onClick={() => openEditModal(exam)} className="p-1.5 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors" title="Vaqtni o'zgartirish">✏️</button>
                </div>
                
                <div className="flex gap-4 mt-4">
                  <div className="bg-gray-50 p-3 rounded-xl flex-1 text-center">
                    <p className="text-xl font-black text-gray-800">{exam.questionsPerStudent}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Savol</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl flex-1 text-center border border-green-100">
                    <p className="text-xl font-black text-green-600">{completedCount} / {exam.passcodes.length}</p>
                    <p className="text-[10px] text-green-600 font-bold uppercase">Topshirdi</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-6">
                <button onClick={() => setSelectedExamPasscodes(exam)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition-all shadow-sm text-sm">
                  🔑 Parollarni ko'rish
                </button>
                <button onClick={() => setSelectedExamResults(exam)} className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 text-sm">
                  📊 Natijalarni ko'rish
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {editingExam && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-overlay">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-pop">
            <button onClick={() => setEditingExam(null)} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full font-bold hover:bg-gray-200">✕</button>
            <h2 className="text-xl font-black mb-1 flex items-center gap-2"><span>✏️</span> Muddatni o'zgartirish</h2>
            <p className="text-sm font-bold text-gray-500 mb-6">{editingExam.title}</p>
            
            <form onSubmit={handleUpdateDates} className="space-y-4">
              <div><label className="block text-sm font-bold text-gray-700 mb-2">Yangi Boshlanish vaqti</label><input type="datetime-local" value={newStartTime} onChange={(e) => setNewStartTime(e.target.value)} className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 font-bold outline-none focus:ring-2 focus:ring-purple-500"/></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-2">Yangi Tugash vaqti</label><input type="datetime-local" value={newEndTime} onChange={(e) => setNewEndTime(e.target.value)} className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 font-bold outline-none focus:ring-2 focus:ring-purple-500"/></div>
              <button type="submit" disabled={isUpdating} className="w-full mt-4 py-4 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-70">
                {isUpdating ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedExamPasscodes && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-6 max-w-lg w-full shadow-2xl relative max-h-[80vh] flex flex-col">
            <button onClick={() => setSelectedExamPasscodes(null)} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full font-bold">✕</button>
            <h2 className="text-xl font-black mb-4">🔑 Parollar ro'yxati</h2>
            <div className="overflow-y-auto custom-scrollbar flex-1 space-y-2 mb-4">
              {selectedExamPasscodes.passcodes.map((pass, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 border rounded-xl">
                  <div>
                    <span className="font-black tracking-widest text-lg">{pass.code}</span>
                    <p className="text-xs font-bold mt-1">
                      {pass.status === "unused" ? <span className="text-green-500">Ishlatilmagan</span> : <span className="text-gray-400">Ishlatilgan ({pass.usedBy})</span>}
                    </p>
                  </div>
                  <button onClick={() => copyToClipboard(pass.code)} className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">Nusxa</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAYYOR, MANA SHU MODAL TO'G'RILANDI! */}
      {selectedExamResults && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] flex flex-col">
            <button onClick={() => setSelectedExamResults(null)} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full font-bold">✕</button>
            <h2 className="text-2xl font-black mb-1">📊 Imtihon Natijalari</h2>
            <p className="text-gray-500 font-medium text-sm mb-6">{selectedExamResults.title}</p>
            
            <div className="overflow-y-auto custom-scrollbar flex-1">
              <table className="w-full text-left">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="p-4 font-bold text-sm text-gray-500 rounded-l-xl">O'quvchi (Parol)</th>
                    
                    {/* MANA SHU YER O'ZGARDI: To'g'ri o'rniga To'plangan Ball */}
                    <th className="p-4 font-bold text-sm text-gray-500 text-center">To'plangan Ball</th>
                    
                    <th className="p-4 font-bold text-sm text-gray-500 text-center rounded-r-xl">Foiz</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedExamResults.passcodes
                    .filter(p => p.status === "completed")
                    .sort((a, b) => b.score - a.score) 
                    .map((pass, index) => {
                      
                      // MATEMATIKA O'ZGARDI: Ball / Maksimal Ball * 100
                      const maxScore = selectedExamResults.maxScore || 100;
                      const percentage = Math.round((pass.score / maxScore) * 100);
                      
                      return (
                        <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-gray-900">{pass.usedBy}</p>
                            <p className="text-xs text-gray-400 font-bold font-mono mt-0.5">{pass.code}</p>
                          </td>
                          
                          {/* Jami ball to'g'ri ko'rsatiladi */}
                          <td className="p-4 text-center font-black text-gray-800">
                            {pass.score} / {maxScore}
                          </td>
                          
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-black ${percentage >= 60 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {percentage}%
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  
                  {selectedExamResults.passcodes.filter(p => p.status === "completed").length === 0 && (
                    <tr><td colSpan="3" className="p-8 text-center text-gray-400 font-bold">Hali hech kim imtihonni yakunlamadi</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}