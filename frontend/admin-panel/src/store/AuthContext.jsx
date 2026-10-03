import React, { createContext, useContext, useState, useEffect } from "react";
import { api, getAuthToken, setAuthToken } from "../util/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setTokenState] = useState(getAuthToken());
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const existingToken = getAuthToken();
    if (!existingToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me");
      if (res.admin) {
        setAdmin(res.admin);
      } else {
        logout();
      }
    } catch (err) {
      console.warn("Auth check failed:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username, password) => {
    const res = await api.post("/auth/login", { username, password });
    if (res.require2FA) {
      return res; // Return 2FA challenge response to Login page
    }
    if (res.token) {
      setAuthToken(res.token);
      setTokenState(res.token);
      setAdmin(res.admin);
      return res;
    }
    throw new Error(res.error || "Login failed");
  };

  const verify2FA = async (challengeToken, otp) => {
    const res = await api.post("/auth/verify-2fa", { challengeToken, otp });
    if (res.token) {
      setAuthToken(res.token);
      setTokenState(res.token);
      setAdmin(res.admin);
      return res;
    }
    throw new Error(res.error || "2FA verification failed");
  };

  const setAdminProfile = (profileData) => {
    if (!profileData) return;
    setAdmin((prev) => {
      if (!prev) return profileData;
      const isIdentical = Object.keys(profileData).every(
        (key) => prev[key] === profileData[key]
      );
      if (isIdentical) return prev;
      return {
        ...prev,
        ...profileData,
      };
    });
  };

  const logout = () => {
    setAuthToken(null);
    setTokenState(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        loading,
        login,
        verify2FA,
        setAdminProfile,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
