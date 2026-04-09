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

    List<Projet> findByOrganismeId(Long organismeId);
    
    // Pour l'isolation des Chefs de Projet
    @Query("SELECT p FROM Projet p WHERE p.chefProjet.login = :login")
    List<Projet> fetchProjetsForChef(@Param("login") String login);
    
    // Pour l'isolation des Employés via l'affectation sur des phases
    @Query("SELECT DISTINCT p FROM Projet p JOIN p.phases ph JOIN ph.affectations a WHERE a.employe.login = :login")
    List<Projet> fetchProjetsForEmploye(@Param("login") String login);

    List<Projet> findByChefProjetId(Long chefId);

    List<Projet> findByStatut(StatutProjet statut);

    List<Projet> findByNomContainingIgnoreCase(String nom);

    @Query("SELECT p FROM Projet p WHERE p.dateFin >= :today AND p.statut = 'EN_COURS'")
    List<Projet> findEnCours(@Param("today") LocalDate today);

    @Query("SELECT p FROM Projet p WHERE p.dateFin < :today OR p.statut = 'CLOTURE'")
    List<Projet> findClotures(@Param("today") LocalDate today);
}
