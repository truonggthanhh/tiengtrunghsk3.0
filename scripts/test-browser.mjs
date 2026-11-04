// Browser regressions with the preinstalled Chromium; no additional npm packages.
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const profile = await mkdtemp(join(tmpdir(), 'hsk-regression-'));
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '4174', '--strictPort'], { stdio: 'ignore' });
let browser, socket;
try {
  for (let i = 0; ; i++) {
    try { const response = await fetch('http://127.0.0.1:4174/tests/browser.html'); if (response.ok) break; } catch {}
    if (i >= 100) throw new Error('Vite failed to start');
    await pause(100);
  }
  browser = spawn('chromium', ['--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--remote-debugging-port=9223', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
  let pages;
  for (let i = 0; ; i++) {
    try { pages = await (await fetch('http://127.0.0.1:9223/json')).json(); if (pages.some(p => p.type === 'page')) break; } catch {}
    if (i >= 100) throw new Error('Chromium failed to start');
    await pause(100);
  }
  socket = new WebSocket(pages.find(p => p.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let id = 0; const pending = new Map(); const errors = [];
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) { const entry = pending.get(message.id); if (entry) { pending.delete(message.id); message.error ? entry.reject(new Error(message.error.message)) : entry.resolve(message.result); } }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text);
  };
  const call = (method, params = {}) => new Promise((resolve, reject) => { const n = ++id; pending.set(n, { resolve, reject }); socket.send(JSON.stringify({ id: n, method, params })); });
  await call('Runtime.enable');
  const mobile = process.env.HSK_TEST_MOBILE === '1';
  await call('Emulation.setDeviceMetricsOverride', { width: Number(process.env.HSK_TEST_WIDTH || (mobile ? 390 : 1440)), height: mobile ? 844 : 1000, deviceScaleFactor: 1, mobile });
  await call('Page.navigate', { url: 'http://127.0.0.1:4174/tests/browser.html' });
  let results;
  for (let i = 0; i < 400; i++) {
    const value = await call('Runtime.evaluate', { expression: 'window.__regressionResults', returnByValue: true });
    results = value.result?.value;
    if (results) break;
    if (errors.length) throw new Error(errors.join('\n'));
    await pause(100);
  }
  if (!results?.length) throw new Error('Browser tests did not complete');
  for (const result of results) console.log(`${result.passed ? 'PASS' : 'FAIL'} ${result.name}${result.error ? ': ' + result.error : ''}`);
  if (results.some(r => !r.passed) || errors.length) throw new Error(errors.join('\n') || 'Browser regressions failed');
  if (process.env.HSK_UI_CAPTURE_DIR) {
    await mkdir(process.env.HSK_UI_CAPTURE_DIR, { recursive: true });
    for (const dark of [false, true]) for (const route of ['/', '/mandarin', '/cantonese', '/cantonese/lessons', '/mandarin/notebook', '/mandarin#learning-path']) {
      await call('Runtime.evaluate', { expression: `window.__showDesignRoute(${JSON.stringify(route)}, ${dark})`, awaitPromise: true });
      const shot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      await writeFile(join(process.env.HSK_UI_CAPTURE_DIR, `${route.replaceAll('/', '-').replaceAll('#', '-').slice(1) || 'gateway'}-${dark ? 'dark' : 'light'}.png`), Buffer.from(shot.data, 'base64'));
    }
    console.log(`Saved UI previews to ${process.env.HSK_UI_CAPTURE_DIR}`);
  }
} finally {
  socket?.close(); browser?.kill(); server.kill();
  await pause(250);
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
