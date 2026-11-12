const app = document.getElementById("app");

function readInitialUser() {
    const el = document.getElementById("initial-user");
    if (!el) return {};

    try {
        const data = JSON.parse(el.textContent);
        return data && typeof data === "object" ? data : {};
    } catch {
        return {};
    }
}

const initialUser = readInitialUser();
const params = new URLSearchParams(window.location.search);

const username = (params.get("name") || initialUser.name || "Guest")
    .toString()
    .slice(0, 50);

function createLine(label, value) {
    const p = document.createElement("p");
    p.textContent = `${label}: ${value}`;
    return p;
}

function renderProfile() {
    const section = document.createElement("section");
    section.className = "profile-card";

    const heading = document.createElement("h2");
    heading.textContent = `Welcome, ${username}`;

    section.append(
        heading,
        createLine("Email", initialUser.email || "Unknown"),
        createLine("Role", initialUser.role || "User")
    );

    app.replaceChildren(section);
}

renderProfile();

const ALLOWED_SETTINGS = {
    theme: ["light", "dark"],
    language: ["en", "fr"],
    fontSize: ["small", "medium", "large"]
};

function prepareSettings(userSettings) {
    const settings = {};

    for (const key of Object.keys(ALLOWED_SETTINGS)) {
        if (
            Object.hasOwn(userSettings, key) &&
            ALLOWED_SETTINGS[key].includes(userSettings[key])
        ) {
            settings[key] = userSettings[key];
        }
    }

    return settings;
}

const saveButton = document.getElementById("save-settings");

saveButton.addEventListener("click", async () => {
    const theme = document.getElementById("theme").value;
    const language = document.getElementById("language").value;
    const fontSize = document.getElementById("fontSize").value;

    const settings = prepareSettings({
        theme,
        language,
        fontSize
    });

    try {
        const response = await fetch("/api/settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(settings)
        });

        const result = await response.json();

        document.getElementById("settings-status").textContent =
            result.message;
    } catch (error) {
        document.getElementById("settings-status").textContent =
            "Unable to save settings.";
    }
});
