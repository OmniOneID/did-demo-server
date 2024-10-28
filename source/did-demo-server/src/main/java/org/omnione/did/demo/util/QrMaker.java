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

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.omnione.did.demo.dto.QrImageData;


import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class QrMaker {
    private static final QRCodeWriter QR_CODE_WRITER = new QRCodeWriter();
    private static final String DEFAULT_IMAGE_FORMAT = "PNG";
    private static final int DEFAULT_WIDTH = 300;
    private static final int DEFAULT_HEIGHT = 300;

    public static QrImageData makeQrImage(final Object data) throws IOException, WriterException {
        byte[] qrImage;
        qrImage = makeQrImage(JsonUtil.serializeToJson(data), DEFAULT_IMAGE_FORMAT, DEFAULT_WIDTH, DEFAULT_HEIGHT);

        QrImageData qrImageData = new QrImageData();
        qrImageData.setFormat("image");
        qrImageData.setMediaType(DEFAULT_IMAGE_FORMAT);
        qrImageData.setQrIamge(qrImage);

        return qrImageData;
    }

    public static byte[] makeQrImage(final String contents, final String format, int width, int height) throws IOException, WriterException {
        BitMatrix bitMatrix = makeQrBitMatrix(contents, width, height);

        try (ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream()) {
            MatrixToImageWriter.writeToStream(bitMatrix, format, pngOutputStream);
            return pngOutputStream.toByteArray();
        }
    }

    public static BitMatrix makeQrBitMatrix(String contents, int width, int height) throws WriterException {
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.MARGIN, 0);

        return QR_CODE_WRITER.encode(contents, BarcodeFormat.QR_CODE, width, height, hints);
    }
}
