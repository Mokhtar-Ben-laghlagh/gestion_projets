package ma.fstg.gestionprojets.mappers;

import ma.fstg.gestionprojets.dto.response.NotificationResponse;
import ma.fstg.gestionprojets.entities.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationResponse toResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setMessage(notification.getMessage());
        response.setType(notification.getType());
        response.setLue(notification.getLue());
        response.setDateCreation(notification.getDateCreation());
        return response;
    }
}
