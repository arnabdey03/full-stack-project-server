import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import User from "../models/user.js"

dotenv.config()

export const signIn = async (req, res) => {
	const { email, password } = req.body

	try {
		const existingUser = await User.findOne({ email })

		if (!existingUser) return res.status(404).json({ message: "User doesn's exist." })

		const isPAsswordCorect = await bcrypt.compare(password, existingUser.password)

		if (!isPAsswordCorect) return res.status(400).json({ mesage: "Invalid Password." })

		const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.AUTHORIZATION_TOKEN_SECRET, { expiresIn: "1h" })

		res.status(200).json({ result: existingUser, token })
	}
	catch (error) {
		res.status(500).json({ message: "Something Went Wrong." })
	}
}

export const signUp = async (req, res) => {
	const { firstName, lastName, email, password, confirmPassword } = req.body

	try {
		const existingUser = await User.findOne({ email })

		if (existingUser) return res.status(400).json({ message: "User Already Exist." })

		if (password !== confirmPassword) return res.status(400).json({ message: "Password Don't Match." })

		const hashedPassword = await bcrypt.hash(password, 10)

		const result = await User.create({ name: `${firstName} ${lastName}`, email, password: hashedPassword })

		const token = jwt.sign({ email: result.email, id: result._id }, process.env.AUTHORIZATION_TOKEN_SECRET, { expiresIn: "1h" })

		res.status(200).json({ result, token })

	} catch (error) {
		res.status(500).json({ error })
	}
}