// Browser-level CDP input for the judge video. This never calls the product API
// directly; it moves the real browser pointer and clicks the deployed UI.
const port = Number(process.argv[2]);
if (!Number.isInteger(port) || port < 1) throw new Error("Pass the agent-browser CDP port.");

const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
const page = pages.find((entry) => entry.type === "page" && entry.url.startsWith("https://vinrelease.vercel.app/"));
if (!page) throw new Error("The deployed VINRelease tab is not open.");
const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});
let nextId = 1;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const begun = Date.now();
const stamp = () => ((Date.now() - begun) / 1000).toFixed(1);
function log(message) { process.stdout.write(`${stamp()}s ${message}\n`); }
async function until(seconds) { await sleep(Math.max(0, seconds * 1000 - (Date.now() - begun))); }
async function waitFor(expression, description, timeout = 10000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    if (await evaluate(expression)) return;
    await sleep(200);
  }
  throw new Error(`Timed out waiting for ${description}`);
}
let position = { x: 800, y: 700 };
async function move(x, y, duration = 650) {
  const from = position;
  const steps = Math.max(8, Math.round(duration / 24));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const eased = t * t * (3 - 2 * t);
    const px = Math.round(from.x + (x - from.x) * eased);
    const py = Math.round(from.y + (y - from.y) * eased);
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: px, y: py, buttons: 0 });
    await sleep(duration / steps);
  }
  position = { x, y };
}
async function box(expression) {
  const value = await evaluate(`(() => { const element = ${expression}; if (!element) return null; const r = element.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, visible: r.bottom > 0 && r.top < innerHeight }; })()`);
  if (!value || !value.visible) throw new Error(`Target not visible: ${expression}`);
  return value;
}
async function moveTo(expression, duration) { const target = await box(expression); await move(target.x, target.y, duration); }
async function click(expression) {
  await moveTo(expression);
  await sleep(220);
  await send("Input.dispatchMouseEvent", { type: "mousePressed", x: position.x, y: position.y, button: "left", buttons: 1, clickCount: 1 });
  await sleep(110);
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: position.x, y: position.y, button: "left", buttons: 0, clickCount: 1 });
}
async function key(keyName, windowsVirtualKeyCode) {
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: keyName, windowsVirtualKeyCode });
  await sleep(100);
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: keyName, windowsVirtualKeyCode });
}
async function wheel(deltaY) {
  await send("Input.dispatchMouseEvent", { type: "mouseWheel", x: position.x, y: position.y, deltaX: 0, deltaY });
  await sleep(800);
}

try {
  if (!(await evaluate('Boolean(document.querySelector(".mode-pill.demo"))'))) {
    throw new Error("Safe demo badge absent; refusing any call action.");
  }
  if (await evaluate('Boolean(document.querySelector("button[aria-label=\\"Close call preview\\"]"))')) {
    await click('document.querySelector("button[aria-label=\\"Close call preview\\"]")');
  }
  await click('document.querySelector("button[title=\\"Reset demo\\"]")');
  await waitFor('Boolean(document.querySelector(".status.ready_to_contact"))', "reset case");
  await move(1235, 290);
  log("opening: value at risk");
  await until(6);
  await move(1320, 450);
  await until(11);
  await move(525, 558);
  await until(16);
  await click('document.querySelector("button.primary-button")');
  await waitFor('Boolean(document.querySelector(".modal"))', "first call preview");
  log("first authorization preview");
  await move(667, 225);
  await until(24);
  await move(668, 330);
  await until(31);
  await move(537, 456);
  await until(37);
  await move(814, 454);
  await until(43);
  await click('document.querySelector(".confirm-row input")');
  await until(48);
  await click('document.querySelector("button.authorize-button")');
  await waitFor('Boolean(document.querySelector(".status.ready_for_next_call"))', "auction replay result");
  log("auction result: next call ready");
  await move(506, 557);
  await until(56);
  await move(775, 557);
  await until(61);
  await move(686, 791);
  await wheel(455);
  await waitFor('Boolean(document.querySelector("details.evidence"))', "first evidence");
  await click('document.querySelector("details.evidence summary")');
  await until(70);
  await moveTo('document.querySelector("details.evidence p")');
  await until(75);
  await wheel(-650);
  await click('document.querySelector("button.primary-button")');
  await waitFor('Boolean(document.querySelector(".modal"))', "second call preview");
  log("second authorization preview");
  await move(667, 225);
  await until(84);
  await move(684, 330);
  await until(91);
  await move(814, 454);
  await until(96);
  await click('document.querySelector(".confirm-row input")');
  await until(100);
  await click('document.querySelector("button.authorize-button")');
  await waitFor('Boolean(document.querySelector(".status.waiting_external"))', "lienholder replay result");
  log("lienholder result: waiting external");
  await move(540, 557);
  await until(108);
  await move(1247, 670);
  await until(113);
  await move(700, 800);
  await wheel(510);
  await click('document.querySelector("details.evidence summary")');
  await until(120);
  await moveTo('document.querySelector("details.evidence strong")');
  await until(124);
  await wheel(-690);
  await click('document.querySelector("button[title=\\"Reset demo\\"]")');
  await waitFor('Boolean(document.querySelector(".status.ready_to_contact"))', "reset before human stop");
  await click('document.querySelector("button.primary-button")');
  await waitFor('Boolean(document.querySelector(".modal"))', "human-stop preview");
  log("human-stop authorization preview");
  await moveTo('document.querySelector(".scenario select")');
  await click('document.querySelector(".scenario select")');
  await key("ArrowDown", 40);
  await key("Enter", 13);
  await waitFor('document.querySelector(".scenario select")?.value === "human-stop"', "credential-request selection");
  await until(138);
  await move(812, 454);
  await until(144);
  await click('document.querySelector(".confirm-row input")');
  await until(149);
  await click('document.querySelector("button.authorize-button")');
  await waitFor('Boolean(document.querySelector(".status.needs_human"))', "title-clerk handoff");
  log("human-stop result: needs title clerk");
  await move(526, 559);
  await until(157);
  await move(1201, 676);
  await until(163);
  await move(1243, 35);
  await until(169);
  await move(1228, 817);
  await until(174);
  log("recording actions complete");
} finally {
  socket.close();
}
