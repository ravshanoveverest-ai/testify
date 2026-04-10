import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "teacher"], default: "student" }, // ROL
    
    // Eski token mantiqlari (xalaqit bermasligi uchun qoldiramiz)
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
    
    // YANGI QO'SHILGAN: OTP uchun maydonlar
    resetOtp: { type: String, default: null },
    resetOtpExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;