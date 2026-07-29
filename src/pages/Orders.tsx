import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import api from '../api/axios';
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';

interface Order {
  id: string;
  buyerId: string;
  farmerId: string;
  productId: string;
  quantityKg: number;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  createdAt: string;
  driverNumber?: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      await api.patch(`/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => 
        o.id === id ? { ...o, status } : o
      ));
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'processing': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 rounded-full px-3"><Package className="mr-1 h-3 w-3" /> Processing</Badge>;
      case 'dispatched': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 rounded-full px-3"><Truck className="mr-1 h-3 w-3" /> Dispatched</Badge>;
      case 'delivered': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 rounded-full px-3"><CheckCircle className="mr-1 h-3 w-3" /> Delivered</Badge>;
      case 'cancelled': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 rounded-full px-3"><XCircle className="mr-1 h-3 w-3" /> Cancelled</Badge>;
      default: return <Badge variant="outline" className="rounded-full px-3">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Orders & Delivery</h2>
        <p className="text-sm text-slate-500">
          Manage all orders, view details, and update delivery statuses.
        </p>
      </div>

      <div className="bg-white rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-700">All Orders</h3>
          <p className="text-sm text-slate-400">A complete log of transactions across the platform.</p>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="py-8 text-center text-slate-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center text-slate-500">No orders found.</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                      <TableCell>
                        {order.createdAt 
                          ? new Date(order.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Order Details</DialogTitle>
                              <DialogDescription>
                                Order ID: <span className="font-mono text-xs">{order.id}</span>
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                              
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-slate-500 block mb-1">Product Details</span>
                                  <div className="font-medium">Product ID: {order.productId.slice(0, 8)}</div>
                                  <div>Quantity: {order.quantityKg} Kg</div>
                                  <div className="font-bold text-green-700 mt-1">Total: ₹{order.totalAmount}</div>
                                </div>
                                <div>
                                  <span className="text-slate-500 block mb-1">Current Status</span>
                                  <div>{getStatusBadge(order.status)}</div>
                                </div>
                              </div>

                              <div className="border-t pt-4 text-sm">
                                <span className="text-slate-500 block mb-1">Delivery Address</span>
                                <p className="bg-slate-50 p-3 rounded-md border text-slate-800">
                                  {order.deliveryAddress}
                                </p>
                              </div>
                              
                              <div className="border-t pt-4">
                                <span className="text-slate-500 block mb-3 text-sm">Update Delivery Status</span>
                                <div className="flex flex-wrap gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleUpdateStatus(order.id, 'processing')}
                                    disabled={updatingId === order.id || order.status === 'processing'}
                                  >
                                    Processing
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-blue-600 hover:text-blue-700"
                                    onClick={() => handleUpdateStatus(order.id, 'dispatched')}
                                    disabled={updatingId === order.id || order.status === 'dispatched'}
                                  >
                                    Dispatched
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                    disabled={updatingId === order.id || order.status === 'delivered'}
                                  >
                                    Delivered
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                    disabled={updatingId === order.id || order.status === 'cancelled'}
                                  >
                                    Cancelled
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
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

export default Orders;
