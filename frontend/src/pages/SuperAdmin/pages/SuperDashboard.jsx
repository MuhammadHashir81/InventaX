import { MdHome } from 'react-icons/md';
import { useState } from 'react';
import { DatePicker, Space } from 'antd';
import { api } from '../../../../api/api';

const SuperDashboard = () => {

    const formatRequestDate = (value) => {
        if (!value) return null;
        if (typeof value.toISOString === 'function') return value.toISOString();
        return value;
    };

    const DEFAULT_RANGE = 'Last 30 Days';

    const QUICK_RANGES = [
        'Today', 'Last 7 Days', 'Last 30 Days', 'This Month',
        'Last Month', 'Last 3 Months', 'Last 6 Months', 'Last 9 Months',
        'Last 12 Months', 'This year', 'Last year', 'All Time',
    ];

    const [selectedRange, setSelectedRange] = useState(DEFAULT_RANGE);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const buildPayload = (overrides = {}) => ({
        range: overrides.range ?? selectedRange,
        startDate: formatRequestDate(overrides.startDate ?? startDate),
        endDate: formatRequestDate(overrides.endDate ?? endDate),
    });

    const handleApplyFilters = async () => {
        const payload = buildPayload();
        const response = await api.post(`/api/super-admin/get-dashboard-context`, payload);
        console.log(response);
    };

    const handleClearFilters = () => {
        setSelectedRange(DEFAULT_RANGE);
        setStartDate(null);
        setEndDate(null);
    };

    return (
        <div className="p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 mb-4 text-gray-400 text-sm">
                <MdHome size={15} />
                <span className="font-primary">Home</span>
            </div>

            <h2 className="font-primary text-xl font-semibold text-gray-800 mb-5">Dashboard</h2>

            {/* Filter Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5">

                <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-5 bg-blue-500 rounded-full" />
                    <h3 className="font-primary font-semibold text-gray-800 text-base">Filters</h3>
                </div>

                {/* Quick Ranges */}
                <p className="font-primary text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
                    Quick date ranges
                </p>
                <div className="flex gap-2 flex-wrap mb-5">
                    {QUICK_RANGES.map((range) => (
                        <button
                            key={range}
                            onClick={() => setSelectedRange(range)}
                            className={`
                                cursor-pointer font-primary text-sm px-3 py-1.5 rounded-full border transition-all duration-150
                                ${selectedRange === range
                                    ? 'bg-blue-600 text-white border-blue-600 font-medium'
                                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
                                }
                            `}
                        >
                            {range}
                        </button>
                    ))}
                </div>

                <hr className="border-gray-100 mb-5" />

                {/* Custom Range */}
                <p className="font-primary text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
                    Custom range
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="font-primary text-xs font-medium text-gray-400 uppercase tracking-widest">
                            Start date
                        </label>
                        <Space vertical size={12} className="w-full">
                            <DatePicker
                                value={startDate}
                                className="w-full rounded-lg border-gray-200 text-sm"
                                onChange={(date) => setStartDate(date)}
                            />
                        </Space>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="font-primary text-xs font-medium text-gray-400 uppercase tracking-widest">
                            End date
                        </label>
                        <Space vertical size={12} className="w-full">
                            <DatePicker
                                value={endDate}
                                className="w-full rounded-lg border-gray-200 text-sm"
                                onChange={(date) => setEndDate(date)}
                            />
                        </Space>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={handleApplyFilters}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-primary font-medium text-sm px-5 py-2 rounded-lg cursor-pointer transition-colors duration-150 flex items-center gap-2"
                    >
                        Apply filters
                    </button>
                    <button
                        onClick={handleClearFilters}
                        className="border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-500 font-primary font-medium text-sm px-5 py-2 rounded-lg cursor-pointer transition-colors duration-150"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuperDashboard;