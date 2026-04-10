// import { NextResponse } from "next/server";
// import connectMongoDB from "@/lib/mongodb";
// import User from "@/models/User";
// import nodemailer from "nodemailer";

// export async function POST(request) {
//   try {
//     const { email } = await request.json();
//     await connectMongoDB();

//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json({ message: "Bu email tizimda ro'yxatdan o'tmagan!" }, { status: 404 });
//     }

//     // 6 xonali tasodifiy OTP yaratish
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
//     // OTP ning amal qilish vaqti (10 daqiqa)
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

//     // Bazaga OTP ni saqlash
//     user.resetOtp = otp;
//     user.resetOtpExpiry = otpExpiry;
//     await user.save();

//     // Nodemailer sozlamalari
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     // Email jo'natish
//     const mailOptions = {
//       from: `"Testify Support" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Parolni tiklash uchun tasdiqlash kodi",
//       html: `
//         <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
//           <h2 style="color: #2563EB; text-align: center;">Testify Platformasi</h2>
//           <p style="font-size: 16px; color: #333;">Salom, <b>${user.name}</b>!</p>
//           <p style="font-size: 16px; color: #333;">Parolingizni tiklash uchun so'rov yubordingiz. Quyidagi koddan foydalaning:</p>
//           <div style="background-color: #F3F4F6; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
//             <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111;">${otp}</span>
//           </div>
//           <p style="font-size: 14px; color: #666;">Bu kod 10 daqiqa davomida amal qiladi. Agar bu so'rovni siz yubormagan bo'lsangiz, ushbu xatni e'tiborsiz qoldiring.</p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     return NextResponse.json({ message: "OTP kodi emailingizga yuborildi!" }, { status: 200 });
//   } catch (error) {
//     console.log("OTP yuborishda xato:", error);
//     return NextResponse.json({ message: "Serverda xatolik yuz berdi" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { email } = await request.json();
    await connectMongoDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Bu email tizimda ro'yxatdan o'tmagan!" }, { status: 404 });
    }

    // 6 xonali tasodifiy OTP yaratish
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // OTP ning amal qilish vaqti (10 daqiqa)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Bazaga OTP ni saqlash
    user.resetOtp = otp;
    user.resetOtpExpiry = otpExpiry;
    await user.save();

    // Nodemailer sozlamalari
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email jo'natish
    const mailOptions = {
      from: `"Testify Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Parolni tiklash uchun tasdiqlash kodi",
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563EB; text-align: center;">Testify Platformasi</h2>
          <p style="font-size: 16px; color: #333;">Salom, <b>${user.name}</b>!</p>
          <p style="font-size: 16px; color: #333;">Parolingizni tiklash uchun so'rov yubordingiz. Quyidagi koddan foydalaning:</p>
          <div style="background-color: #F3F4F6; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #666;">Bu kod 10 daqiqa davomida amal qiladi. Agar bu so'rovni siz yubormagan bo'lsangiz, ushbu xatni e'tiborsiz qoldiring.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "OTP kodi emailingizga yuborildi!" }, { status: 200 });
  } catch (error) {
    console.log("OTP yuborishda xato:", error);
    return NextResponse.json({ message: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}