# Changelog

All notable changes to the StockEnv extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.0.8] - 2026-03-12

### Fixed
- SVG icons now use explicit foreground color (`var(--fg)`) so they remain visible across all VS Code themes (light, dark, high contrast)

### Changed
- README now showcases six screenshots, one per view:
  1. Full privacy — keys and values masked
  2. Keys only — keys visible, values masked
  3. Full reveal — keys and values visible
  4. Add a section — section name input dialog
  5. Text editor — integrated text view with masking
  6. Raw file — VS Code native text editor
- Removed "Reveal values only" and "Per-row reveal" showcase sections from README, replaced with "Add a section", "Text editor view", and "Raw file" sections

## [0.0.7] - 2026-03-12

### Changed
- All UI icons replaced with inline Lucide SVGs for a consistent, professional look — no more emojis in the interface

## [0.0.6] - 2026-03-12

### Added
- "Raw File" button in the toolbar to open the `.env` file in VS Code's native text editor — reopening the file later restores the custom editor view
- "Add Section" now opens a native VS Code input dialog to name the section immediately

### Fixed
- Section names no longer lose the `#` prefix when edited — the prefix is automatically restored, preventing the section from becoming an unmanageable grayed-out comment

## [0.0.5] - 2026-03-12

### Added
- Section headers (`#` comments) displayed with accent color and bold text in both views
- "Add Section" button in toolbar to create new sections
- Per-section "+" button to add a variable directly inside a section
- Inline editing of section names
- Move-to-section button (Lucide pen icon) on each variable with dropdown picker to choose target section
- Multi-select with checkboxes and a selection bar to move multiple variables to a section at once
- Section reorder buttons (up/down chevrons) on each section header to swap section positions

### Changed
- Text Editor button now switches to an integrated text view within the custom editor instead of reopening in VS Code's native text editor — all masking features (key blur, value masking, per-row reveal) remain active in both views

## [0.0.4] - 2026-03-12

### Added
- Toggle button in toolbar to switch from table view to the standard text editor
- Command "StockEnv: Open as Table" in the command palette to switch back to table view

## [0.0.3] - 2026-03-12

### Changed
- Moved build output to dedicated folder
- Updated lockfile

## [0.0.2] - 2026-03-12

### Added
- Interactive table editor for `.env` files with two columns (Key / Value)
- Per-column masking: keys blurred, values replaced by dots
- Per-row reveal with lock icon toggle
- Inline editing with Enter to confirm, Escape to cancel
- Automatic quote stripping and restoration on save
- Add and delete variable rows
- Save button with visual confirmation
- Content Security Policy (`default-src 'none'`)
- XSS protection via HTML escaping
- Input validation on all webview messages
- Comment and blank line preservation in table view

## [0.0.1] - 2026-03-12

### Added
- Initial extension scaffold
- Custom editor provider registration for `.env` files
- Basic webview with environment variable display
