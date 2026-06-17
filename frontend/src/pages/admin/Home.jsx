import {useState} from 'react'
import { NavLink } from 'react-router-dom'
import { RiArrowRightUpLine } from "react-icons/ri";
import { api } from '../../../api/api';
import Swal from "sweetalert2";
import { useSelector } from 'react-redux';
const Home = () => {
  const { user } = useSelector(state => state.auth)
  const auth = useSelector(state => state.auth)
  console.log(auth)
  console.log(user)
    const plans = [
    {
      name: 'Starter',
      badge: null,
      price: '0',
      features: [
        'Unlimited Users',
        'Unlimited Invoices',
        'Unlimited Products',
        'Full Analytics Suite',
        'Dashboard',
        'one month limit',
      ],
      cta: 'Get Started',
      highlight: false,
    },
    
    {
      name: 'Pro',
      price: 10,
      badge: 'Best Value',
      priceId:"price_1TZA61AjmegtlXAVgLyk8oWr",
      features: [
        'Unlimited Users',
        'Unlimited Invoices',
        'Unlimited Products',
        'Full Analytics Suite',
        'Dashboard',
      ],
      limitations: [],
      cta: 'Go Pro',
      highlight: true,
    },
  ]
 
  // const navLinks = ['Features', 'Pricing', 'membership' ]
 
  const features = [
    { icon: '🧾', title: 'Smart Invoicing', desc: 'Generate professional invoices in seconds with auto-calculations, tax support, and PDF export.' },
    { icon: '📦', title: 'Inventory Control', desc: 'Track stock levels in real-time, get low-stock alerts, and manage multiple warehouses effortlessly.' },
    { icon: '📊', title: 'Analytics Dashboard', desc: 'Visualize revenue trends, top products, and customer insights with beautiful charts.' },
  ]
 

  const handlePayment = async (priceId,price) =>{
    console.log(price)
    if(price == '0'){
      window.location.href = '/admin/dashboard'
      return 
    }


    try {
      const response = await api.post('/api/payment/create',{priceId})
      // console.log(response)
      if (response?.url) {
        window.location.href = response.url
      }

    } catch (error) { 
      Swal.fire(error?.response?.data?.error) 
      console.log(error?.response?.data?.error)
    }
    

  }

 
  return (
    <div className="min-h-screen  text-white font-primary ">

         <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <NavLink to='/' className="cursor-pointer font-primary text-2xl font-extrabold tracking-tight">
          <span className="text-blue-400">Inventa</span>
          <span className="text-blue-400">X</span>
        </NavLink>
 
        <div className="flex items-center gap-4">
          {/* {navLinks.map(l => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-slate-800 font-primary  text-sm font-semibold transition-colors duration-200"
            >
              {l}
            </a>
          ))} */}

          <a href='#plans' className='text-sm font-bold font-primary text-black '>plans</a>
          <a href='#features' className='text-sm font-bold font-primary text-black '>features</a>
          <NavLink to='/membership' className='text-sm font-bold font-primary text-black '>membership</NavLink>
          <NavLink to='/admin/dashboard' className='text-sm font-bold font-primary text-black '>dashboard</NavLink>
        </div>

            
        <div className="flex items-center gap-3">
          <NavLink to='/login' className="text-sm text-slate-800 cursor-pointer px-4 py-2 transition-colors duration-200 font-primary">
            login
          </NavLink>
          <NavLink to='/signup' className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-medium font-primary transition-colors duration-200">
            sign up
          </NavLink>
        </div>

 
      </nav>  

        <section
        className="relative z-10 pt-20 pb-32 text-center px-4"

      >
 
        <h1 className="font-primary text-5xl md:text-7xl font-extrabold leading-tight tracking-tight max-w-4xl mx-auto mb-6 text-black">
          Run your business
          <br />
          <span className="text-blue-400">without the chaos.</span>
        </h1>
 
        <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed font-primary font-light">
          InventaX brings invoicing, inventory, and analytics under one
          roof — so you can focus on growth, not spreadsheets.
        </p>
 
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <NavLink className="flex items-center gap-0.5 bg-blue-600 hover:bg-blue-500 text-white px-12 py-3.5 rounded-xl font-semibold text-sm font-primary transition-colors duration-200 w-full sm:w-auto">

            Start Today  
            <RiArrowRightUpLine size={20}/>
          </NavLink>
        </div>
 
        {/* stat pills */}
        
      </section>

            <section id="features" className="relative z-10 py-24 px-4 max-w-7xl mx-auto">
        <h2 className="text-center font-semibold text-3xl text-blue-400   uppercase  mb-3 font-primary">
          Features
        </h2>
        <h2 className="font-primary text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight">
          Everything in one place
        </h2>
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map(f => (
            <div
              key={f.title}
              className="bg-blue-900 border  hover:border-blue-600/50 rounded-2xl p-6 transition-all duration-300  "
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-primary font-bold text-2xl mb-2 text-white  transition-colors duration-200">
                {f.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed font-primary font-light">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
 
      {/* ── PRICING ── */}
      <section id="plans" className="relative z-10 py-24 px-4">
        <div className="text-center mb-4">
          <p className="text-blue-400 text-xl font-semibold uppercase tracking-widest mb-3 font-primary">
            Pricing
          </p>
          <h2 className="font-primary text-4xl md:text-5xl font-bold tracking-tight">
            Simple, honest pricing
          </h2>
          
        </div>
 
        {/* pricing cards */}
        <div className="max-w-6xl mx-auto  flex justify-center  gap-14 items-stretch">
          {plans.map((plan) => {
            const displayPrice = plan.price
 
            return (
              <div
                key={plan.name}
                className={`w-[350px] h-[550px] relative rounded-2xl flex flex-col transition-all duration-300
                  ${plan.highlight
                    ? 'bg-gradient-to-b from-blue-600 to-blue-800 border-2 border-blue-400 scale-105 shadow-2xl shadow-blue-600/40'
                    : 'bg-slate-900 border border-slate-800 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/10'
                  }`}
              >
                {/* badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-white text-blue-700 text-xs font-bold font-primary px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
                      ⭐ {plan.badge}
                    </span>
                  </div>
                )}
 
                <div className="p-8 flex-1 flex flex-col">
                  {/* plan name */}
                  <p className={`font-primary text-sm font-bold uppercase tracking-widest mb-1
                    ${plan.highlight ? 'text-blue-200' : 'text-blue-400'}`}>
                    {plan.name}
                  </p>
 
                  {/* price */}
                  <div className="flex items-end gap-1 mt-2 mb-6">
                    <span className="font-primary text-6xl font-extrabold leading-none text-white">
                      ${displayPrice}
                    </span>
                    <span className={`text-sm mb-2 font-primary ${plan.highlight ? 'text-blue-200' : 'text-slate-400'}`}>
                      / mo
                    </span>
                  </div>
 
                  {/* divider */}
                  <div className={`h-px mb-6 ${plan.highlight ? 'bg-blue-500/50' : 'bg-slate-800'}`} />
 
                  {/* features list */}
                  <ul className="space-y-3 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <span className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
                          ${plan.highlight
                            ? 'bg-blue-400 text-blue-900'
                            : 'bg-blue-600/30 text-blue-400'
                          }`}>
                          ✓
                        </span>
                        <span className={`font-primary ${plan.highlight ? 'text-blue-50' : 'text-slate-300'}`}>
                          {f}
                        </span>
                      </li>
                    ))}
                    
                  </ul>
 
                  {/* CTA button */}
                  <button
                  onClick={()=>handlePayment(plan.priceId,plan.price)}
                    className={`mt-8 w-full py-3.5 rounded-xl font-semibold text-sm font-primary transition-all duration-200
                      ${plan.highlight
                        ? 'bg-white text-blue-700 hover:bg-blue-50 shadow-lg'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                  >
                    {plan.cta} →
                  </button>
                </div>
              </div>
            )
          })}
        </div>
 
        <p className="text-center text-slate-500 text-sm mt-10 font-primary">
          🔒 30-day free trial· Cancel anytime · No credit card required
        </p>
      </section>


  <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 text-center relative overflow-hidden">
          {/* subtle dot pattern via inline style — only layout, not design */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          <h2 className="font-primary text-4xl md:text-5xl font-extrabold mb-4 relative z-10">
            Ready to take control?
          </h2>
          <p className="text-blue-200 mb-8 text-lg relative z-10 font-primary font-light">
            Join InventaX today for business growth.
          </p>
          <NavLink to='/admin/dashboard' className="relative z-10 bg-white text-blue-700 font-bold font-primary px-10 py-4 rounded-xl text-sm hover:bg-blue-50 transition-colors duration-200 shadow-xl">
            Start your free trial today →
          </NavLink>
        </div>
      </section>
 
    </div>
  )
}

export default Home


