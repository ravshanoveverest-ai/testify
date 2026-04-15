// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { signOut, useSession } from "next-auth/react";

// export default function Navbar() {
//   const { data: session } = useSession();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [showSupportModal, setShowSupportModal] = useState(false);

//   const isTeacher = session?.user?.role === "teacher";

//   const handleLogout = async () => {
//     setIsDropdownOpen(false);
//     await signOut({ redirect: false });
//     window.location.href = "/login";
//   };

//   return (
//     <>
//       <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 px-4 sm:px-8 lg:px-12 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-40 transition-all shadow-sm">
        
//         {/* LOGO VA NOMI */}
//         <Link href={isTeacher ? "/teacher" : "/"} className="flex items-center gap-2.5 group">
//           <div className={`text-white p-2 rounded-xl group-hover:rotate-12 group-hover:scale-110 transition-all shadow-lg ${isTeacher ? "bg-purple-600 shadow-purple-200" : "bg-blue-600 shadow-blue-200"}`}>
//             <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
//             </svg>
//           </div>
//           <span className={`text-2xl sm:text-3xl font-black text-gray-900 tracking-tight transition-colors ${isTeacher ? "group-hover:text-purple-600" : "group-hover:text-blue-600"}`}>
//             Testify.
//           </span>
//         </Link>

//         <div className="flex flex-wrap items-center gap-3 sm:gap-6 w-full sm:w-auto justify-end">
//           {session ? (
//             <div className="flex items-center gap-2 sm:gap-4">
              
//               <div className="hidden sm:flex items-center gap-2 bg-gray-50/50 p-1 rounded-full border border-gray-100">
//                 {isTeacher ? (
//                   <>
//                     <Link href="/teacher" className="px-4 py-2 text-sm font-bold text-gray-600 rounded-full hover:bg-white hover:text-purple-600 hover:shadow-sm transition-all">Kabinet</Link>
//                     <Link href="/teacher/create-ai" className="px-4 py-2 text-sm font-bold text-gray-600 rounded-full hover:bg-white hover:text-purple-600 hover:shadow-sm transition-all">AI Imtihon</Link>
//                     <Link href="/teacher/rooms" className="px-4 py-2 text-sm font-bold text-gray-600 rounded-full hover:bg-white hover:text-purple-600 hover:shadow-sm transition-all">Xonalar</Link>
//                     <Link href="/teacher/results" className="px-4 py-2 text-sm font-bold text-gray-600 rounded-full hover:bg-white hover:text-purple-600 hover:shadow-sm transition-all">Natijalar</Link>
//                   </>
//                 ) : (
//                   <>
//                     <Link href="/" className="px-4 py-2 text-sm font-bold text-gray-600 rounded-full hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all">Asosiy sahifa</Link>
//                     <Link href="/dashboard" className="px-4 py-2 text-sm font-bold text-gray-600 rounded-full hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all">Mening Bloklarim</Link>
//                     {/* O'QUVCHI UCHUN HAM IMTIHON XONASIGA YO'L */}
//                     <Link href="/exam" className="px-4 py-2 text-sm font-black text-purple-600 bg-purple-50 rounded-full hover:bg-purple-100 hover:shadow-sm transition-all flex items-center gap-1">
//                       <span>🎯</span> Kod bilan kirish
//                     </Link>
//                   </>
//                 )}
//               </div>

//               <div className="relative">
//                 <button 
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
//                   className={`flex items-center gap-2 sm:gap-3 bg-white border pl-2 pr-3 py-1.5 sm:py-1.5 rounded-full shadow-sm transition-all focus:ring-4 active:scale-95 ${isTeacher ? "border-purple-200 hover:border-purple-300 focus:ring-purple-50" : "border-gray-200 hover:border-blue-300 focus:ring-blue-50"}`}
//                 >
//                   <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white font-bold text-sm uppercase shadow-sm border-2 border-white ${isTeacher ? "bg-gradient-to-br from-purple-600 to-purple-500" : "bg-gradient-to-br from-blue-600 to-blue-500"}`}>
//                     {session.user.name[0]}
//                   </div>
//                   <div className="hidden xs:flex flex-col items-start leading-tight">
//                     <span className="font-bold text-gray-800 text-sm">{session.user.name}</span>
//                     {isTeacher && <span className="text-[10px] font-black text-purple-500 uppercase">Ustoz</span>}
//                   </div>
//                   <span className={`text-xs text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}>▼</span>
//                 </button>

//                 {isDropdownOpen && (
//                   <>
//                     <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
//                     <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-[1.5rem] shadow-2xl border border-gray-100 p-2 flex flex-col z-50 animate-pop origin-top-right">
//                       <div className="p-4 border-b border-gray-50/50 mb-2 bg-gray-50/30 rounded-t-2xl">
//                         <p className="font-black text-gray-900 text-base truncate">{session.user.name}</p>
//                         <p className="text-xs text-gray-500 font-medium truncate mt-0.5">{session.user.email}</p>
//                       </div>
                      
