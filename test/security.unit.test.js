const test = require("node:test");
const assert = require("node:assert/strict");

const {
    escapeHtml,
    serializeForHtml,
    toPublicUser,
    validateSettings,
    CSP_DIRECTIVES
} = require("../server/security");
const { user, defaultSettings } = require("../server/data");

test("escapeHtml neutralises markup", () => {
    assert.equal(
        escapeHtml(`<img src=x onerror=alert(1)>"'&`),
        "&lt;img src=x onerror=alert(1)&gt;&quot;&#39;&amp;"
    );
});

test("serializeForHtml cannot break out of a script block", () => {
    const out = serializeForHtml({ name: "</script><script>alert(1)</script>" });
    assert.ok(!out.includes("</script"));
    assert.ok(!out.includes("<"));
    assert.equal(JSON.parse(out).name, "</script><script>alert(1)</script>");
});

test("toPublicUser never exposes tokens", () => {
    const pub = toPublicUser(user);
    assert.deepEqual(Object.keys(pub).sort(), ["email", "id", "name", "role"]);
    assert.ok(!JSON.stringify(pub).includes("TOKEN"));
});

test("validateSettings accepts valid settings (positive)", () => {
    const r = validateSettings({ theme: "dark", language: "fr", fontSize: "large" }, defaultSettings);
    assert.equal(r.ok, true);
    assert.deepEqual(r.settings, { theme: "dark", language: "fr", fontSize: "large" });
});

test("validateSettings rejects prototype pollution payloads (negative)", () => {
    const payloads = [
        '{"__proto__":{"isAdmin":true}}',
        '{"constructor":{"prototype":{"isAdmin":true}}}',
        '{"theme":"dark","__proto__":{"polluted":"yes"}}',
        '{"prototype":{"x":1}}'
    ];
    for (const raw of payloads) {
        assert.equal(validateSettings(JSON.parse(raw), defaultSettings).ok, false, raw);
    }
    assert.equal({}.isAdmin, undefined);
    assert.equal({}.polluted, undefined);
});

test("validateSettings rejects bad values and bad shapes (negative)", () => {
    assert.equal(validateSettings({ theme: "<script>" }, defaultSettings).ok, false);
    assert.equal(validateSettings({ theme: { a: 1 } }, defaultSettings).ok, false);
    assert.equal(validateSettings([], defaultSettings).ok, false);
    assert.equal(validateSettings(null, defaultSettings).ok, false);
    assert.equal(validateSettings("x", defaultSettings).ok, false);
});

test("CSP blocks inline scripts, plugins, base tag and framing", () => {
    const csp = CSP_DIRECTIVES.join("; ");
    assert.match(csp, /script-src 'self'(;|$)/);
    assert.ok(!csp.includes("unsafe-inline"));
    assert.ok(!csp.includes("unsafe-eval"));
    assert.match(csp, /object-src 'none'/);
    assert.match(csp, /base-uri 'none'/);
    assert.match(csp, /frame-ancestors 'none'/);
});
