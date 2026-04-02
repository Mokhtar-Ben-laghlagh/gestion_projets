package ma.fstg.gestionprojets.repositories;

import ma.fstg.gestionprojets.entities.Affectation;
import ma.fstg.gestionprojets.entities.AffectationId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AffectationRepository extends JpaRepository<Affectation, AffectationId> {
    List<Affectation> findByPhaseId(Long phaseId);

    List<Affectation> findByEmployeId(Long employeId);
}
