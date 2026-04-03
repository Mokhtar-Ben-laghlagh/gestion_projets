package ma.fstg.gestionprojets.services;
import ma.fstg.gestionprojets.dto.request.FactureRequest;
import ma.fstg.gestionprojets.dto.response.FactureResponse;
import java.util.List;
public interface FactureService {
    FactureResponse create(Long phaseId, FactureRequest req);
    FactureResponse update(Long id, FactureRequest req);
    FactureResponse getById(Long id);
    List<FactureResponse> getAll();
    void delete(Long id);
}
