package org.omnione.did.demo.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.omnione.did.base.config.ConfigService;
import org.omnione.did.demo.api.*;
import org.omnione.did.demo.dto.SaveUserInfoReqDto;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DemoServiceImplTest {
    @Mock VerifierFeign verifierFeign;
    @Mock TasFeign tasFeign;
    @Mock CasFeign casFeign;
    @Mock IssuerFeign issuerFeign;
    @Mock IssuerAdminFeign issuerAdminFeign;
    @Mock ConfigService configService;
    @Mock ListFeign listFeign;

    @Test
    void savingVcInfoDoesNotRegisterAnotherCasUser() {
        var service = new DemoServiceImpl(verifierFeign, tasFeign, casFeign,
                issuerFeign, issuerAdminFeign, configService, listFeign, new ObjectMapper());
        var request = SaveUserInfoReqDto.builder()
                .did("did:omn:second")
                .vcSchemaId("vc.schema.driver.license")
                .fields(Map.of("driver.license.licenseNumber", "2"))
                .build();

        service.saveVcInfo(request);

        var sent = ArgumentCaptor.forClass(SaveUserInfoReqDto.class);
        verify(issuerAdminFeign).saveUserInfo(sent.capture());
        assertEquals("did:omn:second", sent.getValue().getDid());
        assertEquals("{\"driver.license.licenseNumber\":\"2\"}", sent.getValue().getUserInfo());
        assertNull(sent.getValue().getPii());
        verifyNoInteractions(casFeign);
    }
}
