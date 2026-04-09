import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Plus, Search, Trash2, X, Users, Layers, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { affectationService } from '../services/affectationService';
import api from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';

const emptyForm = { dateDebut: '', dateFin: '', role: '' };

const Affectations: React.FC = () => {
  const [projets, setProjets] = useState<any[]>([]);
  const [employes, setEmployes] = useState<any[]>([]);
  const [affectations, setAffectations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedProjet, setSelectedProjet] = useState<any>(null);
  const [selectedPhase, setSelectedPhase] = useState<any>(null);
  const [phasesOfProjet, setPhasesOfProjet] = useState<any[]>([]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedEmployeId, setSelectedEmployeId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { hasRole } = useAuth();
  const canManageAffectations = hasRole(['ADMINISTRATEUR', 'ADMIN', 'CHEF_PROJET', 'DIRECTEUR']);

  // Load projects and employees on mount
  useEffect(() => {
    const fetchBase = async () => {
      try {
        const [projRes, empRes] = await Promise.allSettled([
          api.get('/projets'),
          api.get('/employes'),
        ]);
        if (projRes.status === 'fulfilled') setProjets(projRes.value.data || []);
        if (empRes.status === 'fulfilled') setEmployes(empRes.value.data || []);
      } catch {
        toast.error('Erreur lors du chargement des données');
      }
    };
    fetchBase();
  }, []);

  // Load phases when project changes
  useEffect(() => {
    if (!selectedProjet) { setPhasesOfProjet([]); setSelectedPhase(null); setAffectations([]); return; }
    const fetchPhases = async () => {
      try {
        const res = await api.get(`/projets/${selectedProjet.id}/phases`);
        setPhasesOfProjet(res.data || []);
      } catch {
        toast.error('Erreur chargement phases');
      }
    };
    fetchPhases();
  }, [selectedProjet]);

  // Load affectations when phase changes
  useEffect(() => {
    if (!selectedPhase) { setAffectations([]); return; }
    fetchAffectations();
  }, [selectedPhase]);

  const fetchAffectations = async () => {
    if (!selectedPhase) return;
    setIsLoading(true);
    try {
      const res = await affectationService.getByPhase(selectedPhase.id);
      setAffectations(res.data || []);
    } catch {
      toast.error('Erreur chargement affectations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhase || !selectedEmployeId) {
      toast.error('Sélectionnez une phase et un employé');
      return;
    }
    setIsSubmitting(true);
    try {
      await affectationService.create(selectedPhase.id, Number(selectedEmployeId), {
        dateDebut: form.dateDebut || undefined,
        dateFin: form.dateFin || undefined,
        role: form.role || undefined,
      });
      toast.success('Affectation créée !');
      setIsCreateOpen(false);
      setForm(emptyForm);
      setSelectedEmployeId('');
      fetchAffectations();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDelete = (aff: any) => { setSelected(aff); setIsDeleteOpen(true); };

  const handleDelete = async () => {
    if (!selected || !selectedPhase) return;
    setIsSubmitting(true);
    try {
      const empId = selected.employeId;
      await affectationService.delete(selectedPhase.id, empId);
      toast.success('Affectation supprimée !');
      setIsDeleteOpen(false);
      setSelected(null);
      fetchAffectations();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de suppression');
    } finally {
      setIsSubmitting(false);
    }
  };

  const mappedAffectations = affectations.map(a => {
    const empData = employes.find(e => e.id === a.employeId) || {};
    return { ...a, employeComplet: empData };
  });

  const filtered = mappedAffectations.filter(a => {
    const name = `${a.employePrenom || ''} ${a.employeNom || ''}`.toLowerCase();
    return name.includes(searchTerm.toLowerCase()) ||
      (a.role || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Employees not yet assigned to this phase
  const assignedEmpIds = new Set(affectations.map(a => a.employeId));
  const availableEmployes = employes.filter(e => !assignedEmpIds.has(e.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient flex items-center gap-3">
            <UserCheck className="text-indigo-400" /> Affectations
          </h1>
          <p className="text-text-secondary mt-1">Assignez les employés aux phases de projet.</p>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-4">
          <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
            <Layers size={14} className="text-indigo-400" /> Sélectionner un Projet
          </label>
          <select
            className="w-full bg-[#1a1d29] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500"
            value={selectedProjet?.id || ''}
            onChange={e => {
              const p = projets.find(x => x.id === Number(e.target.value));
              setSelectedProjet(p || null);
              setSelectedPhase(null);
            }}
          >
            <option value="">-- Choisir un projet --</option>
            {projets.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
          </select>
        </div>

        <div className="glass-panel p-4">
          <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
            <Layers size={14} className="text-indigo-400" /> Sélectionner une Phase
          </label>
          <select
            className="w-full bg-[#1a1d29] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500"
            value={selectedPhase?.id || ''}
            onChange={e => {
              const ph = phasesOfProjet.find(x => x.id === Number(e.target.value));
              setSelectedPhase(ph || null);
            }}
            disabled={!selectedProjet}
          >
            <option value="">-- Choisir une phase --</option>
            {phasesOfProjet.map(ph => <option key={ph.id} value={ph.id}>{ph.libelle || ph.code}</option>)}
          </select>
        </div>
      </div>

      {/* Affectations Table */}
      {selectedPhase ? (
        <div className="glass-panel p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Phase : <span className="text-indigo-400">{selectedPhase.libelle || selectedPhase.code}</span>
              </h2>
              <p className="text-sm text-text-secondary">Projet : {selectedProjet?.nom}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-9 bg-black/20 text-sm py-2 px-3 pr-3 min-w-[180px]"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              {canManageAffectations && (
                <button
                  onClick={() => { 
                    setForm({ 
                      ...emptyForm, 
                      dateDebut: selectedPhase.dateDebut || '', 
                      dateFin: selectedPhase.dateFin || '' 
                    }); 
                    setSelectedEmployeId(''); 
                    setIsCreateOpen(true); 
                  }}
                  className="btn-primary flex items-center gap-2 text-sm py-2 px-4"
                >
                  <Plus size={16} /> Affecter
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-text-secondary text-sm">
                  <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Employé</th>
                  <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Rôle / Profil</th>
                  <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Fonction sur phase</th>
                  <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Période</th>
                  {canManageAffectations && <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="text-center py-10"><div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></td></tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10">
                      <div className="flex flex-col items-center gap-3 text-gray-500">
                        <Users size={36} />
                        <p>Aucun employé affecté à cette phase</p>
                        {canManageAffectations && (
                          <button onClick={() => { 
                            setForm({ 
                              ...emptyForm, 
                              dateDebut: selectedPhase.dateDebut || '', 
                              dateFin: selectedPhase.dateFin || '' 
                            }); 
                            setSelectedEmployeId(''); 
                            setIsCreateOpen(true); 
                          }}
                            className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1">
                            <Plus size={14} /> Affecter un employé
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : filtered.map((aff, idx) => (
                  <motion.tr
                    key={`${aff.phaseId || selectedPhase.id}-${aff.employeId}`}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {(aff.employePrenom || '?')[0]}{(aff.employeNom || '?')[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{aff.employePrenom} {aff.employeNom}</p>
                          <p className="text-xs text-text-muted">{aff.employeMatricule}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold">
                        {aff.employeComplet?.profil?.libelle || '—'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-text-secondary">{aff.role || '—'}</td>
                    <td className="py-4 px-4 text-sm text-text-muted">
                      {aff.dateDebut || aff.dateFin ? (
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {aff.dateDebut ? new Date(aff.dateDebut).toLocaleDateString('fr-FR') : '?'}
                          {' → '}
                          {aff.dateFin ? new Date(aff.dateFin).toLocaleDateString('fr-FR') : '?'}
                        </div>
                      ) : '—'}
                    </td>
                    {canManageAffectations && (
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openDelete(aff)} className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors" title="Retirer">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-text-muted mt-3">{filtered.length} affectation(s)</p>
        </div>
      ) : (
        <div className="glass-panel p-10 text-center">
          <UserCheck size={48} className="text-indigo-500/40 mx-auto mb-3" />
          <p className="text-text-secondary">Sélectionnez un projet et une phase pour gérer les affectations.</p>
        </div>
      )}

      {/* CREATE MODAL */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 w-full max-w-md relative"
            >
              <button onClick={() => setIsCreateOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><UserCheck size={20} className="text-indigo-400" /> Affecter un Employé</h2>
              <p className="text-sm text-text-secondary mb-5">Phase : <strong className="text-white">{selectedPhase?.libelle || selectedPhase?.code}</strong></p>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Employé *</label>
                  <select
                    required
                    className="w-full bg-[#1a1d29] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500"
                    value={selectedEmployeId}
                    onChange={e => setSelectedEmployeId(e.target.value)}
                  >
                    <option value="">Sélectionner un employé...</option>
                    {availableEmployes.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.prenom} {emp.nom} — {emp.profil?.libelle || emp.matricule}</option>
                    ))}
                  </select>
                  {availableEmployes.length === 0 && (
                    <p className="text-xs text-amber-400 mt-1">Tous les employés sont déjà affectés à cette phase.</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Fonction / Rôle sur la phase</label>
                  <input
                    type="text"
                    placeholder="ex: Développeur, Chef technique..."
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500"
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Date début</label>
                    <input type="date" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 [color-scheme:dark]"
                      value={form.dateDebut} onChange={e => setForm({ ...form, dateDebut: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Date fin</label>
                    <input type="date" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 [color-scheme:dark]"
                      value={form.dateFin} onChange={e => setForm({ ...form, dateFin: e.target.value })} />
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                  <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Annuler</button>
                  <button type="submit" disabled={isSubmitting} className="btn-primary">{isSubmitting ? 'Affectation...' : 'Affecter'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM */}
      <AnimatePresence>
        {isDeleteOpen && selected && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 w-full max-w-sm relative"
            >
              <button onClick={() => setIsDeleteOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center"><Trash2 size={28} className="text-red-400" /></div>
                <h2 className="text-xl font-bold">Supprimer cette affectation ?</h2>
                <p className="text-gray-400 text-sm">
                  Voulez-vous retirer <strong className="text-white">{selected.employePrenom} {selected.employeNom}</strong> de la phase <strong className="text-white">{selectedPhase?.libelle || selectedPhase?.code}</strong> ?
                </p>
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

export default Affectations;
