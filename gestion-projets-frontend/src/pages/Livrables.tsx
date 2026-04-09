import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCheck2, Plus, Search, Edit2, Trash2, X, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';

interface Livrable {
  id: number;
  code: string;
  libelle: string;
  description?: string;
  chemin?: string;
  typeFichier?: string;
  dateRemise?: string;
  valide?: boolean;
  phaseId?: number;
  phaseLibelle?: string;
  projetNom?: string;
}

const emptyForm = { code: '', libelle: '', description: '', chemin: '', typeFichier: '', dateRemise: '', valide: false, phaseId: '' };

const Livrables: React.FC = () => {
  const [livrables, setLivrables] = useState<Livrable[]>([]);
  const [phases, setPhases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Livrable | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { hasRole } = useAuth();
  const canDeleteLivrable = hasRole(['ADMINISTRATEUR', 'ADMIN', 'CHEF_PROJET', 'DIRECTEUR']);
  // Employees can create and edit livrables, but not delete
  const canCreateEditLivrable = hasRole(['ADMINISTRATEUR', 'ADMIN', 'CHEF_PROJET', 'DIRECTEUR', 'EMPLOYE', 'SECRETAIRE']);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const lRes = await api.get('/livrables');
      setLivrables(lRes.data || []);

      if (canCreateEditLivrable) {
        // Obtenir la liste des phases (déjà filtrée ! l'employé ne recevra que ses phases, l'admin toutes)
        const phRes = await api.get('/phases');
        setPhases(phRes.data || []);
      }
    } catch {
      toast.error('Erreur lors du chargement des livrables');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post(`/phases/${form.phaseId}/livrables`, {
        code: form.code,
        libelle: form.libelle,
        description: form.description || undefined,
        chemin: form.chemin || undefined,
        typeFichier: form.typeFichier || undefined,
        dateRemise: form.dateRemise || undefined,
        valide: form.valide,
      });
      toast.success('Livrable créé !');
      setIsCreateOpen(false);
      setForm(emptyForm);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de création');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (liv: Livrable) => {
    setSelected(liv);
    setForm({
      code: liv.code, libelle: liv.libelle, description: liv.description || '',
      chemin: liv.chemin || '', typeFichier: liv.typeFichier || '',
      dateRemise: liv.dateRemise || '', valide: liv.valide || false, phaseId: String(liv.phaseId || ''),
    });
    setIsEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await api.put(`/livrables/${selected.id}`, {
        code: form.code, libelle: form.libelle, description: form.description || undefined,
        chemin: form.chemin || undefined, typeFichier: form.typeFichier || undefined,
        dateRemise: form.dateRemise || undefined, valide: form.valide,
      });
      toast.success('Livrable modifié !');
      setIsEditOpen(false);
      setSelected(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de modification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDelete = (liv: Livrable) => { setSelected(liv); setIsDeleteOpen(true); };

  const handleDelete = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await api.delete(`/livrables/${selected.id}`);
      toast.success('Livrable supprimé !');
      setIsDeleteOpen(false);
      setSelected(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de suppression');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = livrables.filter(l =>
    (l.libelle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.phaseLibelle || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderLivrableForm = (onSubmit: (e: React.FormEvent) => Promise<void>, showPhase: boolean) => (
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
        <label className="block text-sm text-gray-400 mb-1">Type de fichier</label>
        <select className="w-full bg-[#1a1d29] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.typeFichier} onChange={e => setForm({ ...form, typeFichier: e.target.value })}>
          <option value="">-- Sélectionner --</option>
          <option value="PDF">PDF</option>
          <option value="WORD">Word</option>
          <option value="EXCEL">Excel</option>
          <option value="IMAGE">Image</option>
          <option value="ZIP">ZIP</option>
          <option value="AUTRE">Autre</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Date de remise</label>
        <input type="date" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 [color-scheme:dark]" value={form.dateRemise} onChange={e => setForm({ ...form, dateRemise: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Chemin / URL</label>
        <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" placeholder="ex: /docs/livrable.pdf" value={form.chemin} onChange={e => setForm({ ...form, chemin: e.target.value })} />
      </div>
      <div className="flex items-center gap-3 mt-2">
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={form.valide} onChange={e => setForm({ ...form, valide: e.target.checked })} />
          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
          <span className="ml-3 text-sm text-gray-300">Validé</span>
        </label>
      </div>
      {showPhase && (
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-400 mb-1">Phase *</label>
          <select required className="w-full bg-[#1a1d29] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.phaseId} onChange={e => setForm({ ...form, phaseId: e.target.value })}>
            <option value="">Sélectionner une phase...</option>
            {phases.map(ph => <option key={ph.id} value={ph.id}>{ph.libelle || ph.code} ({ph.projetNom})</option>)}
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
            <FileCheck2 className="text-indigo-400" /> Livrables
          </h1>
          <p className="text-text-secondary mt-1">
            {canCreateEditLivrable ? 'Gérez les livrables associés aux phases de projet.' : 'Consultez les livrables de vos projets.'}
          </p>
        </div>
        {canCreateEditLivrable && (
          <button onClick={() => { setForm(emptyForm); setIsCreateOpen(true); }} className="btn-primary flex items-center gap-2">
            <Plus size={18} /><span>Nouveau Livrable</span>
          </button>
        )}
      </div>

      <div className="glass-panel p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input type="text" placeholder="Rechercher un livrable, phase ou projet..." className="pl-10 bg-black/20" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <span className="text-sm text-text-muted ml-4">{filtered.length} livrable(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-text-secondary text-sm">
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Livrable</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Phase / Projet</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Type</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Date Remise</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Statut</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-10"><div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-text-secondary">
                  {livrables.length === 0 ? 'Aucun livrable disponible. Créez le premier livrable.' : 'Aucun livrable trouvé'}
                </td></tr>
              ) : filtered.map((lv, idx) => (
                <motion.tr key={lv.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-4">
                    <p className="font-semibold text-white">{lv.libelle}</p>
                    <p className="text-xs text-text-muted font-mono">{lv.code}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-white">{lv.phaseLibelle || '—'}</p>
                  </td>
                  <td className="py-4 px-4">
                    {lv.typeFichier ? (
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-mono">{lv.typeFichier}</span>
                    ) : <span className="text-text-muted text-sm">—</span>}
                  </td>
                  <td className="py-4 px-4 text-sm text-text-secondary">
                    {lv.dateRemise ? new Date(lv.dateRemise).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td className="py-4 px-4">
                    {lv.valide ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full w-fit">
                        <CheckCircle size={11} /> Validé
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded-full w-fit">
                        <Clock size={11} /> En attente
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {canCreateEditLivrable && (
                        <button onClick={() => openEdit(lv)} className="p-2 text-indigo-400 hover:bg-indigo-400/20 rounded-lg transition-colors" title="Modifier"><Edit2 size={15} /></button>
                      )}
                      {canDeleteLivrable && (
                        <button onClick={() => openDelete(lv)} className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors" title="Supprimer"><Trash2 size={15} /></button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsCreateOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FileCheck2 size={20} className="text-indigo-400" /> Nouveau Livrable</h2>
              {renderLivrableForm(handleCreate, true)}
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
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Edit2 size={20} className="text-indigo-400" /> Modifier le Livrable</h2>
              {renderLivrableForm(handleEdit, false)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM */}
      <AnimatePresence>
        {isDeleteOpen && selected && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 w-full max-w-sm relative">
              <button onClick={() => setIsDeleteOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 size={28} className="text-red-400" />
                </div>
                <h2 className="text-xl font-bold">Supprimer ce livrable ?</h2>
                <p className="text-gray-400 text-sm">Voulez-vous vraiment supprimer <strong className="text-white">"{selected.libelle}"</strong> ?</p>
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

export default Livrables;
