'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Phone,
  Clock,
  AlertCircle,
  Send,
} from 'lucide-react';
import { WhatsAppLog } from '@/types';
import { formatDate } from '@/lib/utils';

export default function WhatsAppLogsPage() {
  const [logs, setLogs] = useState<WhatsAppLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/whatsapp');
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Error fetching WhatsApp logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRetry = async (logId: string) => {
    setRetryingId(logId);
    try {
      const res = await fetch('/api/admin/whatsapp/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Retry request dispatched successfully.');
        fetchLogs();
      } else {
        alert(data.error || 'Retry failed.');
      }
    } catch (err: any) {
      alert(`Retry exception: ${err.message}`);
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            Meta WhatsApp Cloud API Audit Trail
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">WhatsApp Notification Logs</h1>
          <p className="text-xs text-slate-400">
            Real-time delivery verification, message IDs, failure diagnostics, and transmission retries.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchLogs} className="text-xs gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Audit Trail
        </Button>
      </div>

      {/* Meta API Configuration Status Card */}
      <Card className="border-indigo-500/20 bg-indigo-950/10">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-indigo-300 block">WhatsApp Cloud API Gateway</span>
            <p className="text-slate-400">
              Dispatches authenticated templates: <code>project_submission_success</code>, <code>project_shortlisted</code>, and <code>project_not_shortlisted</code>.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              API Operational
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Message Type</th>
                <th className="px-5 py-3.5 font-semibold">Associated Team</th>
                <th className="px-5 py-3.5 font-semibold">Recipient WhatsApp</th>
                <th className="px-5 py-3.5 font-semibold">Delivery Status</th>
                <th className="px-5 py-3.5 font-semibold">Provider Message ID / Diagnostics</th>
                <th className="px-5 py-3.5 font-semibold">Dispatched At</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading transmission logs...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No WhatsApp notifications logged yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isSent = log.message_status === 'sent';
                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3.5 whitespace-nowrap font-medium text-white">
                        <span className="capitalize">
                          {log.message_type.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap font-semibold text-indigo-300">
                        {log.teams?.team_name || '—'}
                      </td>

                      <td className="px-5 py-3.5 font-mono text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-500" />
                          {log.phone_number}
                        </div>
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {isSent ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3 h-3" />
                            Sent
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold text-[11px]">
                            <XCircle className="w-3 h-3" />
                            Failed
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 max-w-xs truncate text-[11px] font-mono text-slate-400">
                        {isSent ? (
                          <span className="text-slate-400">{log.provider_message_id || 'wamid.ack'}</span>
                        ) : (
                          <span className="text-rose-400">{log.error_message || 'Delivery error'}</span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap text-slate-400 text-[11px]">
                        {formatDate(log.sent_at)}
                      </td>

                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        {!isSent ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRetry(log.id)}
                            isLoading={retryingId === log.id}
                            className="text-xs h-7 px-2.5 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                          >
                            <Send className="w-3 h-3 mr-1" />
                            Retry
                          </Button>
                        ) : (
                          <span className="text-slate-600 text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
