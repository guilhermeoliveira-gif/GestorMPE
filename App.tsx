import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { Login, Register, ForgotPassword } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { Products } from './pages/Products';
import { Orders } from './pages/Orders';
import { Users } from './pages/Users';
import { UserRole } from './types';

// Protected Route Component
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // Or a spinner

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Layout>{children}</Layout>;
};

// Role Guard Component
const RoleRoute: React.FC<{ children: React.ReactNode; allowedRoles: UserRole[] }> = ({ children, allowedRoles }) => {
  const { role, loading } = useAuth();
  
  if (loading) return null;

  if (!role || !allowedRoles.includes(role)) {
    toast.error("❌ Você não tem permissão para acessar esta área.");
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar" element={<ForgotPassword />} />
          <Route path="/cadastro" element={<Register />} />
          
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          
          <Route path="/clientes" element={
            <PrivateRoute>
               <RoleRoute allowedRoles={[UserRole.ADMIN, UserRole.SALES]}>
                 <Clients />
               </RoleRoute>
            </PrivateRoute>
          } />

          <Route path="/produtos" element={
            <PrivateRoute>
               <RoleRoute allowedRoles={[UserRole.ADMIN, UserRole.SALES]}>
                 <Products />
               </RoleRoute>
            </PrivateRoute>
          } />

          <Route path="/pedidos" element={
            <PrivateRoute>
               <RoleRoute allowedRoles={[UserRole.ADMIN, UserRole.SALES]}>
                 <Orders />
               </RoleRoute>
            </PrivateRoute>
          } />
          
          <Route path="/usuarios" element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[UserRole.ADMIN]}>
                <Users />
              </RoleRoute>
            </PrivateRoute>
          } />

          {/* Finance Route Protected */}
          <Route path="/financeiro" element={
             <PrivateRoute>
                <RoleRoute allowedRoles={[UserRole.ADMIN, UserRole.FINANCE]}>
                    <div>Página Financeira (Em desenvolvimento)</div>
                </RoleRoute>
             </PrivateRoute>
          } />
          
          <Route path="/nfe" element={<PrivateRoute><div>Página NF-e (Em desenvolvimento)</div></PrivateRoute>} />
          <Route path="/configuracoes" element={<PrivateRoute><div>Página Configurações (Em desenvolvimento)</div></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;