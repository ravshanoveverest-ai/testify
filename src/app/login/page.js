// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password) {
//       return setError("Barcha maydonlarni to'ldiring");
//     }

//     setIsLoading(true);

//     try {
//       const res = await signIn("credentials", {
//         email,
//         password,
//         redirect: false,
//       });

//       if (res?.error) {
//         setError("Email yoki parol noto'g'ri");
//         setIsLoading(false);
//         return;
//       }

//       if (res?.ok) {
//         // Tizimga kirgach, foydalanuvchining ma'lumotlarini (jumladan rolini) tortib olamiz
//         const sessionRes = await fetch("/api/auth/session");
//         const sessionData = await sessionRes.json();
        
//         // Roliga qarab o'zining kabinetiga jo'natamiz
//         if (sessionData?.user?.role === "teacher") {
//           window.location.href = "/teacher"; 
//         } else {
//           window.location.href = "/";
//         }
//       }
//     } catch (error) {
//       setError("Server bilan ulanishda xato");
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-[80vh] flex items-center justify-center p-4">
//       <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-xl border border-gray-100 max-w-md w-full animate-pop">
        
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-lg -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
//             T.
//           </div>
//           <h1 className="text-2xl font-black text-gray-900">Tizimga kirish</h1>
//           <p className="text-gray-500 text-sm mt-1 font-medium">Testify hisobingizga kiring</p>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold text-center flex items-center justify-center gap-2">
//             <span>⚠️</span> {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
//             <input 
//               type="email" 
//               value={email} 
//               onChange={(e) => setEmail(e.target.value)} 
//               className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
//               placeholder="name@email.com" 
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-2">Parol</label>
//             <input 
//               type="password" 
//               value={password} 
//               onChange={(e) => setPassword(e.target.value)} 
//               className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
//               placeholder="••••••••" 
//             />
//           </div>

//           <button 
//             type="submit" 
//             disabled={isLoading} 
//             className="w-full py-4 bg-gray-900 hover:bg-black text-white font-black rounded-xl transition-all shadow-lg active:scale-95 mt-2 disabled:opacity-50"
//           >
//             {isLoading ? "Kirilmoqda..." : "Kirish"}
//           </button>
//         </form>

//         <p className="text-center mt-8 text-gray-500 font-medium text-sm">
//           Akkauntingiz yo'qmi? <Link href="/register" className="text-blue-600 font-bold hover:underline">Ro'yxatdan o'tish</Link>
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email yoki parol noto'g'ri");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Server bilan ulanishda xato yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 animate-pop">
      <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 max-w-md w-full relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-5 shadow-lg shadow-blue-500/30">
            T.
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Tizimga kirish</h1>
          <p className="text-gray-500 font-bold text-sm">Testify hisobingizga kiring</p>
        </div>

        {/* Xatolik xabari */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold text-center flex items-center justify-center gap-2 border border-red-100 animate-pop">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-blue-50/50 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" 
              placeholder="Sizning emailingiz"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-gray-700">Parol</label>
              
              {/* YANGI QO'SHILGAN QISM: Parolni unutdingizmi? */}
              <Link href="/forgot-password" className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                Parolni unutdingizmi?
              </Link>
            </div>
            
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" 
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full py-4 mt-2 bg-gray-900 text-white font-black text-lg rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70"
          >
            {isLoading ? "Kutilmoqda..." : "Kirish"}
          </button>
        </form>

        <p className="text-center font-bold text-gray-500 mt-8 text-sm">
          Akkauntingiz yo'qmi?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
            Ro'yxatdan o'tish
          </Link>
        </p>

      </div>
    </div>
  );
}