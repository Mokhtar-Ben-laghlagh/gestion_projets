package ma.fstg.gestionprojets.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class LivrableRequest {
    @NotBlank(message = "Le code est obligatoire")
    private String code;
    @NotBlank(message = "Le libellé est obligatoire")
    private String libelle;
    private String description;
    private String chemin;
    private String typeFichier;
    private LocalDate dateRemise;
    private Boolean valide;
}
