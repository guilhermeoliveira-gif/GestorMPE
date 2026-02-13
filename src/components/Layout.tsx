import React, { useState } from 'react';
import { NavLink, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Receipt,
  Settings,
  UserCog,
  Menu,
  X,
  LogOut,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user, role, signOut, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="h-screen flex items-center justify-center text-indigo-600">Carregando...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'PDV', icon: ShoppingCart, path: '/pdv' },
    { name: 'Histórico', icon: FileText, path: '/historico-vendas' },
    { name: 'Clientes', icon: Users, path: '/clientes' },
    { name: 'Produtos', icon: Package, path: '/produtos' },
    { name: 'Financeiro', icon: DollarSign, path: '/financeiro' },
    { name: 'NF-e', icon: Receipt, path: '/nfe' },
    { name: 'Configurações', icon: Settings, path: '/configuracoes' },
  ];

  // Only Admin sees User Management
  if (role === UserRole.ADMIN) {
    navItems.push({ name: 'Usuários', icon: UserCog, path: '/usuarios' });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gray-50 border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-heading font-bold text-indigo-600">ERP <span className="text-gray-900">MPE</span></h1>
          <button onClick={toggleSidebar} className="md:hidden">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <nav className="px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                ${isActive
                  ? 'bg-indigo-50 text-indigo-600 font-semibold'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-sans">{item.name}</span>
            </NavLink>
          ))}

          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors duration-200 mt-8"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-sans">Sair</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center gap-4">
          <button onClick={toggleSidebar} className="text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-heading font-bold text-lg text-gray-900">Menu</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};