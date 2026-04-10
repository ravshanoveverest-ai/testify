import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Tizim avtomatik ravishda .env fayldagi GEMINI_API_KEY ni oladi
// Kutish vaqtini 60 soniyaga (60000ms) ko'tardik!
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    timeout: 60000, 
  }
});

export async function POST(request) {
  try {
    const { text, examType } = await request.json();

    if (!text || text.trim() === "") {
      return NextResponse.json({ message: "Matn kiritilmadi!" }, { status: 400 });
    }

    // AI uchun super-mantiqiy prompt
    const prompt = `
      Sen professional ta'lim ekspertisan. Vazifang quyida berilgan matnni chuqur tahlil qilib, undan ${examType === "test" ? "TEST (Multiple choice)" : "YOZMA (Written)"} imtihoni uchun savollar to'plamini yaratish.

      MATNDAGI HOLATLAR VA SENING VAZIFANG:
      1. Agar matnda faqat faktlar/ma'lumotlar bo'lsa: Eng muhim va asosiy faktlardan foydalanib savollar tuz.
      2. Agar tayyor testlar (variantlari va to'g'ri javoblari bilan) bo'lsa: Ularni hech qanday o'zgarishsiz o'qib ol va faqat JSON formatga o'tkaz.
      3. Agar testlar (variantlari bor, lekin to'g'ri javobi yo'q) bo'lsa: O'zing chuqur biliming orqali to'g'ri javobni aniq top, belgilab ber va JSON formatga o'tkaz.
      4. Agar faqat savollar (variant ham, javob ham yo'q) bo'lsa: 
         - Agar hozir ${examType === "test" ? "TEST" : "YOZMA"} rejimi tanlangan bo'lsa, o'zing mantiqiy 4 ta variant (A, B, C, D) o'ylab top va to'g'ri javobni belgilab ber.
         - Agar hozir yozma rejim bo'lsa, faqat savol va uning to'g'ri, to'liq javobini yoz.

      QAYTARISH FORMATI (Faqat toza JSON Array qaytar, hech qanday qo'shimcha izohlar, markdown yoki \`\`\`json yozuvlarisiz):
      ${
        examType === "test"
          ? `[ { "text": "Savol matni?", "options": ["A variant", "B variant", "C variant", "D variant"], "answer": "To'g'ri variant matni" } ]`
          : `[ { "text": "Savol matni?", "options": [], "answer": "To'liq va to'g'ri javob matni" } ]`
      }

      MANA TAHLIL QILISHING KERAK BO'LGAN MATN:
      ${text}
    `;

    // Eng barqaror va xatosiz ishlaydigan model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let responseText = response.text;
    
    // AI javobini tozalash (JSON bloklarini olib tashlash)
    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

    const questions = JSON.parse(responseText);

    return NextResponse.json({ questions }, { status: 200 });

  } catch (error) {
    console.error("AI Generation Error Details:", error);

    // 1. Agar Google serverlarida "High Demand" (503) xatosi bo'lsa:
    if (error.status === 503 || (error.message && error.message.includes("503"))) {
      return NextResponse.json({ 
        message: "Hozircha AI serverlarida tirbandlik kuzatilmoqda. Iltimos, bir ozdan so'ng qayta urinib ko'ring." 
      }, { status: 503 });
    }

    // 2. Agar Tarmoq/Internet xatosi (Timeout) bo'lsa:
    if (error.message && error.message.includes("Timeout")) {
      return NextResponse.json({ 
        message: "Google serverlariga ulanish vaqti tugadi (Timeout). Iltimos, VPN yoqib ko'ring yoki internet tezligini tekshiring." 
      }, { status: 504 });
    }

    // 3. Boshqa har qanday xatolik
    return NextResponse.json({ message: "AI matnni tahlil qilishda xatolikka uchradi. Iltimos qayta urinib ko'ring." }, { status: 500 });
  }
}