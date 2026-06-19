# Instamart Backend - Continuous Integration Pipeline

This repository contains the Spring Boot backend service for the Instamart multi-tier application, alongside its enterprise-grade Continuous Integration (CI) pipeline. 

The CI pipeline is defined as code (`Jenkinsfile`) and enforces strict build environments, native OS toolchain management, and automated security profiling.

## 🏗️ Architecture & Toolchain
* **Application Framework:** Java 17, Spring Boot, Maven
* **CI Server:** Jenkins (running on AWS EC2 Ubuntu)
* **Static Application Security Testing (SAST):** SonarQube (Containerized)
* **Pipeline Style:** Declarative Pipeline with strict Environment Overrides

## 🚀 Pipeline Stages

The automated pipeline executes the following sequence upon code commit:

1. **SCM Checkout:** Pulls the latest backend source code from the main branch.
2. **Native Build & Compile:** * Bypasses standard Jenkins tool wrappers to utilize native OS-level toolchains for maximum stability.
   * Forces the shell execution environment to strictly utilize `openjdk-17-jdk` and globally installed Maven.
   * Compiles the source code and packages it into a production-ready `.jar` artifact (`mvn clean package`).
3. **Static Security Scan (SAST):**
   * Injects the SonarScanner binary into the environment.
   * Analyzes the compiled Java binaries (`target/classes`) for vulnerabilities, code smells, and bugs.
   * Pushes the telemetry to the internal SonarQube server via a private AWS network path to minimize latency.
4. **The Quality Gate:**
   * Halts the pipeline synchronously, awaiting a webhook callback from SonarQube.
   * If the code fails the security threshold, the pipeline is hard-aborted, preventing compromised code from reaching the deployment phase.

## 🔒 Configuration & Secrets Management

To maintain security and environmental parity, credentials and environment variables are strictly managed outside of version control:

* **SonarQube Authentication:** Handled via Jenkins Secret Text credentials. The pipeline requests the token dynamically at runtime using the `withSonarQubeEnv()` wrapper.
* **Webhook Handshake:** SonarQube is configured to trigger a callback to the Jenkins EC2 Private IPv4 address, circumventing Docker localhost isolation issues.
