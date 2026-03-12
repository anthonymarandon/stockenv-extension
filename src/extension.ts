import * as vscode from "vscode";

const MASK = "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022";

interface EnvEntry {
  type: "pair";
  key: string;
  value: string;
}

interface EnvComment {
  type: "comment" | "blank";
  raw: string;
}

type EnvLine = EnvEntry | EnvComment;

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
    return {
      type: "pair",
      key: raw.substring(0, eqIndex).trim(),
      value: raw.substring(eqIndex + 1),
    };
  });
}

function serializeEnv(lines: EnvLine[]): string {
  return lines
    .map((l) => {
      if (l.type === "pair") {
        return `${l.key}=${l.value}`;
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
    webviewPanel.webview.options = { enableScripts: true };

    const updateWebview = () => {
      const lines = parseEnv(document.getText());
      webviewPanel.webview.html = this.getHtml(webviewPanel.webview, lines);
    };

    // Sync: document → webview
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

    // Sync: webview → document
    webviewPanel.webview.onDidReceiveMessage(async (msg) => {
      if (msg.type === "edit") {
        const lines = parseEnv(document.getText());
        const entry = lines[msg.lineIndex];
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
        edit.insert(document.uri, insertPos, `${prefix}NEW_KEY=value`);
        await vscode.workspace.applyEdit(edit);
      }

      if (msg.type === "deleteRow") {
        const lines = parseEnv(document.getText());
        if (msg.lineIndex < 0 || msg.lineIndex >= lines.length) return;
        lines.splice(msg.lineIndex, 1);
        const edit = new vscode.WorkspaceEdit();
        edit.replace(
          document.uri,
          new vscode.Range(0, 0, document.lineCount, 0),
          serializeEnv(lines)
        );
        await vscode.workspace.applyEdit(edit);
      }
    });

    updateWebview();
  }

  private getHtml(webview: vscode.Webview, lines: EnvLine[]): string {
    const rows = lines
      .map((line, i) => {
        if (line.type === "comment" || line.type === "blank") {
          return `<tr class="comment-row" data-index="${i}">
            <td colspan="3" class="comment">${escapeHtml(line.raw)}</td>
          </tr>`;
        }
        const pair = line as EnvEntry;
        return `<tr data-index="${i}">
          <td class="cell-key" data-field="key" data-index="${i}">${escapeHtml(pair.key)}</td>
          <td class="cell-value" data-field="value" data-index="${i}">
            <span class="real-value">${escapeHtml(pair.value)}</span>
            <span class="masked-value">${MASK}</span>
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
    --input-border: var(--vscode-input-border, #555);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    color: var(--fg);
    font-family: var(--vscode-editor-font-family, monospace);
    font-size: var(--vscode-editor-font-size, 13px);
    padding: 12px;
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .toggle-btn {
    background: var(--header-bg);
    color: var(--fg);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 4px 10px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .toggle-btn:hover { border-color: var(--accent); }
  .toggle-btn .icon { font-size: 14px; }

  .add-btn {
    background: var(--btn-bg);
    color: var(--btn-fg);
    border: none;
    border-radius: 4px;
    padding: 4px 12px;
    cursor: pointer;
    font-size: 12px;
    margin-left: auto;
  }
  .add-btn:hover { opacity: 0.9; }

  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  thead th {
    background: var(--header-bg);
    padding: 8px 12px;
    text-align: left;
    border-bottom: 2px solid var(--border);
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 1;
    user-select: none;
  }

  th.col-key { width: 35%; }
  th.col-value { width: 55%; }
  th.col-actions { width: 10%; text-align: center; }

  td {
    padding: 6px 12px;
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

  body.keys-hidden .cell-key {
    color: transparent;
    text-shadow: 0 0 8px var(--fg);
    pointer-events: none;
  }

  body.values-hidden .real-value { display: none; }
  body.values-hidden .masked-value { display: inline; }
  body.values-hidden .cell-value { pointer-events: none; }

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
  .btn-delete:hover { opacity: 1; transform: scale(1.2); }

  .cell-actions { text-align: center; }
</style>
</head>
<body>
  <div class="toolbar">
    <button class="toggle-btn" id="toggleKeys">
      <span class="icon" id="keysIcon">&#x1F441;</span>
      Keys
    </button>
    <button class="toggle-btn" id="toggleValues">
      <span class="icon" id="valuesIcon">&#x1F441;</span>
      Values
    </button>
    <button class="add-btn" id="addRow">+ Add Variable</button>
  </div>

  <table>
    <thead>
      <tr>
        <th class="col-key">Key</th>
        <th class="col-value">Value</th>
        <th class="col-actions"></th>
      </tr>
    </thead>
    <tbody id="tableBody">
      ${rows}
    </tbody>
  </table>

<script>
  const vscode = acquireVsCodeApi();

  let keysHidden = false;
  let valuesHidden = true;

  // Apply initial state
  document.body.classList.add("values-hidden");

  document.getElementById("toggleKeys").addEventListener("click", () => {
    keysHidden = !keysHidden;
    document.body.classList.toggle("keys-hidden", keysHidden);
    document.getElementById("keysIcon").textContent = keysHidden ? "\\u{1F441}\\u{200D}\\u{1F5E8}" : "\\u{1F441}";
  });

  document.getElementById("toggleValues").addEventListener("click", () => {
    valuesHidden = !valuesHidden;
    document.body.classList.toggle("values-hidden", valuesHidden);
    document.getElementById("valuesIcon").textContent = valuesHidden ? "\\u{1F441}\\u{200D}\\u{1F5E8}" : "\\u{1F441}";
  });

  // Inline editing
  document.querySelectorAll(".cell-key, .cell-value").forEach(cell => {
    cell.setAttribute("contenteditable", "true");
    cell.setAttribute("spellcheck", "false");

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
      if (e.key === "Enter") {
        e.preventDefault();
        cell.blur();
      }
      if (e.key === "Escape") {
        cell.blur();
      }
    });
  });

  // Delete row
  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index);
      vscode.postMessage({ type: "deleteRow", lineIndex: index });
    });
  });

  // Add row
  document.getElementById("addRow").addEventListener("click", () => {
    vscode.postMessage({ type: "addRow" });
  });

  // Handle updates from extension
  window.addEventListener("message", (event) => {
    const msg = event.data;
    if (msg.type === "update") {
      // Rebuild table rows
      const tbody = document.getElementById("tableBody");
      tbody.innerHTML = msg.lines.map((line, i) => {
        if (line.type === "comment" || line.type === "blank") {
          return \`<tr class="comment-row" data-index="\${i}">
            <td colspan="3" class="comment">\${escapeHtml(line.raw)}</td>
          </tr>\`;
        }
        return \`<tr data-index="\${i}">
          <td class="cell-key" contenteditable="true" spellcheck="false" data-field="key" data-index="\${i}">\${escapeHtml(line.key)}</td>
          <td class="cell-value" contenteditable="true" spellcheck="false" data-field="value" data-index="\${i}">
            <span class="real-value">\${escapeHtml(line.value)}</span>
            <span class="masked-value">${MASK}</span>
          </td>
          <td class="cell-actions">
            <button class="btn-delete" data-index="\${i}" title="Delete">&#x2715;</button>
          </td>
        </tr>\`;
      }).join("");

      // Re-bind events
      bindCellEvents();
    }
  });

  function bindCellEvents() {
    document.querySelectorAll(".cell-key, .cell-value").forEach(cell => {
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
    document.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", () => {
        vscode.postMessage({ type: "deleteRow", lineIndex: parseInt(btn.dataset.index) });
      });
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
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
}

export function deactivate() {}
