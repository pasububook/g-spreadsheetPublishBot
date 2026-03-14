import { build } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { resolve, parse } from 'path';
import fs from 'fs';
import { minify } from 'html-minifier-terser';

const srcDir = resolve('src/html-src');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.html'));

async function buildAll() {
  for (const file of files) {
    const filePath = resolve(srcDir, file);
    const name = parse(file).name;
    
    await build({
      root: 'src/html-src',
      plugins: [viteSingleFile()],
      build: {
        outDir: `../html`,
        emptyOutDir: false, // so we don't delete other outputs
        rollupOptions: {
          input: {
            [name]: filePath
          }
        }
      },
      configFile: false,
    });

    // Minify output HTML
    const outFilePath = resolve(`src/html`, file);
    const htmlContent = fs.readFileSync(outFilePath, 'utf8');
    const minifiedHtml = await minify(htmlContent, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
      keepClosingSlash: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
    });
    fs.writeFileSync(outFilePath, minifiedHtml, 'utf8');
  }
}

buildAll().catch(e => {
  console.error(e);
  process.exit(1);
});
