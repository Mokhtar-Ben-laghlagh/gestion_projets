package ma.fstg.gestionprojets.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "organismes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organisme {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    @Column(unique = true, nullable = false, length = 50)
    private String code;
    @NotBlank
    @Column(nullable = false, length = 200)
    private String nom;
    @Column(length = 300)
    private String adresse;
    @Column(length = 20)
    private String telephone;
    @Column(length = 150)
    private String nomContact;
    @Email
    @Column(length = 150)
    private String emailContact;
    @Column(length = 200)
    private String siteWeb;
    @Column(length = 100)
    private String secteurActivite;
    @Column(length = 50)
    private String pays;
    @OneToMany(mappedBy = "organisme", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Projet> projets;
}
