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

  // Modal va Form statelari
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blockName, setBlockName] = useState("");
  const [blockIcon, setBlockIcon] = useState("📁");
  const [errorMsg, setErrorMsg] = useState(""); // XATOLIK UCHUN POP-UP STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // BLOK YARATISH FUNKSIYASI
  const handleCreateBlock = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // Eski xatoni tozalash
    if (!blockName.trim()) {
      setErrorMsg("Blok nomini kiritish shart!");
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
        // Muvaffaqiyatli bo'lsa
        setBlocks([data.block, ...blocks]);
        setIsModalOpen(false);
        setBlockName("");
        setBlockIcon("📁");
      } else {
        // XATOLIK BO'LSA POP-UP DA KO'RSATAMIZ (Masalan: Bir xil nom)
        setErrorMsg(data.message || "Xatolik yuz berdi");
      }
    } catch (error) {
      setErrorMsg("Server bilan ulanishda xatolik");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center font-bold text-gray-400">Yuklanmoqda...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 mt-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <h1 className="text-3xl font-black text-gray-900">Mening Bloklarim</h1>
        <button 
          onClick={() => { setIsModalOpen(true); setErrorMsg(""); }} 
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 w-full sm:w-auto flex justify-center gap-2"
        >
          <span>+</span> Yangi Blok
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {blocks.length > 0 ? (
          blocks.map((block) => (
            <Link key={block._id} href={`/dashboard/block/${block._id}`}>
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group h-full flex flex-col justify-between">
                <div>
                  <span className="text-5xl block mb-4 group-hover:scale-110 transition-transform origin-left">{block.icon}</span>
                  <h3 className="text-2xl font-bold text-gray-800 break-words">{block.name}</h3>
                </div>
                <div className="mt-6 flex justify-between items-center text-sm font-bold text-gray-400 group-hover:text-blue-600 transition-colors">
                  Ochish &rarr;
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full p-16 bg-white rounded-[2rem] border border-dashed border-gray-300 text-center">
            <span className="text-6xl block mb-4">📭</span>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Hali bloklar yo'q</h3>
            <p className="text-gray-500">Tepadagi "Yangi Blok" tugmasi orqali birinchi blokingizni yarating.</p>
          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* BLOK YARATISH MODALI (POP-UP BILAN) */}
      {/* ================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-overlay">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-pop">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Yangi blok yaratish</h2>
            
            {/* XATOLIK XABARI UCHUN POP-UP QISMI 👇 */}
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100 flex items-center gap-2 animate-pop">
                <span>⚠️</span> {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateBlock} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Ikonka (Emoji)</label>
                <input 
                  type="text" 
                  value={blockIcon} 
                  onChange={(e) => setBlockIcon(e.target.value)} 
                  maxLength="2"
                  className="w-20 px-4 py-3 text-2xl text-center rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Blok nomi</label>
                <input 
                  type="text" 
                  value={blockName} 
                  onChange={(e) => setBlockName(e.target.value)} 
                  placeholder="Masalan: Tarix" 
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 font-medium" 
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                  Bekor qilish
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md disabled:opacity-50">
                  {isSubmitting ? "Yaratilmoqda..." : "Yaratish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}