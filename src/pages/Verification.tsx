import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';

interface VerificationProduct {
  id: string;
  name: string;
  farmerName: string;
  price: number;
  unit: string;
  quantity: number;
  description: string;
  images: string[];
  submittedAt: string;
}

const Verification: React.FC = () => {
  const [products, setProducts] = useState<VerificationProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        const res = await api.get('/admin/verification/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to load verifications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVerifications();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setProcessingId(id);
      await api.post(`/admin/verification/products/${id}/approve`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to approve', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setProcessingId(id);
      const feedback = prompt('Enter rejection feedback:');
      if (feedback === null) {
        setProcessingId(null);
        return;
      }
      await api.post(`/admin/verification/products/${id}/reject`, { feedback });
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to reject', err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-slate-400 h-8 w-8" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Verification Hub</h2>
          <p className="text-sm text-slate-500 mt-1">Review and approve crop listings to maintain platform quality.</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">
          <ShieldCheck className="h-4 w-4" />
          <span>{products.length} Pending Review</span>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
          <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">All Caught Up!</h3>
          <p className="text-sm text-slate-500 mt-1">There are no new crops waiting for verification right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="h-48 relative bg-slate-100">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">No Image</div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                  Awaiting Review
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-900 leading-tight">{product.name}</h3>
                  <span className="font-extrabold text-primary">₹{product.price}<span className="text-xs text-slate-500 font-medium">/{product.unit}</span></span>
                </div>
                <div className="text-xs text-slate-500 font-medium mb-3">By <span className="text-slate-700 font-bold">{product.farmerName}</span> &bull; {product.quantity} {product.unit} total</div>
                <p className="text-sm text-slate-600 mb-6 flex-1 line-clamp-3">{product.description}</p>
                
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <button 
                    onClick={() => handleReject(product.id)}
                    disabled={processingId === product.id}
                    className="flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                  <button 
                    onClick={() => handleApprove(product.id)}
                    disabled={processingId === product.id}
                    className="flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-green-500 text-white hover:bg-green-600 rounded-xl font-bold text-sm transition-colors shadow-sm shadow-green-500/30 disabled:opacity-50"
                  >
                    {processingId === product.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    <span>Approve</span>
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

export default Verification;
