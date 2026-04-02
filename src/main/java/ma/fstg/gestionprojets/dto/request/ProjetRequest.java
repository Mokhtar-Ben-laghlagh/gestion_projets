package ma.fstg.gestionprojets.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProjetRequest {
    @NotBlank(message = "Le code est obligatoire")
    private String code;
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
    private String description;
    @NotNull(message = "La date de début est obligatoire")
    private LocalDate dateDebut;
    @NotNull(message = "La date de fin est obligatoire")
    private LocalDate dateFin;
    @NotNull(message = "Le montant est obligatoire")
    private Double montant;
    @NotNull(message = "L'organisme est obligatoire")
    private Long organismeId;
    private Long chefProjetId;
    private String statut;
}
