import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { motion } from 'framer-motion';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#0f111a] overflow-hidden text-white">
      {/* Sidebar is fixed on the left */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <Topbar />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-6 lg:p-8 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
