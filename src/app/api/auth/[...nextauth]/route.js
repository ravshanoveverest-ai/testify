import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          await connectMongoDB();
          const user = await User.findOne({ email });
          if (!user) return null; // Bunday email topilmadi

          // Parollarni solishtiramiz
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) return null; // Parol xato

          // MUHIM: id ni string (matn) holatida qaytaramiz
          return { id: user._id.toString(), name: user.name, email: user.email };
        } catch (error) {
          console.log("Xato: ", error);
          return null;
        }
      },
    }),
  ],
  
  // MANA SHU QISM YETISHMAYOTGAN EDI 👇
  callbacks: {
    // 1. JWT tokenga ID ni joylaymiz
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // 2. O'sha tokendagi ID ni Sessiyaga (session.user.id) o'tkazamiz
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };