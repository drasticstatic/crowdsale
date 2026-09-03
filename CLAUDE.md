# CLAUDE.md — crowdsale

**Status:** ⏸️ Inactive — Class homework assignment, now boilerplate code and sandbox environment

---

## Security Rules (Non-Negotiable)

- **Never read, display, or reference `.env` files** — in any repo
- **Never read private keys, seed phrases, wallet files, mnemonic files, or keystore files**
- **Never read or expose API key files** (service accounts, Google credentials, exchange keys, etc.)
- **Never commit secrets** — warn and stop if staged
- If an example env file is needed, create it with placeholder values only (e.g. `API_KEY=your_api_key_here`)
- **Web3:** Never display wallet addresses or private keys from any secret file

---

## Context Rules

- Memory files live in `~/.claude/projects/.../memory/` — MEMORY.md auto-loaded each session
- AGENT-SYNC is private — never reference its contents in public-facing files
- Cross-repo privacy firewall: Alfred does not pass trading or divorce-custody data between repos without explicit instruction
- **Commit footer:** full fleet convention, shown regardless of whether this repo currently has an Augment Intent workspace pairing or NIM in active use — see `anthropas-argus-alfred/sandbox/AGENT_IDENTITY_REFERENCE.md` and `INTENT_WORKTREE_LEGEND.md` for the full rule:
  - Alfred-Anthropic: `Co-Authored-By: Alfred · ClaudeCodeCLI · Anthropic [Sonnet-5/Opus-#/Haiku-#]`
  - Alfred-NIM: `Co-Authored-By: Alfred · ClaudeCodeCLI · NVIDIA NIM [model]`
  - Kavanah-AugmentIntentUI-AuggieLogin: `Co-Authored-By: Kavanah · AugmentIntent · [model]`
  - Kavanah-AugmentIntentUI-AnthropicLogin ("ClaudeMent"): `Co-Authored-By: Kavanah · ClaudeMent · Anthropic [model]`
  - Kavanah-TerminalUI(macOS/Intent/VSCode standard terminal instance)-AnthropicLogin: `Co-Authored-By: Kavanah · ClaudeCodeCLI · Anthropic [model]`
  - Mystarch (app-level, cross-workspace reach): same engine options as Kavanah, swap the agent name
  - Auggie (native Augment CLI — hibernating, may return): `Co-Authored-By: Auggie · AugmentCLI · [model]`

---

## Agent Ecosystem

| Agent | Platform | Domain |
|-------|----------|--------|
| **Alfred** | Claude Code CLI | System coordinator, cross-repo housekeeping, free-model sandbox |
| **Fortuna** | Claude Code CLI | Trading workflow, session analysis, coaching documentation |
| **Auggie** | Augment CLI | Code builds — Pine Script, Python, MCP servers, web3/dappu |

---

## This Repo

**Purpose:** DAppU Crowdsale class project — token sale smart contract implementation.

**Status:** Inactive. Christopher is not actively working on this repo.

**When Active:** Auggie leads code builds. Fortuna provides trading context if relevant. Alfred handles cross-repo housekeeping.

---

## Cross-Repo Rules

See `AGENT-SYNC/CROSS_REPO_RULES.md` in `trading-assistant` for full governance.
