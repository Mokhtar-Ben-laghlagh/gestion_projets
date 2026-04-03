package ma.fstg.gestionprojets.services.impl;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.response.NotificationResponse;
import ma.fstg.gestionprojets.entities.*;
import ma.fstg.gestionprojets.exceptions.ResourceNotFoundException;
import ma.fstg.gestionprojets.repositories.*;
import ma.fstg.gestionprojets.services.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor @Transactional
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository repo;
    private final EmployeRepository empRepo;
    @Transactional(readOnly=true) public List<NotificationResponse> getByEmploye(Long eId) { return repo.findByDestinataireId(eId).stream().map(this::toResp).collect(Collectors.toList()); }
    @Transactional(readOnly=true) public List<NotificationResponse> getNonLues(Long eId) { return repo.findByDestinataireIdAndLueFalse(eId).stream().map(this::toResp).collect(Collectors.toList()); }
    public void marquerLue(Long id) { Notification n = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Notification", id)); n.setLue(true); repo.save(n); }
    public void marquerToutesLues(Long eId) { repo.findByDestinataireIdAndLueFalse(eId).forEach(n -> { n.setLue(true); repo.save(n); }); }
    @Transactional(readOnly=true) public long countNonLues(Long eId) { return repo.countByDestinataireIdAndLueFalse(eId); }
    public void creer(Long eId, String msg, String type) { Employe e = empRepo.findById(eId).orElseThrow(() -> new ResourceNotFoundException("Employé", eId)); repo.save(Notification.builder().message(msg).type(type).lue(false).destinataire(e).build()); }
    private NotificationResponse toResp(Notification n) { NotificationResponse r = new NotificationResponse(); r.setId(n.getId()); r.setMessage(n.getMessage()); r.setType(n.getType()); r.setLue(n.getLue()); r.setDateCreation(n.getDateCreation()); return r; }
}
