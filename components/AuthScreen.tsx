import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onLogin: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const user = storageService.login(username, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials');
      }
    } else {
      if (!name || !username || !password) {
        setError('All fields are required');
        return;
      }
      const result = storageService.register(username, password, name);
      if (typeof result === 'string') {
        setError(result);
      } else {
        onLogin(result);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="p-8 bg-indigo-600 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold backdrop-blur-sm">
            M
          </div>
          <h1 className="text-2xl font-bold text-white">MarketMaster RPG</h1>
          <p className="text-indigo-200 text-sm mt-2">The Ultimate Marketing Guild</p>
        </div>
        
        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">
            {isLogin ? 'Welcome Back, Marketer' : 'Join the Guild'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Display Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="e.g. David Ogilvy"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-200 transform hover:-translate-y-1"
            >
              {isLogin ? 'Enter Realm' : 'Begin Journey'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-indigo-600 font-medium text-sm hover:underline"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
          
          {isLogin && (
             <div className="mt-4 text-center">
               <span className="text-xs text-slate-400">Demo Admin: admin / password</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
