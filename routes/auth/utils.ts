import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { tokenInfo } from "../../config";
import { InternalError } from "../../core/ApiErrors";

export interface ITokenPayload {
  username: string;
  id: Types.ObjectId;
  issuer: string;
  audience: string;
}

export const createTokens = (username: string, id: Types.ObjectId) => {
  const payload: ITokenPayload = {
    username,
    id,
    issuer: tokenInfo.issuer,
    audience: tokenInfo.audience,
  };

  const accessToken = jwt.sign(payload, tokenInfo.secret);
  const refreshToken = jwt.sign(payload, tokenInfo.refreshSecret);
  if (!accessToken || !refreshToken)
    throw new InternalError("Failed to create tokens.");

  return { accessToken, refreshToken };
};
