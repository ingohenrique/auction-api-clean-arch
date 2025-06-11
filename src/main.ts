import WebSocket, { Server } from "ws";
import { AuctionRepositoryDatabase } from "./infra/repository/AuctionRepository";
import { BidRepositoryDatabase } from "./infra/repository/BidRepository";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import CreateAuction from "./application/CreateAuction";
import CreateBid from "./application/CreateBid";
import GetAuction from "./application/GetAuction";
import MainController from "./infra/controller/MainController";
import Mediator from "./infra/mediator/Mediator";
import ExpressAdapter from "./infra/http/HttpServer";

const wss = new WebSocket.Server({ port: 8080 });
const connections: any = [];

wss.on("connection", (ws) => {
  connections.push(ws);
});

const connection = new PgPromiseAdapter();
const mediator = new Mediator();
mediator.register("bid_created", (bid: any) => {
  for (const connection of connections) {
    connection.send(Buffer.from(JSON.stringify(bid)));
  }
});
const auctionRepository = new AuctionRepositoryDatabase(connection);
const bidRepository = new BidRepositoryDatabase(connection);
const createAuction = new CreateAuction(auctionRepository);
const createBid = new CreateBid(auctionRepository, bidRepository, mediator);
const getAuction = new GetAuction(auctionRepository, bidRepository);
const httpServer = new ExpressAdapter();

new MainController(httpServer, createAuction, createBid, getAuction);

httpServer.listen(3000);
