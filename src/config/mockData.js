
export const MOCK_DB = {
    farmers: [
        { id: 'f1', username: 'james', name: 'James Machico', rsbsa: '012-345-6789', address_barangay: 'San Jose' },
        { id: 'f2', username: 'shara', name: 'Shara Jane Desamero', rsbsa: '012-987-6543', address_barangay: 'Liberty' }
    ],
    reports: [
        {
            id: 101,
            farmer_username: 'james',
            type: 'Pest',
            status: 'Pending',
            date: '2025-01-10',
            severity: 'High',
            location: 'San Jose',
            details: 'Rice Black Bug infestation observed in northern field section.',
            created_at: '2025-01-10T08:30:00Z',
            is_active: true
        },
        {
            id: 102,
            farmer_username: 'james',
            type: 'Drought',
            status: 'Verified',
            date: '2025-01-08',
            severity: 'Moderate',
            location: 'San Jose',
            details: 'Irrigation canal water level critically low. Crops showing stress.',
            created_at: '2025-01-08T14:20:00Z',
            is_active: true
        },
        {
            id: 103,
            farmer_username: 'james',
            type: 'Disease',
            status: 'Resolved',
            date: '2024-12-28',
            severity: 'Low',
            location: 'San Jose',
            details: 'Leaf blight detected on corn plants. Treated with fungicide.',
            created_at: '2024-12-28T10:15:00Z',
            is_active: false
        },
        {
            id: 104,
            farmer_username: 'shara',
            type: 'Flood',
            status: 'Verified',
            date: '2025-01-12',
            severity: 'High',
            location: 'Liberty',
            details: 'Field submerged due to heavy rain. Rice seedlings at risk.',
            created_at: '2025-01-12T14:15:00Z',
            is_active: true
        },
        {
            id: 105,
            farmer_username: 'shara',
            type: 'Pest',
            status: 'Pending',
            date: '2025-01-14',
            severity: 'Moderate',
            location: 'Liberty',
            details: 'Army worms spotted on vegetable crops. Immediate action needed.',
            created_at: '2025-01-14T09:45:00Z',
            is_active: true
        },
        {
            id: 106,
            farmer_username: 'shara',
            type: 'Drought',
            status: 'Rejected',
            date: '2025-01-05',
            severity: 'Low',
            location: 'Liberty',
            details: 'Water shortage reported but rainfall recorded in area.',
            created_at: '2025-01-05T16:30:00Z',
            is_active: false
        }
    ],
    users: [
        { username: 'admin', password: 'password', role: 'admin', id: 'admin-1', name: 'Administrator' },
        { username: 'james', password: 'password', role: 'farmer', id: 'f1', name: 'James Machico', rsbsa: '012-345-6789' },
        { username: 'shara', password: 'password', role: 'farmer', id: 'f2', name: 'Shara Jane Desamero', rsbsa: '012-987-6543' }
    ]
};

export const MOCK_CREDENTIALS = { users: MOCK_DB.users };

export const MOCK_DATA = {
    admin: {
        get Farmers() {
            return MOCK_DB.farmers.map(f => ({ ...f, farmer_id: f.id }));
        },
        get Reports() {
            return MOCK_DB.reports.map(r => {
                const farmer = MOCK_DB.farmers.find(f => f.username === r.farmer_username);
                return {
                    ...r,
                    first_name: farmer?.name.split(' ')[0] || 'Unknown',
                    last_name: farmer?.name.split(' ').slice(1).join(' ') || 'Farmer',
                    farmer_name: farmer?.name
                };
            });
        },
        get Stats() {
            return {
                totalFarmers: MOCK_DB.farmers.length,
                pendingReports: MOCK_DB.reports.filter(r => r.status === 'Pending').length,
                resolvedReports: MOCK_DB.reports.filter(r => r.status === 'Resolved' || r.status === 'Verified').length,
                weatherAlerts: 1
            };
        }
    },
    // Helper for Farmer Dashboard fetching specific user data
    getFarmerDashboard: (username) => {
        const farmer = MOCK_DB.farmers.find(f => f.username === username);
        const myReports = MOCK_DB.reports.filter(r => r.farmer_username === username);
        const active = myReports.filter(r => r.is_active || r.status === 'Pending');

        return {
            profile: farmer,
            weather: { temp: '28°C', condition: 'Cloudy', location: farmer?.address_barangay || 'Unknown' },
            stats: { active_reports: active.length },
            latest_advisory: { title: 'Pest Alert', message: 'Monitor fields for Black Bug.' },
            activeReports: active, // For ReportStatus page active section
            history: myReports     // For ReportStatus page history
        };
    },
    // Legacy support object structure (optional, if direct access needed)
    farmer: {
        dashboard: {
            activeReports: [], // Should be empty by default, accessed via getFarmerDashboard
            history: []
        }
    }
};
