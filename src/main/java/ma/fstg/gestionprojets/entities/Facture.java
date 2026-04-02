package ma.fstg.gestionprojets.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "factures")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Facture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    @Column(unique = true, nullable = false, length = 50)
    private String code;
    @NotNull
    @Column(nullable = false)
    private LocalDate dateFacture;
    private LocalDate datePaiement;
    private Double montant;
    @Column(length = 50)
    private String reference;
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private StatutFacture statut = StatutFacture.EMISE;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phase_id", nullable = false, unique = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Phase phase;
}
