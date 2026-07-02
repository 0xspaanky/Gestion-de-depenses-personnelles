# --- Stage 1: build the JAR with Maven ---
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Cache dependencies first for faster rebuilds.
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build the application.
COPY src ./src
RUN mvn clean package -DskipTests -B

# --- Stage 2: run the JAR on a small JRE image ---
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 9097
ENTRYPOINT ["java", "-jar", "app.jar"]
