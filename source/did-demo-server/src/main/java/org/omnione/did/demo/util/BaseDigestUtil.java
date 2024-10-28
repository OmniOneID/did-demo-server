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

import org.omnione.did.crypto.enums.DigestType;
import org.omnione.did.crypto.exception.CryptoException;
import org.omnione.did.crypto.util.DigestUtils;

import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;

/**
 * Utility class for generating hash values using various algorithms.
 * This class provides methods to generate SHA-256 hashes from byte arrays and strings.
 * It also allows generating hashes with specified algorithms.
 *
 * Methods included:
 * - generateHash(byte[] input)
 * - generateHash(String input)
 * - generateHash(byte[] input, DigestType digestType)
 * Example usage:
 * <pre>
 *     byte[] hash = HashUtil.generateHash("Hello, World!");
 * </pre>
 *
 */
public class BaseDigestUtil {
    public static byte[] generateHash(byte[] input) {
        return generateHash(input, DigestType.SHA256);
    }

    public static byte[] generateHash(String input) throws NoSuchAlgorithmException {
        return generateHash(input.getBytes(StandardCharsets.UTF_8), DigestType.SHA256);
    }

    public static byte[] generateHash(byte[] input, DigestType digestType)  {
        try {
            return DigestUtils.getDigest(input, digestType);
        } catch (CryptoException e) {
            throw new RuntimeException("Error occurred while generating hash: " + e.getMessage());
        }
    }
}
