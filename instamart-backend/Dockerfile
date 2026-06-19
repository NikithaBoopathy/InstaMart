From eclipse-temurin:17-jre-alpine
WORKDIR /app
# (We rename it to 'app.jar' just to make the run command simpler)
COPY target/instamart-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar"]
CMD ["app.jar"]
