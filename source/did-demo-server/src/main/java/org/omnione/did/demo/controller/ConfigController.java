package org.omnione.did.demo.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.omnione.did.base.config.ConfigService;
import org.omnione.did.base.config.DemoDataConfig;
import org.omnione.did.demo.dto.ServerSettingsDto;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/demo/api")
@RequiredArgsConstructor
@Slf4j
public class ConfigController {
    private final ConfigService configService;

    @GetMapping
    public DemoDataConfig getConfig() {
        return configService.getConfig();
    }


    @GetMapping("/vc-plans")
    public ResponseEntity<?> getVcPlan() {
        configService.updateVcPlan();
        return ResponseEntity.ok(configService.getConfig().getVcPlans());
    }

    @PostMapping("/current-vc-plan")
    public ResponseEntity<?> updateCurrentVcPlan(@RequestBody Map<String, String> body) {

        String vcPlanId = body.get("vcPlanId");
        String manager = body.get("manager");
        configService.updateCurrentVcPlan(vcPlanId, manager);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/vp-policies")
    public ResponseEntity<?> getVpPolicies() {
        configService.updateVpPolicy();
        return ResponseEntity.ok(configService.getConfig().getVpPolicies());
    }
    @PostMapping("/current-vp-policy")
    public ResponseEntity<?> updateCurrentVpPolicy(@RequestBody Map<String, String> body) {
        String vpPolicyId = body.get("vpPolicyId");
        configService.updateCurrentVpPolicy(vpPolicyId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/server-settings")
    public ResponseEntity<?> updateServerSettings(@RequestBody ServerSettingsDto dto) {
        configService.updateServerSettings(
                dto.getTasServer(),
                dto.getIssuerServer(),
                dto.getCaServer(),
                dto.getVerifierServer()
        );
        return ResponseEntity.ok().build();
    }

    @GetMapping("/server-settings")
    public ResponseEntity<?> getServerSettings() {
        return ResponseEntity.ok(configService.getServerSettings());
    }

    @PostMapping("/test-connection")
    public ResponseEntity<?> testConnection(@RequestBody ServerSettingsDto dto) {

        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> results = new ArrayList<>();
        boolean allSuccess = true;

        results.add(testServerConnection("TAS Server", dto.getTasServer()));
        results.add(testServerConnection("Issuer Server", dto.getIssuerServer()));
        results.add(testServerConnection("CA Server", dto.getCaServer()));
        results.add(testServerConnection("Verifier Server", dto.getVerifierServer()));

        allSuccess = results.stream().allMatch(r -> (Boolean) r.get("success"));

        result.put("results", results);
        result.put("allSuccess", allSuccess);

        return ResponseEntity.ok(result);
    }

    private Map<String, Object> testServerConnection(String serverName, String baseUrl) {
        Map<String, Object> result = new HashMap<>();
        result.put("server", serverName);

        try {
            RestTemplate restTemplate = new RestTemplate();

            SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
            factory.setConnectTimeout(3000);
            factory.setReadTimeout(3000);
            restTemplate.setRequestFactory(factory);

            restTemplate.headForHeaders(baseUrl);

            result.put("success", true);
            result.put("message", "Connection successful");

        } catch (ResourceAccessException e) {
            result.put("success", false);
            result.put("message", "Connection failed: Server unreachable");
            log.warn("Connection test failed for {}: {}", serverName, e.getMessage());

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            result.put("success", true);
            result.put("message", "Connection successful (Server responded)");

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Connection failed: " + e.getMessage());
            log.error("Unexpected error testing connection for {}", serverName, e);
        }

        return result;
    }

    @GetMapping("/user-info")
    public ResponseEntity<Map<String, Object>> getUserInfo() {
        Map<String, Object> userInfo = configService.getUserInfo();
        return ResponseEntity.ok(userInfo);
    }

}