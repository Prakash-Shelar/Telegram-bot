import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`Incoming message: ${req.body.message}`);
    next();
    this.logger.log(`Outgoing response: ${res.locals.response}`);
  }
}
