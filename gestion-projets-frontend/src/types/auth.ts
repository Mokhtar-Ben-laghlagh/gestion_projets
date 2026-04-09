export interface User {
  id: number;
  login: string;
  nom: string;
  prenom: string;
  email: string;
  matricule: string;
  profil: {
    id: number;
    code: string;
    libelle: string;
  };
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}
