package ma.fstg.gestionprojets.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "affectations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Affectation {
    @EmbeddedId
    private AffectationId id;
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("employeId")
    @JoinColumn(name = "employe_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Employe employe;
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("phaseId")
    @JoinColumn(name = "phase_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Phase phase;
    @Column(nullable = false)
    private LocalDate dateDebut;
    @Column(nullable = false)
    private LocalDate dateFin;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(length = 100)
    private String role;
    @Column(length = 50)
    private String statut;
}
