package ma.fstg.gestionprojets.mappers;

import ma.fstg.gestionprojets.dto.request.PhaseRequest;
import ma.fstg.gestionprojets.dto.response.PhaseResponse;
import ma.fstg.gestionprojets.entities.Phase;
import ma.fstg.gestionprojets.entities.Projet;
import org.springframework.stereotype.Component;

@Component
public class PhaseMapper {

    public Phase toEntity(PhaseRequest request, Projet projet) {
        return Phase.builder()
                .code(request.getCode())
                .libelle(request.getLibelle())
                .description(request.getDescription())
                .dateDebut(request.getDateDebut())
                .dateFin(request.getDateFin())
                .montant(request.getMontant())
                .pourcentage(request.getPourcentage())
                .etatRealisation(false)
                .etatFacturation(false)
                .etatPaiement(false)
                .projet(projet)
                .build();
    }

    public PhaseResponse toResponse(Phase phase) {
        PhaseResponse response = new PhaseResponse();
        response.setId(phase.getId());
        response.setCode(phase.getCode());
        response.setLibelle(phase.getLibelle());
        response.setDescription(phase.getDescription());
        response.setDateDebut(phase.getDateDebut());
        response.setDateFin(phase.getDateFin());
        response.setMontant(phase.getMontant());
        response.setPourcentage(phase.getPourcentage());
        response.setEtatRealisation(phase.getEtatRealisation());
        response.setEtatFacturation(phase.getEtatFacturation());
        response.setEtatPaiement(phase.getEtatPaiement());

        if (phase.getProjet() != null) {
            response.setProjetId(phase.getProjet().getId());
            response.setProjetNom(phase.getProjet().getNom());
        }

        response.setNombreLivrables(
            phase.getLivrables() != null ? phase.getLivrables().size() : 0
        );
        response.setNombreAffectations(
            phase.getAffectations() != null ? phase.getAffectations().size() : 0
        );

        return response;
    }

    public void updateEntity(Phase phase, PhaseRequest request) {
        phase.setCode(request.getCode());
        phase.setLibelle(request.getLibelle());
        phase.setDescription(request.getDescription());
        phase.setDateDebut(request.getDateDebut());
        phase.setDateFin(request.getDateFin());
        phase.setMontant(request.getMontant());
        phase.setPourcentage(request.getPourcentage());
    }
}
