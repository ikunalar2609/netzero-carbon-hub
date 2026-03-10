
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, login, logout, createAccount } from '@/services/appwrite';
import { Models } from 'appwrite';
import { toast } from "sonner";

interface AppwriteContextType {
  user: Models.User<Models.Preferences> | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AppwriteContext = createContext<AppwriteContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

export const useAppwrite = () => useContext(AppwriteContext);

export const AppwriteProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      await login(email, password);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      toast.success("Logged in successfully");
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Failed to login. Please check your credentials.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to logout");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      await createAccount(email, password, name);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      toast.success("Account created successfully");
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Failed to create account");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  };

  return (
    <AppwriteContext.Provider value={value}>
      {children}
    </AppwriteContext.Provider>
  );
};
