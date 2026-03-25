import { createContext, useContext, useState, useEffect } from "react";
import API_URL from "../config/api";

// ── Storage keys ──────────────────────────────────────────────────────────────
const ADMIN_TOKEN_KEY   = "adminToken";          // existing invoice/admin key — do NOT change
const BLOGGER_TOKEN_KEY = "skyupBloggerSession"; // blogger-only key

// ── Hardcoded blogger credentials ─────────────────────────────────────────────
const BLOGGER_USERS = [
  {
    email:    "blogger@skyupdigitalsolutions.com",
    password: "blogger@123",
    role:     "blogger",
    name:     "SkyUp Blogger",
  },
];

// ── SSR-safe helpers ──────────────────────────────────────────────────────────
const isBrowser = () => typeof window !== "undefined";

const getAdminToken = () => {
  if (!isBrowser()) return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY) || null;
};

const getBloggerSession = () => {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(BLOGGER_TOKEN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveBloggerSession = (user, token) => {
  if (!isBrowser()) return;
  localStorage.setItem(BLOGGER_TOKEN_KEY, JSON.stringify({ user, token }));
};

const clearBloggerSession = () => {
  if (!isBrowser()) return;
  localStorage.removeItem(BLOGGER_TOKEN_KEY);
};

const clearAdminSession = () => {
  if (!isBrowser()) return;
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  // ── On mount: restore whichever session exists ────────────────────────────
  useEffect(() => {
    const restore = async () => {

      // 1️⃣ Check blogger session first (no network call needed)
      const bloggerSession = getBloggerSession();
      if (bloggerSession?.user && bloggerSession?.token) {
        setUser(bloggerSession.user);
        setToken(bloggerSession.token);
        setLoading(false);
        return;
      }

      // 2️⃣ Check admin token via backend verify
      const adminToken = getAdminToken();
      if (!adminToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setToken(adminToken);
        } else {
          clearAdminSession();
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        clearAdminSession();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, []);

  // ── login — tries hardcoded blogger first, then backend API ──────────────
  const login = async (email, password) => {

    // 1️⃣ Check hardcoded blogger credentials
    const bloggerMatch = BLOGGER_USERS.find(
      (u) => u.email === email.trim() && u.password === password
    );

    if (bloggerMatch) {
      const sessionUser  = { email: bloggerMatch.email, role: bloggerMatch.role, name: bloggerMatch.name };
      const sessionToken = btoa(`${bloggerMatch.email}:${bloggerMatch.role}:${Date.now()}`);
      saveBloggerSession(sessionUser, sessionToken);
      setUser(sessionUser);
      setToken(sessionToken);
      return { success: true, user: sessionUser };
    }

    // 2️⃣ Fall back to backend API (admin / invoice login)
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (isBrowser()) localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);

      return { success: true, user: data.user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message };
    }
  };

  // ── logout — clears whichever session is active ───────────────────────────
  const logout = () => {
    clearBloggerSession();
    clearAdminSession();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isAdmin:         user?.role === "admin",
    isBlogger:       user?.role === "blogger" || user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ── hook ──────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};