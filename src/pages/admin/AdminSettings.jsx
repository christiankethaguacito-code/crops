import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth, API_URL } from '../../context/AuthContext';
import { 
    Settings, Bug, Leaf, MapPin, Users, Plus, Pencil, Trash2, 
    Save, X, ChevronRight, Check, AlertTriangle 
} from 'lucide-react';

// Tab Component
function TabButton({ active, onClick, icon: Icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                active 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
            <Icon size={18} />
            {label}
        </button>
    );
}

// Generic CRUD Table Component
function CrudTable({ 
    title, 
    items, 
    columns, 
    onAdd, 
    onEdit, 
    onDelete, 
    loading,
    emptyMessage = 'No items found'
}) {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [isAdding, setIsAdding] = useState(false);
    const [newData, setNewData] = useState({});

    const handleStartEdit = (item) => {
        setEditingId(item.id);
        setEditData({ ...item });
    };

    const handleSaveEdit = () => {
        onEdit(editData);
        setEditingId(null);
        setEditData({});
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    const handleStartAdd = () => {
        setIsAdding(true);
        const initial = {};
        columns.forEach(col => { if (col.editable) initial[col.key] = ''; });
        setNewData(initial);
    };

    const handleSaveAdd = () => {
        onAdd(newData);
        setIsAdding(false);
        setNewData({});
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
        setNewData({});
    };

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-bold text-gray-800">{title}</h3>
                <button
                    onClick={handleStartAdd}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors"
                >
                    <Plus size={16} />
                    Add New
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    {col.label}
                                </th>
                            ))}
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {/* Add New Row */}
                        {isAdding && (
                            <tr className="bg-green-50">
                                {columns.map(col => (
                                    <td key={col.key} className="px-4 py-3">
                                        {col.editable ? (
                                            <input
                                                type={col.type || 'text'}
                                                value={newData[col.key] || ''}
                                                onChange={(e) => setNewData({ ...newData, [col.key]: e.target.value })}
                                                className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder={col.placeholder || col.label}
                                            />
                                        ) : (
                                            <span className="text-gray-400">Auto</span>
                                        )}
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={handleSaveAdd}
                                            className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors"
                                        >
                                            <Check size={18} />
                                        </button>
                                        <button 
                                            onClick={handleCancelAdd}
                                            className="p-1.5 text-gray-400 hover:bg-gray-100 rounded transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {/* Data Rows */}
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-4 py-8 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                </td>
                            </tr>
                        ) : items.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            items.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    {columns.map(col => (
                                        <td key={col.key} className="px-4 py-3 text-sm">
                                            {editingId === item.id && col.editable ? (
                                                <input
                                                    type={col.type || 'text'}
                                                    value={editData[col.key] || ''}
                                                    onChange={(e) => setEditData({ ...editData, [col.key]: e.target.value })}
                                                    className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                />
                                            ) : col.render ? (
                                                col.render(item[col.key], item)
                                            ) : (
                                                item[col.key]
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            {editingId === item.id ? (
                                                <>
                                                    <button 
                                                        onClick={handleSaveEdit}
                                                        className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={handleCancelEdit}
                                                        className="p-1.5 text-gray-400 hover:bg-gray-100 rounded transition-colors"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button 
                                                        onClick={() => handleStartEdit(item)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => onDelete(item.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function AdminSettings() {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState('pest');
    const [pestCategories, setPestCategories] = useState([]);
    const [cropTypes, setCropTypes] = useState([]);
    const [barangays, setBarangays] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Fetch data based on active tab
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setMessage({ type: '', text: '' });
            
            try {
                let endpoint = '';
                switch (activeTab) {
                    case 'pest': endpoint = '/admin/pest-categories'; break;
                    case 'crop': endpoint = '/admin/crop-types'; break;
                    case 'barangay': endpoint = '/admin/barangays'; break;
                    case 'users': endpoint = '/admin/users'; break;
                    default: return;
                }

                const response = await fetch(`${API_URL}${endpoint}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Failed to fetch data');
                
                const data = await response.json();
                
                switch (activeTab) {
                    case 'pest': setPestCategories(data.categories || []); break;
                    case 'crop': setCropTypes(data.cropTypes || []); break;
                    case 'barangay': setBarangays(data.barangays || []); break;
                    case 'users': setUsers(data.users || []); break;
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setMessage({ type: 'error', text: 'Failed to load data' });
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchData();
    }, [token, activeTab]);

    // Generic CRUD handlers
    const handleAdd = async (endpoint, data, refreshFn) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Failed to add item');
            
            setMessage({ type: 'success', text: 'Item added successfully' });
            refreshFn();
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    const handleEdit = async (endpoint, data, refreshFn) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}/${data.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Failed to update item');
            
            setMessage({ type: 'success', text: 'Item updated successfully' });
            refreshFn();
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    const handleDelete = async (endpoint, id, refreshFn) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        
        try {
            const response = await fetch(`${API_URL}${endpoint}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to delete item');
            
            setMessage({ type: 'success', text: 'Item deleted successfully' });
            refreshFn();
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    // Refresh function
    const refreshData = () => {
        setActiveTab(prev => prev); // Force re-fetch
    };

    // Column definitions
    const pestColumns = [
        { key: 'id', label: 'ID', editable: false },
        { key: 'name', label: 'Pest Name', editable: true, placeholder: 'e.g. Black Bug' },
        { key: 'description', label: 'Description', editable: true, placeholder: 'Brief description' },
        { 
            key: 'is_active', 
            label: 'Status', 
            editable: false,
            render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {value ? 'Active' : 'Inactive'}
                </span>
            )
        }
    ];

    const cropColumns = [
        { key: 'id', label: 'ID', editable: false },
        { key: 'name', label: 'Crop Name', editable: true, placeholder: 'e.g. Rice' },
        { key: 'variety', label: 'Variety', editable: true, placeholder: 'e.g. RC160' },
        { 
            key: 'is_active', 
            label: 'Status', 
            editable: false,
            render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {value ? 'Active' : 'Inactive'}
                </span>
            )
        }
    ];

    const barangayColumns = [
        { key: 'id', label: 'ID', editable: false },
        { key: 'name', label: 'Barangay Name', editable: true, placeholder: 'e.g. Poblacion' },
        { key: 'municipality', label: 'Municipality', editable: true, placeholder: 'e.g. Norala' },
        { key: 'province', label: 'Province', editable: true, placeholder: 'e.g. South Cotabato' }
    ];

    const userColumns = [
        { key: 'id', label: 'ID', editable: false },
        { key: 'username', label: 'Username', editable: true },
        { key: 'email', label: 'Email', editable: true, type: 'email' },
        { 
            key: 'role', 
            label: 'Role', 
            editable: false,
            render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    value === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                    {value?.toUpperCase()}
                </span>
            )
        },
        { 
            key: 'is_active', 
            label: 'Status', 
            editable: false,
            render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                    {value ? 'Active' : 'Disabled'}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            {/* Message Banner */}
            {message.text && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${
                    message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                    {message.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
                    <span>{message.text}</span>
                    <button 
                        onClick={() => setMessage({ type: '', text: '' })}
                        className="ml-auto hover:opacity-70"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-sm p-2 flex flex-wrap gap-2">
                <TabButton 
                    active={activeTab === 'pest'} 
                    onClick={() => setActiveTab('pest')} 
                    icon={Bug} 
                    label="Pest Categories" 
                />
                <TabButton 
                    active={activeTab === 'crop'} 
                    onClick={() => setActiveTab('crop')} 
                    icon={Leaf} 
                    label="Crop Types" 
                />
                <TabButton 
                    active={activeTab === 'barangay'} 
                    onClick={() => setActiveTab('barangay')} 
                    icon={MapPin} 
                    label="Barangays" 
                />
                <TabButton 
                    active={activeTab === 'users'} 
                    onClick={() => setActiveTab('users')} 
                    icon={Users} 
                    label="User Management" 
                />
            </div>

            {/* Content Area */}
            {activeTab === 'pest' && (
                <CrudTable
                    title="Pest Categories"
                    items={pestCategories}
                    columns={pestColumns}
                    loading={loading}
                    onAdd={(data) => handleAdd('/admin/pest-categories', data, refreshData)}
                    onEdit={(data) => handleEdit('/admin/pest-categories', data, refreshData)}
                    onDelete={(id) => handleDelete('/admin/pest-categories', id, refreshData)}
                    emptyMessage="No pest categories defined yet"
                />
            )}

            {activeTab === 'crop' && (
                <CrudTable
                    title="Crop Types"
                    items={cropTypes}
                    columns={cropColumns}
                    loading={loading}
                    onAdd={(data) => handleAdd('/admin/crop-types', data, refreshData)}
                    onEdit={(data) => handleEdit('/admin/crop-types', data, refreshData)}
                    onDelete={(id) => handleDelete('/admin/crop-types', id, refreshData)}
                    emptyMessage="No crop types defined yet"
                />
            )}

            {activeTab === 'barangay' && (
                <CrudTable
                    title="Barangays"
                    items={barangays}
                    columns={barangayColumns}
                    loading={loading}
                    onAdd={(data) => handleAdd('/admin/barangays', data, refreshData)}
                    onEdit={(data) => handleEdit('/admin/barangays', data, refreshData)}
                    onDelete={(id) => handleDelete('/admin/barangays', id, refreshData)}
                    emptyMessage="No barangays defined yet"
                />
            )}

            {activeTab === 'users' && (
                <CrudTable
                    title="User Management"
                    items={users}
                    columns={userColumns}
                    loading={loading}
                    onAdd={(data) => handleAdd('/admin/users', data, refreshData)}
                    onEdit={(data) => handleEdit('/admin/users', data, refreshData)}
                    onDelete={(id) => handleDelete('/admin/users', id, refreshData)}
                    emptyMessage="No users found"
                />
            )}
        </div>
    );
}
