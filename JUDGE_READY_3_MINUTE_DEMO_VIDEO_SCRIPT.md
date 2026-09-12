# VINRelease — judge demo (final cut about 1:44, hard cap 2:59)

This is one continuous recording of the **deployed application** at 1440 × 900. Every pointer movement, click, selection, and scroll is a browser input event. Keep the **Safe demo** badge visible. The two pictured outcomes are deterministic no-call replays; the separate completed CALL-E call is described accurately in the close. No still-image slideshow, simulated phone audio, or claim that a title was received.

| Approx. time | Live screen action | Narration |
| --- | --- | --- |
| 0:00–0:12 | Start on the case, move over **$18,700 inventory blocked**, **25 days overdue**, and **Current blocker: Unknown**. | “This dealership already bought the BMW. Twenty-five days later, the title is still missing, and eighteen thousand seven hundred dollars of inventory is stuck. The blocker is unknown.” |
| 0:12–0:28 | Click **Resolve next blocker**. Move over the approved masked auction number, purpose, allowed facts, forbidden facts, then the authorization checkbox. | “VINRelease turns that vague status into a governed next call. Before anything starts, the title clerk sees the approved recipient, the exact purpose, and the small packet the agent may disclose. Credentials, payment information, and unverified claims are out. The clerk authorizes this call specifically.” |
| 0:28–0:48 | Check authorization; click **Authorize & start safe demo**. Wait for **Next call ready**. Move over **Lien release missing** and **ABC Bank**; scroll down to the phone evidence. | “This public replay places no phone call. Its auction result identifies a missing lien release and points to ABC Bank. A typed result, not a persuasive summary, moves the case to the next responsible party, with evidence attached.” |
| 0:48–0:56 | Return to top, click the next **Resolve next blocker**, review new recipient and disclosure, authorize. | “The second contact gets a new approval. That matters: permission to call an auction is not permission to call a lienholder. VINRelease creates a separate bounded task for the exact next party.” |
| 0:56–1:15 | Show **Waiting external** and reference **LR-4721**. Scroll to newest evidence and hover the reference and case note. | “The bank reports that it transmitted the release and gives reference L R four seven two one. But sent is not received. VINRelease keeps the vehicle waiting for receipt confirmation. It does not pretend the title is in hand.” |
| 1:15–1:28 | Reset. Open the first preview, select **Unsupported credential request**, authorize. Show **Needs title clerk**; move over the safety note and timeline. | “Now the unsafe branch. A recipient asks for a portal credential. The agent cannot provide it or invent a workaround. Automation stops and hands the case to a title clerk, with the reason preserved.” |
| 1:28–1:43 | Hold the human-stop state, move over **Safe demo** and **Why this state is trusted**. | “We also ran one separate, real CALL-E task with a controlled recipient. It returned evidence, but no verified blocker or owner, so the validated result was needs human. That is the product promise: phone conversations advance a case only as far as the evidence allows.” |

## Recording and editing guardrails

- Keep the final export below three minutes; the measured H.264/AAC export is 103.549 seconds.
- Start each narration beat only when its corresponding UI is visible. If speech runs long, shorten the copy or re-record the interaction; do not claim something before it appears.
- Show the actual click on each approval checkbox and primary action. Give key status changes at least two seconds on screen.
- Do not obscure the safe-demo badge, masked recipient, result states, or evidence with overlays.
- The separate real proof is `call_rkZ1HkMxxjswZKSx1CjCkA`: completed September 11, 2026, three evidence items, schema-valid `needs_human`; it **did not** establish the blocker/owner or obtain a title.
- The narration was generated in ElevenLabs with Roger, Eleven Multilingual v2, and downloaded to `C:\Users\vivek\Downloads\VINRelease-Winner-Demo-ElevenLabs.mp3`. No synthetic phone-call sound effects or background music were added.
