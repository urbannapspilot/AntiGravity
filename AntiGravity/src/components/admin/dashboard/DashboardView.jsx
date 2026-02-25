import React from 'react';
import { Box, MapPin, Clock, Users } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const DashboardView = ({ isSuperAdmin, visiblePods, visibleLocations, clients }) => {
    // Generate stable mock analytics based on visible locations 
    // In a real app, this would be fetched from the backend.
    const chartData = [
        { name: 'Mon', uses: 24, revenue: 380 },
        { name: 'Tue', uses: 35, revenue: 520 },
        { name: 'Wed', uses: 45, revenue: 750 },
        { name: 'Thu', uses: 38, revenue: 610 },
        { name: 'Fri', uses: 55, revenue: 980 },
        { name: 'Sat', uses: 65, revenue: 1150 },
        { name: 'Sun', uses: 48, revenue: 820 },
    ].map(d => ({
        ...d,
        // Scale data down slightly if it's a client view to make it realistic
        uses: isSuperAdmin ? d.uses : Math.floor(d.uses * 0.4),
        revenue: isSuperAdmin ? d.revenue : Math.floor(d.revenue * 0.4)
    }));

    const locationRevenueData = visibleLocations.map(loc => ({
        name: loc.name,
        revenue: Math.floor(Math.random() * 2000) + 500
    }));

    return (
        <div className="p-8 lg:p-12 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">Analytics Overview</h2>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-card hover:shadow-md transition-shadow flex flex-col gap-3 group">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform bg-gradient-to-br from-indigo-50 to-indigo-100/50">
                        <Box className="w-6 h-6 text-indigo-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Pods</p>
                    <p className="text-4xl font-light tracking-tight text-slate-900">{visiblePods.length}</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-card hover:shadow-md transition-shadow flex flex-col gap-3 group">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform bg-gradient-to-br from-emerald-50 to-emerald-100/50">
                        <MapPin className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Locations</p>
                    <p className="text-4xl font-light tracking-tight text-slate-900">{visibleLocations.length}</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-card hover:shadow-md transition-shadow flex flex-col gap-3 group">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform bg-gradient-to-br from-amber-50 to-amber-100/50">
                        <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Avg Session</p>
                    <p className="text-4xl font-light tracking-tight text-slate-900">38m</p>
                </div>
                {isSuperAdmin && (
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-card hover:shadow-md transition-shadow flex flex-col gap-3 group">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform bg-gradient-to-br from-blue-50 to-blue-100/50">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Clients</p>
                        <p className="text-4xl font-light tracking-tight text-slate-900">{clients.length}</p>
                    </div>
                )}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-2 gap-6">
                {/* Activity Line Chart */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-card">
                    <h3 className="text-lg font-semibold text-slate-800 mb-8">7-Day Activity Overvew</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }} dy={10} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.08)' }}
                                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 500, color: '#64748b' }} />
                                <Line yAxisId="left" type="monotone" dataKey="uses" name="Total Sessions" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Bar Chart */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-card">
                    <h3 className="text-lg font-semibold text-slate-800 mb-8">Revenue by Location</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={locationRevenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }} tickFormatter={(value) => `$${value}`} />
                                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }} width={140} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.08)' }}
                                    formatter={(value) => [`$${value}`, 'Revenue']}
                                />
                                <Bar dataKey="revenue" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={28} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
