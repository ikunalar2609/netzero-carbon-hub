
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
};

type ProfileUpdateData = {
  name: string;
  email: string;
  phone?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: ProfileUpdateData) => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  updateUserProfile: async () => {},
  isAuthenticated: false,
});

// Mock user data for demonstration
const mockUsers = [
  {
    id: "1",
    email: "admin@farmlycarbon.com",
    password: "password123",
    name: "Admin User",
    role: "admin",
    phone: "+1 (555) 123-4567",
  },
  {
    id: "2",
    email: "user@farmlycarbon.com",
    password: "password123",
    name: "Demo User",
    role: "user",
    phone: "",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("farmlycarbon_user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Failed to parse user data", error);
          localStorage.removeItem("farmlycarbon_user");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    setLoading(true);
    try {
      // Mock authentication
      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error("Invalid email or password");
      }

      // Extract the user object without the password
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Save to localStorage
      localStorage.setItem(
        "farmlycarbon_user",
        JSON.stringify(userWithoutPassword)
      );
      
      setUser(userWithoutPassword);
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    // Simulate API call
    setLoading(true);
    try {
      // Check if email already exists
      if (mockUsers.some((u) => u.email === email)) {
        throw new Error("Email already in use");
      }

      // Create new user
      const newUser = {
        id: `${mockUsers.length + 1}`,
        email,
        name,
        role: "user",
        phone: "",
      };

      // Save to localStorage
      localStorage.setItem("farmlycarbon_user", JSON.stringify(newUser));
      
      setUser(newUser);
      toast.success("Account created successfully");
      navigate("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (data: ProfileUpdateData) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      // In a real app, this would be an API call
      const updatedUser = {
        ...user,
        ...data
      };
      
      // Update localStorage
      localStorage.setItem("farmlycarbon_user", JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      return Promise.resolve();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Update failed";
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("farmlycarbon_user");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateUserProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
