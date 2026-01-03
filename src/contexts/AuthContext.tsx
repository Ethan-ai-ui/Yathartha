import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, AuthResponse } from "@/services/api";

interface AuthContextType {
  user: AuthResponse["user"] | null;
  tokens: { access: string; refresh: string } | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [tokens, setTokens] = useState<{ access: string; refresh: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tokens from localStorage on mount
  useEffect(() => {
    const storedTokens = localStorage.getItem("tokens");
    const storedUser = localStorage.getItem("user");
    if (storedTokens && storedUser) {
      try {
        setTokens(JSON.parse(storedTokens));
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem("tokens");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.login({ email, password });
      setTokens({ access: response.access, refresh: response.refresh });
      setUser(response.user);
      localStorage.setItem("tokens", JSON.stringify({
        access: response.access,
        refresh: response.refresh,
      }));
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    username: string,
    email: string,
    password: string,
    role: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.signup({
        username,
        email,
        password,
        role: role as "citizen" | "journalist" | "ngo" | "admin",
      });
      setTokens({ access: response.access, refresh: response.refresh });
      setUser(response.user);
      localStorage.setItem("tokens", JSON.stringify({
        access: response.access,
        refresh: response.refresh,
      }));
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (tokens?.access) {
        await authAPI.logout(tokens.access);
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setTokens(null);
      setUser(null);
      localStorage.removeItem("tokens");
      localStorage.removeItem("user");
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: any) => {
    if (!tokens?.access) throw new Error("Not authenticated");
    setIsLoading(true);
    setError(null);
    try {
      const updated = await authAPI.updateProfile(tokens.access, data);
      setUser(updated.user || updated);
      localStorage.setItem("user", JSON.stringify(updated.user || updated));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (!tokens?.access) throw new Error("Not authenticated");
    setIsLoading(true);
    setError(null);
    try {
      await authAPI.changePassword(tokens.access, oldPassword, newPassword);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Password change failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isLoading,
        error,
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
