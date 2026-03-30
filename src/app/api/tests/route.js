import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Test from "@/models/Test";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Kirish shart" }, { status: 401 });

    const { title, visibility, blockId, questions } = await request.json();
    await connectMongoDB();

    // MUHIM: Savollar sonini aynan shu yerda hisoblab bazaga yozamiz (0 bo'lmasligi uchun)
    const questionCount = questions ? questions.length : 0;

    const newTest = await Test.create({
      title,
      visibility,
      blockId,
      questions,
      questionCount, 
      userId: session.user.id,
    });

    return NextResponse.json({ message: "Test yaratildi", test: newTest }, { status: 201 });
  } catch (error) {
    console.log("POST xatosi:", error);
    return NextResponse.json({ message: "Server xatosi" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const blockId = searchParams.get("blockId");
    const id = searchParams.get("id");
    const isPublic = searchParams.get("public");

    if (id) {
      const test = await Test.findById(id);
      return NextResponse.json({ test }, { status: 200 });
    }

    if (blockId) {
      const tests = await Test.find({ blockId }).sort({ createdAt: -1 });
      return NextResponse.json({ tests }, { status: 200 });
    }

    if (isPublic === "true") {
      const tests = await Test.find({ visibility: "Public" }).sort({ createdAt: -1 });
      return NextResponse.json({ tests }, { status: 200 });
    }

    return NextResponse.json({ message: "Parametr yetishmayapti" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: "Server xatosi" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await Test.findByIdAndDelete(id);
    return NextResponse.json({ message: "Test o'chirildi" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server xatosi" }, { status: 500 });
  }
}

// ==========================================================
// YANGI: TAHRIRLASH UCHUN (PUT METODI)
// ==========================================================
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Kirish shart" }, { status: 401 });

    const { id, title, visibility, questions } = await request.json();
    await connectMongoDB();

    // Yangilangan savollar sonini qayta hisoblaymiz
    const questionCount = questions ? questions.length : 0;

    const updatedTest = await Test.findByIdAndUpdate(
      id,
      { title, visibility, questions, questionCount },
      { new: true } // Yangilangan faylni qaytarish
    );

    return NextResponse.json({ message: "Test yangilandi", test: updatedTest }, { status: 200 });
  } catch (error) {
    console.log("PUT xatosi:", error);
    return NextResponse.json({ message: "Server xatosi" }, { status: 500 });
  }
}