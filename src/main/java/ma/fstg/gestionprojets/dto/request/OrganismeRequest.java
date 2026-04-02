package ma.fstg.gestionprojets.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class OrganismeRequest {
    @NotBlank(message = "Le code est obligatoire")
    private String code;
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
    private String adresse;
    private String telephone;
    private String nomContact;
    @Email
    private String emailContact;
    private String siteWeb;
    private String secteurActivite;
    private String pays;
}
