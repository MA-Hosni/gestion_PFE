import jwt from "jsonwebtoken"
import User from "../models/user.models.js"
import { JWT_SECRET } from "../../../shared/config/index.js"

// Vérifie que l'utilisateur est authentifié
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, JWT_SECRET)

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = user // on ajoute l'utilisateur dans la requête
    next()
  } catch (err) {
    console.error(err)
    res.status(401).json({ message: "Invalid or expired token" })
  }
}

// Vérifie que l'utilisateur a un rôle autorisé
export const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden: insufficient permissions" })
    }

    next()
  }
}
