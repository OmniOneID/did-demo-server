데모 서버
==

데모 서버 저장소에 오신 것을 환영합니다. <br>
이 저장소는 데모 서버의 소스 코드, 문서, 그리고 관련 리소스를 포함하고 있습니다.

## S/W 사양
| 구분              | 내용                                 |
|-------------------|--------------------------------------|
| OS                | macOS / Linux / Windows 10 이상       |
| Language          | Java 21 이상                          |
| IDE               | IntelliJ IDEA                         |
| Build System      | Gradle 7.0 이상                        |
| Compatibility     | JDK 21 이상                            |
| 기타 요구사항      | 최소 2GB RAM, 10GB 디스크 공간 이상     |

# OpenDID 시연 영상

OpenDID 시연 영상은 다음 시나리오를 다룹니다. 발급과 제출 시나리오는 OpenDID VC, SD-JWT VC, mdoc 세 가지 형식으로 각각 보여 줍니다.

## 1. 사용자 등록
https://github.com/user-attachments/assets/b3872866-c867-4e75-840d-373df80ddd50
- **설명**: 사용자가 앱에서 데모 사용자로 등록하고 지갑 잠금과 PIN을 설정합니다.

## 2. VC 발급 (사용자 시작)
- **설명**: 사용자가 앱의 목록에서 VC 플랜을 고르고, 담을 정보를 입력해 VC를 발급받습니다.

### 2.1 OpenDID VC
https://github.com/user-attachments/assets/cced035c-394d-4e59-a89c-00fbdd13737a

### 2.2 SD-JWT VC
https://github.com/user-attachments/assets/62221a09-f2fc-409c-8075-97b843ce2935

### 2.3 mdoc
https://github.com/user-attachments/assets/056c25a2-09f3-4366-b7a8-efc2c82b84d7

## 3. VC 발급 (Issuer 시작)
- **설명**: 사용자가 데모 사이트에서 정보를 입력하고 발급을 요청합니다. 앱으로 사이트에 표시된 QR 코드를 스캔하면 VC가 발급됩니다. SD-JWT VC와 mdoc은 OID4VCI로 발급되며, 앱에서 사이트에 표시된 트랜잭션 코드를 입력합니다.

### 3.1 OpenDID VC
https://github.com/user-attachments/assets/65c7ab3c-0863-4c74-96c8-5c529156cafc

### 3.2 OpenDID VC (ZKP 포함)
https://github.com/user-attachments/assets/9a9a9d2b-9af9-4040-9266-fc5feb844340
- **설명**: 나이 같은 ZKP 정보를 함께 담은 OpenDID VC를 발급합니다. 6.2의 조건 증명에서 이 VC를 사용합니다.

### 3.3 SD-JWT VC
https://github.com/user-attachments/assets/b005503d-6364-462a-bd1c-1aeec86c2842

### 3.4 mdoc
https://github.com/user-attachments/assets/b1b3b4f8-692d-440d-940e-7ba9ee1b7dab

## 4. VP 제출 (전체 제출)
- **설명**: 사용자가 데모 사이트에서 검증 정책을 고르고 앱으로 QR 코드를 스캔합니다. 앱에 요청된 항목이 표시되고, PIN을 입력하면 제출됩니다. OpenDID VC는 OpenDID 프로토콜로, SD-JWT VC와 mdoc은 OID4VP로 제출합니다.

### 4.1 OpenDID VC
https://github.com/user-attachments/assets/131eebef-8061-40a1-8bad-48480cc57568

### 4.2 SD-JWT VC
https://github.com/user-attachments/assets/606348e8-0707-40b3-951d-f529f27a49a3

### 4.3 mdoc
https://github.com/user-attachments/assets/db509dcf-3350-49f1-bb0f-a787e38cbe8d

## 5. VP 제출 (선택적 제출)
- **설명**: 4와 같은 순서로 진행합니다. 앱이 필수 항목과 선택 항목을 나누어 보여 주고, 사용자는 제출할 선택 항목을 고릅니다.

### 5.1 OpenDID VC
https://github.com/user-attachments/assets/68b8c85b-0c95-4a61-831e-33de7de1c811

### 5.2 SD-JWT VC
https://github.com/user-attachments/assets/9f4a55fe-7fcd-410e-bcb0-332585491905

### 5.3 mdoc
https://github.com/user-attachments/assets/0269b26c-8aeb-49b4-b028-506f3c593b76

## 6. ZKP 증명

### 6.1 속성 공개
https://github.com/user-attachments/assets/3ce666a3-1b22-417d-a7d0-ecaf7f133bc6
- **설명**: 사용자가 OpenDID VC의 속성 가운데 검증자에게 공개할 것을 고릅니다.

