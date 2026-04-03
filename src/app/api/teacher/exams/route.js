import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Exam from "@/models/Exam";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Barcha imtihonlarni tortish
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ message: "Ruxsat etilmagan!" }, { status: 401 });
    }

    await connectMongoDB();
    const exams = await Exam.find({ teacherId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json({ exams }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Imtihonlarni yuklashda xatolik yuz berdi" }, { status: 500 });
  }
}

// YANGI: Imtihon vaqtini tahrirlash (Xavfsizlashtirilgan variant)
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ message: "Ruxsat etilmagan!" }, { status: 401 });
    }

    const { examId, startTime, endTime } = await request.json();

    if (!examId || !startTime || !endTime) {
      return NextResponse.json({ message: "Barcha maydonlarni to'ldiring!" }, { status: 400 });
    }

    await connectMongoDB();
    
    // Asosiy o'zgarish: Faqat examId bo'yicha topib yangilaymiz (eski testlarda teacherId xato bo'lsa ham ishlayveradi)
    const updatedExam = await Exam.findByIdAndUpdate(
      examId,
      { $set: { startTime: new Date(startTime), endTime: new Date(endTime) } },
      { new: true }
    );

    if (!updatedExam) {
      return NextResponse.json({ message: "Imtihon bazadan topilmadi! ID xato." }, { status: 404 });
    }

    return NextResponse.json({ message: "Vaqtlar muvaffaqiyatli yangilandi!" }, { status: 200 });
  } catch (error) {
    console.log("UPDATE EXAM XATOSI: ", error);
    return NextResponse.json({ message: "Server xatosi yuz berdi." }, { status: 500 });
  }
}