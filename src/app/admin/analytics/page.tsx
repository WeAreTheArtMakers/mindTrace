'use client';

import { useState } from 'react';

interface AnalyticsData {
  total: number;
  todayEvents: number;
  eventCounts: { name: string; count: number }[];
  topPages: { path: string; count: number }[];
  weeklyTrend: { date: string; count: number }[];
  recentEvents: { name: string; path: string; time: string }[];
}

export default function AnalyticsPage() {
  const [secret, setSecret] = useState('');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    if (!secret) return;
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/analytics?secret=${encodeURIComponent(secret)}`);
      if (!res.ok) {
        setError('Yetkisiz erişim - şifre yanlış');
        setData(null);
      } else {
        const json = await res.json();
        setData(json);
      }
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleString('tr-TR', { 
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    });
  };

  const eventNameMap: Record<string, string> = {
    page_view: '📄 Sayfa Görüntüleme',
    trace_view: '👁️ Trace Görüntüleme',
    trace_create: '✏️ Trace Oluşturma',
    trace_resonate: '💭 Resonate',
    share_click: '🔗 Paylaşım',
    language_change: '🌐 Dil Değişikliği',
    theme_change: '🎨 Tema Değişikliği',
    search: '🔍 Arama',
    install_prompt_shown: '📱 Kurulum Bildirimi',
    install_prompt_dismissed: '❌ Kurulum Reddi',
  };

  const getPageName = (path: string) => {
    if (path === '/') return 'Ana Sayfa';
    if (path === '/new') return 'Yeni Trace';
    if (path.startsWith('/trace/')) return `Trace: ${path.split('/')[2].substring(0, 12)}...`;
    return path;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#4fd1c5]">📊 MindTrace Analytics</h1>
        
        {!data && (
          <div className="bg-neutral-900 rounded-lg p-6 mb-6">
            <label className="block text-sm text-neutral-400 mb-2">Admin Şifresi</label>
            <div className="flex gap-3">
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchAnalytics()}
                placeholder="ANALYTICS_SECRET"
                className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4fd1c5]"
              />
              <button
                onClick={fetchAnalytics}
                disabled={loading || !secret}
                className="px-6 py-2 bg-[#4fd1c5] text-neutral-900 font-medium rounded-lg hover:bg-[#81e6d9] disabled:opacity-50"
              >
                {loading ? 'Yükleniyor...' : 'Giriş'}
              </button>
            </div>
            {error && <p className="text-red-400 mt-3">{error}</p>}
          </div>
        )}

        {data && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-neutral-900 rounded-lg p-4">
                <p className="text-neutral-400 text-sm">Toplam Event</p>
                <p className="text-3xl font-bold text-[#4fd1c5]">{data.total}</p>
              </div>
              <div className="bg-neutral-900 rounded-lg p-4">
                <p className="text-neutral-400 text-sm">Bugün</p>
                <p className="text-3xl font-bold text-green-400">{data.todayEvents}</p>
              </div>
              <div className="bg-neutral-900 rounded-lg p-4">
                <p className="text-neutral-400 text-sm">Sayfa Görüntüleme</p>
                <p className="text-3xl font-bold text-blue-400">
                  {data.eventCounts.find(e => e.name === 'page_view')?.count || 0}
                </p>
              </div>
              <div className="bg-neutral-900 rounded-lg p-4">
                <p className="text-neutral-400 text-sm">Farklı Sayfa</p>
                <p className="text-3xl font-bold text-purple-400">{data.topPages.length}</p>
              </div>
            </div>

            {/* Weekly Trend */}
            <div className="bg-neutral-900 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold mb-4">📈 Son 7 Gün</h2>
              <div className="flex items-end gap-2 h-32">
                {data.weeklyTrend.map((day, i) => {
                  const maxCount = Math.max(...data.weeklyTrend.map(d => d.count), 1);
                  const height = (day.count / maxCount) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <span className="text-xs text-neutral-400 mb-1">{day.count}</span>
                      <div 
                        className="w-full bg-[#4fd1c5] rounded-t"
                        style={{ height: `${Math.max(height, 4)}%` }}
                      />
                      <span className="text-xs text-neutral-500 mt-1">{formatDate(day.date)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Event Types */}
              <div className="bg-neutral-900 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">🎯 Event Türleri</h2>
                <div className="space-y-2">
                  {data.eventCounts.map((event, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-sm">{eventNameMap[event.name] || event.name}</span>
                      <span className="text-[#4fd1c5] font-medium">{event.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Pages */}
              <div className="bg-neutral-900 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">🔥 Popüler Sayfalar</h2>
                <div className="space-y-2">
                  {data.topPages.slice(0, 10).map((page, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-sm truncate flex-1 mr-2">{getPageName(page.path)}</span>
                      <span className="text-[#4fd1c5] font-medium">{page.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Events */}
            <div className="bg-neutral-900 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">🕐 Son Aktiviteler</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {data.recentEvents.map((event, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm py-1 border-b border-neutral-800 last:border-0">
                    <span className="text-neutral-500 text-xs w-28">{formatTime(event.time)}</span>
                    <span className="flex-1">{eventNameMap[event.name] || event.name}</span>
                    <span className="text-neutral-400 truncate max-w-32">{getPageName(event.path)}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setData(null)}
              className="mt-6 text-neutral-400 hover:text-white text-sm"
            >
              ← Çıkış
            </button>
          </>
        )}
      </div>
    </div>
  );
}
