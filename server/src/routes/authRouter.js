import Router from 'express';
import { logInUser, logOutUser, signUpUser } from '../controllers/authController.js';

const authRouter = Router();
authRouter.post('/v1/auth/signup', signUpUser);
authRouter.post('/v1/auth/login', logInUser);
authRouter.delete('/v1/auth/logout', logOutUser);

export default authRouter;