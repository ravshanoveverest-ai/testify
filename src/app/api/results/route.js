import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Result from "@/models/Result";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// NATIJANI BAZAGA SAQLASH (Test tugaganda ishladi)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Kirish shart" }, { status: 401 });

    const data = await request.json();
    await connectMongoDB();
    
    const newResult = await Result.create({ ...data, userId: session.user.id });
    return NextResponse.json({ message: "Saqlandi", result: newResult }, { status: 201 });
  } catch (error) {
    console.log("Natija saqlashda xato:", error);
    return NextResponse.json({ message: "Server xatosi" }, { status: 500 });
  }
}

// FOYDALANUVCHINING BARCHA NATIJALARINI OLISH
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Kirish shart" }, { status: 401 });

    await connectMongoDB();
    // Eng oxirgi ishlangan testlar birinchi chiqadi
    const results = await Result.find({ userId: session.user.id }).sort({ createdAt: -1 });
    
    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server xatosi" }, { status: 500 });
  }
}