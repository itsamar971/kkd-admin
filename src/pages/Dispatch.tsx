import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Truck, Phone, Navigation, Clock, Search } from 'lucide-react';
import api from '../api/axios';

interface Agent {
  id: string;
  name: string;
  phone: string;
  status: 'Available' | 'On Route' | 'Offline';
  currentOrders: number;
}

interface DispatchEvent {
  id: string;
  orderId: string;
  agentName: string;
  pickup: string;
  dropoff: string;
  status: 'In Transit' | 'Delivered' | 'Pending';
  time: string;
}



const mockHistory: DispatchEvent[] = [
  { id: 'd1', orderId: '#ORD-7829', agentName: 'Vikram Singh', pickup: 'Ramesh Farm, Sector 4', dropoff: 'Buyer - Anil, City Center', status: 'In Transit', time: '10:45 AM' },
  { id: 'd2', orderId: '#ORD-7828', agentName: 'Suresh Das', pickup: 'Green Hub, Block C', dropoff: 'Buyer - Priya, North East', status: 'Delivered', time: '09:15 AM' },
  { id: 'd3', orderId: '#ORD-7830', agentName: 'Rajesh Kumar', pickup: 'Pending Pickup', dropoff: 'Pending Assignment', status: 'Pending', time: '11:30 AM' },
];

const Dispatch: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [history, setHistory] = useState<DispatchEvent[]>(mockHistory);


  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/orders');
        const orders = response.data;
        
        const relevantOrders = orders.filter((o: any) => 
          ['processing', 'dispatched', 'delivered'].includes(o.status.toLowerCase())
        );
        
        const mappedHistory: DispatchEvent[] = relevantOrders.map((o: any) => ({
          id: `d_${o.id}`,
          orderId: `#${o.id.slice(0, 8).toUpperCase()}`,
          agentName: o.driverNumber ? `Driver (${o.driverNumber})` : 'Pending Assignment',
          pickup: `Farmer ID: ${o.farmerId.slice(0,6)}`,
          dropoff: o.deliveryAddress,
          status: o.status === 'delivered' ? 'Delivered' : o.status === 'dispatched' ? 'In Transit' : 'Pending',
          time: new Date(o.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }));
        
        setHistory(mappedHistory.length > 0 ? mappedHistory : mockHistory); // Fallback to mock if empty for visual
      } catch (error) {
        console.error('Error fetching dispatch history', error);
      }

      try {
        const usersRes = await api.get('/admin/users');
        const allUsers = usersRes.data;
        const agentUsers = allUsers.filter((u: any) => u.role === 'agent');
        
        const mappedAgents = agentUsers.map((u: any) => ({
          id: u.uid,
          name: u.name || 'Unnamed Agent',
          phone: u.phone || u.mobile || 'No Phone',
          status: u.status || 'Available',
          currentOrders: u.currentOrders || 0
        }));
        setAgents(mappedAgents);
      } catch (error) {
        console.error('Error fetching agents', error);
      }
    };
    
    fetchHistory();
  }, []);

  const cardClass = "bg-white rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Dispatch & Logistics</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage delivery personnel and track dispatch history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Delivery Agents */}
        <div className={`lg:col-span-1 ${cardClass} flex flex-col h-[500px]`}>
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-slate-800">Active Agents</h3>
            </div>
            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{agents.length} Total</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {agents.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                No active agents found.
              </div>
            ) : (
              agents.map(agent => (
                <div key={agent.id} className="border border-slate-100 rounded-xl p-4 hover:shadow-md hover:border-slate-200 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{agent.name}</h4>
                      <div className="flex items-center text-slate-500 text-xs mt-1 font-medium">
                        <Phone className="h-3 w-3 mr-1" /> {agent.phone}
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                      agent.status === 'Available' ? 'bg-green-100 text-green-700' :
                      agent.status === 'On Route' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-t border-slate-50 pt-3">
                    <span className="text-slate-400 font-medium">Current Orders</span>
                    <span className="font-bold text-slate-700">{agent.currentOrders}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Dispatch History */}
        <div className={`lg:col-span-2 ${cardClass} flex flex-col h-[500px]`}>
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <h3 className="text-sm font-bold text-slate-800">Recent Dispatch Log</h3>
            </div>
            <div className="relative">
              <Search className="h-3 w-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search orders..." className="bg-white border border-slate-200 rounded-md pl-7 pr-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-600 text-xs">Order ID</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-xs">Agent</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-xs">Route</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-xs">Status</TableHead>
                    <TableHead className="text-right font-semibold text-slate-600 text-xs">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((event) => (
                    <TableRow key={event.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-bold text-slate-700 text-xs">{event.orderId}</TableCell>
                      <TableCell className="text-slate-600 text-xs font-medium">{event.agentName}</TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1 text-[10px]">
                          <div className="flex items-center text-slate-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-1.5"></span> {event.pickup}
                          </div>
                          <div className="flex items-center text-slate-500">
                            <Navigation className="h-2 w-2 text-primary mr-1 ml-[1px]" /> {event.dropoff}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold ${
                          event.status === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-200' :
                          event.status === 'In Transit' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-orange-50 text-orange-700 border border-orange-200'
                        }`}>
                          {event.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-xs font-medium text-slate-500">
                        {event.time}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dispatch;
