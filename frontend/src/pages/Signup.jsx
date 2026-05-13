import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SignupForm from '../components/auth/SignupForm';
import { Zap, ArrowLeft } from 'lucide-react';

const Signup = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-12"
    >
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-pink w-[500px] h-[500px] top-[-10%] right-[-10%]" />
        <div className="orb orb-cyan w-[400px] h-[400px] bottom-[-20%] left-[-10%]" style={{ animationDelay: '2s' }} />
      </div>
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="mb-8 flex flex-col items-center">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 self-start group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Home</span>
          </Link>
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">AI VideoSearch</span>
          </Link>
        </div>

        <SignupForm />
      </div>
    </motion.div>
  );
};

export default Signup;
