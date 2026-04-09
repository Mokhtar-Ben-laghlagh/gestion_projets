export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  login: string;
  nom: string;
  prenom: string;
  profil: string;
  employeId: number;
}
