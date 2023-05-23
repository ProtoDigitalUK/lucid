import { Request, Response } from "express";
export declare const generateCSRFToken: (res: Response) => string;
export declare const verifyCSRFToken: (req: Request) => boolean;
export declare const clearCSRFToken: (res: Response) => void;
//# sourceMappingURL=csrf.d.ts.map