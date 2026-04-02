package ma.fstg.gestionprojets.repositories;

import ma.fstg.gestionprojets.entities.Projet;
import ma.fstg.gestionprojets.entities.StatutProjet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjetRepository extends JpaRepository<Projet, Long> {
    Optional<Projet> findByCode(String code);

    boolean existsByCode(String code);

    List<Projet> findByOrganismeId(Long orgId);

    List<Projet> findByChefProjetId(Long chefId);

    List<Projet> findByStatut(StatutProjet statut);

    List<Projet> findByNomContainingIgnoreCase(String nom);

    @Query("SELECT p FROM Projet p WHERE p.dateFin >= :today AND p.statut = 'EN_COURS'")
    List<Projet> findEnCours(@Param("today") LocalDate today);

    @Query("SELECT p FROM Projet p WHERE p.dateFin < :today OR p.statut = 'CLOTURE'")
    List<Projet> findClotures(@Param("today") LocalDate today);
}
