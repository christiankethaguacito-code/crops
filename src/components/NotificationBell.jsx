import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, AlertTriangle, FileText, User } from 'lucide-react';
import { useAuth, API_URL } from '../context/AuthContext';
import { startNotificationPolling, stopNotificationPolling, markNotificationRead } from '../services/api';

export default function NotificationBell() {
    const { token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const pollingRef = useRef(null);

    // Start polling on mount
    useEffect(() => {
        if (token) {
            // Callback when new notifications arrive
            const handleNewNotifications = (data) => {
                if (data.notifications) {
                    setNotifications(data.notifications);
                }
                if (typeof data.unreadCount === 'number') {
                    setUnreadCount(data.unreadCount);
                }
            };

            // Start polling every 30 seconds
            pollingRef.current = startNotificationPolling(token, handleNewNotifications, 30000);
        }

        // Cleanup on unmount
        return () => {
            if (pollingRef.current) {
                stopNotificationPolling(pollingRef.current);
            }
        };
    }, [token]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchAllNotifications = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/notifications?limit=20`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
            }
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = () => {
        if (!isOpen) {
            fetchAllNotifications();
        }
        setIsOpen(!isOpen);
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markNotificationRead(token, notificationId);
            setNotifications(prev => 
                prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                setUnreadCount(0);
            }
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'report': return <FileText size={16} className="text-blue-500" />;
            case 'alert': return <AlertTriangle size={16} className="text-red-500" />;
            case 'user': return <User size={16} className="text-green-500" />;
            default: return <Bell size={16} className="text-gray-500" />;
        }
    };

    const formatTime = (date) => {
        const now = new Date();
        const notifDate = new Date(date);
        const diffMs = now - notifDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return notifDate.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={handleToggle}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
                <Bell size={22} className="text-gray-600" />
                
                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    {/* Header */}
                    <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
                        <h3 className="font-bold text-gray-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-primary hover:text-primary-dark font-medium"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-80 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Bell size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer ${
                                        !notification.is_read ? 'bg-blue-50/50' : ''
                                    }`}
                                    onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${!notification.is_read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                {formatTime(notification.created_at)}
                                            </p>
                                        </div>
                                        {!notification.is_read && (
                                            <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2 bg-gray-50 border-t text-center">
                            <button className="text-xs text-primary hover:text-primary-dark font-medium">
                                View All Notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
