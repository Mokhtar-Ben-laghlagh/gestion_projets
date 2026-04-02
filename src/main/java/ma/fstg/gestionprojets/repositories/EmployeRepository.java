package ma.fstg.gestionprojets.repositories;

import ma.fstg.gestionprojets.entities.Employe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeRepository extends JpaRepository<Employe, Long> {
    Optional<Employe> findByLogin(String login);

    Optional<Employe> findByMatricule(String matricule);

    Optional<Employe> findByEmail(String email);

    boolean existsByLogin(String login);

    boolean existsByMatricule(String matricule);

    boolean existsByEmail(String email);

    List<Employe> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);

    List<Employe> findByProfilId(Long profilId);

    List<Employe> findByActifTrue();

    @Query("SELECT e FROM Employe e WHERE e.id NOT IN (SELECT a.employe.id FROM Affectation a WHERE NOT (a.dateFin < :debut OR a.dateDebut > :fin))")
    List<Employe> findDisponibles(@Param("debut") LocalDate debut, @Param("fin") LocalDate fin);
}
