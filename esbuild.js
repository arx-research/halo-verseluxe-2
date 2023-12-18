const esbuild = require('esbuild')
const { sassPlugin } = require('esbuild-sass-plugin')

esbuild
  .context({
    entryPoints: ['src/index.tsx', 'src/style.scss'],
    bundle: true,
    sourcemap: true,
    external: ['*.woff'],
    outdir: 'dist',
    plugins: [sassPlugin({})],
    minify: process.argv.includes('--minify'),
  })
  .then((context) => {
    if (process.argv.includes('--watch')) {
      // Enable watch mode
      context.watch()
    } else {
      // Build once and exit if not in watch mode
      context.rebuild().then((result) => {
        context.dispose()
      })
    }
  })
  .catch(() => process.exit(1))
