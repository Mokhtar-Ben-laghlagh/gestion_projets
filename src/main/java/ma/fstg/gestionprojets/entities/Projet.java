package ma.fstg.gestionprojets.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "projets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Projet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    @Column(unique = true, nullable = false, length = 50)
    private String code;
    @NotBlank
    @Column(nullable = false, length = 200)
    private String nom;
    @Column(columnDefinition = "TEXT")
    private String description;
    @NotNull
    @Column(nullable = false)
    private LocalDate dateDebut;
    @NotNull
    @Column(nullable = false)
    private LocalDate dateFin;
    @NotNull
    @Column(nullable = false)
    private Double montant;
    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    @Builder.Default
    private StatutProjet statut = StatutProjet.EN_COURS;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "organisme_id", nullable = false)
    private Organisme organisme;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "chef_projet_id")
    private Employe chefProjet;
    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Phase> phases;
    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<DocumentProjet> documents;
    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Commentaire> commentaires;
}
