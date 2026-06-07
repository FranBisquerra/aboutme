# /commit — Create a Git Commit

Conventions for creating git commits in this project.

## Golden rules

- **Never commit unless explicitly told to.** Making changes is not permission to commit.
- **Always ask before committing**, even when changes look finished.
- **Atomic, functional commits**: one logical change per commit. Split unrelated changes
  into separate commits; each commit should build/work on its own.
- **Commits are written in English.**
- **Never add `#automerge` or `#autodeploy`** (or any deploy/merge trigger) to a commit.
  Those tags are reserved for the human to add manually when they decide to deploy.

## Subject format

```
<Feature>: <Verb in indicative> <what> [in order to <why>]
```

- `<Feature>` — the feature / module / area touched (e.g. `Profile`, `Auth`, `Contact`),
  capitalized, followed by `: `.
- `<Verb>` — an indicative-mood verb (`Add`, `Remove`, `Move`, `Fix`, `Rename`, `Update`…).
- Keep the subject concise; add a body only when the *why* needs more than the subject line.

### Example

```
Profile: Add MariaDB database in order to store data
```

## Before committing — checklist

- [ ] The user explicitly asked to commit.
- [ ] Changes are grouped into atomic, functional commits (unrelated changes split out).
- [ ] Each subject follows `<Feature>: <Verb> …` and is in English.
- [ ] No `#automerge` / `#autodeploy` in any message.
- [ ] Staged only the files belonging to this commit (`git status` checked first).
