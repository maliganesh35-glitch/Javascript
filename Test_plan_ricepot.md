# Test Plan: eKYC Biometric Lead Creation (Home Loan, UAT)

Draft v0.1 · 4 Oct 2026 · Environment: UAT · Status: generated only, not reviewed, not executed

## 1. Purpose and document status

This plan defines how lead creation and Aadhaar-based biometric eKYC in the home loan application will be tested in UAT. It was built from the answers given during planning. Nothing here has been reviewed or executed, so it makes no pass, coverage, or readiness claim.

**Labels used in this document**

- **Confirmed**: stated by you.
- **A-xx (Assumption)**: proposed by me, needs your confirmation.
- **Q-xx (Open question)**: unresolved. Test cases that depend on one are marked TBC and should not be executed until it is answered.
- **Placeholder** such as `<UI_MESSAGE>`: a detail not supplied, or intentionally withheld, and not invented.
- **REQ-xx and TC-xx IDs** are locally assigned. They are not from any external system.

**Approval note:** this plan was created at your request without the separate plan-approval step the RICE-POT template normally requires. Please treat it as a draft for your review.

## 2. Confirmed facts

- Domain: home loan (lending). Feature: lead creation, followed by eKYC.
- eKYC method: Aadhaar-based biometric, via the `ekyc_biometric` API, with fingerprint capture on a SecuGen device.
- Environment: UAT.
- Users: branch officer / lead generator.
- Lead inputs: mobile number plus either DOB or PAN (one is enough).
- Every valid lead can proceed to eKYC.
- If eKYC fails, the user can retry. After 3 failed attempts, the loan application is cancelled.
- Testers use their own real fingerprints and identities.
- API structure is withheld by you, so API tests are written at behavior level only.

## 3. Scope

**In scope** (valid leads only)

- Functional testing of lead creation and the eKYC retry and cancel flow
- Behavior-level testing of the `ekyc_biometric` call
- SecuGen device and compatibility testing
- Security checks (specific checks to be approved, Q-10)
- Performance checks (thresholds to be agreed, Q-10)

**Out of scope**

- Leads whose nationality is US (listed as an exclusion; no tests written for this behavior)
- Field-level API contract validation (endpoint, request and response fields, error codes), because the structure was withheld
- Production environment testing
- Penetration testing, and any load against real UIDAI services, unless separately approved in writing
- Other loan modules and unrelated features

**Counts and limits:** none were specified, so none are applied.

## 4. Requirements (locally assigned IDs)

| ID | Requirement | Source |
|---|---|---|
| REQ-01 | A lead can be created with a mobile number and either DOB or PAN. | Confirmed |
| REQ-02 | Every valid lead can proceed to eKYC. | Confirmed |
| REQ-03 | eKYC is performed through the `ekyc_biometric` API using Aadhaar-based fingerprint capture on a SecuGen device. | Confirmed |
| REQ-04 | If eKYC fails, the user can retry. | Confirmed |
| REQ-05 | After 3 failed eKYC attempts, the loan application is cancelled. | Confirmed |
| REQ-06 | The flow is operated by a branch officer / lead generator. | Confirmed |
| REQ-07 | Leads with US nationality are out of scope. | Confirmed (exclusion) |

## 5. Assumptions (need your confirmation)

| ID | Assumption |
|---|---|
| A-01 | A valid lead means a mobile number plus either a DOB or a PAN, each passing format validation. Exact rules are not supplied. |
| A-02 | For designing negative cases only: mobile is a 10-digit Indian number and PAN follows the standard 10-character pattern. Expected messages stay `<UI_MESSAGE>`. |
| A-03 | A failed attempt means `ekyc_biometric` returned a business failure, for example a fingerprint that does not match. Whether technical failures also count is open (Q-05). |
| A-04 | A lead cancelled after 3 failed attempts is still in scope, because it follows from the cancellation rule. |
| A-05 | Branch officer and lead generator are treated as one role until Q-04 is answered. |

## 6. Open questions

