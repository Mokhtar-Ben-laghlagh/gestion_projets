package ma.fstg.gestionprojets.services.impl;

import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.PhaseRequest;
import ma.fstg.gestionprojets.dto.response.PhaseResponse;
import ma.fstg.gestionprojets.entities.Phase;
import ma.fstg.gestionprojets.entities.Projet;
import ma.fstg.gestionprojets.exceptions.*;
import ma.fstg.gestionprojets.repositories.PhaseRepository;
import ma.fstg.gestionprojets.repositories.ProjetRepository;
import ma.fstg.gestionprojets.services.PhaseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service @RequiredArgsConstructor @Transactional
public class PhaseServiceImpl implements PhaseService {

    private final PhaseRepository phaseRepo;
    private final ProjetRepository projetRepo;

    public PhaseResponse create(Long projetId, PhaseRequest r) {
        Projet projet = projetRepo.findById(projetId).orElseThrow(() -> new ResourceNotFoundException("Projet", projetId));
        validateDates(r, projet);
        validateMontant(projetId, r.getMontant(), null, projet.getMontant());
        Phase phase = Phase.builder().code(r.getCode()).libelle(r.getLibelle()).description(r.getDescription())
                .dateDebut(r.getDateDebut()).dateFin(r.getDateFin()).montant(r.getMontant())
                .pourcentage(r.getPourcentage()).etatRealisation(false).etatFacturation(false).etatPaiement(false)
                .projet(projet).build();
        return toResponse(phaseRepo.save(phase));
    }

    public PhaseResponse update(Long id, PhaseRequest r) {
        Phase phase = findById(id);
        validateDates(r, phase.getProjet());
        validateMontant(phase.getProjet().getId(), r.getMontant(), id, phase.getProjet().getMontant());
        phase.setCode(r.getCode()); phase.setLibelle(r.getLibelle()); phase.setDescription(r.getDescription());
        phase.setDateDebut(r.getDateDebut()); phase.setDateFin(r.getDateFin()); phase.setMontant(r.getMontant());
        phase.setPourcentage(r.getPourcentage());
        return toResponse(phaseRepo.save(phase));
    }

    @Transactional(readOnly = true) public PhaseResponse getById(Long id) { return toResponse(findById(id)); }
    @Transactional(readOnly = true) public List<PhaseResponse> getByProjet(Long pId) { 
        return getAll().stream().filter(p -> p.getProjetId() != null && p.getProjetId().equals(pId)).collect(Collectors.toList()); 
    }
    
    @Transactional(readOnly = true) 
    public List<PhaseResponse> getMyPhases(String login) {
        return phaseRepo.fetchPhasesForEmploye(login).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<PhaseResponse> getAll() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String login = auth.getName();
        boolean isAdminOrDir = auth.getAuthorities().stream().anyMatch(a -> 
            a.getAuthority().equals("ROLE_ADMINISTRATEUR") || 
            a.getAuthority().equals("ROLE_ADMIN") || 
            a.getAuthority().equals("ROLE_DIRECTEUR") ||
            a.getAuthority().equals("ROLE_SECRETAIRE") ||
            a.getAuthority().equals("ROLE_COMPTABLE"));
        boolean isChefProjet = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CHEF_PROJET"));
        
        List<Phase> data;
        if (isAdminOrDir) {
            data = phaseRepo.findAll();
        } else if (isChefProjet) {
            data = phaseRepo.fetchPhasesForChef(login);
        } else {
            data = phaseRepo.fetchPhasesForEmploye(login);
        }
        return data.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public PhaseResponse updateRealisation(Long id, boolean etat) { Phase p = findById(id); p.setEtatRealisation(etat); return toResponse(phaseRepo.save(p)); }
    public PhaseResponse updateFacturation(Long id, boolean etat) {
        Phase p = findById(id);
        if (etat && !Boolean.TRUE.equals(p.getEtatRealisation())) throw new BusinessException("La phase doit être réalisée avant d'être facturée.");
        p.setEtatFacturation(etat); return toResponse(phaseRepo.save(p));
    }
    public PhaseResponse updatePaiement(Long id, boolean etat) {
        Phase p = findById(id);
        if (etat && !Boolean.TRUE.equals(p.getEtatFacturation())) throw new BusinessException("La phase doit être facturée avant d'être payée.");
        p.setEtatPaiement(etat); return toResponse(phaseRepo.save(p));
    }
    public void delete(Long id) { findById(id); phaseRepo.deleteById(id); }
    public Phase findEntityById(Long id) { return findById(id); }

    private void validateDates(PhaseRequest r, Projet projet) {
        if (r.getDateDebut().isAfter(r.getDateFin())) throw new InvalidDateException("Date début doit être avant date fin.");
        if (r.getDateDebut().isBefore(projet.getDateDebut()) || r.getDateFin().isAfter(projet.getDateFin()))
            throw new InvalidDateException("Les dates de la phase doivent être dans l'intervalle du projet.");
    }
    private void validateMontant(Long projetId, Double nouveau, Long excludeId, Double montantProjet) {
        Double somme = phaseRepo.sumMontantByProjetId(projetId);
        if (excludeId != null) { Phase ex = phaseRepo.findById(excludeId).orElse(null); if (ex != null) somme -= ex.getMontant(); }
        if (somme + nouveau > montantProjet) throw new MontantDepasseException("La somme des montants des phases dépasse le montant du projet (" + montantProjet + ").");
    }
    private Phase findById(Long id) { return phaseRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Phase", id)); }

    public PhaseResponse toResponse(Phase p) {
        PhaseResponse r = new PhaseResponse();
        r.setId(p.getId()); r.setCode(p.getCode()); r.setLibelle(p.getLibelle()); r.setDescription(p.getDescription());
        r.setDateDebut(p.getDateDebut()); r.setDateFin(p.getDateFin()); r.setMontant(p.getMontant()); r.setPourcentage(p.getPourcentage());
        r.setEtatRealisation(p.getEtatRealisation()); r.setEtatFacturation(p.getEtatFacturation()); r.setEtatPaiement(p.getEtatPaiement());
        if (p.getProjet() != null) { r.setProjetId(p.getProjet().getId()); r.setProjetNom(p.getProjet().getNom()); }
        r.setNombreLivrables(p.getLivrables() != null ? p.getLivrables().size() : 0);
        r.setNombreAffectations(p.getAffectations() != null ? p.getAffectations().size() : 0);
        return r;
    }
}
