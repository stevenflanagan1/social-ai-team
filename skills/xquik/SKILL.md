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

For a standard post, use `POST [n]` as its source identifier.
For a thread, use `THREAD [n] ITEM [i]/[total]` for each item.
Treat `THREAD [n]` as the parent identifier.

Before publishing:

1. Confirm `XQUIK_API_KEY` exists without printing its value.
2. Calculate a content fingerprint for every approved item.
   Include its NFC text and approved media.
3. Use canonical JSON for every fingerprint.
   Sort object keys recursively. Preserve array order.
   Encode UTF-8 without extra whitespace.
4. Read `context/workflow-status.md` for confirmed publications and in-flight mappings.
5. Match records by the exact source file and source identifier.
   For a thread, collect every record under its parent identifier.
   Stop when a stored item count differs from the approved thread.
6. For a standard post, stop when a confirmed publication exists.
   Show its tweet ID.
7. For a thread, stop when its parent has a `complete` record.
   Show every confirmed tweet ID.
8. If a thread has item records but no `complete` record:
   - Require a contiguous confirmed prefix starting at item 1.
   - Require every stored content fingerprint to match the approved item.
   - Require a tweet ID for each confirmed item.
   - If every item is confirmed, mark the parent `complete` and stop.
   - Resume at the first unconfirmed item.
   - Use the last confirmed tweet ID as its reply target.
   - Show completed items and the exact remaining items.
   - Require explicit approval to resume the remaining thread.
9. Stop when thread records have gaps, mismatched fingerprints, or missing tweet IDs.
   Also stop when legacy records lack item identifiers or content fingerprints.
   Ask the operator to reconcile the records before continuing.
10. Require a separate explicit republish approval before publishing completed content again.
11. Preserve the original record and identify the new attempt as `REPUBLISH [n]`.
12. Before each unconfirmed item, build its exact approved JSON payload.
    Include the confirmed previous tweet ID for a thread reply.
13. Calculate the payload fingerprint using the same canonical JSON rules.
14. If a matching `accepted` mapping has a validated status URL, poll it.
    Never send its POST again.
15. For matching `prepared` or `sent` mappings, verify the account.
    Then reuse the exact payload and idempotency value.
16. Stop when an in-flight mapping has a different payload fingerprint.
   Resolve its existing write before replacing it.
17. Otherwise, generate one cryptographically random UUID per item.
18. Before each request, persist and reread this mapping:
   - source file and exact post or thread-item identifier
   - thread parent identifier when applicable
   - `REPUBLISH [n]` when separately approved
   - idempotency value
   - content fingerprint
   - payload fingerprint
   - state: `prepared`
19. Call `POST https://xquik.com/api/v1/x/tweets`.
20. Block redirects.
21. Send these application headers:
   - `x-api-key: $XQUIK_API_KEY`
   - `Content-Type: application/json`
   - `Idempotency-Key: [stored value]`
22. Send the exact fingerprinted payload.
23. Mark the mapping `sent` after dispatch.

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
Record each item immediately with its index, fingerprint, and tweet ID.
Mark the thread parent `complete` only after every item succeeds.
Resume an incomplete thread from its first unconfirmed item.
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
Publication records: [source identifier → content fingerprint → tweet ID, or none]
Thread status: [outputs/x/file#THREAD n → partial/complete → tweet IDs, or none]
Pending action: [source identifier → action ID → validated status URL, or none]
In-flight write: [source identifier → stored idempotency mapping → state, or none]
Status: complete / failed / awaiting confirmation
```

Update only the relevant Xquik fields in `context/workflow-status.md`.
Store each confirmed tweet ID and fingerprint against its exact source identifier.
Store every thread item separately under its thread parent.
Mark a thread complete only after every item has a confirmed tweet ID.
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
