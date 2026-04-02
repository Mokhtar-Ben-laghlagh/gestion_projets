package ma.fstg.gestionprojets.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ProjetResponse {
    private Long id;
    private String code;
    private String nom;
    private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Double montant;
    private String statut;
    private OrganismeResponse organisme;
    private EmployeResponse chefProjet;
    private int nombrePhases;
    private int nombreDocuments;
}
