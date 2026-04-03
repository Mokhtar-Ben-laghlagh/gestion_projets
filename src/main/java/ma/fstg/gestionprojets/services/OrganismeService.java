package ma.fstg.gestionprojets.services;
import ma.fstg.gestionprojets.dto.request.OrganismeRequest;
import ma.fstg.gestionprojets.dto.response.OrganismeResponse;
import java.util.List;
public interface OrganismeService {
    OrganismeResponse create(OrganismeRequest req);
    OrganismeResponse update(Long id, OrganismeRequest req);
    OrganismeResponse getById(Long id);
    List<OrganismeResponse> getAll();
    List<OrganismeResponse> searchByNom(String nom);
    void delete(Long id);
}
