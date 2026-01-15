'use client';

import { useState } from 'react';

interface AnalyticsData {
  total: number;
  todayEvents: number;
  eventCounts: { name: string; count: number }[];
  topPages: { path: string; count: number }[];
  weeklyTrend: { date: string; count: number }[];
  recentEvents: { name: string; path: string; time: string; properties?: { device?: string; browser?: string; [key: string]: string | number | boolean | undefined } }[];
  devices: { device: string; count: number }[];
  browsers: { browser: string; count: number }[];
  avgTimeOnPage: { path: string; avgDuration: number; visits: number }[];
  languages: { lang: string; count: number }[];
}

export default function AnalyticsPage() {
  const [secret, setSecret] = useState('');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'pages' | 'devices' | 'activity'>('overview');

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
        setData(await res.json());
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
    return date.toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const eventNameMap: Record<string, string> = {
    page_view: '📄 Sayfa Görüntüleme',
    page_leave: '👋 Sayfa Çıkış',
    trace_view: '👁️ Trace Görüntüleme',
    trace_create: '✏️ Trace Oluşturma',
    trace_resonate: '💭 Resonate',
    share_click: '🔗 Paylaşım',
    language_change: '🌐 Dil Değişikliği',
    theme_change: '🎨 Tema Değişikliği',
    search: '🔍 Arama',
  };

  const deviceIcons: Record<string, string> = {
    desktop: '🖥️',
    mobile: '📱',
    tablet: '📱',
  };

  const browserIcons: Record<string, string> = {
    chrome: '🌐',
    safari: '🧭',
    firefox: '🦊',
    edge: '🌊',
    other: '🔍',
  };

  const getPageName = (path: string) => {
    if (path === '/') return 'Ana Sayfa';
    if (path === '/new') return 'Yeni Trace';
    if (path?.startsWith('/trace/')) return `Trace`;
    return path || 'Bilinmiyor';
  };

  const getLanguageName = (code: string) => {
    const langs: Record<string, string> = {
      'tr': '🇹🇷 Türkçe', 'tr-TR': '🇹🇷 Türkçe',
      'en': '🇬🇧 English', 'en-US': '🇺🇸 English', 'en-GB': '🇬🇧 English',
      'de': '🇩🇪 Deutsch', 'de-DE': '🇩🇪 Deutsch',
      'fr': '🇫🇷 Français', 'fr-FR': '🇫🇷 Français',
      'ar': '🇸🇦 العربية',
      'ja': '🇯🇵 日本語',
      'zh': '🇨🇳 中文', 'zh-CN': '🇨🇳 中文',
      'hi': '🇮🇳 हिन्दी',
      'it': '🇮🇹 Italiano',
    };
    return langs[code] || `🌐 ${code}`;
  };

  // Calculate percentages for pie charts
  const getPercentage = (count: number, total: number) => Math.round((count / total) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#4fd1c5] to-[#81e6d9] bg-clip-text text-transparent">
              📊 MindTrace Analytics
            </h1>
            <p className="text-neutral-400 text-sm mt-1">Detaylı kullanıcı istatistikleri</p>
          </div>
          {data && (
            <a
              href="https://clarity.microsoft.com/projects/view/v1v034kh6t/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              🔥 Clarity Heatmaps
            </a>
          )}
        </div>
        
        {/* Login Form */}
        {!data && (
          <div className="bg-neutral-900/50 backdrop-blur rounded-2xl p-8 max-w-md mx-auto border border-neutral-800">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#4fd1c5] to-[#0d9488] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔐</span>
              </div>
              <h2 className="text-xl font-semibold">Admin Girişi</h2>
              <p className="text-neutral-400 text-sm mt-1">Analytics verilerini görüntülemek için giriş yapın</p>
            </div>
            <div className="space-y-4">
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchAnalytics()}
                placeholder="Admin şifresi"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4fd1c5] focus:border-transparent transition-all"
              />
              <button
                onClick={fetchAnalytics}
                disabled={loading || !secret}
                className="w-full py-3 bg-gradient-to-r from-[#4fd1c5] to-[#0d9488] text-neutral-900 font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {loading ? '⏳ Yükleniyor...' : '🚀 Giriş Yap'}
              </button>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                {error}
              </div>
            )}
          </div>
        )}

        {data && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-[#4fd1c5]/20 to-[#4fd1c5]/5 rounded-2xl p-5 border border-[#4fd1c5]/20">
                <p className="text-[#4fd1c5] text-sm font-medium">Toplam Event</p>
                <p className="text-4xl font-bold mt-2">{data.total.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-2xl p-5 border border-green-500/20">
                <p className="text-green-400 text-sm font-medium">Bugün</p>
                <p className="text-4xl font-bold mt-2">{data.todayEvents.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-2xl p-5 border border-blue-500/20">
                <p className="text-blue-400 text-sm font-medium">Sayfa Görüntüleme</p>
                <p className="text-4xl font-bold mt-2">
                  {(data.eventCounts.find(e => e.name === 'page_view')?.count || 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-2xl p-5 border border-purple-500/20">
                <p className="text-purple-400 text-sm font-medium">Farklı Sayfa</p>
                <p className="text-4xl font-bold mt-2">{data.topPages.length}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {(['overview', 'pages', 'devices', 'activity'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? 'bg-[#4fd1c5] text-neutral-900'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {tab === 'overview' && '📈 Genel Bakış'}
                  {tab === 'pages' && '📄 Sayfalar'}
                  {tab === 'devices' && '📱 Cihazlar'}
                  {tab === 'activity' && '🕐 Aktivite'}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Weekly Trend Chart */}
                <div className="bg-neutral-900/50 backdrop-blur rounded-2xl p-6 border border-neutral-800">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    📈 Son 7 Gün Trendi
                  </h2>
                  <div className="flex items-end gap-2 h-40">
                    {data.weeklyTrend.length === 0 ? (
                      <p className="text-neutral-500 w-full text-center py-8">Henüz veri yok</p>
                    ) : (
                      data.weeklyTrend.map((day, i) => {
                        const maxCount = Math.max(...data.weeklyTrend.map(d => d.count), 1);
                        const height = (day.count / maxCount) * 100;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center group">
                            <div className="relative w-full">
                              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#4fd1c5] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                {day.count}
                              </span>
                            </div>
                            <div 
                              className="w-full bg-gradient-to-t from-[#4fd1c5] to-[#81e6d9] rounded-t-lg transition-all group-hover:opacity-80"
                              style={{ height: `${Math.max(height, 8)}%` }}
                            />
                            <span className="text-xs text-neutral-500 mt-2">{formatDate(day.date)}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Event Types & Languages */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-neutral-900/50 backdrop-blur rounded-2xl p-6 border border-neutral-800">
                    <h2 className="text-lg font-semibold mb-4">🎯 Event Türleri</h2>
                    <div className="space-y-3">
                      {data.eventCounts.slice(0, 8).map((event, i) => {
                        const percentage = getPercentage(event.count, data.total);
                        return (
                          <div key={i}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">{eventNameMap[event.name] || event.name}</span>
                              <span className="text-[#4fd1c5] font-medium text-sm">{event.count}</span>
                            </div>
                            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#4fd1c5] to-[#81e6d9] rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-neutral-900/50 backdrop-blur rounded-2xl p-6 border border-neutral-800">
                    <h2 className="text-lg font-semibold mb-4">🌍 Diller</h2>
                    {data.languages.length === 0 ? (
                      <p className="text-neutral-500 text-center py-4">Henüz veri yok</p>
                    ) : (
                      <div className="space-y-3">
                        {data.languages.slice(0, 8).map((lang, i) => {
                          const totalLang = data.languages.reduce((a, b) => a + b.count, 0);
                          const percentage = getPercentage(lang.count, totalLang);
                          return (
                            <div key={i}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm">{getLanguageName(lang.lang)}</span>
                                <span className="text-purple-400 font-medium text-sm">{percentage}%</span>
                              </div>
                              <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Pages Tab */}
            {activeTab === 'pages' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Top Pages */}
                  <div className="bg-neutral-900/50 backdrop-blur rounded-2xl p-6 border border-neutral-800">
                    <h2 className="text-lg font-semibold mb-4">🔥 En Çok Ziyaret Edilen</h2>
                    <div className="space-y-2">
                      {data.topPages.slice(0, 10).map((page, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-neutral-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '📄'}</span>
                            <span className="text-sm">{getPageName(page.path)}</span>
                          </div>
                          <span className="text-[#4fd1c5] font-bold">{page.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Time on Page */}
                  <div className="bg-neutral-900/50 backdrop-blur rounded-2xl p-6 border border-neutral-800">
                    <h2 className="text-lg font-semibold mb-4">⏱️ Ortalama Kalma Süresi</h2>
                    {data.avgTimeOnPage.length === 0 ? (
                      <p className="text-neutral-500 text-center py-8">Henüz veri yok</p>
                    ) : (
                      <div className="space-y-2">
                        {data.avgTimeOnPage.map((page, i) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-neutral-800/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">⏱️</span>
                              <span className="text-sm">{getPageName(page.path)}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-green-400 font-bold">{formatDuration(page.avgDuration)}</span>
                              <span className="text-neutral-500 text-xs ml-2">({page.visits} ziyaret)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Devices Tab */}
            {activeTab === 'devices' && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Device Distribution */}
                <div className="bg-neutral-900/50 backdrop-blur rounded-2xl p-6 border border-neutral-800">
                  <h2 className="text-lg font-semibold mb-4">📱 Cihaz Dağılımı</h2>
                  {data.devices.length === 0 ? (
                    <p className="text-neutral-500 text-center py-8">Henüz veri yok</p>
                  ) : (
                    <>
                      <div className="flex justify-center gap-4 mb-6">
                        {data.devices.map((d, i) => {
                          const total = data.devices.reduce((a, b) => a + b.count, 0);
                          const percentage = getPercentage(d.count, total);
                          const colors = ['from-[#4fd1c5] to-[#0d9488]', 'from-blue-500 to-blue-600', 'from-purple-500 to-purple-600'];
                          return (
                            <div key={i} className="text-center">
                              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colors[i % 3]} flex items-center justify-center text-3xl mb-2`}>
                                {deviceIcons[d.device] || '📱'}
                              </div>
                              <p className="font-bold text-lg">{percentage}%</p>
                              <p className="text-neutral-400 text-sm capitalize">{d.device}</p>
                            </div>
                          );
                        })}
                      </div>
                      <div className="space-y-2">
                        {data.devices.map((d, i) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-neutral-800/50 rounded-lg">
                            <span className="capitalize">{deviceIcons[d.device]} {d.device}</span>
                            <span className="font-bold">{d.count}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Browser Distribution */}
                <div className="bg-neutral-900/50 backdrop-blur rounded-2xl p-6 border border-neutral-800">
                  <h2 className="text-lg font-semibold mb-4">🌐 Tarayıcı Dağılımı</h2>
                  {data.browsers.length === 0 ? (
                    <p className="text-neutral-500 text-center py-8">Henüz veri yok</p>
                  ) : (
                    <div className="space-y-3">
                      {data.browsers.map((b, i) => {
                        const total = data.browsers.reduce((a, c) => a + c.count, 0);
                        const percentage = getPercentage(b.count, total);
                        return (
                          <div key={i}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="capitalize">{browserIcons[b.browser]} {b.browser}</span>
                              <span className="text-blue-400 font-medium">{percentage}%</span>
                            </div>
                            <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="bg-neutral-900/50 backdrop-blur rounded-2xl p-6 border border-neutral-800">
                <h2 className="text-lg font-semibold mb-4">🕐 Son Aktiviteler</h2>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {data.recentEvents.map((event, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 transition-colors">
                      <span className="text-neutral-500 text-xs w-32 flex-shrink-0">{formatTime(event.time)}</span>
                      <span className="flex-1">{eventNameMap[event.name] || event.name}</span>
                      <span className="text-neutral-400 text-sm truncate max-w-40">{getPageName(event.path)}</span>
                      {event.properties?.device && (
                        <span className="text-lg">{deviceIcons[String(event.properties.device)] || ''}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 flex items-center justify-between text-sm text-neutral-500">
              <button onClick={() => { setData(null); setSecret(''); }} className="hover:text-white transition-colors">
                ← Çıkış
              </button>
              <button onClick={fetchAnalytics} className="hover:text-[#4fd1c5] transition-colors">
                🔄 Yenile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
