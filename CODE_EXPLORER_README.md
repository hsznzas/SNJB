# Code Explorer Feature

A secure, password-protected code repository viewer built into the SNJB Website. This feature allows authorized users to browse code from an external GitHub repository without the ability to download, copy, or clone the code.

## Overview

**What it does:**
- Displays code from the external `h0505756505-ai/Sinjabreplica` repository
- Password-protected access
- Advanced anti-download protections
- Syntax highlighting for multiple languages
- File search functionality
- Full audit logging of all access
- Session-based watermarks

**What it protects:**
- The SNJB Website source code is never exposed
- Users can only view code from the configured external repository
- All copy/paste, download, and print actions are blocked
- Every file view is logged with timestamps and session info

## Setup

### 1. Environment Variables

The `.env.local` file contains the configuration (already set up):

```bash
# GitHub API Access - Points to the EXTERNAL Sinjabreplica repo
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_OWNER=h0505756505-ai
GITHUB_REPO=Sinjabreplica
GITHUB_BRANCH=main

# Code Explorer Password
CODE_EXPLORER_PASSWORD=your_secure_password_here

# Session Secret
SESSION_SECRET=your_random_secret_key_here
```

### 2. Access the Code Explorer

**URL:** https://www.snjb.app/code-explorer (or http://localhost:6006/code-explorer in development)

**Password:** `thriwe26`

## Architecture

### Repository Separation

```
┌─────────────────────────────────────────┐
│   SNJB Website (Current Project)        │
│   • Contains the code explorer feature   │
│   • Source code is NEVER exposed        │
│   • Deployed at snjb.app                │
└─────────────────────────────────────────┘
                    │
                    │ Fetches from
                    ▼
┌─────────────────────────────────────────┐
│   Sinjabreplica Repository              │
│   • External private GitHub repo         │
│   • h0505756505-ai/Sinjabreplica        │
│   • Code that visitors will explore      │
└─────────────────────────────────────────┘
```

### File Structure

```
app/
├── code-explorer/
│   ├── page.tsx                    # Main explorer page
│   └── layout.tsx                  # Layout with protection CSS
├── api/code-explorer/
│   ├── auth/route.ts              # Password authentication
│   ├── browse/route.ts            # List directory contents
│   ├── view/route.ts              # View file with syntax highlighting
│   └── search/route.ts            # Search files

components/code-explorer/
├── PasswordGuard.tsx              # Authentication component
├── FileTree.tsx                   # File browser sidebar
├── CodeViewer.tsx                 # Code display with highlighting
├── SearchBar.tsx                  # Search functionality
├── ProtectionWrapper.tsx          # Anti-copy/download layer
└── Watermark.tsx                  # Session watermark overlay

lib/
├── github-fetcher.ts              # GitHub API integration
├── rate-limiter.ts                # Rate limiting utilities
├── audit-logger.ts                # Access logging
└── session-helper.ts              # Session management

data/
└── audit-logs.json                # Audit log storage
```

## Features

### 1. Password Protection
- Single password authentication
- Sessions expire after 1 hour of inactivity
- Encrypted session cookies

### 2. Anti-Download Measures
- **No raw file access:** API only returns rendered HTML
- **Disable right-click:** Context menu is blocked
- **Disable copy/paste:** Ctrl+C, Cmd+C blocked
- **Disable keyboard shortcuts:** Ctrl+S (save), Ctrl+A (select all), Ctrl+P (print)
- **Watermark overlay:** Semi-transparent session ID overlay
- **User-select CSS:** Prevents text selection
- **Chunked delivery:** Large files (>50KB) are truncated

### 3. Rate Limiting
- **Authentication:** 5 attempts per 15 minutes (30 min block)
- **Browse:** 100 requests per minute (5 min block)
- **View:** 50 requests per minute (5 min block)
- **Search:** 10 requests per minute (10 min block)

