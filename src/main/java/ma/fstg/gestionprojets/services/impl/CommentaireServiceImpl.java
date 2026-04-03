package ma.fstg.gestionprojets.services.impl;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.CommentaireRequest;
import ma.fstg.gestionprojets.dto.response.CommentaireResponse;
import ma.fstg.gestionprojets.entities.*;
import ma.fstg.gestionprojets.exceptions.ResourceNotFoundException;
import ma.fstg.gestionprojets.repositories.*;
import ma.fstg.gestionprojets.services.CommentaireService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor @Transactional
public class CommentaireServiceImpl implements CommentaireService {
    private final CommentaireRepository repo;
    private final ProjetRepository projetRepo;
    private final PhaseRepository phaseRepo;
    private final EmployeRepository empRepo;
    public CommentaireResponse createForProjet(Long pId, String login, CommentaireRequest r) {
        Projet projet = projetRepo.findById(pId).orElseThrow(() -> new ResourceNotFoundException("Projet", pId));
        Employe auteur = empRepo.findByLogin(login).orElseThrow(() -> new ResourceNotFoundException("Employé introuvable"));
        return toResp(repo.save(Commentaire.builder().contenu(r.getContenu()).projet(projet).auteur(auteur).build()));
    }
    public CommentaireResponse createForPhase(Long pId, String login, CommentaireRequest r) {
        Phase phase = phaseRepo.findById(pId).orElseThrow(() -> new ResourceNotFoundException("Phase", pId));
        Employe auteur = empRepo.findByLogin(login).orElseThrow(() -> new ResourceNotFoundException("Employé introuvable"));
        return toResp(repo.save(Commentaire.builder().contenu(r.getContenu()).phase(phase).auteur(auteur).build()));
    }
    @Transactional(readOnly=true) public List<CommentaireResponse> getByProjet(Long pId) { return repo.findByProjetId(pId).stream().map(this::toResp).collect(Collectors.toList()); }
    @Transactional(readOnly=true) public List<CommentaireResponse> getByPhase(Long pId) { return repo.findByPhaseId(pId).stream().map(this::toResp).collect(Collectors.toList()); }
    public void delete(Long id) { repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Commentaire", id)); repo.deleteById(id); }
    private CommentaireResponse toResp(Commentaire c) { CommentaireResponse r = new CommentaireResponse(); r.setId(c.getId()); r.setContenu(c.getContenu()); r.setDateCreation(c.getDateCreation()); if (c.getAuteur()!=null){r.setAuteurNom(c.getAuteur().getNom()); r.setAuteurPrenom(c.getAuteur().getPrenom());} if (c.getProjet()!=null) r.setProjetId(c.getProjet().getId()); if (c.getPhase()!=null) r.setPhaseId(c.getPhase().getId()); return r; }
}
