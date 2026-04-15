// export default function Home() {
//   return (
//     <main className="flex min-h-screen items-center justify-center">
//       <h1 className="text-5xl font-extrabold text-blue-600">
//         Testify ishga tushdi! 🚀
//       </h1>
//     </main>
//   );
// }

// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useSession } from "next-auth/react";

// export default function Home() {
//   const { data: session } = useSession();
//   const [publicTests, setPublicTests] = useState([]);
//   const [myBlocks, setMyBlocks] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // 1. Ommaviy testlarni hamma uchun olib kelish
//         const resPublic = await fetch("/api/tests?public=true");
//         const dataPublic = await resPublic.json();
//         setPublicTests(dataPublic.tests || []);

//         // 2. Agar foydalanuvchi kirgan bo'lsa, uning bloklarini ham olib kelish
//         if (session) {
//           const resBlocks = await fetch("/api/blocks");
//           const dataBlocks = await resBlocks.json();
//           setMyBlocks(dataBlocks.blocks || []);
//         }
//         setIsLoading(false);
//       } catch (error) {
//         console.log("Xatolik:", error);
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, [session]);

//   if (isLoading) return <div className="p-20 text-center font-bold text-gray-400">Yuklanmoqda...</div>;

//   return (
//     <div className="max-w-6xl mx-auto p-4 sm:p-8 mt-4">
      
//       {/* 1-BO'LIM: MENING BLOKLARIM (Faqat kirgan bo'lsa ko'rinadi) */}
//       {session && (
//         <section className="mb-16">
//           <div className="flex justify-between items-end mb-6">
//             <h2 className="text-2xl font-black text-gray-900">Mening Bloklarim 📁</h2>
//             <Link href="/dashboard" className="text-blue-600 font-bold hover:underline text-sm">Hammasini ko'rish →</Link>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {myBlocks.length > 0 ? (
//               myBlocks.slice(0, 3).map((block) => (
//                 <Link key={block._id} href={`/dashboard/block/${block._id}`}>
//                   <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all cursor-pointer">
//                     <span className="text-4xl block mb-2">{block.icon}</span>
//                     <h3 className="text-lg font-bold text-gray-800">{block.name}</h3>
//                   </div>
//                 </Link>
//               ))
//             ) : (
//               <div className="col-span-full p-10 bg-gray-50 rounded-2xl border border-dashed text-center text-gray-500">
//                 Hali bloklar yaratmagansiz. <Link href="/dashboard" className="text-blue-600 font-bold">Yaratish</Link>
//               </div>
//             )}
//           </div>
//         </section>
//       )}

//       {/* 2-BO'LIM: OMMAVIY TESTLAR (Hamma uchun) */}
//       <section>
//         <h2 className="text-2xl font-black text-gray-900 mb-6">Ommaviy Testlar 🚀</h2>
        
