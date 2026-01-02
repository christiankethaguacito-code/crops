// API Service with geolocation, photo upload, and real-time notifications

export const API_BASE_URL = 'http://localhost:3000/api';

// ============ GEOLOCATION ============

export const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            (error) => {
                let message = 'Unable to get location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = 'Location permission denied';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = 'Location information unavailable';
                        break;
                    case error.TIMEOUT:
                        message = 'Location request timed out';
                        break;
                }
                reject(new Error(message));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    });
};

// ============ PHOTO CAPTURE (Base64) ============

// Process a file from an existing input element
export const processFileInput = async (file) => {
    if (!file) return null;
    
    try {
        // Compress if needed
        const compressedFile = await compressImage(file);
        const base64 = await fileToBase64(compressedFile);
        return {
            base64,
            preview: base64,
            fileName: file.name,
            fileSize: compressedFile.size,
            mimeType: compressedFile.type
        };
    } catch (err) {
        console.error('Error processing file:', err);
        throw err;
    }
};

export const capturePhoto = () => {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment'; // Use rear camera on mobile

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) {
                reject(new Error('No file selected'));
                return;
            }

            try {
                const base64 = await fileToBase64(file);
                resolve({
                    base64,
                    fileName: file.name,
                    fileSize: file.size,
                    mimeType: file.type
                });
            } catch (err) {
                reject(err);
            }
        };

        input.click();
    });
};

export const selectPhoto = () => {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) {
                reject(new Error('No file selected'));
                return;
            }

            try {
                // Compress image if too large
                const compressedFile = await compressImage(file);
                const base64 = await fileToBase64(compressedFile);
                resolve({
                    base64,
                    fileName: file.name,
                    fileSize: compressedFile.size,
                    mimeType: compressedFile.type
                });
            } catch (err) {
                reject(err);
            }
        };

        input.click();
    });
};

const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const compressImage = (file, maxWidth = 1024, maxHeight = 1024, quality = 0.8) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width *= ratio;
                    height *= ratio;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                    },
                    'image/jpeg',
                    quality
                );
            };
        };
    });
};

// ============ WEATHER API ============

export const fetchWeather = async (lat, lon) => {
    try {
        const response = await fetch(`${API_BASE_URL}/weather?lat=${lat}&lon=${lon}`);
        if (!response.ok) throw new Error('Weather fetch failed');
        return await response.json();
    } catch (error) {
        console.error('Weather API error:', error);
        // Return default weather data
        return {
            temperature: 32,
            condition: 'Sunny',
            humidity: 75,
            location: 'Norala, South Cotabato'
        };
    }
};

// ============ NOTIFICATIONS (AJAX Polling) ============

let notificationPollInterval = null;
let lastNotificationCheck = null;

export const startNotificationPolling = (token, onNewNotifications, intervalMs = 30000) => {
    if (notificationPollInterval) {
        clearInterval(notificationPollInterval);
    }

    lastNotificationCheck = new Date().toISOString();

    const checkNotifications = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/notifications/unread-count${lastNotificationCheck ? `?since=${lastNotificationCheck}` : ''}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            if (response.ok) {
                const data = await response.json();
                if (data.count > 0) {
                    onNewNotifications(data.count);
                }
                lastNotificationCheck = new Date().toISOString();
            }
        } catch (error) {
            console.error('Notification polling error:', error);
        }
    };

    // Initial check
    checkNotifications();

    // Start polling
    notificationPollInterval = setInterval(checkNotifications, intervalMs);

    return () => {
        if (notificationPollInterval) {
            clearInterval(notificationPollInterval);
            notificationPollInterval = null;
        }
    };
};

export const stopNotificationPolling = () => {
    if (notificationPollInterval) {
        clearInterval(notificationPollInterval);
        notificationPollInterval = null;
    }
};

export const fetchNotifications = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notifications`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch notifications');
        return await response.json();
    } catch (error) {
        console.error('Fetch notifications error:', error);
        return { notifications: [], unreadCount: 0 };
    }
};

export const markNotificationRead = async (token, notificationId) => {
    try {
        await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    } catch (error) {
        console.error('Mark notification read error:', error);
    }
};

export const markAllNotificationsRead = async (token) => {
    try {
        await fetch(`${API_BASE_URL}/notifications/read-all`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    } catch (error) {
        console.error('Mark all notifications read error:', error);
    }
};

// ============ REPORTS API ============

export const submitReport = async (token, reportData) => {
    const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reportData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit report');
    }

    return await response.json();
};

export const fetchReportHistory = async (token, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/reports/history${queryParams ? `?${queryParams}` : ''}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to fetch reports');
    return await response.json();
};

// ============ ADMIN API ============

export const fetchAdminStats = async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
};

export const fetchAdminReports = async (token, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/admin/reports${queryParams ? `?${queryParams}` : ''}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch reports');
    return await response.json();
};

export const fetchMapReports = async (token, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/admin/reports/map${queryParams ? `?${queryParams}` : ''}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch map reports');
    return await response.json();
};

export const updateReportStatus = async (token, reportId, status, adminNotes = '') => {
    const response = await fetch(`${API_BASE_URL}/admin/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, adminNotes })
    });
    if (!response.ok) throw new Error('Failed to update status');
    return await response.json();
};

export const fetchReportPhoto = async (token, reportId) => {
    const response = await fetch(`${API_BASE_URL}/admin/reports/${reportId}/photo`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.photo;
};

// ============ SETTINGS API ============

export const fetchPestCategories = async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/pest-categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
};

export const fetchCropTypes = async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/crop-types`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
};

export const fetchBarangays = async () => {
    const response = await fetch(`${API_BASE_URL}/barangays`);
    return await response.json();
};

export const fetchPestTypes = async () => {
    const response = await fetch(`${API_BASE_URL}/pest-types`);
    return await response.json();
};

export const fetchCropTypesList = async () => {
    const response = await fetch(`${API_BASE_URL}/crop-types`);
    return await response.json();
};
