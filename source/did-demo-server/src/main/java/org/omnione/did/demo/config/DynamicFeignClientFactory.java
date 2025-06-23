package org.omnione.did.demo.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.omnione.did.demo.api.*;
import org.springframework.cloud.openfeign.FeignClientBuilder;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class DynamicFeignClientFactory {
    
    private final ApplicationContext applicationContext;
    private final Environment environment;
    
    // 캐시된 클라이언트들 - URL이 변경되면 클리어됨
    private final Map<String, Object> clientCache = new ConcurrentHashMap<>();
    private volatile String lastTasUrl = "";
    private volatile String lastIssuerUrl = "";
    private volatile String lastCasUrl = "";
    private volatile String lastVerifierUrl = "";
    
    public TasFeign getTasFeign() {
        String currentUrl = environment.getProperty("tas.url", "");
        if (!currentUrl.equals(lastTasUrl)) {
            clientCache.remove("tasFeign");
            lastTasUrl = currentUrl;
        }
        
        return (TasFeign) clientCache.computeIfAbsent("tasFeign", k -> 
            createFeignClient(TasFeign.class, currentUrl, "tas/api/v1")
        );
    }
    
    public IssuerFeign getIssuerFeign() {
        String currentUrl = environment.getProperty("issuer.url", "");
        if (!currentUrl.equals(lastIssuerUrl)) {
            clientCache.remove("issuerFeign");
            lastIssuerUrl = currentUrl;
        }
        
        return (IssuerFeign) clientCache.computeIfAbsent("issuerFeign", k -> 
            createFeignClient(IssuerFeign.class, currentUrl, "/issuer/api/v1")
        );
    }
    
    public CasFeign getCasFeign() {
        String currentUrl = environment.getProperty("cas.url", "");
        if (!currentUrl.equals(lastCasUrl)) {
            clientCache.remove("casFeign");
            lastCasUrl = currentUrl;
        }
        
        return (CasFeign) clientCache.computeIfAbsent("casFeign", k -> 
            createFeignClient(CasFeign.class, currentUrl, "/cas/api/v1")
        );
    }
    
    public VerifierFeign getVerifierFeign() {
        String currentUrl = environment.getProperty("verifier.url", "");
        if (!currentUrl.equals(lastVerifierUrl)) {
            clientCache.remove("verifierFeign");
            lastVerifierUrl = currentUrl;
        }
        
        return (VerifierFeign) clientCache.computeIfAbsent("verifierFeign", k -> 
            createFeignClient(VerifierFeign.class, currentUrl, "/verifier")
        );
    }
    
    public ListFeign getListFeign() {
        // ListFeign은 어떤 서버를 사용하는지 확인 필요 - 일단 TAS로 가정
        String currentUrl = environment.getProperty("tas.url", "");
        if (!currentUrl.equals(lastTasUrl)) {
            clientCache.remove("listFeign");
            lastTasUrl = currentUrl;
        }
        
        return (ListFeign) clientCache.computeIfAbsent("listFeign", k -> 
            createFeignClient(ListFeign.class, currentUrl, "")
        );
    }
    
    public IssuerAdminFeign getIssuerAdminFeign() {
        String currentUrl = environment.getProperty("issuer.url", "");
        if (!currentUrl.equals(lastIssuerUrl)) {
            clientCache.remove("issuerAdminFeign");
            lastIssuerUrl = currentUrl;
        }
        
        return (IssuerAdminFeign) clientCache.computeIfAbsent("issuerAdminFeign", k -> 
            createFeignClient(IssuerAdminFeign.class, currentUrl, "")
        );
    }
    
    private <T> T createFeignClient(Class<T> type, String url, String path) {
        if (url == null || url.trim().isEmpty()) {
            throw new IllegalArgumentException("Server URL is not configured for " + type.getSimpleName());
        }
        
        try {
            FeignClientBuilder builder = new FeignClientBuilder(applicationContext);
            T client = builder.forType(type, type.getSimpleName())
                             .url(url.trim())
                             .path(path)
                             .build();
                             
            log.debug("Created dynamic Feign client {} for URL: {}{}", type.getSimpleName(), url, path);
            return client;
            
        } catch (Exception e) {
            log.error("Failed to create Feign client {} for URL: {}", type.getSimpleName(), url, e);
            throw new RuntimeException("Failed to create Feign client " + type.getSimpleName(), e);
        }
    }
    
    /**
     * 모든 캐시된 클라이언트를 클리어합니다.
     */
    public void clearCache() {
        clientCache.clear();
        lastTasUrl = "";
        lastIssuerUrl = "";
        lastCasUrl = "";
        lastVerifierUrl = "";
        log.info("Cleared all Feign client cache");
    }
    
    /**
     * 현재 설정된 URL들을 반환합니다.
     */
    public Map<String, String> getCurrentUrls() {
        Map<String, String> urls = new HashMap<>();
        urls.put("tas", environment.getProperty("tas.url", ""));
        urls.put("issuer", environment.getProperty("issuer.url", ""));
        urls.put("cas", environment.getProperty("cas.url", ""));
        urls.put("verifier", environment.getProperty("verifier.url", ""));
        return urls;
    }
}
