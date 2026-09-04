import React, { createContext, useState, useContext, useEffect } from "react";
import { getAccessToken, clearTokens } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getAccessToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setToken(getAccessToken());
    setLoading(false);
  }, []);

  const loginUser = (accessToken) => {
    setToken(accessToken);
  };

  const logoutUser = () => {
    clearTokens();
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        loginUser,
        logoutUser,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);