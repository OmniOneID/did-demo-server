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
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
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
            String jsonString = listFeign.requestVcPlanList();
            VcPlanResponseDto vcPlanResponseDto = objectMapper.readValue(jsonString, VcPlanResponseDto.class);

            ObjectNode configNode = (ObjectNode) objectMapper.readTree(configFile);

            List<ObjectNode> vcPlanNodes = vcPlanResponseDto.getItems().stream()
                    .map(plan -> {
                        ObjectNode node = objectMapper.createObjectNode();
                        node.put("vcPlanId", plan.getVcPlanId());  // id 대신 vcPlanId 사용
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
        }
    }

    public void updateVpPolicy() {
        try {

            List<VpPolicyResponseDto> vpPolicies = verifierFeign.getPolicies();

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
            ObjectNode configNode = (ObjectNode) objectMapper.readTree(configFile);

            ObjectNode serverSettings = objectMapper.createObjectNode();
            serverSettings.put("tasServer", tasServer);
            serverSettings.put("issuerServer", issuerServer);
            serverSettings.put("caServer", caServer);
            serverSettings.put("verifierServer", verifierServer);

            configNode.set("serverSettings", serverSettings);

            objectMapper.writerWithDefaultPrettyPrinter().writeValue(configFile, configNode);

            setSystemPropertyIfNotEmpty(tasServer, "tas.url");
            setSystemPropertyIfNotEmpty(issuerServer, "issuer.url");
            setSystemPropertyIfNotEmpty(caServer, "cas.url");
            setSystemPropertyIfNotEmpty(verifierServer, "verifier.url");

            log.info("Server settings updated in both config.json and system properties");

        } catch (IOException e) {
            throw new RuntimeException("Failed to update server settings", e);
        }
    }

    public Map<String, String> getServerSettings() {
        try {
            ObjectNode configNode = (ObjectNode) objectMapper.readTree(configFile);
            ObjectNode serverSettings = (ObjectNode) configNode.get("serverSettings");

            if (serverSettings == null) {
                return new HashMap<>();
            }

            Map<String, String> settings = new HashMap<>();
            settings.put("tasServer", serverSettings.has("tasServer") ? serverSettings.get("tasServer").asText() : "");
            settings.put("issuerServer", serverSettings.has("issuerServer") ? serverSettings.get("issuerServer").asText() : "");
            settings.put("caServer", serverSettings.has("caServer") ? serverSettings.get("caServer").asText() : "");
            settings.put("verifierServer", serverSettings.has("verifierServer") ? serverSettings.get("verifierServer").asText() : "");

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
     * config.json의 serverSettings를 System Property로 설정
     */
    private void loadServerSettingsToSystemProperties() {
        Map<String, String> serverSettings = getServerSettings();

        setSystemPropertyIfNotEmpty(serverSettings.get("tasServer"), "tas.url");
        setSystemPropertyIfNotEmpty(serverSettings.get("issuerServer"), "issuer.url");
        setSystemPropertyIfNotEmpty(serverSettings.get("verifierServer"), "verifier.url");
        setSystemPropertyIfNotEmpty(serverSettings.get("caServer"), "cas.url");

        log.info("Server settings loaded from config.json to system properties");
    }

    private void setSystemPropertyIfNotEmpty(String value, String systemPropertyKey) {
        if (value != null && !value.trim().isEmpty()) {
            System.setProperty(systemPropertyKey, value.trim());
            log.info("Set {} = {}", systemPropertyKey, value.trim());
        }
    }



}