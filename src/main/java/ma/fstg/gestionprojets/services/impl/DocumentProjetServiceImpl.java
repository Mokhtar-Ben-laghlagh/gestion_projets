package ma.fstg.gestionprojets.services.impl;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.DocumentProjetRequest;
import ma.fstg.gestionprojets.dto.response.DocumentProjetResponse;
import ma.fstg.gestionprojets.entities.*;
import ma.fstg.gestionprojets.exceptions.*;
import ma.fstg.gestionprojets.repositories.*;
import ma.fstg.gestionprojets.services.DocumentProjetService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
@Service @RequiredArgsConstructor @Transactional
public class DocumentProjetServiceImpl implements DocumentProjetService {
    private final DocumentProjetRepository repo;
    private final ProjetRepository projetRepo;
    public DocumentProjetResponse create(Long projetId, DocumentProjetRequest r) {
        Projet projet = projetRepo.findById(projetId).orElseThrow(() -> new ResourceNotFoundException("Projet", projetId));
        DocumentProjet d = DocumentProjet.builder().code(r.getCode()).libelle(r.getLibelle()).description(r.getDescription()).chemin(r.getChemin()).typeDocument(r.getTypeDocument()).projet(projet).build();
        return toResp(repo.save(d));
    }
    public DocumentProjetResponse update(Long id, DocumentProjetRequest r) { DocumentProjet d = find(id); d.setCode(r.getCode()); d.setLibelle(r.getLibelle()); d.setDescription(r.getDescription()); d.setChemin(r.getChemin()); d.setTypeDocument(r.getTypeDocument()); return toResp(repo.save(d)); }
    @Transactional(readOnly=true) public DocumentProjetResponse getById(Long id) { return toResp(find(id)); }
    @Transactional(readOnly=true) public List<DocumentProjetResponse> getByProjet(Long pId) { 
        return getAll().stream().filter(d -> d.getProjetId() != null && d.getProjetId().equals(pId)).collect(Collectors.toList()); 
    }
    
    @Transactional(readOnly = true)
    public List<DocumentProjetResponse> getAll() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String login = auth.getName();
        boolean isAdminOrDir = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRATEUR") || a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_DIRECTEUR") || a.getAuthority().equals("ROLE_SECRETAIRE") || a.getAuthority().equals("ROLE_COMPTABLE"));
        boolean isChefProjet = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CHEF_PROJET"));
        
        List<DocumentProjet> data;
        if (isAdminOrDir) {
            data = repo.findAll();
        } else if (isChefProjet) {
            data = repo.fetchDocumentsForChef(login);
        } else {
            data = repo.fetchDocumentsForEmploye(login);
        }
        return data.stream().map(this::toResp).collect(Collectors.toList());
    }

    public void delete(Long id) { find(id); repo.deleteById(id); }
    private DocumentProjet find(Long id) { return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Document", id)); }
    private DocumentProjetResponse toResp(DocumentProjet d) { DocumentProjetResponse r = new DocumentProjetResponse(); r.setId(d.getId()); r.setCode(d.getCode()); r.setLibelle(d.getLibelle()); r.setDescription(d.getDescription()); r.setChemin(d.getChemin()); r.setTypeDocument(d.getTypeDocument()); r.setDateAjout(d.getDateAjout()); if (d.getProjet()!=null){r.setProjetId(d.getProjet().getId()); r.setProjetNom(d.getProjet().getNom());} return r; }
}
