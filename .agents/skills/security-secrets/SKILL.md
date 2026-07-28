---
name: security-secrets
description: Security skill for keeping secrets out of git repos. Use when handling API keys, tokens, passwords, credentials, environment variables, .env files, keychain integration, or any sensitive data. Ensures secrets are stored in keychain or .env files and never committed to version control.
---

# Security: Secrets Management

## When to use this skill

Use when the user is:

- Working with API keys, tokens, passwords, or credentials
- Setting up environment variables or .env files
- Configuring services that require secrets (databases, APIs, auth providers)
- Reviewing code for accidentally exposed secrets
- Setting up keychain integration for secret storage
- Creating or modifying .gitignore rules for sensitive files
- Debugging "missing environment variable" errors

## Core principles

1. **Never commit secrets to git** - No API keys, tokens, passwords, or credentials in source code
2. **Use keychain for local secrets** - Store sensitive values in macOS Keychain for local development
3. **Use .env for abstraction** - Reference secrets via environment variables, not hardcoded values
4. **Document required variables** - Maintain a .env.example with placeholder values

## Workflows

### Adding a new secret to a project

1. Determine if the secret is for local development only or needed in production
2. For local: store in keychain and reference via environment variable
3. For both: add to .env.example with placeholder, use in code via `process.env.VARIABLE_NAME`
4. Verify .gitignore includes `.env*` patterns
5. Never log or expose the secret value in code

### Checking for exposed secrets

1. Search codebase for common patterns:
   - Hardcoded API keys, tokens, passwords
   - Connection strings with credentials
   - Private keys or certificates
2. Check git history for accidentally committed secrets
3. Review .gitignore to ensure all env files are excluded

### Keychain integration (macOS)

Store secrets in keychain using the `security` command:

```bash
# Store a secret
security add-generic-password -a "$USER" -s "app-name-secret-name" -w "secret-value"

# Retrieve a secret
security find-generic-password -a "$USER" -s "app-name-secret-name" -w

# Delete a secret
security delete-generic-password -a "$USER" -s "app-name-secret-name"
```

### .env file management

1. Create `.env.example` with placeholder values (committed to git)
2. Create `.env` with actual values (excluded from git via .gitignore)
3. Reference in code: `process.env.API_KEY`
4. Load in Next.js via `@next/env` (automatic) or manually with `dotenv`

## Checklist for new features requiring secrets

- [ ] Secret is not hardcoded in source code
- [ ] Secret is stored in keychain or .env file
- [ ] .env.example includes the variable with placeholder
- [ ] .gitignore excludes .env files
- [ ] Code references `process.env.VARIABLE_NAME`
- [ ] No secret values in logs or error messages
