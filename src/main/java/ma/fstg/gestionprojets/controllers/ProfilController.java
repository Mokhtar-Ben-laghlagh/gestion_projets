package ma.fstg.gestionprojets.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.ProfilRequest;
import ma.fstg.gestionprojets.dto.response.ProfilResponse;
import ma.fstg.gestionprojets.services.ProfilService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profils")
@RequiredArgsConstructor
@Tag(name = "Profils")
public class ProfilController {
    private final ProfilService service;

    @PostMapping
    @Operation(summary = "Créer un profil")
    public ResponseEntity<ProfilResponse> create(@Valid @RequestBody ProfilRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(r));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier un profil")
    public ResponseEntity<ProfilResponse> update(@PathVariable Long id, @Valid @RequestBody ProfilRequest r) {
        return ResponseEntity.ok(service.update(id, r));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un profil")
    public ResponseEntity<ProfilResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    @Operation(summary = "Lister les profils")
    public ResponseEntity<List<ProfilResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un profil")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
