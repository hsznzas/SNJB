import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/session-helper';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limiter';
import { logFileView } from '@/lib/audit-logger';
import { getFileContent } from '@/lib/github-fetcher';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-sql';

/**
 * Get Prism language from file extension
 */
function getLanguageFromPath(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();

  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'tsx',
    js: 'javascript',
    jsx: 'jsx',
    py: 'python',
    java: 'java',
    json: 'json',
    css: 'css',
    scss: 'scss',
    sh: 'bash',
    bash: 'bash',
    md: 'markdown',
    yaml: 'yaml',
    yml: 'yaml',
    sql: 'sql',
    html: 'html',
    xml: 'xml',
  };

  return languageMap[ext || ''] || 'plaintext';
}

/**
 * Highlight code with Prism
 */
function highlightCode(code: string, language: string): string {
  try {
    if (language === 'plaintext' || !Prism.languages[language]) {
      return code;
    }
    return Prism.highlight(code, Prism.languages[language], language);
  } catch (error) {
    console.error('Syntax highlighting error:', error);
    return code;
  }
}

/**
 * GET /api/code-explorer/view?path=<file-path>
 * View file contents with syntax highlighting
 */
export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);

  // Verify authentication
  const session = await verifySession(request);
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized - Please authenticate first' },
      { status: 401 },
    );
  }

  // Rate limiting
  const rateLimit = checkRateLimit(
    `${clientIp}:${session.sessionId}`,
    RATE_LIMITS.VIEW,
  );
  if (!rateLimit.allowed) {
    await logFileView(session.sessionId, clientIp, 'rate-limited', false, 'Rate limit exceeded');
    return NextResponse.json(
      {
        error: 'Too many requests. Please slow down.',
        retryAfter: rateLimit.retryAfter,
      },
      { status: 429 },
    );
  }

  try {
    // Get path from query parameters
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');
    const fullFile = searchParams.get('full') === 'true';

    if (!path) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 },
      );
    }

    // Fetch file content from GitHub
    // For large files, limit to first 50KB unless full file is requested
    const { content, size } = await getFileContent(
      path,
      fullFile ? undefined : 50 * 1024
    );

    // Determine language and apply syntax highlighting
    const language = getLanguageFromPath(path);
    const highlightedCode = highlightCode(content, language);

    await logFileView(session.sessionId, clientIp, path, true);

    return NextResponse.json({
      success: true,
      path,
      content,
      highlightedContent: highlightedCode,
      language,
      size,
      truncated: size > 50 * 1024,
    });
  } catch (error: unknown) {
    const path = request.nextUrl.searchParams.get('path') || '';
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await logFileView(session.sessionId, clientIp, path, false, errorMessage);

    console.error('View error:', error);
    return NextResponse.json(
      { error: errorMessage || 'Failed to view file' },
      { status: 500 },
    );
  }
}