### 4. Syntax Highlighting
Supports multiple languages via Prism.js:
- TypeScript/JavaScript/JSX/TSX
- Python
- Java
- JSON
- CSS/SCSS
- Bash
- Markdown
- YAML
- SQL
- HTML/XML

### 5. Search Functionality
- Debounced search (500ms)
- Searches file names and contents
- Shows matching line numbers and context
- Limited to 10 results

### 6. Audit Logging
Every action is logged with:
- Timestamp
- Event type (auth, browse, view, search)
- Session ID
- IP address
- Success/failure status
- File path or search query

Logs are stored in `data/audit-logs.json` and kept to the last 1000 entries.

## Security Considerations

### GitHub Token Security
- Token is stored in `.env.local` (never committed to git)
- Token has read-only access to private repositories
- Token is only used server-side, never exposed to browser

### Session Security
- Encrypted session cookies using iron-session
- HTTPS-only in production
- Sessions expire after 1 hour of inactivity
- Session secret should be a strong random string

### Rate Limiting
- Prevents brute force password attempts
- Prevents repository scraping
- Blocks rapid automated requests

### Audit Trail
- Every file view is logged
- Every search query is logged
- Every authentication attempt is logged
- Logs include IP addresses for investigation

## Usage

### For Developers

**Start Development Server:**
```bash
npm run dev
```

**Visit Code Explorer:**
```
http://localhost:6006/code-explorer
```

### For Visitors

1. Navigate to `/code-explorer`
2. Enter password: `thriwe26`
3. Browse files using the tree on the left
4. Click a file to view its contents
5. Use the search bar to find specific code
6. All actions are logged for security

## Changing the Repository

To point the code explorer to a different repository:

1. Update `.env.local`:
```bash
GITHUB_OWNER=new-owner
GITHUB_REPO=new-repo
GITHUB_BRANCH=main
```

2. Ensure the GitHub token has access to the new repository

3. Restart the development server

## Changing the Password

To change the code explorer password:

1. Update `.env.local`:
```bash
CODE_EXPLORER_PASSWORD=new_password_here
```

2. Restart the development server

3. Share the new password with authorized users

## Viewing Audit Logs

Audit logs are stored in `data/audit-logs.json`. To view them:

```bash
cat data/audit-logs.json | jq
```

Or create a custom admin endpoint to view logs programmatically.

## Deployment Notes

When deploying to production (Vercel, etc.):

1. **Add environment variables** to your hosting platform:
   - `GITHUB_TOKEN`
   - `GITHUB_OWNER`
   - `GITHUB_REPO`
   - `GITHUB_BRANCH`
   - `CODE_EXPLORER_PASSWORD`
   - `SESSION_SECRET`

2. **Ensure HTTPS is enabled** (required for secure cookies)

3. **Monitor audit logs** regularly for suspicious activity

4. **Set up alerts** for unusual access patterns (optional)

## Limitations

- Files larger than 50KB are truncated
- Binary files cannot be viewed
- No syntax highlighting for uncommon languages
- Search is limited to 10 results
- GitHub API rate limit: 5,000 requests/hour

## Troubleshooting

**"Failed to load repository":**
- Check GitHub token is valid
- Verify repository name and owner
- Ensure token has access to the repository

**"Unauthorized" error:**
- Session may have expired (1 hour limit)
- Re-enter password to authenticate

**"Too many requests" error:**
- Rate limit exceeded
- Wait for the specified retry time
- Reduce request frequency

## Future Enhancements

Potential improvements for future versions:
- Multiple repository support
- Unique access links per reviewer (JWT-based)
- Database for audit logs (PostgreSQL/Supabase)
- Admin dashboard to view logs and manage access
- Email notifications for access attempts
- Download attempt detection and blocking
- Session recording for complete audit trail
- README.md rendering with formatted markdown

## Support

For issues or questions about the code explorer:
1. Check the audit logs for error details
2. Review the Next.js console logs
3. Verify GitHub API connectivity
4. Check rate limit status
