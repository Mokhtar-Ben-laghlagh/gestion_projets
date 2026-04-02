package ma.fstg.gestionprojets.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.ProjetRequest;
import ma.fstg.gestionprojets.dto.response.*;
import ma.fstg.gestionprojets.services.ProjetService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projets")
@RequiredArgsConstructor
@Tag(name = "Projets")
public class ProjetController {
    private final ProjetService service;

    @PostMapping
    @Operation(summary = "Créer un projet")
    public ResponseEntity<ProjetResponse> create(@Valid @RequestBody ProjetRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(r));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier un projet")
    public ResponseEntity<ProjetResponse> update(@PathVariable Long id, @Valid @RequestBody ProjetRequest r) {
        return ResponseEntity.ok(service.update(id, r));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un projet")
    public ResponseEntity<ProjetResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    @Operation(summary = "Lister les projets")
    public ResponseEntity<List<ProjetResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}/resume")
    @Operation(summary = "Résumé complet d'un projet")
    public ResponseEntity<ProjetResumeResponse> getResume(@PathVariable Long id) {
        return ResponseEntity.ok(service.getResume(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un projet")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
