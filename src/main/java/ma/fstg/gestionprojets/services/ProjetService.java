package ma.fstg.gestionprojets.services;
import ma.fstg.gestionprojets.dto.request.ProjetRequest;
import ma.fstg.gestionprojets.dto.response.*;
import java.util.List;
public interface ProjetService {
    ProjetResponse create(ProjetRequest req);
    ProjetResponse update(Long id, ProjetRequest req);
    ProjetResponse getById(Long id);
    List<ProjetResponse> getAll();
    ProjetResumeResponse getResume(Long id);
    List<ProjetResponse> getEnCours();
    List<ProjetResponse> getClotures();
    void delete(Long id);
}
