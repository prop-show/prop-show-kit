# Security

报告未公开的安全问题时，请使用下面的非公开渠道，不要在公开 issue 里写出利用细节。

## Reporting a vulnerability

Report privately with a [GitHub Security Advisory](https://github.com/prop-show/prop-show-kit/security/advisories/new).

If that form is unavailable, open a public issue only to ask for a private channel. Do not include reproduction steps, payloads, or exploit details in that issue.

## What to include

- The URL or registry entry you think is affected.
- What an attacker can do, and who is affected.
- A reproduction that does not include secrets, credentials, or live customer data.
- Whether the issue is in this repository, in the published registry JSON, or only after a project has edited the copied source.

## Scope

In scope:

- The docs site at <https://kit.prop.show/>.
- Registry JSON published at <https://kit.prop.show/r/>.
- Source under `packages/ui/registry` that the CLI copies.
- Build and deploy configuration in this repository.

Out of scope:

- Source after someone has copied it into their own project and changed it. That tree is theirs.
- Vulnerabilities in shadcn-vue, Vue, Tailwind, Vite, or other upstream projects. Report those upstream.
- Placeholder copy and in-memory workspace data. Those are demonstration content. The pitfalls guide tells users to replace them.

This project does not run a hosted app that stores user accounts. The site and the registry are static files.

## After a report

We will acknowledge a report when we see it and reply with a fix, a mitigation, or why it is out of scope. There is no bounty program and no response-time guarantee.