### 6.2 조건 증명
https://github.com/user-attachments/assets/1785b631-8f7e-4617-9e29-8186cc63dbd4
- **설명**: 나이 같은 값을 공개하지 않고, 그 값이 조건을 만족한다는 사실만 증명합니다.

## 7. 근거리 제출 (mdoc)
https://github.com/user-attachments/assets/824627b4-b4b2-4829-9ffb-3a7f643dbbae
- **설명**: ISO/IEC 18013-5에 따라 사용자가 검증자의 앱에 mdoc을 대면으로 제시합니다. 검증자 앱이 사용자 앱에 표시된 QR 코드를 스캔하면 두 기기가 직접 연결되어 데이터를 주고받습니다.

## 폴더 구조
프로젝트 디렉토리의 주요 폴더 및 문서 개요:

```
did-demo-server
├── CHANGELOG.md
├── CLA.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── dependencies-license.md
├── MAINTAINERS.md
├── README.md
├── RELEASE-PROCESS.md
├── SECURITY.md
├── docs
│   └── installation
│       └── OpenDID_DemoServer_InstallationAndOperation_Guide.md
│       └── OpenDID_DemoServer_InstallationAndOperation_Guide_ko.md
└── source
    └── demo
        ├── gradle
        ├── libs
            └── did-crypto-sdk-server-2.0.0.jar
        └── src
        └── build.gradle
        └── README.md
```

<br/>

디렉토리의 각 폴더와 파일에 대한 설명:

| 이름                     | 설명                                               |
| ----------------------- | ------------------------------------------------- |
| CHANGELOG.md            | 프로젝트의 버전 변경 사항                            |
| CODE_OF_CONDUCT.md      | 기여자를 위한 행동 강령                              |
| CONTRIBUTING.md         | 기여 가이드라인 및 절차                              |
| LICENSE                 | 라이선스                                           |
| dependencies-license.md | 프로젝트 의존성에 대한 라이선스 정보                  |
| MAINTAINERS.md         | 프로젝트 관리자를 위한 가이드라인                     |
| RELEASE-PROCESS.md     | 새 버전 릴리스 절차                                 |
| SECURITY.md            | 보안 정책 및 취약점 보고 방법                        |
| docs                   | 문서                                              |
| ┖ installation         | 설치 및 설정 가이드                                |
| source                 | 소스 코드                                         |
| ┖ did-demo-server      | 데모 서버 소스 코드 및 빌드 파일                     |
| &nbsp;&nbsp;&nbsp;┖ gradle               | Gradle 빌드 설정 및 스크립트                        |
| &nbsp;&nbsp;&nbsp;┖ libs                 | 외부 라이브러리 및 의존성                           |
| &nbsp;&nbsp;&nbsp;┖ sample               | 샘플 파일                                         |
| &nbsp;&nbsp;&nbsp;┖ src                  | 메인 소스 코드 디렉토리                             |
| &nbsp;&nbsp;&nbsp;┖ build.gradle         | Gradle 빌드 설정 파일                              |
| &nbsp;&nbsp;&nbsp;┖ README.md            | 소스 코드 개요 및 가이드                            |

<br/>

## 라이브러리

이 프로젝트에서 사용되는 라이브러리는 두 가지 주요 카테고리로 구성됩니다:

1. **Open DID 라이브러리**: 이 라이브러리들은 Open DID 프로젝트에서 개발되었으며 [libs 폴더](source/did-demo-server/libs)에서 사용할 수 있습니다. 포함된 항목:

   - `did-crypto-sdk-server-2.0.0.jar`

2. **서드파티 라이브러리**: 이 라이브러리들은 [build.gradle](source/did-demo-server/build.gradle) 파일을 통해 관리되는 오픈소스 의존성입니다. 서드파티 라이브러리 및 해당 라이선스에 대한 자세한 목록은 [dependencies-license.md](dependencies-license.md) 파일을 참조하세요.

## 설치 및 운영 가이드

데모 서버 설치 및 구성에 대한 자세한 지침은 아래 가이드를 참조하세요:
- [OpenDID 데모 서버 설치 및 운영 가이드](docs/installation/OpenDID_DemoServer_InstallationAndOperation_Guide_ko.md)

## 변경 이력

변경 이력은 버전별 변경 사항과 업데이트에 대한 자세한 기록을 제공합니다. 다음에서 확인할 수 있습니다:
- [변경 이력](./CHANGELOG.md)

## 기여하기

프로젝트에 풀 리퀘스트를 제출하는 과정과 행동 강령에 대한 자세한 내용은 [CONTRIBUTING.md](CONTRIBUTING.md)와 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)를 참조하세요.

## 라이선스
[Apache 2.0](LICENSE)