| ID | Question | Blocks |
|---|---|---|
| Q-01 | Is the 3-attempt counter per lead, per Aadhaar, or per session? Does it ever reset? | TC-EK-08, 09, 11, TC-SEC-06 |
| Q-02 | If both DOB and PAN are entered, what happens when they match and when they do not? | TC-LC-09, 10 |
| Q-03 | What are the field validation rules (formats, mandatory or optional, minimum age)? | TC-LC-03 to 08 |
| Q-04 | Are branch officer and lead generator separate roles? Is access restricted by branch? | TC-LC-13, TC-SEC-04, 05 |
| Q-05 | Do technical failures (timeout, service down, device missing, poor capture) count toward the 3 attempts? | TC-API-03, 04, TC-DV-02 to 06 |
| Q-06 | Does UAT call real UIDAI services or a simulator? Are there lock or rate limits on repeated failures? | TC-EK-05, TC-PF-04 |
| Q-07 | How can failures be induced safely and repeatably in UAT? | TC-EK-03 to 05 |
| Q-08 | Can two leads exist for the same mobile number or identity? | TC-LC-11 |
| Q-09 | Is consent captured before the fingerprint scan? | TC-SEC-09 |
| Q-10 | Which security checks are approved, and what are the performance thresholds? | TC-SEC-*, TC-PF-* |
| Q-11 | Which OS, browser, SecuGen model, and driver versions must be supported? | TC-DV-08 |
| Q-12 | How many tester identities are available, and can an identity be reused after its lead is cancelled? | Section 8 |
| Q-13 | What status or label shows after cancellation? Can a new lead be created for the same applicant? | TC-EK-05, 07, 09, 12 |
| Q-14 | Application name, UAT URL, and whether an intermediary sits between the app and UIDAI. | Section 8 |
| Q-15 | What do your data and consent policies allow for testers' real biometrics? Your compliance team should confirm. | Section 8 |

## 7. Test approach

- **Levels:** functional (UI and workflow), API behavior as seen from the UI and any approved test harness, device and compatibility, security, performance.
- **Priority (proposed):** P1 = core path and the retry and cancel rule (TC-LC-01, 02, TC-EK-02 to 05, TC-DV-01, TC-SEC-01, 06). P2 = other negative and edge cases. P3 = compatibility breadth and extended performance.
- **Case types:** P = positive, N = negative, E = edge.
- **Expected results:** where a result depends on an open question, the case says TBC with the question ID. Those cases are blocked, not guessed.
- **Evidence:** screenshots and logs must follow the data rules in Section 8.

## 8. Environment and test data

| Item | Detail |
|---|---|
| Application | `<APPLICATION_NAME>` |
| UAT URL | `<UAT_URL>` |
| Accounts | Branch officer / lead generator UAT accounts. Credentials come from an approved secret mechanism, never written in this plan or in test evidence. |
| Device | SecuGen model `<DEVICE_MODEL>`, driver and service version `<DRIVER_VERSION>` |
| Platforms | `<COMPAT_MATRIX>` (Q-11) |
| Test identities | `<N_IDENTITIES>` testers using their own mobile number, DOB or PAN, and enrolled fingerprints (Q-12) |

**Data and privacy rules (mandatory)**

- Each tester gives documented consent before use. Compliance confirms the policy (Q-15).
- Aadhaar numbers, biometric data, and full PAN or mobile numbers never appear in test cases, screenshots, defect tickets, or reports. Use tester codes (T01, T02, and so on) and masked values.
- Treat every identity as limited. A lead cancelled after 3 failures may not be reusable (Q-12, Q-13). Keep an identity usage log by tester code, not by personal data.

**Candidate ways to induce failure (to confirm in Q-07; none is assumed to work in UAT)**

- A tester scans a finger that is not enrolled
- A tester scans a different person's finger on someone else's lead, with that person's consent
- Poor placement or a partial touch
- Device disconnected or its service stopped

## 9. Test cases

### 9.1 Lead creation (functional)

General precondition: signed in as a branch officer on UAT with a connected device where needed.

