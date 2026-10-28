/*
 * Copyright 2024 OmniOne.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.omnione.did.demo.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Proxy to the Issuer server for OID4VC issuance.
 * Calling the Issuer server directly from the browser is blocked by the CORS preflight,
 * so demo-server exposes same-origin endpoints and makes the server-to-server HTTP calls instead.
 */
@RestController
@RequestMapping("/demo/api")
@RequiredArgsConstructor
@Slf4j
public class OID4VCController {

    private static final String ISSUER_QR_PATH = "/qr-data/generate-qr";
    private static final String ISSUER_METADATA_PATH = "/.well-known/openid-credential-issuer";
    private static final String CONFIGS_KEY = "credential_configurations_supported";
    private static final int CONNECT_TIMEOUT_MS = 5000;
    private static final int READ_TIMEOUT_MS = 10000;
    private static final String ISSUER_UNAVAILABLE_MSG =
            "Cannot reach the Issuer server — check that it is running";
    private static final String ISSUER_NOT_CONFIGURED_MSG =
            "Issuer server is not configured — set it in Server Settings";

    private final Environment environment;

    @PostMapping("/oid4vc-offer")
    public ResponseEntity<?> proxyOfferQr(@RequestBody Map<String, Object> body) {
        String origin = resolveIssuerOrigin();
        if (origin == null) {
            log.warn("issuer.url not configured — cannot forward OID4VC offer request");
            return ResponseEntity.status(503).body(Map.of(
                    "success", false,
                    "error", "ISSUER_NOT_CONFIGURED",
                    "message", ISSUER_NOT_CONFIGURED_MSG
            ));
        }

        String targetUrl = origin + ISSUER_QR_PATH;
        RestTemplate restTemplate = createRestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        log.info("Forwarding OID4VC offer → {} (userId={}, credentialConfigurationId={})",
                targetUrl, body.get("userId"), body.get("credentialConfigurationId"));

        try {
            ResponseEntity<Object> upstream = restTemplate.postForEntity(targetUrl, request, Object.class);
            return ResponseEntity.status(upstream.getStatusCode()).body(upstream.getBody());
        } catch (HttpStatusCodeException e) {
            log.warn("Issuer returned {} for OID4VC offer: {}", e.getStatusCode(), e.getResponseBodyAsString());
            return ResponseEntity.status(e.getStatusCode()).body(Map.of(
                    "success", false,
                    "error", "ISSUER_ERROR",
                    "message", "Issuer responded with error: " + e.getStatusCode(),
                    "upstreamBody", e.getResponseBodyAsString()
            ));
        } catch (Exception e) {
            log.error("Failed to reach Issuer at {}", targetUrl, e);
            return ResponseEntity.status(502).body(unavailableBody(origin, e));
        }
    }

    /**
     * Relays the Issuer metadata ({issuer}/.well-known/openid-credential-issuer) and returns
     * only the keys of credential_configurations_supported that can be issued.
     * It queries the same issuer.url that issuance (generate-qr) uses,
     * so the frontend can use the returned ids as-is in the issuance request.
     */
    @GetMapping("/oid4vc-metadata")
    public ResponseEntity<?> proxyMetadata() {
        String origin = resolveIssuerOrigin();
        if (origin == null) {
            log.warn("issuer.url not configured — cannot fetch OID4VC metadata");
            return ResponseEntity.status(503).body(Map.of(
                    "success", false,
                    "error", "ISSUER_NOT_CONFIGURED",
                    "message", ISSUER_NOT_CONFIGURED_MSG
            ));
        }

        String targetUrl = origin + ISSUER_METADATA_PATH;
        RestTemplate restTemplate = createRestTemplate();

        log.info("Fetching OID4VC metadata → {}", targetUrl);

        try {
            ResponseEntity<Map> upstream = restTemplate.getForEntity(targetUrl, Map.class);
            List<String> ids = extractCredentialConfigIds(upstream.getBody());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "ids", ids
            ));
        } catch (HttpStatusCodeException e) {
            log.warn("Issuer returned {} for metadata: {}", e.getStatusCode(), e.getResponseBodyAsString());
            return ResponseEntity.status(e.getStatusCode()).body(Map.of(
                    "success", false,
                    "error", "ISSUER_ERROR",
                    "message", "Issuer responded with error: " + e.getStatusCode()
            ));
        } catch (Exception e) {
            log.error("Failed to reach Issuer metadata at {}", targetUrl, e);
            return ResponseEntity.status(502).body(unavailableBody(origin, e));
        }
    }

    /**
     * Response body when the Issuer cannot be reached.
     * message is shown in the UI as-is (e.g. in the select box), so it holds only a short notice;
     * the raw exception text goes to detail and is used only for the console and debugging.
     */
    private Map<String, Object> unavailableBody(String issuerUrl, Exception e) {
        String detail = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
        return Map.of(
                "success", false,
                "error", "ISSUER_UNAVAILABLE",
                "message", ISSUER_UNAVAILABLE_MSG,
                "issuerUrl", issuerUrl,
                "detail", detail
        );
    }

    /**
     * Derives the origin (scheme://host:port) from the issuer.url property.
     * Returns null if it is not set or cannot be parsed.
     */
    private String resolveIssuerOrigin() {
        String issuerUrl = environment.getProperty("issuer.url", "");
        if (issuerUrl.isBlank()) {
            return null;
        }
        try {
            URI origin = URI.create(issuerUrl.trim()).resolve("/");
            return origin.toString().replaceAll("/$", "");
        } catch (IllegalArgumentException e) {
            log.error("Invalid issuer.url: {}", issuerUrl, e);
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    private List<String> extractCredentialConfigIds(Map<String, Object> metadata) {
        List<String> ids = new ArrayList<>();
        if (metadata == null) {
            return ids;
        }
        Object configs = metadata.get(CONFIGS_KEY);
        if (configs instanceof Map<?, ?> configMap) {
            for (Object key : configMap.keySet()) {
                ids.add(String.valueOf(key));
            }
        }
        return ids;
    }

    private RestTemplate createRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(CONNECT_TIMEOUT_MS);
        factory.setReadTimeout(READ_TIMEOUT_MS);
        restTemplate.setRequestFactory(factory);
        return restTemplate;
    }
}
