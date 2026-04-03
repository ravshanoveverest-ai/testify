"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const [exams, setExams] = useState([]);
  const [stats, setStats] = useState({ active: 0, students: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // NEXT.JS KESHINI CHETLAB O'TISH: ?t=... va cache: 'no-store' qo'shildi!
      const res = await fetch("/api/teacher/exams?t=" + new Date().getTime(), {
        cache: "no-store",
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      });
      
      const data = await res.json();
      
      if (res.ok) {
        const allExams = data.exams || [];
        setExams(allExams);

        const now = new Date();
        let activeCount = 0;
        let studentsCount = 0;

        allExams.forEach(exam => {
          // Tugash vaqti kelajakda bo'lsa -> Faol
          if (exam.endTime && new Date(exam.endTime) > now) {
            activeCount++;
          }
          // Topshirgan (completed) o'quvchilar soni
          if (exam.passcodes && Array.isArray(exam.passcodes)) {
            const completed = exam.passcodes.filter(p => p.status === "completed").length;
            studentsCount += completed;
          }
        });

        setStats({ active: activeCount, students: studentsCount });
      }
    } catch (error) {
      console.log("Dashboard ma'lumotlarini yuklashda xato", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mt-4 animate-pop">
      
      {/* 1. XUSH KELIBSIZ (GREETING CARD) */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-purple-500/20 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black mb-2 flex items-center gap-3">
            <span>👋</span> Xush kelibsiz, {session?.user?.name || "Ustoz"}!
          </h1>
          <p className="text-purple-100 font-medium max-w-xl">
            Testify orqali o'quvchilaringizning bilimini sinang va jarayonni sun'iy intellektga qo'yib bering.
          </p>
        </div>
        
        {/* DINAMIK STATISTIKA */}
        <div className="flex gap-4 w-full md:w-auto relative z-10">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex-1 text-center min-w-[120px]">
            <p className="text-4xl font-black">{isLoading ? "..." : stats.active}</p>
            <p className="text-[10px] font-bold text-purple-200 uppercase mt-2 tracking-wider">Faol imtihonlar</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex-1 text-center min-w-[120px]">
            <p className="text-4xl font-black">{isLoading ? "..." : stats.students}</p>
            <p className="text-[10px] font-bold text-purple-200 uppercase mt-2 tracking-wider">O'quvchilar</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. TEZKOR HARAKATLAR */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2"><span>⚡</span> Tezkor harakatlar</h2>
          
          <Link href="/teacher/create-ai" className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-sm">✨</div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">Yangi Imtihon</h3>
              <p className="text-xs font-bold text-gray-500">AI yordamida yaratish</p>
            </div>
          </Link>

          <Link href="/teacher/rooms" className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-sm">🔑</div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Xonalar va Parollar</h3>
              <p className="text-xs font-bold text-gray-500">O'quvchilarga kod berish</p>
            </div>
          </Link>

          <Link href="/teacher/results" className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-green-200 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-sm">📈</div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">Natijalar (HEMIS)</h3>
              <p className="text-xs font-bold text-gray-500">Baholarni yuklab olish</p>
            </div>
          </Link>
        </div>

        {/* 3. OXIRGI IMTIHONLAR */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2"><span>🕒</span> Oxirgi imtihonlar</h2>
            <Link href="/teacher/rooms" className="text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors">Barchasi &rarr;</Link>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center shadow-sm">
                <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="font-bold text-gray-400">Yuklanmoqda...</p>
              </div>
            ) : exams.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center shadow-sm">
                <span className="text-4xl mb-3 block">📭</span>
                <p className="font-bold text-gray-500">Hali hech qanday imtihon yaratilmagan.</p>
              </div>
            ) : (
              exams.slice(0, 3).map((exam) => {
                const completedCount = exam.passcodes ? exam.passcodes.filter(p => p.status === "completed").length : 0;
                const isWritten = exam.examType === "written";
                
                return (
                  <div key={exam._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-black uppercase rounded">
                          {new Date(exam.createdAt).toLocaleDateString('uz-UZ')}
                        </span>
                        
                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded ${isWritten ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                          {isWritten ? 'Yozma' : 'Test'}
                        </span>

                        {new Date(exam.endTime) > new Date() ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-black uppercase rounded animate-pulse">Faol</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-black uppercase rounded">Yopiq</span>
                        )}
                      </div>
                      <h3 className="font-black text-gray-900 text-lg line-clamp-1">{exam.title}</h3>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="font-black text-gray-800">{exam.questionsPerStudent}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Savol</p>
                      </div>
                      <div className="text-center">
                        <p className="font-black text-blue-600">{completedCount}</p>
                        <p className="text-[10px] font-bold text-blue-400 uppercase">Topshirdi</p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}