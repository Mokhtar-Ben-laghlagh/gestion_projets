package ma.fstg.gestionprojets.services.impl;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.LivrableRequest;
import ma.fstg.gestionprojets.dto.response.LivrableResponse;
import ma.fstg.gestionprojets.entities.*;
import ma.fstg.gestionprojets.exceptions.*;
import ma.fstg.gestionprojets.repositories.*;
import ma.fstg.gestionprojets.services.LivrableService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
@Service @RequiredArgsConstructor @Transactional
public class LivrableServiceImpl implements LivrableService {
    private final LivrableRepository repo;
    private final PhaseRepository phaseRepo;
    public LivrableResponse create(Long phaseId, LivrableRequest r) {
        Phase phase = phaseRepo.findById(phaseId).orElseThrow(() -> new ResourceNotFoundException("Phase", phaseId));
        Livrable l = Livrable.builder().code(r.getCode()).libelle(r.getLibelle()).description(r.getDescription()).chemin(r.getChemin()).typeFichier(r.getTypeFichier()).dateRemise(r.getDateRemise()).valide(r.getValide() != null ? r.getValide() : false).phase(phase).build();
        return toResp(repo.save(l));
    }
    public LivrableResponse update(Long id, LivrableRequest r) { Livrable l = find(id); l.setCode(r.getCode()); l.setLibelle(r.getLibelle()); l.setDescription(r.getDescription()); l.setChemin(r.getChemin()); l.setTypeFichier(r.getTypeFichier()); l.setDateRemise(r.getDateRemise()); if (r.getValide() != null) l.setValide(r.getValide()); return toResp(repo.save(l)); }
    @Transactional(readOnly=true) public LivrableResponse getById(Long id) { return toResp(find(id)); }
    @Transactional(readOnly=true) public List<LivrableResponse> getByPhase(Long pId) { 
        return getAll().stream().filter(l -> l.getPhaseId() != null && l.getPhaseId().equals(pId)).collect(Collectors.toList()); 
    }
    
    @Transactional(readOnly = true)
    public List<LivrableResponse> getAll() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String login = auth.getName();
        boolean isAdminOrDir = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRATEUR") || a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_DIRECTEUR") || a.getAuthority().equals("ROLE_SECRETAIRE") || a.getAuthority().equals("ROLE_COMPTABLE"));
        boolean isChefProjet = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CHEF_PROJET"));
        
        List<Livrable> data;
        if (isAdminOrDir) {
            data = repo.findAll();
        } else if (isChefProjet) {
            data = repo.fetchLivrablesForChef(login);
        } else {
            data = repo.fetchLivrablesForEmploye(login);
        }
        return data.stream().map(this::toResp).collect(Collectors.toList());
    }

    public void delete(Long id) { find(id); repo.deleteById(id); }
    private Livrable find(Long id) { return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Livrable", id)); }
    private LivrableResponse toResp(Livrable l) { LivrableResponse r = new LivrableResponse(); r.setId(l.getId()); r.setCode(l.getCode()); r.setLibelle(l.getLibelle()); r.setDescription(l.getDescription()); r.setChemin(l.getChemin()); r.setTypeFichier(l.getTypeFichier()); r.setDateRemise(l.getDateRemise()); r.setValide(l.getValide()); if (l.getPhase()!=null){r.setPhaseId(l.getPhase().getId()); r.setPhaseLibelle(l.getPhase().getLibelle());} return r; }
}
