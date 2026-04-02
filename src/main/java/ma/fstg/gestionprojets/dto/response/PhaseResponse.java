package ma.fstg.gestionprojets.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PhaseResponse {
    private Long id;
    private String code;
    private String libelle;
    private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Double montant;
    private Integer pourcentage;
    private Boolean etatRealisation;
    private Boolean etatFacturation;
    private Boolean etatPaiement;
    private Long projetId;
    private String projetNom;
    private int nombreLivrables;
    private int nombreAffectations;
}
