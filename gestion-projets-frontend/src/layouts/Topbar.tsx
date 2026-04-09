import React, { useState } from 'react';
import { LogOut, User as UserIcon, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Topbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-20 bg-[#1a1d29]/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-[100] sticky top-0">
      <div className="flex-1">
        {/* Breadcrumbs or page title could go here */}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 glass-panel border border-white/10 rounded-xl shadow-2xl overflow-hidden py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-white/10 text-sm font-semibold text-white">
                  Notifications
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-8 text-center text-text-secondary text-sm">
                    Aucune nouvelle notification.
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-white/10 text-center text-xs text-text-muted">
                  Tout est à jour
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-white/10"></div>

        <div className="flex items-center gap-4 group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">{user?.prenom} {user?.nom}</p>
            <p className="text-xs text-indigo-400">{user?.profil?.libelle || "Membre"}</p>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 p-[2px]">
            <div className="w-full h-full bg-[#1a1d29] rounded-full flex items-center justify-center border-2 border-transparent">
              <UserIcon size={18} className="text-white/80" />
            </div>
          </div>
        </div>

        <button 
          onClick={logout}
          className="p-2 text-gray-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
          title="Se déconnecter"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
