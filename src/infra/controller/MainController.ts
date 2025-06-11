import CreateAuction from "../../application/CreateAuction";
import CreateBid from "../../application/CreateBid";
import HttpServer from "../http/HttpServer";
import GetAuction from "../../application/GetAuction";

export default class MainController {
  constructor(
    readonly httpServer: HttpServer,
    readonly createAuction: CreateAuction,
    readonly createBid: CreateBid,
    readonly getAuction: GetAuction
  ) {
    httpServer.register("post", "/auctions", async (params: any, body: any) => {
      const input = body;
      input.startDate = new Date(input.startDate);
      input.endDate = new Date(input.endDate);
      const output = await createAuction.execute(input);
      return output;
    });

    httpServer.register("post", "/bids", async (params: any, body: any) => {
      const input = body;
      input.date = new Date(input.date);
      const output = await createBid.execute(input);
      return output;
    });

    httpServer.register(
      "get",
      "/auctions/:auctionId",
      async (params: any, body: any) => {
        const auctionId = params.auctionId;
        const output = await getAuction.execute(auctionId);
        return output;
      }
    );
  }
}
