package ma.fstg.gestionprojets.security;

import lombok.RequiredArgsConstructor;
import ma.fstg.gestionprojets.entities.Employe;
import ma.fstg.gestionprojets.repositories.EmployeRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final EmployeRepository employeRepository;

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        Employe emp = employeRepository.findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable: " + login));
        String role = emp.getProfil() != null ? "ROLE_" + emp.getProfil().getCode().toUpperCase() : "ROLE_EMPLOYE";
        return User.builder().username(emp.getLogin()).password(emp.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority(role))).build();
    }
}
