import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string, mobile: string, country: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isInitialLoad = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Only redirect on actual new sign-in (not page reload)
        if (event === "SIGNED_IN" && session && !isInitialLoad) {
          setTimeout(() => {
            // Upsert profile for OAuth users
            supabase.from("profiles").upsert({
              user_id: session.user.id,
              first_name: session.user.user_metadata?.full_name?.split(" ")[0] || session.user.user_metadata?.first_name || "",
              last_name: session.user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || session.user.user_metadata?.last_name || "",
            }, { onConflict: "user_id" }).then(() => {});
            navigate("/farmly");
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      isInitialLoad = false;
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password");
        }
        throw error;
      }
      setUser(data.user);
      setSession(data.session);
      toast.success("Logged in successfully");
      navigate("/farmly");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (firstName: string, lastName: string, email: string, password: string, mobile: string, country: string) => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
            name: `${firstName} ${lastName}`,
          },
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          throw new Error("Email already in use");
        }
        throw error;
      }

      if (data.user) {
        // Wait a moment for the trigger to create the profile row, then update it
        setTimeout(async () => {
          await supabase.from("profiles").update({
            mobile,
            country,
          }).eq("user_id", data.user!.id);
        }, 1000);

        setUser(data.user);
        setSession(data.session);
        toast.success("Account created! Please check your email to verify your account.");
        navigate("/farmly");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Logout failed";
      toast.error(message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
