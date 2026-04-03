package ma.fstg.gestionprojets.services;
import ma.fstg.gestionprojets.dto.request.ProfilRequest;
import ma.fstg.gestionprojets.dto.response.ProfilResponse;
import java.util.List;
public interface ProfilService {
    ProfilResponse create(ProfilRequest req);
    ProfilResponse update(Long id, ProfilRequest req);
    ProfilResponse getById(Long id);
    List<ProfilResponse> getAll();
    void delete(Long id);
}
