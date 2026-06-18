import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import cookieParser from 'cookie-parser'
import { connectDB } from './db/connectionDB.js'
import { seedAdmin } from './controllers/user.auth.controller.js'
import { customerRoute } from './routes/customer.route.js'
import { productRouter } from './routes/product.route.js'
import { invoiceRouter } from './routes/invoice.route.js'
import { outflowRouter } from './routes/outflow.route.js'
import { dashboardRouter } from './routes/dashboard.route.js'
import { authRouter } from './routes/auth.route.js'
import { paymentRouter } from './routes/payment.route.js'
import { handleWebhook } from './controllers/payment.controller.js'
import { superAdminRouter } from './routes/super.admin.route.js'
const app = express()
app.post('/api/payment/webhook',express.raw({ type: 'application/json' }), handleWebhook)

app.use(express.json())
app.use(cookieParser())

const apiUrl = process.env.API_URL
app.use(cors(
  {
    origin:apiUrl,
    credentials:true
  }
));

configDotenv()
// db connection
connectDB()
seedAdmin()

// stripe webhook endpoint
const port = process.env.PORT || 5000
app.use('/api/payment',paymentRouter)






// admin auth route
app.use('/api/auth',authRouter)

// customer route
app.use('/api/customer',customerRoute)

// product route
app.use('/api/product',productRouter)

// invoice route

app.use('/api/product/invoice',invoiceRouter)
app.use('/api/outflow',outflowRouter)
app.use('/api/dashboard',dashboardRouter)

// super admin routers
app.use('/api/super-admin',superAdminRouter)

app.get('/',(req,res)=>{
  res.send('SaaS')
})

app.listen(port,()=>{
  console.log(`SaaS is listening on port ${port}`)
})
