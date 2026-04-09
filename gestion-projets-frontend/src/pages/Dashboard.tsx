import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, Activity, TrendingUp, DollarSign, Layers, FileCheck2, UserCheck } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import api from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { hasRole, user } = useAuth();
  const isAdmin = hasRole(['ADMINISTRATEUR', 'ADMIN', 'DIRECTEUR', 'COMPTABLE', 'CHEF_PROJET']);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        if (isAdmin) {
          const response = await api.get('/reporting/tableau-de-bord');
          setData(response.data);
        } else {
          // Employee dashboard: fetch phases and livrables accessible to this user
          const [phasesRes, projetsRes] = await Promise.allSettled([
            api.get('/projets'),
            api.get('/projets'),
          ]);
          // Build simple employee stats from available data
          let totalPhases = 0, phasesTerminees = 0, totalLivrables = 0, livrablesValides = 0;
          if (projetsRes.status === 'fulfilled') {
            for (const p of projetsRes.value.data || []) {
              try {
                const phRes = await api.get(`/projets/${p.id}/phases`);
                for (const ph of phRes.data || []) {
                  totalPhases++;
                  if (ph.etatRealisation) phasesTerminees++;
                  try {
                    const lvRes = await api.get(`/phases/${ph.id}/livrables`);
                    totalLivrables += (lvRes.data || []).length;
                    livrablesValides += (lvRes.data || []).filter((l: any) => l.valide).length;
                  } catch {}
                }
              } catch {}
            }
          }
          setEmployeeData({ totalPhases, phasesTerminees, totalLivrables, livrablesValides });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, [isAdmin]);

  // Real data mapped, default to 0 if data not yet loaded
  const mockLineData = [
    { name: 'En cours', projets: data?.projetsEnCours || 0 },
    { name: 'Clôturés', projets: data?.projetsClotures || 0 },
    { name: 'Total', projets: data?.totalProjets || 0 }
  ];

  const mockPieData = [
    { name: 'En cours', value: data?.projetsEnCours || 0, color: '#6366f1' },
    { name: 'Clôturés', value: data?.projetsClotures || 0, color: '#10b981' },
  ];

  const StatCard = ({ title, value, icon, gradient, delay }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-panel p-6 relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity`} />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} p-3 text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return <div className="animate-pulse flex space-x-4">Chargement des données...</div>;
  }

  // -----------------------------------------------
  // EMPLOYEE DASHBOARD
  // -----------------------------------------------
  if (!isAdmin) {
    const ed = employeeData || {};
    const completionRate = ed.totalPhases > 0 ? Math.round((ed.phasesTerminees / ed.totalPhases) * 100) : 0;
    const validationRate = ed.totalLivrables > 0 ? Math.round((ed.livrablesValides / ed.totalLivrables) * 100) : 0;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Tableau de bord</h1>
          <p className="text-text-secondary mt-1">
            Bonjour, <span className="text-white font-medium">{user?.prenom || user?.login}</span> — voici un résumé de votre activité.
          </p>
        </div>

        {/* Employee KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            { title: 'Phases assignées', value: ed.totalPhases || 0, icon: <Layers />, gradient: 'from-indigo-500 to-cyan-500', delay: 0.1 },
            { title: 'Phases terminées', value: ed.phasesTerminees || 0, icon: <TrendingUp />, gradient: 'from-emerald-400 to-teal-500', delay: 0.2 },
            { title: 'Livrables soumis', value: ed.totalLivrables || 0, icon: <FileCheck2 />, gradient: 'from-amber-400 to-orange-500', delay: 0.3 },
            { title: 'Livrables validés', value: ed.livrablesValides || 0, icon: <Activity />, gradient: 'from-purple-500 to-pink-500', delay: 0.4 },
          ].map(({ title, value, icon, gradient, delay }) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
              className="glass-panel p-6 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity`} />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
                  <h3 className="text-3xl font-bold text-white">{value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} p-3 text-white shadow-lg`}>{icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="glass-panel p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Avancement des phases
            </h3>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-4xl font-black text-white">{completionRate}<span className="text-xl text-gray-400">%</span></span>
              <div className="flex-1">
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${completionRate}%` }} transition={{ delay: 0.7, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" />
                </div>
                <p className="text-xs text-text-muted mt-1">{ed.phasesTerminees || 0} / {ed.totalPhases || 0} phases terminées</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="glass-panel p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Taux de validation des livrables
            </h3>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-4xl font-black text-white">{validationRate}<span className="text-xl text-gray-400">%</span></span>
              <div className="flex-1">
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${validationRate}%` }} transition={{ delay: 0.8, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" />
                </div>
                <p className="text-xs text-text-muted mt-1">{ed.livrablesValides || 0} / {ed.totalLivrables || 0} livrables validés</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick links */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-panel p-5">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Accès rapides</p>
          <div className="flex flex-wrap gap-3">
            {[{ label: 'Mes Phases', path: '/phases', icon: <Layers size={15} /> }, { label: 'Livrables', path: '/livrables', icon: <FileCheck2 size={15} /> }, { label: 'Affectations', path: '/affectations', icon: <UserCheck size={15} /> }]
              .map(link => (
                <a key={link.path} href={link.path} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/40 rounded-xl text-sm text-gray-300 hover:text-white transition-all">
                  {link.icon}{link.label}
                </a>
              ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Tableau de bord</h1>
          <p className="text-text-secondary mt-1">Aperçu global de votre activité métier.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Projets Actifs" 
          value={data?.projetsEnCours || 0} 
          icon={<Activity />} 
          gradient="from-indigo-500 to-cyan-500"
          delay={0.1}
        />
        <StatCard 
          title="Projets Clôturés" 
          value={data?.projetsClotures || 0} 
          icon={<FolderKanban />} 
          gradient="from-emerald-400 to-teal-500"
          delay={0.2}
        />
        <StatCard 
          title="Phases Terminées" 
          value={data?.phasesTerminees || 0} 
          icon={<TrendingUp />} 
          gradient="from-amber-400 to-orange-500"
          delay={0.3}
        />
        <StatCard 
          title="Montant Facturé" 
          value={`${((data?.montantTotalFacture || 0) / 1000).toFixed(1)}k MAD`} 
          icon={<DollarSign />} 
          gradient="from-purple-500 to-pink-500"
          delay={0.4}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Répartition globale
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockLineData}>
                <defs>
                  <linearGradient id="colorProjets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" tick={{fill: '#6b7280'}} axisLine={false} />
                <YAxis stroke="#6b7280" tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(26,29,41,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="projets" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorProjets)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-panel p-6"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Répartition par statut
          </h3>
          <div className="h-72 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {mockPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(26,29,41,0.9)', border: 'none', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-white">{data?.totalProjets || 0}</span>
              <span className="text-xs text-text-secondary">Projets total</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
