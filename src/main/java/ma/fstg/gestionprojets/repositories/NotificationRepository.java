package ma.fstg.gestionprojets.repositories;

import ma.fstg.gestionprojets.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByDestinataireId(Long employeId);

    List<Notification> findByDestinataireIdAndLueFalse(Long employeId);

    long countByDestinataireIdAndLueFalse(Long employeId);
}
