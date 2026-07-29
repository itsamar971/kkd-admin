import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Farmers from './pages/Farmers';
import Buyers from './pages/Buyers';
import Orders from './pages/Orders';
import Dispatch from './pages/Dispatch';
import Messages from './pages/Messages';
import Products from './pages/Products';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500 flex-col space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="font-semibold tracking-tight text-sm">Loading admin...</span>
      </div>
    );
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="farmers" element={<Farmers />} />
            <Route path="buyers" element={<Buyers />} />
            <Route path="orders" element={<Orders />} />
            <Route path="dispatch" element={<Dispatch />} />
            <Route path="messages" element={<Messages />} />
            <Route path="products" element={<Products />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
