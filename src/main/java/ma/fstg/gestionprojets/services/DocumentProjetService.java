package ma.fstg.gestionprojets.services;
import ma.fstg.gestionprojets.dto.request.DocumentProjetRequest;
import ma.fstg.gestionprojets.dto.response.DocumentProjetResponse;
import java.util.List;
public interface DocumentProjetService {
    DocumentProjetResponse create(Long projetId, DocumentProjetRequest req);
    DocumentProjetResponse update(Long id, DocumentProjetRequest req);
    DocumentProjetResponse getById(Long id);
    List<DocumentProjetResponse> getByProjet(Long projetId);
    List<DocumentProjetResponse> getAll();
    void delete(Long id);
}
