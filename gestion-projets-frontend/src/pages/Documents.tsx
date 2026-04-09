import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, Plus, Search, Edit2, Trash2, X, Download, FileText, Link, ChevronDown, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';
import { documentService } from '../services/documentService';
import { useAuth } from '../context/AuthContext';

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [projets, setProjets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<any>({ code: '', libelle: '', description: '', typeDocument: '', chemin: '', projetId: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPathOptions, setShowPathOptions] = useState(false);
  const { hasRole } = useAuth();
  const canManageDocuments = hasRole(['ADMINISTRATEUR', 'ADMIN', 'CHEF_PROJET', 'DIRECTEUR', 'SECRETAIRE']);

  const emptyForm = { code: '', libelle: '', description: '', typeDocument: '', chemin: '', projetId: '' };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/documents');
      setDocuments(res.data || []);

      if (canManageDocuments) {
        const projs = await api.get('/projets');
        setProjets(projs.data || []);
      }
    } catch {
      toast.error('Erreur lors du chargement des documents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await documentService.create(Number(form.projetId), {
        code: form.code,
        libelle: form.libelle,
        description: form.description || undefined,
        typeDocument: form.typeDocument || undefined,
        chemin: form.chemin || undefined,
      });
      toast.success('Document créé !');
      setIsCreateOpen(false);
      setForm(emptyForm);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de création');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (doc: any) => {
    setSelected(doc);
    setForm({ code: doc.code, libelle: doc.libelle, description: doc.description || '', typeDocument: doc.typeDocument || '', chemin: doc.chemin || '', projetId: String(doc.projetId) });
    setIsEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await documentService.update(selected.id, {
        code: form.code, libelle: form.libelle, description: form.description || undefined,
        typeDocument: form.typeDocument || undefined, chemin: form.chemin || undefined,
      });
      toast.success('Document modifié !');
      setIsEditOpen(false);
      setSelected(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de modification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDelete = (doc: any) => { setSelected(doc); setIsDeleteOpen(true); };

  const handleDelete = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await documentService.delete(selected.id);
      toast.success('Document supprimé !');
      setIsDeleteOpen(false);
      setSelected(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur de suppression');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (doc: any) => {
    setDownloadingId(doc.id);
    try {
      if (doc.chemin && (doc.chemin.startsWith('http://') || doc.chemin.startsWith('https://'))) {
        window.open(doc.chemin, '_blank');
        toast.success('Le fichier externe a été ouvert dans un nouvel onglet.');
        setDownloadingId(null);
        return;
      }

      const filename = doc.chemin
        ? doc.chemin.replace(/\\/g, '/').split('/').pop() || `${doc.code}.bin`
        : `${doc.code}.bin`;
      await documentService.download(doc.id, filename);
      toast.success(`"${doc.libelle}" téléchargé avec succès !`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Ce document n\'existe plus sur le serveur (vérifiez le chemin).');
    } finally {
      setDownloadingId(null);
    }
  };

  const filtered = documents.filter(d =>
    (d.libelle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.projetNom || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDocForm = (onSubmit: (e: React.FormEvent) => Promise<void>, showProjet: boolean) => (
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
        <label className="block text-sm text-gray-400 mb-1">Type de Document</label>
        <select className="w-full bg-[#1a1d29] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" value={form.typeDocument} onChange={e => setForm({ ...form, typeDocument: e.target.value })}>
          <option value="">-- Sélectionner --</option>
          <option value="PDF">PDF</option>
          <option value="WORD">Word</option>
          <option value="EXCEL">Excel</option>
          <option value="IMAGE">Image</option>
          <option value="ZIP">ZIP</option>
          <option value="AUTRE">Autre</option>
        </select>
      </div>
      <div className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-2">Source du fichier</label>
        
        <div className="flex bg-[#1a1d29] border border-white/10 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
          <div className="bg-white/5 px-3 flex items-center justify-center border-r border-white/10">
            {form.chemin === 'GENERATED_PDF' ? <FileText size={18} className="text-rose-400" /> : <Monitor size={18} className="text-emerald-400" />}
          </div>
          <input 
            type="text" 
            className="flex-1 bg-transparent px-4 py-2.5 text-white outline-none w-full" 
            placeholder="Ex: C:\..." 
            value={form.chemin === 'GENERATED_PDF' ? 'Rapport PDF Dynamique (Généré par le système)' : form.chemin} 
            onChange={e => setForm({ ...form, chemin: e.target.value })} 
            onFocus={() => setShowPathOptions(true)}
            onBlur={() => setTimeout(() => setShowPathOptions(false), 200)}
          />
          <button type="button" onClick={() => setShowPathOptions(!showPathOptions)} className="px-3 hover:bg-white/5 transition-colors border-l border-white/10 flex items-center justify-center">
            <ChevronDown size={18} className="text-gray-400" />
          </button>
        </div>

        <AnimatePresence>
          {showPathOptions && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
              className="absolute z-50 w-full mt-2 bg-[#1e2130] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
            >
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-white/5 border-b border-white/10">Création Automatique</div>
              <button type="button" onClick={() => { setForm({ ...form, typeDocument: 'PDF', chemin: 'GENERATED_PDF' }); setShowPathOptions(false); }} className="w-full text-left flex flex-col px-4 py-2.5 hover:bg-white/5 transition-colors">
                <span className="text-white text-sm font-medium flex items-center gap-2"><FileText size={14} className="text-rose-400" />Générer un Rapport PDF Automatique</span>
                <span className="text-gray-500 text-xs truncate">Crée un PDF avec les données du projet, organisme, etc.</span>
              </button>
              
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-white/5 border-t border-b border-white/10 mt-1">Lier un fichier Local existant sur le serveur</div>
              <button type="button" onClick={() => { setForm({ ...form, typeDocument: 'WORD', chemin: 'C:\\Projets\\Rapport.docx' }); setShowPathOptions(false); }} className="w-full text-left flex flex-col px-4 py-2.5 hover:bg-white/5 transition-colors">
                <span className="text-white text-sm font-medium flex items-center gap-2"><Monitor size={14} className="text-emerald-400" />Renseigner un chemin local</span>
                <span className="text-gray-500 text-xs truncate">Tapez manuellement (ex: C:\Mes_Fichiers\doc.pdf)</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {showProjet && (
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
            <FolderOpen className="text-indigo-400" /> Documents Projet
          </h1>
          <p className="text-text-secondary mt-1">
            {canManageDocuments ? 'Gérez les documents techniques associés aux projets.' : 'Consultez et téléchargez les documents de vos projets.'}
          </p>
        </div>
        {canManageDocuments && (
          <button onClick={() => { setForm(emptyForm); setIsCreateOpen(true); }} className="btn-primary flex items-center gap-2">
            <Plus size={18} /><span>Nouveau Document</span>
          </button>
        )}
      </div>

      <div className="glass-panel p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input type="text" placeholder="Rechercher un document ou projet..." className="pl-10 bg-black/20" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <span className="text-sm text-text-muted ml-4">{filtered.length} document(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-text-secondary text-sm">
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Document</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Projet</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Type</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Chemin</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-10"><div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-text-secondary">
                  {documents.length === 0 ? 'Aucun document disponible. Créez le premier document.' : 'Aucun document trouvé'}
                </td></tr>
              ) : filtered.map((doc, idx) => (
                <motion.tr key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{doc.libelle}</p>
                        <p className="text-xs text-text-muted font-mono">{doc.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-text-secondary">{doc.projetNom || '—'}</td>
                  <td className="py-4 px-4">
                    {doc.typeDocument ? (
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-mono">{doc.typeDocument}</span>
                    ) : <span className="text-text-muted text-sm">—</span>}
                  </td>
                  <td className="py-4 px-4 text-sm text-text-muted truncate max-w-[200px]">{doc.chemin || '—'}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDownload(doc)}
                        disabled={downloadingId === doc.id}
                        className="p-2 text-emerald-400 hover:bg-emerald-400/20 rounded-lg transition-colors disabled:opacity-50"
                        title="Télécharger"
                      >
                        {downloadingId === doc.id
                          ? <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                          : <Download size={15} />}
                      </button>
                      {canManageDocuments && (
                        <>
                          <button onClick={() => openEdit(doc)} className="p-2 text-indigo-400 hover:bg-indigo-400/20 rounded-lg transition-colors" title="Modifier"><Edit2 size={15} /></button>
                          <button onClick={() => openDelete(doc)} className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors" title="Supprimer"><Trash2 size={15} /></button>
                        </>
                      )}
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
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FolderOpen size={20} className="text-indigo-400" /> Nouveau Document</h2>
              {renderDocForm(handleCreate, true)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsEditOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Edit2 size={20} className="text-indigo-400" /> Modifier le Document</h2>
              {renderDocForm(handleEdit, false)}
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
                <h2 className="text-xl font-bold">Supprimer ce document ?</h2>
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

export default Documents;
