package ma.fstg.gestionprojets.mappers;

import ma.fstg.gestionprojets.dto.response.CommentaireResponse;
import ma.fstg.gestionprojets.entities.Commentaire;
import org.springframework.stereotype.Component;

@Component
public class CommentaireMapper {

    public CommentaireResponse toResponse(Commentaire commentaire) {
        CommentaireResponse response = new CommentaireResponse();
        response.setId(commentaire.getId());
        response.setContenu(commentaire.getContenu());
        response.setDateCreation(commentaire.getDateCreation());

        if (commentaire.getAuteur() != null) {
            response.setAuteurNom(commentaire.getAuteur().getNom());
            response.setAuteurPrenom(commentaire.getAuteur().getPrenom());
        }

        if (commentaire.getProjet() != null)
            response.setProjetId(commentaire.getProjet().getId());

        if (commentaire.getPhase() != null)
            response.setPhaseId(commentaire.getPhase().getId());

        return response;
    }
}
