"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();

  // BOSQICHLAR: 1=Email, 2=OTP, 3=Parol Modal, 4=Success Modal
  const [step, setStep] = useState(1); 
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ========================================================
  // TAYMER UCHUN STATELAR
  // ========================================================
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval;
    if (step === 2 && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // 1. EMAILGA KOD SO'RASH (Yoki qayta yuborish)
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccessMsg("Kod emailingizga yuborildi! (Spamni ham tekshiring)");
        setStep(2); // OTP kiritish bosqichiga o'tish
        setTimeLeft(60); // Taymerni 1 daqiqadan boshlash
        setCanResend(false); 
      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      setErrorMsg("Server xatosi");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. OTP NI TASDIQLASH VA PAROL MODALINI OCHISH
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (otp.length !== 6) {
      return setErrorMsg("OTP kod 6 xonali bo'lishi kerak!");
    }

    setIsLoading(true);
    try {
      // 2-API: OTP ni tekshiramiz
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep(3); // Kod to'g'ri bo'lsa, Parol yaratish modalini ochamiz
      } else {
        setErrorMsg(data.message || "OTP kod xato kiritildi!");
      }
    } catch (err) {
      setErrorMsg("Server xatosi");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. PAROLNI YANGILASH (API GA SO'ROV)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword !== confirmPassword) {
      return setErrorMsg("Parollar bir-biriga mos kelmadi!");
    }

    if (newPassword.length < 6) {
      return setErrorMsg("Parol kamida 6 ta belgidan iborat bo'lishi kerak!");
    }

    setIsLoading(true);

    try {
      // 3-API: Yangi parolni saqlash
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep(4); // Muvaffaqiyatli Modalni ochish
      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      setErrorMsg("Server xatosi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
      {/* Orqa fon bezagi */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 opacity-20 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-400 opacity-20 blur-[100px] rounded-full"></div>

      {/* ASOSIY OYNA (Email va OTP uchun) */}
      <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-gray-100 animate-pop relative z-10">
        <h1 className="text-3xl font-black text-gray-900 mb-2 text-center">Parolni tiklash 🔐</h1>
        <p className="text-gray-500 text-center mb-8 font-medium">Xavotir olmang, hammasini to'g'rilaymiz!</p>

        {errorMsg && step < 3 && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold border border-red-100 flex items-center gap-2 animate-pop">
            <span>⚠️</span> {errorMsg}
          </div>
        )}
        {successMsg && step === 2 && (
          <div className="bg-green-50 text-green-700 p-4 rounded-2xl mb-6 text-sm font-bold border border-green-100 flex items-center gap-2 animate-pop">
            <span>✅</span> {successMsg}
          </div>
        )}

        {/* 1-BOSQICH (Email kiritish) */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-6 animate-pop">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Akkaunt Emailingiz</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 font-medium" 
                placeholder="misol@mail.com" 
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg text-lg active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Kutilmoqda..." : "Kod jo'natish"}
            </button>
          </form>
        )}

        {/* 2-BOSQICH (Faqat OTP kiritish va API ga tekshirishga yuborish) */}
        {(step === 2 || step === 3) && (
          <form onSubmit={handleVerifyOtp} className="space-y-6 animate-pop">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700">Emailga kelgan kod (OTP)</label>
                {step === 2 && (
                  <span className={`text-xs font-black px-2 py-1 rounded-lg ${timeLeft > 0 ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"}`}>
                    ⏱ {formatTime(timeLeft)}
                  </span>
                )}
              </div>
              <input 
                type="text" 
                required 
                maxLength="6"
                value={otp} 
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} // Faqat raqam
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 font-black text-center text-2xl tracking-[0.5em]" 
                placeholder="------" 
              />
              
              {/* Qayta yuborish tugmasi */}
              {step === 2 && (
                <div className="text-right mt-2">
                  <button 
                    type="button" 
                    onClick={handleSendOtp} 
                    disabled={!canResend || isLoading} 
                    className={`text-xs font-bold transition-colors ${canResend ? "text-blue-600 hover:text-blue-800 hover:underline" : "text-gray-400 cursor-not-allowed"}`}
                  >
                    Kodni qayta yuborish
                  </button>
                </div>
              )}
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg text-lg active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Tekshirilmoqda..." : "Tasdiqlash"}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mt-2">
              ← Emailni o'zgartirish
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link href="/login" className="text-gray-500 font-bold hover:text-blue-600 transition-colors text-sm">
            ← Tizimga kirish sahifasiga qaytish
          </Link>
        </div>
      </div>

      {/* ================================================= */}
      {/* 3-BOSQICH: YANGI PAROL YARATISH MODALI */}
      {/* ================================================= */}
      {step === 3 && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-overlay">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-pop">
            <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">Yangi parol</h3>
            
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-bold border border-red-100 flex items-center gap-2">
                <span>⚠️</span> {errorMsg}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* YANGI PAROL */}
              <div className="relative">
                <label className="block text-sm font-bold text-gray-700 mb-2">Yangi parol</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  minLength="6"
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 font-medium pr-12" 
                  placeholder="********" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600 transition-colors text-lg"
                >
                  {showPassword ? "👁️‍🗨️" : "👁️"}
                </button>
              </div>

              {/* PAROLNI TASDIQLASH */}
              <div className="relative">
                <label className="block text-sm font-bold text-gray-700 mb-2">Parolni tasdiqlang</label>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  required 
                  minLength="6"
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 font-medium pr-12" 
                  placeholder="********" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600 transition-colors text-lg"
                >
                  {showConfirmPassword ? "👁️‍🗨️" : "👁️"}
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setStep(2)} className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                  Orqaga
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-md disabled:opacity-50">
                  {isLoading ? "Kutilmoqda..." : "Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* 4-BOSQICH: MUVAFFAQIYATLI MODALI (SUCCESS) */}
      {/* ================================================= */}
      {step === 4 && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-overlay">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center animate-pop">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">✅</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">Tayyor!</h3>
            <p className="text-gray-600 mb-8 font-medium">Parolingiz muvaffaqiyatli o'zgartirildi. Endi yangi parol bilan tizimga kirishingiz mumkin.</p>
            <button 
              onClick={() => router.push("/login")} 
              className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg active:scale-95"
            >
              Tizimga kirish 🚪
            </button>
          </div>
        </div>
      )}

    </div>
  );
}