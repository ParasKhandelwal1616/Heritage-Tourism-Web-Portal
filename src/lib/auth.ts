import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/db';
import User, { UserRole } from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect();
          const { email, name, image } = user;
          
          // Check if user exists in database, if not create them
          let dbUser = await User.findOne({ email });
          if (!dbUser) {
            dbUser = await User.create({
              email,
              name,
              image,
              role: UserRole.STUDENT, // Default role
            });
          }
          
          // Add role to user object so it's available in the jwt callback
          user.role = dbUser.role;
          return true;
        } catch (error) {
          console.error('Error during sign in:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // Handle the initial sign-in and subsequent updates
      if (user) {
        token.role = user.role;
      }
      
      // If the session is updated manually (e.g., admin changing a role)
      // we could re-fetch the role from the DB here if needed
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
