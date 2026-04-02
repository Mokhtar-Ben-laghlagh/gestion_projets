package ma.fstg.gestionprojets.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "commentaires")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Commentaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenu;
    @Builder.Default
    private LocalDateTime dateCreation = LocalDateTime.now();
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auteur_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Employe auteur;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projet_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Projet projet;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phase_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Phase phase;
}
