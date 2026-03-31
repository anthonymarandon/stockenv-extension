import * as vscode from "vscode";

const MASK = "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022";

// Lucide SVG icons (inline, CSP-safe)
const IC_EDIT = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>';
const IC_UP = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
const IC_DOWN = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
const IC_TRASH = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
const IC_LOCK_OPEN = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>';
const IC_LOCK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
const IC_EYE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>';
const IC_PLUS = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';
const IC_FILE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/></svg>';
const IC_TABLE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>';
const IC_COPY = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
const IC_FILE_TEXT = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>';
const IC_CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
const IC_SAVE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>';
const IC_EYE_OFF = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>';

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
        if (isNaN(lineIndex) || (msg.field !== "key" && msg.field !== "value")) return;
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

      else if (msg.type === "addRow" || msg.type === "addRowTop") {
        const key = await vscode.window.showInputBox({
          prompt: "Variable name",
          placeHolder: "e.g. DATABASE_URL, API_KEY…",
          validateInput: (v) => v.trim() === "" ? "Key cannot be empty" : undefined,
        });
        if (!key) return;
        const normalizedKey = key.trim().toUpperCase();
        const value = await vscode.window.showInputBox({
          prompt: `Value for ${normalizedKey}`,
          placeHolder: "Enter the value",
        });
        if (value === undefined) return;

        if (msg.type === "addRowTop") {
          const lines = parseEnv(document.getText());
          lines.splice(0, 0, { type: "pair", key: normalizedKey, value, quoteChar: '"' });
          const edit = new vscode.WorkspaceEdit();
          edit.replace(
            document.uri,
            new vscode.Range(0, 0, document.lineCount, 0),
            serializeEnv(lines)
          );
          await vscode.workspace.applyEdit(edit);
        } else {
          const edit = new vscode.WorkspaceEdit();
          const lastLine = document.lineAt(document.lineCount - 1);
          const insertPos = lastLine.range.end;
          const prefix = lastLine.text.trim() === "" ? "" : "\n";
          edit.insert(document.uri, insertPos, `${prefix}${normalizedKey}="${value}"`);
          await vscode.workspace.applyEdit(edit);
        }
      }

      else if (msg.type === "save") {
        await document.save();
      }

      else if (msg.type === "openAsText") {
        await vscode.commands.executeCommand(
          "workbench.action.reopenTextEditor"
        );
      }

      else if (msg.type === "deleteRow") {
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

      else if (msg.type === "deleteMultiple") {
        const indices: number[] = (msg.indices || []).map(Number).filter((n: number) => !isNaN(n));
        if (indices.length === 0) return;
        const lines = parseEnv(document.getText());
        // Remove from highest index first to preserve ordering
        const sorted = [...indices].sort((a, b) => b - a);
        for (const idx of sorted) {
          if (idx >= 0 && idx < lines.length) {
            lines.splice(idx, 1);
          }
        }
        const edit = new vscode.WorkspaceEdit();
        edit.replace(
          document.uri,
          new vscode.Range(0, 0, document.lineCount, 0),
          serializeEnv(lines)
        );
        await vscode.workspace.applyEdit(edit);
      }

      else if (msg.type === "copyField") {
        const idx = parseInt(msg.lineIndex);
        if (isNaN(idx)) return;
        const lines = parseEnv(document.getText());
        if (idx < 0 || idx >= lines.length) return;
        const line = lines[idx];
        if (line.type !== "pair") return;
        const pair = line as EnvEntry;
        const text = msg.field === "key" ? pair.key
          : msg.field === "value" ? pair.value
          : `${pair.key}="${pair.value}"`;
        await vscode.env.clipboard.writeText(text);
      }

      else if (msg.type === "addSection") {
        const name = await vscode.window.showInputBox({
          prompt: "Section name",
          placeHolder: "e.g. Database, API Keys, AWS…",
        });
        if (!name) return; // user cancelled
        const sectionHeader = name.trim().startsWith("#") ? name.trim() : `# ${name.trim()}`;
        const lines = parseEnv(document.getText());
        const newLines: EnvLine[] = [];
        // Add blank line separator if file doesn't end with blank
        if (lines.length > 0 && lines[lines.length - 1].type !== "blank") {
          newLines.push({ type: "blank", raw: "" });
        }
        newLines.push({ type: "comment", raw: sectionHeader });
        const edit = new vscode.WorkspaceEdit();
        edit.replace(
          document.uri,
          new vscode.Range(0, 0, document.lineCount, 0),
          serializeEnv([...lines, ...newLines])
        );
        await vscode.workspace.applyEdit(edit);
      }

      else if (msg.type === "addRowToSection") {
        const sectionIndex = parseInt(msg.sectionIndex);
        if (isNaN(sectionIndex)) return;
        const key = await vscode.window.showInputBox({
          prompt: "Variable name",
          placeHolder: "e.g. DATABASE_URL, API_KEY…",
          validateInput: (v) => v.trim() === "" ? "Key cannot be empty" : undefined,
        });
        if (!key) return;
        const normalizedKey = key.trim().toUpperCase();
        const value = await vscode.window.showInputBox({
          prompt: `Value for ${normalizedKey}`,
          placeHolder: "Enter the value",
        });
        if (value === undefined) return;
        const lines = parseEnv(document.getText());
        if (sectionIndex < 0 || sectionIndex >= lines.length) return;
        // Find insertion point: last pair before next section header or EOF
        let insertAt = lines.length;
        for (let j = sectionIndex + 1; j < lines.length; j++) {
          if (lines[j].type === "comment" && (lines[j] as EnvComment).raw.trim().startsWith("#")) {
            insertAt = j;
            // Insert before blank line separator if present
            if (j > 0 && lines[j - 1].type === "blank") {
              insertAt = j - 1;
            }
            break;
          }
        }
        lines.splice(insertAt, 0, { type: "pair", key: normalizedKey, value, quoteChar: '"' });
        const edit = new vscode.WorkspaceEdit();
        edit.replace(
          document.uri,
          new vscode.Range(0, 0, document.lineCount, 0),
          serializeEnv(lines)
        );
        await vscode.workspace.applyEdit(edit);
      }

      else if (msg.type === "moveToSection") {
        const fromIndex = parseInt(msg.fromIndex);
        const sectionIndex = parseInt(msg.sectionIndex);
        if (isNaN(fromIndex) || isNaN(sectionIndex)) return;
        const lines = parseEnv(document.getText());
        if (fromIndex < 0 || fromIndex >= lines.length) return;
        if (lines[fromIndex].type !== "pair") return;

        const [removed] = lines.splice(fromIndex, 1);

        let insertAt: number;
        if (sectionIndex === -1) {
          // Top of file: insert after last pair before first section
          insertAt = 0;
          for (let j = 0; j < lines.length; j++) {
            if (lines[j].type === "comment" && (lines[j] as EnvComment).raw.trim().startsWith("#")) {
              break;
            }
            if (lines[j].type === "pair") {
              insertAt = j + 1;
            }
          }
        } else {
          const adjSection = sectionIndex > fromIndex ? sectionIndex - 1 : sectionIndex;
          insertAt = lines.length;
          for (let j = adjSection + 1; j < lines.length; j++) {
            if (lines[j].type === "comment" && (lines[j] as EnvComment).raw.trim().startsWith("#")) {
              insertAt = j;
              if (j > 0 && lines[j - 1].type === "blank") {
                insertAt = j - 1;
              }
              break;
            }
          }
        }

        lines.splice(insertAt, 0, removed);
        const edit = new vscode.WorkspaceEdit();
        edit.replace(
          document.uri,
          new vscode.Range(0, 0, document.lineCount, 0),
          serializeEnv(lines)
        );
        await vscode.workspace.applyEdit(edit);
      }

      else if (msg.type === "moveMultipleToSection") {
        const indices: number[] = (msg.indices as number[]).map(Number).filter((n: number) => !isNaN(n));
        const sectionIndex = parseInt(msg.sectionIndex);
        if (indices.length === 0 || isNaN(sectionIndex)) return;
        const lines = parseEnv(document.getText());
        for (const idx of indices) {
          if (idx < 0 || idx >= lines.length || lines[idx].type !== "pair") return;
        }
        const sorted = [...indices].sort((a, b) => b - a);
        const removed: EnvLine[] = [];
        for (const idx of sorted) {
          removed.unshift(lines.splice(idx, 1)[0]);
        }
        let insertAt: number;
        if (sectionIndex === -1) {
          insertAt = 0;
          for (let j = 0; j < lines.length; j++) {
            if (lines[j].type === "comment" && (lines[j] as EnvComment).raw.trim().startsWith("#")) break;
            if (lines[j].type === "pair") insertAt = j + 1;
          }
        } else {
          let adjSection = sectionIndex;
          for (const idx of sorted) { if (idx < sectionIndex) adjSection--; }
          insertAt = lines.length;
          for (let j = adjSection + 1; j < lines.length; j++) {
            if (lines[j].type === "comment" && (lines[j] as EnvComment).raw.trim().startsWith("#")) {
              insertAt = j;
              if (j > 0 && lines[j - 1].type === "blank") insertAt = j - 1;
              break;
            }
          }
        }
        lines.splice(insertAt, 0, ...removed);
        const edit = new vscode.WorkspaceEdit();
        edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), serializeEnv(lines));
        await vscode.workspace.applyEdit(edit);
      }

      else if (msg.type === "moveSectionUp" || msg.type === "moveSectionDown") {
        const sectionIndex = parseInt(msg.sectionIndex);
        if (isNaN(sectionIndex)) return;
        const lines = parseEnv(document.getText());
        if (sectionIndex < 0 || sectionIndex >= lines.length) return;
        const sectionStarts: number[] = [];
        for (let j = 0; j < lines.length; j++) {
          if (lines[j].type === "comment" && (lines[j] as EnvComment).raw.trim().startsWith("#")) {
            sectionStarts.push(j);
          }
        }
        const pos = sectionStarts.indexOf(sectionIndex);
        if (pos === -1) return;
        const currStart = sectionStarts[pos];
        const currEnd = pos + 1 < sectionStarts.length ? sectionStarts[pos + 1] : lines.length;
        if (msg.type === "moveSectionUp") {
          if (pos === 0) return;
          const prevStart = sectionStarts[pos - 1];
          const prevBlock = lines.slice(prevStart, currStart);
          const currBlock = lines.slice(currStart, currEnd);
          lines.splice(prevStart, currEnd - prevStart, ...currBlock, ...prevBlock);
        } else {
          if (pos >= sectionStarts.length - 1) return;
          const nextStart = sectionStarts[pos + 1];
          const nextEnd = pos + 2 < sectionStarts.length ? sectionStarts[pos + 2] : lines.length;
          const currBlock = lines.slice(currStart, nextStart);
          const nextBlock = lines.slice(nextStart, nextEnd);
          lines.splice(currStart, nextEnd - currStart, ...nextBlock, ...currBlock);
        }
        const edit = new vscode.WorkspaceEdit();
        edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), serializeEnv(lines));
        await vscode.workspace.applyEdit(edit);
      }

      else if (msg.type === "editComment") {
        const lineIndex = parseInt(msg.lineIndex);
        if (isNaN(lineIndex)) return;
        if (typeof msg.value !== "string") return;
        const lines = parseEnv(document.getText());
        if (lineIndex < 0 || lineIndex >= lines.length) return;
        const entry = lines[lineIndex];
        if (!entry || entry.type !== "comment") return;
        // Ensure section headers always keep the # prefix
        let newValue = msg.value;
        if (!newValue.trim().startsWith("#")) {
          newValue = "# " + newValue.trim();
        }
        entry.raw = newValue;
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

  private getHtml(lines: EnvLine[]): string {
    const rows = lines
      .map((line, i) => {
        if (line.type === "blank") {
          return `<tr class="blank-row" data-index="${i}"><td colspan="5"></td></tr>`;
        }
        if (line.type === "comment") {
          const isSection = line.raw.trim().startsWith("#");
          if (isSection) {
            return `<tr class="section-header" data-index="${i}">
              <td colspan="3" class="section-name" contenteditable="true" spellcheck="false" data-index="${i}">${escapeHtml(line.raw)}</td>
              <td class="section-reorder">
                <button class="btn-section-up" data-index="${i}" title="Move section up">${IC_UP}</button>
                <button class="btn-section-down" data-index="${i}" title="Move section down">${IC_DOWN}</button>
              </td>
              <td class="cell-actions">
                <button class="btn-section-add" data-index="${i}" title="Add variable">${IC_PLUS}</button>
                <button class="btn-delete" data-index="${i}" title="Delete">${IC_TRASH}</button>
              </td>
            </tr>`;
          }
          return `<tr class="comment-row" data-index="${i}">
            <td colspan="5" class="comment">${escapeHtml(line.raw)}</td>
          </tr>`;
        }
        const pair = line as EnvEntry;
        return `<tr data-index="${i}">
          <td class="cell-check"><input type="checkbox" class="row-check" data-index="${i}"></td>
          <td class="cell-key" data-field="key" data-index="${i}">${escapeHtml(pair.key)}</td>
          <td class="cell-value" data-field="value" data-index="${i}">
            <span class="real-value">${escapeHtml(pair.value)}</span>
            <span class="masked-value">${MASK}</span>
          </td>
          <td class="cell-reveal">
            <button class="btn-reveal" data-index="${i}" title="Reveal this value">
              <span class="reveal-icon">${IC_LOCK}</span>
            </button>
          </td>
          <td class="cell-actions">
            <button class="btn-copy" data-index="${i}" title="Copy">${IC_COPY}</button>
            <button class="btn-move" data-index="${i}" title="Move to section">${IC_EDIT}</button>
            <button class="btn-delete" data-index="${i}" title="Delete">${IC_TRASH}</button>
          </td>
        </tr>`;
      })
      .join("\n");

    const textLines = lines
      .map((line, i) => {
        if (line.type === "blank") {
          return `<div class="text-line blank-line" data-index="${i}">&nbsp;</div>`;
        }
        if (line.type === "comment") {
          const isSection = line.raw.trim().startsWith("#");
          if (isSection) {
            return `<div class="text-line section-line" data-index="${i}">
              <span class="text-section-name" contenteditable="true" spellcheck="false" data-index="${i}">${escapeHtml(line.raw)}</span>
              <span class="line-actions">
                <button class="btn-section-up" data-index="${i}" title="Move section up">${IC_UP}</button>
                <button class="btn-section-down" data-index="${i}" title="Move section down">${IC_DOWN}</button>
                <button class="btn-section-add" data-index="${i}" title="Add variable">${IC_PLUS}</button>
                <button class="btn-delete" data-index="${i}" title="Delete">${IC_TRASH}</button>
              </span>
            </div>`;
          }
          return `<div class="text-line comment-line" data-index="${i}">
            <span class="text-comment">${escapeHtml(line.raw)}</span>
          </div>`;
        }
        const pair = line as EnvEntry;
        return `<div class="text-line" data-index="${i}">
          <input type="checkbox" class="row-check" data-index="${i}">
          <span class="text-key" data-field="key" data-index="${i}">${escapeHtml(pair.key)}</span><span class="text-eq">=</span><span class="text-value" data-field="value" data-index="${i}"><span class="real-value">${escapeHtml(pair.value)}</span><span class="masked-value">${MASK}</span></span>
          <span class="line-actions">
            <button class="btn-reveal" data-index="${i}" title="Reveal this value">
              <span class="reveal-icon">${IC_LOCK}</span>
            </button>
            <button class="btn-copy" data-index="${i}" title="Copy">${IC_COPY}</button>
            <button class="btn-move" data-index="${i}" title="Move to section">${IC_EDIT}</button>
            <button class="btn-delete" data-index="${i}" title="Delete">${IC_TRASH}</button>
          </span>
        </div>`;
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
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .toolbar::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -17px;
    height: 17px;
    background: var(--bg);
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
    background: var(--bg);
    padding: 10px 12px;
    text-align: left;
    border-bottom: 2px solid var(--border);
    font-weight: 600;
    position: sticky;
    top: var(--thead-top, 0px);
    z-index: 5;
    user-select: none;
  }

  th.col-check { width: 4%; }
  th.col-key { width: 28%; }
  th.col-value { width: 48%; }
  th.col-reveal { width: 10%; text-align: center; }
  th.col-actions { width: 10%; text-align: center; }

  td {
    padding: 7px 12px;
    border-bottom: 1px solid var(--border);
  }
  td.cell-key, td.cell-value {
    overflow-wrap: break-word;
    word-break: break-all;
    white-space: normal;
  }

  tr:hover:not(.comment-row) { background: var(--hover); }

  .comment {
    color: var(--vscode-editorLineNumber-foreground, #858585);
    font-style: italic;
  }

  /* ── Section headers ── */
  .section-header td {
    border-bottom: 1px solid var(--border);
  }

  .section-name {
    font-weight: 600;
    color: var(--accent);
    padding: 10px 12px;
    cursor: text;
    font-size: 13px;
  }
  .section-name:focus {
    outline: 1px solid var(--accent);
    outline-offset: -1px;
    background: var(--input-bg);
  }

  .section-add {
    text-align: center;
    width: 10%;
  }

  .btn-section-add {
    background: var(--btn-bg);
    color: var(--btn-fg);
    border: none;
    border-radius: 3px;
    padding: 2px 10px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .section-header:hover .btn-section-add { opacity: 1; }
  .btn-section-add:hover { opacity: 1 !important; filter: brightness(1.1); }

  .section-header .btn-delete {
    opacity: 0;
  }
  .section-header:hover .btn-delete { opacity: 1; }

  .blank-row td {
    padding: 4px 0;
    border-bottom: none;
  }

  /* ── Section reorder ── */
  .section-reorder {
    text-align: center;
    width: 10%;
    white-space: nowrap;
  }
  .btn-section-up, .btn-section-down {
    background: none;
    border: 1px solid transparent;
    color: var(--fg);
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 3px;
    display: inline-flex;
    align-items: center;
    opacity: 0;
    transition: all 0.15s;
    vertical-align: middle;
  }
  .section-header:hover .btn-section-up,
  .section-header:hover .btn-section-down { opacity: 1; }
  .btn-section-up:hover, .btn-section-down:hover {
    border-color: var(--accent);
    background: var(--hover);
  }

  .section-line .btn-section-up, .section-line .btn-section-down {
    background: none;
    border: 1px solid transparent;
    color: var(--fg);
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 3px;
    display: inline-flex;
    align-items: center;
  }
  .section-line .btn-section-up:hover, .section-line .btn-section-down:hover {
    border-color: var(--accent);
    background: var(--hover);
  }

  /* ── Checkbox ── */
  .cell-check {
    width: 4%;
    text-align: center;
    padding: 7px 4px;
  }
  .row-check {
    width: 15px;
    height: 15px;
    cursor: pointer;
    accent-color: var(--accent);
    vertical-align: middle;
  }
  .text-line .row-check {
    margin-right: 8px;
    flex-shrink: 0;
  }
  tr.row-selected {
    background: color-mix(in srgb, var(--accent) 15%, transparent) !important;
  }
  .text-line.row-selected {
    background: color-mix(in srgb, var(--accent) 15%, transparent) !important;
  }

  /* ── Selection bar ── */
  .selection-bar {
    display: none;
    align-items: center;
    gap: 12px;
    padding: 8px 14px;
    background: var(--accent);
    color: var(--btn-fg);
    border-radius: 6px;
    margin-bottom: 8px;
    font-size: 12px;
    font-family: inherit;
    position: sticky;
    top: var(--toolbar-height, 0px);
    z-index: 9;
  }
  .selection-bar::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -9px;
    height: 9px;
    background: var(--bg);
    pointer-events: none;
  }
  .selection-bar.visible { display: flex; }
  .selection-bar .sel-count { font-weight: 600; }
  .selection-bar .sel-btn {
    background: rgba(255,255,255,0.15);
    color: var(--btn-fg);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 4px;
    padding: 4px 12px;
    cursor: pointer;
    font-size: 12px;
    font-family: inherit;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.15s;
  }
  .selection-bar .sel-btn:hover { background: rgba(255,255,255,0.25); }
  .selection-bar .sel-btn-delete {
    background: rgba(255,60,60,0.25);
    border-color: rgba(255,60,60,0.5);
  }
  .selection-bar .sel-btn-delete:hover { background: rgba(255,60,60,0.4); }
  .selection-bar .sel-btn-confirm {
    background: var(--vscode-errorForeground, #f44);
    border-color: var(--vscode-errorForeground, #f44);
    color: #fff;
    animation: pulse-confirm 0.6s ease-in-out infinite alternate;
  }
  @keyframes pulse-confirm {
    from { opacity: 0.85; }
    to { opacity: 1; }
  }
  .selection-bar .sel-btn-cancel {
    background: transparent;
    border-color: rgba(255,255,255,0.2);
    margin-left: auto;
  }

  /* ── Move button ── */
  .btn-move {
    background: none;
    border: none;
    color: var(--accent);
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s;
    padding: 2px 4px;
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
  }
  tr:hover .btn-move { opacity: 1; }
  .btn-move:hover { transform: scale(1.15); }

  /* ── Move dropdown ── */
  .move-dropdown {
    display: none;
    position: fixed;
    background: var(--header-bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    min-width: 200px;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    max-height: 240px;
    overflow-y: auto;
  }
  .move-dropdown.visible { display: block; }
  .move-dropdown-title {
    padding: 6px 12px;
    font-size: 11px;
    color: var(--vscode-editorLineNumber-foreground, #858585);
    border-bottom: 1px solid var(--border);
    font-weight: 600;
  }
  .move-dropdown-item {
    padding: 8px 12px;
    cursor: pointer;
    font-size: 12px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .move-dropdown-item:hover { background: var(--hover); }
  .move-dropdown-item .section-icon { opacity: 0.6; }

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
  body.keys-hidden tr.row-revealed .cell-key {
    color: var(--fg);
    text-shadow: none;
    pointer-events: auto;
  }

  /* ── Reveal button ── */
  .cell-reveal { text-align: center; }

  .btn-reveal {
    background: none;
    border: 1px solid transparent;
    color: var(--fg);
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
  .btn-delete.confirming {
    opacity: 1 !important;
    background: var(--vscode-errorForeground, #f44);
    color: #fff;
    border-radius: 3px;
    padding: 1px 6px;
    font-size: 11px;
    font-family: inherit;
    font-weight: 600;
    transform: none;
    animation: pulse-confirm 0.6s ease-in-out infinite alternate;
  }

  /* ── Copy button ── */
  .btn-copy {
    background: none;
    border: none;
    color: var(--fg);
    cursor: pointer;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.15s;
    padding: 2px 4px;
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    position: relative;
  }
  tr:hover .btn-copy { opacity: 1; }
  .btn-copy:hover { transform: scale(1.15); color: var(--accent); }

  /* ── Copy dropdown ── */
  .copy-dropdown {
    display: none;
    position: fixed;
    background: var(--header-bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    min-width: 140px;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }
  .copy-dropdown.visible { display: block; }
  .copy-dropdown-item {
    padding: 8px 12px;
    cursor: pointer;
    font-size: 12px;
    white-space: nowrap;
  }
  .copy-dropdown-item:hover { background: var(--hover); }

  /* ── Copy toast ── */
  .copy-toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--success);
    color: #000;
    padding: 6px 16px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    z-index: 200;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
  }
  .copy-toast.visible { opacity: 1; }

  /* ── Add variable dropdown ── */
  .add-var-dropdown {
    display: none;
    position: fixed;
    background: var(--header-bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    min-width: 200px;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    max-height: 240px;
    overflow-y: auto;
  }
  .add-var-dropdown.visible { display: block; }
  .add-var-dropdown-title {
    padding: 6px 12px;
    font-size: 11px;
    color: var(--vscode-editorLineNumber-foreground, #858585);
    border-bottom: 1px solid var(--border);
    font-weight: 600;
  }
  .add-var-dropdown-item {
    padding: 8px 12px;
    cursor: pointer;
    font-size: 12px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .add-var-dropdown-item:hover { background: var(--hover); }
  .add-var-dropdown-item .section-icon { opacity: 0.6; }

  /* ── Text View ── */
  .text-view { display: none; }
  body.view-text .text-view { display: block; }
  body.view-text table { display: none; }

  .text-line {
    display: flex;
    align-items: center;
    padding: 2px 12px;
    line-height: 1.6;
    font-family: var(--vscode-editor-font-family, monospace);
    font-size: var(--vscode-editor-font-size, 13px);
    min-height: 26px;
  }
  .text-line:hover { background: var(--hover); }

  .text-key, .text-value {
    cursor: text;
  }
  .text-key:focus, .text-value:focus {
    outline: 1px solid var(--accent);
    outline-offset: -1px;
    background: var(--input-bg);
  }

  .text-eq { margin: 0; }

  .text-line .masked-value {
    display: none;
    color: var(--mask-color);
    letter-spacing: 2px;
  }

  body.keys-hidden .text-key {
    color: transparent;
    text-shadow: 0 0 8px var(--fg);
    pointer-events: none;
  }

  body.values-hidden .text-line .real-value { display: none; }
  body.values-hidden .text-line .masked-value { display: inline; }
  body.values-hidden .text-line .text-value { pointer-events: none; }

  body.values-hidden .text-line.row-revealed .real-value { display: inline; }
  body.values-hidden .text-line.row-revealed .masked-value { display: none; }
  body.values-hidden .text-line.row-revealed .text-value { pointer-events: auto; }
  body.keys-hidden .text-line.row-revealed .text-key {
    color: var(--fg);
    text-shadow: none;
    pointer-events: auto;
  }

  .text-comment {
    color: var(--vscode-editorLineNumber-foreground, #858585);
    font-style: italic;
  }

  .text-line .line-actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 2px;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .text-line:hover .line-actions { opacity: 1; }

  .text-line .btn-reveal {
    background: none;
    border: 1px solid transparent;
    color: var(--fg);
    cursor: pointer;
    font-size: 14px;
    padding: 2px 6px;
    border-radius: 3px;
    transition: all 0.15s;
  }
  .text-line .btn-reveal:hover { border-color: var(--accent); background: var(--hover); }
  .text-line.row-revealed .btn-reveal { border-color: var(--success); }

  .text-line .btn-delete {
    background: none;
    border: none;
    color: var(--vscode-errorForeground, #f44);
    cursor: pointer;
    font-size: 14px;
  }
  .text-line .btn-delete:hover { transform: scale(1.2); }
  .text-line .btn-delete.confirming {
    background: var(--vscode-errorForeground, #f44);
    color: #fff;
    border-radius: 3px;
    padding: 1px 6px;
    font-size: 11px;
    font-family: inherit;
    font-weight: 600;
    transform: none;
    animation: pulse-confirm 0.6s ease-in-out infinite alternate;
  }

  .text-line .btn-move {
    background: none;
    border: none;
    color: var(--accent);
    cursor: pointer;
    padding: 2px 4px;
    display: inline-flex;
    align-items: center;
  }
  .text-line .btn-move:hover { transform: scale(1.15); }

  .text-line .btn-copy {
    background: none;
    border: none;
    color: var(--fg);
    cursor: pointer;
    font-size: 14px;
    padding: 2px 4px;
    display: inline-flex;
    align-items: center;
  }
  .text-line .btn-copy:hover { transform: scale(1.15); color: var(--accent); }

  /* ── Text view sections ── */
  .section-line {
    margin-top: 8px;
  }
  .text-section-name {
    font-weight: 600;
    color: var(--accent);
    cursor: text;
  }
  .text-section-name:focus {
    outline: 1px solid var(--accent);
    outline-offset: -1px;
    background: var(--input-bg);
  }

  .section-line .btn-section-add {
    background: var(--btn-bg);
    color: var(--btn-fg);
    border: none;
    border-radius: 3px;
    padding: 2px 10px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
  }
  .section-line .btn-section-add:hover { filter: brightness(1.1); }
</style>
</head>
<body class="keys-hidden values-hidden">

  <div class="toolbar">
    <button class="toggle-btn hidden-state" id="toggleKeys">
      <span class="icon">${IC_EYE_OFF}</span>
      <span class="label" id="keysLabel">Keys masked</span>
    </button>
    <div class="separator"></div>
    <button class="toggle-btn hidden-state" id="toggleValues">
      <span class="icon">${IC_LOCK}</span>
      <span class="label" id="valuesLabel">Values masked</span>
    </button>
    <button class="add-btn" id="addSection">${IC_PLUS} Add Section</button>
    <button class="add-btn" id="addRow">${IC_PLUS} Add Variable</button>
    <button class="save-btn" id="saveBtn">${IC_SAVE} Save</button>
    <div class="separator"></div>
    <button class="toggle-btn switch-btn" id="switchEditor" title="Switch to text editor">
      <span class="icon">${IC_FILE_TEXT}</span>
      <span class="label">Text Editor</span>
    </button>
    <button class="toggle-btn switch-btn" id="openRawFile" title="Open in VS Code default editor">
      <span class="icon">${IC_FILE}</span>
      <span class="label">Raw File</span>
    </button>
  </div>

  <div class="selection-bar" id="selectionBar">
    <span class="sel-count" id="selCount">0 selected</span>
    <button class="sel-btn" id="selMove">${IC_EDIT} Move to section</button>
    <button class="sel-btn sel-btn-delete" id="selDelete">${IC_TRASH} Delete</button>
    <button class="sel-btn sel-btn-cancel" id="selClear">Deselect all</button>
  </div>

  <table>
    <thead>
      <tr>
        <th class="col-check"></th>
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

  <div class="text-view" id="textView">
    ${textLines}
  </div>

  <div class="move-dropdown" id="moveDropdown"></div>
  <div class="add-var-dropdown" id="addVarDropdown"></div>
  <div class="copy-dropdown" id="copyDropdown">
    <div class="copy-dropdown-item" data-copy="key">Copy key</div>
    <div class="copy-dropdown-item" data-copy="value">Copy value</div>
    <div class="copy-dropdown-item" data-copy="both">Copy key and value</div>
  </div>
  <div class="copy-toast" id="copyToast">Copied!</div>

<script>
  const vscode = acquireVsCodeApi();

  // Icon constants (client-side)
  const IC_EDIT = '${IC_EDIT}';
  const IC_UP = '${IC_UP}';
  const IC_DOWN = '${IC_DOWN}';
  const IC_PLUS = '${IC_PLUS}';
  const IC_TABLE = '${IC_TABLE}';
  const IC_FILE_TEXT = '${IC_FILE_TEXT}';
  const IC_CHECK = '${IC_CHECK}';
  const IC_SAVE = '${IC_SAVE}';
  const IC_TRASH = '${IC_TRASH}';
  const IC_LOCK_OPEN = '${IC_LOCK_OPEN}';
  const IC_LOCK = '${IC_LOCK}';
  const IC_EYE = '${IC_EYE}';
  const IC_EYE_OFF = '${IC_EYE_OFF}';

  let keysHidden = true;
  let valuesHidden = true;
  const revealedRows = new Set();
  const selectedRows = new Set();

  // ── Toggle Keys ──
  document.getElementById("toggleKeys").addEventListener("click", () => {
    keysHidden = !keysHidden;
    document.body.classList.toggle("keys-hidden", keysHidden);
    const btn = document.getElementById("toggleKeys");
    const label = document.getElementById("keysLabel");
    const icon = btn.querySelector(".icon");
    if (keysHidden) {
      label.textContent = "Keys masked";
      icon.innerHTML = IC_EYE_OFF;
      btn.classList.remove("active");
      btn.classList.add("hidden-state");
    } else {
      label.textContent = "Keys visible";
      icon.innerHTML = IC_EYE;
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
    document.querySelectorAll("tr.row-revealed, .text-line.row-revealed").forEach(el => el.classList.remove("row-revealed"));
    updateRevealIcons();

    const btn = document.getElementById("toggleValues");
    const label = document.getElementById("valuesLabel");
    const icon = btn.querySelector(".icon");
    if (valuesHidden) {
      label.textContent = "Values masked";
      icon.innerHTML = IC_LOCK;
      btn.classList.remove("active");
      btn.classList.add("hidden-state");
    } else {
      label.textContent = "Values visible";
      icon.innerHTML = IC_LOCK_OPEN;
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
        icon.innerHTML = IC_LOCK_OPEN;
      } else {
        icon.innerHTML = IC_LOCK;
      }
    });
  }

  // ── Per-row reveal ──
  function bindRevealButtons() {
    document.querySelectorAll(".btn-reveal").forEach(btn => {
      btn.addEventListener("click", () => {
        if (!valuesHidden) return; // all visible already
        const idx = parseInt(btn.dataset.index);
        if (revealedRows.has(idx)) {
          revealedRows.delete(idx);
        } else {
          revealedRows.add(idx);
        }
        // Sync both views
        document.querySelectorAll(\`tr[data-index="\${idx}"], .text-line[data-index="\${idx}"]\`).forEach(el => {
          el.classList.toggle("row-revealed", revealedRows.has(idx));
        });
        updateRevealIcons();
      });
    });
  }

  // ── Inline editing ──
  function bindCellEvents() {
    document.querySelectorAll(".cell-key, .cell-value, .text-key, .text-value").forEach(cell => {
      cell.setAttribute("contenteditable", "true");
      cell.setAttribute("spellcheck", "false");

      cell.addEventListener("focus", () => {
        // Block editing if cell is masked
        const row = cell.closest("tr, .text-line");
        const idx = parseInt(cell.dataset.index);
        const isRevealed = row && row.classList.contains("row-revealed");
        const field = cell.dataset.field;
        const keysHidden = document.body.classList.contains("keys-hidden");
        const valuesHidden = document.body.classList.contains("values-hidden");
        if (field === "key" && keysHidden && !isRevealed) { cell.blur(); return; }
        if (field === "value" && valuesHidden && !isRevealed) { cell.blur(); return; }

        // When editing value, hide spans and work with plain text
        if (field === "value") {
          const realSpan = cell.querySelector(".real-value");
          const maskedSpan = cell.querySelector(".masked-value");
          const currentValue = realSpan ? realSpan.textContent : "";
          // Replace spans with plain text for clean editing
          if (maskedSpan) maskedSpan.style.display = "none";
          if (realSpan) realSpan.style.display = "none";
          // Add a text node if there isn't one already (for empty values)
          if (!cell.dataset.editing) {
            cell.dataset.editing = "true";
            const textNode = document.createTextNode(currentValue);
            cell.appendChild(textNode);
            // Select all text
            const range = document.createRange();
            range.selectNodeContents(cell);
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
          // Read the plain text the user typed (ignoring hidden spans)
          const realSpan = cell.querySelector(".real-value");
          const maskedSpan = cell.querySelector(".masked-value");
          let raw = "";
          cell.childNodes.forEach(n => {
            if (n === realSpan || n === maskedSpan) return;
            raw += n.textContent;
          });
          value = raw.replace(/[\\r\\n]/g, "");
          // Restore span structure
          if (realSpan) { realSpan.textContent = value; realSpan.style.display = ""; }
          if (maskedSpan) maskedSpan.style.display = "";
          // Remove orphan text nodes
          Array.from(cell.childNodes).forEach(n => {
            if (n.nodeType === Node.TEXT_NODE) cell.removeChild(n);
          });
          delete cell.dataset.editing;
        } else {
          value = cell.textContent.replace(/[\\r\\n]/g, "").toUpperCase();
          cell.textContent = value;
        }
        vscode.postMessage({ type: "edit", lineIndex: index, field, value });
      });

      cell.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); cell.blur(); }
        if (e.key === "Escape") { cell.blur(); }
      });

      cell.addEventListener("paste", (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData("text/plain").replace(/[\\r\\n]/g, "");
        const sel = window.getSelection();
        if (!sel.rangeCount) return;
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);
      });
    });
  }

  // ── Delete ──
  function bindDeleteButtons() {
    document.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!btn.classList.contains("confirming")) {
          // Reset any other confirming button first
          document.querySelectorAll(".btn-delete.confirming").forEach(b => {
            b.classList.remove("confirming");
            b.innerHTML = IC_TRASH;
            b.title = "Delete";
          });
          btn.classList.add("confirming");
          btn.innerHTML = "Confirm?";
          btn.title = "Click again to confirm deletion";
          return;
        }
        btn.classList.remove("confirming");
        vscode.postMessage({ type: "deleteRow", lineIndex: parseInt(btn.dataset.index) });
      });
    });
  }

  // ── Copy buttons ──
  let copyTargetIndex = -1;
  const copyDropdown = document.getElementById("copyDropdown");
  const copyToast = document.getElementById("copyToast");

  function showCopyToast(label) {
    copyToast.textContent = label + " copied!";
    copyToast.classList.add("visible");
    setTimeout(() => copyToast.classList.remove("visible"), 1200);
  }

  function bindCopyButtons() {
    document.querySelectorAll(".btn-copy").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        copyTargetIndex = parseInt(btn.dataset.index);
        const rect = btn.getBoundingClientRect();
        copyDropdown.classList.add("visible");
        const dw = copyDropdown.offsetWidth;
        const dh = copyDropdown.offsetHeight;
        let left = rect.right - dw;
        if (left < 8) left = 8;
        if (left + dw > window.innerWidth - 8) left = window.innerWidth - dw - 8;
        let top = rect.bottom + 4;
        if (top + dh > window.innerHeight - 8) top = rect.top - dh - 4;
        copyDropdown.style.top = top + "px";
        copyDropdown.style.left = left + "px";
      });
    });
  }

  copyDropdown.querySelectorAll(".copy-dropdown-item").forEach(item => {
    item.addEventListener("click", () => {
      const field = item.dataset.copy;
      vscode.postMessage({ type: "copyField", lineIndex: copyTargetIndex, field: field });
      copyDropdown.classList.remove("visible");
      showCopyToast(field === "key" ? "Key" : field === "value" ? "Value" : "Key and value");
    });
  });

  // ── Section add buttons ──
  function bindSectionAddButtons() {
    document.querySelectorAll(".btn-section-add").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        vscode.postMessage({ type: "addRowToSection", sectionIndex: parseInt(btn.dataset.index) });
      });
    });
  }

  // ── Comment/section name editing ──
  function bindCommentEdit() {
    document.querySelectorAll(".section-name, .text-section-name").forEach(cell => {
      cell.addEventListener("blur", () => {
        const index = parseInt(cell.dataset.index);
        let val = cell.textContent.replace(/[\\r\\n]/g, "").trim();
        // Ensure section headers always keep the # prefix
        if (!val.startsWith("#")) {
          val = "# " + val;
          cell.textContent = val;
        }
        vscode.postMessage({ type: "editComment", lineIndex: index, value: val });
      });
      cell.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); cell.blur(); }
        if (e.key === "Escape") { cell.blur(); }
      });
      cell.addEventListener("paste", (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData("text/plain").replace(/[\\r\\n]/g, "");
        const sel = window.getSelection();
        if (!sel.rangeCount) return;
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);
      });
    });
  }

  // ── Checkboxes & selection ──
  function bindCheckboxes() {
    document.querySelectorAll(".row-check").forEach(cb => {
      cb.addEventListener("change", () => {
        const idx = parseInt(cb.dataset.index);
        if (cb.checked) {
          selectedRows.add(idx);
        } else {
          selectedRows.delete(idx);
        }
        // Sync visual state across both views
        document.querySelectorAll(\`tr[data-index="\${idx}"], .text-line[data-index="\${idx}"]\`).forEach(el => {
          el.classList.toggle("row-selected", selectedRows.has(idx));
        });
        document.querySelectorAll(\`.row-check[data-index="\${idx}"]\`).forEach(c => { c.checked = selectedRows.has(idx); });
        updateSelectionBar();
      });
    });
  }

  function updateSelectionBar() {
    const bar = document.getElementById("selectionBar");
    const count = document.getElementById("selCount");
    if (selectedRows.size > 0) {
      bar.classList.add("visible");
      count.textContent = selectedRows.size + " selected";
    } else {
      bar.classList.remove("visible");
    }
    syncToolbarHeight();
  }

  function clearSelection() {
    selectedRows.clear();
    document.querySelectorAll(".row-check").forEach(c => { c.checked = false; });
    document.querySelectorAll(".row-selected").forEach(el => el.classList.remove("row-selected"));
    updateSelectionBar();
  }

  const selDeleteBtn = document.getElementById("selDelete");
  let selDeleteConfirm = false;
  selDeleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (selectedRows.size === 0) return;
    if (!selDeleteConfirm) {
      selDeleteConfirm = true;
      selDeleteBtn.innerHTML = IC_TRASH + " Confirm?";
      selDeleteBtn.classList.add("sel-btn-confirm");
      return;
    }
    vscode.postMessage({ type: "deleteMultiple", indices: [...selectedRows] });
    resetSelDeleteBtn();
    clearSelection();
  });
  function resetSelDeleteBtn() {
    selDeleteConfirm = false;
    selDeleteBtn.innerHTML = IC_TRASH + " Delete";
    selDeleteBtn.classList.remove("sel-btn-confirm");
  }
  document.getElementById("selClear").addEventListener("click", clearSelection);
  document.getElementById("selMove").addEventListener("click", (e) => {
    e.stopPropagation();
    if (selectedRows.size === 0) return;
    showMoveDropdown(document.getElementById("selMove"), [...selectedRows]);
  });

  // ── Section reorder ──
  function bindSectionReorder() {
    document.querySelectorAll(".btn-section-up").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        vscode.postMessage({ type: "moveSectionUp", sectionIndex: parseInt(btn.dataset.index) });
      });
    });
    document.querySelectorAll(".btn-section-down").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        vscode.postMessage({ type: "moveSectionDown", sectionIndex: parseInt(btn.dataset.index) });
      });
    });
  }

  // ── Move dropdown (shared) ──
  function showMoveDropdown(anchorEl, moveIndices) {
    const dropdown = document.getElementById("moveDropdown");
    const sections = [];
    document.querySelectorAll(".section-name").forEach(el => {
      sections.push({
        index: parseInt(el.dataset.index),
        name: el.textContent.replace(/^#\\s*/, "")
      });
    });

    const label = moveIndices.length > 1 ? moveIndices.length + " variables" : "variable";
    let html = \`<div class="move-dropdown-title">Move \${label} to</div>\`;
    html += '<div class="move-dropdown-item" data-section="-1"><span class="section-icon">' + IC_UP + '</span> Top of file</div>';
    sections.forEach(s => {
      html += \`<div class="move-dropdown-item" data-section="\${s.index}"><span class="section-icon">#</span> \${esc(s.name)}</div>\`;
    });
    dropdown.innerHTML = html;

    const rect = anchorEl.getBoundingClientRect();
    dropdown.classList.add("visible");
    const dw = dropdown.offsetWidth;
    const dh = dropdown.offsetHeight;
    let left = rect.right - dw;
    if (left < 8) left = 8;
    if (left + dw > window.innerWidth - 8) left = window.innerWidth - dw - 8;
    let top = rect.bottom + 4;
    if (top + dh > window.innerHeight - 8) top = rect.top - dh - 4;
    dropdown.style.top = top + "px";
    dropdown.style.left = left + "px";

    dropdown.querySelectorAll(".move-dropdown-item").forEach(item => {
      item.addEventListener("click", () => {
        const sectionIdx = parseInt(item.dataset.section);
        if (moveIndices.length === 1) {
          vscode.postMessage({ type: "moveToSection", fromIndex: moveIndices[0], sectionIndex: sectionIdx });
        } else {
          vscode.postMessage({ type: "moveMultipleToSection", indices: moveIndices, sectionIndex: sectionIdx });
        }
        dropdown.classList.remove("visible");
        clearSelection();
      });
    });
  }

  function bindMoveButtons() {
    document.querySelectorAll(".btn-move").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const clickedIndex = parseInt(btn.dataset.index);
        const indices = selectedRows.size > 0 && selectedRows.has(clickedIndex)
          ? [...selectedRows]
          : [clickedIndex];
        showMoveDropdown(btn, indices);
      });
    });
  }

  // Close dropdowns on outside click
  document.addEventListener("click", (e) => {
    const dropdown = document.getElementById("moveDropdown");
    if (!e.target.closest(".btn-move") && !e.target.closest(".move-dropdown") && !e.target.closest(".sel-btn")) {
      dropdown.classList.remove("visible");
    }
    if (!e.target.closest(".btn-copy") && !e.target.closest(".copy-dropdown")) {
      copyDropdown.classList.remove("visible");
    }
    if (!e.target.closest("#addRow") && !e.target.closest(".add-var-dropdown")) {
      document.getElementById("addVarDropdown").classList.remove("visible");
    }
    // Reset delete confirmations on outside click
    if (!e.target.closest("#selDelete")) {
      resetSelDeleteBtn();
    }
    if (!e.target.closest(".btn-delete")) {
      document.querySelectorAll(".btn-delete.confirming").forEach(b => {
        b.classList.remove("confirming");
        b.innerHTML = IC_TRASH;
        b.title = "Delete";
      });
    }
  });

  // ── Add section ──
  document.getElementById("addSection").addEventListener("click", () => {
    vscode.postMessage({ type: "addSection" });
  });

  // ── Add row (with section picker) ──
  document.getElementById("addRow").addEventListener("click", (e) => {
    e.stopPropagation();
    const btn = document.getElementById("addRow");
    const dropdown = document.getElementById("addVarDropdown");
    const sections = [];
    document.querySelectorAll(".section-name").forEach(el => {
      sections.push({
        index: parseInt(el.dataset.index),
        name: el.textContent.replace(/^#\\s*/, "")
      });
    });
    // Also check text view sections
    if (sections.length === 0) {
      document.querySelectorAll(".text-section-name").forEach(el => {
        sections.push({
          index: parseInt(el.dataset.index),
          name: el.textContent.replace(/^#\\s*/, "")
        });
      });
    }

    let html = '<div class="add-var-dropdown-title">Add variable to</div>';
    html += '<div class="add-var-dropdown-item" data-section="top"><span class="section-icon">' + IC_UP + '</span> Top of file</div>';
    sections.forEach(s => {
      html += \`<div class="add-var-dropdown-item" data-section="\${s.index}"><span class="section-icon">#</span> \${esc(s.name)}</div>\`;
    });
    dropdown.innerHTML = html;

    const rect = btn.getBoundingClientRect();
    dropdown.classList.add("visible");
    const dw = dropdown.offsetWidth;
    const dh = dropdown.offsetHeight;
    let left = rect.left;
    if (left + dw > window.innerWidth - 8) left = window.innerWidth - dw - 8;
    if (left < 8) left = 8;
    let top = rect.bottom + 4;
    if (top + dh > window.innerHeight - 8) top = rect.top - dh - 4;
    dropdown.style.top = top + "px";
    dropdown.style.left = left + "px";

    dropdown.querySelectorAll(".add-var-dropdown-item").forEach(item => {
      item.addEventListener("click", () => {
        const section = item.dataset.section;
        if (section === "top") {
          vscode.postMessage({ type: "addRowTop" });
        } else {
          vscode.postMessage({ type: "addRowToSection", sectionIndex: parseInt(section) });
        }
        dropdown.classList.remove("visible");
      });
    });
  });

  // ── Switch view mode ──
  let viewMode = "table";
  document.getElementById("switchEditor").addEventListener("click", () => {
    viewMode = viewMode === "table" ? "text" : "table";
    document.body.classList.toggle("view-text", viewMode === "text");
    const btn = document.getElementById("switchEditor");
    const label = btn.querySelector(".label");
    const icon = btn.querySelector(".icon");
    if (viewMode === "text") {
      label.textContent = "Table View";
      icon.innerHTML = IC_TABLE;
    } else {
      label.textContent = "Text Editor";
      icon.innerHTML = IC_FILE_TEXT;
    }
  });

  // ── Open raw file ──
  document.getElementById("openRawFile").addEventListener("click", () => {
    vscode.postMessage({ type: "openAsText" });
  });

  // ── Save ──
  const saveBtn = document.getElementById("saveBtn");
  saveBtn.addEventListener("click", () => {
    vscode.postMessage({ type: "save" });
    saveBtn.innerHTML = IC_CHECK + " Saved";
    saveBtn.classList.add("saved");
    setTimeout(() => {
      saveBtn.innerHTML = IC_SAVE + " Save";
      saveBtn.classList.remove("saved");
    }, 1500);
  });

  // ── Initial bind ──
  bindCellEvents();
  bindRevealButtons();
  bindDeleteButtons();
  bindSectionAddButtons();
  bindCommentEdit();
  bindMoveButtons();
  bindCopyButtons();
  bindCheckboxes();
  bindSectionReorder();
  updateRevealIcons();

  // ── Sync toolbar height for sticky thead ──
  function syncToolbarHeight() {
    const tb = document.querySelector(".toolbar");
    const sb = document.getElementById("selectionBar");
    if (tb) {
      const tbH = tb.getBoundingClientRect().height + parseFloat(getComputedStyle(tb).marginBottom || "0");
      document.documentElement.style.setProperty("--toolbar-height", tbH + "px");
      let theadTop = tbH;
      if (sb && sb.classList.contains("visible")) {
        theadTop += sb.getBoundingClientRect().height + parseFloat(getComputedStyle(sb).marginBottom || "0");
      }
      document.documentElement.style.setProperty("--thead-top", theadTop + "px");
    }
  }
  syncToolbarHeight();
  window.addEventListener("resize", syncToolbarHeight);

  // ── Handle updates from extension ──
  window.addEventListener("message", (event) => {
    const msg = event.data;
    if (msg.type === "update") {
      selectedRows.clear();
      updateSelectionBar();
      revealedRows.clear();

      const tbody = document.getElementById("tableBody");
      tbody.innerHTML = msg.lines.map((line, i) => {
        if (line.type === "blank") {
          return \`<tr class="blank-row" data-index="\${i}"><td colspan="5"></td></tr>\`;
        }
        if (line.type === "comment") {
          const isSection = line.raw.trim().startsWith("#");
          if (isSection) {
            return \`<tr class="section-header" data-index="\${i}">
              <td colspan="3" class="section-name" contenteditable="true" spellcheck="false" data-index="\${i}">\${esc(line.raw)}</td>
              <td class="section-reorder">
                <button class="btn-section-up" data-index="\${i}" title="Move section up">\${IC_UP}</button>
                <button class="btn-section-down" data-index="\${i}" title="Move section down">\${IC_DOWN}</button>
              </td>
              <td class="cell-actions">
                <button class="btn-section-add" data-index="\${i}" title="Add variable">${IC_PLUS}</button>
                <button class="btn-delete" data-index="\${i}" title="Delete">${IC_TRASH}</button>
              </td>
            </tr>\`;
          }
          return \`<tr class="comment-row" data-index="\${i}">
            <td colspan="5" class="comment">\${esc(line.raw)}</td>
          </tr>\`;
        }
        const revealed = revealedRows.has(i) ? "row-revealed" : "";
        return \`<tr class="\${revealed}" data-index="\${i}">
          <td class="cell-check"><input type="checkbox" class="row-check" data-index="\${i}"></td>
          <td class="cell-key" data-field="key" data-index="\${i}">\${esc(line.key)}</td>
          <td class="cell-value" data-field="value" data-index="\${i}">
            <span class="real-value">\${esc(line.value)}</span>
            <span class="masked-value">${MASK}</span>
          </td>
          <td class="cell-reveal">
            <button class="btn-reveal" data-index="\${i}" title="Toggle this value">
              <span class="reveal-icon">${IC_LOCK}</span>
            </button>
          </td>
          <td class="cell-actions">
            <button class="btn-copy" data-index="\${i}" title="Copy">${IC_COPY}</button>
            <button class="btn-move" data-index="\${i}" title="Move to section">\${IC_EDIT}</button>
            <button class="btn-delete" data-index="\${i}" title="Delete">${IC_TRASH}</button>
          </td>
        </tr>\`;
      }).join("");

      // Update text view
      const textView = document.getElementById("textView");
      textView.innerHTML = msg.lines.map((line, i) => {
        if (line.type === "blank") {
          return \`<div class="text-line blank-line" data-index="\${i}">&nbsp;</div>\`;
        }
        if (line.type === "comment") {
          const isSection = line.raw.trim().startsWith("#");
          if (isSection) {
            return \`<div class="text-line section-line" data-index="\${i}">
              <span class="text-section-name" contenteditable="true" spellcheck="false" data-index="\${i}">\${esc(line.raw)}</span>
              <span class="line-actions">
                <button class="btn-section-up" data-index="\${i}" title="Move section up">\${IC_UP}</button>
                <button class="btn-section-down" data-index="\${i}" title="Move section down">\${IC_DOWN}</button>
                <button class="btn-section-add" data-index="\${i}" title="Add variable">${IC_PLUS}</button>
                <button class="btn-delete" data-index="\${i}" title="Delete">${IC_TRASH}</button>
              </span>
            </div>\`;
          }
          return \`<div class="text-line comment-line" data-index="\${i}">
            <span class="text-comment">\${esc(line.raw)}</span>
          </div>\`;
        }
        const revealed = revealedRows.has(i) ? "row-revealed" : "";
        return \`<div class="text-line \${revealed}" data-index="\${i}">
          <input type="checkbox" class="row-check" data-index="\${i}">
          <span class="text-key" data-field="key" data-index="\${i}">\${esc(line.key)}</span><span class="text-eq">=</span><span class="text-value" data-field="value" data-index="\${i}"><span class="real-value">\${esc(line.value)}</span><span class="masked-value">${MASK}</span></span>
          <span class="line-actions">
            <button class="btn-reveal" data-index="\${i}" title="Reveal this value">
              <span class="reveal-icon">${IC_LOCK}</span>
            </button>
            <button class="btn-copy" data-index="\${i}" title="Copy">${IC_COPY}</button>
            <button class="btn-move" data-index="\${i}" title="Move to section">\${IC_EDIT}</button>
            <button class="btn-delete" data-index="\${i}" title="Delete">${IC_TRASH}</button>
          </span>
        </div>\`;
      }).join("");

      bindCellEvents();
      bindRevealButtons();
      bindDeleteButtons();
      bindSectionAddButtons();
      bindCommentEdit();
      bindMoveButtons();
      bindCopyButtons();
      bindCheckboxes();
      bindSectionReorder();
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
