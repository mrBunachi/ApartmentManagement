import { createContext, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("isAdmin") === "true"
  );

  const login = (username, password) => {
    // Hardcode admin for project:
    if (username === "admin" && password === "admin") {
      localStorage.setItem("isAdmin", "true");
      setLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("isAdmin");
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
