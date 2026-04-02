package ma.fstg.gestionprojets.dto.response;

import lombok.Data;

@Data
public class ProfilResponse {
    private Long id;
    private String code;
    private String libelle;
    private String description;
}
