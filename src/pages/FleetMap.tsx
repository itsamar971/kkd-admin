import React, { useState } from 'react';
import { Map, Navigation2, Truck, Battery, Signal, Clock } from 'lucide-react';

const FleetMap: React.FC = () => {
  // Mock data for fleet
  const [trucks] = useState([
    { id: 'TRK-001', driver: 'Rajesh K.', speed: 45, load: 'Vegetables (2.4t)', eta: '14 mins', status: 'moving', x: 30, y: 40 },
    { id: 'TRK-002', driver: 'Amit S.', speed: 0, load: 'Wheat (4.0t)', eta: 'Arrived', status: 'stopped', x: 60, y: 70 },
    { id: 'TRK-003', driver: 'Vikram B.', speed: 55, load: 'Fruits (1.2t)', eta: '32 mins', status: 'moving', x: 75, y: 25 },
  ]);

  const [selectedTruck, setSelectedTruck] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Live Fleet Tracking</h2>
        <p className="text-sm text-slate-500 mt-1">Real-time Logistics 2.0 control room.</p>
      </div>

      <div className="flex-1 bg-slate-900 rounded-3xl overflow-hidden relative border-4 border-slate-900 shadow-2xl flex">
        {/* Fake Map Background using CSS patterns */}
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', 
          backgroundSize: '32px 32px' 
        }}></div>
        
        {/* Render Trucks */}
        <div className="absolute inset-0">
          {trucks.map(truck => (
            <div 
              key={truck.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                selectedTruck === truck.id ? 'z-20 scale-125' : 'z-10 hover:scale-110'
              }`}
              style={{ left: `${truck.x}%`, top: `${truck.y}%` }}
              onClick={() => setSelectedTruck(selectedTruck === truck.id ? null : truck.id)}
            >
              <div className="relative">
                {truck.status === 'moving' && (
                  <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping"></div>
                )}
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-lg border-2 ${
                  selectedTruck === truck.id ? 'bg-primary border-white text-white' : 'bg-slate-800 border-slate-600 text-primary'
                }`}>
                  <Navigation2 className={`h-5 w-5 ${truck.status === 'moving' ? 'animate-pulse' : ''}`} style={{ transform: 'rotate(45deg)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Info Panel */}
        <div className="relative z-30 w-80 bg-slate-800/90 backdrop-blur-md border-r border-slate-700 h-full p-6 flex flex-col text-slate-200">
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
            <h3 className="font-bold text-sm tracking-widest uppercase text-slate-400">System Online</h3>
          </div>

          {selectedTruck ? (() => {
            const t = trucks.find(x => x.id === selectedTruck)!;
            return (
              <div className="space-y-6 animate-in slide-in-from-left-4">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">{t.id}</h2>
                  <p className="text-primary font-bold mt-1">{t.driver}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <Clock className="h-4 w-4 text-slate-400 mb-2" />
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">ETA</div>
                    <div className="text-lg font-bold text-white">{t.eta}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <Navigation2 className="h-4 w-4 text-slate-400 mb-2" />
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Speed</div>
                    <div className="text-lg font-bold text-white">{t.speed} km/h</div>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-400 flex items-center"><Truck className="h-4 w-4 mr-2" /> Cargo</span>
                    <span className="text-sm font-bold text-white">{t.load}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-400 flex items-center"><Signal className="h-4 w-4 mr-2" /> Signal</span>
                    <span className="text-sm font-bold text-green-400">Excellent</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-400 flex items-center"><Battery className="h-4 w-4 mr-2" /> Battery</span>
                    <span className="text-sm font-bold text-white">84%</span>
                  </div>
                </div>
              </div>
            );
          })() : (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <Map className="h-12 w-12 text-slate-600 mx-auto mb-4 opacity-50" />
                <p className="text-sm font-medium text-slate-400">Select a unit on the map to view live telemetry.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FleetMap;
