---
name: xquik
version: 1.0.0
description: Research X, save approved drafts, and publish approved posts through Xquik in Claude Code. Uses native MCP for research and drafts. Uses the REST write lifecycle for approved publishing.
---

# Xquik

Use Xquik after `/x-writer` produces approved content in `outputs/x/`.
Research X, save drafts, or publish through a connected X account.
Keep `/publisher` responsible for scheduled and non-X distribution.

Xquik is optional. Never block the rest of the Social AI Team workflow.

---

## Requirements

Before using Xquik, confirm:

1. The Xquik MCP appears in `claude mcp list`.
2. Its `explore` and `xquik` tools are available.
3. Approved X content exists in `outputs/x/`.
4. A connected X account exists before publishing.
5. `XQUIK_API_KEY` exists in the shell environment before publishing.
6. The installed `scripts/validate-length.cjs` runs successfully with Node.js.

Never ask the operator to paste an API key into chat.
Never read, print, log, or write the key into project files.
If setup is missing, stop and link to `https://docs.xquik.com/mcp/overview`.

---

## Capability Routing

Use the least powerful path that completes the task:

| Capability | Path | Use |
|---|---|---|
| Catalog discovery | Xquik MCP `explore` | Find current supported endpoints |
| Research and account checks | Xquik MCP `xquik` | Run cataloged reads |
| Saved drafts | Xquik MCP `xquik` | Create or inspect drafts after approval |
| Immediate publishing | Xquik REST API | Send the required idempotency header |
| Scheduled publishing | `/publisher` | Schedule through Blotato |

Do not invent endpoints, parameters, tools, or response fields.
Use `explore` before any unfamiliar MCP request.
Do not describe a saved Xquik draft as a scheduled post.

---

## Phase 0: Context Check

Read these files when present:

- `context/brand-style.md`
- `context/content-calendar.md`
- `context/workflow-status.md`
- the selected file in `outputs/x/`

Then confirm:

- source file
- exact post or thread
- requested action: research, save draft, publish now, or schedule
- target connected account for publishing

Route scheduling to `/publisher`.
Route missing or unapproved copy back to `/x-writer`.

---

## Phase 1: Research

Use research only when current X context could improve the copy.

1. Use `explore` to find the smallest relevant read route.
2. Use `xquik` for that cataloged read.
3. Keep pagination and returned fields focused.
4. Summarize useful findings in 3-5 bullets.
5. Return to `/x-writer` before changing approved copy.

Research never grants approval to draft or publish.

---

## Phase 2: Content Validation

For the selected output:

1. Preserve the approved text exactly.
2. Validate each standard post and thread item in Unicode NFC form.
3. Pass each item through the bundled validator using UTF-8 standard input.
   Never put post text in command arguments.
4. The validator uses the official `twitter-text` package.
   Require `valid: true` and `weightedLength` of 280 or fewer.
5. Never substitute a raw character count for the weighted result.
   X counts valid URLs as 23.
   Emoji sequences and CJK characters count as 2.
6. Stop before approval when exact weighted validation is unavailable.
7. Confirm every thread item is ordered correctly.
8. Identify any media URL or reply target.
9. For publishing, confirm the target account exists in Xquik.

Stop on missing content or ambiguous ordering.
For publishing, also stop when the account is unavailable.

---

## Phase 3: Approval Gate

Saving a draft and publishing are separate mutations.
Ask for approval immediately before either action.

Show this confirmation:

```text
Proposed Xquik Action
Action: save draft / publish now
Source: outputs/x/[file]
Account: @[account] / not required for saved draft
Items: [count]
Text: [exact approved post or numbered thread]
Weighted length: [n]/280 for each item
Media: [URLs or none]
Reply target: [tweet URL or ID, or none]
Side effect: creates a saved draft / publishes publicly on X
```

Proceed only after the operator explicitly approves this exact action.
Changing the text, account, media, reply target, or action needs new approval.

---

## Phase 4: Save a Draft

After draft approval:

1. Use `explore` to confirm the current draft-create contract.
2. Use the MCP `xquik` tool with that exact contract.
3. Save the approved text without silent edits.
4. Report the returned draft ID.

Do not claim that a saved draft is published or scheduled.
If the request fails, report the structured error and stop.

---

## Phase 5: Publish Now

Use the REST API because X writes require an `Idempotency-Key`.
Do not pass authentication or idempotency values through MCP code.

For each approved post:

