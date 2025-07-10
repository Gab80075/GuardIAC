
import { build } from 'esbuild';
import fs from 'fs';

const buildDir = 'build';

// Clean the build directory if it exists
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true, force: true });
}
fs.mkdirSync(buildDir);

build({
  entryPoints: ['index.tsx'],
  bundle: true,
  outfile: `${buildDir}/bundle.js`,
  minify: true,
  sourcemap: 'external',
  target: ['chrome90', 'firefox90', 'safari15', 'edge90'],
  jsx: 'automatic',
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
}).then(() => {
  let html = fs.readFileSync('index.html', 'utf-8');
  // Remove the development-only importmap
  html = html.replace(/<script type="importmap">[\s\S]*?<\/script>/, '');
  // Inject the bundled script for production
  html = html.replace('</body>', '  <script src="/bundle.js" defer></script>\n  </body>');
  fs.writeFileSync(`${buildDir}/index.html`, html);
  console.log('Build finished successfully!');
}).catch((e) => {
    console.error('Build failed:', e);
    process.exit(1);
});
