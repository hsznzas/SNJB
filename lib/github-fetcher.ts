import { Octokit } from '@octokit/rest';

// Initialize Octokit with GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = process.env.GITHUB_OWNER || '';
const repo = process.env.GITHUB_REPO || '';
const branch = process.env.GITHUB_BRANCH || 'main';

// In-memory cache for directory listings (5 minute TTL)
const cache = new Map<
  string,
  { data: any; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  sha?: string;
}

interface SearchResult {
  path: string;
  matches: Array<{
    lineNumber: number;
    line: string;
  }>;
}

/**
 * Get cached data if available and not expired
 */
function getCached(key: string): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

/**
 * Set cache data
 */
function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * List contents of a directory in the repository
 * @param path - Path to directory (empty string for root)
 * @returns Array of files and directories
 */
export async function getDirectoryContents(
  path: string = '',
): Promise<FileItem[]> {
  try {
    const cacheKey = `dir:${path}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    if (!Array.isArray(response.data)) {
      throw new Error('Path is not a directory');
    }

    const items: FileItem[] = response.data.map((item) => ({
      name: item.name,
      path: item.path,
      type: item.type === 'dir' ? 'dir' : 'file',
      size: item.size,
      sha: item.sha,
    }));

    // Sort: directories first, then files, both alphabetically
    items.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'dir' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    setCache(cacheKey, items);
    return items;
  } catch (error: any) {
    console.error('Error fetching directory contents:', error);
    throw new Error(`Failed to fetch directory: ${error.message}`);
  }
}

/**
 * Get file content from the repository
 * @param path - Path to file
 * @param chunkSize - Optional chunk size for large files (in bytes)
 * @returns File content as string
 */
export async function getFileContent(
  path: string,
  chunkSize?: number,
): Promise<{ content: string; size: number; encoding: string }> {
  try {
    const cacheKey = `file:${path}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    if (Array.isArray(response.data) || response.data.type !== 'file') {
      throw new Error('Path is not a file');
    }

    const fileData = response.data;

    // Decode content (GitHub returns base64 encoded content)
    let content = '';
    if (fileData.content) {
      content = Buffer.from(fileData.content, 'base64').toString('utf-8');
    }

    // If chunk size specified and file is large, return only the chunk
    if (chunkSize && content.length > chunkSize) {
      content = content.slice(0, chunkSize) + '\n\n// ... (file truncated)';
    }

    const result = {
      content,
      size: fileData.size || 0,
      encoding: fileData.encoding || 'utf-8',
    };

    // Only cache files smaller than 100KB
    if (result.size < 100 * 1024) {
      setCache(cacheKey, result);
    }

    return result;
  } catch (error: any) {
    console.error('Error fetching file content:', error);
    throw new Error(`Failed to fetch file: ${error.message}`);
  }
}

/**
 * Search repository for files matching a query
 * @param query - Search query
 * @returns Array of matching files with context
 */
export async function searchRepository(
  query: string,
): Promise<SearchResult[]> {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    // Search code in the repository
    const response = await octokit.search.code({
      q: `${query} repo:${owner}/${repo}`,
      per_page: 20,
    });

    const results: SearchResult[] = [];

    for (const item of response.data.items) {
      // Fetch file content to get line matches
      try {
        const fileContent = await getFileContent(item.path);
        const lines = fileContent.content.split('\n');
        const matches: Array<{ lineNumber: number; line: string }> = [];

        // Find lines containing the query
        lines.forEach((line, index) => {
          if (line.toLowerCase().includes(query.toLowerCase())) {
            matches.push({
              lineNumber: index + 1,
              line: line.trim(),
            });
          }
        });

        if (matches.length > 0) {
          results.push({
            path: item.path,
            matches: matches.slice(0, 3), // Limit to 3 matches per file
          });
        }
      } catch (error) {
        // Skip files that can't be read
        console.error(`Error reading file ${item.path}:`, error);
      }
    }

    return results.slice(0, 10); // Return max 10 files
  } catch (error: any) {
    console.error('Error searching repository:', error);
    throw new Error(`Search failed: ${error.message}`);
  }
}

/**
 * Verify GitHub connection and credentials
 */
export async function verifyConnection(): Promise<boolean> {
  try {
    await octokit.repos.get({
      owner,
      repo,
    });
    return true;
  } catch (error) {
    console.error('GitHub connection verification failed:', error);
    return false;
  }
}
