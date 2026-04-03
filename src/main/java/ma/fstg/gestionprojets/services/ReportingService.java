package ma.fstg.gestionprojets.services;
import ma.fstg.gestionprojets.dto.response.*;
import java.util.List;
public interface ReportingService {
    DashboardResponse getDashboard();
    List<PhaseResponse> getPhasesTermineesNonFacturees();
    List<PhaseResponse> getPhasesFactureesNonPayees();
    List<PhaseResponse> getPhasesPayees();
    List<ProjetResponse> getProjetsEnCours();
    List<ProjetResponse> getProjetsClotures();
}
