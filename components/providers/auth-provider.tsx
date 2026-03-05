"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  userId: string | null;
  isSignedIn: boolean;
  isLoaded: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "complyremit_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore invalid stored data
    }
    setIsLoaded(true);
  }, []);

  const persistUser = useCallback((u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const signIn = useCallback(
    async (email: string, _password: string) => {
      // Mock: accept any email/password
      const mockUser: User = {
        id: `user_${btoa(email).slice(0, 12)}`,
        email,
      };
      persistUser(mockUser);
    },
    [persistUser]
  );

  const signUp = useCallback(
    async (email: string, _password: string) => {
      const mockUser: User = {
        id: `user_${btoa(email).slice(0, 12)}`,
        email,
      };
      persistUser(mockUser);
    },
    [persistUser]
  );

  const signOut = useCallback(() => {
    persistUser(null);
  }, [persistUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        userId: user?.id ?? null,
        isSignedIn: !!user,
        isLoaded,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
