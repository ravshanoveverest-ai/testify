"use client";
import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // LOCALHOST XATOSINI TARTIBGA SOLUVCHI YANGI FUNKSIYA
  const handleLogout = async () => {
    setIsDropdownOpen(false);
    // NextAuth ga o'zicha redirect qilishini taqiqlaymiz
    await signOut({ redirect: false });
    // Va o'zimiz majburan asosiy domendagi /login ga yo'naltiramiz
    window.location.href = "/login";
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 px-4 sm:px-8 lg:px-12 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-40 transition-all shadow-sm">
        
        {/* LOGO VA NOMI (Yangi dizayn) */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:rotate-12 group-hover:scale-110 transition-all shadow-blue-200 shadow-lg">
            {/* QALQON VA CHECK (SVG Logo) */}
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
            Testify.
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-3 sm:gap-6 w-full sm:w-auto justify-end">
          {session ? (
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* DESKTOP UCHUN HAVOLALAR (Zamonaviy tugmalar) */}
              <div className="hidden sm:flex items-center gap-2 bg-gray-50/50 p-1 rounded-full border border-gray-100">
                <Link href="/" className="px-4 py-2 text-sm font-bold text-gray-600 rounded-full hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all">
                  Asosiy sahifa
                </Link>
                <Link href="/dashboard" className="px-4 py-2 text-sm font-bold text-gray-600 rounded-full hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all">
                  Mening Bloklarim
                </Link>
                <button onClick={() => setShowSupportModal(true)} className="px-4 py-2 text-sm font-bold text-gray-600 rounded-full hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all">
                  Yordam
                </button>
              </div>

              {/* PROFIL TUGMASI VA DROPDOWN */}
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="flex items-center gap-2 sm:gap-3 bg-white border border-gray-200 pl-2 pr-3 py-1.5 sm:py-1.5 rounded-full hover:border-blue-300 hover:shadow-md transition-all focus:ring-4 focus:ring-blue-50 active:scale-95"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm uppercase shadow-sm border-2 border-white">
                    {session.user.name[0]}
                  </div>
                  <span className="font-bold text-gray-800 text-sm hidden xs:block">{session.user.name}</span>
                  <span className={`text-xs text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}>▼</span>
                </button>

                {/* DROPDOWN (Yangi zamonaviy dizayn) */}
                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-[1.5rem] shadow-2xl border border-gray-100 p-2 flex flex-col z-50 animate-pop origin-top-right">
                      <div className="p-4 border-b border-gray-50/50 mb-2 bg-gray-50/30 rounded-t-2xl">
                        <p className="font-black text-gray-900 text-base truncate">{session.user.name}</p>
                        <p className="text-xs text-gray-500 font-medium truncate mt-0.5">{session.user.email}</p>
                      </div>
                      
                      {/* MOBIL UCHUN HAVOLALAR */}
                      <div className="sm:hidden flex flex-col gap-1 mb-2 border-b border-gray-50/50 pb-2">
                        <Link href="/" onClick={() => setIsDropdownOpen(false)} className="px-4 py-3 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors flex items-center gap-3">
                          <span className="text-lg">🏠</span> Asosiy sahifa
                        </Link>
                        <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)} className="px-4 py-3 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors flex items-center gap-3">
                          <span className="text-lg">📁</span> Mening Bloklarim
                        </Link>
                        <button onClick={() => { setShowSupportModal(true); setIsDropdownOpen(false); }} className="text-left px-4 py-3 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors flex items-center gap-3">
                          <span className="text-lg">🎧</span> Yordam (Support)
                        </button>
                      </div>

                      {/* NATIJALAR TARIXI */}
                      <Link href="/history" onClick={() => setIsDropdownOpen(false)} className="px-4 py-3 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors flex items-center gap-3 mb-1">
                        <span className="text-lg">📊</span> Natijalar tarixi
                      </Link>

                      {/* CHIQISH TUGMASI (Qizil hover effekti) */}
                      <button 
                        onClick={handleLogout} 
                        className="mt-1 px-4 py-3 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl text-sm font-bold text-left transition-all flex items-center gap-3 group"
                      >
                        <span className="text-lg group-hover:animate-pulse">🚪</span> Chiqish
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            
            /* TIZIMGA KIRMAGANLAR UCHUN (Zamonaviy pill-buttons) */
            <div className="flex gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end items-center">
              <button onClick={() => setShowSupportModal(true)} className="text-gray-500 font-bold px-4 py-2 text-sm sm:text-base hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                Yordam
              </button>
              <div className="flex items-center gap-2 sm:gap-3 bg-gray-50/50 p-1.5 rounded-full border border-gray-100">
                <Link href="/login" className="text-gray-700 font-bold px-4 py-2 text-sm sm:text-base hover:bg-white hover:shadow-sm rounded-full transition-all">
                  Kirish
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-5 sm:px-6 py-2.5 rounded-full font-bold text-sm sm:text-base hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all text-center">
                  Ro'yxatdan o'tish
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ================================================= */}
      {/* YORDAM (SUPPORT) POP-UP MODALI */}
      {/* ================================================= */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-overlay">
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center animate-pop relative overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-50 to-transparent"></div>

            <button 
              onClick={() => setShowSupportModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-white hover:bg-gray-100 text-gray-500 rounded-full flex items-center justify-center font-bold transition-colors shadow-sm z-10"
            >
              ✕
            </button>
            
            <div className="w-20 h-20 bg-blue-600 text-white rounded-[1.5rem] shadow-xl flex items-center justify-center mx-auto mb-6 relative z-10 rotate-3">
              <span className="text-4xl -rotate-3">🎧</span>
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 mb-2 relative z-10">Yordam Markazi</h3>
            <p className="text-gray-500 mb-6 font-medium text-sm relative z-10">Savollaringiz yoki takliflaringiz bo'lsa, biz bilan bog'laning:</p>
            
            <div className="space-y-3 mb-8 text-left relative z-10">
              <a href="mailto:ravshanoveverest@gmail.com" className="flex items-center gap-4 p-4 bg-white hover:bg-blue-50/50 border border-gray-100 shadow-sm hover:shadow-md rounded-2xl transition-all group">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📧</div>
                <div className="overflow-hidden w-full">
                  <p className="text-xs font-bold text-gray-400 mb-0.5">Elektron pochta</p>
                  <p className="font-bold text-gray-800 text-sm truncate group-hover:text-blue-600 transition-colors">ravshanoveverest@gmail.com</p>
                </div>
              </a>
              
              <a href="tel:+998993942087" className="flex items-center gap-4 p-4 bg-white hover:bg-green-50/50 border border-gray-100 shadow-sm hover:shadow-md rounded-2xl transition-all group">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📞</div>
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-0.5">Telefon raqam</p>
                  <p className="font-bold text-gray-800 text-sm group-hover:text-green-600 transition-colors">+998 99 394 20 87</p>
                </div>
              </a>

              <a href="https://t.me/ravshan0v" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white hover:bg-blue-50/50 border border-gray-100 shadow-sm hover:shadow-md rounded-2xl transition-all group">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform">✈️</div>
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-0.5">Telegram</p>
                  <p className="font-bold text-gray-800 text-sm group-hover:text-blue-500 transition-colors">@ravshan0v</p>
                </div>
              </a>
            </div>

            <button 
              onClick={() => setShowSupportModal(false)} 
              className="w-full py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-black transition-all shadow-lg active:scale-95 relative z-10"
            >
              Yopish
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { signOut, useSession } from "next-auth/react";

// export default function Navbar() {
//   const { data: session } = useSession();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [showSupportModal, setShowSupportModal] = useState(false); // SUPPORT POP-UP STATE

//   return (
//     <>
//       <nav className="bg-white border-b border-gray-100 py-4 px-4 sm:px-8 lg:px-12 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-40">
        
//         {/* LOGO */}
//         <Link href="/" className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tighter hover:opacity-80 transition-opacity">
//           Testify.
//         </Link>

//         <div className="flex flex-wrap items-center gap-3 sm:gap-6 w-full sm:w-auto justify-end">
//           {session ? (
//             <div className="flex items-center gap-4">
              
//               {/* DESKTOP UCHUN HAVOLALAR */}
//               <div className="hidden sm:flex items-center gap-6">
//                 <Link href="/" className="text-gray-600 font-bold hover:text-blue-600 transition-colors">
//                   Asosiy sahifa
//                 </Link>
//                 <Link href="/dashboard" className="text-gray-600 font-bold hover:text-blue-600 transition-colors">
//                   Mening Bloklarim
//                 </Link>
//                 <button onClick={() => setShowSupportModal(true)} className="text-gray-600 font-bold hover:text-blue-600 transition-colors">
//                   Yordam
//                 </button>
//               </div>

//               {/* PROFIL TUGMASI VA DROPDOWN */}
//               <div className="relative">
//                 <button 
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
//                   className="flex items-center gap-2 sm:gap-3 bg-blue-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl hover:bg-blue-100 transition-colors cursor-pointer"
//                 >
//                   <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm uppercase shadow-sm">
//                     {session.user.name[0]}
//                   </div>
//                   <span className="font-bold text-gray-800 text-sm sm:text-base hidden xs:block">{session.user.name}</span>
//                   <span className={`text-xs text-blue-600 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}>▼</span>
//                 </button>

//                 {/* DROPDOWN (Ochiladigan oyna) */}
//                 {isDropdownOpen && (
//                   <>
//                     <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
//                     <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-xl border border-gray-100 p-2 flex flex-col z-50 animate-pop origin-top-right">
//                       <div className="p-4 border-b border-gray-50 mb-2">
//                         <p className="font-black text-gray-900 text-sm truncate">{session.user.name}</p>
//                         <p className="text-xs text-gray-500 font-medium truncate mt-1">{session.user.email}</p>
//                       </div>
                      
//                       {/* MOBIL UCHUN HAVOLALAR (Faqat kichik ekranda chiqadi) */}
//                       <div className="sm:hidden flex flex-col gap-1 mb-2 border-b border-gray-50 pb-2">
//                         <Link href="/" onClick={() => setIsDropdownOpen(false)} className="px-4 py-2 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors flex items-center gap-2">
//                           🏠 Asosiy sahifa
//                         </Link>
//                         <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)} className="px-4 py-2 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors flex items-center gap-2">
//                           📁 Mening Bloklarim
//                         </Link>
//                         <button onClick={() => { setShowSupportModal(true); setIsDropdownOpen(false); }} className="text-left px-4 py-2 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors flex items-center gap-2">
//                           🎧 Yordam (Support)
//                         </button>
//                       </div>

//                       <button 
//                         onClick={() => signOut({ callbackUrl: "/login" })} 
//                         className="mt-1 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold text-left transition-colors flex items-center gap-2"
//                       >
//                         🚪 Chiqish
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           ) : (
            
//             /* TIZIMGA KIRMAGANLAR UCHUN */
//             <div className="flex gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end items-center">
//               <button onClick={() => setShowSupportModal(true)} className="text-gray-600 font-bold py-2 text-sm sm:text-base hover:text-blue-600 transition-colors">Yordam</button>
//               <div className="flex gap-2 sm:gap-4">
//                 <Link href="/login" className="text-gray-600 font-bold py-2 text-sm sm:text-base hover:text-blue-600 transition-colors">Kirish</Link>
//                 <Link href="/register" className="bg-blue-600 text-white px-5 sm:px-6 py-2 rounded-xl font-bold text-sm sm:text-base hover:bg-blue-700 transition-all text-center shadow-sm">Ro'yxatdan o'tish</Link>
//               </div>
//             </div>
//           )}
//         </div>
//       </nav>

//       {/* ================================================= */}
//       {/* YORDAM (SUPPORT) POP-UP MODALI */}
//       {/* ================================================= */}
//       {showSupportModal && (
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-overlay">
//           <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center animate-pop relative">
            
//             <button 
//               onClick={() => setShowSupportModal(false)}
//               className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold transition-colors"
//             >
//               ✕
//             </button>
            
//             <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <span className="text-4xl">🎧</span>
//             </div>
            
//             <h3 className="text-2xl font-black text-gray-900 mb-2">Yordam Markazi</h3>
//             <p className="text-gray-500 mb-6 font-medium text-sm">Savollaringiz yoki takliflaringiz bo'lsa, biz bilan bog'laning:</p>
            
//             <div className="space-y-3 mb-8 text-left">
              
//               {/* Email */}
//               <a href="mailto:ravshanoveverest@gmail.com" className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-blue-50 border border-gray-100 rounded-2xl transition-colors group">
//                 <span className="text-2xl">📧</span>
//                 <div className="overflow-hidden w-full">
//                   <p className="text-xs font-bold text-gray-400 mb-0.5">Elektron pochta</p>
//                   <p className="font-bold text-gray-800 text-sm truncate group-hover:text-blue-600 transition-colors">ravshanoveverest@gmail.com</p>
//                 </div>
//               </a>
              
//               {/* Telefon */}
//               <a href="tel:+998993942087" className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-green-50 border border-gray-100 rounded-2xl transition-colors group">
//                 <span className="text-2xl">📞</span>
//                 <div>
//                   <p className="text-xs font-bold text-gray-400 mb-0.5">Telefon raqam</p>
//                   <p className="font-bold text-gray-800 text-sm group-hover:text-green-600 transition-colors">+998 99 394 20 87</p>
//                 </div>
//               </a>

//               {/* Telegram */}
//               <a href="https://t.me/ravshan0v" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-blue-50 border border-gray-100 rounded-2xl transition-colors group">
//                 <span className="text-2xl">✈️</span>
//                 <div>
//                   <p className="text-xs font-bold text-gray-400 mb-0.5">Telegram</p>
//                   <p className="font-bold text-gray-800 text-sm group-hover:text-blue-500 transition-colors">@ravshan0v</p>
//                 </div>
//               </a>
//             </div>

//             <button 
//               onClick={() => setShowSupportModal(false)} 
//               className="w-full py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-black transition-colors shadow-lg active:scale-95"
//             >
//               Yopish
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }