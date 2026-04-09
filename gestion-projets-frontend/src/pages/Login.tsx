import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { LogIn, Lock, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import type { LoginRequest } from '../types/api-requests';

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      // Map the backend structure to our global User state structure
      const user = {
        id: response.employeId,
        login: response.login,
        nom: response.nom,
        prenom: response.prenom,
        email: '',
        matricule: '',
        profil: {
          id: 0,
          code: response.profil,
          libelle: response.profil
        }
      };
      login(response.token, user);
      toast.success('Connexion réussie !');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Échec de la connexion. Vérifiez vos identifiants.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/20 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8">
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-4"
            >
              <LogIn size={32} />
            </motion.div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Bon retour</h1>
            <p className="text-text-secondary">Système de gestion de projets</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label>Identifiant</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <UserIcon size={18} />
                </div>
                <input
                  type="text"
                  placeholder="admin"
                  className="pl-10"
                  {...register('login', { required: 'L\'identifiant est requis' })}
                />
              </div>
              {errors.login && <p className="text-danger text-sm mt-1">{errors.login.message}</p>}
            </div>

            <div>
              <label>Mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  {...register('password', { required: 'Le mot de passe est requis' })}
                />
              </div>
              {errors.password && <p className="text-danger text-sm mt-1">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Se connecter</span>
              )}
            </button>
          </form>
          
          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-text-muted">
            <p className="font-semibold text-gray-400 mb-1">Compte par défaut</p>
            <p>🔑 <span className="text-white font-mono">admin</span> / <span className="font-mono">admin123</span> — Administrateur</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
