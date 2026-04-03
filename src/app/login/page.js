"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("Barcha maydonlarni to'ldiring");
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email yoki parol noto'g'ri");
        setIsLoading(false);
        return;
      }

      if (res?.ok) {
        // Tizimga kirgach, foydalanuvchining ma'lumotlarini (jumladan rolini) tortib olamiz
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        
        // Roliga qarab o'zining kabinetiga jo'natamiz
        if (sessionData?.user?.role === "teacher") {
          window.location.href = "/teacher"; 
        } else {
          window.location.href = "/";
        }
      }
    } catch (error) {
      setError("Server bilan ulanishda xato");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-xl border border-gray-100 max-w-md w-full animate-pop">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-lg -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
            T.
          </div>
          <h1 className="text-2xl font-black text-gray-900">Tizimga kirish</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Testify hisobingizga kiring</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold text-center flex items-center justify-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              placeholder="name@email.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Parol</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full py-4 bg-gray-900 hover:bg-black text-white font-black rounded-xl transition-all shadow-lg active:scale-95 mt-2 disabled:opacity-50"
          >
            {isLoading ? "Kirilmoqda..." : "Kirish"}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500 font-medium text-sm">
          Akkauntingiz yo'qmi? <Link href="/register" className="text-blue-600 font-bold hover:underline">Ro'yxatdan o'tish</Link>
        </p>
      </div>
    </div>
  );
}