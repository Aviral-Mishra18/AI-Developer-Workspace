"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  timezone: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  if (isLoading) {
    return (
      <div className="relative flex h-screen w-screen items-center justify-center bg-background overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.08),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.08),transparent_40%)]" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]" 
          style={{
            backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.15) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-6 p-8 rounded-2xl border border-border bg-card/60 dark:bg-card/40 backdrop-blur-xl shadow-2xl">
          {/* Animated Glowing Ring Spinner */}
          <div className="relative flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border-2 border-indigo-500/20" />
            <div className="absolute h-12 w-12 rounded-full border-t-2 border-r-2 border-indigo-500 animate-spin" />
            <div className="absolute h-8 w-8 rounded-full border-b-2 border-l-2 border-purple-500 animate-spin [animation-duration:1.5s]" />
          </div>
          
          <div className="flex flex-col items-center gap-1.5 text-center">
            <h2 className="text-base font-semibold tracking-wide bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 bg-[length:200%_auto] animate-[gradient_4s_linear_infinite] text-transparent bg-clip-text">
              Securing Session
            </h2>
            <p className="text-xs text-muted-foreground font-medium tracking-wider uppercase animate-pulse">
              NexusAI Workspace
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profile, session, isLoading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
