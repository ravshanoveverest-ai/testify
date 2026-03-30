"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function History() {
  const { status } = useSession();
  const router = useRouter();
  
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      const fetchHistory = async () => {
        try {
          const res = await fetch("/api/results");
          const data = await res.json();
          if (res.ok) setResults(data.results || []);
        } catch (error) {
          console.log("Xato", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchHistory();
    }
  }, [status, router]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('uz-UZ', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  if (isLoading || status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-14 h-14 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-gray-400 text-lg">Tarix yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 mt-4">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-gray-900">Natijalar tarixi 📊</h1>
        <Link href="/" className="text-blue-600 font-bold hover:underline">
          Bosh sahifa
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {results.length > 0 ? (
          results.map((result) => {
            const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
            
            return (
              <div key={result._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-shadow">
                
                <div className="w-full md:w-auto">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{result.testTitle}</h3>
                  <p className="text-sm font-medium text-gray-400">📅 {formatDate(result.createdAt)}</p>
                </div>

                <div className="w-full md:w-auto flex gap-6 sm:gap-10">
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Natija</p>
                    <p className="text-2xl font-black text-gray-900">
                      <span className="text-green-600">{result.correctAnswers}</span><span className="text-gray-300 mx-1">/</span>{result.totalQuestions}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Foiz</p>
                    <p className={`text-2xl font-black ${percentage >= 70 ? 'text-green-500' : percentage >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {percentage}%
                    </p>
                  </div>

                  <div className="text-center hidden sm:block">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Vaqt</p>
                    <p className="text-2xl font-black text-blue-600">{formatTime(result.timeSpent)}</p>
                  </div>
                </div>

              </div>
            );
          })
        ) : (
          <div className="p-20 text-center bg-white rounded-3xl border border-gray-100">
            <span className="text-6xl mb-4 block">📭</span>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Hali test ishlamagansiz</h3>
            <p className="text-gray-500 mb-6">Bilimingizni sinab ko'rish vaqti keldi!</p>
            <Link href="/">
              <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors">
                Testlarni ko'rish
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}