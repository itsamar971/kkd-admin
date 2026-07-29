import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, ShieldCheck, Key } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const cardClass = "bg-white rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 sm:p-12";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pt-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black tracking-tight text-[#0f172a]">Administrator Profile</h2>
        <p className="text-base text-slate-500 mt-2 font-medium">
          Manage your personal account settings.
        </p>
      </div>

      <div className={cardClass}>
        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:space-x-12">
          
          <div className="h-40 w-40 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-7xl shadow-2xl shrink-0 mb-8 sm:mb-0 relative">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
            <div className="absolute bottom-2 right-2 h-7 w-7 bg-[#22c55e] rounded-full border-4 border-white shadow-sm"></div>
          </div>
          
          <div className="flex-1 space-y-6 w-full">
            <div>
              <label className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                <User className="h-3.5 w-3.5 mr-1.5" /> Account Role
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-[#0f172a]">Super Admin</span>
                <ShieldCheck className="h-5 w-5 text-[#22c55e]" />
              </div>
            </div>
            
            <div>
              <label className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                <Mail className="h-3.5 w-3.5 mr-1.5" /> Email Address
              </label>
              <div className="text-lg font-semibold text-[#334155]">{user?.email || 'admin@kisankadukan.com'}</div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-sm font-bold text-[#0f172a] mb-5 flex items-center">
                <Key className="h-4 w-4 mr-2 text-slate-500" /> Security
              </h4>
              <button className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                Change Password
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
