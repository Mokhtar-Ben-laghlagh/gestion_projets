package ma.fstg.gestionprojets.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "profils")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profil {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    @Column(unique = true, nullable = false, length = 50)
    private String code;
    @NotBlank
    @Column(nullable = false, length = 100)
    private String libelle;
    @Column(columnDefinition = "TEXT")
    private String description;
}
