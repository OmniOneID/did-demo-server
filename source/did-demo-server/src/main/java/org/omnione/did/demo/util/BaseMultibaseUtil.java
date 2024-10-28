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

import org.omnione.did.crypto.enums.MultiBaseType;
import org.omnione.did.crypto.exception.CryptoException;
import org.omnione.did.crypto.util.MultiBaseUtils;

/**
 * The MultiBaseUtil class provides utility methods for encoding and decoding data using multibase encoding schemes.
 * It is designed to facilitate the conversion of data to and from various base encoding formats,
 * ensuring compatibility and ease of use across different systems and protocols.
 *
 */
public class BaseMultibaseUtil {

    /**
     * Encode a given string using the Base58btc multibase encoding scheme.
     * This method converts the input string to a byte array using UTF-8 encoding
     * before performing the encoding.
     *
     */
    public static String encode(byte[] inputData) {
        try {
            return MultiBaseUtils.encode(inputData, MultiBaseType.base64);
        } catch (CryptoException e) {
            System.out.println("Error occurred while encoding the input data.");
            throw new RuntimeException("Error occurred while encoding the input data.");
        }
    }

    /**
     * Encode a given string using the specified multibase encoding scheme.
     * This method converts the input string to a byte array using UTF-8 encoding
     * before performing the encoding.
     *
     */
    public static String encode(byte[] inputData, MultiBaseType multiBaseType) {
        try {
            return MultiBaseUtils.encode(inputData, multiBaseType);
        } catch (CryptoException e) {
            System.out.println("Error occurred while encoding the input data.");
            throw new RuntimeException("Error occurred while encoding the input data.");
        }
    }

    /**
     * Decode a given string from the Base58btc multibase encoding scheme.
     * This method converts the encoded string back to its original byte array form.
     *
     */
    public static byte[] decode(String encodedData) {
        try {
            byte[] decodedBytes = MultiBaseUtils.decode(encodedData);
            if (decodedBytes == null) {
                System.out.println("Error occurred while decoding the input data.");
                throw new RuntimeException("Error occurred while decoding the input data.");
            }
            return decodedBytes;
        }  catch (CryptoException e) {
            System.out.println("Error occurred while decoding the input data.");
            throw new RuntimeException("Error occurred while decoding the input data.");
        }
    }
}
