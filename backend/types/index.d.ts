// import { Request } from "express";

// declare module "express" {
//     interface Request {
//       user?: {
//         user: string;
//       };
//     }}

import { Request } from "express";

interface CustomrRequest extends Request {
  user?: {
    user: string;
  };
}
