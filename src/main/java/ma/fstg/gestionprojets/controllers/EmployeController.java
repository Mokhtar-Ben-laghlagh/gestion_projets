package ma.fstg.gestionprojets.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.EmployeRequest;
import ma.fstg.gestionprojets.dto.response.EmployeResponse;
import ma.fstg.gestionprojets.services.EmployeService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/employes")
@RequiredArgsConstructor
@Tag(name = "Employés")
public class EmployeController {
    private final EmployeService service;

    @PostMapping
    @Operation(summary = "Créer un employé")
    public ResponseEntity<EmployeResponse> create(@Valid @RequestBody EmployeRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(r));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier un employé")
    public ResponseEntity<EmployeResponse> update(@PathVariable Long id, @Valid @RequestBody EmployeRequest r) {
        return ResponseEntity.ok(service.update(id, r));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un employé")
    public ResponseEntity<EmployeResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    @Operation(summary = "Lister les employés")
    public ResponseEntity<List<EmployeResponse>> getAll(@RequestParam(required = false) String nom) {
        return ResponseEntity.ok(nom != null ? service.search(nom) : service.getAll());
    }

    @GetMapping("/disponibles")
    @Operation(summary = "Employés disponibles sur une période")
    public ResponseEntity<List<EmployeResponse>> disponibles(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        return ResponseEntity.ok(service.getDisponibles(dateDebut, dateFin));
    }

    @PatchMapping("/{id}/toggle-actif")
    @Operation(summary = "Activer/désactiver un employé")
    public ResponseEntity<Void> toggle(@PathVariable Long id) {
        service.toggleActif(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un employé")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
