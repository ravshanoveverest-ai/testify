"use client";
import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false); // SUPPORT POP-UP STATE

  return (
    <>
      <nav className="bg-white border-b border-gray-100 py-4 px-4 sm:px-8 lg:px-12 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-40">
        
        {/* LOGO */}
        <Link href="/" className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tighter hover:opacity-80 transition-opacity">
          Testify.
        </Link>

        <div className="flex flex-wrap items-center gap-3 sm:gap-6 w-full sm:w-auto justify-end">
          {session ? (
            <div className="flex items-center gap-4">
              
              {/* DESKTOP UCHUN HAVOLALAR */}
              <div className="hidden sm:flex items-center gap-6">
                <Link href="/" className="text-gray-600 font-bold hover:text-blue-600 transition-colors">
                  Asosiy sahifa
                </Link>
                <Link href="/dashboard" className="text-gray-600 font-bold hover:text-blue-600 transition-colors">
                  Mening Bloklarim
                </Link>
                <button onClick={() => setShowSupportModal(true)} className="text-gray-600 font-bold hover:text-blue-600 transition-colors">
                  Yordam
                </button>
              </div>

              {/* PROFIL TUGMASI VA DROPDOWN */}
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="flex items-center gap-2 sm:gap-3 bg-blue-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm uppercase shadow-sm">
                    {session.user.name[0]}
                  </div>
                  <span className="font-bold text-gray-800 text-sm sm:text-base hidden xs:block">{session.user.name}</span>
                  <span className={`text-xs text-blue-600 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}>▼</span>
                </button>

                {/* DROPDOWN (Ochiladigan oyna) */}
                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-xl border border-gray-100 p-2 flex flex-col z-50 animate-pop origin-top-right">
                      <div className="p-4 border-b border-gray-50 mb-2">
                        <p className="font-black text-gray-900 text-sm truncate">{session.user.name}</p>
                        <p className="text-xs text-gray-500 font-medium truncate mt-1">{session.user.email}</p>
                      </div>
                      
                      {/* MOBIL UCHUN HAVOLALAR (Faqat kichik ekranda chiqadi) */}
                      <div className="sm:hidden flex flex-col gap-1 mb-2 border-b border-gray-50 pb-2">
                        <Link href="/" onClick={() => setIsDropdownOpen(false)} className="px-4 py-2 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors flex items-center gap-2">
                          🏠 Asosiy sahifa
                        </Link>
                        <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)} className="px-4 py-2 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors flex items-center gap-2">
                          📁 Mening Bloklarim
                        </Link>
                        <button onClick={() => { setShowSupportModal(true); setIsDropdownOpen(false); }} className="text-left px-4 py-2 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors flex items-center gap-2">
                          🎧 Yordam (Support)
                        </button>
                      </div>

                      {/* NATIJALAR TARIXI */}
                      <Link href="/history" onClick={() => setIsDropdownOpen(false)} className="px-4 py-2 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors flex items-center gap-2 mb-1">
                        📊 Natijalar tarixi
                      </Link>

                      <button 
                        onClick={() => signOut({ callbackUrl: "/login" })} 
                        className="mt-1 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold text-left transition-colors flex items-center gap-2"
                      >
                        🚪 Chiqish
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            
            /* TIZIMGA KIRMAGANLAR UCHUN */
            <div className="flex gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end items-center">
              <button onClick={() => setShowSupportModal(true)} className="text-gray-600 font-bold py-2 text-sm sm:text-base hover:text-blue-600 transition-colors">Yordam</button>
              <div className="flex gap-2 sm:gap-4">
                <Link href="/login" className="text-gray-600 font-bold py-2 text-sm sm:text-base hover:text-blue-600 transition-colors">Kirish</Link>
                <Link href="/register" className="bg-blue-600 text-white px-5 sm:px-6 py-2 rounded-xl font-bold text-sm sm:text-base hover:bg-blue-700 transition-all text-center shadow-sm">Ro'yxatdan o'tish</Link>
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
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center animate-pop relative">
            
            <button 
              onClick={() => setShowSupportModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold transition-colors"
            >
              ✕
            </button>
            
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎧</span>
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 mb-2">Yordam Markazi</h3>
            <p className="text-gray-500 mb-6 font-medium text-sm">Savollaringiz yoki takliflaringiz bo'lsa, biz bilan bog'laning:</p>
            
            <div className="space-y-3 mb-8 text-left">
              
              {/* Email */}
              <a href="mailto:ravshanoveverest@gmail.com" className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-blue-50 border border-gray-100 rounded-2xl transition-colors group">
                <span className="text-2xl">📧</span>
                <div className="overflow-hidden w-full">
                  <p className="text-xs font-bold text-gray-400 mb-0.5">Elektron pochta</p>
                  <p className="font-bold text-gray-800 text-sm truncate group-hover:text-blue-600 transition-colors">ravshanoveverest@gmail.com</p>
                </div>
              </a>
              
              {/* Telefon */}
              <a href="tel:+998993942087" className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-green-50 border border-gray-100 rounded-2xl transition-colors group">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-0.5">Telefon raqam</p>
                  <p className="font-bold text-gray-800 text-sm group-hover:text-green-600 transition-colors">+998 99 394 20 87</p>
                </div>
              </a>

              {/* Telegram */}
              <a href="https://t.me/ravshan0v" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-blue-50 border border-gray-100 rounded-2xl transition-colors group">
                <span className="text-2xl">✈️</span>
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-0.5">Telegram</p>
                  <p className="font-bold text-gray-800 text-sm group-hover:text-blue-500 transition-colors">@ravshan0v</p>
                </div>
              </a>
            </div>

            <button 
              onClick={() => setShowSupportModal(false)} 
              className="w-full py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-black transition-colors shadow-lg active:scale-95"
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