'use client';

export default function CodeExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="code-explorer-layout">
      <style jsx global>{`
        /* Code explorer specific styles */
        .code-explorer-layout {
          /* Prevent text selection globally */
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        /* Prism syntax highlighting theme adjustments */
        .code-explorer-layout pre[class*='language-'] {
          margin: 0;
          padding: 0;
          background: transparent;
          overflow: visible;
        }

        .code-explorer-layout code[class*='language-'] {
          background: transparent;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 13px;
          line-height: 1.5;
        }

        /* Syntax highlighting colors (works with both light and dark themes) */
        .token.comment,
        .token.prolog,
        .token.doctype,
        .token.cdata {
          color: #6a737d;
        }

        .token.punctuation {
          color: #5e6687;
        }

        .token.property,
        .token.tag,
        .token.boolean,
        .token.number,
        .token.constant,
        .token.symbol,
        .token.deleted {
          color: #d73a49;
        }

        .token.selector,
        .token.attr-name,
        .token.string,
        .token.char,
        .token.builtin,
        .token.inserted {
          color: #22863a;
        }

        .token.operator,
        .token.entity,
        .token.url,
        .language-css .token.string,
        .style .token.string {
          color: #6f42c1;
        }

        .token.atrule,
        .token.attr-value,
        .token.keyword {
          color: #005cc5;
        }

        .token.function,
        .token.class-name {
          color: #6f42c1;
        }

        .token.regex,
        .token.important,
        .token.variable {
          color: #e36209;
        }

        /* Dark theme adjustments */
        .dark .token.comment,
        .dark .token.prolog,
        .dark .token.doctype,
        .dark .token.cdata {
          color: #8b949e;
        }

        .dark .token.property,
        .dark .token.tag,
        .dark .token.boolean,
        .dark .token.number,
        .dark .token.constant,
        .dark .token.symbol,
        .dark .token.deleted {
          color: #ff7b72;
        }

        .dark .token.selector,
        .dark .token.attr-name,
        .dark .token.string,
        .dark .token.char,
        .dark .token.builtin,
        .dark .token.inserted {
          color: #7ee787;
        }

        .dark .token.operator,
        .dark .token.entity,
        .dark .token.url,
        .dark .language-css .token.string,
        .dark .style .token.string {
          color: #d2a8ff;
        }

        .dark .token.atrule,
        .dark .token.attr-value,
        .dark .token.keyword {
          color: #79c0ff;
        }

        .dark .token.function,
        .dark .token.class-name {
          color: #d2a8ff;
        }

        .dark .token.regex,
        .dark .token.important,
        .dark .token.variable {
          color: #ffa657;
        }
      `}</style>
      {children}
    </div>
  );
}
