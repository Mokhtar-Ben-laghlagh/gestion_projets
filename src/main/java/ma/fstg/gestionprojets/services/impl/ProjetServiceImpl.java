package ma.fstg.gestionprojets.services.impl;

import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.ProjetRequest;
import ma.fstg.gestionprojets.dto.response.*;
import ma.fstg.gestionprojets.entities.*;
import ma.fstg.gestionprojets.exceptions.*;
import ma.fstg.gestionprojets.repositories.*;
import ma.fstg.gestionprojets.services.ProjetService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service @RequiredArgsConstructor @Transactional
public class ProjetServiceImpl implements ProjetService {

    private final ProjetRepository projetRepo;
    private final OrganismeRepository organismeRepo;
    private final EmployeRepository employeRepo;
    private final OrganismeServiceImpl organismeService;
    private final EmployeServiceImpl employeService;

    public ProjetResponse create(ProjetRequest r) {
        if (projetRepo.existsByCode(r.getCode())) throw new DuplicateResourceException("Code projet '" + r.getCode() + "' déjà existant.");
        if (r.getDateDebut().isAfter(r.getDateFin())) throw new InvalidDateException("La date de début doit être antérieure à la date de fin.");
        Organisme org = organismeRepo.findById(r.getOrganismeId()).orElseThrow(() -> new ResourceNotFoundException("Organisme", r.getOrganismeId()));
        Employe chef = r.getChefProjetId() != null ? employeRepo.findById(r.getChefProjetId()).orElseThrow(() -> new ResourceNotFoundException("Employé", r.getChefProjetId())) : null;
        StatutProjet statut = r.getStatut() != null ? StatutProjet.valueOf(r.getStatut()) : StatutProjet.EN_COURS;
        Projet p = Projet.builder().code(r.getCode()).nom(r.getNom()).description(r.getDescription())
                .dateDebut(r.getDateDebut()).dateFin(r.getDateFin()).montant(r.getMontant())
                .statut(statut).organisme(org).chefProjet(chef).build();
        return toResp(projetRepo.save(p));
    }

    public ProjetResponse update(Long id, ProjetRequest r) {
        Projet p = find(id);
        if (!p.getCode().equals(r.getCode()) && projetRepo.existsByCode(r.getCode())) throw new DuplicateResourceException("Code projet déjà utilisé.");
        if (r.getDateDebut().isAfter(r.getDateFin())) throw new InvalidDateException("La date de début doit être antérieure à la date de fin.");
        Organisme org = organismeRepo.findById(r.getOrganismeId()).orElseThrow(() -> new ResourceNotFoundException("Organisme", r.getOrganismeId()));
        Employe chef = r.getChefProjetId() != null ? employeRepo.findById(r.getChefProjetId()).orElseThrow(() -> new ResourceNotFoundException("Employé", r.getChefProjetId())) : null;
        p.setCode(r.getCode()); p.setNom(r.getNom()); p.setDescription(r.getDescription());
        p.setDateDebut(r.getDateDebut()); p.setDateFin(r.getDateFin()); p.setMontant(r.getMontant());
        p.setOrganisme(org); p.setChefProjet(chef);
        if (r.getStatut() != null) p.setStatut(StatutProjet.valueOf(r.getStatut()));
        return toResp(projetRepo.save(p));
    }

    @Transactional(readOnly = true) public ProjetResponse getById(Long id) { return toResp(find(id)); }
    
    @Transactional(readOnly = true) 
    public List<ProjetResponse> getAll() { 
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String login = auth.getName();
        boolean isAdminOrDir = auth.getAuthorities().stream().anyMatch(a -> 
            a.getAuthority().equals("ROLE_ADMINISTRATEUR") || 
            a.getAuthority().equals("ROLE_ADMIN") || 
            a.getAuthority().equals("ROLE_DIRECTEUR") ||
            a.getAuthority().equals("ROLE_SECRETAIRE") ||
            a.getAuthority().equals("ROLE_COMPTABLE"));
        boolean isChefProjet = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CHEF_PROJET"));
        
        List<Projet> data;
        if (isAdminOrDir) {
            data = projetRepo.findAll();
        } else if (isChefProjet) {
            data = projetRepo.fetchProjetsForChef(login);
        } else {
            data = projetRepo.fetchProjetsForEmploye(login);
        }
        return data.stream().map(this::toResp).collect(Collectors.toList()); 
    }

    @Transactional(readOnly = true)
    public ProjetResumeResponse getResume(Long id) {
        Projet p = find(id);
        ProjetResumeResponse r = new ProjetResumeResponse();
        r.setId(p.getId()); r.setCode(p.getCode()); r.setNom(p.getNom());
        r.setMontant(p.getMontant()); r.setDateDebut(p.getDateDebut()); r.setDateFin(p.getDateFin());
        r.setStatut(p.getStatut().name());
        if (p.getOrganisme() != null) r.setOrganisme(organismeService.toResp(p.getOrganisme()));
        if (p.getChefProjet() != null) r.setChefProjet(employeService.toResp(p.getChefProjet()));
        List<Phase> phases = p.getPhases() != null ? p.getPhases() : List.of();
        r.setNombrePhases(phases.size());
        r.setPhasesTerminees(phases.stream().filter(ph -> Boolean.TRUE.equals(ph.getEtatRealisation())).count());
        r.setPhasesFacturees(phases.stream().filter(ph -> Boolean.TRUE.equals(ph.getEtatFacturation())).count());
        r.setPhasesPayees(phases.stream().filter(ph -> Boolean.TRUE.equals(ph.getEtatPaiement())).count());
        r.setMontantFacture(phases.stream().filter(ph -> Boolean.TRUE.equals(ph.getEtatFacturation())).mapToDouble(ph -> ph.getMontant() != null ? ph.getMontant() : 0).sum());
        r.setMontantPaye(phases.stream().filter(ph -> Boolean.TRUE.equals(ph.getEtatPaiement())).mapToDouble(ph -> ph.getMontant() != null ? ph.getMontant() : 0).sum());
        return r;
    }

    @Transactional(readOnly = true) public List<ProjetResponse> getEnCours() { return projetRepo.findEnCours(LocalDate.now()).stream().map(this::toResp).collect(Collectors.toList()); }
    @Transactional(readOnly = true) public List<ProjetResponse> getClotures() { return projetRepo.findClotures(LocalDate.now()).stream().map(this::toResp).collect(Collectors.toList()); }

    public void delete(Long id) {
        Projet p = find(id);
        if (p.getPhases() != null && !p.getPhases().isEmpty()) throw new BusinessException("Impossible de supprimer un projet avec des phases.");
        projetRepo.deleteById(id);
    }

    private Projet find(Long id) { return projetRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Projet", id)); }

    public ProjetResponse toResp(Projet p) {
        ProjetResponse r = new ProjetResponse();
        r.setId(p.getId()); r.setCode(p.getCode()); r.setNom(p.getNom()); r.setDescription(p.getDescription());
        r.setDateDebut(p.getDateDebut()); r.setDateFin(p.getDateFin()); r.setMontant(p.getMontant());
        r.setStatut(p.getStatut() != null ? p.getStatut().name() : null);
        if (p.getOrganisme() != null) r.setOrganisme(organismeService.toResp(p.getOrganisme()));
        if (p.getChefProjet() != null) r.setChefProjet(employeService.toResp(p.getChefProjet()));
        r.setNombrePhases(p.getPhases() != null ? p.getPhases().size() : 0);
        r.setNombreDocuments(p.getDocuments() != null ? p.getDocuments().size() : 0);
        return r;
    }
}
