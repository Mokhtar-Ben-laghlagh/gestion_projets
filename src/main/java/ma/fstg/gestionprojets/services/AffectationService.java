package ma.fstg.gestionprojets.services;
import ma.fstg.gestionprojets.dto.request.AffectationRequest;
import ma.fstg.gestionprojets.dto.response.AffectationResponse;
import java.util.List;
public interface AffectationService {
    AffectationResponse create(Long phaseId, Long employeId, AffectationRequest req);
    AffectationResponse update(Long phaseId, Long employeId, AffectationRequest req);
    AffectationResponse getOne(Long phaseId, Long employeId);
    List<AffectationResponse> getByPhase(Long phaseId);
    List<AffectationResponse> getByEmploye(Long employeId);
    List<AffectationResponse> getAll();
    void delete(Long phaseId, Long employeId);
}
