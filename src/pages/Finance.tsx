import React, { useState, useEffect } from 'react';
import { Landmark, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

interface Escrow {
  id: string;
  farmerName: string;
  amount: number;
  status: string;
  orderCount: number;
}

const Finance: React.FC = () => {
  const [funds, setFunds] = useState<Escrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEscrow();
  }, []);

  const fetchEscrow = async () => {
    try {
      const res = await api.get('/admin/finance/escrow');
      setFunds(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayout = async (id: string) => {
    try {
      setProcessingId(id);
      await api.post(`/admin/finance/payout/${id}`);
      setFunds(funds.map(f => f.id === id ? { ...f, status: 'paid' } : f));
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Financial Escrow & Payouts</h2>
        <p className="text-sm text-slate-500 mt-1">Manage funds held in escrow and initiate weekly bank transfers to farmers.</p>
      </div>

      <div className="grid gap-4">
        {loading ? (
           <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-slate-400 h-8 w-8" /></div>
        ) : funds.map(f => (
          <div key={f.id} className="bg-white rounded-2xl border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                f.status === 'ready' ? 'bg-green-100 text-green-600' : 
                f.status === 'paid' ? 'bg-slate-100 text-slate-400' : 'bg-yellow-100 text-yellow-600'
              }`}>
                <Landmark className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">{f.farmerName}</h3>
                <p className="text-xs font-bold text-slate-500">{f.orderCount} Orders Completed</p>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Escrow Balance</div>
                <div className={`text-2xl font-black ${f.status === 'paid' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                  ₹{f.amount.toLocaleString()}
                </div>
              </div>

              <div>
                {f.status === 'paid' ? (
                  <div className="flex items-center space-x-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-xl">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Transferred</span>
                  </div>
                ) : f.status === 'ready' ? (
                  <button 
                    onClick={() => handlePayout(f.id)}
                    disabled={processingId === f.id}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform flex items-center space-x-2 disabled:opacity-50 disabled:hover:scale-100 shadow-md"
                  >
                    {processingId === f.id ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                      <><span>Initiate Payout</span><ArrowRight className="h-4 w-4" /></>
                    )}
                  </button>
                ) : (
                  <div className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-400">
                    Awaiting Delivery
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Finance;
