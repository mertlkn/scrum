FROM openjdk:16-jdk
VOLUME /tmp
COPY ./build/libs/scrum-poker-backend-0.1.0.jar app.jar
COPY serviceAccount.json serviceAccount.json
ENTRYPOINT ["java","-jar","/app.jar"]