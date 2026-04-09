package ma.fstg.gestionprojets.repositories;

import ma.fstg.gestionprojets.entities.Livrable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LivrableRepository extends JpaRepository<Livrable, Long> {
    List<Livrable> findByPhaseId(Long phaseId);

    List<Livrable> findByPhaseIdAndValideTrue(Long phaseId);

    @Query("SELECT l FROM Livrable l WHERE l.phase.projet.chefProjet.login = :login")
    List<Livrable> fetchLivrablesForChef(@Param("login") String login);

    @Query("SELECT DISTINCT l FROM Livrable l JOIN l.phase p JOIN p.affectations a WHERE a.employe.login = :login")
    List<Livrable> fetchLivrablesForEmploye(@Param("login") String login);
}
