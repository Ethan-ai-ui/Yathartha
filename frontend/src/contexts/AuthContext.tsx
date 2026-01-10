import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, AuthResponse } from "@/services/api";

type UpdateProfileData = Partial<{
  username: string;
  email: string;
  avatar: string;
  bio: string;
}>;

interface AuthContextType {
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
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  isAuthenticated: boolean;
  fetchWithAuth: (
    input: RequestInfo,
    init?: RequestInit
  ) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [tokens, setTokens] = useState<{ access: string; refresh: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load auth from storage
  useEffect(() => {
    const storedTokens = localStorage.getItem("tokens");
    const storedUser = localStorage.getItem("user");

    if (storedTokens && storedUser) {
      try {
        setTokens(JSON.parse(storedTokens));
        setUser(JSON.parse(storedUser));
      } catch {
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

      localStorage.setItem(
        "tokens",
        JSON.stringify({ access: response.access, refresh: response.refresh })
      );
      localStorage.setItem("user", JSON.stringify(response.user));
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

      setTokens({ access: response.access, refresh: response.refresh });
      setUser(response.user);

      localStorage.setItem(
        "tokens",
        JSON.stringify({ access: response.access, refresh: response.refresh })
      );
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (tokens?.access) {
        await authAPI.logout(tokens.access);
      }
    } finally {
      setTokens(null);
      setUser(null);
      localStorage.removeItem("tokens");
      localStorage.removeItem("user");
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    if (!tokens?.access) throw new Error("Not authenticated");
    setIsLoading(true);
    try {
      const updated = await authAPI.updateProfile(tokens.access, data);
      setUser(updated.user || updated);
      localStorage.setItem("user", JSON.stringify(updated.user || updated));
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (!tokens?.access) throw new Error("Not authenticated");
    setIsLoading(true);
    try {
      await authAPI.changePassword(tokens.access, oldPassword, newPassword);
    } finally {
      setIsLoading(false);
    }
  };

  // ⭐ Token-refreshing fetch
  const fetchWithAuth = async (
    input: RequestInfo,
    init: RequestInit = {}
  ): Promise<Response> => {
    if (!tokens?.access) throw new Error("Not authenticated");

    const doFetch = (token: string) => {
      const headers = new Headers(init.headers);
      headers.set("Authorization", `Bearer ${token}`);
      return fetch(input, { ...init, headers });
    };

    let response = await doFetch(tokens.access);

    if (response.status === 401 && tokens.refresh) {
      try {
        const refreshed = await authAPI.refreshToken(tokens.refresh);
        const newTokens = {
          access: refreshed.access,
          refresh: tokens.refresh,
        };

        setTokens(newTokens);
        localStorage.setItem("tokens", JSON.stringify(newTokens));

        response = await doFetch(refreshed.access);
      } catch {
        await logout();
        throw new Error("Session expired. Please log in again.");
      }
    }

    return response;
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
        fetchWithAuth,
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
