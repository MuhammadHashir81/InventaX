import { MdHome } from 'react-icons/md';
import { useState } from 'react';
import { Card, Col, ConfigProvider, DatePicker, Row, Select, Space, Statistic } from 'antd';

const SuperDashboard = () => {

    const DEFAULT_RANGE = 'Last 30 Days';

    const QUICK_RANGES = [
        'Today',
        'Last 7 Days',
        'Last 30 Days',
        'This Month',
        'Last Month',
        'Last 3 Months',
        'Last 6 Months',
        'Last 9 Months',
        'Last 12 Months',
        'This year',
        'Last year',
        'All Time',
    ];
    
    const [selectedRange, setSelectedRange] = useState(DEFAULT_RANGE);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [customerSearch, setCustomerSearch] = useState('');
    const [customers, setCustomers] = useState([]);
    





    return (
        <div>
            <div>
                <div className='flex items-center gap-1 mb-4'>
                    <MdHome size={15} />
                    <h6 className='font-primary font-medium'>Home</h6>
                </div>

                <h2 className='font-primary text-xl font-bold mb-2'>Dashboard</h2>

                <div className='rounded-lg bg-white shadow-sm px-4 py-4 my-4'>
                    <div>
                        <h3 className='font-primary font-semibold text-lg mb-4'>Filters</h3>
                        <h4 className='font-primary font-medium'>Quick Date Ranges</h4>
                    </div>

                    <div className='flex gap-3 flex-wrap my-5'>
                        {QUICK_RANGES.map((range) => (
                            <button
                                key={range}
                                onClick={() => setSelectedRange(range)}
                                className={`cursor-pointer font-primary w-fit px-3 py-1 rounded-md ${selectedRange === range ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-1'>
                            <h2 className='font-primary font-medium'>Start Date</h2>
                            <Space vertical size={12}>
                                <DatePicker
                                    value={startDate}
                                    className='w-full'
                                    onChange={(date) => setStartDate(date)}
                                />
                            </Space>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <h2 className='font-primary font-medium'>End Date</h2>
                            <Space vertical size={12}>
                                <DatePicker
                                    value={endDate}
                                    className='w-full'
                                    onChange={(date) => setEndDate(date)}
                                />
                            </Space>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <h2 className='font-primary font-medium'>Filter by Product</h2>
                            <Select
                                value={selectedProduct || undefined}
                                placeholder='Products'
                                style={{ width: '100%' }}
                                showSearch
                                optionFilterProp='label'
                                filterOption={false}
                                onSearch={setProductSearch}
                                onSelect={(value) => setSelectedProduct(value)}
                                allowClear
                                onClear={() => setSelectedProduct('')}
                                options={products.map((product) => ({
                                    value: product._id,
                                    label: product.name,
                                }))}
                            />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <h2 className='font-primary font-medium'>Filter by Customer</h2>
                            <Select
                                value={selectedCustomer || undefined}
                                placeholder='Customers'
                                style={{ width: '100%' }}
                                showSearch
                                optionFilterProp='label'
                                filterOption={false}
                                onSearch={setCustomerSearch}
                                onSelect={(value) => setSelectedCustomer(value)}
                                allowClear
                                onClear={() => setSelectedCustomer('')}
                                options={customers.map((customer) => ({
                                    value: customer._id,
                                    label: customer.name,
                                }))}
                            />
                        </div>
                    </div>

                    <div className='mt-7 flex gap-4'>
                        <button
                        onClick={handleApplyFilters}
                            className='bg-blue-500 px-4 py-2 text-white font-primary font-medium rounded-md cursor-pointer hover:bg-blue-600'
                        >
                            Apply Filters
                        </button>
                        <button
                            className='bg-gray-200 hover:bg-gray-300 cursor-pointer text-black px-4 py-2 font-primary font-medium rounded-md'
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SuperDashboard
