import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, UserCheck, ShoppingCart, MessageCircle, LogOut, Search, Package, Settings as SettingsIcon, UserCircle, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Farmers', path: '/farmers', icon: UserCheck },
    { name: 'Buyers', path: '/buyers', icon: Users },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Dispatch', path: '/dispatch', icon: Truck },
    { name: 'Messages', path: '/messages', icon: MessageCircle },
  ];

  const bottomNavItems = [
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
    { name: 'Profile', path: '/profile', icon: UserCircle },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-16 lg:w-56 bg-transparent flex flex-col items-center lg:items-stretch py-4 px-3 shrink-0 border-r border-slate-200/50">
        <div className="flex items-center justify-center lg:justify-start mb-8 px-2">
          <div className="h-8 w-8 bg-slate-900 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-base">C</span>
          </div>
          <h1 className="hidden lg:block ml-2 text-base font-bold text-slate-900 tracking-tight">KisanAdmin</h1>
        </div>

        <nav className="flex-1 space-y-2 w-full">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `group flex items-center justify-center lg:justify-start lg:px-3 py-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                }`
              }
              title={item.name}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="hidden lg:block ml-2 font-semibold text-xs">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto w-full pt-4 space-y-2 border-t border-slate-200/50">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center justify-center lg:justify-start lg:px-3 py-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                }`
              }
              title={item.name}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="hidden lg:block ml-2 font-semibold text-xs">{item.name}</span>
            </NavLink>
          ))}
          
          <Button 
            variant="ghost" 
            className="w-full rounded-full flex items-center justify-center lg:justify-start lg:px-3 py-4 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300 hover:shadow-sm h-10 mt-2"
            onClick={logout}
            title="Logout"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="hidden lg:block ml-2 font-semibold text-xs">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-10 px-6 py-4 flex items-center justify-between pointer-events-none">
          <div className="flex-1 max-w-2xl pointer-events-auto">
            {/* Pill Search Bar - Only show on Dashboard (/) */}
            {location.pathname === '/' && (
              <div className="relative flex items-center w-full h-10 rounded-full bg-white shadow-sm px-4">
                <Search className="h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Try searching 'orders' or 'insights'" 
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 ml-3 text-slate-600 font-medium placeholder:text-slate-400 text-xs"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3 ml-4 pointer-events-auto">
            <div className="hidden sm:flex items-center justify-center px-3 py-1.5 bg-white rounded-full shadow-sm text-[11px] font-semibold text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
              Live Mode
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md cursor-pointer hover:scale-105 transition-transform">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content - with top padding to clear absolute header */}
        <div className="flex-1 overflow-auto pt-16 px-6 pb-4">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
