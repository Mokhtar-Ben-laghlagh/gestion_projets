package ma.fstg.gestionprojets.mappers;

import ma.fstg.gestionprojets.dto.request.DocumentProjetRequest;
import ma.fstg.gestionprojets.dto.response.DocumentProjetResponse;
import ma.fstg.gestionprojets.entities.DocumentProjet;
import ma.fstg.gestionprojets.entities.Projet;
import org.springframework.stereotype.Component;

@Component
public class DocumentProjetMapper {

    public DocumentProjet toEntity(DocumentProjetRequest request, Projet projet) {
        return DocumentProjet.builder()
                .code(request.getCode())
                .libelle(request.getLibelle())
                .description(request.getDescription())
                .chemin(request.getChemin())
                .typeDocument(request.getTypeDocument())
                .projet(projet)
                .build();
    }

    public DocumentProjetResponse toResponse(DocumentProjet document) {
        DocumentProjetResponse response = new DocumentProjetResponse();
        response.setId(document.getId());
        response.setCode(document.getCode());
        response.setLibelle(document.getLibelle());
        response.setDescription(document.getDescription());
        response.setChemin(document.getChemin());
        response.setTypeDocument(document.getTypeDocument());
        response.setDateAjout(document.getDateAjout());

        if (document.getProjet() != null) {
            response.setProjetId(document.getProjet().getId());
            response.setProjetNom(document.getProjet().getNom());
        }

        return response;
    }

    public void updateEntity(DocumentProjet document, DocumentProjetRequest request) {
        document.setCode(request.getCode());
        document.setLibelle(request.getLibelle());
        document.setDescription(request.getDescription());
        document.setChemin(request.getChemin());
        document.setTypeDocument(request.getTypeDocument());
    }
}
