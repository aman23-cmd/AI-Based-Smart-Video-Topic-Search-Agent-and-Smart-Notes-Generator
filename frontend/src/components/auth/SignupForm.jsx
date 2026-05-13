import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, AlertCircle } from 'lucide-react';
import AuthPresenter from '../../presenters/AuthPresenter';

const SignupForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [state, setState] = useState({ loading: false, error: null });

  const presenterRef = useRef(null);
  if (!presenterRef.current) {
    presenterRef.current = new AuthPresenter(setState);
  }
  const presenter = presenterRef.current;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPass) {
      setState((s) => ({ ...s, error: 'Passwords do not match.' }));
      return;
    }
    if (password.length < 6) {
      setState((s) => ({ ...s, error: 'Password must be at least 6 characters.' }));
      return;
    }
    const success = await presenter.register(username, email, password);
    if (success) navigate('/dashboard');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto">
      <div className="glass-card p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-sm text-gray-400">Start your AI-powered learning journey</p>
        </div>
        {state.error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{state.error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="glass-input w-full pl-11" required id="signup-username" />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="glass-input w-full pl-11" required id="signup-email" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type={showPass ? 'text' : 'password'} placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} className="glass-input w-full pl-11 pr-11" required id="signup-password" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="password" placeholder="Confirm Password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} className="glass-input w-full pl-11" required id="signup-confirm" />
          </div>
          <button type="submit" disabled={state.loading} className="glass-button w-full flex items-center justify-center gap-2 disabled:opacity-50">
            {state.loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserPlus className="w-4 h-4" /> Create Account</>}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">Sign in</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignupForm;
