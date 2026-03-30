"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BlockDetails() {
  const params = useParams();
  const blockId = params.id;

  const [tests, setTests] = useState([]);
  const [blockName, setBlockName] = useState("Yuklanmoqda...");
  const [isLoading, setIsLoading] = useState(true);

  // Modallar uchun holatlar
  const [testToDelete, setTestToDelete] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const resBlocks = await fetch("/api/blocks");
        if (resBlocks.ok) {
          const dataBlocks = await resBlocks.json();
          const currentBlock = dataBlocks.blocks?.find(b => b._id === blockId);
          if (currentBlock) setBlockName(currentBlock.name);
          else setBlockName("Noma'lum Blok");
        }

        const resTests = await fetch(`/api/tests?blockId=${blockId}`);
        if (resTests.ok) {
          const dataTests = await resTests.json();
          setTests(dataTests.tests || []);
        }
        setIsLoading(false);
      } catch (error) {
        console.log("Ma'lumot olishda xato:", error);
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [blockId]);

  const executeDelete = async () => {
    if (!testToDelete) return;
    try {
      const res = await fetch(`/api/tests?id=${testToDelete}`, { method: "DELETE" });
      if (res.ok) {
        setTests(tests.filter(test => test._id !== testToDelete));
        setTestToDelete(null);
        setSuccessMsg("Test muvaffaqiyatli o'chirildi! 🗑️");
      }
    } catch (error) {
      console.log("O'chirishda xatolik:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-gray-500">Ma'lumotlar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 mt-4 relative">
      <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2 mb-6 font-medium w-fit">
        <span className="text-xl">←</span> Bloklarga qaytish
      </Link>

      {/* Sarlavha va Tugma qismi (Mobilga moslangan) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 break-words w-full sm:w-auto">{blockName} 📁</h1>
        <Link href={`/dashboard/block/${blockId}/create`} className="w-full sm:w-auto">
          <button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95">
            <span>+</span> Yangi Test yuklash
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {tests.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {tests.map((test) => {
              // Xavfsizlik uchun visibility ni o'qib olamiz, yo'q bo'lsa Private deymiz
              const visibility = test.visibility || "Private";
              const isPublic = visibility.toLowerCase() === "public";

              return (
                <li key={test._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
                  
                  {/* Test ma'lumotlari */}
                  <div className="w-full lg:w-auto">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 break-words">{test.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-xs sm:text-sm text-gray-500 font-medium">
                      <span className="bg-gray-100 px-2 py-1 rounded-md">{test.questionCount} ta savol</span>
                      <span className="hidden sm:inline">•</span>
                      <span className={`px-2 py-1 rounded-md font-bold ${
                        isPublic ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {visibility}
                      </span>
                    </div>
                  </div>

                  {/* Harakatlar tugmalari (Mobilda chiroyli taxlanadi) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 w-full lg:w-auto mt-2 lg:mt-0">
                    <Link href={`/dashboard/block/${blockId}/edit/${test._id}`} className="w-full">
                      <button className="w-full px-4 py-3 sm:py-2.5 text-sm font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                        Tahrirlash ✏️
                      </button>
                    </Link>
                    
                    <button onClick={() => setTestToDelete(test._id)} className="w-full px-4 py-3 sm:py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center gap-2">
                      O'chirish 🗑️
                    </button>
                    
                    <Link href={`/test/${test._id}`} className="w-full">
                      <button className="w-full px-4 py-3 sm:py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2">
                        Ishlash 🚀
                      </button>
                    </Link>
                  </div>

                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-10 sm:p-16 text-center flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl sm:text-5xl">📭</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Bu blokda hali testlar yo'q</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6">Birinchi testingizni yuklang va bilimlarni sinang!</p>
            <Link href={`/dashboard/block/${blockId}/create`}>
              <button className="text-blue-600 font-bold hover:underline text-sm sm:text-base">Test yaratish sahifasiga o'tish →</button>
            </Link>
          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* 1. O'CHIRISHNI TASDIQLASH MODALI */}
      {/* ================================================= */}
      {testToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-overlay">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center animate-pop">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl sm:text-4xl">🗑️</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3">Testni o'chirish</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-8 font-medium">Rostdan ham bu testni o'chirmoqchimisiz? Bu amalni orqaga qaytarib bo'lmaydi.</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button onClick={() => setTestToDelete(null)} className="w-full sm:flex-1 py-3 sm:py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors active:scale-95">Bekor qilish</button>
              <button onClick={executeDelete} className="w-full sm:flex-1 py-3 sm:py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg active:scale-95">Ha, o'chirish</button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* 2. MUVAFFAQIYATLI O'CHIRILDI MODALI */}
      {/* ================================================= */}
      {successMsg && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-overlay">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center animate-pop">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl sm:text-4xl">✅</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3">Ajoyib!</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-8 font-medium">{successMsg}</p>
            <button onClick={() => setSuccessMsg("")} className="w-full py-3 sm:py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors active:scale-95 shadow-lg">
              Davom etish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}