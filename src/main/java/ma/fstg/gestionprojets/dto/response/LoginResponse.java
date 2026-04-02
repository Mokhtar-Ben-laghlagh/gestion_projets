package ma.fstg.gestionprojets.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String login;
    private String nom;
    private String prenom;
    private String profil;
    private Long employeId;
}