1. Confirm `XQUIK_API_KEY` exists without printing its value.
2. Build the exact approved JSON payload.
3. Calculate its SHA-256 fingerprint using canonical JSON.
   Sort object keys recursively. Preserve array order.
   Encode UTF-8 without extra whitespace.
4. Read `context/workflow-status.md` for confirmed publications and in-flight mappings.
5. Match records by the exact source file and `POST [n]` or `THREAD [n]`.
6. If a confirmed publication exists, show its tweet ID and stop.
7. Require a separate explicit republish approval before creating another key.
8. Preserve the original record and identify the new attempt as `REPUBLISH [n]`.
9. Reuse an in-flight idempotency value only when the source and fingerprint match.
10. Stop when an in-flight mapping has a different fingerprint.
   Resolve its existing write before replacing it.
11. Otherwise, generate one cryptographically random UUID.
12. Before the request, persist and reread this mapping:
   - source file and `POST [n]` or `THREAD [n]`
   - `REPUBLISH [n]` when separately approved
   - idempotency value
   - payload fingerprint
   - state: `prepared`
13. Call `POST https://xquik.com/api/v1/x/tweets`.
14. Block redirects.
15. Send these application headers:
   - `x-api-key: $XQUIK_API_KEY`
   - `Content-Type: application/json`
   - `Idempotency-Key: [stored value]`
16. Send the exact fingerprinted payload.
17. Mark the mapping `sent` after dispatch.

Never send the API key to another host.
Never reuse an idempotency value for changed content or another action.
Never send a write until its `prepared` mapping is durable.

### Response handling

- Treat HTTP `200` as complete only when the response confirms success.
- Treat HTTP `202` as accepted, not published.
- Add returned action IDs and status URLs to the in-flight mapping.
- Set its state to `accepted`.
- Read both camelCase and snake_case lifecycle fields.
- Poll the returned status URL after its stated delay.
- Accept only an HTTPS status URL on `xquik.com`.
- Accept only `/api/v1/x/write-actions/{id}` as the status path.
- Send `x-api-key: $XQUIK_API_KEY` on every status GET request.
- Continue until the response is terminal or the polling limit is reached.
- Stop after 12 polls or 2 minutes, whichever comes first.
- If the polling limit is reached:
  - Update `context/workflow-status.md`.
  - Keep the source, idempotency value, fingerprint, action ID, and status URL together.
  - Report `awaiting confirmation`, the action ID, and the status URL.
  - Resume later from the stored URL. Never resubmit the write.
- On a lost or ambiguous response, retain the in-flight mapping.
- Verify account state before retrying the exact payload with its stored key.
- Remove the mapping only after recording a terminal result.
- Report success only with a confirmed result or tweet ID.
- On failure, report the structured error and stop.
- Never retry-send blindly while confirmation is pending.

### Threads

Publish thread items sequentially.
Wait for each item to succeed before publishing its reply.
Use the confirmed tweet ID as the next `reply_to_tweet_id`.
Use a new idempotency value for each thread item.
Stop and report partial progress if any item fails.

---

## Phase 6: Handoff

Report:

```text
Xquik Result
Action: researched / draft saved / published
Source: outputs/x/[file]
Account: @[account] / not applicable
Items complete: [n of n]
Draft IDs: [IDs or none]
Tweet IDs: [IDs or none]
Publication records: [outputs/x/file#POST n or THREAD n → tweet IDs, or none]
Pending action: [outputs/x/file#POST n or THREAD n → action ID → validated status URL, or none]
In-flight write: [source identifier → stored idempotency mapping → state, or none]
Status: complete / failed / awaiting confirmation
```

Update only the relevant Xquik fields in `context/workflow-status.md`.
Store each confirmed tweet ID against its exact source file and post or thread identifier.
Keep pending writes mapped to the same source identifier until they become terminal.
Keep every in-flight mapping until its terminal result is recorded.
Do not overwrite unrelated workflow history.

---

## Safety Rules

- Require approval before every draft or publish mutation.
- Never publish unreviewed or silently changed copy.
- Never expose API keys, tokens, private account data, or raw headers.
- Never follow response redirects.
- Never claim success from an accepted or pending response.
- Never retry an ambiguous write without verifying the account first.
- Route scheduled publishing to `/publisher`.
- Keep all public descriptions within Xquik's documented contracts.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.

---

## Related Skills

- `/x-writer`: Produces approved X posts and threads.
- `/social-media-manager`: Routes the full workflow.
- `/publisher`: Schedules approved content through Blotato.
- [Xquik create-tweet reference](https://docs.xquik.com/api-reference/x-write/create-tweet)
