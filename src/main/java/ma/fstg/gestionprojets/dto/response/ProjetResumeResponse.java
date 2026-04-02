package ma.fstg.gestionprojets.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ProjetResumeResponse {
    private Long id;
    private String code;
    private String nom;
    private Double montant;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String statut;
    private OrganismeResponse organisme;
    private EmployeResponse chefProjet;
    private int nombrePhases;
    private long phasesTerminees;
    private long phasesFacturees;
    private long phasesPayees;
    private double montantFacture;
    private double montantPaye;
}
