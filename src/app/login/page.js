// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react"; // BU MUHIM!

// export default function Login() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false); // Ko'zcha uchun
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       const res = await signIn("credentials", {
//         email,
//         password,
//         redirect: false,
//       });

//       if (res.error) {
//         setError("Email yoki parol xato!");
//         setIsLoading(false);
//         return;
//       }

//       router.replace("dashboard"); // Muvaffaqiyatli bo'lsa dashboardga
//     } catch (err) {
//       setError("Tizimda xatolik yuz berdi.");
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 animate-pop">
//         <h1 className="text-3xl font-black text-gray-900 mb-2 text-center">Tizimga kirish 🔐</h1>
//         <p className="text-gray-500 text-center mb-8">Testify platformasiga qaytganingizdan xursandmiz</p>

//         {error && <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-center text-sm font-bold">{error}</div>}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-2">Email manzil</label>
//             <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50" placeholder="misol@mail.com" />
//           </div>

//           <div className="relative">
//             <div className="flex justify-between mb-2">
//               <label className="block text-sm font-bold text-gray-700">Parol</label>
//               <Link href="/forgot-password" title="Tiklash" className="text-xs text-blue-600 font-bold hover:underline">Parolni unutdingizmi?</Link>
//             </div>
//             <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-5 py-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50" placeholder="********" />
//             <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[44px] text-gray-400 hover:text-gray-600 transition-colors">
//               {showPassword ? "👁️‍🗨️" : "👁️"}
//             </button>
//           </div>

//           <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-all shadow-md text-lg active:scale-95 disabled:opacity-50">
//             {isLoading ? "Kirilmoqda..." : "Kirish"}
//           </button>
//         </form>

//         <p className="mt-8 text-center text-gray-500 font-medium">
//           Akkauntingiz yo'qmi? <Link href="/register" className="text-blue-600 font-black hover:underline">Ro'yxatdan o'ting</Link>
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, // Avtomatik redirectni o'chiramiz, o'zimiz qo'lda qilamiz
      });

      if (res.error) {
        setError("Email yoki parol xato!");
        setIsLoading(false);
        return;
      }

      // MANA SHU JOYI O'ZGARDi: Dashboard o'rniga Asosiy sahifaga jo'natamiz
      router.replace("/"); 
      router.refresh(); // Sessiya ma'lumotlari yangilanishi uchun
    } catch (err) {
      setError("Tizimda xatolik yuz berdi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-gray-100 animate-pop">
        <h1 className="text-3xl font-black text-gray-900 mb-2 text-center">Tizimga kirish 🔐</h1>
        <p className="text-gray-500 text-center mb-8 font-medium">Testify platformasiga xush kelibsiz</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-center text-sm font-bold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email manzil</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 font-medium" 
              placeholder="misol@mail.com" 
            />
          </div>

          <div className="relative">
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-bold text-gray-700">Parol</label>
              <Link href="/forgot-password" title="Tiklash" className="text-xs text-blue-600 font-bold hover:underline">Unutdingizmi?</Link>
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 font-medium" 
              placeholder="********" 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-4 top-[44px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? "👁️‍🗨️" : "👁️"}
            </button>
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg text-lg active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Kirilmoqda..." : "Kirish"}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 font-medium">
          Akkauntingiz yo'qmi? <Link href="/register" className="text-blue-600 font-black hover:underline">Ro'yxatdan o'ting</Link>
        </p>
      </div>
    </div>
  );
}