//                       <div className="sm:hidden flex flex-col gap-1 mb-2 border-b border-gray-50/50 pb-2">
//                         {isTeacher ? (
//                           <>
//                             <Link href="/teacher" onClick={() => setIsDropdownOpen(false)} className="px-4 py-3 hover:bg-purple-50 rounded-xl text-sm font-bold text-gray-700 hover:text-purple-700 transition-colors flex items-center gap-3">👨‍🏫 Kabinet</Link>
//                             <Link href="/teacher/create-ai" onClick={() => setIsDropdownOpen(false)} className="px-4 py-3 hover:bg-purple-50 rounded-xl text-sm font-bold text-gray-700 hover:text-purple-700 transition-colors flex items-center gap-3">🤖 AI Imtihon</Link>
//                             <Link href="/teacher/rooms" onClick={() => setIsDropdownOpen(false)} className="px-4 py-3 hover:bg-purple-50 rounded-xl text-sm font-bold text-gray-700 hover:text-purple-700 transition-colors flex items-center gap-3">🔑 Xonalar</Link>
//                           </>
//                         ) : (
//                           <>
//                             <Link href="/" onClick={() => setIsDropdownOpen(false)} className="px-4 py-3 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors flex items-center gap-3">🏠 Asosiy sahifa</Link>
//                             <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)} className="px-4 py-3 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors flex items-center gap-3">📁 Mening Bloklarim</Link>
//                             <Link href="/exam" onClick={() => setIsDropdownOpen(false)} className="px-4 py-3 hover:bg-purple-50 text-purple-600 rounded-xl text-sm font-black transition-colors flex items-center gap-3">🎯 Kod bilan kirish</Link>
//                           </>
//                         )}
//                       </div>

//                       {!isTeacher && (
//                         <Link href="/history" onClick={() => setIsDropdownOpen(false)} className="px-4 py-3 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors flex items-center gap-3 mb-1">📊 Natijalar tarixi</Link>
//                       )}

