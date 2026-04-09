package ma.fstg.gestionprojets.services;
import ma.fstg.gestionprojets.dto.request.PhaseRequest;
import ma.fstg.gestionprojets.dto.response.PhaseResponse;
import ma.fstg.gestionprojets.entities.Phase;
import java.util.List;
public interface PhaseService {
    PhaseResponse create(Long projetId, PhaseRequest req);
    PhaseResponse update(Long id, PhaseRequest req);
    PhaseResponse getById(Long id);
    List<PhaseResponse> getByProjet(Long projetId);
    List<PhaseResponse> getMyPhases(String login);
    List<PhaseResponse> getAll();
    PhaseResponse updateRealisation(Long id, boolean etat);
    PhaseResponse updateFacturation(Long id, boolean etat);
    PhaseResponse updatePaiement(Long id, boolean etat);
    void delete(Long id);
    Phase findEntityById(Long id);
    PhaseResponse toResponse(Phase p);
}
