import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, Users, Building2,
  FileCheck2, CreditCard, UserCheck, ClipboardList,
  Shield, FolderOpen, BarChart3, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { hasRole, logout, user } = useAuth();

  const menuGroups = [
    {
      label: 'Principal',
      items: [
        { name: 'Tableau de bord', path: '/', icon: <LayoutDashboard size={18} />, roles: ['ALL'] },
      ]
    },
    {
      label: 'Gestion métier',
      items: [
        { name: 'Organismes', path: '/organismes', icon: <Building2 size={18} />, roles: ['ADMINISTRATEUR', 'ADMIN', 'DIRECTEUR', 'SECRETAIRE'] },
        { name: 'Employés', path: '/employes', icon: <Users size={18} />, roles: ['ADMINISTRATEUR', 'ADMIN'] },
        { name: 'Profils', path: '/profil', icon: <Shield size={18} />, roles: ['ADMINISTRATEUR', 'ADMIN'] },
        { name: 'Projets', path: '/projets', icon: <FolderKanban size={18} />, roles: ['ADMINISTRATEUR', 'ADMIN'] },
        { name: 'Phases', path: '/phases', icon: <ClipboardList size={18} />, roles: ['ALL'] },
        { name: 'Affectations', path: '/affectations', icon: <UserCheck size={18} />, roles: ['ADMINISTRATEUR', 'ADMIN', 'CHEF_PROJET', 'DIRECTEUR', 'EMPLOYE'] },
        { name: 'Livrables', path: '/livrables', icon: <FileCheck2 size={18} />, roles: ['ADMINISTRATEUR', 'ADMIN', 'CHEF_PROJET', 'DIRECTEUR', 'EMPLOYE'] },
        { name: 'Documents', path: '/documents', icon: <FolderOpen size={18} />, roles: ['ADMINISTRATEUR', 'ADMIN', 'CHEF_PROJET', 'DIRECTEUR', 'SECRETAIRE', 'EMPLOYE'] },
      ]
    },
    {
      label: 'Finance & Reporting',
      items: [
        { name: 'Factures', path: '/factures', icon: <CreditCard size={18} />, roles: ['ADMINISTRATEUR', 'ADMIN', 'DIRECTEUR', 'COMPTABLE'] },
        { name: 'Reporting', path: '/reporting', icon: <BarChart3 size={18} />, roles: ['ADMINISTRATEUR', 'ADMIN', 'DIRECTEUR', 'COMPTABLE'] },
      ]
    }
  ];

  return (
    <div className="w-64 h-full bg-[#1a1d29]/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-20 hidden md:flex">
      {/* Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <FolderKanban size={18} className="text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">GP Système</h2>
          <p className="text-[10px] text-gray-500">Gestion de Projets</p>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 custom-scrollbar">
        {menuGroups.map(group => {
          const visibleItems = group.items.filter(item => hasRole(item.roles));
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.label}>
              <p className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold px-3 mb-2">{group.label}</p>
              <div className="space-y-0.5">
                {visibleItems.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                        isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)] rounded-xl"
                            initial={false}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                        <div className={`relative z-10 ${isActive ? 'text-indigo-400' : 'group-hover:text-white'}`}>
                          {item.icon}
                        </div>
                        <span className="font-medium relative z-10 text-sm">{item.name}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* User + Logout */}
      <div className="p-3 border-t border-white/5">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {(user.prenom || user.login || '?')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.prenom} {user.nom}</p>
              <p className="text-[10px] text-gray-500 truncate">{user.profil?.libelle || 'Utilisateur'}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
        >
          <LogOut size={16} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
