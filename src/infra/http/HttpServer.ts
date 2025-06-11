import express, { Request, Response } from "express";

export default interface HttpServer {
  register(method: string, url: string, callback: (params: any) => void): void;
  listen(port: number): void;
}

export default class ExpressAdapter implements HttpServer {
  app: any;

  constructor() {
    this.app = express();
    this.app.use(express.json());
  }

  register(method: string, url: string, callback: Function): void {
    this.app[method](url, async (req: Request, res: Response) => {
      try {
        const output = await callback(req.params, req.body);
        res.json(output);
      } catch (error: any) {
        res.status(422).json({
          error: error.message,
        });
      }
    });
  }

  listen(port: number): void {
    this.app.listen(port);
  }
}
