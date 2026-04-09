package ma.fstg.gestionprojets.services;
import ma.fstg.gestionprojets.dto.request.LivrableRequest;
import ma.fstg.gestionprojets.dto.response.LivrableResponse;
import java.util.List;
public interface LivrableService {
    LivrableResponse create(Long phaseId, LivrableRequest req);
    LivrableResponse update(Long id, LivrableRequest req);
    LivrableResponse getById(Long id);
    List<LivrableResponse> getByPhase(Long phaseId);
    List<LivrableResponse> getAll();
    void delete(Long id);
}
