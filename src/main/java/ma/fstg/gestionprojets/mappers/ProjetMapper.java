package ma.fstg.gestionprojets.mappers;

import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.ProjetRequest;
import ma.fstg.gestionprojets.dto.response.ProjetResponse;
import ma.fstg.gestionprojets.dto.response.ProjetResumeResponse;
import ma.fstg.gestionprojets.entities.Employe;
import ma.fstg.gestionprojets.entities.Organisme;
import ma.fstg.gestionprojets.entities.Phase;
import ma.fstg.gestionprojets.entities.Projet;
import ma.fstg.gestionprojets.entities.StatutProjet;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ProjetMapper {

    private final OrganismeMapper organismeMapper;
    private final EmployeMapper employeMapper;

    public Projet toEntity(ProjetRequest request, Organisme organisme, Employe chefProjet) {
        StatutProjet statut = request.getStatut() != null
                ? StatutProjet.valueOf(request.getStatut())
                : StatutProjet.EN_COURS;

        return Projet.builder()
                .code(request.getCode())
                .nom(request.getNom())
                .description(request.getDescription())
                .dateDebut(request.getDateDebut())
                .dateFin(request.getDateFin())
                .montant(request.getMontant())
                .statut(statut)
                .organisme(organisme)
                .chefProjet(chefProjet)
                .build();
    }

    public ProjetResponse toResponse(Projet projet) {
        ProjetResponse response = new ProjetResponse();
        response.setId(projet.getId());
        response.setCode(projet.getCode());
        response.setNom(projet.getNom());
        response.setDescription(projet.getDescription());
        response.setDateDebut(projet.getDateDebut());
        response.setDateFin(projet.getDateFin());
        response.setMontant(projet.getMontant());
        response.setStatut(projet.getStatut() != null ? projet.getStatut().name() : null);

        if (projet.getOrganisme() != null)
            response.setOrganisme(organismeMapper.toResponse(projet.getOrganisme()));

        if (projet.getChefProjet() != null)
            response.setChefProjet(employeMapper.toResponse(projet.getChefProjet()));

        response.setNombrePhases(
            projet.getPhases() != null ? projet.getPhases().size() : 0
        );
        response.setNombreDocuments(
            projet.getDocuments() != null ? projet.getDocuments().size() : 0
        );

        return response;
    }

    public ProjetResumeResponse toResumeResponse(Projet projet) {
        ProjetResumeResponse response = new ProjetResumeResponse();
        response.setId(projet.getId());
        response.setCode(projet.getCode());
        response.setNom(projet.getNom());
        response.setMontant(projet.getMontant());
        response.setDateDebut(projet.getDateDebut());
        response.setDateFin(projet.getDateFin());
        response.setStatut(projet.getStatut() != null ? projet.getStatut().name() : null);

        if (projet.getOrganisme() != null)
            response.setOrganisme(organismeMapper.toResponse(projet.getOrganisme()));

        if (projet.getChefProjet() != null)
            response.setChefProjet(employeMapper.toResponse(projet.getChefProjet()));

        List<Phase> phases = projet.getPhases() != null ? projet.getPhases() : List.of();
        response.setNombrePhases(phases.size());
        response.setPhasesTerminees(phases.stream().filter(p -> Boolean.TRUE.equals(p.getEtatRealisation())).count());
        response.setPhasesFacturees(phases.stream().filter(p -> Boolean.TRUE.equals(p.getEtatFacturation())).count());
        response.setPhasesPayees(phases.stream().filter(p -> Boolean.TRUE.equals(p.getEtatPaiement())).count());
        response.setMontantFacture(phases.stream()
                .filter(p -> Boolean.TRUE.equals(p.getEtatFacturation()))
                .mapToDouble(p -> p.getMontant() != null ? p.getMontant() : 0).sum());
        response.setMontantPaye(phases.stream()
                .filter(p -> Boolean.TRUE.equals(p.getEtatPaiement()))
                .mapToDouble(p -> p.getMontant() != null ? p.getMontant() : 0).sum());

        return response;
    }

    public void updateEntity(Projet projet, ProjetRequest request, Organisme organisme, Employe chefProjet) {
        projet.setCode(request.getCode());
        projet.setNom(request.getNom());
        projet.setDescription(request.getDescription());
        projet.setDateDebut(request.getDateDebut());
        projet.setDateFin(request.getDateFin());
        projet.setMontant(request.getMontant());
        projet.setOrganisme(organisme);
        projet.setChefProjet(chefProjet);
        if (request.getStatut() != null)
            projet.setStatut(StatutProjet.valueOf(request.getStatut()));
    }
}
