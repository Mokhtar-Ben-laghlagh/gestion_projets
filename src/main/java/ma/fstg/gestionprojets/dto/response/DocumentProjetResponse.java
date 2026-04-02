package ma.fstg.gestionprojets.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DocumentProjetResponse {
    private Long id;
    private String code;
    private String libelle;
    private String description;
    private String chemin;
    private String typeDocument;
    private LocalDateTime dateAjout;
    private Long projetId;
    private String projetNom;
}
