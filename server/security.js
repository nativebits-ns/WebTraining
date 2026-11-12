"use strict";

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function serializeForHtml(data) {
    return JSON.stringify(data)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");
}

function toPublicUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };
}

const ALLOWED_SETTINGS = Object.freeze({
    theme: ["light", "dark"],
    language: ["en", "fr"],
    fontSize: ["small", "medium", "large"]
});

function validateSettings(input, defaults) {
    if (input === null || typeof input !== "object" || Array.isArray(input)) {
        return { ok: false };
    }

    for (const key of Object.keys(input)) {
        if (!Object.hasOwn(ALLOWED_SETTINGS, key)) {
            return { ok: false };
        }
    }

    const settings = Object.assign(Object.create(null), defaults);

    for (const key of Object.keys(ALLOWED_SETTINGS)) {
        if (!Object.hasOwn(input, key)) continue;

        const value = input[key];
        if (typeof value !== "string" || !ALLOWED_SETTINGS[key].includes(value)) {
            return { ok: false };
        }
        settings[key] = value;
    }

    return { ok: true, settings: { ...settings } };
}


const CSP_DIRECTIVES = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'"
];

function securityHeaders(req, res, next) {
    res.setHeader("Content-Security-Policy", CSP_DIRECTIVES.join("; "));
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    next();
}

module.exports = {
    escapeHtml,
    serializeForHtml,
    toPublicUser,
    validateSettings,
    securityHeaders,
    ALLOWED_SETTINGS,
    CSP_DIRECTIVES
};
