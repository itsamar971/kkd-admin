import React, { useState, useEffect } from 'react';
import { Megaphone, Send, Clock, Loader2, Users, Trash2 } from 'lucide-react';
import api from '../api/axios';

interface Announcement {
  id: string;
  title: string;
  message: string;
  targetAudience: string;
  createdAt: string;
}

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetAudience: 'all'
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/admin/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      console.error('Failed to load announcements', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this broadcast notification?')) {
      try {
        await api.delete(`/admin/announcements/${id}`);
        setAnnouncements(prev => prev.filter(a => a.id !== id));
      } catch (err) {
        console.error('Failed to delete announcement', err);
        setAnnouncements(prev => prev.filter(a => a.id !== id));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) return;
    
    try {
      setSubmitting(true);
      await api.post('/admin/announcements', formData);
      setFormData({ title: '', message: '', targetAudience: 'all' });
      fetchAnnouncements();
    } catch (err) {
      console.error('Failed to create announcement', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Announcements Center</h2>
        <p className="text-sm text-slate-500 mt-1">Broadcast push notifications and alerts to your users.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Composer */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Megaphone className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">New Broadcast</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Audience</label>
                <select 
                  name="targetAudience" 
                  value={formData.targetAudience} 
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">Everyone (All Users)</option>
                  <option value="farmers">Farmers Only</option>
                  <option value="buyers">Buyers Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message Title</label>
                <input 
                  type="text" 
                  name="title"
                  placeholder="e.g. Weekend Mega Sale!"
                  value={formData.title} 
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Body Text</label>
                <textarea 
                  name="message"
                  placeholder="Type your notification message here..."
                  value={formData.message} 
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting || !formData.title || !formData.message}
                className="w-full bg-primary text-white px-4 py-3 rounded-xl font-bold text-sm shadow-md shadow-primary/20 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2 mt-6"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span>Send Push Notification</span>
              </button>
            </form>
          </div>
        </div>

        {/* History */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Broadcast History</h3>
          
          {loading ? (
            <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-slate-400 h-8 w-8" /></div>
          ) : announcements.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center">
              <p className="text-sm text-slate-500 font-medium">No announcements have been sent yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((a) => (
                <div key={a.id} className="bg-white rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 hover:shadow-md transition-shadow relative overflow-hidden">
                  {/* Decorative accent */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${
                    a.targetAudience === 'farmers' ? 'bg-green-500' : 
                    a.targetAudience === 'buyers' ? 'bg-blue-500' : 'bg-primary'
                  }`} />
                  
                  <div className="flex justify-between items-start pl-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          a.targetAudience === 'farmers' ? 'bg-green-100 text-green-700' : 
                          a.targetAudience === 'buyers' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          <Users className="h-3 w-3 inline mr-1" />
                          {a.targetAudience}
                        </span>
                        <span className="text-xs text-slate-400 font-medium flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(a.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-2">{a.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{a.message}</p>
                    </div>
                    <button 
                      onClick={() => handleDelete(a.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                      title="Delete Announcement"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
