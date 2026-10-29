# loaded-first lazy boundary waits for remotes a module uses only as types

Reproduction for `@module-federation/vite` 1.23.6 with Vite 8.2.0.

Under `shareStrategy: 'loaded-first'`, a local `import('./x')` also waits for `__mf_remote_pending` of every remote specifier found in the source text of `./x`'s static graph. Both lazy modules here use a remote export only as a type, without `import type`, so neither loads a remote at runtime:

- `src/uses-stubbed-type.ts` imports a type from `other/widget`, which a `pre` plugin in `vite.config.ts` resolves to a stub that throws.
- `src/uses-remote-type.ts` imports a type from `other/card`, a real remote whose entry is unreachable (nothing listens on port 4199).

```sh
npm install
npm run build && npm run preview                              # http://localhost:4173: both rejected
npm run build:version-first && npm run preview:version-first  # http://localhost:4174: both resolved
```

loaded-first page:

```
stubbed: rejected (other/widget is not available in this build)
unreachable: rejected ([ Federation Runtime ]: Failed to load script resources. #RUNTIME-008 ...)
```

version-first page, and loaded-first with `@module-federation/vite` 1.23.5:

```
stubbed: resolved (label=widget)
unreachable: resolved (title=card)
```
