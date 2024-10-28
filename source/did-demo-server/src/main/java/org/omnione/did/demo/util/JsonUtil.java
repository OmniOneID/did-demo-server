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

package org.omnione.did.demo.util;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Utility class for JSON serialization and deserialization.
 * This class provides methods to serialize objects to JSON strings, sort the keys,
 * and remove all whitespace. It is used in OpenDID for serializing the original text
 * when signing.
 *
 * Example usage:
 * <pre>
 *     MyObject obj = new MyObject();
 *     String jsonString = JsonUtil.serializeAndSort(obj);
 * </pre>
 *
 */
public class JsonUtil {
    private static final ObjectMapper mapper = new ObjectMapper();

    static {
        mapper.setSerializationInclusion(Include.NON_NULL);
        mapper.configure(SerializationFeature.ORDER_MAP_ENTRIES_BY_KEYS, true);
    }

    /**
     * Serialize an object to a JSON string, sorts the keys, and removes all whitespace.
     * This method is used in OpenDID for serializing the original text when signing.
     *
     */
    public static String serializeAndSort(Object obj) throws JsonProcessingException {
        String jsonString = mapper.writeValueAsString(obj);
        ObjectNode node = (ObjectNode) mapper.readTree(jsonString);
        jsonString = mapper.writeValueAsString(node);
        return jsonString.replaceAll("\\s", "");
    }

    /**
     * Convert any object to a JSON string.
     */
    public static String serializeToJson(Object obj) throws JsonProcessingException {
        return mapper.writeValueAsString(obj);
    }
}