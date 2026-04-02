package ma.fstg.gestionprojets.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.response.NotificationResponse;
import ma.fstg.gestionprojets.services.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications")
public class NotificationController {
    private final NotificationService service;

    @GetMapping("/employe/{id}")
    @Operation(summary = "Notifications d'un employé")
    public ResponseEntity<List<NotificationResponse>> getByEmploye(@PathVariable Long id) {
        return ResponseEntity.ok(service.getByEmploye(id));
    }

    @GetMapping("/employe/{id}/non-lues")
    @Operation(summary = "Notifications non lues")
    public ResponseEntity<List<NotificationResponse>> getNonLues(@PathVariable Long id) {
        return ResponseEntity.ok(service.getNonLues(id));
    }

    @GetMapping("/employe/{id}/count")
    @Operation(summary = "Nombre de notifications non lues")
    public ResponseEntity<Long> count(@PathVariable Long id) {
        return ResponseEntity.ok(service.countNonLues(id));
    }

    @PatchMapping("/{id}/lue")
    @Operation(summary = "Marquer comme lue")
    public ResponseEntity<Void> marquerLue(@PathVariable Long id) {
        service.marquerLue(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/employe/{id}/toutes-lues")
    @Operation(summary = "Marquer toutes comme lues")
    public ResponseEntity<Void> marquerToutesLues(@PathVariable Long id) {
        service.marquerToutesLues(id);
        return ResponseEntity.noContent().build();
    }
}
