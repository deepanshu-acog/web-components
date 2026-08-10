# Changelog

## 2026-08-09

**What:** Renamed the skills pack from `atk-ui` to `atk-ui-skills` so the pack
name does not conflict with the generated `atk-ui` skill.

**Why:** Developers can now distinguish installing both atk-ui skills from
installing or referring to the catalog skill itself.

**Rejected:** Keeping the shared `atk-ui` name for both artifacts. It made
commands and instructions ambiguous without adding any useful grouping.

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
