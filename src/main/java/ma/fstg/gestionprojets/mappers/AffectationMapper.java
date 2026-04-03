package ma.fstg.gestionprojets.mappers;

import ma.fstg.gestionprojets.dto.request.AffectationRequest;
import ma.fstg.gestionprojets.dto.response.AffectationResponse;
import ma.fstg.gestionprojets.entities.Affectation;
import ma.fstg.gestionprojets.entities.AffectationId;
import ma.fstg.gestionprojets.entities.Employe;
import ma.fstg.gestionprojets.entities.Phase;
import org.springframework.stereotype.Component;

@Component
public class AffectationMapper {

    public Affectation toEntity(AffectationRequest request, Phase phase, Employe employe) {
        return Affectation.builder()
                .id(new AffectationId(employe.getId(), phase.getId()))
                .employe(employe)
                .phase(phase)
                .dateDebut(request.getDateDebut())
                .dateFin(request.getDateFin())
                .description(request.getDescription())
                .role(request.getRole())
                .statut(request.getStatut())
                .build();
    }

    public AffectationResponse toResponse(Affectation affectation) {
        AffectationResponse response = new AffectationResponse();
        response.setEmployeId(affectation.getEmploye().getId());
        response.setPhaseId(affectation.getPhase().getId());
        response.setEmployeNom(affectation.getEmploye().getNom());
        response.setEmployePrenom(affectation.getEmploye().getPrenom());
        response.setEmployeMatricule(affectation.getEmploye().getMatricule());
        response.setPhaseLibelle(affectation.getPhase().getLibelle());
        response.setDateDebut(affectation.getDateDebut());
        response.setDateFin(affectation.getDateFin());
        response.setDescription(affectation.getDescription());
        response.setRole(affectation.getRole());
        response.setStatut(affectation.getStatut());
        return response;
    }

    public void updateEntity(Affectation affectation, AffectationRequest request) {
        affectation.setDateDebut(request.getDateDebut());
        affectation.setDateFin(request.getDateFin());
        affectation.setDescription(request.getDescription());
        affectation.setRole(request.getRole());
        affectation.setStatut(request.getStatut());
    }
}
