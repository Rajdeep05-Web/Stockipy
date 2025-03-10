import Router from 'express';
import { logInUser, logOutUser, signUpUser, reGenerateAccessToken } from '../controllers/authController.js';

const authRouter = Router();
authRouter.post('/v1/auth/signup', signUpUser);
authRouter.post('/v1/auth/login', logInUser);
authRouter.post("/v1/auth/regenerate-access-token", reGenerateAccessToken);
authRouter.put('/v1/auth/logout/:id', logOutUser);

export default authRouter;