import mongoose from "mongoose";



const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected')
    })
    mongoose.connection.on('error', (err) => {
        console.log(err.message)
    })

    
   await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`)

}

export default connectDB;