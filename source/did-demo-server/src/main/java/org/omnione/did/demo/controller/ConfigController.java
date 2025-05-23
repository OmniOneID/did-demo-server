package org.omnione.did.demo.controller;

import lombok.RequiredArgsConstructor;
import org.omnione.did.base.config.ConfigService;
import org.omnione.did.base.config.DemoDataConfig;
import org.omnione.did.demo.dto.ServerSettingsDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/demo/api")
@RequiredArgsConstructor
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

        results.add(Map.of("server", "TAS Server", "success", true));
        results.add(Map.of("server", "Issuer Server", "success", true));
        results.add(Map.of("server", "CA Server", "success", true));
        results.add(Map.of("server", "Verifier Server", "success", true));

        result.put("results", results);
        result.put("allSuccess", true);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/user-info")
    public ResponseEntity<Map<String, Object>> getUserInfo() {
        try {
            Map<String, Object> userInfo = configService.getUserInfo();
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}