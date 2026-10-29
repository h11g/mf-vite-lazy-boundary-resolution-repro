function report(id: string, load: () => Promise<{ describe: () => string }>) {
  const out = document.getElementById(id)!;
  load().then(
    (mod) => (out.textContent = `${id}: resolved (${mod.describe()})`),
    (error: Error) => (out.textContent = `${id}: rejected (${error.message})`)
  );
}

// Each lazy module uses a remote export only as a type, so it loads no remote at runtime.
report('stubbed', () => import('./uses-stubbed-type'));
report('unreachable', () => import('./uses-remote-type'));
