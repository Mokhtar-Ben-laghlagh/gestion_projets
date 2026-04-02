package ma.fstg.gestionprojets.repositories;

import ma.fstg.gestionprojets.entities.Organisme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganismeRepository extends JpaRepository<Organisme, Long> {
    Optional<Organisme> findByCode(String code);

    boolean existsByCode(String code);

    List<Organisme> findByNomContainingIgnoreCase(String nom);

    List<Organisme> findByNomContactContainingIgnoreCase(String contact);

    List<Organisme> findBySecteurActivite(String secteur);
}
