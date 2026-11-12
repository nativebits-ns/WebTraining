const express = require("express");
const path = require("path");

const { user, defaultSettings } = require("./data");
const {
    escapeHtml,
    serializeForHtml,
    toPublicUser,
    validateSettings,
    securityHeaders
} = require("./security");

const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");

app.use(securityHeaders);

app.use(express.json({ limit: "10kb" }));

/*
 * Home page
 */
app.get("/", (req, res) => {
    const initialUserData = serializeForHtml(toPublicUser(user));

    res.cookie("sessionToken", user.sessionToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    });

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >
            <title>User Security Dashboard</title>
            <link rel="stylesheet" href="/styles.css">
        </head>

        <body>
            <header class="header">
                <h1>User Security Dashboard</h1>
                <nav>
                    <a href="/">Dashboard</a>
                    <a href="/account">Account Settings</a>
                </nav>
            </header>

            <main class="container">
                <div id="app"></div>

                <section class="settings">
                    <h2>User Settings</h2>

                    <label>
                        Theme:
                        <select id="theme">
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </label>

                    <label>
                        Language:
                        <select id="language">
                            <option value="en">English</option>
                            <option value="fr">French</option>
                        </select>
                    </label>

                    <label>
                        Font Size:
                        <select id="fontSize">
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </label>

                    <button id="save-settings">
                        Save Settings
                    </button>

                    <p id="settings-status"></p>
                </section>
            </main>

            <script type="application/json" id="initial-user">${initialUserData}</script>

            <script src="/app.js"></script>
        </body>
        </html>
    `);
});

/*
 * Profile API
 */
app.get("/api/profile", (req, res) => {
    res.json(toPublicUser(user));
});

/*
 * Settings API
 */
app.get("/api/settings", (req, res) => {
    res.json(defaultSettings);
});

app.post("/api/settings", (req, res) => {
    const result = validateSettings(req.body, defaultSettings);

    if (!result.ok) {
        return res.status(400).json({ message: "Invalid settings." });
    }

    const settings = result.settings;

    res.json({
        message: "Settings saved successfully.",
        settings
    });
});

/*
 * Account page
 */
app.get("/account", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >
            <title>Account Settings</title>

            <link rel="stylesheet" href="/account.css">
        </head>

        <body>
            <div class="account-card">
                <h1>Account Settings</h1>

                <p>
                    <strong>Name:</strong>
                    ${escapeHtml(user.name)}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${escapeHtml(user.email)}
                </p>

                <p>
                    <strong>Role:</strong>
                    ${escapeHtml(user.role)}
                </p>

                <button
                    id="delete-account"
                    class="danger"
                >
                    Delete Account
                </button>

                <p id="status"></p>
            </div>

            <script src="/account.js"></script>
        </body>
        </html>
    `);
});

app.use(express.static(path.join(__dirname, "..", "client")));

app.use((err, req, res, next) => {
    if (err && err.status >= 400 && err.status < 500) {
        return res.status(400).json({ message: "Bad request." });
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Application running at http://localhost:${PORT}`);
    });
}

module.exports = app;