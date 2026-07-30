import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { CheckCircle, Plus, Trash2 } from 'lucide-react';

interface Buyer {
  uid: string;
  email: string;
  displayName?: string;
  name?: string;
  fullName?: string;
  mobile?: string;
  phone?: string;
  role: string;
  createdAt?: string;
}

const Buyers: React.FC = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);

  // Add User State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBuyer, setNewBuyer] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      const allBuyers = response.data.filter((u: any) => u.role === 'buyer');
      setBuyers(allBuyers);
    } catch (error) {
      console.error('Failed to fetch buyers', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuyer.email || !newBuyer.name) return;
    
    const createdUser: Buyer = {
      uid: 'b' + Date.now(),
      email: newBuyer.email,
      displayName: newBuyer.name,
      role: 'buyer',
      createdAt: new Date().toISOString()
    };
    
    setBuyers([createdUser, ...buyers]);
    setIsAddModalOpen(false);
    setNewBuyer({ name: '', email: '', password: '' });
  };

  const handleDelete = (uid: string) => {
    if (window.confirm('Are you sure you want to delete this buyer?')) {
      setBuyers(buyers.filter(b => b.uid !== uid));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Buyers Management</h2>
          <p className="text-sm text-slate-500 mt-1">
            View all registered buyers and add new buyers to the platform.
          </p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-full font-bold shadow-md shadow-primary/20 hover:scale-105 transition-transform text-sm">
              <Plus className="h-4 w-4" />
              <span>Add Buyer</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Buyer</DialogTitle>
              <DialogDescription>
                Create a new buyer account manually.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddBuyer} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                <input required type="text" value={newBuyer.name} onChange={e => setNewBuyer({...newBuyer, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Anil Kumar" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                <input required type="email" value={newBuyer.email} onChange={e => setNewBuyer({...newBuyer, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="anil@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Temporary Password</label>
                <input required type="password" value={newBuyer.password} onChange={e => setNewBuyer({...newBuyer, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="••••••••" />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">Create Buyer</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center">
          <h3 className="text-sm font-bold text-slate-700">Registered Buyers</h3>
        </div>
        <div className="p-4">
          {loading ? (
            <div className="py-8 text-center text-slate-500 text-sm font-medium">Loading buyers...</div>
          ) : buyers.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">No buyers found.</div>
          ) : (
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-600">Name</TableHead>
                    <TableHead className="font-semibold text-slate-600">Email</TableHead>
                    <TableHead className="font-semibold text-slate-600">Phone</TableHead>
                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                    <TableHead className="font-semibold text-slate-600">Joined Date</TableHead>
                    <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buyers.map((buyer) => (
                    <TableRow key={buyer.uid} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-bold text-slate-700 text-sm">{buyer.name || buyer.fullName || buyer.displayName || 'Unnamed Buyer'}</TableCell>
                      <TableCell className="text-slate-500 text-sm">{buyer.email}</TableCell>
                      <TableCell className="text-slate-500 text-sm">{buyer.mobile || buyer.phone || 'N/A'}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Active
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {buyer.createdAt 
                          ? new Date(buyer.createdAt).toLocaleDateString()
                          : 'Unknown'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center">
                          <button onClick={() => handleDelete(buyer.uid)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Buyers;
