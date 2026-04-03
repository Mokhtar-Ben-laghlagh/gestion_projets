package ma.fstg.gestionprojets.services.impl;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.response.*;
import ma.fstg.gestionprojets.repositories.*;
import ma.fstg.gestionprojets.services.ReportingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor @Transactional(readOnly=true)
public class ReportingServiceImpl implements ReportingService {
    private final PhaseRepository phaseRepo;
    private final ProjetRepository projetRepo;
    private final EmployeRepository empRepo;
    private final OrganismeRepository orgRepo;
    private final PhaseServiceImpl phaseService;
    private final ProjetServiceImpl projetService;
    public DashboardResponse getDashboard() {
        DashboardResponse d = new DashboardResponse();
        d.setDate(LocalDate.now());
        d.setTotalProjets(projetRepo.count());
        d.setProjetsEnCours(projetRepo.findEnCours(LocalDate.now()).size());
        d.setProjetsClotures(projetRepo.findClotures(LocalDate.now()).size());
        d.setTotalPhases(phaseRepo.count());
        var termineesNonFact = phaseRepo.findByEtatRealisationTrueAndEtatFacturationFalse();
        var factureesNonPay = phaseRepo.findByEtatFacturationTrueAndEtatPaiementFalse();
        var payees = phaseRepo.findByEtatPaiementTrue();
        d.setPhasesTermineesNonFacturees(termineesNonFact.size());
        d.setPhasesFactureesNonPayees(factureesNonPay.size());
        d.setPhasesPayees(payees.size());
        d.setPhasesTerminees(termineesNonFact.size() + factureesNonPay.size() + payees.size());
        d.setTotalEmployes(empRepo.count());
        d.setTotalOrganismes(orgRepo.count());
        d.setMontantTotalFacture(phaseRepo.findByEtatFacturationTrueAndEtatPaiementFalse().stream().mapToDouble(p -> p.getMontant()!=null?p.getMontant():0).sum() + payees.stream().mapToDouble(p -> p.getMontant()!=null?p.getMontant():0).sum());
        d.setMontantTotalPaye(payees.stream().mapToDouble(p -> p.getMontant()!=null?p.getMontant():0).sum());
        return d;
    }
    public List<PhaseResponse> getPhasesTermineesNonFacturees() { return phaseRepo.findByEtatRealisationTrueAndEtatFacturationFalse().stream().map(phaseService::toResponse).collect(Collectors.toList()); }
    public List<PhaseResponse> getPhasesFactureesNonPayees() { return phaseRepo.findByEtatFacturationTrueAndEtatPaiementFalse().stream().map(phaseService::toResponse).collect(Collectors.toList()); }
    public List<PhaseResponse> getPhasesPayees() { return phaseRepo.findByEtatPaiementTrue().stream().map(phaseService::toResponse).collect(Collectors.toList()); }
    public List<ProjetResponse> getProjetsEnCours() { return projetRepo.findEnCours(LocalDate.now()).stream().map(projetService::toResp).collect(Collectors.toList()); }
    public List<ProjetResponse> getProjetsClotures() { return projetRepo.findClotures(LocalDate.now()).stream().map(projetService::toResp).collect(Collectors.toList()); }
}
