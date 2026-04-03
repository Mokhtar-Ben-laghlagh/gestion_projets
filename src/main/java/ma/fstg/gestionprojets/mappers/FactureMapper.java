package ma.fstg.gestionprojets.mappers;

import ma.fstg.gestionprojets.dto.request.FactureRequest;
import ma.fstg.gestionprojets.dto.response.FactureResponse;
import ma.fstg.gestionprojets.entities.Facture;
import ma.fstg.gestionprojets.entities.Phase;
import ma.fstg.gestionprojets.entities.StatutFacture;
import org.springframework.stereotype.Component;

@Component
public class FactureMapper {

    public Facture toEntity(FactureRequest request, Phase phase) {
        return Facture.builder()
                .code(request.getCode())
                .dateFacture(request.getDateFacture())
                .montant(request.getMontant() != null ? request.getMontant() : phase.getMontant())
                .reference(request.getReference())
                .statut(StatutFacture.EMISE)
                .phase(phase)
                .build();
    }

    public FactureResponse toResponse(Facture facture) {
        FactureResponse response = new FactureResponse();
        response.setId(facture.getId());
        response.setCode(facture.getCode());
        response.setDateFacture(facture.getDateFacture());
        response.setDatePaiement(facture.getDatePaiement());
        response.setMontant(facture.getMontant());
        response.setReference(facture.getReference());
        response.setStatut(facture.getStatut() != null ? facture.getStatut().name() : null);

        if (facture.getPhase() != null) {
            response.setPhaseId(facture.getPhase().getId());
            response.setPhaseLibelle(facture.getPhase().getLibelle());

            if (facture.getPhase().getProjet() != null) {
                response.setProjetNom(facture.getPhase().getProjet().getNom());

                if (facture.getPhase().getProjet().getOrganisme() != null)
                    response.setOrganismeNom(facture.getPhase().getProjet().getOrganisme().getNom());
            }
        }

        return response;
    }

    public void updateEntity(Facture facture, FactureRequest request) {
        facture.setCode(request.getCode());
        facture.setDateFacture(request.getDateFacture());
        if (request.getMontant() != null) facture.setMontant(request.getMontant());
        if (request.getReference() != null) facture.setReference(request.getReference());
    }
}
