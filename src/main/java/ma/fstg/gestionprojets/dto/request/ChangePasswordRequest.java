package ma.fstg.gestionprojets.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    @NotBlank
    private String ancienPassword;
    @NotBlank
    private String nouveauPassword;
}
