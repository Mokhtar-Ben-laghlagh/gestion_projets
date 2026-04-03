package ma.fstg.gestionprojets.mappers;

import ma.fstg.gestionprojets.dto.request.OrganismeRequest;
import ma.fstg.gestionprojets.dto.response.OrganismeResponse;
import ma.fstg.gestionprojets.entities.Organisme;
import org.springframework.stereotype.Component;

@Component
public class OrganismeMapper {

    public Organisme toEntity(OrganismeRequest request) {
        return Organisme.builder()
                .code(request.getCode())
                .nom(request.getNom())
                .adresse(request.getAdresse())
                .telephone(request.getTelephone())
                .nomContact(request.getNomContact())
                .emailContact(request.getEmailContact())
                .siteWeb(request.getSiteWeb())
                .secteurActivite(request.getSecteurActivite())
                .pays(request.getPays())
                .build();
    }

    public OrganismeResponse toResponse(Organisme organisme) {
        OrganismeResponse response = new OrganismeResponse();
        response.setId(organisme.getId());
        response.setCode(organisme.getCode());
        response.setNom(organisme.getNom());
        response.setAdresse(organisme.getAdresse());
        response.setTelephone(organisme.getTelephone());
        response.setNomContact(organisme.getNomContact());
        response.setEmailContact(organisme.getEmailContact());
        response.setSiteWeb(organisme.getSiteWeb());
        response.setSecteurActivite(organisme.getSecteurActivite());
        response.setPays(organisme.getPays());
        response.setNombreProjets(
            organisme.getProjets() != null ? organisme.getProjets().size() : 0
        );
        return response;
    }

    public void updateEntity(Organisme organisme, OrganismeRequest request) {
        organisme.setCode(request.getCode());
        organisme.setNom(request.getNom());
        organisme.setAdresse(request.getAdresse());
        organisme.setTelephone(request.getTelephone());
        organisme.setNomContact(request.getNomContact());
        organisme.setEmailContact(request.getEmailContact());
        organisme.setSiteWeb(request.getSiteWeb());
        organisme.setSecteurActivite(request.getSecteurActivite());
        organisme.setPays(request.getPays());
    }
}
