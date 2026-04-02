package ma.fstg.gestionprojets.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class FactureResponse {
    private Long id;
    private String code;
    private LocalDate dateFacture;
    private LocalDate datePaiement;
    private Double montant;
    private String reference;
    private String statut;
    private Long phaseId;
    private String phaseLibelle;
    private String projetNom;
    private String organismeNom;
}
