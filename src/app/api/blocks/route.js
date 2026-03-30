import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Block from "@/models/Block";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// 1. YANGI BLOK YARATISH (Bir xil nomni taqiqlash bilan)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Kirish shart" }, { status: 401 });
    }

    const { name, icon } = await request.json();
    await connectMongoDB();

    // DUBLEKATNI TEKSHIRISH: Shu userda xuddi shu nomli blok bormi?
    const existingBlock = await Block.findOne({ 
      name: name, 
      userId: session.user.id 
    });

    if (existingBlock) {
      // Agar blok mavjud bo'lsa, 400 xatolik va xabar qaytaramiz
      return NextResponse.json({ message: "Bunday nomdagi blok allaqachon mavjud!" }, { status: 400 });
    }
    
    // Agar yo'q bo'lsa, bemalol yaratamiz
    const newBlock = await Block.create({ 
      name, 
      icon: icon || "📁", 
      userId: session.user.id 
    });

    return NextResponse.json({ message: "Blok yaratildi", block: newBlock }, { status: 201 });
  } catch (error) {
    console.error("BLOK YARATISHDA XATO:", error);
    return NextResponse.json({ message: "Serverda xatolik", error: error.message }, { status: 500 });
  }
}

// 2. BARCHA BLOKLARNI OLISH
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Kirish shart" }, { status: 401 });

    await connectMongoDB();
    const blocks = await Block.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json({ blocks }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Xatolik", error: error.message }, { status: 500 });
  }
}

// 3. BLOKNI O'CHIRISH
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Kirish shart" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await connectMongoDB();
    await Block.findOneAndDelete({ _id: id, userId: session.user.id });

    return NextResponse.json({ message: "Blok o'chirildi" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Xatolik", error: error.message }, { status: 500 });
  }
}

// 4. BLOKNI TAHRIRLASH
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Kirish shart" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const { name } = await request.json();

    await connectMongoDB();

    // Tahrirlayotganda ham dublikat nomga o'zgartirishni taqiqlash
    const existingBlock = await Block.findOne({ _id: { $ne: id }, name: name, userId: session.user.id });
    if (existingBlock) {
      return NextResponse.json({ message: "Bunday nomdagi blok allaqachon mavjud!" }, { status: 400 });
    }

    await Block.findOneAndUpdate({ _id: id, userId: session.user.id }, { name });

    return NextResponse.json({ message: "Blok yangilandi" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Xatolik", error: error.message }, { status: 500 });
  }
}