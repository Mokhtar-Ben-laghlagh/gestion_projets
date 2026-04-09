package ma.fstg.gestionprojets.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.fstg.gestionprojets.entities.*;
import ma.fstg.gestionprojets.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    private final ProfilRepository profilRepo;
    private final EmployeRepository empRepo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        createProfil("ADMINISTRATEUR", "Administrateur");
        createProfil("DIRECTEUR", "Directeur");
        createProfil("SECRETAIRE", "Secrétaire");
        createProfil("CHEF_PROJET", "Chef de Projet");
        createProfil("COMPTABLE", "Comptable");
        createProfil("TECHNICIEN", "Technicien");
        createProfil("INGENIEUR", "Ingénieur");
        createProfil("EMPLOYE", "Employé");

        if (!empRepo.existsByLogin("admin")) {
            Profil p = profilRepo.findByCode("ADMINISTRATEUR").orElseThrow();
            empRepo.save(Employe.builder().matricule("ADM001").nom("Admin").prenom("Système").login("admin").email("admin@gestionprojets.ma").password(encoder.encode("admin123")).profil(p).actif(true).build());
            log.info("✅ Admin créé — login: admin / password: admin123");
        }
        log.info("✅ Données initiales chargées.");
    }

    private void createProfil(String code, String libelle) {
        if (!profilRepo.existsByCode(code)) {
            profilRepo.save(Profil.builder().code(code).libelle(libelle).build());
            log.info("✅ Profil créé: {}", code);
        }
    }
}
