# Changelog

All notable changes to the StockEnv extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [0.0.4] - 2026

### Added
- Toggle button in toolbar to switch from table view to the standard text editor
- Command "StockEnv: Open as Table" in the command palette to switch back to table view

## [0.0.3] - 2025

### Changed
- Moved build output to dedicated folder
- Updated lockfile

## [0.0.2] - 2025

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

## [0.0.1] - 2025

### Added
- Initial extension scaffold
- Custom editor provider registration for `.env` files
- Basic webview with environment variable display
