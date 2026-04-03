import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Exam from "@/models/Exam";
import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    const { examId, passcode, answers } = await request.json();

    if (!examId || !passcode || !answers) {
      return NextResponse.json({ message: "Ma'lumotlar to'liq emas!" }, { status: 400 });
    }

    await connectMongoDB();
    const exam = await Exam.findById(examId);
    if (!exam) return NextResponse.json({ message: "Imtihon topilmadi!" }, { status: 404 });

    let finalScore = 0;
    let evaluations = {}; // AI ning batafsil izohlari uchun
    const maxScore = exam.maxScore || 100;
    const questionValue = maxScore / exam.questionsPerStudent;

    if (exam.examType === "test" || !exam.examType) {
      // TEST UCHUN ODATIY HISOBLASH
      let correctCount = 0;
      for (const [questionId, selectedOption] of Object.entries(answers)) {
        const question = exam.questions.find(q => q._id.toString() === questionId);
        if (question && question.answer === selectedOption) correctCount++;
      }
      finalScore = Math.round(correctCount * questionValue);

    } else {
      // YOZMA ISH UCHUN MURAKKAB AI TEKSHIRUVI
      const gradingData = [];
      for (const [questionId, studentText] of Object.entries(answers)) {
        const question = exam.questions.find(q => q._id.toString() === questionId);
        if (question) {
          // ID ni ham jo'natamiz, keyin qaysi savolga tegishliligini bilish uchun
          gradingData.push({ questionId: question._id.toString(), question: question.text, correctAnswer: question.answer, studentAnswer: studentText });
        }
      }

      if (gradingData.length > 0) {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `
          Siz qattiqqo'l, lekin adolatli universitet professorisiz. Talaba yozma imtihon topshirdi. 
          Jami maksimal ball: ${maxScore}. Har bir savol ${questionValue} ballga teng.
          
          Quyida savollar ro'yxati berilgan:
          ${JSON.stringify(gradingData)}
          
          Vazifangiz: Talabaning har bir javobini "To'g'ri javob" bilan solishtirib chiqing. 
          
          FAQAT xatosiz JSON formatida qaytaring. Format aniq quyidagicha bo'lishi SHART:
          {
            "totalScore": <barcha_savollar_yigindisi_ball>,
            "evaluations": {
              "<questionId_shu_yerga_yoziladi>": {
                "score": <faqat_shu_savol_uchun_qoyilgan_ball>,
                "feedback": "<Nima uchun shuncha ball qo'yganingizni, talaba javobining yutuq va kamchiliklarini o'zbek tilida qisqacha, tushunarli va professional izohlang>"
              }
            }
          }
        `;
        
        try {
          const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
          let responseText = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsedResponse = JSON.parse(responseText);
          
          finalScore = parsedResponse.totalScore;
          evaluations = parsedResponse.evaluations || {}; // AI izohlarini saqlab olamiz
        } catch (e) {
          console.log("AI Baholashda xatolik:", e);
          finalScore = 0;
        }
      }
    }

    if (finalScore > maxScore) finalScore = maxScore;

    // BAZAGA SAQLASH
    await Exam.updateOne(
      { _id: examId, "passcodes.code": passcode },
      { 
        $set: { 
          "passcodes.$.status": "completed", 
          "passcodes.$.score": finalScore,
          "passcodes.$.studentAnswers": answers,
          "passcodes.$.aiEvaluation": evaluations // AI IZOHLARINI HAM BAZAGA YOZAMIZ
        } 
      }
    );

    return NextResponse.json({ message: "Muvaffaqiyatli topshirildi", score: finalScore, maxScore: maxScore }, { status: 200 });

  } catch (error) {
    console.log("SUBMIT EXAM XATOSI: ", error);
    return NextResponse.json({ message: "Server xatosi" }, { status: 500 });
  }
}