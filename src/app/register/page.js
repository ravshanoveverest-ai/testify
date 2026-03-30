"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // VALIDATION
    if (password.length < 8) {
      setError("Xavfsizlik uchun parol kamida 8 ta belgidan iborat bo'lishi shart!");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        // Muvaffaqiyatli bo'lsa OTP yuborish kerak (keyingi bosqichda ulaymiz)
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Xatolik yuz berdi.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 animate-pop">
        <h1 className="text-3xl font-black text-gray-900 mb-6 text-center">Ro'yxatdan o'tish 🚀</h1>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-center text-sm font-bold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Ismingiz</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alisher..." required className="w-full px-5 py-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alisher@mail.com" required className="w-full px-5 py-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          <div className="relative">
            <label className="block text-sm font-bold text-gray-700 mb-2">Parol (Kamida 8 belgi)</label>
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" required className="w-full px-5 py-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[44px] text-gray-400 hover:text-gray-600 transition-colors">
              {showPassword ? "👁️‍🗨️" : "👁️"}
            </button>
          </div>
          
          <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-all shadow-md text-lg mt-2 active:scale-95">
            Ro'yxatdan o'tish
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 font-medium">
          Akkauntingiz bormi? <Link href="/login" className="text-blue-600 font-black hover:underline">Kirish</Link>
        </p>
      </div>
    </div>
  );
}