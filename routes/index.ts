import { Router } from "express";
import auth from "./auth/auth";
import categories from "./categories/categories";
import post from "./post/post";
import subscriptions from "./subscriptions/subscriptions";
import comments from "./comments/comments";

const router = Router();

router.use("/api/auth", auth);
router.use("/api/categories", categories);
router.use("/api/posts", post);
router.use("/api/comments", comments);
router.use("/api/subscriptions", subscriptions);

export default router;
