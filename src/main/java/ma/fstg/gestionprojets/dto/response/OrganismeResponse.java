package ma.fstg.gestionprojets.dto.response;

import lombok.Data;

@Data
public class OrganismeResponse {
    private Long id;
    private String code;
    private String nom;
    private String adresse;
    private String telephone;
    private String nomContact;
    private String emailContact;
    private String siteWeb;
    private String secteurActivite;
    private String pays;
    private int nombreProjets;
}
