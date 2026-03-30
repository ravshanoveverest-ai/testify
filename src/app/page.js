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
  const { data: session } = useSession();
  const [publicTests, setPublicTests] = useState([]);
  const [myBlocks, setMyBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPublic = await fetch("/api/tests?public=true");
        const dataPublic = await resPublic.json();
        setPublicTests(dataPublic.tests || []);

        if (session) {
          const resBlocks = await fetch("/api/blocks");
          const dataBlocks = await resBlocks.json();
          setMyBlocks(dataBlocks.blocks || []);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [session]);

  if (isLoading) return <div className="p-10 text-center font-bold text-gray-400">Yuklanmoqda...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mt-4">
      
      {/* 1-BO'LIM: MENING BLOKLARIM */}
      {session && (
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Mening Bloklarim 📁</h2>
            <Link href="/dashboard" className="text-blue-600 font-bold hover:underline text-sm">Hammasini ko'rish &rarr;</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {myBlocks.length > 0 ? (
              myBlocks.slice(0, 3).map((block) => (
                <Link key={block._id} href={`/dashboard/block/${block._id}`}>
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all cursor-pointer">
                    <span className="text-3xl sm:text-4xl block mb-2">{block.icon}</span>
                    <h3 className="text-lg font-bold text-gray-800 truncate">{block.name}</h3>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full p-8 bg-gray-50 rounded-2xl border border-dashed text-center text-gray-500">
                Hali bloklar yaratmagansiz. <Link href="/dashboard" className="text-blue-600 font-bold hover:underline">Yaratish</Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 2-BO'LIM: OMMAVIY TESTLAR */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">Ommaviy Testlar 🚀</h2>
        
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {publicTests.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {publicTests.map((test) => (
                <li key={test._id} className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-full sm:w-auto">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 break-words">{test.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mt-2 font-medium">
                      <span className="bg-gray-100 px-2 py-1 rounded-md">{test.questionCount} ta savol</span>
                      <span className="hidden sm:inline">&bull;</span>
                      {/* MUHIM: Endi bu dinamik tarzda Public yoki Private ni o'qib oladi 👇 */}
                      <span className={`px-2 py-1 rounded-md ${test.visibility === "Public" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}>
                        {test.visibility || "Public"}
                      </span>
                    </div>
                  </div>
                  
                  {/* Telefonda tugma 100% kenglikka ega bo'ladi (w-full sm:w-auto) */}
                  <Link href={`/test/${test._id}`} className="w-full sm:w-auto mt-2 sm:mt-0">
                    <button className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 sm:py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm active:scale-95 text-center">
                      Ishlash
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-10 sm:p-20 text-center text-gray-400 font-medium">
              Hozircha ommaviy testlar mavjud emas.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}