import React, { lazy, Suspense } from 'react'
import { Spin } from 'antd';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import { TenantsSection } from './pages/SuperAdmin/pages/TenantSection';
import { SubscriptionSection } from './pages/SuperAdmin/pages/SubscriptionSection';
import { OverviewSection } from './pages/SuperAdmin/pages/OverviewSection';
import { AuditSection } from './pages/SuperAdmin/pages/AuditSection';
import SuperDashboard from './pages/SuperAdmin/pages/SuperDashboard';
const Login = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const Invoices = lazy(() => import('./pages/admin/Invoices'))
const NewInvoice = lazy(() => import('./pages/admin/NewInvoice'))
const Products = lazy(() => import('./pages/admin/Products'))
const Customers = lazy(() => import('./pages/admin/Customers'))
const Outflows = lazy(() => import('./pages/admin/Outflows'))
const EditCustomer = lazy(() => import('./pages/admin/EditCustomer'))
const EditProduct = lazy(() => import('./pages/admin/EditProduct'))
const EditInvoice = lazy(() => import('./pages/admin/EditInvoice'))
const GenerateBillPdf = lazy(() => import('./pages/admin/GenerateBillPdf'))
const Signup = lazy(() => import('./pages/admin/Signup'))
const Unauthorized = lazy(() => import('./pages/admin/Unauthorized'))
const Home = lazy(() => import('./pages/admin/Home'))
const SuperAdmin = lazy(() => import('./pages/SuperAdmin/SuperAdmin'))
const AdminLogin = lazy(() => import('./pages/SuperAdmin/AdminLogin'))
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'))
const PaymentFailed = lazy(() => import('./pages/PaymentFailed'))
const Membership = lazy(() => import('./pages/Membership'))

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="w-screen h-screen  flex items-center justify-center">
        <Spin/>
        </div>}>
        <Routes>

          {/* admin routes */}
          <Route path='/' element={<Home />} />
          {/* membership page */}

          <Route path='/membership' element={<Membership />} />

          {/* admin routes */}
          <Route path='/admin' element={
            <ProtectedRoute loginPath='/login' allowedRoles={['user']}>
              <AdminLayout />
            </ProtectedRoute>

          }>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='invoices' element={<Invoices />} />
            <Route path='new-invoice' element={<NewInvoice />} />
            <Route path='products' element={<Products />} />
            <Route path='customers' element={<Customers />} />
            <Route path='outflows' element={<Outflows />} />
            <Route path='edit/:id' element={<EditCustomer />} />
            <Route path='edit-product/:id' element={<EditProduct />} />
            <Route path='edit-invoice/:id' element={<EditInvoice />} />
            <Route path='bill/:id' element={<GenerateBillPdf />} />
          </Route>


          {/* payment successfull route */}
          <Route path='/payment-success' element={<PaymentSuccess />} />
          <Route path='/payment-failed' element={<PaymentFailed />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/unauthorized' element={<Unauthorized />} />

          {/* super admin routes */}
          <Route path='/super-admin' element={
            <ProtectedRoute loginPath='/login' allowedRoles={['admin']}>
              <SuperAdmin />
            </ProtectedRoute>}> 
            <Route index  element={<OverviewSection/>}/>
            <Route path='tenants' element={<TenantsSection/>}/>
            <Route path='subscriptions' element={<SubscriptionSection/>}/>
            <Route path='dashboard' element={<SuperDashboard/>}/>

            </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App