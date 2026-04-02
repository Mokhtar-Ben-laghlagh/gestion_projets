package ma.fstg.gestionprojets.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.CommentaireRequest;
import ma.fstg.gestionprojets.dto.response.CommentaireResponse;
import ma.fstg.gestionprojets.services.CommentaireService;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Commentaires")
public class CommentaireController {
    private final CommentaireService service;

    @PostMapping("/api/projets/{id}/commentaires")
    @Operation(summary = "Commenter un projet")
    public ResponseEntity<CommentaireResponse> forProjet(@PathVariable Long id, @AuthenticationPrincipal UserDetails u, @Valid @RequestBody CommentaireRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createForProjet(id, u.getUsername(), r));
    }

    @PostMapping("/api/phases/{id}/commentaires")
    @Operation(summary = "Commenter une phase")
    public ResponseEntity<CommentaireResponse> forPhase(@PathVariable Long id, @AuthenticationPrincipal UserDetails u, @Valid @RequestBody CommentaireRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createForPhase(id, u.getUsername(), r));
    }

    @GetMapping("/api/projets/{id}/commentaires")
    @Operation(summary = "Commentaires d'un projet")
    public ResponseEntity<List<CommentaireResponse>> byProjet(@PathVariable Long id) {
        return ResponseEntity.ok(service.getByProjet(id));
    }

    @GetMapping("/api/phases/{id}/commentaires")
    @Operation(summary = "Commentaires d'une phase")
    public ResponseEntity<List<CommentaireResponse>> byPhase(@PathVariable Long id) {
        return ResponseEntity.ok(service.getByPhase(id));
    }

    @DeleteMapping("/api/commentaires/{id}")
    @Operation(summary = "Supprimer commentaire")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
