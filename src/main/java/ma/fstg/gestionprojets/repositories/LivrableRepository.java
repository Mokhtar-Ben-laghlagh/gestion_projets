package ma.fstg.gestionprojets.repositories;

import ma.fstg.gestionprojets.entities.Livrable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LivrableRepository extends JpaRepository<Livrable, Long> {
    List<Livrable> findByPhaseId(Long phaseId);

    List<Livrable> findByPhaseIdAndValideTrue(Long phaseId);
}
