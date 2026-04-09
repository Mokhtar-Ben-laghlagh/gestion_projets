package ma.fstg.gestionprojets.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.AffectationRequest;
import ma.fstg.gestionprojets.dto.response.AffectationResponse;
import ma.fstg.gestionprojets.services.AffectationService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Affectations")
public class AffectationController {
    private final AffectationService service;

    @PostMapping("/api/phases/{phaseId}/employes/{employeId}")
    @Operation(summary = "Affecter un employé")
    public ResponseEntity<AffectationResponse> create(@PathVariable Long phaseId, @PathVariable Long employeId, @Valid @RequestBody AffectationRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(phaseId, employeId, r));
    }

    @GetMapping("/api/affectations")
    @Operation(summary = "Toutes les affectations autorisées")
    public ResponseEntity<List<AffectationResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/api/phases/{phaseId}/employes")
    @Operation(summary = "Employés d'une phase")
    public ResponseEntity<List<AffectationResponse>> getByPhase(@PathVariable Long phaseId) {
        return ResponseEntity.ok(service.getByPhase(phaseId));
    }

    @GetMapping("/api/phases/{phaseId}/employes/{employeId}")
    @Operation(summary = "Détail affectation")
    public ResponseEntity<AffectationResponse> getOne(@PathVariable Long phaseId, @PathVariable Long employeId) {
        return ResponseEntity.ok(service.getOne(phaseId, employeId));
    }

    @PutMapping("/api/phases/{phaseId}/employes/{employeId}")
    @Operation(summary = "Modifier affectation")
    public ResponseEntity<AffectationResponse> update(@PathVariable Long phaseId, @PathVariable Long employeId, @Valid @RequestBody AffectationRequest r) {
        return ResponseEntity.ok(service.update(phaseId, employeId, r));
    }

    @DeleteMapping("/api/phases/{phaseId}/employes/{employeId}")
    @Operation(summary = "Retirer un employé")
    public ResponseEntity<Void> delete(@PathVariable Long phaseId, @PathVariable Long employeId) {
        service.delete(phaseId, employeId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/employes/{employeId}/phases")
    @Operation(summary = "Phases d'un employé")
    public ResponseEntity<List<AffectationResponse>> getByEmploye(@PathVariable Long employeId) {
        return ResponseEntity.ok(service.getByEmploye(employeId));
    }
}
