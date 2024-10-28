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

package org.omnione.did.base.aop;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.text.MessageFormat;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.util.TimeZone;

@Slf4j
@Aspect
@Component
public class ControllerLogAspects {

    @Around(value = "execution(* org.omnione.did..*Controller.*(..)))")
    public Object requestChecker(ProceedingJoinPoint joinPoint) throws Throwable {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        debugControllerLog("{0}.{1} - Start", new Object[]{className, methodName});
        debugControllerLog("{0}.{1} - requestData : {2}", new Object[]{className, methodName, convertToJsonString(joinPoint.getArgs())});
        Object result = joinPoint.proceed();
        debugControllerLog("{0}.{1} - responseData: {2}", new Object[]{className, methodName, convertToJsonString(result)});
        debugControllerLog("{0}.{1} - finish", new Object[]{className, methodName});

        return result;
    }

    private static final ObjectMapper OBJECT_MAPPER = JsonMapper.builder()
            .configure(MapperFeature.SORT_PROPERTIES_ALPHABETICALLY, true)
            .build()
            .setSerializationInclusion(JsonInclude.Include.NON_NULL)
            .configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false)
            .registerModule(new JavaTimeModule())
            .setDateFormat(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'"))
            .setTimeZone(TimeZone.getTimeZone(ZoneId.of("UTC")));

    public String convertToJsonString(final Object msg) throws JsonProcessingException {
        return OBJECT_MAPPER.writeValueAsString(msg).trim();
    }

    public static void debugControllerLog(String pattern, Object[] args) {
        try {
            String formattedMessage = MessageFormat.format(pattern, args);
            log.debug(formattedMessage);
        } catch (IllegalArgumentException | NullPointerException e) {
            log.error("IllegalArgumentException | NullPointerException : " + e.getMessage());
        }
    }

}
