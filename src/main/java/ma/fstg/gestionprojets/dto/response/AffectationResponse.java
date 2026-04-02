package ma.fstg.gestionprojets.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AffectationResponse {
    private Long employeId;
    private Long phaseId;
    private String employeNom;
    private String employePrenom;
    private String employeMatricule;
    private String phaseLibelle;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String description;
    private String role;
    private String statut;
}