| ID | Req | Type | Steps | Expected result |
|---|---|---|---|---|
| TC-LC-01 | REQ-01 | P | Open lead creation. Enter a valid mobile number and a valid DOB. Submit. | Lead is created with a lead ID. No validation error. The officer can proceed to eKYC. |
| TC-LC-02 | REQ-01 | P | Repeat TC-LC-01 using a valid PAN instead of DOB. | Same as TC-LC-01. |
| TC-LC-03 | REQ-01 | N | Enter a valid mobile only. Leave DOB and PAN empty. Submit. | Lead is not created. `<UI_MESSAGE>` is shown (Q-03). |
| TC-LC-04 | REQ-01 | N | Enter DOB or PAN only. Leave mobile empty. Submit. | Lead is not created. `<UI_MESSAGE>` is shown (Q-03). |
| TC-LC-05 | REQ-01 | N | Enter an invalid mobile: too short, too long, letters, special characters (one run each). | Lead is not created in each run. `<UI_MESSAGE>` is shown (Q-03). |
| TC-LC-06 | REQ-01 | N | Enter an invalid PAN: wrong length, wrong pattern. Then try lowercase and leading or trailing spaces. | Wrong length and pattern: lead is not created. Lowercase and spaces: TBC (Q-03). |
| TC-LC-07 | REQ-01 | N | Enter an invalid DOB: future date, impossible date, partial date. | Lead is not created. `<UI_MESSAGE>` is shown (Q-03). |
| TC-LC-08 | REQ-01 | E | Enter DOBs at the age boundary (exactly the minimum age, one day under). | TBC (Q-03). |
| TC-LC-09 | REQ-01 | E | Enter both a DOB and a PAN that belong to the same person. Submit. | TBC (Q-02). |
| TC-LC-10 | REQ-01 | E | Enter both a DOB and a PAN that do not match each other. Submit. | TBC (Q-02). |
| TC-LC-11 | REQ-01 | E | Create a second lead with the same mobile number. | TBC (Q-08). |
| TC-LC-12 | REQ-01 | E | Double-click Submit on a valid lead. | Exactly one lead is created. No duplicate. |
| TC-LC-13 | REQ-06 | N | Attempt lead creation with a user who does not hold the branch officer role. | Access is denied. Exact behavior TBC (Q-04). |
| TC-LC-14 | REQ-01 | P | Create a valid lead, then reopen it. | Saved values match what was entered. Identifiers are displayed per the masking policy. |

### 9.2 eKYC retry and cancellation (functional)

| ID | Req | Type | Steps | Expected result |
|---|---|---|---|---|
| TC-EK-01 | REQ-02 | P | Create a valid lead. Move to the eKYC step. | eKYC step is available with no extra blocking condition. |
| TC-EK-02 | REQ-03 | P | Capture the tester's own enrolled fingerprint on the first attempt. | eKYC succeeds. The lead moves on. Status shows `<EKYC_SUCCESS_STATUS>`. |
| TC-EK-03 | REQ-04 | P | Cause one failure (Q-07). Retry with a valid fingerprint. | First attempt fails. Retry is offered. Second attempt succeeds. The application is not cancelled. |
| TC-EK-04 | REQ-04 | E | Cause two failures. Succeed on the third attempt. | The third attempt succeeds. The application is not cancelled. |
| TC-EK-05 | REQ-05 | N | Cause three consecutive failures. | The application is cancelled. No further attempt is possible. `<CANCEL_STATUS>` is shown (Q-13). |
| TC-EK-06 | REQ-04 | N | After failure 1, then after failure 2, check the screen. | A retry option is available after each. Whether remaining attempts are shown is TBC. |
| TC-EK-07 | REQ-05 | N | After cancellation, try to retry using Back, Refresh, and a saved eKYC URL. | eKYC cannot be restarted. No `ekyc_biometric` call is made. |
| TC-EK-08 | REQ-05 | E | After 1 failure, refresh, close the browser, or log out and in. Then cause 2 more failures. | TBC (Q-01). |
| TC-EK-09 | REQ-05 | E | After a cancellation, create a new lead for the same identity and attempt eKYC. | TBC (Q-01, Q-13). |
| TC-EK-10 | REQ-04 | E | Succeed after one or two failures. Check the lead history. | Failed attempts before the success are recorded. No biometric data is shown. |
| TC-EK-11 | REQ-05 | E | Open the same lead in two sessions and alternate failed attempts. | TBC (Q-01). |
| TC-EK-12 | REQ-05 | P | After cancellation, check audit or history. | Cancellation is recorded with lead ID, user, and time. No biometric or full Aadhaar data. |
| TC-EK-13 | REQ-03 | N | Scan a different consenting person's finger on a lead. | The attempt fails and counts as one attempt (A-03). |

### 9.3 `ekyc_biometric` API behavior (structure withheld)

These cases check outcomes only. Endpoint, fields, and codes stay as placeholders.

