import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { accessChat, createGroupChat, fetchChat, renameGroup, addToGroup, removeFromGroup } from "../controllers/chat.controller.js";

const router = Router()

router.route("/").post(verifyJWT, accessChat)
router.route("/").get(verifyJWT, fetchChat)
router.route("/group").post(verifyJWT, createGroupChat)
router.route("/rename").put(verifyJWT, renameGroup)
router.route("/userAdd").put(verifyJWT, addToGroup)
router.route("/userRemove").put(verifyJWT, removeFromGroup)


export default router