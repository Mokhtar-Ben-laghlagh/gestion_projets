package ma.fstg.gestionprojets.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "phases")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Phase {
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
    @NotNull
    @Column(nullable = false)
    private LocalDate dateDebut;
    @NotNull
    @Column(nullable = false)
    private LocalDate dateFin;
    @Column(nullable = false)
    private Double montant;
    @Column
    private Integer pourcentage;
    @Builder.Default
    @Column(nullable = false)
    private Boolean etatRealisation = false;
    @Builder.Default
    @Column(nullable = false)
    private Boolean etatFacturation = false;
    @Builder.Default
    @Column(nullable = false)
    private Boolean etatPaiement = false;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projet_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Projet projet;
    @OneToMany(mappedBy = "phase", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Livrable> livrables;
    @OneToMany(mappedBy = "phase", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Affectation> affectations;
    @OneToOne(mappedBy = "phase", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Facture facture;
    @OneToMany(mappedBy = "phase", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Commentaire> commentaires;
}
