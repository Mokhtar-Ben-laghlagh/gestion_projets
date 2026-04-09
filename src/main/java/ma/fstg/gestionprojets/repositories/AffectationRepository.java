package ma.fstg.gestionprojets.repositories;

import ma.fstg.gestionprojets.entities.Affectation;
import ma.fstg.gestionprojets.entities.AffectationId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface AffectationRepository extends JpaRepository<Affectation, AffectationId> {
    List<Affectation> findByPhaseId(Long phaseId);

    List<Affectation> findByEmployeId(Long employeId);

    @Query("SELECT a FROM Affectation a WHERE a.phase.projet.chefProjet.login = :login")
    List<Affectation> fetchAffectationsForChefProjet(@Param("login") String login);

    @Query("SELECT a FROM Affectation a WHERE a.employe.login = :login")
    List<Affectation> fetchAffectationsForEmploye(@Param("login") String login);
}
