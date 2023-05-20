import { NextFunction, Request, Response } from 'express';

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  }

  if (req.xhr) {
    return res.status(401).send('You are not authenticated');
  }

  res.redirect(process.env.AUTH_LOGOUT_REDIRECT);
}
