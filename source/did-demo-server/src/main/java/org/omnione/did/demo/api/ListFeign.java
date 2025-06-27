package org.omnione.did.demo.api;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * ListFeign This class is a Feign client for the TAS API.
 */
@FeignClient(value = "List", url = "${dynamic.tas.url:${tas.url}}", path = "/list/api/v1")
public interface ListFeign {

    @GetMapping("/vcplan/list/issuer")
    String requestVcPlanList();

    @GetMapping("/vcschema/list")
    String requestVcSchemaList();

    @GetMapping("/credential-schema")
    String requestCredentialSchemaList(@RequestParam String credentialSchemaId);
}