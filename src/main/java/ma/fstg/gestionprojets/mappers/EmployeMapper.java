package ma.fstg.gestionprojets.mappers;

import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.EmployeRequest;
import ma.fstg.gestionprojets.dto.response.EmployeResponse;
import ma.fstg.gestionprojets.dto.response.ProfilResponse;
import ma.fstg.gestionprojets.entities.Employe;
import ma.fstg.gestionprojets.entities.Profil;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmployeMapper {

    private final ProfilMapper profilMapper;

    /**
     * Convertit un EmployeRequest en entité Employe.
     * Note : le password doit être encodé AVANT d'appeler cette méthode.
     * Le profil doit être injecté séparément depuis le repository.
     */
    public Employe toEntity(EmployeRequest request, String encodedPassword, Profil profil) {
        return Employe.builder()
                .matricule(request.getMatricule())
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .telephone(request.getTelephone())
                .email(request.getEmail())
                .login(request.getLogin())
                .password(encodedPassword)
                .adresse(request.getAdresse())
                .profil(profil)
                .actif(true)
                .build();
    }

    public EmployeResponse toResponse(Employe employe) {
        EmployeResponse response = new EmployeResponse();
        response.setId(employe.getId());
        response.setMatricule(employe.getMatricule());
        response.setNom(employe.getNom());
        response.setPrenom(employe.getPrenom());
        response.setTelephone(employe.getTelephone());
        response.setEmail(employe.getEmail());
        response.setLogin(employe.getLogin());
        response.setAdresse(employe.getAdresse());
        response.setActif(employe.getActif());

        if (employe.getProfil() != null) {
            response.setProfil(profilMapper.toResponse(employe.getProfil()));
        }

        return response;
    }

    public void updateEntity(Employe employe, EmployeRequest request, Profil profil) {
        employe.setMatricule(request.getMatricule());
        employe.setNom(request.getNom());
        employe.setPrenom(request.getPrenom());
        employe.setTelephone(request.getTelephone());
        employe.setEmail(request.getEmail());
        employe.setLogin(request.getLogin());
        employe.setAdresse(request.getAdresse());
        employe.setProfil(profil);
    }
}
