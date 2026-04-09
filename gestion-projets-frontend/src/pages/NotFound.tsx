import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
          <AlertTriangle size={40} className="text-red-400" />
        </div>
        <div>
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
            404
          </h1>
          <h2 className="text-2xl font-bold text-white mt-2">Page introuvable</h2>
          <p className="text-gray-400 mt-2">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="btn-primary flex items-center gap-2 mx-auto"
        >
          <Home size={18} /> Retour au tableau de bord
        </button>
      </motion.div>
    </div>
  );
};

export default NotFound;
