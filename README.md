Demo Server
==

Welcome to the Demo Server Repository. <br>
This repository contains the source code, documentation, and related resources for the Demo Server.

## S/W Specifications
| Category           | Details                                         |
|--------------------|-------------------------------------------------|
| OS                 | macOS / Linux / Windows 10 or higher            |
| Language           | Java 21 or higher                               |
| IDE                | IntelliJ IDEA                                   |
| Build System       | Gradle 7.0 or higher                            |
| Compatibility      | Requires JDK 21 or higher                       |
| Other Requirements | Minimum 2GB RAM and 10GB of disk space required |

# OpenDID Demonstration Videos

The OpenDID demonstration videos include the following four key scenarios:

## 1. User Registration
https://github.com/user-attachments/assets/2a8e99e6-34b0-4f75-8378-a561b71d2e34
- [UserRegistration_demo_sample(video)](videos/OpenDID_Demo_UserRegistration.mov)
- **Description**: A scenario where the user directly issues a National ID VC using the app.

## 2. VC Issuance (App - National ID)
https://github.com/user-attachments/assets/494631d8-2521-4f33-9ac2-2de778fc4e72
- [VC Issuance_App_demo_sample(video)](videos/OpenDID_Demo_VCIssuance_APP.mp4)
- **Description**: A scenario where the user directly issues a National ID VC using the app.

## 3. VC Issuance (Demo - Mobile Employee ID Card)
https://github.com/user-attachments/assets/475148f3-f3d0-4319-a780-583d16545bc2
- [ VC Issuance_Web_demo_sample(video)](videos/OpenDID_Demo_VCIssuance_Demo_WEB_.mp4)
- **Description**: Demonstrates the scenario where the user receives a Mobile Employee ID Card VC issuance request from the Demo site.

## 4. VP Submission & ZKP Proof
https://github.com/user-attachments/assets/cbbaa74f-6bf8-4637-b4fb-9b3b7e86de07
- [VP Submission_demo_sample(video)](videos/OpenDID_Demo_VPSubmission.mp4)
- **Description**: Description: A scenario where the user receives a QR code request using their Mobile Employee ID Card, submits a Verifiable Presentation (VP) to gain access authorization, and proves certain information through ZKP (Zero-Knowledge Proof) without exposing some details.

## Folder Structure
Overview of the major folders and documents in the project directory:

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
│   └── installation
│       └── OpenDID_DemoServer_InstallationAndOperation_Guide.md
│       └── OpenDID_DemoServer_InstallationAndOperation_Guide_ko.md
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

Below is a description of each folder and file in the directory:

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
| ┖ installation          | Installation and setup guide                        |
| source                  | Source code                                         |
| ┖ did-demo-server       | DEMO server source code and build files             |
| &nbsp;&nbsp;&nbsp;┖ gradle                | Gradle build settings and scripts                   |
| &nbsp;&nbsp;&nbsp;┖ libs                  | External libraries and dependencies                 |
| &nbsp;&nbsp;&nbsp;┖ sample                | Sample files                                        |
| &nbsp;&nbsp;&nbsp;┖ src                   | Main source code directory                          |
| &nbsp;&nbsp;&nbsp;┖ build.gradle          | Gradle build configuration file                     |
| &nbsp;&nbsp;&nbsp;┖ README.md             | Source code overview and guide                      |
| videos                  | Demonstration videos                                |

<br/>


## Libraries

Libraries used in this project are organized into two main categories:

1. **Open DID Libraries**: These libraries are developed by the Open DID project and are available in the [libs folder](source/did-demo-server/libs). They include:

   - `did-crypto-sdk-server-2.0.0.jar`

2. **Third-Party Libraries**: These libraries are open-source dependencies managed via the [build.gradle](source/did-demo-server/build.gradle) file. For a detailed list of third-party libraries and their licenses, please refer to the [dependencies-license.md](dependencies-license.md) file.

## Installation And Operation Guide

For detailed instructions on installing and configuring the Demo Server, please refer to the guide below:
- [OpenDID Demo Server Installation and Operation Guide](docs/installation/OpenDID_DemoServer_InstallationAndOperation_Guide.md)  

## Change Log

The Change Log provides a detailed record of version-specific changes and updates. You can find it here:
- [Change Log](./CHANGELOG.md)  

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License
[Apache 2.0](LICENSE)
