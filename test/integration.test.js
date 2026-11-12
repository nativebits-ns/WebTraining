// Requires dependencies: run `npm install` first.
const test = require("node:test");
const assert = require("node:assert/strict");

const app = require("../server/server");

let server;
let base;

test.before(async () => {
    await new Promise((resolve) => {
        server = app.listen(0, "127.0.0.1", resolve);
    });
    base = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => server.close());

const post = (body, raw = false) =>
    fetch(`${base}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: raw ? body : JSON.stringify(body)
    });

test("CSP and clickjacking headers on pages, APIs and static files", async () => {
    for (const path of ["/", "/account", "/api/profile", "/app.js", "/styles.css"]) {
        const res = await fetch(base + path);
        assert.match(res.headers.get("content-security-policy"), /frame-ancestors 'none'/, path);
        assert.match(res.headers.get("content-security-policy"), /script-src 'self'/, path);
        assert.equal(res.headers.get("x-frame-options"), "DENY", path);
        assert.equal(res.headers.get("x-content-type-options"), "nosniff", path);
        assert.equal(res.headers.get("x-powered-by"), null, path);
    }
});

test("home page has no inline script and no tokens (SSR leakage)", async () => {
    const res = await fetch(base + "/");
    const html = await res.text();
    assert.ok(!html.includes("TRAINING-FAKE"));
    assert.ok(!html.includes("sessionToken"));
    assert.ok(!html.includes("refreshToken"));
    assert.ok(!/window\.initialUser/.test(html));
    const scripts = [...html.matchAll(/<script\b[^>]*>/g)].map((m) => m[0]);
    for (const s of scripts) {
        assert.ok(/type="application\/json"/.test(s) || /src="/.test(s), s);
    }
    const cookie = res.headers.get("set-cookie") || "";
    assert.match(cookie, /HttpOnly/i);
    assert.match(cookie, /SameSite=Strict/i);
});

test("/api/profile does not return tokens", async () => {
    const body = await (await fetch(base + "/api/profile")).json();
    assert.deepEqual(Object.keys(body).sort(), ["email", "id", "name", "role"]);
});

test("account page has no inline script/style", async () => {
    const html = await (await fetch(base + "/account")).text();
    assert.ok(!/<script>/.test(html));
    assert.ok(!/<style>/.test(html));
    assert.ok(html.includes('/account.js'));
});

test("valid settings are saved (functionality still works)", async () => {
    const res = await post({ theme: "dark", language: "fr", fontSize: "small" });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.message, "Settings saved successfully.");
    assert.deepEqual(body.settings, { theme: "dark", language: "fr", fontSize: "small" });
});

test("prototype pollution payloads are rejected", async () => {
    const payloads = [
        '{"__proto__":{"isAdmin":true}}',
        '{"constructor":{"prototype":{"isAdmin":true}}}',
        '{"theme":"dark","__proto__":{"polluted":"yes"}}'
    ];
    for (const raw of payloads) {
        const res = await post(raw, true);
        assert.equal(res.status, 400, raw);
    }
    assert.equal({}.isAdmin, undefined);
    assert.equal({}.polluted, undefined);
});

test("malformed JSON returns a generic 400", async () => {
    const res = await post("{bad json", true);
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { message: "Bad request." });
});
