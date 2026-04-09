package ma.fstg.gestionprojets.repositories;

import ma.fstg.gestionprojets.entities.Phase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhaseRepository extends JpaRepository<Phase, Long> {
    List<Phase> findByProjetId(Long projetId);

    List<Phase> findByEtatRealisationTrueAndEtatFacturationFalse();

    List<Phase> findByEtatFacturationTrueAndEtatPaiementFalse();

    List<Phase> findByEtatPaiementTrue();

    boolean existsByCodeAndProjetId(String code, Long projetId);

    @Query("SELECT COALESCE(SUM(p.montant),0) FROM Phase p WHERE p.projet.id = :id")
    Double sumMontantByProjetId(@Param("id") Long id);

    @Query("SELECT p FROM Phase p WHERE p.projet.chefProjet.login = :login")
    List<Phase> fetchPhasesForChef(@Param("login") String login);

    @Query("SELECT DISTINCT p FROM Phase p JOIN p.affectations a WHERE a.employe.login = :login")
    List<Phase> fetchPhasesForEmploye(@Param("login") String login);
}
