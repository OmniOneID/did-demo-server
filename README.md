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

The OpenDID demonstration videos cover the scenarios below. The issuance and presentation scenarios are shown for three credential formats: OpenDID VC, SD-JWT VC, and mdoc.

## 1. User Registration
https://github.com/user-attachments/assets/b3872866-c867-4e75-840d-373df80ddd50
- **Description**: The user registers as a demo user in the app and sets the wallet lock and PIN.

## 2. VC Issuance (User-Initiated)
- **Description**: The user selects a VC plan from the list in the app, enters the information to include, and receives the VC.

### 2.1 OpenDID VC
https://github.com/user-attachments/assets/cced035c-394d-4e59-a89c-00fbdd13737a

### 2.2 SD-JWT VC
https://github.com/user-attachments/assets/62221a09-f2fc-409c-8075-97b843ce2935

### 2.3 mdoc
https://github.com/user-attachments/assets/056c25a2-09f3-4366-b7a8-efc2c82b84d7

## 3. VC Issuance (Issuer-Initiated)
- **Description**: The user enters information on the Demo site and requests issuance. The app scans the QR code shown on the site and receives the VC. SD-JWT VC and mdoc are issued through OID4VCI, and the app asks for the transaction code shown on the site.

### 3.1 OpenDID VC
https://github.com/user-attachments/assets/65c7ab3c-0863-4c74-96c8-5c529156cafc

### 3.2 OpenDID VC (with ZKP)
https://github.com/user-attachments/assets/9a9a9d2b-9af9-4040-9266-fc5feb844340
- **Description**: Issues an OpenDID VC that also carries ZKP information such as age. The predicate proof in 6.2 uses this VC.

### 3.3 SD-JWT VC
https://github.com/user-attachments/assets/b005503d-6364-462a-bd1c-1aeec86c2842

### 3.4 mdoc
https://github.com/user-attachments/assets/b1b3b4f8-692d-440d-940e-7ba9ee1b7dab

## 4. VP Submission (All Claims)
- **Description**: The user selects a verification policy on the Demo site and scans the QR code with the app. The app shows the requested claims, and the user submits them after entering the PIN. OpenDID VC is submitted through the OpenDID protocol, and SD-JWT VC and mdoc through OID4VP.

### 4.1 OpenDID VC
https://github.com/user-attachments/assets/131eebef-8061-40a1-8bad-48480cc57568

### 4.2 SD-JWT VC
https://github.com/user-attachments/assets/606348e8-0707-40b3-951d-f529f27a49a3

### 4.3 mdoc
https://github.com/user-attachments/assets/db509dcf-3350-49f1-bb0f-a787e38cbe8d

## 5. VP Submission (Selective Disclosure)
- **Description**: Follows the same steps as section 4. The app separates required and optional claims, and the user chooses which optional claims to submit.

### 5.1 OpenDID VC
https://github.com/user-attachments/assets/68b8c85b-0c95-4a61-831e-33de7de1c811

### 5.2 SD-JWT VC
https://github.com/user-attachments/assets/9f4a55fe-7fcd-410e-bcb0-332585491905

### 5.3 mdoc
https://github.com/user-attachments/assets/0269b26c-8aeb-49b4-b028-506f3c593b76

## 6. ZKP Proof

### 6.1 Attribute Disclosure
https://github.com/user-attachments/assets/3ce666a3-1b22-417d-a7d0-ecaf7f133bc6
- **Description**: The user chooses which attributes of the OpenDID VC to reveal to the verifier.

### 6.2 Predicate Proof
https://github.com/user-attachments/assets/1785b631-8f7e-4617-9e29-8186cc63dbd4
- **Description**: The user proves that a value such as age meets a condition without revealing the value itself.

## 7. Proximity Presentation (mdoc)
https://github.com/user-attachments/assets/824627b4-b4b2-4829-9ffb-3a7f643dbbae
- **Description**: The user presents an mdoc in person to a verifier's app, following ISO/IEC 18013-5. The verifier app scans the QR code shown in the user's app, and the two devices connect directly to exchange the data.

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
