import { createContext, useEffect, useState } from "react";
import { AuthContextType } from "../types/auth";
import { jwtDecode, JwtPayload } from "jwt-decode";

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export type CustomJwtPayload = JwtPayload & {
  role: string;
  id: number;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [logged, setLogged] = useState<number>(-1);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      setLogged((jwtDecode(token) as CustomJwtPayload).id);
      setRole((jwtDecode(token) as CustomJwtPayload).role);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ logged, setLogged, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
