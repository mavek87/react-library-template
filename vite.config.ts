import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      peerDepsExternal(),
      dts({
        insertTypesEntry: true,
        rollupTypes: true
      }),
      react()
    ],
    build: {
      minify: 'esbuild',
      sourcemap: true,
      lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: resolve(__dirname, 'src/index.ts'),
        name: `${env.VITE_LIB_NAME}`,
        fileName: `${env.VITE_LIB_FILE_NAME}`
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime', 'styled-components'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'styled-components': 'styled',
            'react/jsx-runtime': 'jsxRuntime'
          },
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      css: true
    }
  };
});