import { Router } from "express";
import { registerUser, loginUser, getUsers } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/').post(registerUser).get(verifyJWT, getUsers)
router.route('/login').post(loginUser)


export default router