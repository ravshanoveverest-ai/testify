import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Test from "@/models/Test";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const blockId = searchParams.get("blockId");
    const isPublic = searchParams.get("public") === "true";

    // A: BITTA TEST SO'RALGANDA (Ishlash sahifasi uchun)
    if (id) {
      const test = await Test.findById(id);
      if (!test) return NextResponse.json({ message: "Test topilmadi" }, { status: 404 });

      // HIMOYALANGAN TEKSHIRUV: Bo'sh joylar va katta harflarni tozalab tekshiramiz
      const visibility = (test.visibility || "private").toLowerCase().trim();

      if (visibility === "public") {
        return NextResponse.json({ test }, { status: 200 }); // Hamma uchun ochiq
      }

      // Agar Private bo'lsa, faqat egasiga ko'rsatamiz
      const session = await getServerSession(authOptions);
      if (!session || test.userId?.toString() !== session.user.id) {
        return NextResponse.json({ message: "Bu shaxsiy test, ruxsat yo'q" }, { status: 403 });
      }

      return NextResponse.json({ test }, { status: 200 });
    }

    // B: OMMAVIY TESTLAR RO'YXATI
    if (isPublic) {
      const tests = await Test.find({ 
        visibility: { $in: ["Public", "public", "PUBLIC"] } 
      }).sort({ createdAt: -1 });
      
      return NextResponse.json({ tests }, { status: 200 });
    }

    // C: SHAXSIY TESTLAR RO'YXATI (Dashboard)
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Login shart" }, { status: 401 });

    const query = { userId: session.user.id };
    if (blockId) query.blockId = blockId;
    
    const tests = await Test.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ tests }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Server xatosi" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    
    const data = await request.json();
    await connectMongoDB();

    const existingTest = await Test.findOne({ title: data.title, userId: session.user.id });
    if (existingTest) {
      return NextResponse.json({ message: "Bunday nomdagi test allaqachon mavjud!" }, { status: 400 });
    }

    const newTest = await Test.create({ ...data, userId: session.user.id });
    return NextResponse.json({ test: newTest }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Ruxsat yo'q" }, { status: 401 });
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    await connectMongoDB();
    await Test.findOneAndDelete({ _id: id, userId: session.user.id });
    return NextResponse.json({ message: "O'chirildi" });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Ruxsat yo'q" }, { status: 401 });
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const data = await request.json();
    
    await connectMongoDB();

    if (data.title) {
      const existingTest = await Test.findOne({ _id: { $ne: id }, title: data.title, userId: session.user.id });
      if (existingTest) return NextResponse.json({ message: "Bunday nomdagi test allaqachon mavjud!" }, { status: 400 });
    }

    await Test.findOneAndUpdate({ _id: id, userId: session.user.id }, data);
    return NextResponse.json({ message: "Yangilandi" });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}