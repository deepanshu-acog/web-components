# Changelog

## 2026-08-09

**What:** Added Phase 1 of atk-ui: the theme, generated catalog and skills,
Astro starter, local preview and project-start CLI, standalone CLI release
build, and the library publication contract.

**Why:** An engineer needs one supported path from an empty directory to a
working branded page. The npm library supplies components to applications. The
GitHub-release binary supplies project setup and catalog preview.

**Rejected:** Publishing the CLI through npm. The CLI ships as standalone
binaries through GitHub releases so it can be installed and updated by the
shared commands repository without a second npm-based command distribution
path.
