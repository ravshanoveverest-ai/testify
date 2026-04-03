import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Exam from "@/models/Exam";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ message: "Ruxsat etilmagan!" }, { status: 401 });
    }

    const { title, text, totalQuestions, questionsPerStudent, studentCount, startTime, endTime, examType, maxScore } = await request.json();

    if (!text || !startTime || !endTime || !examType || !maxScore) {
      return NextResponse.json({ message: "Barcha maydonlarni to'ldiring!" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // MANTIQ: Nazorat turiga qarab AI ga har xil buyruq (Prompt) beramiz!
    let prompt = "";
    if (examType === "test") {
      prompt = `Siz professional o'qituvchisiz. Matn asosida aniq ${totalQuestions} ta sifatli test savoli tuzing. Har birida 4 ta variant va 1 ta to'g'ri javob bo'lsin.
      FAQAT xatosiz JSON massiv qaytaring: [{"question": "savol matni", "options": ["v1", "v2", "v3", "v4"], "answer": "to'g'ri variant matni"}]
      Matn: ${text}`;
    } else {
      prompt = `Siz professional o'qituvchisiz. Matn asosida aniq ${totalQuestions} ta yozma (ochiq) savol tuzing. Variantlar KERAK EMAS. Keyinroq talaba javobini AI tekshirishi uchun o'zingiz aniq va to'liq to'g'ri javobni yozib qo'ying.
      FAQAT xatosiz JSON massiv qaytaring: [{"question": "savol matni", "options": [], "answer": "to'liq va to'g'ri javob"}]
      Matn: ${text}`;
    }

    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    let responseText = response.text;
    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let questions = [];
    try {
      questions = JSON.parse(responseText);
    } catch (e) {
      return NextResponse.json({ message: "AI javobni noto'g'ri formatda qaytardi. Iltimos, matnni o'zgartirib ko'ring." }, { status: 500 });
    }

    // MANTIQ: Parollarga TEST- yoki WRITTEN- qo'shamiz
    const passcodes = [];
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const prefix = examType === "written" ? "WRITTEN" : "TEST";
    
    for(let i = 0; i < studentCount; i++) {
      let code = "";
      for(let j=0; j<5; j++) code += chars.charAt(Math.floor(Math.random() * chars.length));
      passcodes.push({ code: `${prefix}-${code}`, status: "unused" }); // Natija: TEST-A8B29 yoki WRITTEN-X9K21
    }

    await connectMongoDB();
    const newExam = await Exam.create({
      teacherId: session.user.id,
      title,
      examType,
      maxScore,
      totalQuestions: questions.length,
      questionsPerStudent,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      questions: questions.map(q => ({
        text: q.question,
        options: q.options || [],
        answer: q.answer
      })),
      passcodes
    });

    // Frontendda yuklab olishi uchun bazaga yozilgan savollarni qaytarib yuboramiz
    return NextResponse.json({ 
      message: "Imtihon yaratildi!", 
      examId: newExam._id,
      generatedQuestions: questions 
    }, { status: 201 });

  } catch (error) {
    console.log("EXAM CREATION ERROR:", error);
    return NextResponse.json({ message: "Server xatosi" }, { status: 500 });
  }
}