package ma.fstg.gestionprojets.repositories;

import ma.fstg.gestionprojets.entities.Facture;
import ma.fstg.gestionprojets.entities.StatutFacture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    Optional<Facture> findByPhaseId(Long phaseId);

    boolean existsByPhaseId(Long phaseId);

    boolean existsByCode(String code);

    List<Facture> findByStatut(StatutFacture statut);
}
