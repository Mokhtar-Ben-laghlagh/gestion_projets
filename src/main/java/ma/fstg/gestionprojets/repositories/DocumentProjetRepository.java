package ma.fstg.gestionprojets.repositories;

import ma.fstg.gestionprojets.entities.DocumentProjet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentProjetRepository extends JpaRepository<DocumentProjet, Long> {
    List<DocumentProjet> findByProjetId(Long projetId);

    List<DocumentProjet> findByTypeDocument(String type);
}
