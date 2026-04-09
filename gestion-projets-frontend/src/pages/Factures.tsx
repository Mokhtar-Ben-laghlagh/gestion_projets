import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, FileText, Edit2, Trash2, X, CheckCircle2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { factureService } from '../services/factureService';
import api from '../utils/axiosConfig';

const emptyForm = { code: '', dateFacture: '', montant: '', reference: '', phaseId: '' };

const Factures: React.FC = () => {
  const [factures, setFactures] = useState<any[]>([]);
  const [phases, setPhases] = useState<any[]>([]);
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
      const [facRes, projRes] = await Promise.all([
        factureService.getAll(),
        api.get('/projets'),
      ]);
      setFactures(facRes.data || []);

      // Build phases list (only réalisées = eligible for facturation)
      const allPhases: any[] = [];
      for (const p of projRes.data || []) {
        try {
          const ph = await api.get(`/projets/${p.id}/phases`);
          allPhases.push(...(ph.data || []).map((x: any) => ({ ...x, projetNom: p.nom })));
        } catch {}
      }
      setPhases(allPhases);
    } catch {
      toast.error('Erreur lors du chargement des factures');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await factureService.create(Number(form.phaseId), {
        code: form.code,
        dateFacture: form.dateFacture,
        montant: form.montant ? Number(form.montant) : undefined,
        reference: form.reference || undefined,
      });
      toast.success('Facture créée !');
      setIsCreateOpen(false);
      setForm(emptyForm);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur création facture');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (fac: any) => {
    setSelected(fac);
    setForm({
      code: fac.code || '',
      dateFacture: fac.dateFacture || '',
      montant: String(fac.montant || ''),
      reference: fac.reference || '',
      phaseId: String(fac.phaseId || ''),
    });
    setIsEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await factureService.update(selected.id, {
        code: form.code,
        dateFacture: form.dateFacture,
        montant: form.montant ? Number(form.montant) : undefined,
        reference: form.reference || undefined,
      });
      toast.success('Facture modifiée !');
      setIsEditOpen(false);
      setSelected(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de modification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDelete = (fac: any) => { setSelected(fac); setIsDeleteOpen(true); };

  const handleDelete = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await factureService.delete(selected.id);
      toast.success('Facture supprimée !');
      setIsDeleteOpen(false);
      setSelected(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de suppression');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mark phase as paid via PATCH /api/phases/{phaseId}/paiement
  const handleMarkPaid = async (fac: any) => {
    try {
      await api.patch(`/phases/${fac.phaseId}/paiement`, { etat: true });
      toast.success('Facture marquée comme payée !');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour du paiement');
    }
  };

  const filteredFactures = factures.filter(f =>
    (f.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.phaseLibelle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.projetNom || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatutBadge = (statut: string) => {
    const map: Record<string, string> = {
      EMISE: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      PAYEE: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      ANNULEE: 'bg-red-500/20 text-red-400 border border-red-500/30',
      EN_ATTENTE: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    };
    return map[statut] || 'bg-gray-500/20 text-gray-400';
  };

  const realiseePhases = phases.filter(p => p.etatRealisation && !p.etatFacturation);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient flex items-center gap-3">
            <FileText className="text-indigo-400" /> Gestion des Factures
          </h1>
          <p className="text-text-secondary mt-1">Suivez l'état de facturation des phases terminées.</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setIsCreateOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={18} /><span>Créer Facture</span>
        </button>
      </div>

      <div className="glass-panel p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input type="text" placeholder="Rechercher par code, phase, projet..." className="pl-10 bg-black/20" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <span className="text-sm text-text-muted ml-4">{filteredFactures.length} facture(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-text-secondary text-sm">
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">N° Facture</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Phase / Projet</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Montant</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Date</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Statut</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-10"><div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></td></tr>
              ) : filteredFactures.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-text-secondary">
                  Aucune facture. Les phases doivent être marquées comme réalisées avant facturation.
                </td></tr>
              ) : filteredFactures.map((fac, idx) => (
                <motion.tr key={fac.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-4 font-mono text-indigo-300">
                    {fac.code || `FAC-${String(fac.id).padStart(4, '0')}`}
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-white">{fac.phaseLibelle || fac.phase?.libelle || '—'}</p>
                    <p className="text-xs text-text-muted">{fac.projetNom || fac.phase?.projetNom || ''}</p>
                  </td>
                  <td className="py-4 px-4 text-emerald-400 font-mono">{(fac.montant || 0).toLocaleString()} MAD</td>
                  <td className="py-4 px-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-1"><Calendar size={12} /> {fac.dateFacture ? new Date(fac.dateFacture).toLocaleDateString('fr-FR') : '—'}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatutBadge(fac.statut)}`}>
                      {fac.statut || '—'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {fac.statut !== 'PAYEE' && (
                        <button onClick={() => handleMarkPaid(fac)} className="p-2 text-emerald-400 hover:bg-emerald-400/20 rounded-lg transition-colors" title="Marquer Payée">
                          <CheckCircle2 size={15} />
                        </button>
                      )}
                      <button onClick={() => openEdit(fac)} className="p-2 text-indigo-400 hover:bg-indigo-400/20 rounded-lg transition-colors" title="Modifier"><Edit2 size={15} /></button>
                      <button onClick={() => openDelete(fac)} className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors" title="Supprimer"><Trash2 size={15} /></button>
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 w-full max-w-md relative">
              <button onClick={() => setIsCreateOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} className="text-indigo-400" /> Créer une Facture</h2>
              <p className="text-xs text-amber-400 mb-5">⚠️ Seules les phases marquées comme <strong>Réalisées</strong> peuvent être facturées.</p>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Code Facture * (ex: FAC-001)</label>
                  <input type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date de facturation *</label>
                  <input type="date" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 [color-scheme:dark]" value={form.dateFacture} onChange={e => setForm({ ...form, dateFacture: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Montant (MAD) — optionnel, reprend celui de la phase</label>
                  <input type="number" min="0" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.montant} onChange={e => setForm({ ...form, montant: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Référence</label>
                  <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phase à Facturer *</label>
                  <select required className="w-full bg-[#1a1d29] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.phaseId} onChange={e => setForm({ ...form, phaseId: e.target.value })}>
                    <option value="">Sélectionner une phase réalisée...</option>
                    {realiseePhases.map(ph => <option key={ph.id} value={ph.id}>{ph.libelle || ph.code} ({ph.projetNom})</option>)}
                  </select>
                  {realiseePhases.length === 0 && (
                    <p className="text-xs text-red-400 mt-1">Aucune phase réalisée disponible. Marquez d'abord une phase comme réalisée.</p>
                  )}
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                  <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Annuler</button>
                  <button type="submit" disabled={isSubmitting} className="btn-primary">{isSubmitting ? 'Enregistrement...' : 'Enregistrer'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 w-full max-w-md relative">
              <button onClick={() => setIsEditOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Edit2 size={20} className="text-indigo-400" /> Modifier la Facture</h2>
              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Code Facture *</label>
                  <input type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date de facturation *</label>
                  <input type="date" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 [color-scheme:dark]" value={form.dateFacture} onChange={e => setForm({ ...form, dateFacture: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Montant (MAD)</label>
                  <input type="number" min="0" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.montant} onChange={e => setForm({ ...form, montant: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Référence</label>
                  <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} />
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                  <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Annuler</button>
                  <button type="submit" disabled={isSubmitting} className="btn-primary">{isSubmitting ? 'Enregistrement...' : 'Enregistrer'}</button>
                </div>
              </form>
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
                <h2 className="text-xl font-bold">Supprimer cette facture ?</h2>
                <p className="text-gray-400 text-sm">Voulez-vous vraiment supprimer la facture <strong className="text-white">"{selected.code}"</strong> ?</p>
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

export default Factures;