| ID | Req | Type | Steps | Expected result |
|---|---|---|---|---|
| TC-API-01 | REQ-03 | P | Submit a valid capture. | Response indicates success `<API_SUCCESS_INDICATOR>`. UI shows success and the lead progresses. |
| TC-API-02 | REQ-04 | N | Submit a capture that produces a business failure `<API_ERROR_CODE>`. | UI shows `<UI_MESSAGE>`. One attempt is counted. |
| TC-API-03 | REQ-04 | N | Simulate no response or timeout, if a simulator or approved method exists. | UI does not hang indefinitely. The officer can recover. Attempt counting TBC (Q-05). |
| TC-API-04 | REQ-04 | N | Simulate service unavailable. | Graceful message. No lead data is lost. Attempt counting TBC (Q-05). |
| TC-API-05 | REQ-04 | E | Return an unrecognized error code, if a simulator exists. | Generic failure handling. No crash or blank screen. |
| TC-API-06 | REQ-03 | E | Double-click or resubmit the capture. | One call and one attempt are recorded. |
| TC-API-07 | REQ-05 | N | Through the UI only, try to trigger eKYC for a cancelled lead. | The call is not made or is rejected. Direct API calls only if approved. |

### 9.4 SecuGen device and compatibility

| ID | Req | Type | Steps | Expected result |
|---|---|---|---|---|
| TC-DV-01 | REQ-03 | P | Connect the device and start eKYC. Capture a good fingerprint. | Device is detected. Capture succeeds and is submitted. |
| TC-DV-02 | REQ-03 | N | Start eKYC with the device unplugged. | Clear indication that the device is missing, `<UI_MESSAGE>`. Attempt counting TBC (Q-05). |
| TC-DV-03 | REQ-03 | E | Unplug the device during capture. | Capture fails without a crash. The officer can reconnect and continue. Attempt counting TBC (Q-05). |
| TC-DV-04 | REQ-03 | N | Stop the device driver or service, then start eKYC. | Clear indication that the device is unavailable. No unhandled error. |
| TC-DV-05 | REQ-03 | N | Capture with a poor-quality finger: wet, dry, partial, light touch. | Poor capture is handled with `<UI_MESSAGE>`. Counting TBC (Q-05). |
| TC-DV-06 | REQ-04 | E | Reconnect the device after an error and continue on the same lead. | The lead is intact. The counter is not inflated beyond the rule (Q-05). |
| TC-DV-07 | REQ-03 | P | Capture each enrolled finger the tester consents to use. | Each enrolled finger is accepted, or the behavior is recorded. |
| TC-DV-08 | REQ-03 | P | Run TC-DV-01 and TC-EK-02 on every combination in `<COMPAT_MATRIX>`. | Pass or fail is recorded per combination (Q-11). |
| TC-DV-09 | REQ-03 | E | Switch USB port, use a hub, or swap the device between attempts. | The device is detected again and capture works. |
| TC-DV-10 | REQ-03 | E | Connect two fingerprint devices, if applicable. | The expected device is used, or a clear selection is shown. |

### 9.5 Security (approved checks only, Q-10)

| ID | Req | Type | Steps | Expected result |
|---|---|---|---|---|
| TC-SEC-01 | REQ-03 | N | Inspect the UI, browser storage, and visible network data after a capture. Check logs if accessible. | No raw fingerprint data is stored, displayed, or logged in clear text, at the layers the tester can inspect. |
| TC-SEC-02 | REQ-03 | N | Check screens, exports, and notifications for Aadhaar and PAN display. | Identifiers are masked per `<MASKING_RULE>`. |
| TC-SEC-03 | REQ-01 | N | Open the application over plain HTTP. | Access is blocked or redirected to HTTPS. |
| TC-SEC-04 | REQ-06 | N | Open lead and eKYC URLs without signing in, then after session expiry. | Access is denied and the user is sent to sign-in. Timeout length `<SESSION_TIMEOUT>`. |
| TC-SEC-05 | REQ-06 | N | As one officer, try to open another officer's or branch's lead by changing the lead ID. | TBC (Q-04). |
| TC-SEC-06 | REQ-05 | N | Try to exceed or reset the attempt limit using Refresh, Back, and (if approved) request replay. | The limit is enforced by the server. Attempts cannot exceed 3 or be reset. Scope TBC (Q-01). |
| TC-SEC-07 | REQ-01 | N | Enter script-like and SQL-like strings in mobile, PAN, and DOB. | Input is rejected or safely handled. No stack trace or internal error is shown. |
| TC-SEC-08 | REQ-03 | N | Trigger failures and read all error messages. | No internal endpoints, tokens, or stack traces are exposed. |
| TC-SEC-09 | REQ-03 | N | Start eKYC and look for a consent step before capture. | TBC (Q-09). |

