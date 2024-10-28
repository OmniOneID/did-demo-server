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

Table of Contents
==

- [1. Introduction](#1-introduction) 
  - [1.1. Overview](#11-overview)
  - [1.2. Demo Server Definition](#12-demo-server-definition)  
  - [1.3. System Requirements](#13-system-requirements)
- [2. Prerequisites](#2-prerequisites)
  - [2.1. Git Installation](#21-git-installation)
- [3. Cloning Source Code from GitHub](#3-cloning-source-code-from-github)
  - [3.1. Source Code Cloning](#31-source-code-cloning)
  - [3.2. Directory Structure](#32-directory-structure)
- [4. Server Startup Methods](#4-server-startup-methods)
  - [4.1. Running with IntelliJ IDEA (Gradle Support)](#41-running-with-intellij-idea-gradle-support)
    - [4.1.1. IntelliJ IDEA Installation and Setup](#411-intellij-idea-installation-and-setup)
    - [4.1.2. Opening Project in IntelliJ](#412-opening-project-in-intellij)
    - [4.1.3. Gradle Build](#413-gradle-build)
    - [4.1.4. Server Startup](#414-server-startup)
    - [4.1.5. Server Configuration](#415-server-configuration)
  - [4.2. Running via Console Commands](#42-running-via-console-commands)
    - [4.2.1. Gradle Build Commands](#421-gradle-build-commands)
    - [4.2.2. Server Startup Method](#422-server-startup-method)
    - [4.2.3. Server Configuration](#423-server-configuration)
- [5. Configuration Guide](#5-configuration-guide)
  - [5.1. application.yml](#51-applicationyml)
    - [5.1.1. Spring Basic Configuration](#511-spring-basic-configuration)
    - [5.1.2. Jackson Basic Configuration](#512-jackson-basic-configuration)
    - [5.1.3. Server Configuration](#513-server-configuration)
    - [5.1.4. Open DID Server Communication Configuration](#514-open-did-server-communication-configuration)
  - [5.2. application-logging.yml](#52-application-loggingyml)
    - [5.2.1. Logging Configuration](#521-logging-configuration)
  - [5.3. application-demo.yml](#53-application-demoyml)
  - [5.4. application-spring-docs.yml](#54-application-spring-docsyml)
    

# 1. Introduction

## 1.1. Overview
This document provides a guide for installing and operating the Demo server. It explains the installation process, configuration methods, and operation procedures step by step to help users efficiently install and manage the system.

For the complete installation guide of OpenDID, please refer to the [Open DID Installation Guide].

<br/>

## 1.2. Demo Server Definition
The Demo server is a demo project provided by Open DID.<br>
It provides screens for testing VC issuance, VP submission, and user registration functions.

<br/>

## 1.3. System Requirements
- **Java 17** or higher
- **Gradle 7.0** or higher
- **Docker** and **Docker Compose** (when using Docker)
- Minimum **2GB RAM** and **10GB disk space**

<br/>

# 2. Prerequisites

This chapter guides you through the necessary preparations before installing the components of the Open DID project.

## 2.1. Git Installation

`Git` is a distributed version control system that tracks changes in source code and supports collaboration among multiple developers. Git is essential for managing and versioning the source code of the Open DID project.

After successful installation, you can verify the Git version using the following command:

```bash
git --version
```

> **Reference Links**
> - [Git Installation Guide](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)


<br/>

# 3. Cloning Source Code from GitHub

## 3.1. Source Code Cloning

The `git clone` command is used to clone source code from a remote repository hosted on GitHub to your local computer. This command allows you to work with the entire project's source code and related files locally. After cloning, you can proceed with necessary work within the repository, and changes can be pushed back to the remote repository.

Open a terminal and run the following commands to copy the DEMO server repository to your local computer:
```bash
# Clone the repository from Git storage
git clone https://github.com/OmniOneID/did-demo-server.git

# Move to the cloned repository
cd did-demo-server
```

> **Reference Links**
> - [Git Clone Guide](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

<br/>

## 3.2. Directory Structure
The main directory structure of the cloned project is as follows:

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
│       └── OpenDID_DemoServer_InstallationAndOperation_Guide_ko.md
└── source
    └── demo
        ├── gradle
        ├── libs
            └── did-crypto-sdk-server-1.0.0.jar
        └── src
        └── build.gradle
        └── README.md
```

| Name                    | Description                                         |
| ----------------------- | --------------------------------------------------- |
| CHANGELOG.md            | Version changes of the project                      |
| CODE_OF_CONDUCT.md      | Code of conduct for contributors                    |
| CONTRIBUTING.md         | Contribution guidelines and procedures              |
| LICENSE                 | License                                             |
| dependencies-license.md | License information for project dependencies        |
| MAINTAINERS.md          | Guidelines for project maintainers                  |
| RELEASE-PROCESS.md      | Procedure for releasing new versions                |
| SECURITY.md             | Security policy and vulnerability reporting method  |
| docs                    | Documentation                                       |
| ┖ api                   | API guide documents                                 |
| ┖ errorCode             | Error codes and troubleshooting guide               |
| ┖ installation          | Installation and setup guide                        |
| ┖ db                    | Database ERD, table specifications                  |
| source                  | Source code                                         |
| ┖ did-demo-server       | DEMO server source code and build files             |
| ┖ gradle                | Gradle build settings and scripts                   |
| ┖ libs                  | External libraries and dependencies                 |
| ┖ sample                | Sample files                                        |
| ┖ src                   | Main source code directory                          |
| ┖ build.gradle          | Gradle build configuration file                     |
| ┖ README.md             | Source code overview and guide                      |

<br/>


# 4. Server Startup Methods
This chapter guides you through three methods to start the server.

The project source is located under the `source` directory, and you need to load and configure the source from this directory according to each startup method.

1. **Using an IDE**: You can open the project in an Integrated Development Environment (IDE), set up the run configuration, and directly run the server. This method is useful for quickly testing code changes during development.

2. **Using console commands after building**: You can build the project and then run the server by executing the generated JAR file with a console command (`java -jar`). This method is mainly used when deploying the server or running it in a production environment.

## 4.1. Running with IntelliJ IDEA (Gradle Support)

IntelliJ IDEA is a widely used Integrated Development Environment (IDE) for Java development, supporting build tools like Gradle, which makes project setup and dependency management very convenient. Open DID's server is built using Gradle, so you can easily set up the project and run the server in IntelliJ IDEA.

### 4.1.1. IntelliJ IDEA Installation and Setup
1. Install IntelliJ. (Refer to the link below for installation method)

> **참고 링크**
> - [IntelliJ IDEA Download](https://www.jetbrains.com/idea/download/)

### 4.1.2. Opening Project in IntelliJ
- Run IntelliJ and select `File -> New -> Project from Existing Sources`. When the file selection window appears, select the 'source/did-demo-server' folder from the repository cloned in [3.1. Source Code Cloning](#31-source-code-cloning).
- When you open the project, the build.gradle file is automatically recognized.
- Gradle automatically downloads the necessary dependency files, wait for this process to complete.

### 4.1.3. Gradle Build
- Run `Tasks -> build -> build` in the `Gradle` tab of IntelliJ IDEA. 
- When the build is successfully completed, the project is ready to run.

### 4.1.4. Server Startup
- Select and run Tasks -> application -> bootRun in the Gradle tab of IntelliJ IDEA.
- Gradle automatically builds and runs the server.
- Check the console log for the message "Started [ApplicationName] in [time] seconds" to confirm that the server has started normally.
- If the server starts normally, navigate to http://localhost:8099/swagger-ui/index.html in your browser to verify that the API documentation is properly displayed through Swagger UI.

<br/>

### 4.1.5. Server Configuration
- The server must be configured according to the deployment environment to ensure stable operation. For example, this includes settings such as the address of the TAS server that will integrate with the Demo server.
- The server's configuration files are located in the `src/main/resource/config` path.
- For detailed configuration methods, please refer to [5. Configuration Guide](#5-configuration-guide).

<br/>

## 4.2. Running via Console Commands

This section guides you on how to run the Open DID server using console commands. It explains the process of building the project using Gradle and running the server using the generated JAR file.

### 4.2.1. Gradle Build Commands

- Use gradlew to build the source:
  ```shell
    # Move to the source folder of the cloned repository
    cd source/did-demo-server

    # Grant execution permission to Gradle Wrapper
    chmod 755 ./gradlew

    # Clean build the project (delete previous build files and build anew)
    ./gradlew clean build
  ```
  
  > Note
  > - gradlew is short for Gradle Wrapper, a script used to run Gradle in the project. Even if Gradle is not installed locally, it automatically downloads and runs the version of Gradle specified in the project. This allows developers to build the project in the same environment regardless of whether Gradle is installed or not.

- Move to the built folder and check that the JAR file has been created.
    ```shell
      cd build/libs
      ls
    ```
- This command creates the `did-demo-server-1.0.0.jar` file.

<br/>

### 4.2.2. Server Startup Method
Use the built JAR file to start the server:

```bash
java -jar did-demo-server-1.0.0.jar
```

- If the server starts normally, navigate to http://localhost:8099/swagger-ui/index.html in your browser to verify that the API documentation is properly displayed through Swagger UI.

<br/>

### 4.2.3. Server Configuration
- The server needs to be configured according to the deployment environment, ensuring stable operation. For example, database connection information, port number, email integration information, and other components should be adjusted to fit each environment.
- The server's configuration files are located in the `src/main/resource/config` path.
- For detailed configuration methods, please refer to [5. Configuration Guide](#5-configuration-guide).

<br/>


# 5. Configuration Guide

This chapter provides guidance on each configuration value included in all server configuration files. Each setting is an important element that controls the server's behavior and environment, and appropriate settings are necessary for stable server operation. Please refer to the item-by-item explanations and examples to apply settings suitable for each environment.

Please note that settings with the 🔒 icon are either fixed values by default or generally do not need to be modified.

## 5.1. application.yml

- Role: The application.yml file defines the basic settings for the Spring Boot application. Through this file, you can specify various environment variables such as the application name, database settings, profile settings, etc., which have a significant impact on how the application operates.

- 위치: `src/main/resources/`

### 5.1.1. Spring Basic Configuration
Spring's basic configuration defines the application name and profiles to activate, playing an important role in setting up the server's operating environment.

* `spring.application.name`: 🔒
    - Specifies the name of the application.
    - Usage: Mainly used to identify the application in log messages, monitoring tools, or Spring Cloud services.
    - Example: `demo`

* `spring.profiles.active`:  
  - Defines the profile to activate. 
  - Usage: Selects either sample or development environment to load the appropriate settings for that environment. For more details about profiles
  - Supported profiles: dev
  - Example: `dev`

* `spring.profiles.group.dev`: 🔒
  - Defines individual profiles included in the `dev` profile group.
  - Usage: Groups settings to be used in the development environment.
  - Profile file naming convention: Configuration files for each profile use the name defined in the group as is. For example, the auth profile is written as application-auth.yml, and the spring-docs profile as application-spring-docs.yml. The filename should be used exactly as written under group.dev.



<br/>

### 5.1.2. Jackson Basic Configuration

Jackson is the JSON serialization/deserialization library used by default in Spring Boot. Through Jackson's settings, you can adjust the serialization method or format of JSON data, improving performance and efficiency in data transmission.

* `spring.jackson.default-property-inclusion`: 🔒 
    - Sets not to serialize when property values are null.
    - Example: non_null

* `spring.jackson.default-property-inclusion`: 🔒 
    - Sets not to cause errors when serializing empty objects.
    - Example: false

<br/>

### 5.1.3. Server Configuration 
Server configuration defines the port number on which the application will receive requests.

* `server.port`:  
    - The port number on which the application will run. The default port for the DEMO server is 8099.
    - Value: 8099

<br/>

### 5.1.4. Open DID Server Communication Configuration
The Demo service communicates with TAS, Verifier, CAS, and Issuer servers. You need to configure the address values of your directly deployed servers.
* `tas.url`:  
    - This is the URL for the TAS(Trust Agent Service). It calls email sending and Push services.
    - Example: `http://localhost:8090/contextpath/tas`

* `cas.url`:  
    - This is the URL for the CAS(Certificate App Server) service. It transmits PII configuration values.
    - Example: `http://localhost:8094/contextpath/cas`

* `verifier.url`:  
    - This is the URL for the Verifier service. It calls services for VP submission and verification.
    - Example: `http://localhost:8093/contextpath/verifier`

* `issuer.url`:  
    - This is the URL for the Issuer service. It calls services for VC issuance requests.
    - Example: `http://localhost:8091/contextpath/issuer`

<br/>

## 5.2. application-logging.yml
- Role: Sets log groups and log levels. Through this configuration file, you can define log groups for specific packages or modules and individually specify log levels for each group.

- Location: `src/main/resources/`
  
### 5.2.1. Logging Configuration

- Log groups: You can group and manage desired packages under logging.group. For example, you can include the org.omnione.did.base.util package in the util group and define other packages as separate groups.

- Log levels: Through the logging.level setting, you can specify log levels for each group. You can set various log levels such as debug, info, warn, error to output logs at the desired level. For example, you can set the debug level for groups like tas, aop to output debug information from those packages.

* `logging.level`: 
    - Sets the log level.
    - By setting the level to debug, you can see all log messages at DEBUG level and above (INFO, WARN, ERROR, FATAL) for the specified packages.

Full example:
```yaml
logging:
  level:
    org.omnione: debug
```

<br/>

## 5.3. application-demo.yml
This configuration file manages the values used for generating QR codes for VP Offers and VC issuance Offers in the Demo server. These values correspond to the VP Policy of the Verifier server and the VC plan of the Issuer server, and are implemented as demo and sample values that must match exactly with the values in this file during testing. For detailed information, please refer to the Design document's Data Specification (4.6.7.1. VerifyOfferPayload, 4.6.5.1. VcPlan) and the Presentation of VP_ko.md file.

* `demo.device`: 🔒
  - This is an identifier to determine which device of the verification provider offered the verify offer, and currently contains the value corresponding to VpPolicy.json of the Verifier server.
  - Example: `WEB`

* `demo.service`: 🔒
  - This is an identifier for the service designated by the verification provider and the service received through VP submission. Currently, it contains the value corresponding to VpPolicy.json of the Verifier server.
  - Example: `login`, `signup`

* `demo.mode`: 🔒
  - The submission mode is a value that determines how VP is submitted, and currently contains the value corresponding to VpPolicy.json of the Verifier server.
  - Example: `Direct`

* `demo.vcPlanId`: 🔒
  - This is the issuer's VC plan ID value, used to find the profile in application-issue on the Issuer server. Currently, this value is set for sample and demo calls.
  - Example: `vcplanid000000000001`

* `demo.issuer`: 🔒
  - This is the DID value of the issuer server, used to call the corresponding issuer when requesting a VC offer. Currently, this value is set for sample and demo calls.
  - Example: `did:omn:issuer`

## 5.4. application-spring-docs.yml
- Role: Manages SpringDoc and Swagger UI settings in the application.

- Location: `src/main/resources/`

* `springdoc.swagger-ui.path`: 🔒
  - Defines the URL path to access Swagger UI.
  - Example: `/swagger-ui.html`

* `springdoc.swagger-ui.groups-order`: 🔒
  - Specifies the order to display API groups in Swagger UI.
  - Example: `ASC`

* `springdoc.swagger-ui.operations-sorter`: 🔒
  - Sorts API endpoints in Swagger UI based on HTTP methods.
  - Example: `method`

* `springdoc.swagger-ui.disable-swagger-default-url`: 🔒
  - Disables the default Swagger URL.
  - Example: `true`

* `springdoc.swagger-ui.display-request-duration`: 🔒
  - Sets whether to display request time in Swagger UI.
  - Example: `true`

* `springdoc.api-docs.path`: 🔒
  - Defines the path where API documentation is provided.
  - Example: `/api-docs`

* `springdoc.show-actuator`: 🔒
  - Sets whether to display Actuator endpoints in API documentation.
  - Example: `true`

* `springdoc.default-consumes-media-type`: 🔒
  - Sets the default media type for request bodies in API documentation.
  - Example: `application/json`

* `springdoc.default-produces-media-type`: 🔒
  - Sets the default media type for response bodies in API documentation.
  - Example: `application/json`

[Open DID Installation Guide]: https://github.com/OmniOneID/did-release/blob/main/release-V1.0.0.0/OepnDID_Installation_Guide-V1.0.0.0.md