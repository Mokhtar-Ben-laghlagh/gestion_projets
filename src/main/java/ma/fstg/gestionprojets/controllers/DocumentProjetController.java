package ma.fstg.gestionprojets.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.DocumentProjetRequest;
import ma.fstg.gestionprojets.dto.response.DocumentProjetResponse;
import ma.fstg.gestionprojets.services.DocumentProjetService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Documents Projet")
public class DocumentProjetController {
    private final DocumentProjetService service;

    @PostMapping("/api/projets/{projetId}/documents")
    @Operation(summary = "Ajouter document")
    public ResponseEntity<DocumentProjetResponse> create(@PathVariable Long projetId, @Valid @RequestBody DocumentProjetRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(projetId, r));
    }

    @GetMapping("/api/documents")
    @Operation(summary = "Tous les documents autorisés")
    public ResponseEntity<List<DocumentProjetResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/api/projets/{projetId}/documents")
    @Operation(summary = "Documents d'un projet")
    public ResponseEntity<List<DocumentProjetResponse>> getByProjet(@PathVariable Long projetId) {
        return ResponseEntity.ok(service.getByProjet(projetId));
    }

    @GetMapping("/api/documents/{id}")
    @Operation(summary = "Détail document")
    public ResponseEntity<DocumentProjetResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/api/documents/{id}")
    @Operation(summary = "Modifier document")
    public ResponseEntity<DocumentProjetResponse> update(@PathVariable Long id, @Valid @RequestBody DocumentProjetRequest r) {
        return ResponseEntity.ok(service.update(id, r));
    }

    @DeleteMapping("/api/documents/{id}")
    @Operation(summary = "Supprimer document")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
