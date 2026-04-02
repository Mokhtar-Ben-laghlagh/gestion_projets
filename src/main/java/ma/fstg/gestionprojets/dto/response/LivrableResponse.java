package ma.fstg.gestionprojets.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class LivrableResponse {
    private Long id;
    private String code;
    private String libelle;
    private String description;
    private String chemin;
    private String typeFichier;
    private LocalDate dateRemise;
    private Boolean valide;
    private Long phaseId;
    private String phaseLibelle;
}
