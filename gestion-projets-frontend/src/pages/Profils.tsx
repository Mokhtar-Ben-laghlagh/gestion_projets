import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { profilService } from '../services/profilService';
import { useAuth } from '../context/AuthContext';

const emptyForm = { code: '', libelle: '', description: '' };

const Profils: React.FC = () => {
  const { user } = useAuth();
  const [profils, setProfils] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProfils = async () => {
    setIsLoading(true);
    try {
      const res = await profilService.getAll();
      setProfils(res.data || []);
    } catch {
      toast.error('Erreur lors du chargement des profils');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProfils(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await profilService.create({ code: form.code.toUpperCase(), libelle: form.libelle, description: form.description || undefined });
      toast.success('Profil créé avec succès !');
      setIsCreateOpen(false);
      setForm(emptyForm);
      fetchProfils();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (profil: any) => {
    setSelected(profil);
    setForm({ code: profil.code || '', libelle: profil.libelle || '', description: profil.description || '' });
    setIsEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await profilService.update(selected.id, { code: form.code.toUpperCase(), libelle: form.libelle, description: form.description || undefined });
      toast.success('Profil modifié avec succès !');
      setIsEditOpen(false);
      setSelected(null);
      fetchProfils();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de modification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDelete = (profil: any) => { setSelected(profil); setIsDeleteOpen(true); };

  const handleDelete = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await profilService.delete(selected.id);
      toast.success('Profil supprimé !');
      setIsDeleteOpen(false);
      setSelected(null);
      fetchProfils();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de suppression');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = profils.filter(p =>
    (p.libelle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const profilColors: Record<string, string> = {
    ADMIN: 'from-red-500 to-pink-500',
    ADMINISTRATEUR: 'from-red-500 to-pink-500',
    DIRECTEUR: 'from-purple-500 to-violet-600',
    CHEF_PROJET: 'from-indigo-500 to-blue-600',
    DEVELOPPEUR: 'from-cyan-500 to-teal-500',
    COMPTABLE: 'from-amber-500 to-orange-500',
    SECRETAIRE: 'from-emerald-500 to-green-600',
  };

  const getGradient = (code: string) => profilColors[code?.toUpperCase()] || 'from-gray-500 to-gray-600';

  const renderForm = (onSubmit: (e: React.FormEvent) => Promise<void>) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Code * (ex: CHEF_PROJET)</label>
        <input
          type="text"
          required
          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 font-mono uppercase"
          placeholder="ADMIN, CHEF_PROJET, COMPTABLE..."
          value={form.code}
          onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Libellé *</label>
        <input
          type="text"
          required
          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500"
          placeholder="ex: Administrateur, Chef de Projet..."
          value={form.libelle}
          onChange={e => setForm({ ...form, libelle: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Description</label>
        <textarea
          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 min-h-[80px]"
          placeholder="Description du rôle et des permissions..."
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
        <button type="button" onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Annuler</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">{isSubmitting ? 'Enregistrement...' : 'Enregistrer'}</button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient flex items-center gap-3">
            <Shield className="text-indigo-400" /> Gestion des Profils
          </h1>
          <p className="text-text-secondary mt-1">Gérez les rôles et permissions du système.</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setIsCreateOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={18} /><span>Nouveau Profil</span>
        </button>
      </div>

      {/* User info card */}
      {user && (
        <div className="glass-panel p-5 flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getGradient(user.profil?.code || '')} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
            {(user.prenom || '?')[0]}{(user.nom || '?')[0]}
          </div>
          <div>
            <p className="text-lg font-bold text-white">{user.prenom} {user.nom}</p>
            <p className="text-sm text-text-secondary">{user.login} · <span className="text-indigo-400 font-semibold">{user.profil?.libelle || 'Utilisateur'}</span></p>
          </div>
          <div className="ml-auto">
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-br ${getGradient(user.profil?.code || '')} text-white shadow`}>
              {user.profil?.code || 'N/A'}
            </span>
          </div>
        </div>
      )}

      {/* Profils table */}
      <div className="glass-panel p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input type="text" placeholder="Rechercher un profil..." className="pl-10 bg-black/20"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <span className="text-sm text-text-muted ml-4">{filtered.length} profil(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-text-secondary text-sm">
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Profil</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Code</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Description</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="text-center py-10"><div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-text-secondary">Aucun profil trouvé</td></tr>
              ) : filtered.map((profil, idx) => (
                <motion.tr
                  key={profil.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getGradient(profil.code)} flex items-center justify-center text-white font-bold text-sm shadow`}>
                        <Shield size={16} />
                      </div>
                      <span className="font-semibold text-white">{profil.libelle}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-mono text-xs bg-indigo-500/15 text-indigo-300 px-2 py-1 rounded">{profil.code}</span>
                  </td>
                  <td className="py-4 px-4 text-sm text-text-secondary max-w-xs truncate">{profil.description || '—'}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(profil)} className="p-2 text-indigo-400 hover:bg-indigo-400/20 rounded-lg transition-colors" title="Modifier"><Edit2 size={15} /></button>
                      <button onClick={() => openDelete(profil)} className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors" title="Supprimer"><Trash2 size={15} /></button>
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 w-full max-w-md relative">
              <button onClick={() => setIsCreateOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Shield size={20} className="text-indigo-400" /> Créer un Profil</h2>
              {renderForm(handleCreate)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 w-full max-w-md relative">
              <button onClick={() => setIsEditOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Edit2 size={20} className="text-indigo-400" /> Modifier le Profil</h2>
              {renderForm(handleEdit)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM */}
      <AnimatePresence>
        {isDeleteOpen && selected && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 w-full max-w-sm relative">
              <button onClick={() => setIsDeleteOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center"><Trash2 size={28} className="text-red-400" /></div>
                <h2 className="text-xl font-bold">Supprimer ce profil ?</h2>
                <p className="text-gray-400 text-sm">Voulez-vous vraiment supprimer le profil <strong className="text-white">"{selected.libelle}"</strong> ?</p>
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

export default Profils;
