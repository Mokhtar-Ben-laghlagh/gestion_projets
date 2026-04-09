import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, AlertTriangle, Clock, CheckCircle2,
  DollarSign, Activity, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { reportingService } from '../services/reportingService';

const Reporting: React.FC = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [termineesNonFacturees, setTermineesNonFacturees] = useState<any[]>([]);
  const [factureesNonPayees, setFactureesNonPayees] = useState<any[]>([]);
  const [projetsEnCours, setProjetsEnCours] = useState<any[]>([]);
  const [projetsClotures, setProjetsClotures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'terminees' | 'facturees' | 'en-cours' | 'clotures'>('dashboard');

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [dashRes, termRes, factRes, encRes, clotRes] = await Promise.allSettled([
        reportingService.getDashboard(),
        reportingService.getPhasesTermineesNonFacturees(),
        reportingService.getPhasesFactureesNonPayees(),
        reportingService.getProjetsEnCours(),
        reportingService.getProjetsClotures(),
      ]);
      if (dashRes.status === 'fulfilled') setDashboard(dashRes.value.data);
      if (termRes.status === 'fulfilled') setTermineesNonFacturees(termRes.value.data || []);
      if (factRes.status === 'fulfilled') setFactureesNonPayees(factRes.value.data || []);
      if (encRes.status === 'fulfilled') setProjetsEnCours(encRes.value.data || []);
      if (clotRes.status === 'fulfilled') setProjetsClotures(clotRes.value.data || []);
    } catch (err) {
      toast.error('Erreur lors du chargement du reporting');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const pieData = [
    { name: 'En cours', value: projetsEnCours.length || dashboard?.totalProjetsEnCours || 0 },
    { name: 'Clôturés', value: projetsClotures.length || dashboard?.totalProjetsClotures || 0 },
  ];

  const barData = [
    { name: 'Phases terminées\nnon facturées', value: termineesNonFacturees.length, color: '#f59e0b' },
    { name: 'Phases facturées\nnon payées', value: factureesNonPayees.length, color: '#ef4444' },
    { name: 'Projets en cours', value: projetsEnCours.length, color: '#6366f1' },
    { name: 'Projets clôturés', value: projetsClotures.length, color: '#10b981' },
  ];

  const tabs = [
    { id: 'dashboard', label: 'Vue globale', icon: <BarChart3 size={16} /> },
    { id: 'terminees', label: `Non facturées (${termineesNonFacturees.length})`, icon: <AlertTriangle size={16} /> },
    { id: 'facturees', label: `Non payées (${factureesNonPayees.length})`, icon: <Clock size={16} /> },
    { id: 'en-cours', label: `En cours (${projetsEnCours.length})`, icon: <Activity size={16} /> },
    { id: 'clotures', label: `Clôturés (${projetsClotures.length})`, icon: <CheckCircle2 size={16} /> },
  ];

  const PhaseTable = ({ phases, title, badgeClass }: { phases: any[], title: string, badgeClass: string }) => (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${badgeClass}`}>{phases.length}</span>
        {title}
      </h3>
      {phases.length === 0 ? (
        <div className="text-center py-10 text-gray-400">Aucune phase dans cette catégorie.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-text-secondary text-sm">
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Phase</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Projet</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Montant</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Date Fin</th>
              </tr>
            </thead>
            <tbody>
              {phases.map((p: any, idx: number) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-white">{p.libelle || p.phaseLibelle}</p>
                    <p className="text-xs text-text-muted font-mono">{p.code}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{p.projetNom || '—'}</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">{(p.montant || 0).toLocaleString()} MAD</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">
                    {p.dateFin ? new Date(p.dateFin).toLocaleDateString('fr-FR') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const ProjetTable = ({ projets, title }: { projets: any[], title: string }) => (
    <div>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {projets.length === 0 ? (
        <div className="text-center py-10 text-gray-400">Aucun projet dans cette catégorie.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-text-secondary text-sm">
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Projet</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Organisme</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Budget</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Période</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody>
              {projets.map((p: any, idx: number) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-white">{p.nom}</p>
                    <p className="text-xs text-text-muted font-mono">{p.code}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{p.organisme?.nom || p.organismeNom || '—'}</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">{(p.montant || 0).toLocaleString()} MAD</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">
                    {p.dateDebut ? new Date(p.dateDebut).toLocaleDateString('fr-FR') : '—'} →{' '}
                    {p.dateFin ? new Date(p.dateFin).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      p.statut === 'EN_COURS' ? 'bg-indigo-500/20 text-indigo-400' :
                      p.statut === 'CLOTURE' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>{p.statut?.replace('_', ' ') || '—'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient flex items-center gap-3">
            <BarChart3 className="text-indigo-400" /> Reporting & Tableau de Bord
          </h1>
          <p className="text-text-secondary mt-1">Vue analytique et indicateurs de performance du système.</p>
        </div>
        <button onClick={fetchAll} className="btn-primary flex items-center gap-2">
          <RefreshCw size={16} /><span>Actualiser</span>
        </button>
      </div>

      {/* KPI Cards */}
      {!isLoading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Projets en cours', value: projetsEnCours.length || dashboard?.totalProjetsEnCours || 0, icon: <Activity size={20} />, color: 'from-indigo-500 to-cyan-500' },
            { label: 'Projets clôturés', value: projetsClotures.length || dashboard?.totalProjetsClotures || 0, icon: <CheckCircle2 size={20} />, color: 'from-emerald-400 to-teal-500' },
            { label: 'Phases non facturées', value: termineesNonFacturees.length, icon: <AlertTriangle size={20} />, color: 'from-amber-400 to-orange-500' },
            { label: 'Factures non payées', value: factureesNonPayees.length, icon: <DollarSign size={20} />, color: 'from-red-500 to-pink-500' },
          ].map((kpi, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              className="glass-panel p-5 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${kpi.color} rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity`} />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-text-secondary text-xs font-medium mb-1">{kpi.label}</p>
                  <h3 className="text-3xl font-bold text-white">{kpi.value}</h3>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} p-2 text-white`}>{kpi.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="glass-panel p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />Vue d'ensemble par catégorie
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis stroke="#6b7280" tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                        <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(26,29,41,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {barData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />Répartition des projets
                  </h3>
                  <div className="h-64 flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                          {pieData.map((_, index) => <Cell key={index} fill={COLORS[index]} />)}
                        </Pie>
                        <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(26,29,41,0.95)', border: 'none', borderRadius: '12px', color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-bold text-white">{pieData.reduce((a, b) => a + b.value, 0)}</span>
                      <span className="text-xs text-gray-400">Total projets</span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 mt-2">
                    {pieData.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        {d.name} ({d.value})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'terminees' && (
            <PhaseTable phases={termineesNonFacturees} title="Phases terminées non facturées" badgeClass="bg-amber-500/20 text-amber-400" />
          )}
          {activeTab === 'facturees' && (
            <PhaseTable phases={factureesNonPayees} title="Phases facturées non payées" badgeClass="bg-red-500/20 text-red-400" />
          )}
          {activeTab === 'en-cours' && (
            <ProjetTable projets={projetsEnCours} title="Projets en cours" />
          )}
          {activeTab === 'clotures' && (
            <ProjetTable projets={projetsClotures} title="Projets clôturés" />
          )}
        </div>
      )}
    </div>
  );
};

export default Reporting;
