import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, AuthResponse } from "@/services/api";

type UpdateProfileData = Partial<{
  username: string;
  email: string;
  avatar: string;
  bio: string;
}>;

export interface AuthContextType {
  user: AuthResponse["user"] | null;
  tokens: { access: string; refresh: string } | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    username: string,
    email: string,
    password: string,
    password_confirm: string,
    role: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  fetchWithAuth: (
    input: RequestInfo,
    init?: RequestInit
  ) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [tokens, setTokens] = useState<{ access: string; refresh: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore session on refresh
  // On mount, optionally fetch user/session from backend if using httpOnly cookies
  useEffect(() => {
    // TODO: Implement /auth/session endpoint to get user info if using httpOnly cookies
    // For now, clear any legacy localStorage tokens
    localStorage.removeItem("tokens");
    localStorage.removeItem("user");
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.login({ email, password });

      const newTokens = { access: response.access, refresh: response.refresh };

      setTokens(newTokens);
      setUser(response.user);

      // Tokens are now in memory only; backend should set httpOnly cookies
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    username: string,
    email: string,
    password: string,
    password_confirm: string,
    role: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.signup({
        username,
        email,
        password,
        password_confirm,
        role: role as "citizen" | "journalist" | "ngo" | "admin",
      });

      const newTokens = { access: response.access, refresh: response.refresh };

      setTokens(newTokens);
      setUser(response.user);

      // Tokens are now in memory only; backend should set httpOnly cookies
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = React.useCallback(async () => {
    setIsLoading(true);
    try {
      if (tokens?.access) {
        await authAPI.logout(tokens.access);
      }
    } finally {
      setTokens(null);
      setUser(null);
      // Tokens are now in memory only; backend should clear httpOnly cookies
      setIsLoading(false);
    }
  }, [tokens]);

  // Timer-based auto-refresh for access token
  useEffect(() => {
    if (!tokens?.access || !tokens?.refresh) return;
    // Decode JWT to get expiry (assume JWT, not encrypted)
    const decode = (token: string) => {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch {
        return null;
      }
    };
    const payload = decode(tokens.access);
    if (!payload || !payload.exp) return;
    const expiresIn = payload.exp * 1000 - Date.now();
    // Refresh 30 seconds before expiry
    const refreshTime = expiresIn - 30000;
    if (refreshTime <= 0) return;
    const timer = setTimeout(async () => {
      try {
        const refreshed = await authAPI.refreshToken(tokens.refresh);
        setTokens({ access: refreshed.access, refresh: tokens.refresh });
      } catch {
        await logout();
      }
    }, refreshTime);
    return () => clearTimeout(timer);
  }, [tokens, logout]);

  const fetchWithAuth = async (
    input: RequestInfo,
    init: RequestInit = {}
  ): Promise<Response> => {
    if (!tokens?.access) throw new Error("Not authenticated");

    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${tokens.access}`);
    return fetch(input, { ...init, headers });
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
        isAuthenticated: !!user,
        fetchWithAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


