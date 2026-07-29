import React, { useState, useEffect } from 'react';
import { Tag, Plus, Loader2, Calendar, ShoppingBag } from 'lucide-react';
import api from '../api/axios';

interface Promotion {
  id: string;
  code: string;
  discountPercent: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    discountPercent: '',
    expiryDate: '',
    usageLimit: ''
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const res = await api.get('/admin/promotions');
      setPromotions(res.data);
    } catch (err) {
      console.error('Failed to load promotions', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/admin/promotions', formData);
      setFormData({ code: '', discountPercent: '', expiryDate: '', usageLimit: '' });
      setShowForm(false);
      fetchPromotions();
    } catch (err) {
      console.error('Failed to create promotion', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Promotions</h2>
          <p className="text-sm text-slate-500 mt-1">Manage discount codes and promotional campaigns.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md hover:scale-105 transition-transform flex items-center space-x-2"
        >
          {showForm ? <span className="rotate-45 block transition-transform"><Plus className="h-4 w-4" /></span> : <Plus className="h-4 w-4" />}
          <span>{showForm ? 'Cancel' : 'Create Code'}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 mb-6 animate-in slide-in-from-top-4 fade-in">
          <div className="flex items-center space-x-2 mb-6">
            <div className="h-8 w-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
              <Tag className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">New Discount Code</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Coupon Code</label>
              <input 
                type="text" 
                name="code"
                placeholder="e.g. SUMMER20"
                value={formData.code} 
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Discount Percentage (%)</label>
              <input 
                type="number" 
                name="discountPercent"
                placeholder="20"
                min="1" max="100"
                value={formData.discountPercent} 
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Usage Limit</label>
              <input 
                type="number" 
                name="usageLimit"
                placeholder="How many times can it be used?"
                min="1"
                value={formData.usageLimit} 
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expiry Date</label>
              <input 
                type="date" 
                name="expiryDate"
                value={formData.expiryDate} 
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="md:col-span-2 pt-2">
              <button 
                type="submit" 
                disabled={submitting}
                className="bg-primary text-white px-8 py-3 rounded-full font-bold text-sm shadow-md shadow-primary/20 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Publish Promotion</span>}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-slate-400 h-8 w-8" /></div>
      ) : promotions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <p className="text-sm text-slate-500 font-medium">No promotions active. Create one to drive sales!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map(promo => {
            const isExpired = new Date(promo.expiryDate) < new Date();
            const isExhausted = promo.usedCount >= promo.usageLimit;
            const statusColor = (isExpired || isExhausted || !promo.isActive) ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-700';
            
            return (
              <div key={promo.id} className="bg-white rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 relative overflow-hidden flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-pink-50 border border-pink-100 px-3 py-1.5 rounded-lg">
                    <span className="font-extrabold text-pink-600 tracking-wider text-sm">{promo.code}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${statusColor}`}>
                    {isExpired ? 'Expired' : isExhausted ? 'Exhausted' : promo.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="mt-2 mb-6">
                  <h4 className="text-3xl font-black text-slate-900">{promo.discountPercent}% OFF</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" /> Valid until {new Date(promo.expiryDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center text-slate-600">
                    <ShoppingBag className="h-4 w-4 mr-1.5" />
                    <span className="text-xs font-bold">{promo.usedCount} / {promo.usageLimit} uses</span>
                  </div>
                  {/* Visual progress bar */}
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.min(100, (promo.usedCount / promo.usageLimit) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Promotions;
