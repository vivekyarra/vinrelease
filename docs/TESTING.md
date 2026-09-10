# Testing VINRelease

## Automated checks

Run:

```bash
npm install
npm run verify
```

Expected result: lint and type checking pass, all Vitest tests pass, and Next.js completes a production build.

## No-call walkthrough

1. Start with `npm run dev` and open `http://localhost:3000`.
2. Confirm the header says **Safe demo**.
3. Select **Resolve next blocker**.
4. Confirm the target is Metro Auto Auction, the phone number is masked, and the disclosure and prohibited lists are visible.
5. Check the authorization box and start the safe demo.
6. Confirm the case becomes **Next call ready** and the blocker becomes **Lien release missing**.
7. Authorize the ABC Bank call.
8. Confirm the case becomes **Waiting external**, reference `LR-4721` appears in phone evidence, and the wording says receipt is unconfirmed.
9. Reset. On the first call, choose **Unsupported credential request**.
10. Confirm the app stops at **Needs title clerk** and states that the agent declined the credential request.

Refreshing after every step should preserve the same demo state. A different browser session starts independently.

## Live verification

Use only destinations controlled by the tester or recipients who explicitly consented. Configure live mode as documented in the root README, verify the masked destination in the authorization dialog, and approve one call. Confirm that the CALL-E dashboard shows the same call ID shown in VINRelease. Do not infer that a title was received from a “release sent” result.
