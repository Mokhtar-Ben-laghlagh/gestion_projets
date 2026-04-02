package ma.fstg.gestionprojets.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.OrganismeRequest;
import ma.fstg.gestionprojets.dto.response.OrganismeResponse;
import ma.fstg.gestionprojets.services.OrganismeService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organismes")
@RequiredArgsConstructor
@Tag(name = "Organismes")
public class OrganismeController {
    private final OrganismeService service;

    @PostMapping
    @Operation(summary = "Créer un organisme")
    public ResponseEntity<OrganismeResponse> create(@Valid @RequestBody OrganismeRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(r));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier")
    public ResponseEntity<OrganismeResponse> update(@PathVariable Long id, @Valid @RequestBody OrganismeRequest r) {
        return ResponseEntity.ok(service.update(id, r));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir par id")
    public ResponseEntity<OrganismeResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    @Operation(summary = "Lister")
    public ResponseEntity<List<OrganismeResponse>> getAll(@RequestParam(required = false) String nom) {
        return ResponseEntity.ok(nom != null ? service.searchByNom(nom) : service.getAll());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
