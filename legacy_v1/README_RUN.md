# How to Run SecuRock

SecuRock is a static web application powered by HTML, CSS, and Vanilla JavaScript. It requires no complex backend or build process to run locally.

## Option 1: Live Server (Recommended)
If you use VS Code, this is the easiest way.

1.  Install the **Live Server** extension in VS Code.
2.  Right-click `index.html`.
3.  Select **"Open with Live Server"**.
4.  The app will open at `http://127.0.0.1:5500/`.

## Option 2: Python Simple HTTP Server
If you have Python installed (which you do), run this command in the project folder:

```bash
python -m http.server 8000
```

Then open your browser to: [http://localhost:8000](http://localhost:8000)

## Option 3: Direct File Open
You can simply double-click `index.html` to open it in your browser.
*Note: Some features like strict module loading or specific CORS requests might behave differently, but the core UI will work.*

## Navigation
-   **Landing Page**: `index.html`
-   **Pricing**: `pricing.html`
-   **Login**: `login.html`
-   **Dashboard**: `dashboard.html` (Accessible after "logging in" or clicking "Live Demo")
