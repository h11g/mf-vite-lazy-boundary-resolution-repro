import { defineConfig } from 'vite';
import { federation } from '@module-federation/vite';

const shareStrategy = (process.env.SHARE_STRATEGY ?? 'loaded-first') as
  | 'loaded-first'
  | 'version-first';

export default defineConfig({
  plugins: [
    {
      // Stands in for any plugin that resolves a remote specifier to a local module,
      // e.g. a fail-closed stub for an environment the remote is not built for.
      name: 'stub-other-widget',
      enforce: 'pre',
      resolveId(id) {
        if (id === 'other/widget') return '\0stub:other/widget';
      },
      load(id) {
        if (id === '\0stub:other/widget') {
          return `throw new Error('other/widget is not available in this build');`;
        }
      },
    },
    federation({
      name: 'host',
      // Nothing listens on this port: the page never needs the remote at runtime.
      remotes: { other: 'other@http://localhost:4199/remoteEntry.js' },
      shareStrategy,
      shared: {},
      dts: false,
    }),
  ],
});
