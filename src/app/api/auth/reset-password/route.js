import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, otp, newPassword } = await request.json();
    await connectMongoDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Foydalanuvchi topilmadi" }, { status: 404 });
    }

    // OTP to'g'riligini va vaqti o'tmaganligini tekshirish
    if (user.resetOtp !== otp) {
      return NextResponse.json({ message: "OTP kod xato kiritildi!" }, { status: 400 });
    }

    if (user.resetOtpExpiry < new Date()) {
      return NextResponse.json({ message: "OTP kodining vaqti tugagan! Qaytadan so'rov yuboring." }, { status: 400 });
    }

    // Yangi parolni heshlash (shifrlash)
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Parolni yangilash va OTP ni tozalash
    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpiry = null;
    await user.save();

    return NextResponse.json({ message: "Parol muvaffaqiyatli o'zgartirildi!" }, { status: 200 });
  } catch (error) {
    console.log("Parolni tiklashda xato:", error);
    return NextResponse.json({ message: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}