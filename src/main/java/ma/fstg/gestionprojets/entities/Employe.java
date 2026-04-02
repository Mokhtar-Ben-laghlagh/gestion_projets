package ma.fstg.gestionprojets.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "employes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    @Column(unique = true, nullable = false, length = 50)
    private String matricule;
    @NotBlank
    @Column(nullable = false, length = 100)
    private String nom;
    @NotBlank
    @Column(nullable = false, length = 100)
    private String prenom;
    @Column(length = 20)
    private String telephone;
    @Email
    @Column(unique = true, length = 150)
    private String email;
    @NotBlank
    @Column(unique = true, nullable = false, length = 100)
    private String login;
    @NotBlank
    @Column(nullable = false)
    private String password;
    @Column(length = 200)
    private String adresse;
    @Column(nullable = false)
    @Builder.Default
    private Boolean actif = true;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "profil_id")
    private Profil profil;
    @OneToMany(mappedBy = "employe", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Affectation> affectations;
}
