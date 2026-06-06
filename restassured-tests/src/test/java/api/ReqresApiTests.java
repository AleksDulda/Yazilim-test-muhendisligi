package api;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.io.File;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class ReqresApiTests {

    @BeforeClass
    public void setup() {
        // Set the base URL for reqres API
        RestAssured.baseURI = "https://reqres.in";

        // Load API key from ../.env if present
        String apiKey = getApiKey();

        var builder = new io.restassured.builder.RequestSpecBuilder()
                .setContentType(ContentType.JSON)
                .addHeader("User-Agent", "reqres-restassured-tests/1.0");

        if (apiKey != null && !apiKey.isEmpty()) {
            builder.addHeader("x-api-key", apiKey);
        }

        RestAssured.requestSpecification = builder.build();
    }

    private String getApiKey() {
        String envKey = System.getenv("REQRES_API_KEY");
        if (envKey != null && !envKey.trim().isEmpty()) {
            return envKey.trim();
        }

        try {
            File envFile = new File("../.env");
            if (envFile.exists()) {
                List<String> lines = Files.readAllLines(envFile.toPath());
                for (String line : lines) {
                    if (line.trim().startsWith("REQRES_API_KEY=")) {
                        return line.substring(line.indexOf("=") + 1).trim();
                    }
                }
            }
        } catch (Exception e) {
            // Ignore and fallback
        }
        return null;
    }

    @Test
    public void testCreateUser() {
        String randomSuffix = String.valueOf(System.currentTimeMillis());
        Map<String, Object> payload = new HashMap<>();
        payload.put("name", "Jane Doe " + randomSuffix);
        payload.put("job", "QA Engineer");

        given()
            .body(payload)
        .when()
            .post("/api/users")
        .then()
            .statusCode(201)
            .time(lessThan(800L)) // Expect response time < 800ms
            .body("name", equalTo(payload.get("name")))
            .body("job", equalTo(payload.get("job")))
            .body("id", notNullValue())
            .body("createdAt", notNullValue());
    }

    @Test
    public void testGetUser() {
        given()
        .when()
            .get("/api/users/2")
        .then()
            .statusCode(200)
            .time(lessThan(800L)) // Expect response time < 800ms
            .body("data.id", equalTo(2))
            .body("data.first_name", equalTo("Janet"))
            .body("data.email", matchesPattern(".+@reqres\\.in$"));
    }
}
