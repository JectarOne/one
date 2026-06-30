# JectarOne — Engagement Process & Rules of Engagement

This document describes how JectarOne runs an engagement from first contact to closure. It exists to keep work safe, lawful, transparent, and useful to the client.

## 1. Engagement lifecycle

1. **Enquiry.** Client requests an assessment, quote, or consultation.
2. **Scoping call.** We understand the business, systems, and goals.
3. **Proposal & quote.** We define scope, deliverables, timeline, and price.
4. **Agreement.** Signed statement of work (SOW) + non-disclosure agreement (NDA) + written authorization.
5. **Discovery.** Confirm assets, access, contacts, and constraints.
6. **Assessment / testing.** Execute the agreed methodology.
7. **Reporting.** Deliver executive summary + technical findings.
8. **Debrief.** Walk the client through findings and priorities.
9. **Remediation support & retest.** Help fix and verify the fixes.
10. **Closure.** Confirm completion; securely handle and retain data per the SOW.

## 2. Authorization (non-negotiable)

- **No testing without written authorization.** We test only systems the client owns or is contractually authorized to permit testing on, and only within the agreed scope.
- Scope, IP ranges, URLs, accounts, and time windows are documented in the SOW before any testing begins.
- For third-party-hosted assets, the client confirms provider permission where required.

## 3. Rules of engagement

- **Non-destructive by default.** No actions intended to damage data or disrupt service.
- **No DoS/DDoS** unless explicitly contracted and scheduled.
- **Least data necessary.** We access only what is needed to demonstrate an issue; we do not exfiltrate real personal data.
- **Sensitive findings** (e.g., active compromise, exposed personal data) are reported to the client immediately, outside the normal report cycle.
- **Defined windows & contacts.** Emergency contact and stop conditions are agreed up front.

## 4. Confidentiality & data handling

- All client information is confidential and covered by an NDA.
- Findings and reports are shared only with client-authorized recipients.
- Engagement data is encrypted at rest and in transit, access is least-privilege, and data is securely deleted per the retention terms in the SOW.

## 5. Reporting standard

Every report includes:

- **Executive summary** — risk and priorities in plain language.
- **Methodology & scope** — what was tested and how.
- **Findings** — each with severity (CVSS where applicable), evidence, and remediation.
- **Risk matrix** — likelihood × impact.
- **Recommendations** — prioritized and effort-aware.
- **Retest results** — where a retest is included.

## 6. Severity ratings

| Severity | Meaning | Expected action |
|----------|---------|-----------------|
| Critical | Immediate, high-impact exploitation likely | Fix now |
| High | Serious risk, realistic exploitation | Fix soon |
| Medium | Moderate risk or conditions required | Plan a fix |
| Low | Minor / hardening | Fix when convenient |
| Info | No direct risk; good practice | Optional |

## 7. Legal & ethics

We operate under the laws of the Kingdom of Morocco and recognized professional ethics for security testing. We decline work that is unlawful or that lacks proper authorization.

---
© 2026 JectarOne. Confidential company document.
