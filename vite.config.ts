import { defineConfig, type Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

/** dev-only: POST /__capture {name, dataUrl} → writes captures/<name> for visual QA */
function capturePlugin(): Plugin {
  return {
    name: 'ivanaland-capture',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__capture', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return; }
        let body = '';
        req.on('data', (c: Buffer) => { body += c.toString(); });
        req.on('end', () => {
          try {
            const { name, dataUrl } = JSON.parse(body) as { name: string; dataUrl: string };
            const safe = name.replace(/[^a-z0-9._-]/gi, '_');
            const b64 = dataUrl.split(',')[1] ?? '';
            const dir = path.resolve('captures');
            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(path.join(dir, safe), Buffer.from(b64, 'base64'));
            res.end('ok');
          } catch (e) {
            res.statusCode = 500;
            res.end(String(e));
          }
        });
      });
    },
  };
}

export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    assetsInlineLimit: 8192,
  },
  server: {
    host: true,
  },
  plugins: [capturePlugin()],
});
