import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserData, storeRecentSearchedCities, createOrUpdateUser, updateUserRole } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", protect, getUserData);
userRouter.post("/store-recent-search", protect, storeRecentSearchedCities);
userRouter.post("/create-or-update", createOrUpdateUser);
// Allow update-role without authentication for development/testing
userRouter.put("/update-role", updateUserRole);

export default userRouter;
