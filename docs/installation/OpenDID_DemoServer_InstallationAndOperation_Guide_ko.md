---
puppeteer:
    pdf:
        format: A4
        displayHeaderFooter: true
        landscape: false
        scale: 0.8
        margin:
            top: 1.2cm
            right: 1cm
            bottom: 1cm
            left: 1cm
    image:
        quality: 100
        fullPage: false
---

Open DID Demo Server Installation And Operation Guide
==

- Date: 2024-09-02
- Version: v1.0.0

목차
==

- [목차](#목차)
- [1. 소개](#1-소개)
  - [1.1. 개요](#11-개요)
  - [1.2. Demo 서버 정의](#12-demo-서버-정의)
  - [1.3. 시스템 요구 사항](#13-시스템-요구-사항)
- [2. 사전 준비 사항](#2-사전-준비-사항)
  - [2.1. Git 설치](#21-git-설치)
- [3. GitHub에서 소스 코드 복제하기](#3-github에서-소스-코드-복제하기)
  - [3.1. 소스코드 복제](#31-소스코드-복제)
  - [3.2. 디렉토리 구조](#32-디렉토리-구조)
- [4. 서버 구동 방법](#4-서버-구동-방법)
  - [4.1. IntelliJ IDEA로 구동하기 (Gradle 지원)](#41-intellij-idea로-구동하기-gradle-지원)
    - [4.1.1. IntelliJ IDEA 설치 및 설정](#411-intellij-idea-설치-및-설정)
    - [4.1.2. IntelliJ에서 프로젝트 열기](#412-intellij에서-프로젝트-열기)
    - [4.1.3. Gradle 빌드](#413-gradle-빌드)
    - [4.1.4. 서버 구동](#414-서버-구동)
    - [4.1.5. 서버 설정](#415-서버-설정)
  - [4.2. 콘솔 명령어로 구동하기](#42-콘솔-명령어로-구동하기)
    - [4.2.1. Gradle 빌드 명령어](#421-gradle-빌드-명령어)
    - [4.2.2. 서버 구동 방법](#422-서버-구동-방법)
    - [4.2.3. 서버 설정 방법](#423-서버-설정-방법)
- [5. 설정 가이드](#5-설정-가이드)
  - [5.1. application.yml](#51-applicationyml)
    - [5.1.1. Spring 기본 설정](#511-spring-기본-설정)
    - [5.1.2. Jackson 기본 설정](#512-jackson-기본-설정)
    - [5.1.3. 서버 설정](#513-서버-설정)
    - [5.1.4. Open DID 서버 통신 설정](#514-open-did-서버-통신-설정)
  - [5.2. application-logging.yml](#52-application-loggingyml)
    - [5.2.1. 로깅 설정](#521-로깅-설정)
  - [5.3. application-demo.yml](#53-application-demoyml)
  - [5.4. application-spring-docs.yml](#54-application-spring-docsyml)
    

# 1. 소개

## 1.1. 개요
본 문서는 Demo 서버의 설치 및 구동에 관한 가이드를 제공합니다. Demo 서버의 설치 과정, 설정 방법, 그리고 구동 절차를 단계별로 설명하여, 사용자가 이를 효율적으로 설치하고 운영할 수 있도록 안내합니다.

OpenDID의 전체 설치에 대한 가이드는 [Open DID Installation Guide]를 참고해 주세요.

<br/>

## 1.2. Demo 서버 정의

Demo 서버는 Open DID에서 제공하는 데모 프로젝트입니다.<br>
VC 발급, VP 제출, 사용자 등록 기능을 테스트할 수 있는 화면을 제공합니다.

<br/>

## 1.3. 시스템 요구 사항
- **Java 17** 이상
- **Gradle 7.0** 이상
- **Docker** 및 **Docker Compose** (Docker 사용 시)
- 최소 **2GB RAM** 및 **10GB 디스크 공간**

<br/>

# 2. 사전 준비 사항

이 장에서는 Open DID 프로젝트의 구성요소를 설치하기 전, 사전에 필요한 준비 항목들을 안내합니다.

## 2.1. Git 설치

`Git`은 분산 버전 관리 시스템으로, 소스 코드의 변경 사항을 추적하고 여러 개발자 간의 협업을 지원합니다. Git은 Open DID 프로젝트의 소스 코드를 관리하고 버전 관리를 위해 필수적입니다. 

설치가 성공하면 다음 명령어를 사용하여 Git의 버전을 확인할 수 있습니다.

```bash
git --version
```

> **참고 링크**
> - [Git 설치 가이드](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

<br/>


# 3. GitHub에서 소스 코드 복제하기

## 3.1. 소스코드 복제

`git clone` 명령은 GitHub에 호스팅된 원격 저장소에서 로컬 컴퓨터로 소스 코드를 복제하는 명령어입니다. 이 명령을 사용하면 프로젝트의 전체 소스 코드와 관련 파일들을 로컬에서 작업할 수 있게 됩니다. 복제한 후에는 저장소 내에서 필요한 작업을 진행할 수 있으며, 변경 사항은 다시 원격 저장소에 푸시할 수 있습니다.

터미널을 열고 다음 명령어를 실행하여 DEMO 서버의 리포지토리를 로컬 컴퓨터에 복사합니다.
```bash
# Git 저장소에서 리포지토리 복제
git clone http://gitlab.raondevops.com/opensourcernd/source/server/did-demo-server.git

# 복제한 리포지토리로 이동
cd did-demo-server
```

> **참고 링크**
> - [Git Clone 가이드](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

<br/>

## 3.2. 디렉토리 구조
복제된 프로젝트의 주요 디렉토리 구조는 다음과 같습니다:

```
did-demo-server
├── CHANGELOG.md
├── CLA.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── LICENSE.dependencies.md
├── MAINTAINERS.md
├── README.md
├── RELEASE-PROCESS.md
├── SECURITY.md
├── docs
│   └── installation
│       └── OpenDID_DemoServer_InstallationAndOperation_Guide.md
└── source
    └── demo
        ├── gradle
        ├── libs
            └── did-crypto-sdk-server-1.0.0.jar
        └── src
        └── build.gradle
        └── README.md
```

| Name                    | Description                              |
| ----------------------- | ---------------------------------------- |
| CHANGELOG.md            | 프로젝트의 버전별 변경 사항              |
| CODE_OF_CONDUCT.md      | 기여자들을 위한 행동 강령                |
| CONTRIBUTING.md         | 기여 지침 및 절차                        |
| LICENSE                 | 라이선스 |
| LICENSE.dependencies.md | 프로젝트 의존 라이브러리의 라이선스 정보 |
| MAINTAINERS.md          | 프로젝트 관리자를 위한 지침              |
| RELEASE-PROCESS.md      | 새로운 버전을 릴리스하는 절차            |
| SECURITY.md             | 보안 정책 및 취약성 보고 방법            |
| docs                    | 문서                                     |
| ┖ installation          | 설치 및 설정 가이드                      |
| source                  | 소스 코드                                |
| ┖ demo                  | Demo 서버 소스 코드 및 빌드 파일         |
| ┖ gradle                | Gradle 빌드 설정 및 스크립트             |
| ┖ libs                  | 외부 라이브러리 및 의존성                |
| ┖ sample                | 샘플 파일                                |
| ┖ src                   | 주요 소스 코드 디렉토리                  |
| ┖ build.gradle          | Gradle 빌드 설정 파일                    |
| ┖ README.md             | 소스 코드 개요 및 안내                   |

<br/>


# 4. 서버 구동 방법
이 장에서는 서버를 구동하는 두 가지 방법을 안내합니다.

프로젝트 소스는 `source` 디렉토리 하위에 위치하며, 각 구동 방법에 따라 해당 디렉토리에서 소스를 불러와 설정해야 합니다.

1. **IDE를 사용하는 방법**: 통합 개발 환경(IDE)에서 프로젝트를 열고, 실행 구성을 설정한 후 서버를 직접 실행할 수 있습니다. 이 방법은 개발 중에 코드 변경 사항을 빠르게 테스트할 때 유용합니다.

2. **Build 후 콘솔 명령어를 사용하는 방법**: 프로젝트를 빌드한 후, 생성된 JAR 파일을 콘솔에서 명령어(`java -jar`)로 실행하여 서버를 구동할 수 있습니다. 이 방법은 서버를 배포하거나 운영 환경에서 실행할 때 주로 사용됩니다.
   
## 4.1. IntelliJ IDEA로 구동하기 (Gradle 지원)

IntelliJ IDEA는 Java 개발에 널리 사용되는 통합 개발 환경(IDE)으로, Gradle과 같은 빌드 도구를 지원하여 프로젝트 설정 및 의존성 관리가 매우 용이합니다. Open DID의 서버는 Gradle을 사용하여 빌드되므로, IntelliJ IDEA에서 쉽게 프로젝트를 설정하고 서버를 실행할 수 있습니다.

### 4.1.1. IntelliJ IDEA 설치 및 설정
1. IntelliJ를 설치합니다. (설치 방법은 아래 링크를 참조)

> **참고 링크**
> - [IntelliJ IDEA 다운로드](https://www.jetbrains.com/idea/download/)

### 4.1.2. IntelliJ에서 프로젝트 열기
- IntelliJ를 실행시키고 `File -> New -> Project from Existing Sources`를 선택합니다. 파일 선택 창이 나타나면 [3.1. 소스코드 복제](#31-소스코드-복제) 에서 복제한 리포지토리에서 'source/did-demo-server' 폴더를 선택합니다.
- 프로젝트를 열면 build.gradle 파일이 자동으로 인식됩니다.
- Gradle이 자동으로 필요한 의존성 파일들을 다운로드하며, 이 과정이 완료될 때까지 기다립니다.

### 4.1.3. Gradle 빌드
- IntelliJ IDEA의 `Gradle` 탭에서 `Tasks -> build -> build`를 실행합니다. 
- 빌드가 성공적으로 완료되면, 프로젝트가 실행 가능한 상태로 준비됩니다.

### 4.1.4. 서버 구동
- IntelliJ IDEA의 Gradle 탭에서 Tasks -> application -> bootRun을 선택하고 실행합니다.
- Gradle이 자동으로 서버를 빌드하고 실행합니다.
- 콘솔 로그에서 "Started [ApplicationName] in [time] seconds" 메시지를 확인하여 서버가 정상적으로 실행되었는지 확인합니다.
- 서버가 정상적으로 구동되면, 브라우저에서 http://localhost:8099/swagger-ui/index.html 주소로 이동하여 Swagger UI를 통해 API 문서가 제대로 표시되는지 확인합니다.

<br/>

### 4.1.5. 서버 설정
- 서버는 배포 환경에 맞게 필요한 설정을 수정해야 하며, 이를 통해 서버가 안정적으로 작동할 수 있도록 해야 합니다. 예를 들어, Demo 서버와 연동할 TAS 서버의 주소 등이 있습니다.
- 서버의 설정 파일은 `src/main/resource/config` 경로에 위치해 있습니다.
- 자세한 설정 방법은 [5. 설정 가이드](#5-설정-가이드) 를 참고해 주세요.

<br/>

## 4.2. 콘솔 명령어로 구동하기

콘솔 명령어를 사용하여 Open DID 서버를 구동하는 방법을 안내합니다. Gradle을 이용해 프로젝트를 빌드하고, 생성된 JAR 파일을 사용하여 서버를 구동하는 과정을 설명합니다.

### 4.2.1. Gradle 빌드 명령어

- gradlew를 사용하여 소스를 빌드합니다.
  ```shell
    # 복제한 리포지토리로의 소스폴더로 이동
    cd source/demo

    # Gradle Wrapper 실행 권한을 부여
    chmod 755 ./gradlew

    # 프로젝트를 클린 빌드 (이전 빌드 파일을 삭제하고 새로 빌드)
    ./gradlew clean build
  ```
  > 참고
  > - gradlew은 Gradle Wrapper의 줄임말로, 프로젝트에서 Gradle을 실행하는 데 사용되는 스크립트입니다. 로컬에 Gradle이 설치되어 있지 않더라도, 프로젝트에서 지정한 버전의 Gradle을 자동으로 다운로드하고 실행할 수 있도록 해줍니다. 따라서 개발자는 Gradle 설치 여부와 상관없이 동일한 환경에서 프로젝트를 빌드할 수 있게 됩니다.

- 빌드된 폴더로 이동하여 JAR 파일이 생성된 것을 확인합니다.
    ```shell
      cd build/libs
      ls
    ```
- 이 명령어는 `did-demo-server-1.0.0.jar` 파일을 생성합니다.

<br/>

### 4.2.2. 서버 구동 방법
빌드된 JAR 파일을 사용하여 서버를 구동합니다:

```bash
java -jar did-demo-server-1.0.0.jar
```

- 서버가 정상적으로 구동되면, 브라우저에서 http://localhost:8099/swagger-ui/index.html 주소로 이동하여 Swagger UI를 통해 API 문서가 제대로 표시되는지 확인합니다.

<br/>

### 4.2.3. 서버 설정 방법
- 서버는 배포 환경에 맞게 필요한 설정을 수정해야 하며, 이를 통해 서버가 안정적으로 작동할 수 있도록 해야 합니다. 예를 들어, 데이터베이스 연결 정보, 포트 번호, 이메일 연동 정보 등 각 환경에 맞는 구성 요소들을 조정해야 합니다.
- 서버의 설정 파일은 `src/main/resource/config` 경로에 위치해 있습니다.
- 자세한 설정 방법은 [5. 설정 가이드](#5-설정-가이드) 를 참고하십시오.

<br/>


# 5. 설정 가이드

이 장에서는 서버의 모든 설정 파일에 포함된 각 설정 값에 대해 안내합니다. 각 설정은 서버의 동작과 환경을 제어하는 중요한 요소로, 서버를 안정적으로 운영하기 위해 적절한 설정이 필요합니다. 항목별 설명과 예시를 참고하여 각 환경에 맞는 설정을 적용하세요.

🔒 아이콘이 있는 설정은 기본적으로 고정된 값이거나, 일반적으로 수정할 필요가 없는 값임을 참고해주세요.

## 5.1. application.yml

- 역할: application.yml 파일은 Spring Boot 애플리케이션의 기본 설정을 정의하는 파일입니다. 이 파일을 통해 애플리케이션의 이름, 데이터베이스 설정, 프로파일 설정 등 다양한 환경 변수를 지정할 수 있으며, 애플리케이션의 동작 방식에 중요한 영향을 미칩니다.

- 위치: `src/main/resources/`

### 5.1.1. Spring 기본 설정
Spring의 기본 설정은 애플리케이션의 이름과 활성화할 프로파일 등을 정의하며, 서버의 동작 환경을 설정하는 데 중요한 역할을 합니다.

* `spring.application.name`: 🔒
    - 애플리케이션의 이름을 지정합니다.
    - 용도: 주로 로그 메시지, 모니터링 도구, 또는 Spring Cloud 서비스에서 애플리케이션을 식별하는 데 활용됩니다
    - 예시: `demo`

* `spring.profiles.active`:  
  - 활성화할 프로파일을 정의합니다. 
  - 용도: 샘플 또는 개발 환경 중 하나를 선택하여 해당 환경에 맞는 설정을 로드합니다. 
  - 지원 프로파일: dev
  - 예시: `dev`

* `spring.profiles.group.dev`: 🔒
  - `dev` 프로파일 그룹에 포함된 개별 프로파일을 정의합니다.
  - 용도: 개발 환경에서 사용할 설정들을 묶어 관리합니다.
  - 프로파일 파일명 규칙: 각 프로파일에 해당하는 설정 파일은 그룹 내에 정의된 이름 그대로 사용됩니다. 예를 들어, logging 프로파일은 application-logging.yml, spring_docs 프로파일은 application-spring-docs.yml로 작성됩니다. group.dev 아래에 적힌 이름 그대로 파일명을 사용해야 합니다.

<br/>

### 5.1.2. Jackson 기본 설정

Jackson은 Spring Boot에서 기본적으로 사용되는 JSON 직렬화/역직렬화 라이브러리입니다. Jackson의 설정을 통해 JSON 데이터의 직렬화 방식이나 포맷을 조정할 수 있으며, 데이터 전송 시 성능과 효율성을 높일 수 있습니다.

* `spring.jackson.default-property-inclusion`: 🔒 
    - 빈 객체를 직렬화할 때 오류를 발생시키지 않도록 설정합니다.
    - 예시: false

<br/>

### 5.1.3. 서버 설정 
서버 설정은 애플리케이션이 요청을 수신할 포트 번호 등을 정의합니다.

* `server.port`:  
    - 애플리케이션이 실행될 포트 번호입니다. Demo 서버의 기본 포트는 8099 입니다.
    - 값 : 8099

<br/>

### 5.1.4. Open DID 서버 통신 설정
Demo 서비스는 TAS, Verifier, CAS, Issuer 서버와 통신을 합니다. 직접 구축한 서버의 주소값을 설정하면 됩니다.
* `tas.url`:  
    - TAS(Trust Agent Service) 서비스의 URL입니다. 이메일전송, Push 서비스를 호출합니다.
    - 예시: `http://localhost:8090/contextpath/tas`

* `cas.url`:  
    - CAS(Certificate App Server) 서비스의 URL입니다. PII설정에 대한 값을 전달합니다.
    - 예시: `http://localhost:8094/contextpath/cas`

* `verifier.url`:  
    - Verifier 서비스의 URL입니다. Vp제출 및 확인을 위한 서비스를 호출합니다.
    - 예시: `http://localhost:8093/contextpath/verifier`

* `issuer.url`:  
    - Issuer 서비스의 URL입니다. VC발급 요청을 위한 서비스를 호출합니다.
    - 예시: `http://localhost:8091/contextpath/issuer`

<br/>

## 5.2. application-logging.yml
- 역할: 로그 그룹과 로그 레벨을 설정합니다. 이 설정 파일을 통해 특정 패키지나 모듈에 대해 로그 그룹을 정의하고, 각 그룹에 대한 로그 레벨을 개별적으로 지정할 수 있습니다.

- 위치: `src/main/resources/`
  
### 5.2.1. 로깅 설정

- 로그 그룹: logging.group 아래에 원하는 패키지를 그룹화하여 관리할 수 있습니다. 예를 들어, util 그룹에 org.omnione.did.base.util 패키지를 포함하고, 다른 패키지도 각각의 그룹으로 정의합니다.

- 로그 레벨: logging.level 설정을 통해 각 그룹에 대해 로그 레벨을 지정할 수 있습니다. debug, info, warn, error 등 다양한 로그 레벨을 설정하여 원하는 수준의 로그를 출력할 수 있습니다. 예를 들어, demo, aop 등의 그룹에 debug 레벨을 설정하여 해당 패키지에서 디버그 정보를 출력하도록 할 수 있습니다.

* `logging.level`: 
    - 로그 레벨을 설정합니다.
    - 레벨을 debug 설정함으로써, 지정된 패키지에 대해 DEBUG 레벨 이상(INFO, WARN, ERROR, FATAL)의 모든 로그 메시지를 볼 수 있습니다.

전체 예시:
```yaml
logging:
  level:
    org.omnione: debug
```

<br/>

## 5.3. application-demo.yml
이 설정 파일은 Demo 서버에 VP Offer 및 VC 발급 Offer에 qr생성시 사용하는 값을 관리합니다. 이는 Verifier서버의 VP Policy(vp정책)과 Issuer 서버의 VC plan에 해당하는 값들이며, Demo 구현 및 sample로 작성된 값으로 테스트시 해당 파일에 있는 값과 반드시 일치해야합니다. 자세한 해당 내용은 설계문서(Design)데이터명세서(4.6.7.1. VerifyOfferPayload, 4.6.5.1. VcPlan)와 Presentation of VP_ko.md 파일을 참고바랍니다.

* `demo.device`: 🔒
  - 검증 사업자의 어떤 장치에서 verify offer를 제공하였는지를 확인하기 위한 식별자이며, 현재는 Verifier 서버의 VpPolcy.json에 해당하는 값이 세팅되어있습니다.
  - 예시: `WEB`
  
* `demo.service`: 🔒
  - 검증 사업자에 의해 지정된 서비스명 VP 제출에 의해 제공받는 서비스에 대한 식별자값이며, 현재는 Verifier 서버의 VpPolcy.json에 해당하는 값이 세팅되어있습니다.
  - 예시: `login`, `signup`

* `demo.mode`: 🔒
  - 제출 모드는 VP를 어떤 경로로 제출하느냐에 대한 방법에 대한 값이며, 재는 Verifier 서버의 VpPolcy.json에 해당하는 값이 세팅되어있습니다.
  - 예시 : `Direct`

* `demo.vcPlanId`: 🔒
  - issuer의 VC plan ID 값이며, Issuer서버에 application-issue내 profile을 찾기 위한 값입니다.현재는 sample 및 데모 호출을 위해 값을 세팅했습니다.
  - 예시 : `vcplanid000000000001`

* `demo.issuer`: 🔒
  - issuer 서버의 DID 값이며, VC offer 요청시 해당 issuer를 호출하기 위한 값입니다. 현재는 sample 및 데모 호출을 위해 값을 세팅했습니다.
  - 예시 : `did:omn:issuer`


## 5.4. application-spring-docs.yml
- 역할: 애플리케이션에서 SpringDoc 및 Swagger UI 설정을 관리합니다.

- 위치: `src/main/resources/`

* `springdoc.swagger-ui.path`: 🔒
  - Swagger UI에 접근할 수 있는 URL 경로를 정의합니다.
  - 예시: `/swagger-ui.html`

* `springdoc.swagger-ui.groups-order`: 🔒
  - Swagger UI에서 API 그룹을 표시하는 순서를 지정합니다.
  - 예시: `ASC`

* `springdoc.swagger-ui.operations-sorter`: 🔒
  - Swagger UI에서 HTTP 메서드 기준으로 API 엔드포인트를 정렬합니다.
  - 예시: `method`

* `springdoc.swagger-ui.disable-swagger-default-url`: 🔒
  - 기본 Swagger URL을 비활성화합니다.
  - 예시: `true`

* `springdoc.swagger-ui.display-request-duration`: 🔒
  - Swagger UI에 요청 시간을 표시할지 여부를 설정합니다.
  - 예시: `true`

* `springdoc.api-docs.path`: 🔒
  - API 문서가 제공되는 경로를 정의합니다.
  - 예시: `/api-docs`

* `springdoc.show-actuator`: 🔒
  - API 문서에서 Actuator 엔드포인트를 표시할지 여부를 설정합니다.
  - 예시: `true`

* `springdoc.default-consumes-media-type`: 🔒
  - API 문서에서 요청 본문의 기본 미디어 타입을 설정합니다.
  - 예시: `application/json`

* `springdoc.default-produces-media-type`: 🔒
  - API 문서에서 응답 본문의 기본 미디어 타입을 설정합니다.
  - 예시: `application/json`

[Open DID Installation Guide]: https://github.com/OmniOneID/did-release/blob/main/release-V1.0.0.0/OepnDID_Installation_Guide-V1.0.0.0.md