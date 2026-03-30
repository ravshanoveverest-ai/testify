import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Result from "@/models/Result";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get("testId");

    if (!testId) {
      return NextResponse.json({ message: "Test ID yuborilmadi" }, { status: 400 });
    }

    // Bazadan shu testga tegishli barcha natijalarni olamiz
    // 1-o'rinda to'g'ri javoblar soni bo'yicha (kamayish), 2-o'rinda sarflangan vaqt bo'yicha (o'sish) saralaymiz.
    const rawLeaderboard = await Result.find({ testId })
      .populate("userId", "name") // Userning ismini tortib olamiz
      .sort({ correctAnswers: -1, timeSpent: 1 });

    // FILTER: Bitta odamning faqat bitta (eng yaxshi) natijasini qoldiramiz
    const uniqueUsers = new Set();
    const leaderboard = [];

    for (const item of rawLeaderboard) {
      if (item.userId && !uniqueUsers.has(item.userId._id.toString())) {
        uniqueUsers.add(item.userId._id.toString());
        leaderboard.push(item);
      }
      if (leaderboard.length >= 10) break; // Faqat TOP-10 talikni olamiz
    }

    return NextResponse.json({ leaderboard }, { status: 200 });
  } catch (error) {
    console.log("Leaderboard xatosi:", error);
    return NextResponse.json({ message: "Server xatosi" }, { status: 500 });
  }
}