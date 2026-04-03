package ma.fstg.gestionprojets.services;
import ma.fstg.gestionprojets.dto.request.EmployeRequest;
import ma.fstg.gestionprojets.dto.response.EmployeResponse;
import java.time.LocalDate;
import java.util.List;
public interface EmployeService {
    EmployeResponse create(EmployeRequest req);
    EmployeResponse update(Long id, EmployeRequest req);
    EmployeResponse getById(Long id);
    List<EmployeResponse> getAll();
    List<EmployeResponse> search(String nom);
    List<EmployeResponse> getDisponibles(LocalDate debut, LocalDate fin);
    void delete(Long id);
    void toggleActif(Long id);
}
