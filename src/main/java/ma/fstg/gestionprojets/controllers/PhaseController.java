package ma.fstg.gestionprojets.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.*;
import ma.fstg.gestionprojets.dto.response.PhaseResponse;
import ma.fstg.gestionprojets.services.PhaseService;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Phases")
public class PhaseController {
    private final PhaseService service;

    @PostMapping("/api/projets/{projetId}/phases")
    @Operation(summary = "Créer une phase")
    public ResponseEntity<PhaseResponse> create(@PathVariable Long projetId, @Valid @RequestBody PhaseRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(projetId, r));
    }

    @GetMapping("/api/projets/{projetId}/phases")
    @Operation(summary = "Phases d'un projet")
    public ResponseEntity<List<PhaseResponse>> getByProjet(@PathVariable Long projetId) {
        return ResponseEntity.ok(service.getByProjet(projetId));
    }

    @GetMapping("/api/phases/me")
    @Operation(summary = "Phases assignées à l'employé connecté")
    public ResponseEntity<List<PhaseResponse>> getMyPhases(Principal principal) {
        // 'principal.getName()' renvoie le champ 'login' de l'utilisateur connecté via JWT
        return ResponseEntity.ok(service.getMyPhases(principal.getName()));
    }

    @GetMapping("/api/phases")
    @Operation(summary = "Toutes les phases autorisées")
    public ResponseEntity<List<PhaseResponse>> getAllPhasesGlobally() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/api/phases/all")
    @Operation(summary = "Toutes les phases existantes (Admin seulement)")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'ADMIN', 'CHEF_PROJET', 'DIRECTEUR')")
    public ResponseEntity<List<PhaseResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/api/phases/{id}")
    @Operation(summary = "Obtenir une phase")
    public ResponseEntity<PhaseResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/api/phases/{id}")
    @Operation(summary = "Modifier une phase")
    public ResponseEntity<PhaseResponse> update(@PathVariable Long id, @Valid @RequestBody PhaseRequest r) {
        return ResponseEntity.ok(service.update(id, r));
    }

    @DeleteMapping("/api/phases/{id}")
    @Operation(summary = "Supprimer une phase")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/api/phases/{id}/realisation")
    @Operation(summary = "État réalisation")
    public ResponseEntity<PhaseResponse> realisation(@PathVariable Long id, @RequestBody EtatRequest r) {
        return ResponseEntity.ok(service.updateRealisation(id, Boolean.TRUE.equals(r.getEtat())));
    }

    @PatchMapping("/api/phases/{id}/facturation")
    @Operation(summary = "État facturation")
    public ResponseEntity<PhaseResponse> facturation(@PathVariable Long id, @RequestBody EtatRequest r) {
        return ResponseEntity.ok(service.updateFacturation(id, Boolean.TRUE.equals(r.getEtat())));
    }

    @PatchMapping("/api/phases/{id}/paiement")
    @Operation(summary = "État paiement")
    public ResponseEntity<PhaseResponse> paiement(@PathVariable Long id, @RequestBody EtatRequest r) {
        return ResponseEntity.ok(service.updatePaiement(id, Boolean.TRUE.equals(r.getEtat())));
    }
}
