Demo Server
==

Welcome to the Demo Server Repository. <br>
This repository contains the source code, documentation, and related resources for the Demo Server.

# OpenDID Demonstration Videos

The OpenDID demonstration videos include the following four key scenarios:

## 1. User Registration
- [UserRegistration_demo_sample(video)](videos/OpenDID_Demo_UserRegistration.mov)
- **Description**: A scenario where the user directly issues a National ID VC using the app.

## 2. VC Issuance (App - National ID)
- [VC Issuance_App_demo_sample(video)](videos/OpenDID_Demo_VCIssuance_App.mov)
- **Description**: A scenario where the user directly issues a National ID VC using the app.

## 3. VC Issuance (Demo - Mobile Driver License)
- [ VC Issuance_Web_demo_sample(video)](videos/OpenDID_Demo_VCIssuance_Demo.mov)
- **Description**: Demonstrates the scenario where the user receives a Mobile Driver License VC issuance request from the Demo site.

## 4. VP Submission
- [VP Submission_demo_sample(video)](videos/OpenDID_Demo_VPSubmission.mov)
- **Description**: A scenario where the user submits a Verifiable Presentation (VP) through the app after receiving a VP submission request from the Demo site.

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
            └── did-crypto-sdk-server-1.0.0.jar
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


## Libraries

Libraries used in this project are organized into two main categories:

1. **Open DID Libraries**: These libraries are developed by the Open DID project and are available in the [libs folder](source/demo/libs). They include:

   - `did-crypto-sdk-server-1.0.0.jar`

2. **Third-Party Libraries**: These libraries are open-source dependencies managed via the [build.gradle](source/demo/build.gradle) file. For a detailed list of third-party libraries and their licenses, please refer to the [dependencies-license.md](dependencies-license.md) file.

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