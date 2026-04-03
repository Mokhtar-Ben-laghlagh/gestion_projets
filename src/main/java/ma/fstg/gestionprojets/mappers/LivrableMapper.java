package ma.fstg.gestionprojets.mappers;

import ma.fstg.gestionprojets.dto.request.LivrableRequest;
import ma.fstg.gestionprojets.dto.response.LivrableResponse;
import ma.fstg.gestionprojets.entities.Livrable;
import ma.fstg.gestionprojets.entities.Phase;
import org.springframework.stereotype.Component;

@Component
public class LivrableMapper {

    public Livrable toEntity(LivrableRequest request, Phase phase) {
        return Livrable.builder()
                .code(request.getCode())
                .libelle(request.getLibelle())
                .description(request.getDescription())
                .chemin(request.getChemin())
                .typeFichier(request.getTypeFichier())
                .dateRemise(request.getDateRemise())
                .valide(request.getValide() != null ? request.getValide() : false)
                .phase(phase)
                .build();
    }

    public LivrableResponse toResponse(Livrable livrable) {
        LivrableResponse response = new LivrableResponse();
        response.setId(livrable.getId());
        response.setCode(livrable.getCode());
        response.setLibelle(livrable.getLibelle());
        response.setDescription(livrable.getDescription());
        response.setChemin(livrable.getChemin());
        response.setTypeFichier(livrable.getTypeFichier());
        response.setDateRemise(livrable.getDateRemise());
        response.setValide(livrable.getValide());

        if (livrable.getPhase() != null) {
            response.setPhaseId(livrable.getPhase().getId());
            response.setPhaseLibelle(livrable.getPhase().getLibelle());
        }

        return response;
    }

    public void updateEntity(Livrable livrable, LivrableRequest request) {
        livrable.setCode(request.getCode());
        livrable.setLibelle(request.getLibelle());
        livrable.setDescription(request.getDescription());
        livrable.setChemin(request.getChemin());
        livrable.setTypeFichier(request.getTypeFichier());
        livrable.setDateRemise(request.getDateRemise());
        if (request.getValide() != null) livrable.setValide(request.getValide());
    }
}
