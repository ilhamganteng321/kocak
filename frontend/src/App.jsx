import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import { Routes, Route, Navigate } from 'react-router-dom'; // Tambahkan Route di sini
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { Loader }from 'lucide-react';
import { Toaster }  from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/UseAuthStore';

const App = () => {
  // Ambil state dari useAuthStore, bukan axiosInstance
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log("onlineUsers:", onlineUsers);
  useEffect(() => {
    checkAuth(); // Jalankan fungsi checkAuth saat komponen dimuat
  }, [checkAuth]);

  if(isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"/>
      </div>
  )
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={ authUser ? <HomePage /> : <Navigate to={'/login'}/>} />
        <Route path="/signup" element={ !authUser ? <SignUpPage /> : <Navigate to={'/'}/>} />
        <Route path="/login" element={ !authUser ? <LoginPage /> : <Navigate to={'/'}/>} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={ authUser ? <ProfilePage /> : <Navigate to={'/login'}/>} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
