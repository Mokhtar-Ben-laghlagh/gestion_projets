import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, Eye, EyeOff, ShieldCheck, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';

const ChangePassword: React.FC = () => {
  const [form, setForm] = useState({
    ancienPassword: '',
    nouveauPassword: '',
    confirmationPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validation en temps réel
  const passwordLength = form.nouveauPassword.length >= 6;
  const passwordsMatch = form.nouveauPassword === form.confirmationPassword && form.confirmationPassword !== '';
  const isFormReady =
    form.ancienPassword !== '' &&
    form.nouveauPassword !== '' &&
    form.confirmationPassword !== '' &&
    passwordLength &&
    passwordsMatch;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormReady) return;

    setIsSubmitting(true);
    try {
      await api.post('/auth/change-password', form);
      toast.success('Mot de passe modifié avec succès !');
      setSuccess(true);
      setForm({ ancienPassword: '', nouveauPassword: '', confirmationPassword: '' });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erreur lors du changement de mot de passe.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const PasswordInput = ({
    label, name, value, show, onToggle, icon, hint,
  }: {
    label: string; name: string; value: string;
    show: boolean; onToggle: () => void;
    icon?: React.ReactNode; hint?: React.ReactNode;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</span>
        <input
          type={show ? 'text' : 'password'}
          name={name}
          autoComplete="new-password"
          value={value}
          onChange={handleChange}
          required
          className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {hint && <div className="mt-1.5">{hint}</div>}
    </div>
  );

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* En-tête */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gradient flex items-center gap-3">
          <KeyRound className="text-indigo-400" />
          Changer le mot de passe
        </h1>
        <p className="text-text-secondary mt-1">
          Modifiez votre mot de passe pour sécuriser votre compte.
        </p>
      </motion.div>

      {/* Carte principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-panel p-8"
      >
        {/* Bannière succès */}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3"
          >
            <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
            <p className="text-sm text-emerald-300">
              Mot de passe modifié avec succès ! Les prochaines connexions utiliseront le nouveau mot de passe.
            </p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          {/* Règles de sécurité */}
          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck size={18} className="text-indigo-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-400 space-y-1">
              <p className="font-medium text-indigo-300">Règles de création du mot de passe</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Minimum <strong className="text-white">6 caractères</strong></li>
                <li>Ne pas réutiliser votre ancien mot de passe</li>
                <li>Le nouveau mot de passe et sa confirmation doivent être identiques</li>
              </ul>
            </div>
          </div>

          {/* Ancien mot de passe */}
          <PasswordInput
            label="Ancien mot de passe"
            name="ancienPassword"
            value={form.ancienPassword}
            show={showOld}
            onToggle={() => setShowOld(v => !v)}
            icon={<Lock size={15} />}
          />

          <div className="border-t border-white/5 pt-2" />

          {/* Nouveau mot de passe */}
          <PasswordInput
            label="Nouveau mot de passe"
            name="nouveauPassword"
            value={form.nouveauPassword}
            show={showNew}
            onToggle={() => setShowNew(v => !v)}
            icon={<KeyRound size={15} />}
            hint={
              form.nouveauPassword && (
                <span
                  className={`flex items-center gap-1.5 text-xs ${
                    passwordLength ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {passwordLength
                    ? <CheckCircle2 size={12} />
                    : <AlertCircle size={12} />}
                  {passwordLength ? 'Longueur suffisante' : 'Minimum 6 caractères requis'}
                </span>
              )
            }
          />

          {/* Confirmation */}
          <PasswordInput
            label="Confirmer le nouveau mot de passe"
            name="confirmationPassword"
            value={form.confirmationPassword}
            show={showConfirm}
            onToggle={() => setShowConfirm(v => !v)}
            icon={<ShieldCheck size={15} />}
            hint={
              form.confirmationPassword && (
                <span
                  className={`flex items-center gap-1.5 text-xs ${
                    passwordsMatch ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {passwordsMatch
                    ? <CheckCircle2 size={12} />
                    : <AlertCircle size={12} />}
                  {passwordsMatch ? 'Les mots de passe correspondent' : 'Les mots de passe ne correspondent pas'}
                </span>
              )
            }
          />

          {/* Bouton */}
          <div className="pt-2">
            <motion.button
              type="submit"
              disabled={isSubmitting || !isFormReady}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Modification en cours...
                </>
              ) : (
                <>
                  <KeyRound size={16} />
                  Enregistrer le nouveau mot de passe
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
