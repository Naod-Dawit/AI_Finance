
import { Request } from "express";

interface CustomrRequest extends Request {

  user?: {
    id: string;  
    email?: string;
  };
}
