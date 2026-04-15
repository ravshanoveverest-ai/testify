// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function Dashboard() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const [blocks, setBlocks] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Modal va Form statelari
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [blockName, setBlockName] = useState("");
//   const [blockIcon, setBlockIcon] = useState("📁");
//   const [errorMsg, setErrorMsg] = useState(""); // XATOLIK UCHUN POP-UP STATE
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/login");
//     } else if (status === "authenticated") {
//       fetchBlocks();
//     }
//   }, [status, router]);

//   const fetchBlocks = async () => {
//     try {
//       const res = await fetch("/api/blocks");
//       if (res.ok) {
//         const data = await res.json();
//         setBlocks(data.blocks || []);
//       }
//       setIsLoading(false);
//     } catch (error) {
//       console.log("Xato:", error);
//       setIsLoading(false);
//     }
//   };

//   // BLOK YARATISH FUNKSIYASI
//   const handleCreateBlock = async (e) => {
//     e.preventDefault();
//     setErrorMsg(""); // Eski xatoni tozalash
//     if (!blockName.trim()) {
//       setErrorMsg("Blok nomini kiritish shart!");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const res = await fetch("/api/blocks", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: blockName, icon: blockIcon }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         // Muvaffaqiyatli bo'lsa
//         setBlocks([data.block, ...blocks]);
//         setIsModalOpen(false);
//         setBlockName("");
//         setBlockIcon("📁");
//       } else {
//         // XATOLIK BO'LSA POP-UP DA KO'RSATAMIZ (Masalan: Bir xil nom)
//         setErrorMsg(data.message || "Xatolik yuz berdi");
//       }
//     } catch (error) {
//       setErrorMsg("Server bilan ulanishda xatolik");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isLoading) return <div className="p-20 text-center font-bold text-gray-400">Yuklanmoqda...</div>;

//   return (
//     <div className="max-w-6xl mx-auto p-4 sm:p-8 mt-4">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
//         <h1 className="text-3xl font-black text-gray-900">Mening Bloklarim</h1>
//         <button 
//           onClick={() => { setIsModalOpen(true); setErrorMsg(""); }} 
//           className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 w-full sm:w-auto flex justify-center gap-2"
//         >
//           <span>+</span> Yangi Blok
//         </button>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {blocks.length > 0 ? (
//           blocks.map((block) => (
//             <Link key={block._id} href={`/dashboard/block/${block._id}`}>
//               <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group h-full flex flex-col justify-between">
//                 <div>
//                   <span className="text-5xl block mb-4 group-hover:scale-110 transition-transform origin-left">{block.icon}</span>
//                   <h3 className="text-2xl font-bold text-gray-800 break-words">{block.name}</h3>
//                 </div>
//                 <div className="mt-6 flex justify-between items-center text-sm font-bold text-gray-400 group-hover:text-blue-600 transition-colors">
//                   Ochish &rarr;
//                 </div>
//               </div>
//             </Link>
//           ))
//         ) : (
//           <div className="col-span-full p-16 bg-white rounded-[2rem] border border-dashed border-gray-300 text-center">
//             <span className="text-6xl block mb-4">📭</span>
//             <h3 className="text-xl font-bold text-gray-800 mb-2">Hali bloklar yo'q</h3>
//             <p className="text-gray-500">Tepadagi "Yangi Blok" tugmasi orqali birinchi blokingizni yarating.</p>
//           </div>
//         )}
//       </div>

//       {/* ================================================= */}
//       {/* BLOK YARATISH MODALI (POP-UP BILAN) */}
//       {/* ================================================= */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-overlay">
//           <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-pop">
//             <h2 className="text-2xl font-black text-gray-900 mb-6">Yangi blok yaratish</h2>
            
//             {/* XATOLIK XABARI UCHUN POP-UP QISMI 👇 */}
//             {errorMsg && (
//               <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100 flex items-center gap-2 animate-pop">
//                 <span>⚠️</span> {errorMsg}
//               </div>
//             )}

