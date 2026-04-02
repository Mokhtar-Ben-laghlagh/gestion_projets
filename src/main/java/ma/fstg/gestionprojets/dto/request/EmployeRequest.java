package ma.fstg.gestionprojets.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class EmployeRequest {
    @NotBlank(message = "Le matricule est obligatoire")
    private String matricule;
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;
    private String telephone;
    @Email(message = "Email invalide")
    private String email;
    @NotBlank(message = "Le login est obligatoire")
    private String login;
    @NotBlank(message = "Le mot de passe est obligatoire")
    private String password;
    private String adresse;
    private Long profilId;
}
