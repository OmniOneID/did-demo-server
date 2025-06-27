package org.omnione.did.base.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.omnione.did.base.exception.ErrorCode;
import org.omnione.did.base.exception.OpenDidException;
import org.omnione.did.demo.api.ListFeign;
import org.omnione.did.demo.api.VerifierFeign;
import org.omnione.did.demo.dto.VcPlanResponseDto;
import org.omnione.did.demo.dto.VpPolicyResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RequiredArgsConstructor
@Service
@Slf4j
@Profile("!sample")
public class ConfigService {
    @Value("${app.config.file-path}")
    private String configFilePath;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ListFeign listFeign;
    private final VerifierFeign verifierFeign;
    private final ConfigurableEnvironment environment;

    private File configFile;

    @PostConstruct
    public void init() {
        this.configFile = new File(configFilePath);
        createConfigFileIfNotExists();
        loadServerSettingsToSystemProperties();
    }
    private void createConfigFileIfNotExists() {
        try {
            if (!configFile.exists()) {
                configFile.getParentFile().mkdirs();
                // 빈 JSON 객체로 초기화
                objectMapper.writerWithDefaultPrettyPrinter()
                        .writeValue(configFile, objectMapper.createObjectNode());
                log.info("Created config file at: {}", configFile.getAbsolutePath());
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to create config file", e);
        }
    }

    public DemoDataConfig getConfig() {
        try {
            return objectMapper.readValue(configFile, DemoDataConfig.class);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read config file", e);
        }
    }

    public void updateVcPlan()  {
        try {
            // 동적 URL로 RestTemplate 호출
            String listUrl = environment.getProperty("tas.url", "");
            if (listUrl.isEmpty()) {
                throw new IllegalStateException("TAS URL is not configured");
            }
            
            RestTemplate restTemplate = new RestTemplate();
            String fullUrl = combineUrlAndPath(listUrl, "/list/api/v1/vcplan/list/issuer");
            
            log.info("Calling VC Plan API with dynamic URL: {}", fullUrl);
            String jsonString = restTemplate.getForObject(fullUrl, String.class);
            
            VcPlanResponseDto vcPlanResponseDto = objectMapper.readValue(jsonString, VcPlanResponseDto.class);

            ObjectNode configNode = (ObjectNode) objectMapper.readTree(configFile);

            List<ObjectNode> vcPlanNodes = vcPlanResponseDto.getItems().stream()
                    .map(plan -> {
                        ObjectNode node = objectMapper.createObjectNode();
                        node.put("vcPlanId", plan.getVcPlanId());
                        node.put("name", plan.getName());
                        node.put("description", plan.getDescription());
                        node.put("manager", plan.getManager());
                        return node;
                    })
                    .collect(Collectors.toList());

            configNode.set("vcPlans", objectMapper.valueToTree(vcPlanNodes));
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(configFile, configNode);
            
        } catch (IOException e) {
            throw new OpenDidException(ErrorCode.VC_PLAN_NOT_FOUND);
        } catch (Exception e) {
            log.error("Failed to update VC Plan with dynamic URL", e);
            throw new OpenDidException(ErrorCode.VC_PLAN_NOT_FOUND);
        }
    }

    public void updateVpPolicy() {
        try {
            // 동적 URL로 RestTemplate 호출
            String verifierUrl = environment.getProperty("verifier.url", "");
            if (verifierUrl.isEmpty()) {
                throw new IllegalStateException("Verifier URL is not configured");
            }
            
            RestTemplate restTemplate = new RestTemplate();
            String fullUrl = combineUrlAndPath(verifierUrl, "/verifier/admin/v1/policies/all");
            
            log.info("Calling VP Policy API with dynamic URL: {}", fullUrl);
            VpPolicyResponseDto[] vpPoliciesArray = restTemplate.getForObject(fullUrl, VpPolicyResponseDto[].class);
            List<VpPolicyResponseDto> vpPolicies = Arrays.asList(vpPoliciesArray != null ? vpPoliciesArray : new VpPolicyResponseDto[0]);

            ObjectNode configNode = (ObjectNode) objectMapper.readTree(configFile);

            List<ObjectNode> vpPolicyNodes = vpPolicies.stream()
                    .map(policy -> {
                        ObjectNode node = objectMapper.createObjectNode();
                        node.put("policyId", policy.getPolicyId());
                        node.put("policyTitle", policy.getPolicyTitle());
                        return node;
                    })
                    .collect(Collectors.toList());

            configNode.set("vpPolicies", objectMapper.valueToTree(vpPolicyNodes));
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(configFile, configNode);
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to update VP policies", e);
        } catch (Exception e) {
            log.error("Failed to update VP Policy with dynamic URL", e);
            throw new RuntimeException("Failed to update VP policies: " + e.getMessage(), e);
        }
    }

    public void updateCurrentVpPolicy(String vpPolicyId) {
        try {
            ObjectNode configNode = (ObjectNode) objectMapper.readTree(configFile);
            configNode.put("currentVpPolicy", vpPolicyId);
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(configFile, configNode);
        } catch (IOException e) {
            throw new RuntimeException("Failed to update current VP Policy", e);
        }
    }

    public void updateCurrentVcPlan(String vcPlanId, String manager) {
        try {
            ObjectNode configNode = (ObjectNode) objectMapper.readTree(configFile);

            configNode.put("currentVcPlan", vcPlanId);
            configNode.put("issuer", manager);

            objectMapper.writerWithDefaultPrettyPrinter().writeValue(configFile, configNode);
        } catch (IOException e) {
            throw new RuntimeException("Failed to update current VC Plan", e);
        }
    }

    public void updateServerSettings(String tasServer, String issuerServer, String caServer, String verifierServer) {
        try {
            // 1. config.json에 저장 (기존 로직)
            ObjectNode configNode = (ObjectNode) objectMapper.readTree(configFile);

            ObjectNode serverSettings = objectMapper.createObjectNode();
            serverSettings.put("tasServer", tasServer);
            serverSettings.put("issuerServer", issuerServer);
            serverSettings.put("caServer", caServer);
            serverSettings.put("verifierServer", verifierServer);

            configNode.set("serverSettings", serverSettings);
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(configFile, configNode);

            // 2. 런타임 환경 변수 업데이트 (더 안전한 방식)
            updateServerUrls(tasServer, issuerServer, caServer, verifierServer);

            log.info("Server settings updated successfully - TAS: {}, Issuer: {}, CA: {}, Verifier: {}", 
                    tasServer, issuerServer, caServer, verifierServer);

        } catch (IOException e) {
            throw new RuntimeException("Failed to update server settings", e);
        }
    }

    /**
     * 서버 URL들을 동적으로 업데이트합니다.
     */
    public void updateServerUrls(String tasUrl, String issuerUrl, String caUrl, String verifierUrl) {
        try {
            MutablePropertySources propertySources = environment.getPropertySources();
            
            Map<String, Object> dynamicProperties = new HashMap<>();
            if (tasUrl != null && !tasUrl.trim().isEmpty()) {
                dynamicProperties.put("tas.url", tasUrl.trim());
                dynamicProperties.put("dynamic.tas.url", tasUrl.trim());
            }
            if (issuerUrl != null && !issuerUrl.trim().isEmpty()) {
                dynamicProperties.put("issuer.url", issuerUrl.trim());
                dynamicProperties.put("dynamic.issuer.url", issuerUrl.trim());
            }
            if (caUrl != null && !caUrl.trim().isEmpty()) {
                dynamicProperties.put("cas.url", caUrl.trim());
                dynamicProperties.put("dynamic.cas.url", caUrl.trim());
            }
            if (verifierUrl != null && !verifierUrl.trim().isEmpty()) {
                dynamicProperties.put("verifier.url", verifierUrl.trim());
                dynamicProperties.put("dynamic.verifier.url", verifierUrl.trim());
            }
            
            // 기존 동적 프로퍼티 제거 후 새로 추가
            propertySources.remove("dynamic-server-config");
            propertySources.addFirst(new MapPropertySource("dynamic-server-config", dynamicProperties));
            
            log.info("Server URLs updated dynamically in Environment - TAS: {}, Issuer: {}, CA: {}, Verifier: {}", 
                    tasUrl, issuerUrl, caUrl, verifierUrl);
            
        } catch (Exception e) {
            log.error("Failed to update server URLs dynamically", e);
            throw new RuntimeException("Failed to update server URLs dynamically", e);
        }
    }

    /**
     * 현재 설정된 서버 URL들을 반환합니다.
     */
    public Map<String, String> getCurrentServerUrls() {
        Map<String, String> urls = new HashMap<>();
        urls.put("tasServer", environment.getProperty("tas.url", ""));
        urls.put("issuerServer", environment.getProperty("issuer.url", ""));
        urls.put("caServer", environment.getProperty("cas.url", ""));
        urls.put("verifierServer", environment.getProperty("verifier.url", ""));
        return urls;
    }

    public Map<String, Object> getServerSettings() {
        try {
            // 현재 동적으로 설정된 URL들 우선 반환
            Map<String, String> currentUrls = getCurrentServerUrls();
            Map<String, Object> settings = new HashMap<>(currentUrls);
            
            // config.json에서 추가 설정 정보 읽기
            ObjectNode configNode = (ObjectNode) objectMapper.readTree(configFile);
            ObjectNode serverSettings = (ObjectNode) configNode.get("serverSettings");

            if (serverSettings != null) {
                // 현재 Environment에 없는 설정들은 config.json에서 가져오기
                if (!currentUrls.containsKey("tasServer") || currentUrls.get("tasServer").isEmpty()) {
                    settings.put("tasServer", serverSettings.has("tasServer") ? serverSettings.get("tasServer").asText() : "");
                }
                if (!currentUrls.containsKey("issuerServer") || currentUrls.get("issuerServer").isEmpty()) {
                    settings.put("issuerServer", serverSettings.has("issuerServer") ? serverSettings.get("issuerServer").asText() : "");
                }
                if (!currentUrls.containsKey("caServer") || currentUrls.get("caServer").isEmpty()) {
                    settings.put("caServer", serverSettings.has("caServer") ? serverSettings.get("caServer").asText() : "");
                }
                if (!currentUrls.containsKey("verifierServer") || currentUrls.get("verifierServer").isEmpty()) {
                    settings.put("verifierServer", serverSettings.has("verifierServer") ? serverSettings.get("verifierServer").asText() : "");
                }
            }

            return settings;
        } catch (IOException e) {
            throw new RuntimeException("Failed to get server settings", e);
        }
    }

    /**
     * 사용자 정보를 저장합니다.
     * @param userInfoMap 사용자 정보를 담은 Map 객체
     */
    public void saveUserInfo(Map<String, Object> userInfoMap) {
        try {
            ObjectNode configNode = (ObjectNode) objectMapper.readTree(configFile);

            // JSON 노드로 변환
            ObjectNode userInfoNode = objectMapper.valueToTree(userInfoMap);

            configNode.set("userInfo", userInfoNode);

            objectMapper.writerWithDefaultPrettyPrinter().writeValue(configFile, configNode);
            log.info("User information saved successfully");
        } catch (IOException e) {
            log.error("Failed to save user information", e);
            throw new RuntimeException("Failed to save user information", e);
        }
    }

    public Map<String, Object> getUserInfo() {
        try {
            ObjectNode configNode = (ObjectNode) objectMapper.readTree(configFile);
            ObjectNode userInfoNode = (ObjectNode) configNode.get("userInfo");

            if (userInfoNode == null) {
                return new HashMap<>();
            }
            return objectMapper.convertValue(userInfoNode, Map.class);
        } catch (IOException e) {
            log.error("Failed to get user information", e);
            throw new RuntimeException("Failed to get user information", e);
        }
    }

    /**
     * config.json의 serverSettings를 Environment로 설정
     */
    private void loadServerSettingsToSystemProperties() {
        Map<String, Object> serverSettings = getServerSettings();

        String tasServer = (String) serverSettings.get("tasServer");
        String issuerServer = (String) serverSettings.get("issuerServer");
        String verifierServer = (String) serverSettings.get("verifierServer");
        String caServer = (String) serverSettings.get("caServer");

        if (hasValidUrl(tasServer) || hasValidUrl(issuerServer) || 
            hasValidUrl(verifierServer) || hasValidUrl(caServer)) {
            
            updateServerUrls(tasServer, issuerServer, caServer, verifierServer);
            log.info("Server settings loaded from config.json to Environment");
        }
    }

    private boolean hasValidUrl(String url) {
        return url != null && !url.trim().isEmpty();
    }

    /**
     * URL과 path를 결합하는 헬퍼 메서드
     */
    private String combineUrlAndPath(String baseUrl, String path) {
        if (path == null || path.isEmpty()) {
            return baseUrl;
        }
        
        if (baseUrl.endsWith("/") && path.startsWith("/")) {
            return baseUrl + path.substring(1);
        } else if (!baseUrl.endsWith("/") && !path.startsWith("/")) {
            return baseUrl + "/" + path;
        } else {
            return baseUrl + path;
        }
    }



}