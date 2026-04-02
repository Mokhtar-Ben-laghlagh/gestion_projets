package ma.fstg.gestionprojets.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentaireRequest {
    @NotBlank(message = "Le contenu est obligatoire")
    private String contenu;
}
