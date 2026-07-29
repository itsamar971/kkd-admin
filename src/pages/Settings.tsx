import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe } from 'lucide-react';

const Settings: React.FC = () => {
  const cardClass = "bg-white rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6";

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Platform Settings</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage your dashboard preferences and global platform configurations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-2">
          {[
            { id: 'general', name: 'General', icon: SettingsIcon, active: true },
            { id: 'notifications', name: 'Notifications', icon: Bell, active: false },
            { id: 'security', name: 'Security', icon: Shield, active: false },
            { id: 'appearance', name: 'Appearance', icon: Palette, active: false },
            { id: 'localization', name: 'Localization', icon: Globe, active: false },
          ].map((tab) => (
            <button 
              key={tab.id}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                tab.active ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className={cardClass}>
            <h3 className="text-lg font-bold text-slate-800 mb-4">General Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Platform Name</label>
                <input type="text" defaultValue="Kisan Ka Dukan" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Support Email</label>
                <input type="email" defaultValue="support@kisankadukan.com" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
              </div>

              <div className="pt-4 flex justify-end">
                <button className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md shadow-primary/20 hover:scale-105 transition-transform">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
