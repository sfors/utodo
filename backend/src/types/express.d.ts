import Express, {Request} from "express";
declare global {
    namespace Express {
        interface Request {
            identity?: string;
        }
    }
}