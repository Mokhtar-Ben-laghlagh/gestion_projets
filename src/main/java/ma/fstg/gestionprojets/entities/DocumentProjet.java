package ma.fstg.gestionprojets.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents_projet")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentProjet {
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
    private String typeDocument;
    @Builder.Default
    private LocalDateTime dateAjout = LocalDateTime.now();
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projet_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Projet projet;
}
