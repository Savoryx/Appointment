import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from '../backend/routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRouter.js'



// app config
const app = express()
const port = process.env.PORT || 3000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

// api routes

app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

app.post('/test', (req, res) => {
  console.log("BODY:", req.body);
  res.json({ received: req.body });
});

// localhost:3000/api/admin/add-doctor

app.get('/',(req,res)=>{
    res.send('API SACHIN WORKING')
})


app.listen(port,()=>console.log(`Listening on localhost:${port}`))