//         <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
//           {publicTests.length > 0 ? (
//             <ul className="divide-y divide-gray-100">
//               {publicTests.map((test) => (
//                 <li key={test._id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
//                   <div>
//                     <h3 className="text-lg font-bold text-gray-800">{test.title}</h3>
//                     <div className="flex gap-3 text-sm text-gray-500 mt-1">
//                       <span>{test.questionCount} ta savol</span>
//                       <span>•</span>
//                       <span className="text-blue-600 font-medium">Public</span>
//                     </div>
//                   </div>
//                   <Link href={`/test/${test._id}`}>
//                     <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm">
//                       Ishlash
//                     </button>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <div className="p-20 text-center text-gray-400 font-medium">
//               Hozircha ommaviy testlar mavjud emas.
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Agar mehmon bo'lsa, pastda kichik chaqiriq */}
//       {!session && (
//         <div className="mt-12 p-8 bg-blue-600 rounded-3xl text-center text-white">
//           <h3 className="text-xl font-bold mb-2">O'z testingizni yaratmoqchimisiz?</h3>
//           <p className="mb-6 opacity-90">Ro'yxatdan o'ting va shaxsiy testlar bazangizni shakllantiring.</p>
//           <Link href="/register" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-black hover:bg-gray-100 transition-all">
//             Hoziroq boshlash
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const [publicTests, setPublicTests] = useState([]);
  const [myBlocks, setMyBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // YANGI STATE: Qidiruv uchun
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      const fetchData = async () => {
        try {
          const resPublic = await fetch("/api/tests?public=true");
          const dataPublic = await resPublic.json();
          setPublicTests(dataPublic.tests || []);

          const resBlocks = await fetch("/api/blocks");
          const dataBlocks = await resBlocks.json();
          setMyBlocks(dataBlocks.blocks || []);
          
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      };
      fetchData();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status]);

  // YANGI FUNKSIYA: Qidiruv matni bo'yicha testlarni filtrlash
  const filteredPublicTests = publicTests.filter((test) =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === "loading" || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <i className="fi fi-rr-spinner animate-spin text-4xl text-blue-600 mb-4"></i>
        <p className="font-bold text-gray-400 text-lg">Yuklanmoqda...</p>
      </div>
    );
  }

  // =====================================================================
  // 1. MEHMONLAR UCHUN SAHIFA (LANDING PAGE - Premium Dizayn)
  // =====================================================================
  if (!session) {
    return (
      <div className="relative overflow-hidden min-h-[85vh] flex flex-col items-center justify-center">
        
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-blue-500 opacity-20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-purple-500 opacity-20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-12">
          
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-full text-sm border border-blue-100 shadow-sm animate-pop">
            <i className="fi fi-rr-sparkles"></i> Yangi avlod test platformasi
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight mb-8 leading-tight">
            Bilimingizni sinashning <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              eng mukammal usuli
            </span>
          </h1>

          <p className="mt-4 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            O'z testlaringizni yarating, boshqalar bilan ulashing va yetakchilar reytingida birinchi o'rinni egallang. Hamma imkoniyatlar bitta joyda!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register" className="w-full sm:w-auto">
              <button className="w-full bg-blue-600 text-white px-8 py-4 rounded-full font-black text-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                Bepul boshlash <i className="fi fi-rr-arrow-right translate-y-[2px]"></i>
              </button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full bg-white text-gray-700 px-8 py-4 rounded-full font-black text-lg hover:bg-gray-50 border border-gray-200 hover:shadow-md transition-all flex items-center justify-center gap-2">
                <i className="fi fi-rr-sign-in-alt translate-y-[1px]"></i> Tizimga kirish
              </button>
            </Link>
          </div>

          {/* Afzalliklar qismi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left">
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-4">
                <i className="fi fi-rr-cubes translate-y-[1px]"></i>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Shaxsiy Bloklar</h3>
              <p className="text-gray-500 text-sm font-medium">Testlaringizni bloklarga ajrating va qulay boshqaring.</p>
            </div>
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center text-2xl mb-4">
                <i className="fi fi-rr-time-fast translate-y-[1px]"></i>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Aqlli Taymer</h3>
              <p className="text-gray-500 text-sm font-medium">Testlarni aniq vaqt chegarasida va avtomatik aralashgan holda ishlash.</p>
            </div>
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl mb-4">
                <i className="fi fi-rr-podium translate-y-[1px]"></i>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Liderlar Reytingi</h3>
              <p className="text-gray-500 text-sm font-medium">Boshqalar bilan raqobatlashing va kuchlilar o'nligiga kiring.</p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // =====================================================================
  // 2. RO'YXATDAN O'TGANLAR UCHUN SAHIFA (DASHBOARD)
  // =====================================================================
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mt-4 animate-pop">
      
      {/* 1-BO'LIM: MENING BLOKLARIM */}
      <section className="mb-14">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-3">
            Mening Bloklarim <i className="fi fi-rr-folder-open text-blue-600 text-2xl translate-y-1"></i>
          </h2>
          <Link href="/dashboard" className="text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors text-sm flex items-center gap-2">
            Hammasini ko'rish <i className="fi fi-rr-arrow-right translate-y-[1px]"></i>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {myBlocks.length > 0 ? (
            myBlocks.slice(0, 3).map((block) => (
              <Link key={block._id} href={`/dashboard/block/${block._id}`}>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    <i className="fi fi-rr-box translate-y-[2px]"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 truncate">{block.name}</h3>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full p-10 bg-white rounded-[2rem] border border-dashed border-gray-200 text-center flex flex-col items-center justify-center">
              <span className="text-4xl mb-3 text-gray-300">
                <i className="fi fi-rr-box-open"></i>
              </span>
              <p className="text-gray-500 font-bold mb-3">Hali bloklar yaratmagansiz.</p>
              <Link href="/dashboard" className="text-blue-600 font-bold hover:underline px-4 py-2 bg-blue-50 rounded-xl flex items-center gap-2">
                <i className="fi fi-rr-layer-plus"></i> Yaratishni boshlash
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 2-BO'LIM: OMMAVIY TESTLAR */}
      <section>
        {/* YANGILANGAN QISM: Sarlavha va Qidiruv (Search) qatori */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-3">
            Ommaviy Testlar <i className="fi fi-rr-users text-green-600 text-2xl translate-y-1"></i>
          </h2>
          
          <div className="relative w-full md:w-72 lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="fi fi-rr-search text-gray-400"></i>
            </div>
            <input 
              type="text" 
              placeholder="Test nomini qidiring..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm text-gray-800"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <i className="fi fi-rr-cross-small text-lg"></i>
              </button>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden min-h-[200px]">
          {/* YANGILANGAN QISM: Filter qilingan testlarni ko'rsatish */}
          {filteredPublicTests.length > 0 ? (
            <ul className="divide-y divide-gray-50">
              {filteredPublicTests.map((test) => (
                <li key={test._id} className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-blue-50/30 transition-colors group">
                  <div className="w-full sm:w-auto">
                    <h3 className="text-lg sm:text-xl font-black text-gray-800 break-words group-hover:text-blue-600 transition-colors">{test.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mt-2 font-medium">
                      <span className="bg-gray-100 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5">
                        <i className="fi fi-rr-list-check"></i> {test.questionCount} ta savol
                      </span>
                      <span className="hidden sm:inline text-gray-300">&bull;</span>
                      <span className="bg-green-50 text-green-600 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {test.visibility || "Public"}
                      </span>
                    </div>
                  </div>
                  
                  <Link href={`/test/${test._id}`} className="w-full sm:w-auto mt-2 sm:mt-0">
                    <button className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-sm active:scale-95 text-center flex justify-center items-center gap-2">
                      <i className="fi fi-rr-play"></i> Ishlash
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-16 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4 text-4xl">
                {searchQuery ? <i className="fi fi-rr-search"></i> : <i className="fi fi-rr-sad-tear"></i>}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {searchQuery ? "Hech narsa topilmadi" : "Ommaviy testlar topilmadi"}
              </h3>
              <p className="text-gray-500 font-medium">
                {searchQuery ? `"${searchQuery}" bo'yicha mos test yo'q.` : "Hozircha tizimda hamma uchun ochiq testlar mavjud emas."}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}