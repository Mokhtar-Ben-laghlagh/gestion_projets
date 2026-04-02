package ma.fstg.gestionprojets.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponse {
    private Long id;
    private String message;
    private String type;
    private Boolean lue;
    private LocalDateTime dateCreation;
}
