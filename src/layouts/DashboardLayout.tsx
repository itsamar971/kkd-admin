import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, UserCheck, ShoppingCart, MessageCircle, 
  LogOut, Search, Package, Settings as SettingsIcon, UserCircle, 
  Truck, ShieldCheck, Megaphone, Tag, BarChart3, AlertOctagon, 
  Map, Landmark, LineChart, ChevronDown, ChevronRight 
} from 'lucide-react';
import { Button } from '../components/ui/button';

type NavItem = {
  name: string;
  path: string;
  icon: any;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Main': true,
    'Users': true,
    'Commerce': true,
    'Logistics': false,
    'Growth & Marketing': false,
    'Finance & Analytics': false,
  });

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const navGroups: NavGroup[] = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Messages', path: '/messages', icon: MessageCircle },
      ]
    },
    {
      title: 'Users',
      items: [
        { name: 'Farmers', path: '/farmers', icon: UserCheck },
        { name: 'Buyers', path: '/buyers', icon: Users },
      ]
    },
    {
      title: 'Commerce',
      items: [
        { name: 'Orders', path: '/orders', icon: ShoppingCart },
        { name: 'Products', path: '/products', icon: Package },
        { name: 'Verification', path: '/verification', icon: ShieldCheck },
      ]
    },
    {
      title: 'Logistics',
      items: [
        { name: 'Dispatch', path: '/dispatch', icon: Truck },
        { name: 'Fleet', path: '/fleet', icon: Map },
      ]
    },
    {
      title: 'Growth & Marketing',
      items: [
        { name: 'Announce', path: '/announcements', icon: Megaphone },
        { name: 'Promos', path: '/promotions', icon: Tag },
      ]
    },
    {
      title: 'Finance & Analytics',
      items: [
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Finance', path: '/finance', icon: Landmark },
        { name: 'Mandi', path: '/mandi', icon: LineChart },
        { name: 'Disputes', path: '/disputes', icon: AlertOctagon },
      ]
    }
  ];

  const bottomNavItems = [
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
    { name: 'Profile', path: '/profile', icon: UserCircle },
  ];

  return (
    <div className="flex h-screen bg-[#f4f4f5] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-16 lg:w-64 bg-transparent flex flex-col py-6 px-4 shrink-0 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-center lg:justify-start mb-8 px-2">
          <div className="h-8 w-8 bg-slate-900 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-base">C</span>
          </div>
          <h1 className="hidden lg:block ml-3 text-base font-bold text-slate-900 tracking-tight">KisanAdmin</h1>
        </div>

        <nav className="flex-1 space-y-4 w-full pb-4">
          {navGroups.map((group) => (
            <div key={group.title} className="w-full">
              {/* Group Header (Collapsible) */}
              <div 
                className="hidden lg:flex items-center justify-between px-2 py-1 mb-1 cursor-pointer group"
                onClick={() => toggleGroup(group.title)}
              >
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-600 transition-colors">
                  {group.title}
                </span>
                {expandedGroups[group.title] ? (
                  <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-600" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-slate-400 group-hover:text-slate-600" />
                )}
              </div>
              
              {/* Group Items */}
              {expandedGroups[group.title] && (
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        `group flex items-center justify-center lg:justify-start lg:px-3 py-2 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-white text-slate-900 shadow-sm font-bold'
                            : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 font-semibold'
                        }`
                      }
                      title={item.name}
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`} />
                          <span className="hidden lg:block ml-3 text-sm">{item.name}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="mt-auto w-full pt-4 space-y-1 border-t border-slate-300/50 shrink-0">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center justify-center lg:justify-start lg:px-3 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 font-semibold'
                }`
              }
              title={item.name}
            >
               {({ isActive }) => (
                <>
                  <item.icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span className="hidden lg:block ml-3 text-sm">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
          
          <button 
            className="w-full flex items-center justify-center lg:justify-start lg:px-3 py-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 font-semibold mt-1"
            onClick={logout}
            title="Logout"
          >
            <LogOut className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-red-500" />
            <span className="hidden lg:block ml-3 text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area - White Container */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden p-2 pl-0">
        <div className="flex-1 bg-white rounded-tl-[2rem] rounded-bl-[2rem] rounded-tr-xl rounded-br-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
          
          {/* Header */}
          <header className="absolute top-0 left-0 right-0 z-10 px-8 py-6 flex items-center justify-between pointer-events-none">
            <div className="flex-1 max-w-2xl pointer-events-auto">
              {/* Pill Search Bar */}
              {location.pathname === '/' && (
                <div className="relative flex items-center w-full max-w-md h-12 rounded-full bg-slate-50 border border-slate-100 px-5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Try searching 'orders' or 'insights'" 
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 ml-3 text-slate-700 font-medium placeholder:text-slate-400 text-sm"
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4 ml-4 pointer-events-auto">
              <div className="hidden sm:flex items-center justify-center px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm text-xs font-bold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                Live Mode
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md cursor-pointer hover:scale-105 transition-transform border-2 border-white ring-2 ring-slate-100">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-auto pt-24 px-8 pb-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto h-full">
              <Outlet />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
