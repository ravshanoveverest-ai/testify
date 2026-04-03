import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    // 1. Ma'lumotlar to'liqligini tekshirish
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Barcha maydonlarni to'ldiring!" }, { status: 400 });
    }

    await connectMongoDB();

    // 2. Email bandligini tekshirish
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Bu email band! Iltimos, boshqa email ishlating." }, { status: 400 });
    }

    // 3. Parolni shifrlash
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 4. Yangi foydalanuvchini roliga qarab saqlash
    await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role || "student" 
    });

    return NextResponse.json({ message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!" }, { status: 201 });
  } catch (error) {
    console.log("REGISTER XATOSI: ", error);
    return NextResponse.json({ message: `Server xatosi: ${error.message}` }, { status: 500 });
  }
}