package ma.fstg.gestionprojets.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "livrables")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Livrable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    @Column(nullable = false, length = 50)
    private String code;
    @NotBlank
    @Column(nullable = false, length = 200)
    private String libelle;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(length = 500)
    private String chemin;
    @Column(length = 100)
    private String typeFichier;
    private LocalDate dateRemise;
    @Builder.Default
    private Boolean valide = false;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phase_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Phase phase;
}
