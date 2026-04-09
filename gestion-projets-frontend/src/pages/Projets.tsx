import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, FolderKanban, X, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { projetService } from '../services/projetService';

const emptyForm = {
  code: '', nom: '', description: '', dateDebut: '', dateFin: '',
  montant: '', organismeId: '', chefProjetId: '', statut: 'EN_COURS'
};

const Projets: React.FC = () => {
  const [projets, setProjets] = useState<any[]>([]);
  const [organismes, setOrganismes] = useState<any[]>([]);
  const [employes, setEmployes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const projRes = await projetService.getAll();
      setProjets(projRes.data || []);
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK') {
        toast.error('Backend inaccessible. Vérifiez que Spring Boot est démarré sur le port 8081.');
      } else {
        toast.error('Erreur lors du chargement des projets');
      }
    } finally {
      setIsLoading(false);
    }
    try {
      const { default: api } = await import('../utils/axiosConfig');
      const [orgRes, empRes] = await Promise.allSettled([api.get('/organismes'), api.get('/employes')]);
      if (orgRes.status === 'fulfilled') setOrganismes(orgRes.value.data || []);
      if (empRes.status === 'fulfilled') setEmployes(empRes.value.data || []);
    } catch {}
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await projetService.create({
        ...form,
        montant: Number(form.montant),
        organismeId: Number(form.organismeId),
        chefProjetId: form.chefProjetId ? Number(form.chefProjetId) : null,
      });
      toast.success('Projet créé avec succès !');
      setIsCreateOpen(false);
      setForm(emptyForm);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la création du projet');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (projet: any) => {
    setSelected(projet);
    setForm({
      code: projet.code,
      nom: projet.nom,
      description: projet.description || '',
      dateDebut: projet.dateDebut,
      dateFin: projet.dateFin,
      montant: String(projet.montant),
      organismeId: String(projet.organisme?.id || projet.organismeId || ''),
      chefProjetId: String(projet.chefProjet?.id || projet.chefProjetId || ''),
      statut: projet.statut || 'EN_COURS',
    });
    setIsEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await projetService.update(selected.id, {
        code: form.code,
        nom: form.nom,
        description: form.description || undefined,
        dateDebut: form.dateDebut,
        dateFin: form.dateFin,
        montant: Number(form.montant),
        organismeId: Number(form.organismeId),
        chefProjetId: form.chefProjetId ? Number(form.chefProjetId) : null,
        statut: form.statut,
      });
      toast.success('Projet modifié avec succès !');
      setIsEditOpen(false);
      setSelected(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de modification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDelete = (projet: any) => { setSelected(projet); setIsDeleteOpen(true); };

  const handleDelete = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await projetService.delete(selected.id);
      toast.success('Projet supprimé !');
      setIsDeleteOpen(false);
      setSelected(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de suppression');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = projets.filter(p =>
    p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statutColors: Record<string, string> = {
    EN_COURS: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
    CLOTURE: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    SUSPENDU: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    ANNULE: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };

  const renderProjetForm = (onSubmit: (e: React.FormEvent) => Promise<void>) => (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Code * (unique)</label>
        <input type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Nom du projet *</label>
        <input type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
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
        <label className="block text-sm text-gray-400 mb-1">Budget (MAD) *</label>
        <input type="number" required min="0" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.montant} onChange={e => setForm({ ...form, montant: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Statut</label>
        <select className="w-full bg-[#1a1d29] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}>
          <option value="EN_COURS">En cours</option>
          <option value="SUSPENDU">Suspendu</option>
          <option value="CLOTURE">Clôturé</option>
          <option value="ANNULE">Annulé</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Organisme (Client) *</label>
        <select required className="w-full bg-[#1a1d29] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.organismeId} onChange={e => setForm({ ...form, organismeId: e.target.value })}>
          <option value="">Sélectionner un organisme...</option>
          {organismes.map(o => <option key={o.id} value={o.id}>{o.nom}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Chef de projet</label>
        <select className="w-full bg-[#1a1d29] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.chefProjetId} onChange={e => setForm({ ...form, chefProjetId: e.target.value })}>
          <option value="">Non assigné</option>
          {employes.map(e => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
        </select>
      </div>
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
            <FolderKanban className="text-indigo-400" /> Gestion des Projets
          </h1>
          <p className="text-text-secondary mt-1">Gérez l'ensemble de vos projets et leur cycle de vie.</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setIsCreateOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={18} /><span>Nouveau Projet</span>
        </button>
      </div>

      <div className="glass-panel p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input type="text" placeholder="Rechercher un projet..." className="pl-10 bg-black/20" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <span className="text-sm text-text-muted ml-4">{filtered.length} projet(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-text-secondary text-sm">
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Code / Nom</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Client (Organisme)</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Chef de Projet</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Budget</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Statut</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Période</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-10"><div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-text-secondary">Aucun projet trouvé</td></tr>
              ) : filtered.map((projet, idx) => (
                <motion.tr key={projet.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-4">
                    <p className="font-semibold text-white">{projet.nom}</p>
                    <p className="text-xs text-text-muted font-mono">{projet.code}</p>
                  </td>
                  <td className="py-4 px-4 text-sm text-text-secondary">{projet.organisme?.nom || projet.organismeNom || 'N/A'}</td>
                  <td className="py-4 px-4 text-sm text-text-secondary">
                    {projet.chefProjet ? `${projet.chefProjet.prenom} ${projet.chefProjet.nom}` : <span className="text-gray-600 italic">Non assigné</span>}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-mono bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded text-sm">
                      {(projet.montant || 0).toLocaleString()} MAD
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statutColors[projet.statut] || 'bg-gray-500/20 text-gray-400'}`}>
                      {(projet.statut || '').replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-text-muted">
                    <div className="flex items-center gap-1 text-xs">
                      <Calendar size={12} />
                      {new Date(projet.dateDebut).toLocaleDateString('fr-FR')} → {new Date(projet.dateFin).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(projet)} className="p-2 text-indigo-400 hover:bg-indigo-400/20 rounded-lg transition-colors" title="Modifier"><Edit2 size={15} /></button>
                      <button onClick={() => openDelete(projet)} className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors" title="Supprimer"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsCreateOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FolderKanban size={20} className="text-indigo-400" /> Créer un Projet</h2>
              {renderProjetForm(handleCreate)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsEditOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Edit2 size={20} className="text-indigo-400" /> Modifier le Projet</h2>
              {renderProjetForm(handleEdit)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE */}
      <AnimatePresence>
        {isDeleteOpen && selected && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 w-full max-w-sm relative">
              <button onClick={() => setIsDeleteOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 size={28} className="text-red-400" />
                </div>
                <h2 className="text-xl font-bold">Supprimer ce projet ?</h2>
                <p className="text-gray-400 text-sm">Voulez-vous vraiment supprimer <strong className="text-white">"{selected.nom}"</strong> ? Toutes ses phases seront également supprimées.</p>
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

export default Projets;
