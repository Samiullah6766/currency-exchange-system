import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    setIsLoggedIn(!!token);

    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem("token", token);

    localStorage.setItem("user", JSON.stringify(user));

    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
