import * as vscode from "vscode";

const MASK = "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022";

interface EnvEntry {
  type: "pair";
  key: string;
  value: string;
  quoteChar: string; // "", "'", or '"'
}

interface EnvComment {
  type: "comment" | "blank";
  raw: string;
}

type EnvLine = EnvEntry | EnvComment;

function stripQuotes(raw: string): { value: string; quoteChar: string } {
  const trimmed = raw.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return {
      value: trimmed.substring(1, trimmed.length - 1),
      quoteChar: trimmed[0],
    };
  }
  return { value: raw, quoteChar: "" };
}

function parseEnv(text: string): EnvLine[] {
  return text.split("\n").map((raw) => {
    const trimmed = raw.trim();
    if (trimmed === "") {
      return { type: "blank", raw };
    }
    if (trimmed.startsWith("#")) {
      return { type: "comment", raw };
    }
    const eqIndex = raw.indexOf("=");
    if (eqIndex === -1) {
      return { type: "comment", raw };
    }
    const rawValue = raw.substring(eqIndex + 1);
    const { value, quoteChar } = stripQuotes(rawValue);
    return { type: "pair", key: raw.substring(0, eqIndex).trim(), value, quoteChar };
  });
}

function serializeEnv(lines: EnvLine[]): string {
  return lines
    .map((l) => {
      if (l.type === "pair") {
        const q = l.quoteChar;
        return `${l.key}=${q}${l.value}${q}`;
      }
      return l.raw;
    })
    .join("\n");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

class EnvTableEditorProvider implements vscode.CustomTextEditorProvider {
  constructor(private readonly context: vscode.ExtensionContext) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [],
    };

    const updateWebview = () => {
      const lines = parseEnv(document.getText());
      webviewPanel.webview.html = this.getHtml(lines);
    };

    const docChangeSubscription = vscode.workspace.onDidChangeTextDocument(
      (e) => {
        if (e.document.uri.toString() === document.uri.toString()) {
          webviewPanel.webview.postMessage({
            type: "update",
            lines: parseEnv(document.getText()),
          });
        }
      }
    );

    webviewPanel.onDidDispose(() => docChangeSubscription.dispose());

    webviewPanel.webview.onDidReceiveMessage(async (msg) => {
      if (msg.type === "edit") {
        const lineIndex = parseInt(msg.lineIndex);
        if (isNaN(lineIndex) || msg.field !== "key" && msg.field !== "value") return;
        if (typeof msg.value !== "string") return;

        const lines = parseEnv(document.getText());
        if (lineIndex < 0 || lineIndex >= lines.length) return;
        const entry = lines[lineIndex];
        if (!entry || entry.type !== "pair") return;

        if (msg.field === "key") {
          entry.key = msg.value;
        } else {
          entry.value = msg.value;
        }

        const edit = new vscode.WorkspaceEdit();
        edit.replace(
          document.uri,
          new vscode.Range(0, 0, document.lineCount, 0),
          serializeEnv(lines)
        );
        await vscode.workspace.applyEdit(edit);
      }

      if (msg.type === "addRow") {
        const edit = new vscode.WorkspaceEdit();
        const lastLine = document.lineAt(document.lineCount - 1);
        const insertPos = lastLine.range.end;
        const prefix = lastLine.text.trim() === "" ? "" : "\n";
        edit.insert(document.uri, insertPos, `${prefix}NEW_KEY="value"`);
        await vscode.workspace.applyEdit(edit);
      }

      if (msg.type === "save") {
        await document.save();
      }

      if (msg.type === "deleteRow") {
        const delIndex = parseInt(msg.lineIndex);
        if (isNaN(delIndex)) return;
        const lines = parseEnv(document.getText());
        if (delIndex < 0 || delIndex >= lines.length) return;
        lines.splice(delIndex, 1);
        const edit = new vscode.WorkspaceEdit();
        edit.replace(
          document.uri,
          new vscode.Range(0, 0, document.lineCount, 0),
          serializeEnv(lines)
        );
        await vscode.workspace.applyEdit(edit);
      }

      if (msg.type === "openAsText") {
        await vscode.commands.executeCommand("workbench.action.reopenTextEditor");
      }
    });

    updateWebview();
  }

  private getHtml(lines: EnvLine[]): string {
    const rows = lines
      .map((line, i) => {
        if (line.type === "comment" || line.type === "blank") {
          return `<tr class="comment-row" data-index="${i}">
            <td colspan="4" class="comment">${escapeHtml(line.raw)}</td>
          </tr>`;
        }
        const pair = line as EnvEntry;
        return `<tr data-index="${i}">
          <td class="cell-key" data-field="key" data-index="${i}">${escapeHtml(pair.key)}</td>
          <td class="cell-value" data-field="value" data-index="${i}">
            <span class="real-value">${escapeHtml(pair.value)}</span>
            <span class="masked-value">${MASK}</span>
          </td>
          <td class="cell-reveal">
            <button class="btn-reveal" data-index="${i}" title="Reveal this value">
              <span class="reveal-icon">&#x1F512;</span>
            </button>
          </td>
          <td class="cell-actions">
            <button class="btn-delete" data-index="${i}" title="Delete">&#x2715;</button>
          </td>
        </tr>`;
      })
      .join("\n");

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
<style>
  :root {
    --bg: var(--vscode-editor-background);
    --fg: var(--vscode-editor-foreground);
    --border: var(--vscode-panel-border, #333);
    --header-bg: var(--vscode-editorGroupHeader-tabsBackground, #252526);
    --hover: var(--vscode-list-hoverBackground, #2a2d2e);
    --accent: var(--vscode-focusBorder, #007acc);
    --mask-color: var(--vscode-editorInfo-foreground, #3794ff);
    --btn-bg: var(--vscode-button-background, #0e639c);
    --btn-fg: var(--vscode-button-foreground, #fff);
    --input-bg: var(--vscode-input-background, #3c3c3c);
    --success: var(--vscode-testing-iconPassed, #73c991);
    --warning: var(--vscode-editorWarning-foreground, #cca700);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    color: var(--fg);
    font-family: var(--vscode-editor-font-family, monospace);
    font-size: var(--vscode-editor-font-size, 13px);
    padding: 16px;
  }

  /* ── Toolbar ── */
  .toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    padding: 8px 12px;
    background: var(--header-bg);
    border: 1px solid var(--border);
    border-radius: 6px;
  }

  .toggle-btn {
    background: transparent;
    color: var(--fg);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 6px 14px;
    cursor: pointer;
    font-size: 12px;
    font-family: inherit;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.15s;
  }
  .toggle-btn:hover { border-color: var(--accent); background: var(--hover); }

  .toggle-btn.active {
    border-color: var(--success);
    color: var(--success);
  }
  .toggle-btn.hidden-state {
    border-color: var(--warning);
    color: var(--warning);
  }

  .toggle-btn .icon { font-size: 15px; }
  .toggle-btn .label { font-weight: 500; }

  .separator {
    width: 1px;
    height: 24px;
    background: var(--border);
  }

  .add-btn {
    background: var(--btn-bg);
    color: var(--btn-fg);
    border: none;
    border-radius: 4px;
    padding: 6px 14px;
    cursor: pointer;
    font-size: 12px;
    font-family: inherit;
    margin-left: auto;
  }
  .add-btn:hover { opacity: 0.9; }

  .save-btn {
    background: var(--success);
    color: #000;
    border: none;
    border-radius: 4px;
    padding: 6px 14px;
    cursor: pointer;
    font-size: 12px;
    font-family: inherit;
    font-weight: 600;
    transition: opacity 0.15s;
  }
  .save-btn:hover { opacity: 0.85; }
  .save-btn.saved {
    opacity: 0.6;
    pointer-events: none;
  }

  .switch-btn {
    border-color: var(--accent);
    color: var(--accent);
  }

  /* ── Table ── */
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  thead th {
    background: var(--header-bg);
    padding: 10px 12px;
    text-align: left;
    border-bottom: 2px solid var(--border);
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 1;
    user-select: none;
  }

  th.col-key { width: 30%; }
  th.col-value { width: 50%; }
  th.col-reveal { width: 10%; text-align: center; }
  th.col-actions { width: 10%; text-align: center; }

  td {
    padding: 7px 12px;
    border-bottom: 1px solid var(--border);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  tr:hover:not(.comment-row) { background: var(--hover); }

  .comment {
    color: var(--vscode-editorLineNumber-foreground, #858585);
    font-style: italic;
  }

  /* ── Cells ── */
  .cell-key, .cell-value {
    cursor: text;
    position: relative;
  }

  .cell-key:focus, .cell-value:focus {
    outline: 1px solid var(--accent);
    outline-offset: -1px;
    background: var(--input-bg);
  }

  .masked-value {
    display: none;
    color: var(--mask-color);
    letter-spacing: 2px;
  }

  /* ── Keys blur ── */
  body.keys-hidden .cell-key {
    color: transparent;
    text-shadow: 0 0 8px var(--fg);
    pointer-events: none;
  }

  /* ── Values global mask ── */
  body.values-hidden .real-value { display: none; }
  body.values-hidden .masked-value { display: inline; }
  body.values-hidden .cell-value { pointer-events: none; }

  /* ── Per-row revealed (overrides global mask) ── */
  body.values-hidden tr.row-revealed .real-value { display: inline; }
  body.values-hidden tr.row-revealed .masked-value { display: none; }
  body.values-hidden tr.row-revealed .cell-value { pointer-events: auto; }

  /* ── Reveal button ── */
  .cell-reveal { text-align: center; }

  .btn-reveal {
    background: none;
    border: 1px solid transparent;
    cursor: pointer;
    font-size: 14px;
    padding: 2px 6px;
    border-radius: 3px;
    transition: all 0.15s;
  }
  .btn-reveal:hover { border-color: var(--accent); background: var(--hover); }

  tr.row-revealed .btn-reveal { border-color: var(--success); }
  tr.row-revealed .reveal-icon::after { content: ""; }

  /* ── Delete button ── */
  .cell-actions { text-align: center; }

  .btn-delete {
    background: none;
    border: none;
    color: var(--vscode-errorForeground, #f44);
    cursor: pointer;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.15s;
  }
  tr:hover .btn-delete { opacity: 1; }
  .btn-delete:hover { transform: scale(1.2); }
</style>
</head>
<body class="keys-hidden values-hidden">

  <div class="toolbar">
    <button class="toggle-btn hidden-state" id="toggleKeys">
      <span class="icon">&#x1F6AB;</span>
      <span class="label" id="keysLabel">Keys masked</span>
    </button>
    <div class="separator"></div>
    <button class="toggle-btn hidden-state" id="toggleValues">
      <span class="icon">&#x1F512;</span>
      <span class="label" id="valuesLabel">Values masked</span>
    </button>
    <button class="add-btn" id="addRow">+ Add Variable</button>
    <button class="save-btn" id="saveBtn">&#x1F4BE; Save</button>
    <div class="separator"></div>
    <button class="toggle-btn switch-btn" id="switchEditor" title="Switch to text editor">
      <span class="icon">&#x1F4DD;</span>
      <span class="label">Text Editor</span>
    </button>
  </div>

  <table>
    <thead>
      <tr>
        <th class="col-key">Key</th>
        <th class="col-value">Value</th>
        <th class="col-reveal"></th>
        <th class="col-actions"></th>
      </tr>
    </thead>
    <tbody id="tableBody">
      ${rows}
    </tbody>
  </table>

<script>
  const vscode = acquireVsCodeApi();

  let keysHidden = true;
  let valuesHidden = true;
  const revealedRows = new Set();

  // ── Toggle Keys ──
  document.getElementById("toggleKeys").addEventListener("click", () => {
    keysHidden = !keysHidden;
    document.body.classList.toggle("keys-hidden", keysHidden);
    const btn = document.getElementById("toggleKeys");
    const label = document.getElementById("keysLabel");
    const icon = btn.querySelector(".icon");
    if (keysHidden) {
      label.textContent = "Keys masked";
      icon.innerHTML = "&#x1F6AB;";
      btn.classList.remove("active");
      btn.classList.add("hidden-state");
    } else {
      label.textContent = "Keys visible";
      icon.innerHTML = "&#x1F441;";
      btn.classList.remove("hidden-state");
      btn.classList.add("active");
    }
  });

  // ── Toggle Values (global) ──
  document.getElementById("toggleValues").addEventListener("click", () => {
    valuesHidden = !valuesHidden;
    document.body.classList.toggle("values-hidden", valuesHidden);
    // Reset per-row reveals
    revealedRows.clear();
    document.querySelectorAll("tr.row-revealed").forEach(tr => tr.classList.remove("row-revealed"));
    updateRevealIcons();

    const btn = document.getElementById("toggleValues");
    const label = document.getElementById("valuesLabel");
    const icon = btn.querySelector(".icon");
    if (valuesHidden) {
      label.textContent = "Values masked";
      icon.innerHTML = "&#x1F512;";
      btn.classList.remove("active");
      btn.classList.add("hidden-state");
    } else {
      label.textContent = "Values visible";
      icon.innerHTML = "&#x1F513;";
      btn.classList.remove("hidden-state");
      btn.classList.add("active");
    }
  });

  function updateRevealIcons() {
    document.querySelectorAll(".btn-reveal").forEach(btn => {
      const idx = parseInt(btn.dataset.index);
      const tr = btn.closest("tr");
      const icon = btn.querySelector(".reveal-icon");
      if (!valuesHidden || revealedRows.has(idx)) {
        icon.innerHTML = "&#x1F513;";
      } else {
        icon.innerHTML = "&#x1F512;";
      }
    });
  }

  // ── Per-row reveal ──
  function bindRevealButtons() {
    document.querySelectorAll(".btn-reveal").forEach(btn => {
      btn.addEventListener("click", () => {
        if (!valuesHidden) return; // all visible already
        const idx = parseInt(btn.dataset.index);
        const tr = btn.closest("tr");
        if (revealedRows.has(idx)) {
          revealedRows.delete(idx);
          tr.classList.remove("row-revealed");
        } else {
          revealedRows.add(idx);
          tr.classList.add("row-revealed");
        }
        updateRevealIcons();
      });
    });
  }

  // ── Inline editing ──
  function bindCellEvents() {
    document.querySelectorAll(".cell-key, .cell-value").forEach(cell => {
      cell.setAttribute("contenteditable", "true");
      cell.setAttribute("spellcheck", "false");

      cell.addEventListener("focus", () => {
        // When editing value, work with real-value span
        if (cell.dataset.field === "value") {
          const realSpan = cell.querySelector(".real-value");
          if (realSpan) {
            // Select the text in the real-value span
            const range = document.createRange();
            range.selectNodeContents(realSpan);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      });

      cell.addEventListener("blur", () => {
        const field = cell.dataset.field;
        const index = parseInt(cell.dataset.index);
        let value;
        if (field === "value") {
          const realSpan = cell.querySelector(".real-value");
          value = realSpan ? realSpan.textContent : cell.textContent;
        } else {
          value = cell.textContent;
        }
        vscode.postMessage({ type: "edit", lineIndex: index, field, value });
      });

      cell.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); cell.blur(); }
        if (e.key === "Escape") { cell.blur(); }
      });
    });
  }

  // ── Delete ──
  function bindDeleteButtons() {
    document.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", () => {
        vscode.postMessage({ type: "deleteRow", lineIndex: parseInt(btn.dataset.index) });
      });
    });
  }

  // ── Add row ──
  document.getElementById("addRow").addEventListener("click", () => {
    vscode.postMessage({ type: "addRow" });
  });

  // ── Switch to text editor ──
  document.getElementById("switchEditor").addEventListener("click", () => {
    vscode.postMessage({ type: "openAsText" });
  });

  // ── Save ──
  const saveBtn = document.getElementById("saveBtn");
  saveBtn.addEventListener("click", () => {
    vscode.postMessage({ type: "save" });
    saveBtn.textContent = "\\u2705 Saved";
    saveBtn.classList.add("saved");
    setTimeout(() => {
      saveBtn.innerHTML = "&#x1F4BE; Save";
      saveBtn.classList.remove("saved");
    }, 1500);
  });

  // ── Initial bind ──
  bindCellEvents();
  bindRevealButtons();
  bindDeleteButtons();
  updateRevealIcons();

  // ── Handle updates from extension ──
  window.addEventListener("message", (event) => {
    const msg = event.data;
    if (msg.type === "update") {
      const tbody = document.getElementById("tableBody");
      tbody.innerHTML = msg.lines.map((line, i) => {
        if (line.type === "comment" || line.type === "blank") {
          return \`<tr class="comment-row" data-index="\${i}">
            <td colspan="4" class="comment">\${esc(line.raw)}</td>
          </tr>\`;
        }
        const revealed = revealedRows.has(i) ? "row-revealed" : "";
        return \`<tr class="\${revealed}" data-index="\${i}">
          <td class="cell-key" data-field="key" data-index="\${i}">\${esc(line.key)}</td>
          <td class="cell-value" data-field="value" data-index="\${i}">
            <span class="real-value">\${esc(line.value)}</span>
            <span class="masked-value">${MASK}</span>
          </td>
          <td class="cell-reveal">
            <button class="btn-reveal" data-index="\${i}" title="Toggle this value">
              <span class="reveal-icon">&#x1F512;</span>
            </button>
          </td>
          <td class="cell-actions">
            <button class="btn-delete" data-index="\${i}" title="Delete">&#x2715;</button>
          </td>
        </tr>\`;
      }).join("");

      bindCellEvents();
      bindRevealButtons();
      bindDeleteButtons();
      updateRevealIcons();
    }
  });

  function esc(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }
</script>
</body>
</html>`;
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerCustomEditorProvider(
      "envshield.envTable",
      new EnvTableEditorProvider(context),
      { supportsMultipleEditorsPerDocument: false }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("envshield.openAsTable", () => {
      vscode.commands.executeCommand(
        "workbench.action.reopenWithEditor",
        "envshield.envTable"
      );
    })
  );
}

export function deactivate() {}
