데모 서버
==

데모 서버 저장소에 오신 것을 환영합니다. <br>
이 저장소는 데모 서버의 소스 코드, 문서, 그리고 관련 리소스를 포함하고 있습니다.

# OpenDID 시연 영상

OpenDID 시연 영상은 다음 네 가지 주요 시나리오를 포함합니다:

## 1. 사용자 등록
https://github.com/user-attachments/assets/e503d751-cc6d-4f0f-acf4-eeb0d7cdb141
- [사용자등록_데모_샘플(영상)](videos/OpenDID_Demo_UserRegistration.mov)
- **설명**: 사용자가 앱을 사용하여 직접 국가 신분증 VC를 발급하는 시나리오입니다.

## 2. VC 발급 (앱 - 국가 신분증)
https://github.com/user-attachments/assets/001a988d-84cc-44f3-9411-c281f07ed02e
- [VC발급_앱_데모_샘플(영상)](videos/OpenDID_Demo_VCIssuance_App.mov)
- **설명**: 사용자가 앱을 사용하여 직접 국가 신분증 VC를 발급하는 시나리오입니다.

## 3. VC 발급 (데모 - 모바일 운전면허증)
https://github.com/user-attachments/assets/a512d4f7-74be-4dad-b800-6cb916f71ad3
- [VC발급_웹_데모_샘플(영상)](videos/OpenDID_Demo_VCIssuance_Demo.mov)
- **설명**: 사용자가 데모 사이트로부터 모바일 운전면허증 VC 발급 요청을 받는 시나리오를 보여줍니다.

## 4. VP 제출
https://github.com/user-attachments/assets/e5e606da-8430-46db-ab44-a4518b64a236
- [VP제출_데모_샘플(영상)](videos/OpenDID_Demo_VPSubmission.mov)
- **설명**: 사용자가 데모 사이트로부터 VP 제출 요청을 받은 후 앱을 통해 검증 가능한 제시(VP)를 제출하는 시나리오입니다.

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
└── videos
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
| videos                 | 시연 영상                                         |

<br/>

## 라이브러리

이 프로젝트에서 사용되는 라이브러리는 두 가지 주요 카테고리로 구성됩니다:

1. **Open DID 라이브러리**: 이 라이브러리들은 Open DID 프로젝트에서 개발되었으며 [libs 폴더](source/did-demo-server/libs)에서 사용할 수 있습니다. 포함된 항목:

   - `did-crypto-sdk-server-2.0.0.jar`

2. **서드파티 라이브러리**: 이 라이브러리들은 [build.gradle](source/did-demo-server/build.gradle) 파일을 통해 관리되는 오픈소스 의존성입니다. 서드파티 라이브러리 및 해당 라이선스에 대한 자세한 목록은 [dependencies-license.md](dependencies-license.md) 파일을 참조하세요.

## 설치 및 운영 가이드

데모 서버 설치 및 구성에 대한 자세한 지침은 아래 가이드를 참조하세요:
- [OpenDID 데모 서버 설치 및 운영 가이드](docs/installation/OpenDID_DemoServer_InstallationAndOperation_Guide.md)

## 변경 이력

변경 이력은 버전별 변경 사항과 업데이트에 대한 자세한 기록을 제공합니다. 다음에서 확인할 수 있습니다:
- [변경 이력](./CHANGELOG.md)

## 기여하기

프로젝트에 풀 리퀘스트를 제출하는 과정과 행동 강령에 대한 자세한 내용은 [CONTRIBUTING.md](CONTRIBUTING.md)와 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)를 참조하세요.

## 라이선스
[Apache 2.0](LICENSE)
