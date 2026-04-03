package ma.fstg.gestionprojets.services;
import ma.fstg.gestionprojets.dto.request.*;
import ma.fstg.gestionprojets.dto.response.*;
public interface AuthService {
    LoginResponse login(LoginRequest req);
    EmployeResponse getMe(String login);
    void changePassword(String login, ChangePasswordRequest req);
}
