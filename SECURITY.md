# Security Policy — Welcome Germany

## Reporting a vulnerability

Please report suspected vulnerabilities privately to **parwizsleman@gmail.com** with subject "SECURITY". Do not open public issues for security problems. You should receive an acknowledgement within 72 hours.

Please include: affected component, reproduction steps, impact assessment. Please do **not** include real personal documents in reports — use synthetic examples.

## Scope notes

- The service processes sensitive documents transiently; the core security promise is that uploaded content is never persisted or logged. Reports demonstrating any persistence or leakage of document content are treated as **critical**.
- Prompt-injection findings (documents influencing system behavior) are in scope and welcome.

## Supported versions

Pre-release: only the current `main` branch is supported.

## Disclosure

Coordinated disclosure preferred; we will credit reporters who wish it. A fuller policy (response SLAs, safe-harbor wording) lands with the Stage 6 hardening review.
