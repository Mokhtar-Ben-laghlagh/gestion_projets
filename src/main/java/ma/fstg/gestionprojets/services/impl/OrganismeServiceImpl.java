package ma.fstg.gestionprojets.services.impl;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.OrganismeRequest;
import ma.fstg.gestionprojets.dto.response.OrganismeResponse;
import ma.fstg.gestionprojets.entities.Organisme;
import ma.fstg.gestionprojets.exceptions.*;
import ma.fstg.gestionprojets.repositories.OrganismeRepository;
import ma.fstg.gestionprojets.services.OrganismeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional
public class OrganismeServiceImpl implements OrganismeService {
    private final OrganismeRepository repo;

    public OrganismeResponse create(OrganismeRequest r) {
        if (repo.existsByCode(r.getCode())) throw new DuplicateResourceException("Code organisme '" + r.getCode() + "' déjà existant.");
        return toResp(repo.save(toEntity(r)));
    }
    public OrganismeResponse update(Long id, OrganismeRequest r) {
        Organisme o = find(id);
        if (!o.getCode().equals(r.getCode()) && repo.existsByCode(r.getCode())) throw new DuplicateResourceException("Code déjà utilisé.");
        o.setCode(r.getCode()); o.setNom(r.getNom()); o.setAdresse(r.getAdresse()); o.setTelephone(r.getTelephone());
        o.setNomContact(r.getNomContact()); o.setEmailContact(r.getEmailContact()); o.setSiteWeb(r.getSiteWeb());
        o.setSecteurActivite(r.getSecteurActivite()); o.setPays(r.getPays());
        return toResp(repo.save(o));
    }
    @Transactional(readOnly = true) public OrganismeResponse getById(Long id) { return toResp(find(id)); }
    @Transactional(readOnly = true) public List<OrganismeResponse> getAll() { return repo.findAll().stream().map(this::toResp).collect(Collectors.toList()); }
    @Transactional(readOnly = true) public List<OrganismeResponse> searchByNom(String n) { return repo.findByNomContainingIgnoreCase(n).stream().map(this::toResp).collect(Collectors.toList()); }
    public void delete(Long id) { find(id); repo.deleteById(id); }

    private Organisme find(Long id) { return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Organisme", id)); }
    private Organisme toEntity(OrganismeRequest r) { return Organisme.builder().code(r.getCode()).nom(r.getNom()).adresse(r.getAdresse()).telephone(r.getTelephone()).nomContact(r.getNomContact()).emailContact(r.getEmailContact()).siteWeb(r.getSiteWeb()).secteurActivite(r.getSecteurActivite()).pays(r.getPays()).build(); }
    public OrganismeResponse toResp(Organisme o) { OrganismeResponse r = new OrganismeResponse(); r.setId(o.getId()); r.setCode(o.getCode()); r.setNom(o.getNom()); r.setAdresse(o.getAdresse()); r.setTelephone(o.getTelephone()); r.setNomContact(o.getNomContact()); r.setEmailContact(o.getEmailContact()); r.setSiteWeb(o.getSiteWeb()); r.setSecteurActivite(o.getSecteurActivite()); r.setPays(o.getPays()); r.setNombreProjets(o.getProjets() != null ? o.getProjets().size() : 0); return r; }
}
