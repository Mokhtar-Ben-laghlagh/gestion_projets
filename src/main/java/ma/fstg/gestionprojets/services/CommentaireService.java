package ma.fstg.gestionprojets.services;
import ma.fstg.gestionprojets.dto.request.CommentaireRequest;
import ma.fstg.gestionprojets.dto.response.CommentaireResponse;
import java.util.List;
public interface CommentaireService {
    CommentaireResponse createForProjet(Long projetId, String login, CommentaireRequest req);
    CommentaireResponse createForPhase(Long phaseId, String login, CommentaireRequest req);
    List<CommentaireResponse> getByProjet(Long projetId);
    List<CommentaireResponse> getByPhase(Long phaseId);
    void delete(Long id);
}
