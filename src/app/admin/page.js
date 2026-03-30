"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState(null);
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const ADMIN_EMAIL = "ravshanoveverest@gmail.com";

  useEffect(() => {
    // XAVFSIZLIK: Admin emasmi? Asosiy sahifaga haydaymiz!
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.email !== ADMIN_EMAIL)) {
      router.push("/");
      return;
    }

    if (status === "authenticated" && session?.user?.email === ADMIN_EMAIL) {
      fetchAdminData();
    }
  }, [status, session, router]);

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin");
      const data = await res.json();

      if (res.ok) {
        setStats(data.stats);
        setTests(data.recentTests || []);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Ulanishda xato!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTest = async (testId, testTitle) => {
    if (!confirm(`Rostdan ham "${testTitle}" testini butunlay o'chirib yubormoqchimisiz?`)) return;

    try {
      const res = await fetch(`/api/admin?id=${testId}`, { method: "DELETE" });
      if (res.ok) {
        // O'chirilgan testni ro'yxatdan olib tashlash
        setTests(tests.filter((t) => t._id !== testId));
        setStats({ ...stats, testsCount: stats.testsCount - 1 });
        alert("Test tizimdan o'chirildi! 🗑️");
      }
    } catch (error) {
      alert("Xatolik yuz berdi");
    }
  };

  if (isLoading || status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-gray-500">Admin Panelga ulanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-20 text-center font-bold text-red-500 text-2xl">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* ADMIN NAVBAR */}
      <nav className="bg-gray-900 text-white p-4 sm:p-6 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-3xl">👑</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">Testify Admin</h1>
              <p className="text-xs text-gray-400 font-medium">Boshqaruv markazi</p>
            </div>
          </div>
          <Link href="/">
            <button className="bg-gray-800 hover:bg-gray-700 px-5 py-2.5 rounded-xl font-bold transition-colors text-sm sm:text-base">
              Saytga qaytish ↗
            </button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 mt-8">
        
        {/* STATISTIKA KARTALARI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-bold mb-1">Foydalanuvchilar</p>
              <h2 className="text-4xl font-black text-gray-900">{stats?.usersCount}</h2>
            </div>
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl">👥</div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-bold mb-1">Yaratilgan Bloklar</p>
              <h2 className="text-4xl font-black text-gray-900">{stats?.blocksCount}</h2>
            </div>
            <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center text-3xl">📁</div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-bold mb-1">Jami Testlar</p>
              <h2 className="text-4xl font-black text-gray-900">{stats?.testsCount}</h2>
            </div>
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-3xl">📝</div>
          </div>
        </div>

        {/* TESTLAR JADVALI */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-2xl font-black text-gray-900">Platformadagi barcha testlar</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="p-4 sm:p-6 font-bold">Test Nomi</th>
                  <th className="p-4 sm:p-6 font-bold">Muallif</th>
                  <th className="p-4 sm:p-6 font-bold">Holat</th>
                  <th className="p-4 sm:p-6 font-bold">Savollar</th>
                  <th className="p-4 sm:p-6 font-bold text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tests.length > 0 ? (
                  tests.map((test) => (
                    <tr key={test._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 sm:p-6 font-bold text-gray-900">{test.title}</td>
                      <td className="p-4 sm:p-6">
                        <p className="font-bold text-gray-800">{test.userId?.name || "Noma'lum"}</p>
                        <p className="text-xs text-gray-500 font-medium">{test.userId?.email || "O'chirilgan user"}</p>
                      </td>
                      <td className="p-4 sm:p-6">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          test.visibility === "Public" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {test.visibility}
                        </span>
                      </td>
                      <td className="p-4 sm:p-6 font-bold text-gray-600">{test.questionCount} ta</td>
                      <td className="p-4 sm:p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/test/${test._id}`}>
                            <button className="px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors text-sm">
                              Ko'rish
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDeleteTest(test._id, test.title)}
                            className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors text-sm"
                          >
                            O'chirish
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-gray-500 font-medium">
                      Hozircha tizimda testlar yo'q
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}