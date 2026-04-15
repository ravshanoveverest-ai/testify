// import { NextResponse } from "next/server";
// import connectMongoDB from "@/lib/mongodb";
// import Exam from "@/models/Exam";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { GoogleGenAI } from "@google/genai";

// export async function POST(request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== "teacher") {
//       return NextResponse.json({ message: "Ruxsat etilmagan!" }, { status: 401 });
//     }

//     const { title, text, totalQuestions, questionsPerStudent, studentCount, startTime, endTime, examType, maxScore } = await request.json();

//     if (!text || !startTime || !endTime || !examType || !maxScore) {
//       return NextResponse.json({ message: "Barcha maydonlarni to'ldiring!" }, { status: 400 });
//     }

//     const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
//     // MANTIQ: Nazorat turiga qarab AI ga har xil buyruq (Prompt) beramiz!
//     let prompt = "";
//     if (examType === "test") {
//       prompt = `Siz professional o'qituvchisiz. Matn asosida aniq ${totalQuestions} ta sifatli test savoli tuzing. Har birida 4 ta variant va 1 ta to'g'ri javob bo'lsin.
//       FAQAT xatosiz JSON massiv qaytaring: [{"question": "savol matni", "options": ["v1", "v2", "v3", "v4"], "answer": "to'g'ri variant matni"}]
//       Matn: ${text}`;
//     } else {
//       prompt = `Siz professional o'qituvchisiz. Matn asosida aniq ${totalQuestions} ta yozma (ochiq) savol tuzing. Variantlar KERAK EMAS. Keyinroq talaba javobini AI tekshirishi uchun o'zingiz aniq va to'liq to'g'ri javobni yozib qo'ying.
//       FAQAT xatosiz JSON massiv qaytaring: [{"question": "savol matni", "options": [], "answer": "to'liq va to'g'ri javob"}]
//       Matn: ${text}`;
//     }

//     const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
//     let responseText = response.text;
//     responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
//     let questions = [];
//     try {
//       questions = JSON.parse(responseText);
//     } catch (e) {
//       return NextResponse.json({ message: "AI javobni noto'g'ri formatda qaytardi. Iltimos, matnni o'zgartirib ko'ring." }, { status: 500 });
//     }

//     // MANTIQ: Parollarga TEST- yoki WRITTEN- qo'shamiz
//     const passcodes = [];
//     const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//     const prefix = examType === "written" ? "WRITTEN" : "TEST";
    
//     for(let i = 0; i < studentCount; i++) {
//       let code = "";
//       for(let j=0; j<5; j++) code += chars.charAt(Math.floor(Math.random() * chars.length));
//       passcodes.push({ code: `${prefix}-${code}`, status: "unused" }); // Natija: TEST-A8B29 yoki WRITTEN-X9K21
//     }

//     await connectMongoDB();
//     const newExam = await Exam.create({
//       teacherId: session.user.id,
//       title,
//       examType,
//       maxScore,
//       totalQuestions: questions.length,
//       questionsPerStudent,
//       startTime: new Date(startTime),
//       endTime: new Date(endTime),
//       questions: questions.map(q => ({
//         text: q.question,
//         options: q.options || [],
//         answer: q.answer
//       })),
//       passcodes
//     });

//     // Frontendda yuklab olishi uchun bazaga yozilgan savollarni qaytarib yuboramiz
//     return NextResponse.json({ 
//       message: "Imtihon yaratildi!", 
//       examId: newExam._id,
//       generatedQuestions: questions 
//     }, { status: 201 });

//   } catch (error) {
//     console.log("EXAM CREATION ERROR:", error);
//     return NextResponse.json({ message: "Server xatosi" }, { status: 500 });
//   }
// }

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

    const { title, text, totalQuestions, questionsPerStudent, studentCount, startTime, endTime, examType, maxScore, creationMode } = await request.json();

    if (!text || !startTime || !endTime || !examType || !maxScore) {
      return NextResponse.json({ message: "Barcha maydonlarni to'ldiring!" }, { status: 400 });
    }

    let questions = [];

    // ==========================================
    // 1-REJIM: QO'LDA (MANUAL TXT / JSON PARSER)
    // ==========================================
    if (creationMode === "manual") {
      try {
        // Avval sof JSON formatda kiritganmi tekshiramiz
        questions = JSON.parse(text);
      } catch (e) {
        // Agar JSON bo'lmasa, oddiy TXT deb hisoblab o'qiymiz
        const blocks = text.split(/\n\s*\n/); // Savollarni bo'sh qatorlardan ajratamiz
        
        for (let block of blocks) {
          const lines = block.split('\n').filter(l => l.trim().length > 0);
          if (lines.length >= 2) {
            const qText = lines[0].replace(/^\d+[\.\)]\s*/, '').trim(); // "1. Savol" dagi raqamni kesib oladi
            let options = [];
            let answer = "";
            
            for (let i = 1; i < lines.length; i++) {
              let line = lines[i].trim();
              if (line.toLowerCase().startsWith("javob:") || line.toLowerCase().startsWith("j:")) {
                answer = line.split(":")[1].trim();
              } else {
                // "A) Variant" dagi "A)" qismini olib tashlaydi
                options.push(line.replace(/^[A-D][\)\.]\s*/i, '').trim());
              }
            }
            
            // Agar javob yozish esdan chiqqan bo'lsa, zaxira sifatida 1-variantni to'g'ri deb oladi
            if(!answer && options.length > 0) answer = options[0]; 
            
            questions.push({ question: qText, options, answer });
          }
        }
      }

      if (questions.length === 0) {
        return NextResponse.json({ message: "Matndan hech qanday savol topilmadi. Iltimos formatni tekshiring!" }, { status: 400 });
      }

    // ==========================================
    // 2-REJIM: AI ORQALI (GEMINI)
    // ==========================================
    } else {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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
      
      try {
        questions = JSON.parse(responseText);
      } catch (e) {
        return NextResponse.json({ message: "AI javobni noto'g'ri formatda qaytardi. Iltimos, matnni o'zgartirib ko'ring." }, { status: 500 });
      }
    }

    // Parollarni yaratish (Ikkala rejim uchun ham umumiy)
    const passcodes = [];
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const prefix = examType === "written" ? "WRITTEN" : "TEST";
    
    for(let i = 0; i < studentCount; i++) {
      let code = "";
      for(let j=0; j<5; j++) code += chars.charAt(Math.floor(Math.random() * chars.length));
      passcodes.push({ code: `${prefix}-${code}`, status: "unused" });
    }

    await connectMongoDB();
    const newExam = await Exam.create({
      teacherId: session.user.id,
      title,
      examType,
      maxScore,
      totalQuestions: questions.length, // AI emas, haqiqiy kiritilgan/yaratilgan savollar soni
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