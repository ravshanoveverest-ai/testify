import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import Block from "@/models/Block";
import Test from "@/models/Test";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// MANA SHU YERGA SIZNING EMAILINGIZ YOZILADI
const ADMIN_EMAIL = "ravshanoveverest@gmail.com"; 

export async function GET(request) {
  try {
    // 1. XAVFSIZLIK: Faqat Admin kira oladi
    const session = await getServerSession(authOptions);
    if (!session || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ message: "Ruxsat etilmagan. Siz admin emassiz!" }, { status: 403 });
    }

    await connectMongoDB();

    // 2. STATISTIKANI HISOBLASH
    const usersCount = await User.countDocuments();
    const blocksCount = await Block.countDocuments();
    const testsCount = await Test.countDocuments();

    // 3. BARCHA TESTLARNI OLISH (Kim yaratganini ham qo'shib olamiz - populate)
    const recentTests = await Test.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(100); // Oxirgi 100 ta testni ko'rsatadi

    return NextResponse.json({
      stats: { usersCount, blocksCount, testsCount },
      recentTests
    }, { status: 200 });

  } catch (error) {
    console.log("Admin API Xatosi:", error);
    return NextResponse.json({ message: "Server xatosi" }, { status: 500 });
  }
}

// ADMIN TOMONIDAN TESTNI O'CHIRISH
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ message: "Ruxsat etilmagan!" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await connectMongoDB();
    await Test.findByIdAndDelete(id); // Admin birovning testini ham o'chira oladi

    return NextResponse.json({ message: "Test tizimdan o'chirildi" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server xatosi" }, { status: 500 });
  }
}