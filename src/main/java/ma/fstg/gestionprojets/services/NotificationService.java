package ma.fstg.gestionprojets.services;
import ma.fstg.gestionprojets.dto.response.NotificationResponse;
import java.util.List;
public interface NotificationService {
    List<NotificationResponse> getByEmploye(Long employeId);
    List<NotificationResponse> getNonLues(Long employeId);
    void marquerLue(Long id);
    void marquerToutesLues(Long employeId);
    long countNonLues(Long employeId);
    void creer(Long employeId, String message, String type);
}