### 9.6 Performance (thresholds to be agreed, Q-10)

| ID | Req | Type | Steps | Expected result |
|---|---|---|---|---|
| TC-PF-01 | REQ-01 | P | Create leads one user at a time and record response times. | Within `<THRESHOLD>`. This is the baseline. |
| TC-PF-02 | REQ-01 | P | Create leads with `<N_USERS>` concurrent users for `<DURATION>`. | Response time and error rate within `<THRESHOLD>`. |
| TC-PF-03 | REQ-03 | P | Time one eKYC attempt from capture to result. Separate application time from external service time. | Within `<THRESHOLD>`. |
| TC-PF-04 | REQ-03 | E | Run concurrent eKYC submissions. Only against a simulator or with written approval (Q-06). | Within `<THRESHOLD>`. No real identities are used for load. |
| TC-PF-05 | REQ-01 | E | Repeat create-then-eKYC cycles for `<DURATION>`. | Response times do not degrade over the run. |

## 10. Requirement traceability

| Requirement | Test cases |
|---|---|
| REQ-01 | TC-LC-01 to 12, 14, TC-SEC-03, 07, TC-PF-01, 02, 05 |
| REQ-02 | TC-EK-01 |
| REQ-03 | TC-EK-02, 13, TC-API-01, 06, TC-DV-01 to 10, TC-SEC-01, 02, 08, 09, TC-PF-03, 04 |
| REQ-04 | TC-EK-03, 04, 06, 10, TC-API-02 to 05, TC-DV-06 |
| REQ-05 | TC-EK-05, 07, 08, 09, 11, 12, TC-API-07, TC-SEC-06 |
| REQ-06 | TC-LC-13, TC-SEC-04, 05 |
| REQ-07 | Excluded from testing |

Total planned: 58 test cases. Cases marked TBC cannot be executed until the linked question is answered.

## 11. Entry and exit criteria (proposed, for your approval)

**Entry**

- UAT build deployed and reachable, with branch officer accounts available
- SecuGen device and driver installed on test machines
- Tester consent recorded (Q-15) and identities allocated (Q-12)
- Q-01, Q-05, and Q-07 answered, because they decide the core retry and cancel tests

**Exit**

- All P1 cases executed
- Other cases executed, or deferred with a recorded reason
- No open Critical or High defects
- Every TBC case either unblocked or accepted by you as deferred

## 12. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Few real identities, and cancellation may consume them | Retry and cancel cases cannot be repeated | Plan the identity budget first. Confirm reuse rules (Q-12, Q-13). |
| UAT may call real UIDAI services | Repeated failures may trigger locks or rate limits | Confirm with the project team (Q-06) before running failure cases. |
| Failures are hard to induce with valid fingerprints | TC-EK-03 to 05 cannot run | Agree an induction method (Q-07). |
| Counter scope is undefined | Core rule cannot be verified | Answer Q-01 before execution. |
| Real biometric and Aadhaar data in artifacts | Privacy and compliance breach | Apply the data rules in Section 8. |
| UAT differs from production | Results may not carry over | State this in the final report. |

## 13. Defects and reporting

- Each defect records the case ID, tester code, build, environment, steps, expected and actual result, and masked evidence.
- The execution report separates cases generated, reviewed, and executed. It reports a pass only with recorded evidence.
- Production readiness is not claimed in this plan or in its reports unless supporting evidence exists.

## 14. Next steps

1. Review this draft and confirm or correct the assumptions A-01 to A-05.
2. Answer the open questions, starting with Q-01, Q-05, Q-07, and Q-12.
3. Fill in the placeholders privately: application name, UAT URL, device details, thresholds, and platform matrix.
4. Once the blocking questions are answered, I can update the TBC cases and, on request, convert the cases into a spreadsheet for execution tracking.
