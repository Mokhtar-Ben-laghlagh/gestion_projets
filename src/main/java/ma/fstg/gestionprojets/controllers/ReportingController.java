package ma.fstg.gestionprojets.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.response.*;
import ma.fstg.gestionprojets.services.ReportingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reporting")
@RequiredArgsConstructor
@Tag(name = "Reporting")
public class ReportingController {
    private final ReportingService service;

    @GetMapping("/tableau-de-bord")
    @Operation(summary = "Dashboard global")
    public ResponseEntity<DashboardResponse> dashboard() {
        return ResponseEntity.ok(service.getDashboard());
    }

    @GetMapping("/phases/terminees-non-facturees")
    @Operation(summary = "Phases terminées non facturées")
    public ResponseEntity<List<PhaseResponse>> termineesNonFacturees() {
        return ResponseEntity.ok(service.getPhasesTermineesNonFacturees());
    }

    @GetMapping("/phases/facturees-non-payees")
    @Operation(summary = "Phases facturées non payées")
    public ResponseEntity<List<PhaseResponse>> factureesNonPayees() {
        return ResponseEntity.ok(service.getPhasesFactureesNonPayees());
    }

    @GetMapping("/phases/payees")
    @Operation(summary = "Phases payées")
    public ResponseEntity<List<PhaseResponse>> payees() {
        return ResponseEntity.ok(service.getPhasesPayees());
    }

    @GetMapping("/projets/en-cours")
    @Operation(summary = "Projets en cours")
    public ResponseEntity<List<ProjetResponse>> enCours() {
        return ResponseEntity.ok(service.getProjetsEnCours());
    }

    @GetMapping("/projets/clotures")
    @Operation(summary = "Projets clôturés")
    public ResponseEntity<List<ProjetResponse>> clotures() {
        return ResponseEntity.ok(service.getProjetsClotures());
    }
}
