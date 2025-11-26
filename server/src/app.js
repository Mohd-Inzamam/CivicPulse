import express, { json, urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()

app.use(
  cors({
    origin: ["http://localhost:5173"], // ✅ explicitly specify allowed origins
    credentials: true,                // ✅ allow cookies / auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

app.use(cookieParser())
///
app.use(urlencoded({ credentials: true, limit: '5mb' }))
app.use(json({ limit: '5mb' }))
app.use(express.static('public'))

// Import routes
import { router as userRouter } from './routes/user.route.js'
import { router as authRouter } from './routes/auth.route.js'
import { router as issuesRouter } from './routes/issues.route.js'
import { router as dashboardRouter } from './routes/dashboard.route.js'
import { router as adminRoutes } from './routes/admin.routes.js'

// Use routes
app.use('/CivicPlus/v1/users', userRouter) // Legacy user routes
app.use('/auth', authRouter) // New auth routes
app.use('/api/issues', issuesRouter) // Issues management
app.use('/api/dashboard', dashboardRouter) // Dashboard data
app.use('/api/v1/admin', adminRoutes)

export { app }
