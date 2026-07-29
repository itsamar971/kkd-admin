import React, { useState, useEffect } from 'react';
import { BarChart3, Download, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import api from '../api/axios';

interface SalesData {
  month: string;
  revenue: number;
}
interface CategoryData {
  name: string;
  value: number;
}

const Analytics: React.FC = () => {
  const [sales, setSales] = useState<SalesData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics');
        setSales(res.data.salesData);
        setCategories(res.data.categoryData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleExport = () => {
    // Basic CSV export
    let csv = 'Month,Revenue\\n';
    sales.forEach(s => csv += `${s.month},${s.revenue}\\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-slate-400 h-8 w-8" /></div>;

  const maxRevenue = Math.max(...sales.map(s => s.revenue));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Advanced Analytics</h2>
          <p className="text-sm text-slate-500 mt-1">Deep dive into your platform's performance metrics.</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-primary" />
            Seasonal Revenue Trends
          </h3>
          <div className="h-64 flex items-end space-x-4">
            {sales.map(s => (
              <div key={s.month} className="flex-1 flex flex-col items-center group">
                <div className="w-full flex-1 flex flex-col justify-end relative">
                  <div className="absolute -top-8 w-full text-center text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{(s.revenue / 1000).toFixed(1)}k
                  </div>
                  <div 
                    className="w-full bg-primary/20 rounded-t-lg group-hover:bg-primary transition-colors relative overflow-hidden" 
                    style={{ height: `${(s.revenue / maxRevenue) * 100}%` }}
                  >
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-primary/40 to-transparent h-1/2"></div>
                  </div>
                </div>
                <span className="mt-2 text-xs font-bold text-slate-500">{s.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Top Categories</h3>
          <div className="space-y-6">
            {categories.map((c, i) => (
              <div key={c.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700">{c.name}</span>
                  <span className="text-sm font-bold text-slate-900">{c.value}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-orange-500' : 'bg-blue-500'}`}
                    style={{ width: `${c.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Key Insights</h4>
            <div className="flex items-start space-x-3 text-sm font-medium text-slate-700">
              <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5"><TrendingUp className="h-3 w-3" /></div>
              <p>Vegetables category grew by 14% this month, primarily driven by tomato sales.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
