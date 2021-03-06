import dotenv from "dotenv"
import express from "express"
// import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"

import postRoutes from "./routes/posts.js"
import userRoutes from "./routes/users.js"

const app = express()
dotenv.config()

app.use(express.json({ limit: "30mb", extended: true }))
app.use(express.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())

app.use("/posts", postRoutes)
app.use("/user", userRoutes)

app.get("/", (req, res) => {
	res.send("Hello, Welcome To Memories API")
})

const CONNECTION_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT || 5000

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server Running On Port ${PORT}`)
		})
	})
	.catch((error) => {
		console.log(error.message)
	})
