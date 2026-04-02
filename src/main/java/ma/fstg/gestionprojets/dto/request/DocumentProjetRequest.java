package ma.fstg.gestionprojets.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DocumentProjetRequest {
    @NotBlank(message = "Le code est obligatoire")
    private String code;
    @NotBlank(message = "Le libellé est obligatoire")
    private String libelle;
    private String description;
    private String chemin;
    private String typeDocument;
}
