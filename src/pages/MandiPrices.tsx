import React, { useState, useEffect } from 'react';
import { Scale, TrendingUp, TrendingDown, Minus, Loader2, AlertTriangle } from 'lucide-react';
import api from '../api/axios';

interface MandiPrice {
  id: string;
  crop: string;
  mandiPrice: number;
  platformAvgPrice: number;
  trend: 'up' | 'down' | 'stable';
}

const MandiPrices: React.FC = () => {
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await api.get('/admin/mandi');
        setPrices(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Live Mandi Prices</h2>
        <p className="text-sm text-slate-500 mt-1">Compare local government Mandi rates against your platform's averages to stay competitive.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-slate-400 h-8 w-8" /></div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Crop</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Local Mandi (Avg/kg)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Platform (Avg/kg)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Variance</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {prices.map(p => {
                const diff = p.platformAvgPrice - p.mandiPrice;
                const percentDiff = (diff / p.mandiPrice) * 100;
                const isHigh = percentDiff > 30; // Flag if platform is > 30% more expensive

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{p.crop}</td>
                    <td className="px-6 py-4 font-medium text-slate-600 flex items-center space-x-2">
                      <span>₹{p.mandiPrice}</span>
                      {p.trend === 'up' && <TrendingUp className="h-3 w-3 text-red-500" />}
                      {p.trend === 'down' && <TrendingDown className="h-3 w-3 text-green-500" />}
                      {p.trend === 'stable' && <Minus className="h-3 w-3 text-slate-400" />}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">₹{p.platformAvgPrice}</td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {diff > 0 ? '+' : ''}{diff} ({(percentDiff > 0 ? '+' : '') + percentDiff.toFixed(1)}%)
                    </td>
                    <td className="px-6 py-4">
                      {isHigh ? (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit">
                          <AlertTriangle className="h-3 w-3 mr-1" /> Uncompetitive
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit">
                          <Scale className="h-3 w-3 mr-1" /> Fair Price
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MandiPrices;
