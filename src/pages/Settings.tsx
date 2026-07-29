import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Check, Loader2 } from 'lucide-react';
import api from '../api/axios';

interface SettingsData {
  platformName: string;
  supportEmail: string;
  emailAlerts: boolean;
  smsAlerts: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  theme: string;
  currency: string;
  language: string;
  platformCommissionPercent: number;
  baseDeliveryFee: number;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SettingsData>({
    platformName: '',
    supportEmail: '',
    emailAlerts: true,
    smsAlerts: false,
    twoFactorAuth: false,
    sessionTimeout: 30,
    theme: 'light',
    currency: 'INR',
    language: 'en',
    platformCommissionPercent: 10,
    baseDeliveryFee: 50
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/settings');
        setSettings(res.data);
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    setSettings({ ...settings, [target.name]: value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.post('/admin/settings', settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings', err);
    } finally {
      setSaving(false);
    }
  };

  const cardClass = "bg-white rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6";

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'localization', name: 'Localization', icon: Globe },
  ];

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-slate-400 h-8 w-8" /></div>;
  }

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
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeTab === tab.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className={cardClass}>
            {activeTab === 'general' && (
              <>
                <h3 className="text-lg font-bold text-slate-800 mb-4">General Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Platform Name</label>
                    <input type="text" name="platformName" value={settings.platformName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Support Email</label>
                    <input type="email" name="supportEmail" value={settings.supportEmail} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mt-8 mb-4">Platform Economics</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Commission (%)</label>
                      <span className="font-bold text-slate-800">{settings.platformCommissionPercent}%</span>
                    </div>
                    <input 
                      type="range" 
                      name="platformCommissionPercent" 
                      min="0" max="30" step="0.5" 
                      value={settings.platformCommissionPercent} 
                      onChange={handleChange} 
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" 
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Percentage taken from each successful sale.</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Base Delivery Fee (₹)</label>
                      <span className="font-bold text-slate-800">₹{settings.baseDeliveryFee}</span>
                    </div>
                    <input 
                      type="range" 
                      name="baseDeliveryFee" 
                      min="10" max="200" step="5" 
                      value={settings.baseDeliveryFee} 
                      onChange={handleChange} 
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" 
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Starting fee for logistics calculation.</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'notifications' && (
              <>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Email Alerts</h4>
                      <p className="text-xs text-slate-500 mt-1">Receive daily summary emails.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="emailAlerts" checked={settings.emailAlerts} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">SMS Alerts</h4>
                      <p className="text-xs text-slate-500 mt-1">Receive SMS for critical events.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="smsAlerts" checked={settings.smsAlerts} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'security' && (
              <>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Two-Factor Authentication</h4>
                      <p className="text-xs text-slate-500 mt-1">Require 2FA for admin logins.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="twoFactorAuth" checked={settings.twoFactorAuth} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Session Timeout (minutes)</label>
                    <input type="number" name="sessionTimeout" value={settings.sessionTimeout} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'appearance' && (
              <>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Appearance</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Theme</label>
                    <select name="theme" value={settings.theme} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option value="light">Light Mode</option>
                      <option value="dark">Dark Mode</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'localization' && (
              <>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Localization</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Default Currency</label>
                    <select name="currency" value={settings.currency} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Dashboard Language</label>
                    <select name="language" value={settings.language} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option value="en">English</option>
                      <option value="hi">Hindi (हिंदी)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md shadow-primary/20 hover:scale-105 transition-transform disabled:opacity-70 disabled:hover:scale-100 flex items-center space-x-2"
              >
                {saving ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> <span>Saving...</span></>
                ) : success ? (
                  <><Check className="h-4 w-4" /> <span>Saved</span></>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
