"use client"
//chatgpt
import React, { useEffect, useState, useRef } from "react";

// EmailCampaignDashboard.tsx
// Single-file React + TypeScript component using Tailwind CSS classes.
// Drop into a React + Tailwind project. Uses simple fetch calls (you can wire to your backend endpoints).

type User = {
  id: string;
  name: string;
  email: string;
  industry: string;
  noOfEmailSent: number;
  userStatus: boolean;
};

export default function EmailCampaignDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);

  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [notEmailedCount, setNotEmailedCount] = useState<number | null>(null);

  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [emailsSentFilter, setEmailsSentFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Credentials management
  const [credentialId, setCredentialId] = useState("");
  const [selectedCredentialIds, setSelectedCredentialIds] = useState<string[]>([]);

  // Send email form
  const [subject, setSubject] = useState("");
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);

  // Logs & progress
  const [logs, setLogs] = useState<string[]>([]);
  const [sentSuccess, setSentSuccess] = useState(0);
  const [sentFailed, setSentFailed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // on mount: load users (mock fallback if endpoint not available)
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, industryFilter, statusFilter, emailsSentFilter, sortBy, sortDir]);

  // --- Data fetching (replace endpoints with your API) ---
  async function fetchUsers() {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("no api");
      const data = (await res.json()) as User[];
      setUsers(data);
    } catch (e) {
      // fallback mock data
      const mock: User[] = [
        { id: "1", name: "Alice", email: "alice@example.com", industry: "Retail", noOfEmailSent: 0, userStatus: true },
        { id: "2", name: "Bob", email: "bob@example.com", industry: "Finance", noOfEmailSent: 3, userStatus: false },
        { id: "3", name: "Carol", email: "carol@example.com", industry: "Retail", noOfEmailSent: 1, userStatus: true },
      ];
      setUsers(mock);
    }
  }

  async function fetchTotalUsers() {
    try {
      const res = await fetch("/api/users/count");
      const json = await res.json();
      setTotalUsers(json.count);
    } catch (e) {
      setTotalUsers(users.length);
    }
  }

  async function fetchNotEmailedCount() {
    try {
      const res = await fetch("/api/users/not-emailed/count");
      const json = await res.json();
      setNotEmailedCount(json.count);
    } catch (e) {
      setNotEmailedCount(users.filter((u) => u.noOfEmailSent === 0).length);
    }
  }

  // --- Filters & sorting ---
  function applyFilters() {
    let out = [...users];
    if (industryFilter !== "all") out = out.filter((u) => u.industry === industryFilter);
    if (statusFilter !== "all") out = out.filter((u) => String(u.userStatus) === statusFilter);
    if (emailsSentFilter !== "all") {
      if (emailsSentFilter === "0") out = out.filter((u) => u.noOfEmailSent === 0);
      if (emailsSentFilter === "1+") out = out.filter((u) => u.noOfEmailSent >= 1 && u.noOfEmailSent < 5);
      if (emailsSentFilter === "5+") out = out.filter((u) => u.noOfEmailSent >= 5);
    }
    out.sort((a, b) => {
      const valA = (a as any)[sortBy];
      const valB = (b as any)[sortBy];
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    setFiltered(out);
  }

  // --- Credential management (placeholders) ---
  async function deleteCredentialById(id: string) {
    if (!id) return setLogs((l) => ["No ID provided for delete", ...l]);
    try {
      await fetch(`/api/credentials/${id}`, { method: "DELETE" });
      setLogs((l) => [`Deleted credential ${id}`, ...l]);
      // refresh
    } catch (e) {
      setLogs((l) => [`Failed to delete ${id} (mock)`, ...l]);
    }
  }

  async function deleteMultipleCredentials(ids: string[]) {
    if (!ids.length) return setLogs((l) => ["No IDs selected", ...l]);
    try {
      await fetch(`/api/credentials`, { method: "DELETE", body: JSON.stringify({ ids }) });
      setLogs((l) => [`Deleted credentials ${ids.join(",")}`, ...l]);
    } catch (e) {
      setLogs((l) => [`Failed to delete multiple credentials (mock)`, ...l]);
    }
  }

  async function deleteAllCredentials() {
    try {
      await fetch(`/api/credentials/all`, { method: "DELETE" });
      setLogs((l) => ["All credentials deleted (mock)", ...l]);
    } catch (e) {
      setLogs((l) => ["Failed to delete all credentials (mock)", ...l]);
    }
  }

  // --- Send emails ---
  function handleAttachmentChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setAttachments(Array.from(e.target.files));
  }

  async function sendEmails(selectedUsers: User[] = filtered) {
    if (!subject) return setLogs((l) => ["Subject required", ...l]);
    setSending(true);
    setProgress(0);
    setSentSuccess(0);
    setSentFailed(0);
    setLogs((l) => [`Starting send to ${selectedUsers.length} users`, ...l]);

    const total = selectedUsers.length;
    for (let i = 0; i < total; i++) {
      const user = selectedUsers[i];
      // simulate network send with small delay and random failure
      await new Promise((r) => setTimeout(r, 400));
      const outcome = Math.random() > 0.12; // 88% success
      if (outcome) {
        setSentSuccess((s) => s + 1);
        setLogs((l) => [`Sent to ${user.email}`, ...l]);
      } else {
        setSentFailed((f) => f + 1);
        setLogs((l) => [`Failed to send to ${user.email}`, ...l]);
      }
      setProgress(Math.round(((i + 1) / total) * 100));
    }

    setSending(false);
    setLogs((l) => [`Send complete. ${sentSuccess + 0} success, ${sentFailed + 0} failed`, ...l]);
  }

  // --- Selection helpers ---
  function toggleSelectCredential(id: string) {
    setSelectedCredentialIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Campaigns</h2>
          <nav className="flex flex-col gap-2 text-sm">
            {[
              ["Dashboard", "/"],
              ["Users", "/users"],
              ["SMTP Credentials", "/credentials"],
              ["Logs", "/logs"],
              ["Settings", "/settings"],
            ].map(([label]) => (
              <a key={label as string} className="p-2 rounded-lg hover:bg-gray-100">{label}</a>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 space-y-6">
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Email Campaign Dashboard</h1>
            <div className="flex gap-3">
              <button
                onClick={fetchTotalUsers}
                className="px-3 py-2 bg-white border rounded-lg shadow-sm text-sm"
              >
                Fetch Total Users
              </button>
              <button
                onClick={fetchNotEmailedCount}
                className="px-3 py-2 bg-white border rounded-lg shadow-sm text-sm"
              >
                Fetch Not-Emailed Count
              </button>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">Total users</p>
              <div className="text-3xl font-semibold mt-2">{totalUsers ?? "-"}</div>
            </div>
            <div className="col-span-1 bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">Not emailed</p>
              <div className="text-3xl font-semibold mt-2">{notEmailedCount ?? "-"}</div>
            </div>
            <div className="col-span-1 bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">Send progress</p>
              <div className="mt-2">
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="h-3 rounded-full" style={{ width: `${progress}%`, background: "linear-gradient(90deg,#10b981,#34d399)" }} />
                </div>
                <div className="text-sm mt-2">{progress}%</div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Users list + filters */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Users</h3>
                <div className="flex gap-2 items-center">
                  <select className="input" value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)}>
                    <option value="all">All industries</option>
                    <option value="Retail">Retail</option>
                    <option value="Finance">Finance</option>
                    <option value="Tech">Tech</option>
                  </select>
                  <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                  <select className="input" value={emailsSentFilter} onChange={(e) => setEmailsSentFilter(e.target.value)}>
                    <option value="all">Any emails sent</option>
                    <option value="0">0 sent</option>
                    <option value="1+">1 - 4</option>
                    <option value="5+">5+</option>
                  </select>

                  <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="name">Sort: Name</option>
                    <option value="noOfEmailSent">Sort: Emails sent</option>
                    <option value="industry">Sort: Industry</option>
                  </select>
                  <button className="px-3 py-2 bg-white border rounded-lg" onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}>
                    {sortDir === "asc" ? "Asc" : "Desc"}
                  </button>
                </div>
              </div>

              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-2">Name</th>
                      <th>Email</th>
                      <th>Industry</th>
                      <th>Sent</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u) => (
                      <tr key={u.id} className="border-b">
                        <td className="py-2">{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.industry}</td>
                        <td>{u.noOfEmailSent}</td>
                        <td>{u.userStatus ? "Active" : "Inactive"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right column: Credential management + Send form */}
            <aside className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
              <div>
                <h4 className="font-semibold">Credential Management</h4>
                <div className="mt-2 flex flex-col gap-2">
                  <input value={credentialId} onChange={(e) => setCredentialId(e.target.value)} placeholder="Credential ID" className="input" />
                  <div className="flex gap-2">
                    <button className="btn" onClick={() => deleteCredentialById(credentialId)}>
                      Delete by ID
                    </button>
                    <button className="btn" onClick={() => deleteMultipleCredentials(selectedCredentialIds)}>
                      Delete Selected
                    </button>
                    <button className="btn-ghost" onClick={deleteAllCredentials}>
                      Delete All
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold">Send Emails</h4>
                <div className="mt-2 flex flex-col gap-2">
                  <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="input" />
                  <div className="text-sm text-gray-500">Body (rich text)</div>
                  <div
                    ref={contentRef}
                    contentEditable
                    role="textbox"
                    suppressContentEditableWarning
                    className="border rounded-md p-2 min-h-[120px] bg-white text-sm"
                  />

                  <input type="file" multiple onChange={handleAttachmentChange} className="text-sm" />

                  <button
                    className="mt-2 px-3 py-2 bg-green-600 text-white rounded-lg"
                    onClick={() => {
                      const body = contentRef.current?.innerHTML || "";
                      // include attachments and form data when wiring to a real backend
                      // For now we simulate send to filtered users
                      setLogs((l) => [`Queued send: ${subject}`, ...l]);
                      sendEmails(filtered);
                    }}
                    disabled={sending}
                  >
                    {sending ? "Sending..." : "Send Emails"}
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold">Send Status</h4>
                <div className="mt-2 text-sm">
                  <div>Success: {sentSuccess}</div>
                  <div>Failed: {sentFailed}</div>
                  <div className="text-xs text-gray-500 mt-2">Progress updates appear below.</div>
                </div>
              </div>
            </aside>
          </section>

          <section className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold">Logs & Activity</h3>
            <div className="mt-3 h-40 overflow-auto text-sm bg-gray-50 p-3 rounded-md">
              {logs.length === 0 ? <div className="text-gray-400">No logs yet.</div> : null}
              <ul className="space-y-1">
                {logs.map((l, i) => (
                  <li key={i} className="text-xs">{l}</li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      </div>

      {/* simple style helpers for this single-file example */}
      <style jsx>{`
        .input { padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #e6e6e6; background: white; }
        .btn { padding: 0.5rem 0.75rem; border-radius: 0.5rem; background: #ef4444; color: white; }
        .btn-ghost { padding: 0.5rem 0.75rem; border-radius: 0.5rem; background: transparent; color: #ef4444; border: 1px dashed #fca5a5; }
      `}</style>
    </div>
  );
}
