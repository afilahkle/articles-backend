import { Injectable, NestMiddleware } from "@nestjs/common";
import { verify } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { ExpressRequest } from "src/types/expressRequest.interface.";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {

  }
  async use(req: ExpressRequest, _: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return // just to be on the safe side, next() already will take care or that, but just in case!
    }

    const token = req.headers.authorization.replace('Token ', '');

    try {
      const decode = verify(token, this.configService.get('JWT_SECRET'))
      const user = await this.userService.findById(decode.id)
      req.user = user;
      next();
    } catch {
      req.user = null;
      next();
    }
  }
}