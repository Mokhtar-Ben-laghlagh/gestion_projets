package ma.fstg.gestionprojets.services.impl;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.FactureRequest;
import ma.fstg.gestionprojets.dto.response.FactureResponse;
import ma.fstg.gestionprojets.entities.*;
import ma.fstg.gestionprojets.exceptions.*;
import ma.fstg.gestionprojets.repositories.*;
import ma.fstg.gestionprojets.services.FactureService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor @Transactional
public class FactureServiceImpl implements FactureService {
    private final FactureRepository repo;
    private final PhaseRepository phaseRepo;
    public FactureResponse create(Long phaseId, FactureRequest r) {
        Phase phase = phaseRepo.findById(phaseId).orElseThrow(() -> new ResourceNotFoundException("Phase", phaseId));
        if (!Boolean.TRUE.equals(phase.getEtatRealisation())) throw new BusinessException("La phase doit être réalisée avant facturation.");
        if (repo.existsByPhaseId(phaseId)) throw new DuplicateResourceException("Cette phase est déjà facturée.");
        if (repo.existsByCode(r.getCode())) throw new DuplicateResourceException("Code facture '" + r.getCode() + "' déjà existant.");
        phase.setEtatFacturation(true); phaseRepo.save(phase);
        Facture f = Facture.builder().code(r.getCode()).dateFacture(r.getDateFacture()).montant(r.getMontant() != null ? r.getMontant() : phase.getMontant()).reference(r.getReference()).statut(StatutFacture.EMISE).phase(phase).build();
        return toResp(repo.save(f));
    }
    public FactureResponse update(Long id, FactureRequest r) { Facture f = find(id); f.setCode(r.getCode()); f.setDateFacture(r.getDateFacture()); if (r.getMontant()!=null) f.setMontant(r.getMontant()); if (r.getReference()!=null) f.setReference(r.getReference()); return toResp(repo.save(f)); }
    @Transactional(readOnly=true) public FactureResponse getById(Long id) { return toResp(find(id)); }
    @Transactional(readOnly=true) public List<FactureResponse> getAll() { return repo.findAll().stream().map(this::toResp).collect(Collectors.toList()); }
    public void delete(Long id) { find(id); repo.deleteById(id); }
    private Facture find(Long id) { return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Facture", id)); }
    private FactureResponse toResp(Facture f) { FactureResponse r = new FactureResponse(); r.setId(f.getId()); r.setCode(f.getCode()); r.setDateFacture(f.getDateFacture()); r.setDatePaiement(f.getDatePaiement()); r.setMontant(f.getMontant()); r.setReference(f.getReference()); r.setStatut(f.getStatut()!=null?f.getStatut().name():null); if (f.getPhase()!=null){r.setPhaseId(f.getPhase().getId()); r.setPhaseLibelle(f.getPhase().getLibelle()); if(f.getPhase().getProjet()!=null){r.setProjetNom(f.getPhase().getProjet().getNom()); if(f.getPhase().getProjet().getOrganisme()!=null) r.setOrganismeNom(f.getPhase().getProjet().getOrganisme().getNom());}} return r; }
}