//             <form onSubmit={handleCreateBlock} className="space-y-5">
//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-2">Ikonka (Emoji)</label>
//                 <input 
//                   type="text" 
//                   value={blockIcon} 
//                   onChange={(e) => setBlockIcon(e.target.value)} 
//                   maxLength="2"
//                   className="w-20 px-4 py-3 text-2xl text-center rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" 
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-2">Blok nomi</label>
//                 <input 
//                   type="text" 
//                   value={blockName} 
//                   onChange={(e) => setBlockName(e.target.value)} 
//                   placeholder="Masalan: Tarix" 
//                   className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 font-medium" 
//                 />
//               </div>
//               <div className="flex gap-3 pt-4">
//                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
//                   Bekor qilish
//                 </button>
//                 <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md disabled:opacity-50">
//                   {isSubmitting ? "Yaratilmoqda..." : "Yaratish"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // YARATISH Statelari
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [blockName, setBlockName] = useState("");
  const [blockIcon, setBlockIcon] = useState("fi-rr-folder"); 
  const [createErrorMsg, setCreateErrorMsg] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TAHRIRLASH (EDIT) Statelari
  const [editingBlock, setEditingBlock] = useState(null);
  const [editBlockName, setEditBlockName] = useState("");
  const [editErrorMsg, setEditErrorMsg] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // O'CHIRISH (DELETE) Statelari
  const [deletingBlock, setDeletingBlock] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // SUCCESS TOAST
  const [successToast, setSuccessToast] = useState(""); 

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchBlocks();
    }
  }, [status, router]);

  const fetchBlocks = async () => {
    try {
      const res = await fetch("/api/blocks");
      if (res.ok) {
        const data = await res.json();
        setBlocks(data.blocks || []);
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Xato:", error);
      setIsLoading(false);
    }
  };

  // --- YARATISH ---
  const handleCreateBlock = async (e) => {
    e.preventDefault();
    setCreateErrorMsg(""); 
    if (!blockName.trim()) {
      setCreateErrorMsg("Blok nomini kiritish shart!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: blockName, icon: blockIcon }),
      });

      const data = await res.json();

      if (res.ok) {
        setBlocks([data.block, ...blocks]);
        setIsCreateModalOpen(false);
        setBlockName("");
        setBlockIcon("fi-rr-folder");
        showToast("Blok yaratildi!");
      } else {
        setCreateErrorMsg(data.message || "Xatolik yuz berdi");
      }
    } catch (error) {
      setCreateErrorMsg("Server bilan ulanishda xatolik");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- TAHRIRLASH ---
  const openEditModal = (block) => {
    setEditingBlock(block);
    setEditBlockName(block.name);
    setEditErrorMsg("");
  };

  const handleEditBlock = async (e) => {
    e.preventDefault();
    setEditErrorMsg("");
    
    if (!editBlockName.trim()) {
      setEditErrorMsg("Blok nomini kiritish shart!");
      return;
    }

    if (editBlockName.trim() === editingBlock.name) {
      setEditingBlock(null); // Hech nima o'zgarmasa, yopib yuboramiz
      return;
    }

    setIsEditing(true);
    try {
      const res = await fetch(`/api/blocks?id=${editingBlock._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editBlockName }) 
      });
      
      const data = await res.json();

      if (res.ok) {
        setBlocks(blocks.map(b => b._id === editingBlock._id ? { ...b, name: editBlockName } : b));
        setEditingBlock(null);
        showToast("Blok muvaffaqiyatli yangilandi!");
      } else {
        setEditErrorMsg(data.message || "Xatolik yuz berdi");
      }
    } catch (error) {
      setEditErrorMsg("Server xatosi. Qayta urinib ko'ring.");
    } finally {
      setIsEditing(false);
    }
  };

  // --- O'CHIRISH ---
  const handleDeleteBlock = async () => {
    if (!deletingBlock) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/blocks?id=${deletingBlock._id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setBlocks(blocks.filter(b => b._id !== deletingBlock._id));
        setDeletingBlock(null);
        showToast("Blok muvaffaqiyatli o'chirildi!");
      } else {
        const data = await res.json();
        alert(data.message || "O'chirishda xatolik yuz berdi");
      }
    } catch (error) {
      alert("Server xatosi. Qayta urinib ko'ring.");
    } finally {
      setIsDeleting(false);
    }
  };

  const showToast = (message) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast("");
    }, 3000); 
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <i className="fi fi-rr-spinner animate-spin text-4xl text-blue-600 mb-4"></i>
        <p className="font-bold text-gray-400 text-lg">Bloklar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <>
      {successToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-green-50 border border-green-100 text-green-700 px-6 py-3 rounded-full font-black text-sm shadow-xl animate-pop flex items-center gap-2">
          <i className="fi fi-rr-check-circle text-lg translate-y-[1px]"></i> {successToast}
        </div>
      )}

      <div className="max-w-6xl mx-auto p-4 sm:p-8 mt-4 animate-pop">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <i className="fi fi-rr-apps text-blue-600"></i> Mening Bloklarim
          </h1>
          <button 
            onClick={() => { setIsCreateModalOpen(true); setCreateErrorMsg(""); }} 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 w-full sm:w-auto flex justify-center items-center gap-2"
          >
            <i className="fi fi-rr-layer-plus"></i> Yangi Blok
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blocks.length > 0 ? (
            blocks.map((block) => (
              <div key={block._id} className="relative group">
                
                {/* YOKI BURCHAKDAGI HARAKATLAR (Edit va Delete) */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.preventDefault(); openEditModal(block); }}
                    className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100 shadow-sm border border-blue-100 transition-colors"
                    title="Blokni tahrirlash"
                  >
                    <i className="fi fi-rr-edit translate-y-[1px]"></i>
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); setDeletingBlock(block); }}
                    className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 shadow-sm border border-red-100 transition-colors"
                    title="Blokni o'chirish"
                  >
                    <i className="fi fi-rr-trash translate-y-[1px]"></i>
                  </button>
                </div>

                <Link href={`/dashboard/block/${block._id}`}>
                  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer h-full flex flex-col justify-between pt-8">
                    <div>
                      <span className="text-5xl block mb-4 text-blue-500 group-hover:scale-110 transition-transform origin-left">
                        {block.icon && block.icon.startsWith("fi-") ? (
                          <i className={`fi ${block.icon}`}></i>
                        ) : (
                          <i className="fi fi-rr-folder"></i> 
                        )}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-800 break-words pr-16">{block.name}</h3>
                    </div>
                    <div className="mt-6 flex justify-between items-center text-sm font-bold text-gray-400 group-hover:text-blue-600 transition-colors">
                      Ochish <i className="fi fi-rr-arrow-right translate-y-[1px]"></i>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full p-16 bg-white rounded-[2rem] border border-dashed border-gray-300 text-center">
              <span className="text-6xl block mb-4 text-gray-300">
                <i className="fi fi-rr-box-open-full"></i>
              </span>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Hali bloklar yo'q</h3>
              <p className="text-gray-500">Tepadagi "Yangi Blok" tugmasi orqali birinchi blokingizni yarating.</p>
            </div>
          )}
        </div>

        {/* ================================================= */}
        {/* BLOK YARATISH MODALI */}
        {/* ================================================= */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-overlay">
            <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full shadow-2xl animate-pop relative">
              <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold transition-colors">
                <i className="fi fi-rr-cross-small text-xl translate-y-[1px]"></i>
              </button>

              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <i className="fi fi-rr-layer-plus text-green-600"></i> Yangi blok
              </h2>
              
              {createErrorMsg && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100 flex items-center gap-2 animate-pop">
                  <i className="fi fi-rr-exclamation"></i> {createErrorMsg}
                </div>
              )}

              <form onSubmit={handleCreateBlock} className="space-y-5">
                <div className="hidden">
                  <input type="text" value={blockIcon} readOnly />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <i className="fi fi-rr-text"></i> Blok nomi
                  </label>
                  <input 
                    type="text" 
                    value={blockName} 
                    onChange={(e) => setBlockName(e.target.value)} 
                    placeholder="Masalan: Tarix 1-kurs" 
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 font-medium text-gray-900" 
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                    Bekor qilish
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <><i className="fi fi-rr-spinner animate-spin"></i> Yaratilmoqda...</>
                    ) : (
                      <><i className="fi fi-rr-check"></i> Yaratish</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* BLOKNI TAHRIRLASH MODALI */}
        {/* ================================================= */}
        {editingBlock && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-overlay">
            <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full shadow-2xl animate-pop relative">
              <button onClick={() => setEditingBlock(null)} className="absolute top-6 right-6 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold transition-colors">
                <i className="fi fi-rr-cross-small text-xl translate-y-[1px]"></i>
              </button>

              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <i className="fi fi-rr-edit text-blue-600"></i> Blokni Tahrirlash
              </h2>
              
              {editErrorMsg && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100 flex items-center gap-2 animate-pop">
                  <i className="fi fi-rr-exclamation"></i> {editErrorMsg}
                </div>
              )}

              <form onSubmit={handleEditBlock} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <i className="fi fi-rr-text"></i> Yangi blok nomi
                  </label>
                  <input 
                    type="text" 
                    value={editBlockName} 
                    onChange={(e) => setEditBlockName(e.target.value)} 
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 font-medium text-gray-900" 
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setEditingBlock(null)} className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                    Bekor qilish
                  </button>
                  <button type="submit" disabled={isEditing} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
                    {isEditing ? (
                      <><i className="fi fi-rr-spinner animate-spin"></i> Saqlanmoqda...</>
                    ) : (
                      <><i className="fi fi-rr-disk"></i> Saqlash</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* O'CHIRISHNI TASDIQLASH MODALI */}
        {/* ================================================= */}
        {deletingBlock && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-overlay">
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-pop text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border-4 border-red-100">
                <i className="fi fi-rr-trash"></i>
              </div>
              <h2 className="text-2xl font-black mb-2 text-gray-900">Blokni o'chirasizmi?</h2>
              <p className="text-sm font-medium text-gray-500 mb-8 px-2">
                Siz haqiqatan ham <b className="text-gray-800">"{deletingBlock.name}"</b> blokini o'chirmoqchimisiz? Bu jarayonni ortga qaytarib bo'lmaydi va uning ichidagi barcha testlar o'chib ketishi mumkin.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeletingBlock(null)} 
                  className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-all"
                >
                  Bekor qilish
                </button>
                <button 
                  onClick={handleDeleteBlock} 
                  disabled={isDeleting} 
                  className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-200 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <><i className="fi fi-rr-spinner animate-spin"></i> O'chirilmoqda...</>
                  ) : (
                    <><i className="fi fi-rr-trash"></i> Ha, o'chirish</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}