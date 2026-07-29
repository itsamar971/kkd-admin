import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import api from '../api/axios';
import { CheckCircle, AlertTriangle, Plus, Trash2 } from 'lucide-react';

interface Farmer {
  uid: string;
  email: string;
  displayName?: string;
  role: string;
  isVerified?: boolean;
  lastVerifiedAt?: string;
  createdAt?: string;
}

const Farmers: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  
  // Add User State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFarmer, setNewFarmer] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      // Mock Data
      setTimeout(() => {
        setFarmers([
          { uid: 'f1', email: 'ramesh@farmer.com', displayName: 'Ramesh Singh', role: 'farmer', isVerified: true, lastVerifiedAt: new Date().toISOString(), createdAt: '2023-01-10T10:00:00Z' },
          { uid: 'f2', email: 'suresh@farmer.com', displayName: 'Suresh Kumar', role: 'farmer', isVerified: false, lastVerifiedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), createdAt: '2023-02-15T12:30:00Z' },
          { uid: 'f3', email: 'geeta@farmer.com', displayName: 'Geeta Devi', role: 'farmer', isVerified: false, createdAt: '2023-03-20T09:15:00Z' },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch farmers', error);
      setLoading(false);
    }
  };

  const handleVerify = async (uid: string) => {
    try {
      setVerifyingId(uid);
      await api.patch(`/admin/users/${uid}/verify`);
      setFarmers(prev => prev.map(f => 
        f.uid === uid 
          ? { ...f, isVerified: true, lastVerifiedAt: new Date().toISOString() } 
          : f
      ));
    } catch (error) {
      console.error('Failed to verify farmer', error);
      // Mock success for frontend-only
      setFarmers(prev => prev.map(f => 
        f.uid === uid 
          ? { ...f, isVerified: true, lastVerifiedAt: new Date().toISOString() } 
          : f
      ));
    } finally {
      setVerifyingId(null);
    }
  };

  const handleAddFarmer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarmer.email || !newFarmer.name) return;
    
    const createdUser: Farmer = {
      uid: 'f' + Date.now(),
      email: newFarmer.email,
      displayName: newFarmer.name,
      role: 'farmer',
      isVerified: false,
      createdAt: new Date().toISOString()
    };
    
    setFarmers([createdUser, ...farmers]);
    setIsAddModalOpen(false);
    setNewFarmer({ name: '', email: '', password: '' });
  };

  const handleDelete = (uid: string) => {
    if (window.confirm('Are you sure you want to delete this farmer?')) {
      setFarmers(farmers.filter(f => f.uid !== uid));
    }
  };

  const needsVerification = (farmer: Farmer) => {
    if (!farmer.isVerified) return true;
    if (!farmer.lastVerifiedAt) return true;
    
    const lastVer = new Date(farmer.lastVerifiedAt).getTime();
    const now = new Date().getTime();
    const daysSinceVer = (now - lastVer) / (1000 * 3600 * 24);
    
    return daysSinceVer > 30;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Farmers Management</h2>
          <p className="text-sm text-slate-500 mt-1">
            View all registered farmers, add new ones, and manage verification status.
          </p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-full font-bold shadow-md shadow-primary/20 hover:scale-105 transition-transform text-sm">
              <Plus className="h-4 w-4" />
              <span>Add Farmer</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Farmer</DialogTitle>
              <DialogDescription>
                Create a new farmer account manually.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddFarmer} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                <input required type="text" value={newFarmer.name} onChange={e => setNewFarmer({...newFarmer, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Ramesh Singh" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                <input required type="email" value={newFarmer.email} onChange={e => setNewFarmer({...newFarmer, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="ramesh@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Temporary Password</label>
                <input required type="password" value={newFarmer.password} onChange={e => setNewFarmer({...newFarmer, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="••••••••" />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">Create Farmer</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center">
          <h3 className="text-sm font-bold text-slate-700">Registered Farmers</h3>
        </div>
        <div className="p-4">
          {loading ? (
            <div className="py-8 text-center text-slate-500 text-sm font-medium">Loading farmers...</div>
          ) : farmers.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">No farmers found.</div>
          ) : (
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-600">Name</TableHead>
                    <TableHead className="font-semibold text-slate-600">Email</TableHead>
                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                    <TableHead className="font-semibold text-slate-600">Last Verified</TableHead>
                    <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {farmers.map((farmer) => {
                    const isPending = needsVerification(farmer);
                    return (
                      <TableRow key={farmer.uid} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-bold text-slate-700 text-sm">{farmer.displayName || 'Unnamed Farmer'}</TableCell>
                        <TableCell className="text-slate-500 text-sm">{farmer.email}</TableCell>
                        <TableCell>
                          {isPending ? (
                            <span className="inline-flex items-center bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Action Required
                            </span>
                          ) : (
                            <span className="inline-flex items-center bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Verified
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">
                          {farmer.lastVerifiedAt 
                            ? new Date(farmer.lastVerifiedAt).toLocaleDateString()
                            : 'Never'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2 items-center">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">
                                  Verify
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Farmer Verification</DialogTitle>
                                  <DialogDescription>
                                    Review the crop image uploaded by {farmer.displayName || farmer.email}.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <div className="border rounded-md overflow-hidden bg-slate-100 flex items-center justify-center min-h-[250px]">
                                    <img 
                                      src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}/public/uploads/crop_${farmer.uid}.jpg`} 
                                      alt="Crop verification" 
                                      className="max-w-full max-h-[300px] object-contain"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement!.innerHTML = '<div class="text-slate-400 text-sm font-medium">No image uploaded yet or image not found</div>';
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2 pt-4 border-t">
                                  <Button variant="outline">Close</Button>
                                  <Button 
                                    className="bg-green-600 hover:bg-green-700 text-white" 
                                    onClick={() => handleVerify(farmer.uid)}
                                    disabled={verifyingId === farmer.uid || (!isPending && !!farmer.lastVerifiedAt)}
                                  >
                                    {verifyingId === farmer.uid ? 'Verifying...' : 'Verify Farmer'}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <button onClick={() => handleDelete(farmer.uid)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Farmers;
