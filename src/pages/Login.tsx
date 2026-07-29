import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, EyeOff, Eye, Command, ArrowRightToLine } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { manualAdminLogin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Hardcoded Admin Credential Check
    if (email === 'admin@kisankadukan.in' && password === 'admin9876') {
      manualAdminLogin();
      navigate('/');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // If it's a firebase auth login, AuthContext will verify if they are admin via firestore
      // We will check if the logged in user's email is strictly the allowed one
      if (email !== 'admin@kisankadukan.in') {
        throw new Error('Access Denied. Invalid admin credentials.');
      }
      
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full relative flex flex-col font-sans overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1509803874385-db7c23652552?q=80&w=2600&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Brand Top Left */}
      <div className="absolute top-8 left-8 flex items-center space-x-3 z-10">
        <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
          <Command className="text-white h-5 w-5" />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">KisanAdmin</span>
      </div>

      {/* Center Content */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-4">
        {/* Subtle large circular rings behind card to match the reference */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/20 rounded-full hidden md:block"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/10 rounded-full hidden md:block"></div>

        {/* Login Card */}
        <div className="w-full max-w-[400px] bg-gradient-to-b from-blue-50/90 to-white/95 backdrop-blur-md rounded-[2.5rem] p-8 shadow-2xl border border-white/50 relative overflow-hidden">
          
          {/* Decorative Icon */}
          <div className="mx-auto w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-5">
            <ArrowRightToLine className="h-5 w-5 text-slate-700" strokeWidth={2.5} />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-1.5">Sign in with email</h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Access the KisanAdmin dashboard to manage your orders, users, and marketplace.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium text-center border border-red-100">
                {error}
              </div>
            )}
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100/80 border-transparent focus:border-slate-300 focus:bg-white focus:ring-0 rounded-2xl text-sm font-medium placeholder:text-slate-400 transition-colors"
                placeholder="Email"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-2.5 bg-slate-100/80 border-transparent focus:border-slate-300 focus:bg-white focus:ring-0 rounded-2xl text-sm font-medium placeholder:text-slate-400 transition-colors"
                placeholder="Password"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                ) : (
                  <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                )}
              </button>
            </div>

            <div className="flex justify-end pb-2">
              <a href="#" className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1b26] hover:bg-[#24283b] text-white py-2.5 rounded-2xl font-semibold text-sm shadow-md transition-transform active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? 'Signing in...' : 'Get Started'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
