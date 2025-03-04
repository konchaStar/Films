export type AuthContextType = {
  logged: number;
  setLogged: React.Dispatch<React.SetStateAction<number>>;
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
};
