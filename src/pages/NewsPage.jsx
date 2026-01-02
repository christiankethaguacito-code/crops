import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useAuth, API_URL } from '../context/AuthContext';
import { Newspaper, AlertTriangle, Leaf, Bug, CloudRain, Sun, Calendar, ChevronRight, Bell } from 'lucide-react';

// Mock news/advisory data
const MOCK_NEWS = [
    {
        id: 1,
        title: 'Pest Alert: Black Bug Infestation Warning',
        summary: 'The Municipal Agriculture Office has detected increased black bug activity in several barangays. Farmers are advised to monitor their rice fields closely.',
        content: 'The Municipal Agriculture Office has detected increased black bug activity in several barangays including Poblacion, San Miguel, and Benigno Aquino. Farmers are advised to monitor their rice fields closely and report any signs of infestation immediately.',
        type: 'alert',
        category: 'pest',
        date: new Date(Date.now() - 86400000).toISOString(),
        priority: 'high'
    },
    {
        id: 2,
        title: 'Weather Advisory: Dry Season Preparations',
        summary: 'With the dry season approaching, farmers should begin preparing water conservation strategies for their crops.',
        content: 'The Philippine Atmospheric, Geophysical and Astronomical Services Administration (PAGASA) forecasts below-normal rainfall in the coming months. Farmers are encouraged to implement water-saving irrigation techniques and consider drought-resistant crop varieties.',
        type: 'advisory',
        category: 'weather',
        date: new Date(Date.now() - 172800000).toISOString(),
        priority: 'medium'
    },
    {
        id: 3,
        title: 'New Seed Distribution Program',
        summary: 'The DA is distributing free high-yield rice seeds to registered farmers this month.',
        content: 'The Department of Agriculture, in partnership with the local government, will be distributing free certified high-yield rice seeds to all RSBSA-registered farmers. Distribution will be at the Municipal Agriculture Office starting Monday.',
        type: 'news',
        category: 'program',
        date: new Date(Date.now() - 259200000).toISOString(),
        priority: 'low'
    },
    {
        id: 4,
        title: 'Flood Warning: Low-lying Areas',
        summary: 'Continuous rain expected. Farmers in flood-prone areas should take precautions.',
        content: 'PAGASA has issued a flood warning for low-lying areas due to continuous rainfall. Farmers are advised to harvest mature crops if possible and move equipment to higher ground. The CropAid system is ready to receive flood damage reports.',
        type: 'alert',
        category: 'flood',
        date: new Date(Date.now() - 345600000).toISOString(),
        priority: 'high'
    },
    {
        id: 5,
        title: 'Free Pest Control Training',
        summary: 'Learn integrated pest management techniques at this free workshop.',
        content: 'The Municipal Agriculture Office is conducting a free Integrated Pest Management (IPM) training for farmers. Topics include biological pest control, proper pesticide application, and early detection methods. Register at the MAO office.',
        type: 'news',
        category: 'training',
        date: new Date(Date.now() - 432000000).toISOString(),
        priority: 'low'
    },
    {
        id: 6,
        title: 'Fertilizer Subsidy Application Open',
        summary: 'Apply now for discounted fertilizer under the government subsidy program.',
        content: 'The Fertilizer Subsidy Program is now accepting applications. Eligible farmers can receive up to 50% discount on fertilizers. Bring your RSBSA card and valid ID to the Municipal Agriculture Office to apply.',
        type: 'news',
        category: 'program',
        date: new Date(Date.now() - 518400000).toISOString(),
        priority: 'medium'
    }
];

export default function NewsPage() {
    const { token, isMockMode } = useAuth();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedArticle, setSelectedArticle] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            if (isMockMode) {
                setTimeout(() => {
                    setNews(MOCK_NEWS);
                    setLoading(false);
                }, 300);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/advisories`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setNews(data.advisories || data);
                } else {
                    // Fallback to mock data if endpoint doesn't exist
                    setNews(MOCK_NEWS);
                }
            } catch (err) {
                console.error('Failed to fetch news:', err);
                setNews(MOCK_NEWS); // Fallback
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [token, isMockMode]);

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'pest': return <Bug size={16} className="text-red-500" />;
            case 'flood': return <CloudRain size={16} className="text-blue-500" />;
            case 'weather':
            case 'drought': return <Sun size={16} className="text-orange-500" />;
            default: return <Leaf size={16} className="text-green-500" />;
        }
    };

    const getTypeStyle = (type, priority) => {
        if (type === 'alert') {
            return priority === 'high' 
                ? 'bg-red-50 border-l-4 border-red-500'
                : 'bg-amber-50 border-l-4 border-amber-500';
        }
        if (type === 'advisory') {
            return 'bg-blue-50 border-l-4 border-blue-500';
        }
        return 'bg-white border border-gray-200';
    };

    const getTypeBadge = (type) => {
        const styles = {
            alert: 'bg-red-100 text-red-700',
            advisory: 'bg-blue-100 text-blue-700',
            news: 'bg-green-100 text-green-700'
        };
        return styles[type] || 'bg-gray-100 text-gray-700';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const filteredNews = filter === 'all' 
        ? news 
        : news.filter(item => item.type === filter);

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <Header title="News & Advisories" showBack />

            {/* Filter Tabs */}
            <div className="px-4 py-3 bg-white border-b border-gray-200 flex gap-2 overflow-x-auto">
                {[
                    { key: 'all', label: 'All', icon: Newspaper },
                    { key: 'alert', label: 'Alerts', icon: AlertTriangle },
                    { key: 'advisory', label: 'Advisories', icon: Bell },
                    { key: 'news', label: 'News', icon: Leaf }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                            filter === tab.key
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* News List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : filteredNews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <Newspaper size={48} className="mb-2 opacity-50" />
                        <p>No news available</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredNews.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedArticle(item)}
                                className={`rounded-lg p-4 cursor-pointer hover:shadow-md transition-all ${getTypeStyle(item.type, item.priority)}`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            {getCategoryIcon(item.category)}
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${getTypeBadge(item.type)}`}>
                                                {item.type}
                                            </span>
                                            <span className="text-[10px] text-gray-400">{formatDate(item.date)}</span>
                                        </div>
                                        <h3 className="font-bold text-sm text-gray-900 mb-1">{item.title}</h3>
                                        <p className="text-xs text-gray-500 line-clamp-2">{item.summary}</p>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400 shrink-0" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Article Detail Modal */}
            {selectedArticle && (
                <div 
                    className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
                    onClick={() => setSelectedArticle(null)}
                >
                    <div 
                        className="bg-white rounded-t-2xl w-full max-w-[480px] max-h-[80vh] overflow-hidden animate-slide-up"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`p-4 ${
                            selectedArticle.type === 'alert' ? 'bg-red-500' :
                            selectedArticle.type === 'advisory' ? 'bg-blue-500' : 'bg-primary'
                        } text-white`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-white/20">
                                    {selectedArticle.type}
                                </span>
                                <span className="text-xs opacity-80">{formatDate(selectedArticle.date)}</span>
                            </div>
                            <h2 className="text-lg font-bold">{selectedArticle.title}</h2>
                        </div>

                        {/* Content */}
                        <div className="p-4 overflow-y-auto max-h-[60vh]">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                {selectedArticle.content}
                            </p>

                            {selectedArticle.type === 'alert' && (
                                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-xs text-amber-700 flex items-center gap-2">
                                        <AlertTriangle size={14} />
                                        <span>This is an important alert. Please take necessary precautions.</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-200">
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
