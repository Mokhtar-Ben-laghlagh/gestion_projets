package ma.fstg.gestionprojets.repositories;

import ma.fstg.gestionprojets.entities.Profil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfilRepository extends JpaRepository<Profil, Long> {
    Optional<Profil> findByCode(String code);

    boolean existsByCode(String code);
}
