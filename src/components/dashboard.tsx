"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { TitleCase } from "@/domain/model";
import type { CallPreview } from "@/safety/call-policy";
import { ArrowIcon, CloseIcon, PhoneIcon, ResetIcon, ShieldIcon } from "./icons";

type ApiState = { titleCase: TitleCase | null; mode: "demo" | "live"; loading: boolean; error: string | null };

const stateLabels: Record<TitleCase["state"], string> = {
  NEW: "New",
  READY_TO_CONTACT: "Ready to contact",
  CALL_IN_PROGRESS: "Call in progress",
  ACTIONABLE_RESULT: "Result received",
  READY_FOR_NEXT_CALL: "Next call ready",
  WAITING_EXTERNAL: "Waiting external",
  NEEDS_HUMAN: "Needs title clerk",
  CLOSED: "Closed",
};

export function Dashboard() {
  const [api, setApi] = useState<ApiState>({ titleCase: null, mode: "demo", loading: true, error: null });
  const [preview, setPreview] = useState<CallPreview | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [calling, setCalling] = useState(false);
  const [scenario, setScenario] = useState<"standard" | "human-stop">("standard");

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/cases", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to load cases.");
      setApi({ titleCase: data.cases[0] ?? null, mode: data.mode, loading: false, error: null });
    } catch (error) {
      setApi((current) => ({ ...current, loading: false, error: error instanceof Error ? error.message : "Unable to load cases." }));
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const nextContact = useMemo(() => {
    if (!api.titleCase) return null;
    const id = api.titleCase.state === "READY_TO_CONTACT" ? "contact-auction"
      : api.titleCase.state === "READY_FOR_NEXT_CALL" ? "contact-lienholder" : null;
    return api.titleCase.contacts.find((item) => item.id === id) ?? null;
  }, [api.titleCase]);

  async function openPreview() {
    if (!api.titleCase || !nextContact) return;
    setApi((current) => ({ ...current, error: null }));
    const response = await fetch(`/api/cases/${api.titleCase.id}/calls/preview`, {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ contactId: nextContact.id }),
    });
    const data = await response.json();
    if (!response.ok) return setApi((current) => ({ ...current, error: data.error }));
    setConfirmed(false);
    setScenario("standard");
    setPreview(data.preview);
  }

  async function authorize() {
    if (!api.titleCase || !preview || !confirmed) return;
    setCalling(true);
    setApi((current) => ({ ...current, error: null }));
    try {
      const response = await fetch(`/api/cases/${api.titleCase.id}/calls/authorize`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contactId: preview.contactId, confirmed: true, previewFingerprint: preview.fingerprint, scenario }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to start call.");
      setApi((current) => ({ ...current, titleCase: data.titleCase }));
      setPreview(null);
      if (data.task.status === "queued" || data.task.status === "in_progress") void pollTask(data.task.id);
    } catch (error) {
      setApi((current) => ({ ...current, error: error instanceof Error ? error.message : "Unable to start call." }));
    } finally {
      setCalling(false);
    }
  }

  async function pollTask(taskId: string) {
    if (!api.titleCase) return;
    for (let attempt = 0; attempt < 60; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, attempt === 0 ? 5000 : 8000));
      const response = await fetch(`/api/cases/${api.titleCase.id}/calls/${taskId}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        setApi((current) => ({ ...current, error: data.error ?? "Unable to refresh call." }));
        return;
      }
      setApi((current) => ({ ...current, titleCase: data.titleCase }));
      if (data.task.status === "completed" || data.task.status === "failed") return;
    }
    setApi((current) => ({ ...current, error: "The call is still running. Refresh later; VINRelease will reuse the saved provider call ID." }));
  }

  async function reset() {
    if (!api.titleCase) return;
    const response = await fetch(`/api/cases/${api.titleCase.id}/reset`, { method: "POST" });
    const data = await response.json();
    if (response.ok) setApi((current) => ({ ...current, titleCase: data.case, error: null }));
  }

  if (api.loading) return <main className="loading-shell"><div className="loading-mark">VR</div><p>Opening the exception desk…</p></main>;
  if (!api.titleCase) return <main className="loading-shell"><p>{api.error ?? "No title cases found."}</p></main>;
  const titleCase = api.titleCase;
  const ageDays = Math.max(0, Math.floor((Date.now() - new Date(titleCase.expectedTitleDate).getTime()) / 86_400_000));
  const latestTransition = titleCase.transitions.at(-1)!;

  return (
    <main>
      <header className="topbar">
        <div className="brand"><div className="brand-mark">V</div><span>VINRelease</span></div>
        <div className="topbar-actions">
          <span className={`mode-pill ${api.mode}`}><span className="pulse" />{api.mode === "demo" ? "Safe demo" : "Live CALL-E"}</span>
          <button className="icon-button" onClick={reset} title="Reset demo"><ResetIcon /></button>
          <div className="avatar">NY</div>
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">TITLE OPERATIONS / EXCEPTION QUEUE</p>
          <h1>Software handles clean title transactions.<br /><span>VINRelease handles the ones that get stuck.</span></h1>
          <p className="hero-copy">One overdue vehicle. One verified next step. Every state change tied to phone evidence or a title clerk.</p>
        </div>
        <div className="queue-summary"><span className="summary-number">1</span><span>open exception</span><small>${titleCase.inventoryValue.toLocaleString()} inventory blocked</small></div>
      </section>

      {api.error && <div className="error-banner" role="alert">{api.error}</div>}

      <section className="workspace-grid">
        <aside className="queue-panel panel">
          <div className="panel-heading"><div><p className="eyebrow">ACTIVE QUEUE</p><h2>Title exceptions</h2></div><span className="count">01</span></div>
          <button className="case-row active">
            <div className="case-row-top"><span className="stock">#{titleCase.stockNumber}</span><span className={`status ${titleCase.state.toLowerCase()}`}>{stateLabels[titleCase.state]}</span></div>
            <strong>{titleCase.vehicle.year} {titleCase.vehicle.make} {titleCase.vehicle.model}</strong>
            <span>{titleCase.sourceOrganization} · VIN {titleCase.vehicle.vinLast6}</span>
            <div className="aging-line"><span>{ageDays} days overdue</span><span>${titleCase.inventoryValue.toLocaleString()} blocked</span></div>
          </button>
          <div className="queue-foot"><span><i className="dot amber" />Needs external answer</span><span><i className="dot blue" />In progress</span></div>
        </aside>

        <section className="case-panel panel">
          <div className="case-header">
            <div><p className="breadcrumb">TITLE EXCEPTIONS / STOCK {titleCase.stockNumber}</p><h2>{titleCase.vehicle.year} {titleCase.vehicle.make} {titleCase.vehicle.model}</h2><p className="case-meta">VIN {titleCase.vehicle.vinLast6} · Purchased {formatDate(titleCase.purchaseDate)} · From {titleCase.sourceOrganization}</p></div>
            <div className="age-block"><strong>{ageDays}</strong><span>days overdue</span></div>
          </div>

          <div className="signal-strip">
            <div><span>CURRENT BLOCKER</span><strong>{blockerLabel(titleCase.blocker)}</strong></div>
            <div><span>NEXT OWNER</span><strong>{titleCase.blockerOwner}</strong></div>
            <div><span>INVENTORY VALUE</span><strong>${titleCase.inventoryValue.toLocaleString()}</strong></div>
            <div><span>CALL EVIDENCE</span><strong>{titleCase.calls.length} record{titleCase.calls.length === 1 ? "" : "s"}</strong></div>
          </div>

          <div className="action-card">
            <div className="action-icon"><PhoneIcon size={22} /></div>
            <div className="action-copy">
              <p className="eyebrow">RECOMMENDED NEXT ACTION</p>
              <h3>{nextContact ? `Call ${nextContact.organization} ${nextContact.department.toLowerCase()}` : stateAction(titleCase.state)}</h3>
              <p>{nextContact ? "A governed CALL-E conversation can verify the next blocker without exposing credentials, payment data, or legal judgments." : titleCase.currentNote}</p>
            </div>
            {nextContact ? <button className="primary-button" onClick={openPreview}>Resolve next blocker <ArrowIcon /></button> : <div className={`final-state ${titleCase.state === "NEEDS_HUMAN" ? "human" : "waiting"}`}><ShieldIcon />{stateLabels[titleCase.state]}</div>}
          </div>

          <div className="detail-grid">
            <section className="timeline-section">
              <div className="section-title"><div><p className="eyebrow">EVIDENCE-BACKED HISTORY</p><h3>Resolution timeline</h3></div><span>{titleCase.transitions.length} transitions</span></div>
              <div className="timeline">
                {[...titleCase.transitions].reverse().map((transition, index) => (
                  <article className="timeline-item" key={transition.id}>
                    <div className={`timeline-node ${index === 0 ? "current" : ""}`}>{index === 0 ? "✓" : "·"}</div>
                    <div className="timeline-content">
                      <div className="timeline-top"><strong>{transition.label}</strong><time>{formatTime(transition.at)}</time></div>
                      <p>{transition.evidence}</p>
                      <div className="transition-chips"><span>{transition.from}</span><ArrowIcon size={13} /><span>{transition.to}</span></div>
                      {transition.callTaskId && <Evidence task={titleCase.calls.find((call) => call.id === transition.callTaskId)} />}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="proof-panel">
              <p className="eyebrow">CONTROL LAYER</p><h3>Why this state is trusted</h3>
              <ul className="proof-list">
                <li><ShieldIcon /><div><strong>Authorized contacts only</strong><span>No arbitrary phone entry exists.</span></div></li>
                <li><ShieldIcon /><div><strong>Minimum disclosure</strong><span>Six operational fields; credentials blocked.</span></div></li>
                <li><ShieldIcon /><div><strong>Typed evidence</strong><span>Unknown values cannot become progress.</span></div></li>
                <li><ShieldIcon /><div><strong>Conservative closure</strong><span>“Sent” never means “physically received.”</span></div></li>
              </ul>
              <div className="case-note"><span>LATEST CASE NOTE</span><p>{latestTransition.evidence}</p></div>
            </aside>
          </div>
        </section>
      </section>

      <footer><span>VINRelease / Northstar Motor Group</span><span>Built on CALL-E · Every action leaves evidence</span></footer>

      {preview && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreview(null); }}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="call-preview-title">
            <div className="modal-head"><div><p className="eyebrow">CALL AUTHORIZATION</p><h2 id="call-preview-title">Review before VINRelease calls</h2></div><button className="icon-button" aria-label="Close call preview" onClick={() => setPreview(null)}><CloseIcon /></button></div>
            <div className="target-card"><div className="action-icon"><PhoneIcon /></div><div><span>CALLING</span><strong>{preview.target}</strong><small>{preview.phoneDisplay}</small></div><span className="approved"><ShieldIcon size={14} /> Approved</span></div>
            <div className="preview-purpose"><span>PURPOSE</span><p>{preview.purpose}</p></div>
            <div className="preview-columns">
              <div><span className="column-label allowed">MAY DISCLOSE</span><ul>{preview.mayDisclose.map((item) => <li key={item}>{humanize(item)}</li>)}</ul></div>
              <div><span className="column-label blocked">WILL NOT PROVIDE</span><ul>{preview.prohibited.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </div>
            <div className="expected"><span>EXPECTED CASE MOVEMENT</span><strong>{preview.expectedTransition.replace("->", "→")}</strong></div>
            {api.mode === "demo" && <label className="scenario"><span>Demo outcome</span><select value={scenario} onChange={(event) => setScenario(event.target.value as typeof scenario)}><option value="standard">Verified operational result</option><option value="human-stop">Unsupported credential request</option></select></label>}
            <label className="confirm-row"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /><span>I authorize this specific call to this provisioned recipient using only the disclosure packet above.</span></label>
            <button className="authorize-button" disabled={!confirmed || calling} onClick={authorize}>{calling ? "Starting governed call…" : <><PhoneIcon /> Authorize & start {api.mode === "demo" ? "safe demo" : "live call"}</>}</button>
            <p className="modal-note"><ShieldIcon size={14} /> {api.mode === "demo" ? "Safe demo mode is active. No phone call can be placed." : "Live mode will place a real CALL-E call to this approved number."}</p>
          </section>
        </div>
      )}
    </main>
  );
}

function Evidence({ task }: { task: TitleCase["calls"][number] | undefined }) {
  if (!task) return null;
  return <details className="evidence"><summary>Phone evidence · {task.providerCallId}</summary><p>{task.summary}</p>{task.result?.reference_number && <strong>Reference {task.result.reference_number}</strong>}<small>Transcript reference: {task.transcriptReference}</small></details>;
}

function formatDate(value: string) { return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
function formatTime(value: string) { return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value)); }
function humanize(value: string) { return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function blockerLabel(value: TitleCase["blocker"]) { return value === "unknown" ? "Unknown — investigation required" : humanize(value); }
function stateAction(state: TitleCase["state"]) { return state === "WAITING_EXTERNAL" ? "Monitor receipt confirmation" : state === "NEEDS_HUMAN" ? "Title clerk review required" : stateLabels[state]; }
