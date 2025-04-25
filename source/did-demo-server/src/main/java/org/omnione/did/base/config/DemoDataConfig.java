package org.omnione.did.base.config;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class DemoDataConfig {
    private Map<String, String> serverSettings;

    private String tasServer;
    private String issuerServer;
    private String caServer;
    private String verifierServer;
    private List<VcPlan> vcPlans;
    private Map<String, Object> userInfo;

    @Data
    public static class VcPlan {
        private String vcPlanId;
        private String name;
        private String description;
    }

    private List<VpPolicy> vpPolicies;

    @Data
    public static class VpPolicy {
        private int id;
        private String policyId;
        private String policyTitle;
        private String payloadService;
    }

    private String issuer;
    private String currentVcPlan;
    private String currentVpPolicy;
    private String did;
    private String email;
    private String username;
    private String pii;
}