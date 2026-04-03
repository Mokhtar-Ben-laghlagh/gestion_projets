package ma.fstg.gestionprojets.services.impl;

import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.EmployeRequest;
import ma.fstg.gestionprojets.dto.response.EmployeResponse;
import ma.fstg.gestionprojets.dto.response.ProfilResponse;
import ma.fstg.gestionprojets.entities.Employe;
import ma.fstg.gestionprojets.entities.Profil;
import ma.fstg.gestionprojets.exceptions.*;
import ma.fstg.gestionprojets.repositories.EmployeRepository;
import ma.fstg.gestionprojets.repositories.ProfilRepository;
import ma.fstg.gestionprojets.services.EmployeService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional
public class EmployeServiceImpl implements EmployeService {

    private final EmployeRepository employeRepo;
    private final ProfilRepository profilRepo;
    private final PasswordEncoder encoder;

    public EmployeResponse create(EmployeRequest r) {
        if (employeRepo.existsByMatricule(r.getMatricule())) throw new DuplicateResourceException("Matricule déjà utilisé.");
        if (employeRepo.existsByLogin(r.getLogin())) throw new DuplicateResourceException("Login déjà utilisé.");
        if (r.getEmail() != null && employeRepo.existsByEmail(r.getEmail())) throw new DuplicateResourceException("Email déjà utilisé.");
        Profil profil = r.getProfilId() != null ? profilRepo.findById(r.getProfilId()).orElseThrow(() -> new ResourceNotFoundException("Profil", r.getProfilId())) : null;
        Employe e = Employe.builder().matricule(r.getMatricule()).nom(r.getNom()).prenom(r.getPrenom())
                .telephone(r.getTelephone()).email(r.getEmail()).login(r.getLogin())
                .password(encoder.encode(r.getPassword())).adresse(r.getAdresse()).profil(profil).actif(true).build();
        return toResp(employeRepo.save(e));
    }

    public EmployeResponse update(Long id, EmployeRequest r) {
        Employe e = find(id);
        if (!e.getMatricule().equals(r.getMatricule()) && employeRepo.existsByMatricule(r.getMatricule())) throw new DuplicateResourceException("Matricule déjà utilisé.");
        if (!e.getLogin().equals(r.getLogin()) && employeRepo.existsByLogin(r.getLogin())) throw new DuplicateResourceException("Login déjà utilisé.");
        Profil profil = r.getProfilId() != null ? profilRepo.findById(r.getProfilId()).orElseThrow(() -> new ResourceNotFoundException("Profil", r.getProfilId())) : null;
        e.setMatricule(r.getMatricule()); e.setNom(r.getNom()); e.setPrenom(r.getPrenom());
        e.setTelephone(r.getTelephone()); e.setEmail(r.getEmail()); e.setLogin(r.getLogin());
        e.setAdresse(r.getAdresse()); e.setProfil(profil);
        if (r.getPassword() != null && !r.getPassword().isBlank()) e.setPassword(encoder.encode(r.getPassword()));
        return toResp(employeRepo.save(e));
    }

    @Transactional(readOnly = true) public EmployeResponse getById(Long id) { return toResp(find(id)); }
    @Transactional(readOnly = true) public List<EmployeResponse> getAll() { return employeRepo.findAll().stream().map(this::toResp).collect(Collectors.toList()); }
    @Transactional(readOnly = true) public List<EmployeResponse> search(String nom) { return employeRepo.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(nom, nom).stream().map(this::toResp).collect(Collectors.toList()); }
    @Transactional(readOnly = true) public List<EmployeResponse> getDisponibles(LocalDate d, LocalDate f) { return employeRepo.findDisponibles(d, f).stream().map(this::toResp).collect(Collectors.toList()); }
    public void delete(Long id) { find(id); employeRepo.deleteById(id); }
    public void toggleActif(Long id) { Employe e = find(id); e.setActif(!e.getActif()); employeRepo.save(e); }

    private Employe find(Long id) { return employeRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employé", id)); }

    public EmployeResponse toResp(Employe e) {
        EmployeResponse r = new EmployeResponse();
        r.setId(e.getId()); r.setMatricule(e.getMatricule()); r.setNom(e.getNom()); r.setPrenom(e.getPrenom());
        r.setTelephone(e.getTelephone()); r.setEmail(e.getEmail()); r.setLogin(e.getLogin());
        r.setAdresse(e.getAdresse()); r.setActif(e.getActif());
        if (e.getProfil() != null) { ProfilResponse p = new ProfilResponse(); p.setId(e.getProfil().getId()); p.setCode(e.getProfil().getCode()); p.setLibelle(e.getProfil().getLibelle()); r.setProfil(p); }
        return r;
    }
}
