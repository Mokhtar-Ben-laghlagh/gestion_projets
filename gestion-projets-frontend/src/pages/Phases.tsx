import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Layers, Calendar, X, Trash2, CheckCircle, FileText, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';

interface Phase {
  id: number;
  code: string;
  libelle: string;
  description?: string;
  dateDebut: string;
  dateFin: string;
  montant: number;
  pourcentage?: number;
  etatRealisation: boolean;
  etatFacturation: boolean;
  etatPaiement: boolean;
  projetId: number;
  projetNom?: string;
}

const emptyForm = {
  code: '', libelle: '', description: '', dateDebut: '', dateFin: '',
  montant: '', pourcentage: '', projetId: ''
};

const Phases: React.FC = () => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [projets, setProjets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { hasRole } = useAuth();
  const canManagePhases = hasRole(['ADMINISTRATEUR', 'ADMIN', 'CHEF_PROJET']);
  // Only managers/admins can change facturation and paiement states
  const canUpdateFinancialStates = hasRole(['ADMINISTRATEUR', 'ADMIN', 'CHEF_PROJET', 'DIRECTEUR', 'COMPTABLE']);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPhases = async () => {
    setIsLoading(true);
    try {
      // Magie du Backend : /api/phases retourne tout pour l'admin, et juste ses phases pour un employé
      const res = await api.get('/phases');
      setPhases(res.data || []);
      
      // Also fetch projects list for the Create/Edit dropdowns (Admins only)
      if (canManagePhases) {
        const projs = await api.get('/projets');
        setProjets(projs.data || []);
      }
    } catch {
      toast.error('Erreur lors du chargement des phases');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPhases(); }, []);

  // CREATE
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { projetId, ...rest } = form;
      await api.post(`/projets/${projetId}/phases`, {
        ...rest,
        montant: Number(rest.montant),
        pourcentage: rest.pourcentage ? Number(rest.pourcentage) : null,
      });
      toast.success('Phase créée avec succès !');
      setIsCreateOpen(false);
      setForm(emptyForm);
      fetchPhases();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de création');
    } finally {
      setIsSubmitting(false);
    }
  };

  // EDIT
  const openEdit = (phase: Phase) => {
    setSelectedPhase(phase);
    setForm({
      code: phase.code,
      libelle: phase.libelle,
      description: phase.description || '',
      dateDebut: phase.dateDebut,
      dateFin: phase.dateFin,
      montant: String(phase.montant),
      pourcentage: phase.pourcentage != null ? String(phase.pourcentage) : '',
      projetId: String(phase.projetId),
    });
    setIsEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhase) return;
    setIsSubmitting(true);
    try {
      await api.put(`/phases/${selectedPhase.id}`, {
        code: form.code,
        libelle: form.libelle,
        description: form.description,
        dateDebut: form.dateDebut,
        dateFin: form.dateFin,
        montant: Number(form.montant),
        pourcentage: form.pourcentage ? Number(form.pourcentage) : null,
      });
      toast.success('Phase modifiée avec succès !');
      setIsEditOpen(false);
      setSelectedPhase(null);
      fetchPhases();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de modification');
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE
  const openDelete = (phase: Phase) => {
    setSelectedPhase(phase);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPhase) return;
    setIsSubmitting(true);
    try {
      await api.delete(`/phases/${selectedPhase.id}`);
      toast.success('Phase supprimée !');
      setIsDeleteOpen(false);
      setSelectedPhase(null);
      fetchPhases();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de suppression');
    } finally {
      setIsSubmitting(false);
    }
  };

  // STATE UPDATES
  const updateEtat = async (phase: Phase, type: 'realisation' | 'facturation' | 'paiement', newEtat: boolean) => {
    try {
      await api.patch(`/phases/${phase.id}/${type}`, { etat: newEtat });
      const label = type === 'realisation' ? 'Réalisation' : type === 'facturation' ? 'Facturation' : 'Paiement';
      toast.success(`${label} mise à jour !`);
      fetchPhases();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de mise à jour');
    }
  };

  const filteredPhases = phases.filter(p =>
    (p.libelle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.projetNom && p.projetNom.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatus = (phase: Phase) => {
    if (phase.etatPaiement) return { label: 'PAYÉE', cls: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' };
    if (phase.etatFacturation) return { label: 'FACTURÉE', cls: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' };
    if (phase.etatRealisation) return { label: 'RÉALISÉE', cls: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' };
    return { label: 'EN COURS', cls: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' };
  };

  const renderPhaseForm = (onSubmit: (e: React.FormEvent) => Promise<void>, title: string) => (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Code *</label>
        <input type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Libellé *</label>
        <input type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.libelle} onChange={e => setForm({ ...form, libelle: e.target.value })} />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm text-gray-400 mb-1">Description</label>
        <textarea className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 min-h-[70px]" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Date de début *</label>
        <input type="date" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 [color-scheme:dark]" value={form.dateDebut} onChange={e => setForm({ ...form, dateDebut: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Date de fin *</label>
        <input type="date" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 [color-scheme:dark]" value={form.dateFin} onChange={e => setForm({ ...form, dateFin: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Montant (MAD) *</label>
        <input type="number" required min="0" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.montant} onChange={e => setForm({ ...form, montant: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Pourcentage %</label>
        <input type="number" min="0" max="100" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.pourcentage} onChange={e => setForm({ ...form, pourcentage: e.target.value })} />
      </div>
      {title === 'Créer une Phase' && (
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-400 mb-1">Projet *</label>
          <select required className="w-full bg-[#1a1d29] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.projetId} onChange={e => setForm({ ...form, projetId: e.target.value })}>
            <option value="">Sélectionner un projet...</option>
            {projets.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
          </select>
        </div>
      )}
      <div className="md:col-span-2 pt-4 flex justify-end gap-3 border-t border-white/10">
        <button type="button" onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Annuler</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">{isSubmitting ? 'Enregistrement...' : 'Enregistrer'}</button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient flex items-center gap-3">
            <Layers className="text-indigo-400" /> Phases des Projets
          </h1>
          <p className="text-text-secondary mt-1">Gérez et suivez l'avancement des phases.</p>
        </div>
        {canManagePhases && (
          <button onClick={() => { setForm(emptyForm); setIsCreateOpen(true); }} className="btn-primary flex items-center gap-2">
            <Plus size={18} /><span>Nouvelle Phase</span>
          </button>
        )}
      </div>

      <div className="glass-panel p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input type="text" placeholder="Rechercher une phase ou projet..." className="pl-10 bg-black/20" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <span className="text-sm text-text-muted ml-4">{filteredPhases.length} phase(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-text-secondary text-sm">
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Phase</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Projet</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Montant</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Statut</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Délai</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-center">États</th>
                {canManagePhases && <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-10"><div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></td></tr>
              ) : filteredPhases.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-text-secondary">Aucune phase trouvée</td></tr>
              ) : filteredPhases.map((phase, idx) => {
                const status = getStatus(phase);
                return (
                  <motion.tr
                    key={phase.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-4 px-4">
                      <p className="font-semibold text-white">{phase.libelle}</p>
                      <p className="text-xs text-text-muted font-mono">{phase.code}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-text-secondary">{phase.projetNom}</td>
                    <td className="py-4 px-4 font-mono text-emerald-400">{phase.montant.toLocaleString()} MAD</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.cls}`}>{status.label}</span>
                    </td>
                    <td className="py-4 px-4 text-sm text-text-muted">
                      <div className="flex items-center gap-1"><Calendar size={13} /> {new Date(phase.dateFin).toLocaleDateString('fr-FR')}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1">
                        {/* Réalisation — accessible à tous les opérationnels */}
                        <button
                          onClick={() => updateEtat(phase, 'realisation', !phase.etatRealisation)}
                          title={phase.etatRealisation ? 'Annuler réalisation' : 'Marquer réalisée'}
                          className={`p-1.5 rounded-lg transition-all text-xs font-bold ${phase.etatRealisation ? 'bg-indigo-500/30 text-indigo-300' : 'bg-white/5 text-gray-500 hover:bg-indigo-500/20 hover:text-indigo-400'}`}
                        >
                          <CheckCircle size={15} />
                        </button>
                        {/* Facturation — managers uniquement */}
                        {canUpdateFinancialStates ? (
                          <button
                            onClick={() => updateEtat(phase, 'facturation', !phase.etatFacturation)}
                            title={phase.etatFacturation ? 'Annuler facturation' : 'Marquer facturée'}
                            className={`p-1.5 rounded-lg transition-all ${phase.etatFacturation ? 'bg-blue-500/30 text-blue-300' : 'bg-white/5 text-gray-500 hover:bg-blue-500/20 hover:text-blue-400'}`}
                          >
                            <FileText size={15} />
                          </button>
                        ) : (
                          <span className={`p-1.5 rounded-lg ${phase.etatFacturation ? 'bg-blue-500/30 text-blue-300' : 'bg-white/5 text-gray-600'}`} title="Facturation">
                            <FileText size={15} />
                          </span>
                        )}
                        {/* Paiement — managers uniquement */}
                        {canUpdateFinancialStates ? (
                          <button
                            onClick={() => updateEtat(phase, 'paiement', !phase.etatPaiement)}
                            title={phase.etatPaiement ? 'Annuler paiement' : 'Marquer payée'}
                            className={`p-1.5 rounded-lg transition-all ${phase.etatPaiement ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/5 text-gray-500 hover:bg-emerald-500/20 hover:text-emerald-400'}`}
                          >
                            <CreditCard size={15} />
                          </button>
                        ) : (
                          <span className={`p-1.5 rounded-lg ${phase.etatPaiement ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/5 text-gray-600'}`} title="Paiement">
                            <CreditCard size={15} />
                          </span>
                        )}
                      </div>
                    </td>
                    {canManagePhases && (
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(phase)} className="p-2 text-indigo-400 hover:bg-indigo-400/20 rounded-lg transition-colors" title="Modifier">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => openDelete(phase)} className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors" title="Supprimer">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1"><CheckCircle size={13} className="text-indigo-400" /> = Réalisation</span>
        {canUpdateFinancialStates && (
          <>
            <span className="flex items-center gap-1"><FileText size={13} className="text-blue-400" /> = Facturation</span>
            <span className="flex items-center gap-1"><CreditCard size={13} className="text-emerald-400" /> = Paiement</span>
          </>
        )}
        <span className="text-gray-600">| Cliquer sur les icônes cliquables pour changer l'état</span>
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsCreateOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Layers size={20} className="text-indigo-400" /> Créer une Phase</h2>
              {renderPhaseForm(handleCreate, "Créer une Phase")}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsEditOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Edit2 size={20} className="text-indigo-400" /> Modifier la Phase</h2>
              {renderPhaseForm(handleEdit, "Modifier la Phase")}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM */}
      <AnimatePresence>
        {isDeleteOpen && selectedPhase && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 w-full max-w-sm relative">
              <button onClick={() => setIsDeleteOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 size={28} className="text-red-400" />
                </div>
                <h2 className="text-xl font-bold">Supprimer cette phase ?</h2>
                <p className="text-gray-400 text-sm">Voulez-vous vraiment supprimer la phase <strong className="text-white">"{selectedPhase.libelle}"</strong> ? Cette action est irréversible.</p>
                <div className="flex gap-3 w-full">
                  <button onClick={() => setIsDeleteOpen(false)} className="flex-1 px-4 py-2 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">Annuler</button>
                  <button onClick={handleDelete} disabled={isSubmitting} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-semibold transition-colors">
                    {isSubmitting ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Phases;
