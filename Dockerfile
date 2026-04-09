FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/gestion-projets-3.5.12-SNAPSHOT.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
