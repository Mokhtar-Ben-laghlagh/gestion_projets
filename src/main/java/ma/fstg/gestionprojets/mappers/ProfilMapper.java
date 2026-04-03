package ma.fstg.gestionprojets.mappers;

import ma.fstg.gestionprojets.dto.request.ProfilRequest;
import ma.fstg.gestionprojets.dto.response.ProfilResponse;
import ma.fstg.gestionprojets.entities.Profil;
import org.springframework.stereotype.Component;

@Component
public class ProfilMapper {

    public Profil toEntity(ProfilRequest request) {
        return Profil.builder()
                .code(request.getCode())
                .libelle(request.getLibelle())
                .description(request.getDescription())
                .build();
    }

    public ProfilResponse toResponse(Profil profil) {
        ProfilResponse response = new ProfilResponse();
        response.setId(profil.getId());
        response.setCode(profil.getCode());
        response.setLibelle(profil.getLibelle());
        response.setDescription(profil.getDescription());
        return response;
    }

    public void updateEntity(Profil profil, ProfilRequest request) {
        profil.setCode(request.getCode());
        profil.setLibelle(request.getLibelle());
        profil.setDescription(request.getDescription());
    }
}
