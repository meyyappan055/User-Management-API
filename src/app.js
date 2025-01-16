import express from 'express'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'

const app = express()
const port = 3000

connectDB();

app.use(express.json());
app.use(authRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})