//                       <button onClick={handleLogout} className="mt-1 px-4 py-3 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl text-sm font-bold text-left transition-all flex items-center gap-3 group">
//                         <span className="text-lg group-hover:animate-pulse">🚪</span> Chiqish
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           ) : (
            
//             /* TIZIMGA KIRMAGANLAR (GUEST) UCHUN */
//             <div className="flex gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end items-center">
              
//               {/* YANGI: ENG ASOSIY IMTIHONGA KIRISH TUGMASI */}
//               <Link href="/exam">
//                 <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black px-4 sm:px-6 py-2.5 text-sm sm:text-base rounded-full hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-2">
//                   <span>🎯</span> Imtihonga kirish
//                 </button>
//               </Link>

//               <div className="hidden xs:flex items-center gap-2 sm:gap-3 bg-gray-50/50 p-1.5 rounded-full border border-gray-100">
//                 <Link href="/login" className="text-gray-700 font-bold px-4 py-2 text-sm sm:text-base hover:bg-white hover:shadow-sm rounded-full transition-all">Kirish</Link>
//                 <Link href="/register" className="bg-blue-600 text-white px-5 sm:px-6 py-2.5 rounded-full font-bold text-sm sm:text-base hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all text-center">Ro'yxatdan o'tish</Link>
//               </div>
//             </div>
//           )}
//         </div>
//       </nav>

//       {showSupportModal && (
//          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-overlay">
//            {/* ... modal code ... */}
//            <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center animate-pop relative overflow-hidden">
//              <button onClick={() => setShowSupportModal(false)} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-bold">✕</button>
//              <h3 className="text-2xl font-black text-gray-900 mt-4 mb-2">Yordam Markazi</h3>
//              <p className="text-gray-500 font-medium text-sm mb-6">Aloqa uchun: ravshanoveverest@gmail.com</p>
//              <button onClick={() => setShowSupportModal(false)} className="w-full py-4 bg-gray-900 text-white font-black rounded-xl">Yopish</button>
//            </div>
//          </div>
//       )}
//     </>
//   );
// }

"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

// ==========================================
// ZAMONAVIY FLATICON IKONKALAR (UIcons)
// ==========================================
const Icons = {
  Cabinet: () => <i className="fi fi-rr-dashboard text-lg translate-y-[1px]"></i>,
  AI: () => <i className="fi fi-rr-magic-wand text-lg translate-y-[1px]"></i>,
  Key: () => <i className="fi fi-rr-key text-lg translate-y-[1px]"></i>,
  Home: () => <i className="fi fi-rr-home text-lg translate-y-[1px]"></i>,
  Blocks: () => <i className="fi fi-rr-folder-open text-lg translate-y-[1px]"></i>,
  Target: () => <i className="fi fi-rr-target text-lg translate-y-[1px]"></i>,
  History: () => <i className="fi fi-rr-time-past text-lg translate-y-[1px]"></i>,
  Logout: () => <i className="fi fi-rr-sign-out-alt text-lg translate-y-[1px]"></i>
};

export default function Navbar() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const dropdownRef = useRef(null);

  const isTeacher = session?.user?.role === "teacher";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await signOut({ redirect: false });
    window.location.href = "/login";
  };

  return (
    <>
      {/* YANGILANGAN QISM: flex-wrap o'rniga aniq justify-between qoldirildi,
        bu logo chapda, qolgan hamma narsa (shu jumladan profil) eng o'ngda turishini kafolatlaydi.
      */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 px-4 sm:px-8 lg:px-12 flex justify-between items-center sticky top-0 z-40 transition-all shadow-sm">
        
        {/* LOGO VA NOMI */}
        <Link href={isTeacher ? "/teacher" : "/"} className="flex items-center gap-2.5 group shrink-0">
          <div className={`text-white p-2 rounded-xl group-hover:rotate-12 group-hover:scale-110 transition-all shadow-lg ${isTeacher ? "bg-purple-600 shadow-purple-200" : "bg-blue-600 shadow-blue-200"}`}>
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <span className={`text-2xl sm:text-3xl font-black text-gray-900 tracking-tight transition-colors ${isTeacher ? "group-hover:text-purple-600" : "group-hover:text-blue-600"}`}>
            Testify.
          </span>
        </Link>

        {/* O'ng qism: Katta ekranlarda menyu + profil, 
          kichik ekranlarda faqat profil (yoki "Imtihonga kirish").
        */}
        <div className="flex items-center gap-3 sm:gap-6 justify-end w-full">
          {session ? (
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* O'rta menyu (Kichik ekranlarda yashiriladi) */}
              <div className="hidden lg:flex items-center gap-2 bg-gray-50/50 p-1 rounded-full border border-gray-100">
                {isTeacher ? (
                  <>
                    <Link href="/teacher" className="px-4 py-2 text-sm font-bold text-gray-600 rounded-full hover:bg-white hover:text-purple-600 hover:shadow-sm transition-all">Kabinet</Link>
                    <Link href="/teacher/create-ai" className="px-4 py-2 text-sm font-bold text-gray-600 rounded-full hover:bg-white hover:text-purple-600 hover:shadow-sm transition-all">AI Imtihon</Link>
                    <Link href="/teacher/rooms" className="px-4 py-2 text-sm font-bold text-gray-600 rounded-full hover:bg-white hover:text-purple-600 hover:shadow-sm transition-all">Xonalar</Link>
                    <Link href="/teacher/results" className="px-4 py-2 text-sm font-bold text-gray-600 rounded-full hover:bg-white hover:text-purple-600 hover:shadow-sm transition-all">Natijalar</Link>
                  </>
                ) : (
                  <>
                    <Link href="/" className="px-4 py-2 text-sm font-bold text-gray-600 rounded-full hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all">Asosiy sahifa</Link>
                    <Link href="/dashboard" className="px-4 py-2 text-sm font-bold text-gray-600 rounded-full hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all">Mening Bloklarim</Link>
                    <Link href="/exam" className="px-4 py-2 text-sm font-black text-purple-600 bg-purple-50 rounded-full hover:bg-purple-100 hover:shadow-sm transition-all flex items-center gap-2">
                      <i className="fi fi-rr-target translate-y-[1px]"></i> Kod bilan kirish
                    </Link>
                  </>
                )}
              </div>

              {/* Profil tugmasi (Hamma ekranda ko'rinadi) */}
              <div className="relative shrink-0" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className={`flex items-center gap-2 sm:gap-3 bg-white border pl-2 pr-3 py-1.5 rounded-full shadow-sm transition-all focus:ring-4 active:scale-95 ${isTeacher ? "border-purple-200 hover:border-purple-300 focus:ring-purple-50" : "border-gray-200 hover:border-blue-300 focus:ring-blue-50"}`}
                >
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white font-bold text-sm uppercase shadow-sm border-2 border-white ${isTeacher ? "bg-gradient-to-br from-purple-600 to-purple-500" : "bg-gradient-to-br from-blue-600 to-blue-500"}`}>
                    {session.user.name[0]}
                  </div>
                  <div className="hidden xs:flex flex-col items-start leading-tight">
                    <span className="font-bold text-gray-800 text-sm">{session.user.name}</span>
                    {isTeacher && <span className="text-[10px] font-black text-purple-500 uppercase">Ustoz</span>}
                  </div>
                  <i className={`fi fi-rr-angle-down text-[10px] text-gray-400 transition-transform mt-[2px] ${isDropdownOpen ? "rotate-180" : ""}`}></i>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-[1.5rem] shadow-2xl border border-gray-100 p-2 flex flex-col z-50 animate-pop origin-top-right">
                    <div className="p-4 border-b border-gray-50/50 mb-2 bg-gray-50/30 rounded-t-2xl">
                      <p className="font-black text-gray-900 text-base truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-500 font-medium truncate mt-0.5">{session.user.email}</p>
                    </div>
                    
                    {/* Kichik ekranlar uchun menyular dropdown ichiga tushadi */}
                    <div className="lg:hidden flex flex-col gap-1 mb-2 border-b border-gray-50/50 pb-2">
                      {isTeacher ? (
                        <>
                          <Link href="/teacher" onClick={() => setIsDropdownOpen(false)} className="px-4 py-3 hover:bg-purple-50 rounded-xl text-sm font-bold text-gray-700 hover:text-purple-700 transition-colors flex items-center gap-3">
                            <Icons.Cabinet /> Kabinet
                          </Link>
                          <Link href="/teacher/create-ai" onClick={() => setIsDropdownOpen(false)} className="px-4 py-3 hover:bg-purple-50 rounded-xl text-sm font-bold text-gray-700 hover:text-purple-700 transition-colors flex items-center gap-3">
                            <Icons.AI /> AI Imtihon
                          </Link>
                          <Link href="/teacher/rooms" onClick={() => setIsDropdownOpen(false)} className="px-4 py-3 hover:bg-purple-50 rounded-xl text-sm font-bold text-gray-700 hover:text-purple-700 transition-colors flex items-center gap-3">
                            <Icons.Key /> Xonalar
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link href="/" onClick={() => setIsDropdownOpen(false)} className="px-4 py-3 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors flex items-center gap-3">
                            <Icons.Home /> Asosiy sahifa
                          </Link>
                          <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)} className="px-4 py-3 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors flex items-center gap-3">
                            <Icons.Blocks /> Mening Bloklarim
                          </Link>
                          <Link href="/exam" onClick={() => setIsDropdownOpen(false)} className="px-4 py-3 hover:bg-purple-50 text-purple-600 rounded-xl text-sm font-black transition-colors flex items-center gap-3">
                            <Icons.Target /> Kod bilan kirish
                          </Link>
                        </>
                      )}
                    </div>

                    {!isTeacher && (
                      <Link href="/history" onClick={() => setIsDropdownOpen(false)} className="px-4 py-3 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors flex items-center gap-3 mb-1">
                        <Icons.History /> Natijalar tarixi
                      </Link>
                    )}

                    <button onClick={handleLogout} className="mt-1 px-4 py-3 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl text-sm font-bold text-left transition-all flex items-center gap-3 group">
                      <Icons.Logout /> Chiqish
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            
            /* TIZIMGA KIRMAGANLAR (GUEST) UCHUN */
            <div className="flex gap-3 sm:gap-4 justify-end items-center w-full">
              <Link href="/exam" className="shrink-0">
                <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black px-4 sm:px-6 py-2.5 text-sm sm:text-base rounded-full hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                  <i className="fi fi-rr-file-signature translate-y-[1px]"></i> 
                  <span className="hidden xs:inline">Imtihonga kirish</span>
                  <span className="xs:hidden">Kirish</span>
                </button>
              </Link>

              <div className="hidden sm:flex items-center gap-2 bg-gray-50/50 p-1.5 rounded-full border border-gray-100">
                <Link href="/login" className="text-gray-700 font-bold px-4 py-2 text-sm hover:bg-white hover:shadow-sm rounded-full transition-all">Kirish</Link>
                <Link href="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all text-center">Ro'yxatdan o'tish</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* YORDAM MODALI */}
      {showSupportModal && (
         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-overlay">
           <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center animate-pop relative overflow-hidden">
             <button onClick={() => setShowSupportModal(false)} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-bold transition-colors">
               <i className="fi fi-rr-cross-small text-xl translate-y-[1px]"></i>
             </button>
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mt-2 mb-4">
               <i className="fi fi-rr-headset"></i>
             </div>
             <h3 className="text-2xl font-black text-gray-900 mb-2">Yordam Markazi</h3>
             <p className="text-gray-500 font-medium text-sm mb-6">Aloqa uchun: ravshanoveverest@gmail.com</p>
             <button onClick={() => setShowSupportModal(false)} className="w-full py-4 bg-gray-900 hover:bg-black transition-colors text-white font-black rounded-xl">Yopish</button>
           </div>
         </div>  
      )}
    </>
  );
}