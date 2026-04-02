package ma.fstg.gestionprojets.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.FactureRequest;
import ma.fstg.gestionprojets.dto.response.FactureResponse;
import ma.fstg.gestionprojets.services.FactureService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Factures")
public class FactureController {
    private final FactureService service;

    @PostMapping("/api/phases/{phaseId}/facture")
    @Operation(summary = "Facturer une phase")
    public ResponseEntity<FactureResponse> create(@PathVariable Long phaseId, @Valid @RequestBody FactureRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(phaseId, r));
    }

    @GetMapping("/api/factures")
    @Operation(summary = "Toutes les factures")
    public ResponseEntity<List<FactureResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/api/factures/{id}")
    @Operation(summary = "Détail facture")
    public ResponseEntity<FactureResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/api/factures/{id}")
    @Operation(summary = "Modifier facture")
    public ResponseEntity<FactureResponse> update(@PathVariable Long id, @Valid @RequestBody FactureRequest r) {
        return ResponseEntity.ok(service.update(id, r));
    }

    @DeleteMapping("/api/factures/{id}")
    @Operation(summary = "Supprimer facture")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
