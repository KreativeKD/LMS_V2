import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import {
    fetchNotifications,
    fetchUnreadNotificationCount,
    markAllNotificationsRead,
    markNotificationRead,
    deleteNotification as deleteNotificationApi
} from '../api/api';
import { useAuth } from './AuthContext';

const NotificationsContext = createContext(null);

export const NotificationsProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const refreshNotifications = useCallback(async () => {
        if (!isAuthenticated || !user) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        setLoading(true);
        try {
            const [listResult, countResult] = await Promise.all([
                fetchNotifications(15),
                fetchUnreadNotificationCount()
            ]);

            setNotifications(listResult.notifications || []);
            setUnreadCount(countResult.count || 0);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        refreshNotifications();
    }, [refreshNotifications]);

    useEffect(() => {
        if (!isAuthenticated || !user) return undefined;

        const intervalId = setInterval(() => {
            refreshNotifications();
        }, 45000);

        return () => clearInterval(intervalId);
    }, [isAuthenticated, user, refreshNotifications]);

    const markOneRead = useCallback(async (id) => {
        await markNotificationRead(id);
        setNotifications((prev) =>
            prev.map((item) => item._id === id ? { ...item, read: true } : item)
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    }, []);

    const markAllRead = useCallback(async () => {
        await markAllNotificationsRead();
        setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
        setUnreadCount(0);
    }, []);

    const deleteNotification = useCallback(async (id) => {
        const existing = notifications.find((item) => item._id === id);
        await deleteNotificationApi(id);
        setNotifications((prev) => prev.filter((item) => item._id !== id));

        if (existing && !existing.read) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
        }
    }, [notifications]);

    const value = useMemo(() => ({
        notifications,
        unreadCount,
        loading,
        refreshNotifications,
        markOneRead,
        markAllRead,
        deleteNotification
    }), [
        notifications,
        unreadCount,
        loading,
        refreshNotifications,
        markOneRead,
        markAllRead,
        deleteNotification
    ]);

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationsProvider');
    }
    return context;
};
