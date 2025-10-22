import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const setInitialTheme = `
    (function() {
      const saved = localStorage.getItem('snapfitTheme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const active = saved || (prefersDark ? 'dark' : 'dark'); // default = dark
      if (active === 'dark') document.documentElement.classList.add('dark');
    })();
  `;

  return (
    <Html lang="en">
      <Head />
      <body>
        {/* Runs before React to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
