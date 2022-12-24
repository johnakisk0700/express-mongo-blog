import { NextFunction, Request, Response } from 'express';
import { TODO } from '../types';
import { FreebirthError } from './FreebirthError';

const errorHandler = (err: TODO, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof FreebirthError) res.status(err.statusCode).json({ msg: err.message });
    res.status(500).json({ msg: err.message });
};
export default errorHandler;
