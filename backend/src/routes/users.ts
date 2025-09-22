import express, {Router} from 'express';
import {requireAuth} from "../auth/middleware.js";

const router: Router = express.Router();

router.use(express.json());
router.use(requireAuth);


export default router;
