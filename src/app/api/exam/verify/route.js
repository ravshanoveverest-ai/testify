import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Exam from "@/models/Exam";

export async function POST(request) {
  try {
    const { passcode, name } = await request.json();

    if (!passcode || !name) return NextResponse.json({ message: "Ism va kodni to'liq kiriting!" }, { status: 400 });

    await connectMongoDB();
    const exam = await Exam.findOne({ "passcodes.code": passcode });

    if (!exam) return NextResponse.json({ message: "Kod noto'g'ri yoki mavjud emas!" }, { status: 404 });

    const passObj = exam.passcodes.find(p => p.code === passcode);
    if (passObj.status === "completed") {
      return NextResponse.json({ message: "Bu kod allaqachon ishlatilgan!" }, { status: 400 });
    }

    const now = new Date();
    const start = new Date(exam.startTime);
    const end = new Date(exam.endTime);

    if (now < start) return NextResponse.json({ message: `Imtihon hali boshlanmagan! Boshlanish vaqti: ${start.toLocaleString('uz-UZ')}` }, { status: 403 });
    if (now > end) return NextResponse.json({ message: "Kechikdingiz! Imtihon vaqti tugagan va yopilgan." }, { status: 403 });

    let allQuestions = [...exam.questions].sort(() => 0.5 - Math.random());
    let selectedQuestions = allQuestions.slice(0, exam.questionsPerStudent).map(q => ({
      _id: q._id,
      text: q.text,
      options: q.options ? q.options.sort(() => 0.5 - Math.random()) : []
    }));

    await Exam.updateOne(
      { "passcodes.code": passcode },
      { $set: { "passcodes.$.usedBy": name } }
    );

    return NextResponse.json({
      examId: exam._id,
      title: exam.title,
      endTime: exam.endTime,
      examType: exam.examType || "test", // FRONTEND UCHUN TURINI BERAMIZ
      maxScore: exam.maxScore || 100,    // MAKSIMAL BALL
      questions: selectedQuestions
    }, { status: 200 });

  } catch (error) {
    console.log("VERIFY PASSCODE XATOSI: ", error);
    return NextResponse.json({ message: "Server xatosi yuz berdi." }, { status: 500 });
  }
}