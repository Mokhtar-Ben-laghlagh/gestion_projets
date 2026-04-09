package ma.fstg.gestionprojets.services.impl;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.AffectationRequest;
import ma.fstg.gestionprojets.dto.response.AffectationResponse;
import ma.fstg.gestionprojets.entities.*;
import ma.fstg.gestionprojets.exceptions.*;
import ma.fstg.gestionprojets.repositories.*;
import ma.fstg.gestionprojets.services.AffectationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
@Service @RequiredArgsConstructor @Transactional
public class AffectationServiceImpl implements AffectationService {
    private final AffectationRepository repo;
    private final PhaseRepository phaseRepo;
    private final EmployeRepository empRepo;
    public AffectationResponse create(Long phaseId, Long empId, AffectationRequest r) {
        AffectationId aid = new AffectationId(empId, phaseId);
        if (repo.existsById(aid)) throw new DuplicateResourceException("Employé déjà affecté à cette phase.");
        Phase phase = phaseRepo.findById(phaseId).orElseThrow(() -> new ResourceNotFoundException("Phase", phaseId));
        Employe emp = empRepo.findById(empId).orElseThrow(() -> new ResourceNotFoundException("Employé", empId));
        if (r.getDateDebut().isBefore(phase.getDateDebut()) || r.getDateFin().isAfter(phase.getDateFin()))
            throw new InvalidDateException("Dates d'affectation hors de la plage de la phase.");
        if (r.getDateDebut().isAfter(r.getDateFin())) throw new InvalidDateException("Date début après date fin.");
        return toResp(repo.save(Affectation.builder().id(aid).employe(emp).phase(phase).dateDebut(r.getDateDebut()).dateFin(r.getDateFin()).description(r.getDescription()).role(r.getRole()).statut(r.getStatut()).build()));
    }
    public AffectationResponse update(Long phaseId, Long empId, AffectationRequest r) {
        Affectation a = repo.findById(new AffectationId(empId, phaseId)).orElseThrow(() -> new ResourceNotFoundException("Affectation introuvable"));
        Phase phase = a.getPhase();
        if (r.getDateDebut().isBefore(phase.getDateDebut()) || r.getDateFin().isAfter(phase.getDateFin()))
            throw new InvalidDateException("Dates d'affectation hors de la plage de la phase.");
        a.setDateDebut(r.getDateDebut()); a.setDateFin(r.getDateFin()); a.setDescription(r.getDescription()); a.setRole(r.getRole()); a.setStatut(r.getStatut());
        return toResp(repo.save(a));
    }
    @Transactional(readOnly=true) public AffectationResponse getOne(Long phaseId, Long empId) { return toResp(repo.findById(new AffectationId(empId, phaseId)).orElseThrow(() -> new ResourceNotFoundException("Affectation introuvable"))); }
    @Transactional(readOnly=true) public List<AffectationResponse> getByPhase(Long pId) { 
        return getAll().stream().filter(a -> a.getPhaseId() != null && a.getPhaseId().equals(pId)).collect(Collectors.toList()); 
    }
    @Transactional(readOnly=true) public List<AffectationResponse> getByEmploye(Long eId) { return repo.findByEmployeId(eId).stream().map(this::toResp).collect(Collectors.toList()); }
    
    @Transactional(readOnly = true)
    public List<AffectationResponse> getAll() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String login = auth.getName();
        boolean isAdminOrDir = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRATEUR") || a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_DIRECTEUR") || a.getAuthority().equals("ROLE_SECRETAIRE") || a.getAuthority().equals("ROLE_COMPTABLE"));
        boolean isChefProjet = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CHEF_PROJET"));
        
        List<Affectation> data;
        if (isAdminOrDir) {
            data = repo.findAll();
        } else if (isChefProjet) {
            data = repo.fetchAffectationsForChefProjet(login);
        } else {
            data = repo.fetchAffectationsForEmploye(login);
        }
        return data.stream().map(this::toResp).collect(Collectors.toList());
    }

    public void delete(Long phaseId, Long empId) { AffectationId aid = new AffectationId(empId, phaseId); if (!repo.existsById(aid)) throw new ResourceNotFoundException("Affectation introuvable"); repo.deleteById(aid); }
    private AffectationResponse toResp(Affectation a) { AffectationResponse r = new AffectationResponse(); r.setEmployeId(a.getEmploye().getId()); r.setPhaseId(a.getPhase().getId()); r.setEmployeNom(a.getEmploye().getNom()); r.setEmployePrenom(a.getEmploye().getPrenom()); r.setEmployeMatricule(a.getEmploye().getMatricule()); r.setPhaseLibelle(a.getPhase().getLibelle()); r.setDateDebut(a.getDateDebut()); r.setDateFin(a.getDateFin()); r.setDescription(a.getDescription()); r.setRole(a.getRole()); r.setStatut(a.getStatut()); return r; }
}
