import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Users, X, Calendar, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { employeService } from '../services/employeService';
import api from '../utils/axiosConfig';

const emptyForm = {
  matricule: '', nom: '', prenom: '', email: '', login: '', password: '', profilId: '', telephone: '', poste: ''
};

const Employes: React.FC = () => {
  const [employes, setEmployes] = useState<any[]>([]);
  const [profils, setProfils] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDispoOpen, setIsDispoOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Disponibilité
  const [dispoDateDebut, setDispoDateDebut] = useState('');
  const [dispoDateFin, setDispoDateFin] = useState('');
  const [disponibles, setDisponibles] = useState<any[]>([]);
  const [dispoLoading, setDispoLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [empRes, profRes] = await Promise.allSettled([employeService.getAll(), api.get('/profils')]);
      if (empRes.status === 'fulfilled') setEmployes(empRes.value.data || []);
      if (profRes.status === 'fulfilled') setProfils(profRes.value.data || []);
    } catch {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await employeService.create({ ...form, profilId: Number(form.profilId) });
      toast.success('Employé créé avec succès !');
      setIsCreateOpen(false);
      setForm(emptyForm);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (emp: any) => {
    setSelected(emp);
    setForm({
      matricule: emp.matricule || '',
      nom: emp.nom || '',
      prenom: emp.prenom || '',
      email: emp.email || '',
      login: emp.login || '',
      password: '',
      profilId: String(emp.profil?.id || emp.profilId || ''),
      telephone: emp.telephone || '',
      poste: emp.poste || '',
    });
    setIsEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setIsSubmitting(true);
    try {
      const payload: any = {
        matricule: form.matricule,
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        login: form.login,
        profilId: Number(form.profilId),
        telephone: form.telephone || undefined,
        poste: form.poste || undefined,
      };
      if (form.password) payload.password = form.password;
      await employeService.update(selected.id, payload);
      toast.success('Employé modifié avec succès !');
      setIsEditOpen(false);
      setSelected(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de modification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDelete = (emp: any) => { setSelected(emp); setIsDeleteOpen(true); };

  const handleDelete = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await employeService.delete(selected.id);
      toast.success('Employé supprimé !');
      setIsDeleteOpen(false);
      setSelected(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de suppression');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDispo = async (e: React.FormEvent) => {
    e.preventDefault();
    setDispoLoading(true);
    try {
      const res = await employeService.getDisponibles(dispoDateDebut, dispoDateFin);
      setDisponibles(res.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la recherche');
    } finally {
      setDispoLoading(false);
    }
  };

  const filtered = employes.filter(e =>
    e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.email && e.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderEmpForm = (onSubmit: (e: React.FormEvent) => Promise<void>, isEdit: boolean) => (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Matricule *</label>
        <input type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.matricule} onChange={e => setForm({ ...form, matricule: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Profil (Rôle) *</label>
        <select required className="w-full bg-[#1a1d29] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.profilId} onChange={e => setForm({ ...form, profilId: e.target.value })}>
          <option value="">Sélectionner un profil...</option>
          {profils.map(p => <option key={p.id} value={p.id}>{p.libelle}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Nom *</label>
        <input type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Prénom *</label>
        <input type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Email *</label>
        <input type="email" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Login (Identifiant) *</label>
        <input type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.login} onChange={e => setForm({ ...form, login: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Téléphone</label>
        <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Poste</label>
        <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.poste} onChange={e => setForm({ ...form, poste: e.target.value })} />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm text-gray-400 mb-1">Mot de passe {isEdit ? '(laisser vide pour ne pas changer)' : '*'}</label>
        <input type="password" required={!isEdit} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
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
            <Users className="text-indigo-400" /> Employés
          </h1>
          <p className="text-text-secondary mt-1">Annuaire et gestion du personnel système.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsDispoOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:bg-white/10 transition-colors">
            <Calendar size={16} /> Disponibilité
          </button>
          <button onClick={() => { setForm(emptyForm); setIsCreateOpen(true); }} className="btn-primary flex items-center gap-2">
            <Plus size={18} /><span>Nouvel Employé</span>
          </button>
        </div>
      </div>

      <div className="glass-panel p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input type="text" placeholder="Rechercher par nom, matricule, email..." className="pl-10 bg-black/20" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <span className="text-sm text-text-muted ml-4">{filtered.length} employé(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-text-secondary text-sm">
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Matricule</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Nom & Prénom</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Profil / Rôle</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Contact</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Statut</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-10"><div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-text-secondary">Aucun employé trouvé</td></tr>
              ) : filtered.map((emp, idx) => (
                <motion.tr key={emp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-4 font-mono text-indigo-300 text-sm">{emp.matricule}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {(emp.prenom || '?')[0]}{(emp.nom || '?')[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{emp.prenom} {emp.nom}</p>
                        <p className="text-xs text-text-muted">{emp.login}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold">{emp.profil?.libelle || '—'}</span>
                  </td>
                  <td className="py-4 px-4 text-sm text-text-secondary">{emp.email || '—'}</td>
                  <td className="py-4 px-4">
                    {emp.actif !== false ? (
                      <span className="flex items-center gap-1.5 text-emerald-400 text-sm"><CheckCircle size={14} /> Actif</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-gray-500 text-sm"><XCircle size={14} /> Inactif</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(emp)} className="p-2 text-indigo-400 hover:bg-indigo-400/20 rounded-lg transition-colors" title="Modifier"><Edit2 size={15} /></button>
                      <button onClick={() => openDelete(emp)} className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors" title="Supprimer"><Trash2 size={15} /></button>
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
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Users size={20} className="text-indigo-400" /> Ajouter un Employé</h2>
              {renderEmpForm(handleCreate, false)}
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
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Edit2 size={20} className="text-indigo-400" /> Modifier l'Employé</h2>
              {renderEmpForm(handleEdit, true)}
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
                <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center"><Trash2 size={28} className="text-red-400" /></div>
                <h2 className="text-xl font-bold">Supprimer cet employé ?</h2>
                <p className="text-gray-400 text-sm">Voulez-vous vraiment supprimer <strong className="text-white">{selected.prenom} {selected.nom}</strong> ?</p>
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

      {/* DISPONIBILITE */}
      <AnimatePresence>
        {isDispoOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => { setIsDispoOpen(false); setDisponibles([]); }} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Calendar size={20} className="text-indigo-400" /> Vérifier la Disponibilité</h2>
              <form onSubmit={handleDispo} className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date de début *</label>
                  <input type="date" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 [color-scheme:dark]" value={dispoDateDebut} onChange={e => setDispoDateDebut(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date de fin *</label>
                  <input type="date" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 [color-scheme:dark]" value={dispoDateFin} onChange={e => setDispoDateFin(e.target.value)} />
                </div>
                <div className="col-span-2">
                  <button type="submit" disabled={dispoLoading} className="btn-primary w-full">
                    {dispoLoading ? 'Recherche...' : 'Rechercher les employés disponibles'}
                  </button>
                </div>
              </form>
              {disponibles.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-3">{disponibles.length} employé(s) disponible(s)</p>
                  <div className="space-y-2">
                    {disponibles.map(emp => (
                      <div key={emp.id} className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                          {(emp.prenom || '?')[0]}{(emp.nom || '?')[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{emp.prenom} {emp.nom}</p>
                          <p className="text-xs text-text-muted">{emp.matricule} · {emp.profil?.libelle}</p>
                        </div>
                        <CheckCircle size={16} className="text-emerald-400 ml-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!dispoLoading && dispoDateDebut && dispoDateFin && disponibles.length === 0 && (
                <p className="text-center text-gray-500 py-4">Aucun employé disponible sur cette période.</p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Employes;
