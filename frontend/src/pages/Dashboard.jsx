import { useEffect, useMemo, useState } from 'react';
import PrimaryButton from '../components/PrimaryButton.jsx';
import Alert from '../components/Alert.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchSessions, generateReport } from '../services/reportApi.js';

function formatDateTime(value) {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '—';
  }
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed);
}

function formatMetric(value, suffix) {
  if (value === null || value === undefined) {
    return '—';
  }
  return `${value}${suffix || ''}`;
}

function StatTile({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {hint && <p className="mt-2 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [currentReport, setCurrentReport] = useState(null);
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadSessions() {
      setLoadingSessions(true);
      try {
        const payload = await fetchSessions(token);
        if (!isMounted) return;

        setSessions(payload.sessions || []);
        setSelectedSessionId((current) => current ?? payload.sessions?.[0]?.session_id ?? null);

        const seededRecent = (payload.sessions || [])
          .filter((session) => session.latestReport)
          .map((session) => ({
            sessionId: session.session_id,
            assessmentTitle: session.assessment_title,
            generatedAt: session.latestReport.generatedAt,
            fileUrl: session.latestReport.fileUrl,
            fileName: session.latestReport.fileName,
          }))
          .sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));

        setRecentReports(seededRecent);
      } catch (error) {
        if (!isMounted) return;
        setFeedback({
          type: 'error',
          message: error.response?.data?.message || 'Unable to load sessions. Please try again.',
        });
      } finally {
        if (isMounted) {
          setLoadingSessions(false);
        }
      }
    }

    loadSessions();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const selectedSession = useMemo(
    () => sessions.find((session) => session.session_id === selectedSessionId) || null,
    [sessions, selectedSessionId],
  );

  useEffect(() => {
    if (!selectedSession) {
      setCurrentReport(null);
      return;
    }

    const latest = selectedSession.latestReport;
    if (!latest) {
      setCurrentReport((existing) => {
        if (existing?.session?.session_id === selectedSession.session_id) {
          return existing;
        }
        return null;
      });
      return;
    }

    setCurrentReport((existing) => {
      if (existing?.fileName === latest.fileName) {
        return existing;
      }
      return {
        session: selectedSession,
        fileUrl: latest.fileUrl,
        fileName: latest.fileName,
        generatedAt: latest.generatedAt,
      };
    });
  }, [selectedSession]);

  const handleGenerateReport = async () => {
    if (!selectedSession) {
      setFeedback({ type: 'error', message: 'Please choose a session to generate the report.' });
      return;
    }

    setReportLoading(true);
    setFeedback(null);

    try {
      const response = await generateReport(selectedSession.session_id, token);
      const generatedAt = new Date().toISOString();

      const latestReport = {
        fileName: response.fileName,
        generatedAt,
        fileUrl: response.fileUrl,
      };

      setSessions((previous) =>
        previous.map((session) =>
          session.session_id === selectedSession.session_id
            ? { ...session, latestReport }
            : session,
        ),
      );

      setCurrentReport({
        session: selectedSession,
        fileUrl: response.fileUrl,
        fileName: response.fileName,
        generatedAt,
      });

      setRecentReports((prev) => {
        const updated = [
          {
            sessionId: selectedSession.session_id,
            assessmentTitle: selectedSession.assessment_title,
            generatedAt,
            fileUrl: response.fileUrl,
            fileName: response.fileName,
          },
          ...prev,
        ];
        return updated.slice(0, 5);
      });

      setFeedback({
        type: 'success',
        message: 'Report generated successfully. Preview the PDF below or open it in a new tab.',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.response?.data?.message || 'Failed to generate the report. Please try again.',
      });
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Assessment console</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Assessment Management Workspace</h1>
            <p className="mt-1 text-sm text-slate-400">Review stored sessions, generate tailored PDFs, and preview the final report instantly.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-slate-500"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-white">Available sessions</h2>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">{sessions.length}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                Choose an existing scan session to inspect its context and generate a PDF report from the configured template.
              </p>

              <div className="mt-5 space-y-3">
                {loadingSessions && <p className="text-sm text-slate-400">Loading sessions…</p>}
                {!loadingSessions && sessions.length === 0 && (
                  <p className="text-sm text-slate-400">No sessions available yet. Add assessment data to the dataset to get started.</p>
                )}
                {!loadingSessions &&
                  sessions.map((session) => {
                    const isSelected = session.session_id === selectedSessionId;
                    return (
                      <button
                        key={session.session_id}
                        type="button"
                        onClick={() => {
                          setSelectedSessionId(session.session_id);
                          setFeedback(null);
                        }}
                        className={`w-full rounded-2xl border px-4 py-3 text-left ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-white'
                            : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <p className="text-sm font-semibold text-white">{session.assessment_title}</p>
                        <p className="text-xs text-slate-400">Session ID · {session.session_id}</p>
                        {session.latestReport ? (
                          <p className="mt-2 text-xs text-slate-400">Last PDF · {formatDateTime(session.latestReport.generatedAt)}</p>
                        ) : (
                          <p className="mt-2 text-xs text-slate-500">PDF not generated yet</p>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Recent reports</h3>
              {recentReports.length === 0 ? (
                <p className="mt-4 text-sm text-slate-400">Generate a report to see it appear here.</p>
              ) : (
                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                  {recentReports.map((report) => (
                    <li key={`${report.fileName}`}
                        className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                      <p className="font-medium text-white">{report.assessmentTitle}</p>
                      <p className="text-xs text-slate-400">Session {report.sessionId}</p>
                      <p className="mt-1 text-xs text-slate-500">Generated {formatDateTime(report.generatedAt)}</p>
                      <a
                        className="mt-2 inline-flex text-xs font-medium text-primary"
                        href={report.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open PDF
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
            {selectedSession ? (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{selectedSession.assessment_title}</h2>
                    {selectedSession.summary && <p className="mt-2 max-w-2xl text-sm text-slate-300">{selectedSession.summary}</p>}
                    <div className="mt-4 grid gap-4 text-sm text-slate-400 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Session</p>
                        <p className="mt-1 font-medium text-white">{selectedSession.session_id}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Assessment ID</p>
                        <p className="mt-1 font-medium text-white">{selectedSession.assessment_id}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Recorded</p>
                        <p className="mt-1 font-medium text-white">{formatDateTime(selectedSession.recorded_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Last PDF</p>
                        <p className="mt-1 font-medium text-white">
                          {selectedSession.latestReport ? formatDateTime(selectedSession.latestReport.generatedAt) : 'Not generated'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-4">
                    <PrimaryButton
                      type="button"
                      className="w-auto px-6"
                      onClick={handleGenerateReport}
                      disabled={reportLoading}
                    >
                      {reportLoading ? 'Generating report…' : 'Generate PDF report'}
                    </PrimaryButton>
                    <p className="text-xs text-slate-500">
                      Reports are saved under <code>backend/reports</code> and are accessible from the links provided below.
                    </p>
                  </div>
                </div>

                {feedback && <Alert type={feedback.type} message={feedback.message} onClose={() => setFeedback(null)} />}

                <div className="grid gap-4 sm:grid-cols-3">
                  <StatTile
                    label="Overall accuracy"
                    value={formatMetric(selectedSession.metrics?.accuracy, '%')}
                    hint="Captured directly from the stored assessment snapshot."
                  />
                  <StatTile
                    label="Wellness score"
                    value={formatMetric(selectedSession.metrics?.wellness_score)}
                    hint="Provided by the vitals provider for the session."
                  />
                  <StatTile
                    label="Heart rate"
                    value={formatMetric(selectedSession.metrics?.heart_rate, ' bpm')}
                    hint="Resting or active rate at the time of recording."
                  />
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
                  <h3 className="text-lg font-semibold text-white">Report preview</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {currentReport?.generatedAt
                      ? `Rendered ${formatDateTime(currentReport.generatedAt)}. Open the full PDF in a separate tab if you prefer a larger view.`
                      : 'Generate a report to preview it right here without leaving the dashboard.'}
                  </p>

                  {currentReport?.fileUrl ? (
                    <div className="mt-4 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
                        <div>
                          <p className="font-medium text-white">{currentReport.fileName}</p>
                          <p className="text-xs text-slate-500">Session {currentReport.session?.session_id}</p>
                        </div>
                        <a
                          href={currentReport.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-primary px-4 py-2 text-xs font-semibold text-primary"
                        >
                          Open full PDF
                        </a>
                      </div>
                      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black/60">
                        <iframe
                          title={`Preview for ${currentReport.fileName}`}
                          src={currentReport.fileUrl}
                          className="h-[480px] w-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center text-sm text-slate-400">
                      No PDF available yet. Generate one to see a live preview.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[480px] flex-col items-center justify-center text-center text-slate-400">
                <p className="text-lg font-semibold text-white">Select a session to begin</p>
                <p className="mt-2 max-w-md text-sm">
                  Pick a session from the list on the left to review its metrics and generate a PDF report tailored to that assessment type.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
