import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Building2, X, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { organismeService } from '../services/organismeService';

const emptyForm = {
  code: '', nom: '', adresse: '', telephone: '', nomContact: '',
  emailContact: '', siteWeb: '', secteurActivite: '', pays: ''
};

const Organismes: React.FC = () => {
  const [organismes, setOrganismes] = useState<any[]>([]);
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
      const res = await organismeService.getAll();
      setOrganismes(res.data || []);
    } catch {
      toast.error('Erreur lors du chargement des organismes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await organismeService.create(form);
      toast.success('Organisme créé avec succès !');
      setIsCreateOpen(false);
      setForm(emptyForm);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (org: any) => {
    setSelected(org);
    setForm({
      code: org.code || '',
      nom: org.nom || '',
      adresse: org.adresse || '',
      telephone: org.telephone || '',
      nomContact: org.nomContact || '',
      emailContact: org.emailContact || '',
      siteWeb: org.siteWeb || '',
      secteurActivite: org.secteurActivite || '',
      pays: org.pays || '',
    });
    setIsEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await organismeService.update(selected.id, form);
      toast.success('Organisme modifié avec succès !');
      setIsEditOpen(false);
      setSelected(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de modification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDelete = (org: any) => { setSelected(org); setIsDeleteOpen(true); };

  const handleDelete = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await organismeService.delete(selected.id);
      toast.success('Organisme supprimé !');
      setIsDeleteOpen(false);
      setSelected(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de suppression');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = organismes.filter(o =>
    o.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.code && o.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (o.nomContact && o.nomContact.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderOrgForm = (onSubmit: (e: React.FormEvent) => Promise<void>) => (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Code * (ex: ORG001)</label>
        <input type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Nom *</label>
        <input type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Nom du Contact</label>
        <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.nomContact} onChange={e => setForm({ ...form, nomContact: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Email Contact</label>
        <input type="email" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.emailContact} onChange={e => setForm({ ...form, emailContact: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Téléphone</label>
        <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Site Web</label>
        <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" placeholder="https://..." value={form.siteWeb} onChange={e => setForm({ ...form, siteWeb: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Secteur d'activité</label>
        <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.secteurActivite} onChange={e => setForm({ ...form, secteurActivite: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Pays</label>
        <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.pays} onChange={e => setForm({ ...form, pays: e.target.value })} />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm text-gray-400 mb-1">Adresse</label>
        <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} />
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
            <Building2 className="text-indigo-400" /> Organismes / Clients
          </h1>
          <p className="text-text-secondary mt-1">Gérez la liste de vos clients et partenaires.</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setIsCreateOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={18} /><span>Nouvel Organisme</span>
        </button>
      </div>

      <div className="glass-panel p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input type="text" placeholder="Rechercher par nom, code, contact..." className="pl-10 bg-black/20" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <span className="text-sm text-text-muted ml-4">{filtered.length} organisme(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-text-secondary text-sm">
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Code / Nom</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Contact</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Téléphone</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Secteur</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-10"><div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-text-secondary">Aucun organisme trouvé</td></tr>
              ) : filtered.map((org, idx) => (
                <motion.tr key={org.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-4">
                    <p className="font-semibold text-white">{org.nom}</p>
                    <p className="text-xs text-text-muted font-mono">{org.code}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-white">{org.nomContact || '—'}</p>
                    {org.emailContact && <p className="text-xs text-text-muted flex items-center gap-1"><Mail size={10} /> {org.emailContact}</p>}
                  </td>
                  <td className="py-4 px-4 text-sm text-text-secondary">
                    {org.telephone ? <span className="flex items-center gap-1"><Phone size={13} /> {org.telephone}</span> : '—'}
                  </td>
                  <td className="py-4 px-4 text-sm text-text-secondary">{org.secteurActivite || '—'}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(org)} className="p-2 text-indigo-400 hover:bg-indigo-400/20 rounded-lg transition-colors" title="Modifier"><Edit2 size={15} /></button>
                      <button onClick={() => openDelete(org)} className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors" title="Supprimer"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsCreateOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Building2 size={20} className="text-indigo-400" /> Ajouter un Organisme</h2>
              {renderOrgForm(handleCreate)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsEditOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Edit2 size={20} className="text-indigo-400" /> Modifier l'Organisme</h2>
              {renderOrgForm(handleEdit)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteOpen && selected && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 w-full max-w-sm relative">
              <button onClick={() => setIsDeleteOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 size={28} className="text-red-400" />
                </div>
                <h2 className="text-xl font-bold">Supprimer cet organisme ?</h2>
                <p className="text-gray-400 text-sm">Voulez-vous vraiment supprimer <strong className="text-white">"{selected.nom}"</strong> ?</p>
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

export default Organismes;
