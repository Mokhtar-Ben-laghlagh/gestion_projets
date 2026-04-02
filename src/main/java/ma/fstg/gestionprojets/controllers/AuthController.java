package ma.fstg.gestionprojets.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.*;
import ma.fstg.gestionprojets.dto.response.*;
import ma.fstg.gestionprojets.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentification")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Connexion et obtention du token JWT")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/me")
    @Operation(summary = "Utilisateur connecté")
    public ResponseEntity<EmployeResponse> me(@AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(authService.getMe(u.getUsername()));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Changer mot de passe")
    public ResponseEntity<Void> changePassword(@AuthenticationPrincipal UserDetails u, @Valid @RequestBody ChangePasswordRequest req) {
        authService.changePassword(u.getUsername(), req);
        return ResponseEntity.noContent().build();
    }
}
