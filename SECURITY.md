# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| < 1.1   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please email the maintainer directly at **madelynreyes2026@gmail.com** rather than opening a public issue.

Please include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We aim to respond within 48 hours and publish a fix within 7 days.

## Security Best Practices

- Never commit `.env` files or API keys
- n8n webhook URLs should be protected with `N8N_API_KEY`
- Salesforce/HubSpot OAuth tokens are managed by n8n, never stored in this app
- Demo mode is safe by design — no real data or credentials required
