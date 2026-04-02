package ma.fstg.gestionprojets.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FactureRequest {
    @NotBlank(message = "Le code est obligatoire")
    private String code;
    @NotNull(message = "La date de facturation est obligatoire")
    private LocalDate dateFacture;
    private Double montant;
    private String reference;
}
