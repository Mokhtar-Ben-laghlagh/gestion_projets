package ma.fstg.gestionprojets.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.LivrableRequest;
import ma.fstg.gestionprojets.dto.response.LivrableResponse;
import ma.fstg.gestionprojets.services.LivrableService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Livrables")
public class LivrableController {
    private final LivrableService service;

    @PostMapping("/api/phases/{phaseId}/livrables")
    @Operation(summary = "Créer un livrable")
    public ResponseEntity<LivrableResponse> create(@PathVariable Long phaseId, @Valid @RequestBody LivrableRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(phaseId, r));
    }

    @GetMapping("/api/livrables")
    @Operation(summary = "Tous les livrables autorisés")
    public ResponseEntity<List<LivrableResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/api/phases/{phaseId}/livrables")
    @Operation(summary = "Livrables d'une phase")
    public ResponseEntity<List<LivrableResponse>> getByPhase(@PathVariable Long phaseId) {
        return ResponseEntity.ok(service.getByPhase(phaseId));
    }

    @GetMapping("/api/livrables/{id}")
    @Operation(summary = "Détail livrable")
    public ResponseEntity<LivrableResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/api/livrables/{id}")
    @Operation(summary = "Modifier livrable")
    public ResponseEntity<LivrableResponse> update(@PathVariable Long id, @Valid @RequestBody LivrableRequest r) {
        return ResponseEntity.ok(service.update(id, r));
    }

    @DeleteMapping("/api/livrables/{id}")
    @Operation(summary = "Supprimer livrable")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
