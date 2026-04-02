package ma.fstg.gestionprojets.dto.response;

import lombok.Data;

@Data
public class EmployeResponse {
    private Long id;
    private String matricule;
    private String nom;
    private String prenom;
    private String telephone;
    private String email;
    private String login;
    private String adresse;
    private Boolean actif;
    private ProfilResponse profil;
}
