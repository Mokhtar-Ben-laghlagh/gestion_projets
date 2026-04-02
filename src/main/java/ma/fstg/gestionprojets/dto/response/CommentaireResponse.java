package ma.fstg.gestionprojets.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentaireResponse {
    private Long id;
    private String contenu;
    private LocalDateTime dateCreation;
    private String auteurNom;
    private String auteurPrenom;
    private Long projetId;
    private Long phaseId;
}
