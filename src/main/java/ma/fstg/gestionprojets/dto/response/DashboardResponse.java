package ma.fstg.gestionprojets.dto.response;

import lombok.Data;

import java.time.LocalDate;
import java.util.Map;

@Data
public class DashboardResponse {
    private LocalDate date;
    private long totalProjets;
    private long projetsEnCours;
    private long projetsClotures;
    private long totalPhases;
    private long phasesTerminees;
    private long phasesTermineesNonFacturees;
    private long phasesFactureesNonPayees;
    private long phasesPayees;
    private long totalEmployes;
    private long totalOrganismes;
    private double montantTotalFacture;
    private double montantTotalPaye;
}
