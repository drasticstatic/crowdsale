# AGENTS.md — crowdsale

**Status:** ⏸️ Inactive — Class homework assignment, now boilerplate code and sandbox environment

---

## Agent Ecosystem

| Agent | Platform | Domain |
|-------|----------|--------|
| **Alfred** | Claude Code CLI | Primary coordinator — cross-repo housekeeping, free-model sandbox, generalist tasks (default) |
| **Fortuna** | Claude Code CLI | Trading specialist — trading workflow, session analysis, coaching documentation (designated domain) |
| **Kavanah** | Augment Intent | Spec-driven orchestration specialist — cross-repo coordination, documentation |
| **Auggie** | Augment CLI | Code build specialist — Pine Script, Python, MCP servers, web3/dappu |

---

## This Repo

**Purpose:** DAppU Crowdsale class project — token sale smart contract implementation.

**Status:** Inactive. Christopher is not actively working on this repo.

**When Active:** Auggie leads code builds. Fortuna provides trading context if relevant. Alfred handles cross-repo housekeeping.

---

## Security Rules

- Never read, display, or reference `.env` files
- Never read private keys, seed phrases, wallet files, or API key files
- Never commit secrets — warn and stop if staged
- Before cloning/installing any external repo: review package.json scripts, scan for credential harvesting, verify provenance, check for typosquatting, audit network calls

---

## Cross-Repo Rules

See `AGENT-SYNC/CROSS_REPO_RULES.md` in `trading-assistant` for full governance.
