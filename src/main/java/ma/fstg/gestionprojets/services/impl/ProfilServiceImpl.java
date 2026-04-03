package ma.fstg.gestionprojets.services.impl;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.ProfilRequest;
import ma.fstg.gestionprojets.dto.response.ProfilResponse;
import ma.fstg.gestionprojets.entities.Profil;
import ma.fstg.gestionprojets.exceptions.*;
import ma.fstg.gestionprojets.repositories.ProfilRepository;
import ma.fstg.gestionprojets.services.ProfilService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional
public class ProfilServiceImpl implements ProfilService {
    private final ProfilRepository repo;

    public ProfilResponse create(ProfilRequest r) {
        if (repo.existsByCode(r.getCode())) throw new DuplicateResourceException("Code profil '" + r.getCode() + "' déjà existant.");
        return toResp(repo.save(Profil.builder().code(r.getCode()).libelle(r.getLibelle()).description(r.getDescription()).build()));
    }
    public ProfilResponse update(Long id, ProfilRequest r) {
        Profil p = findById(id); p.setCode(r.getCode()); p.setLibelle(r.getLibelle()); p.setDescription(r.getDescription());
        return toResp(repo.save(p));
    }
    @Transactional(readOnly = true) public ProfilResponse getById(Long id) { return toResp(findById(id)); }
    @Transactional(readOnly = true) public List<ProfilResponse> getAll() { return repo.findAll().stream().map(this::toResp).collect(Collectors.toList()); }
    public void delete(Long id) { findById(id); repo.deleteById(id); }

    private Profil findById(Long id) { return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Profil", id)); }
    public ProfilResponse toResp(Profil p) { ProfilResponse r = new ProfilResponse(); r.setId(p.getId()); r.setCode(p.getCode()); r.setLibelle(p.getLibelle()); r.setDescription(p.getDescription()); return r; }
}
