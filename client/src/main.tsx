import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import AppLayout from "./components/pages/AppLayout";
import AuthProvider from "./context/auth.context.provider";
import FilmPage from "./components/pages/FilmPage";
import AdminPage from "./components/pages/AdminPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reg" element={<RegisterPage />} />
          <Route path="/" element={<AppLayout />} />
          <Route path="/film/:id" element={<FilmPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
