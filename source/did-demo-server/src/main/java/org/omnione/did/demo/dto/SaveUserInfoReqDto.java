package org.omnione.did.demo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SaveUserInfoReqDto {
    private String firstname;
    private String lastname;
    private String did;
    private String email;
    private String pii;

    private String vcSchemaId;
    private String vcSchemaTitle;
    private String vcSchemaIndex; // 프론트엔드에서 선택한 스키마 인덱스

    private Map<String, String> fields;

    private String userInfo;
}