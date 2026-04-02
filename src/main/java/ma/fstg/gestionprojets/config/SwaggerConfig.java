package ma.fstg.gestionprojets.config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.*;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.*;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI openAPI() {
        final String scheme = "bearerAuth";
        return new OpenAPI().info(new Info().title("Gestion Projets API").description("Système de gestion et suivi de projets").version("1.0.0"))
                .addSecurityItem(new SecurityRequirement().addList(scheme))
                .components(new Components().addSecuritySchemes(scheme, new SecurityScheme().name(scheme).type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
    }
}
