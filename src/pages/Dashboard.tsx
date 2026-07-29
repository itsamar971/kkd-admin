import React, { useEffect, useState } from 'react';
import { IndianRupee, ShoppingBag, Users, TrendingUp, Filter, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import api from '../api/axios';

interface Stats {
  totalOrdersCount: number;
  totalRevenueSum: number;
  activeFarmers?: number;
  activeBuyers?: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalOrdersCount: 0,
    totalRevenueSum: 0,
    activeFarmers: 120, // Mock data for now
    activeBuyers: 3450, // Mock data for now
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking data immediately instead of calling API
    setTimeout(() => {
      setStats({
        totalOrdersCount: 1248,
        totalRevenueSum: 845000,
        activeFarmers: 120,
        activeBuyers: 3450,
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading Dashboard...</div>;
  }

  // Premium CSS classes for reusable cards
  const cardClass = "bg-white rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4";

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      
      {/* Top Section - Title and Main Metric */}
      <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-[22px] font-black tracking-tight text-[#94a3b8]">Total Revenue</h2>
          <div className="flex items-center mt-1">
            <span className="text-[40px] font-black text-[#0f172a] tracking-tighter leading-none">
              ₹{stats.totalRevenueSum.toLocaleString('en-IN')}
            </span>
            <div className="ml-4 flex space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#fb3f6c] text-white text-xs font-bold shadow-sm shadow-[#fb3f6c]/30">
                <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" /> 7.9%
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0ea5e9] text-white text-xs font-bold shadow-sm shadow-[#0ea5e9]/30">
                ₹12,335
              </span>
            </div>
          </div>
          <p className="text-[13px] text-[#94a3b8] mt-2 font-medium">vs prev. ₹741,641 Jun 1 - Aug 31, 2026</p>
        </div>
        
        <div className="flex space-x-3 pb-1">
           <div className="bg-white rounded-full border-none shadow-[0_4px_20px_rgb(0,0,0,0.04)] py-3 px-5 flex items-center cursor-pointer hover:scale-105 transition-transform">
             <div className="text-[13px] text-[#94a3b8] font-bold">Top Farmer</div>
             <div className="ml-3 text-[15px] font-black text-[#0f172a]">Ramesh</div>
           </div>
           <div className="bg-[#0f172a] rounded-full shadow-[0_4px_20px_rgb(15,23,42,0.2)] py-3 px-5 flex items-center cursor-pointer hover:scale-105 transition-transform">
             <div className="text-[13px] text-[#94a3b8] font-bold">Best Deal</div>
             <div className="ml-3 text-[15px] font-black text-white">₹42,300</div>
           </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Metric Card 1 */}
        <div className={`${cardClass} hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow`}>
          <div className="flex items-center justify-between">
            <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <ShoppingBag className="h-3 w-3" />
            </div>
            <MoreHorizontal className="h-4 w-4 text-slate-300" />
          </div>
          <div className="mt-2">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Total Orders</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{stats.totalOrdersCount.toLocaleString('en-IN')}</h3>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px]">
            <span className="text-green-500 font-bold flex items-center"><TrendingUp className="h-3 w-3 mr-1" /> +18.2%</span>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className={`${cardClass} hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow`}>
          <div className="flex items-center justify-between">
            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Users className="h-3 w-3" />
            </div>
            <MoreHorizontal className="h-4 w-4 text-slate-300" />
          </div>
          <div className="mt-2">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Active Farmers</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{stats.activeFarmers}</h3>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 font-medium">14 pending verify</span>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className={`${cardClass} hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow`}>
          <div className="flex items-center justify-between">
            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <Users className="h-3 w-3" />
            </div>
            <MoreHorizontal className="h-4 w-4 text-slate-300" />
          </div>
          <div className="mt-2">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Active Buyers</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{stats.activeBuyers?.toLocaleString('en-IN')}</h3>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 font-medium">89 new this week</span>
          </div>
        </div>
        
        {/* Metric Card 4 (Accent) */}
        <div className={`bg-primary rounded-2xl shadow-[0_8px_30px_rgb(225,53,95,0.3)] p-4 text-white hover:scale-[1.02] transition-transform`}>
          <div className="flex items-center justify-between">
            <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
              <IndianRupee className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-[10px] font-medium text-white/80 uppercase tracking-wider">Platform Value</p>
            <h3 className="text-xl font-bold mt-0.5">₹18,552</h3>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px]">
            <span className="font-bold bg-white/20 px-2 py-0.5 rounded-full">373 / 276</span>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        
        <div className={`${cardClass} col-span-2 flex flex-col`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-700">Deals amount <span className="font-normal text-slate-400 text-[10px] block">by referrer category</span></h3>
            <button className="flex items-center space-x-1 px-2 py-1 bg-slate-50 rounded-full text-slate-600 font-medium hover:bg-slate-100 text-[10px]">
              <span>Filters</span>
              <Filter className="h-3 w-3" />
            </button>
          </div>
          
          <div className="flex-1 flex items-end justify-around pb-2 mt-2">
            {/* Mock Chart Bars (Reduced height) */}
            <div className="flex flex-col items-center w-8 group">
              <div className="w-8 h-12 bg-blue-100 rounded-t-lg relative group-hover:bg-blue-200 transition-colors">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center font-bold text-blue-500 text-[9px]">A</div>
              </div>
            </div>
            <div className="flex flex-col items-center w-8 group">
              <div className="w-8 h-20 bg-pink-100 rounded-t-lg relative group-hover:bg-pink-200 transition-colors">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center font-bold text-pink-500 text-[9px]">B</div>
              </div>
            </div>
            <div className="flex flex-col items-center w-8 group">
              <div className="w-8 h-6 bg-green-100 rounded-t-lg relative group-hover:bg-green-200 transition-colors">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center font-bold text-green-500 text-[9px]">C</div>
              </div>
            </div>
            <div className="flex flex-col items-center w-8 group">
              <div className="w-8 h-16 bg-purple-100 rounded-t-lg relative group-hover:bg-purple-200 transition-colors">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center font-bold text-purple-500 text-[9px]">D</div>
              </div>
            </div>
            <div className="flex flex-col items-center w-8 group">
              <div className="w-8 h-24 bg-slate-100 border border-slate-200 border-dashed rounded-t-lg relative group-hover:bg-slate-200 transition-colors">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center font-bold text-slate-500 text-[9px]">E</div>
              </div>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-700">Recent Sales</h3>
            <button className="p-1 bg-slate-50 rounded-full text-slate-600 hover:bg-slate-100">
              <MoreHorizontal className="h-3 w-3" />
            </button>
          </div>
          
          <div className="space-y-3">
            {/* Mock List */}
            {[
              { name: 'Ramesh Singh', val: '₹209,633', p: '43%', c: 'bg-orange-100 text-orange-600' },
              { name: 'Suresh Kumar', val: '₹142,823', p: '27%', c: 'bg-pink-100 text-pink-600' },
              { name: 'Geeta Devi', val: '₹89,935', p: '11%', c: 'bg-blue-100 text-blue-600' },
              { name: 'Amit Patel', val: '₹37,028', p: '7%', c: 'bg-green-100 text-green-600' },
            ].map((i, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`h-6 w-6 rounded-full ${i.c} flex items-center justify-center font-bold text-[10px]`}>
                    {i.name.charAt(0)}
                  </div>
                  <span className="font-bold text-slate-700 text-xs">{i.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 text-xs">{i.val}</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md">{i.p}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
