import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();
    await connectMongoDB();

    // Emailni kichik harflarga o'tkazib qidiramiz
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return NextResponse.json({ message: "Foydalanuvchi topilmadi" }, { status: 404 });
    }

    // Bazadagi kodni tekshirish uchun console.log qilib ko'ramiz (Terminalda ko'rinadi)
    console.log("Bazada saqlangan OTP:", user.resetOtp);
    console.log("Foydalanuvchi yuborgan OTP:", otp);

    // 1. Avval OTP bor-yo'qligini tekshiramiz
    if (!user.resetOtp) {
      return NextResponse.json({ message: "OTP kod topilmadi. Iltimos, kodni qayta so'rang." }, { status: 400 });
    }

    // 2. Kodlarni solishtiramiz (probelsiz va qat'iy tekshiruv)
    if (String(user.resetOtp).trim() !== String(otp).trim()) {
      return NextResponse.json({ message: "OTP kod xato kiritildi!" }, { status: 400 });
    }

    // 3. Vaqti o'tmaganligini tekshiramiz
    if (new Date(user.resetOtpExpiry) < new Date()) {
      return NextResponse.json({ message: "OTP kodining vaqti tugagan! Qaytadan so'rov yuboring." }, { status: 400 });
    }

    // Hammasi joyida bo'lsa
    return NextResponse.json({ message: "OTP tasdiqlandi!" }, { status: 200 });

  } catch (error) {
    console.log("OTP tekshirishda xato:", error);
    return NextResponse.json({ message: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}