package ma.fstg.gestionprojets.services.impl;
import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.dto.request.*;
import ma.fstg.gestionprojets.dto.response.*;
import ma.fstg.gestionprojets.entities.Employe;
import ma.fstg.gestionprojets.exceptions.*;
import ma.fstg.gestionprojets.repositories.EmployeRepository;
import ma.fstg.gestionprojets.security.JwtUtils;
import ma.fstg.gestionprojets.services.AuthService;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor @Transactional
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authManager;
    private final JwtUtils jwtUtils;
    private final EmployeRepository empRepo;
    private final PasswordEncoder encoder;
    private final EmployeServiceImpl empService;
    public LoginResponse login(LoginRequest r) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(r.getLogin(), r.getPassword()));
        String token = jwtUtils.generateToken(r.getLogin());
        Employe e = empRepo.findByLogin(r.getLogin()).orElseThrow(() -> new ResourceNotFoundException("Employé introuvable"));
        String profil = e.getProfil() != null ? e.getProfil().getCode() : "EMPLOYE";
        return new LoginResponse(token, e.getLogin(), e.getNom(), e.getPrenom(), profil, e.getId());
    }
    public EmployeResponse getMe(String login) { return empService.toResp(empRepo.findByLogin(login).orElseThrow(() -> new ResourceNotFoundException("Employé introuvable"))); }
    public void changePassword(String login, ChangePasswordRequest r) {
        Employe e = empRepo.findByLogin(login).orElseThrow(() -> new ResourceNotFoundException("Employé introuvable"));
        if (!encoder.matches(r.getAncienPassword(), e.getPassword())) throw new BusinessException("Ancien mot de passe incorrect.");
        e.setPassword(encoder.encode(r.getNouveauPassword())); empRepo.save(e);
    }
}
