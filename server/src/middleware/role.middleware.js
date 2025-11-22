// middleware/role.middleware.js
import { apiError } from "../utils/apiError.js";

export const verifyAdmin = (req, res, next) => {
    try {
        // `verifyJwt` runs first → sets `req.user`
        if (!req.user) {
            return res.status(401).json(new apiError(401, "Unauthorized: No user found"));
        }

        if (req.user.role !== "admin") {
            return res.status(403).json(new apiError(403, "Forbidden: Admins only"));
        }

        next();
    } catch (error) {
        return res.status(500).json(new apiError(500, "Role verification failed"));
    }
};
