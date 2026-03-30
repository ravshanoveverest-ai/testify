import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs"; // Parolni shifrlash uchun

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    await connectMongoDB();

    // 1. Bu email oldin ro'yxatdan o'tmaganini tekshiramiz
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Bu email allaqachon ro'yxatdan o'tgan!" }, { status: 400 });
    }

    // 2. Parolni shifrlaymiz (masalan '12345' parolini '$2a$10$X...' kabi tushunarsiz kodga aylantiradi)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Yangi foydalanuvchini bazaga yozamiz
    await User.create({ name, email, password: hashedPassword });

    return NextResponse.json({ message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!" }, { status: 201 });
  } catch (error) {
    console.log("Registratsiyada xato:", error);
    return NextResponse.json({ message: "Xatolik yuz berdi" }, { status: 500 });
  }
}