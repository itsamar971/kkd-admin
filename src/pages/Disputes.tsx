import React, { useState, useEffect } from 'react';
import { AlertOctagon, CheckCircle2, MessageSquare, IndianRupee, Loader2 } from 'lucide-react';
import api from '../api/axios';

interface Dispute {
  id: string;
  orderId: string;
  buyerName: string;
  farmerName: string;
  issue: string;
  amount: number;
  status: string;
  createdAt: string;
}

const Disputes: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const res = await api.get('/admin/disputes');
      setDisputes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string, action: string) => {
    try {
      setProcessingId(id);
      await api.post(`/admin/disputes/${id}/resolve`, { action });
      setDisputes(disputes.filter(d => d.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Dispute & Refund Management</h2>
        <p className="text-sm text-slate-500 mt-1">Review customer tickets and manage refunds effortlessly.</p>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-slate-400 h-8 w-8" /></div>
      ) : disputes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-sm text-slate-900 font-bold">No active disputes!</p>
          <p className="text-xs text-slate-500 mt-1">Your marketplace is running smoothly.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {disputes.map(d => (
            <div key={d.id} className="bg-white rounded-2xl border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-5 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center">
                    <AlertOctagon className="h-3 w-3 mr-1" /> Ticket Open
                  </span>
                  <span className="text-sm font-bold text-slate-900">{d.orderId}</span>
                  <span className="text-xs text-slate-400 font-medium">{new Date(d.createdAt).toLocaleDateString()}</span>
                </div>
                
                <h4 className="text-base font-bold text-slate-800 mb-1">{d.issue}</h4>
                <div className="text-xs font-medium text-slate-500 flex items-center space-x-1">
                  <span>Buyer: <span className="font-bold text-slate-700">{d.buyerName}</span></span>
                  <span>&bull;</span>
                  <span>Farmer: <span className="font-bold text-slate-700">{d.farmerName}</span></span>
                </div>
              </div>
              
              <div className="flex flex-col justify-between items-end md:w-48 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                <div className="text-right w-full mb-4 md:mb-0">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Disputed Amount</div>
                  <div className="text-xl font-black text-slate-900">₹{d.amount}</div>
                </div>
                
                <div className="w-full space-y-2">
                  <button 
                    onClick={() => handleResolve(d.id, 'refund_full')}
                    disabled={processingId === d.id}
                    className="w-full bg-slate-900 text-white px-3 py-2 rounded-lg font-bold text-xs hover:bg-slate-800 transition-colors flex justify-center items-center"
                  >
                    {processingId === d.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Issue Full Refund'}
                  </button>
                  <button 
                    onClick={() => handleResolve(d.id, 'reject')}
                    disabled={processingId === d.id}
                    className="w-full bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg font-bold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Reject Claim
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Disputes;
