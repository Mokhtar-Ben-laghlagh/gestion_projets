package ma.fstg.gestionprojets.entities;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AffectationId implements Serializable {
    private Long employeId;
    private Long phaseId;
}
