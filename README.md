# StockEnv

**Protect your environment variables directly in VS Code.**

StockEnv replaces the default text editor for `.env` files with an interactive table view. Keys and values are displayed in separate columns, masked by default, and can be revealed individually or all at once.

No data leaves your machine. No network requests. Everything stays local.

---

## Full privacy mode

When you open a `.env` file, everything is hidden by default. Keys are blurred, values are replaced by dots. Nobody looking over your shoulder can read your secrets.

![Full privacy mode — keys and values masked](https://raw.githubusercontent.com/anthonymarandon/stockenv-extension/main/images/1.png)

---

## Reveal keys only

Click **Keys masked** to reveal the variable names while keeping all values hidden. Useful to navigate your file without exposing sensitive data.

![Keys visible, values masked](https://raw.githubusercontent.com/anthonymarandon/stockenv-extension/main/images/2.png)

---

## Reveal everything

Click both toggle buttons to show keys and values. All lock icons switch to unlocked. You're in full editing mode.

![Keys and values visible](https://raw.githubusercontent.com/anthonymarandon/stockenv-extension/main/images/3.png)

---

## Reveal values only

Need to check a value without seeing which key it belongs to? Toggle values on while keeping keys blurred.

![Keys masked, values visible](https://raw.githubusercontent.com/anthonymarandon/stockenv-extension/main/images/4.png)

---

## Per-row reveal

Don't want to reveal all values at once? Click the lock icon on a single row to unmask only that value. All other rows stay hidden. Keys must be visible to know which row you're looking at.

---

## Features

### Table view
Every `.env` file opens automatically as a clean, readable table with two columns: **Key** and **Value**.

### Masking by default
Both keys and values are hidden when you open a file:
- **Keys** are blurred (visible shape, unreadable content)
- **Values** are replaced by `••••••••`

### Per-column toggle
Two buttons in the toolbar let you control visibility independently:

| Button | Hidden state | Visible state |
|---|---|---|
| **Keys** | `Keys masked` (blurred) | `Keys visible` |
| **Values** | `Values masked` (dots) | `Values visible` |

### Per-row reveal
Click the lock icon on any row to unmask only that value while keeping all others hidden.

### Inline editing
Click on any key or value cell to edit it directly in the table. Press **Enter** to confirm, **Escape** to cancel.

Surrounding quotes (`"` or `'`) are stripped from the display and restored automatically when saving. You edit the actual value, not the syntax.

### Sections
Comments starting with `#` are detected as section headers. They appear with an accent color and bold text in both views.

- **+ Add Section** in the toolbar opens a dialog to name the section, then creates it at the end of the file
- Hover a section header to reveal a **+** button that adds a variable directly inside that section
- Section names are editable inline — click to rename, press **Enter** to confirm
- Hover a section header to reveal **up/down chevrons** to reorder sections

### Multi-select & move
Each variable row has a checkbox. Select one or more variables, then use the **Move to section** button in the selection bar to move them all at once. You can also hover a single row and click the pen icon to move just that variable. Works in both table and text views.

### Add & Delete
- **+ Add Variable** creates a new row at the end of the file
- **+** on a section header adds a variable inside that section
- Hover a row to reveal the **x** button to delete it

### Switch between views
A **Text Editor** button in the toolbar lets you switch to an integrated text view that displays the `.env` content as plain `KEY=VALUE` lines. All masking features remain active in both views: key blurring, value masking, per-row reveal, add, delete, and save. Click **Table View** to switch back.

A **Raw File** button opens the file in VS Code's native text editor, bypassing the extension entirely. When you reopen the file later, the custom editor view is restored automatically.

### Save button
A **Save** button in the toolbar lets you save without keyboard shortcuts. It shows a brief confirmation after saving.

---

## Supported files

StockEnv activates on all files matching these patterns:

- `.env`
- `.env.local`
- `.env.development`
- `.env.production`
- `.env.staging`
- `.env.test`
- `.env.example`
- `.env.*` (any other variant)

---

## How to use

1. Install StockEnv from the VS Code Marketplace
2. Open any `.env` file — the table view opens automatically
3. Use the toolbar buttons to show/hide keys and values
4. Click the lock icon per row to reveal individual values
5. Edit cells directly by clicking on them
6. Click **Save** to write changes to disk

To switch between views:
- **Table → Text**: click the **Text Editor** button in the toolbar
- **Text → Table**: click the **Table View** button in the toolbar
- **Raw file**: click the **Raw File** button to open in VS Code's default editor

---

## Security

- **No network access** — CSP `default-src 'none'` blocks all external requests
- **No dependencies** — zero runtime packages, only the VS Code API
- **No file access** — the webview cannot read any file beyond the opened document
- **Input validation** — all messages between the webview and extension are type-checked and bounds-verified
- **XSS protection** — all user content is escaped before rendering

---

## Requirements

- VS Code 1.85.0 or later

---

## License

[MIT](LICENSE)
