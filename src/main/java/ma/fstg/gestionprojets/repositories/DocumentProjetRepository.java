package ma.fstg.gestionprojets.repositories;

import ma.fstg.gestionprojets.entities.DocumentProjet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentProjetRepository extends JpaRepository<DocumentProjet, Long> {
    List<DocumentProjet> findByProjetId(Long projetId);

    List<DocumentProjet> findByTypeDocument(String type);

    @Query("SELECT d FROM DocumentProjet d WHERE d.projet.chefProjet.login = :login")
    List<DocumentProjet> fetchDocumentsForChef(@Param("login") String login);

    @Query("SELECT DISTINCT d FROM DocumentProjet d JOIN d.projet proj JOIN proj.phases ph JOIN ph.affectations a WHERE a.employe.login = :login")
    List<DocumentProjet> fetchDocumentsForEmploye(@Param("login") String login);
}
