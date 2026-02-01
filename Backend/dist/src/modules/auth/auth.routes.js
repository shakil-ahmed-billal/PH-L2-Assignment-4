import { Router } from "express";
import { authController } from "./auth.controller";
const router = Router();
router.post("/register", authController.providerRegister);
export const authRouter = router;
//# sourceMappingURL=auth.routes.js.map