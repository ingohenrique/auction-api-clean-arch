import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import { AuctionRepositoryDatabase } from "../src/infra/repository/AuctionRepository";
import { BidRepositoryDatabase } from "../src/infra/repository/BidRepository";
import CreateAuction from "../src/application/CreateAuction";
import CreateBid from "../src/application/CreateBid";
import Mediator from "../src/infra/mediator/Mediator";

test("Must create a new auction and bid three times", async () => {
  const connection = new PgPromiseAdapter();
  const auctionRepository = new AuctionRepositoryDatabase(connection);
  const bidRepository = new BidRepositoryDatabase(connection);
  const createAuction = new CreateAuction(auctionRepository);
  const mediator = new Mediator();
  const createBid = new CreateBid(auctionRepository, bidRepository, mediator);

  const inputCreateAuction = {
    startDate: new Date("2025-03-01T10:00:00Z"),
    endDate: new Date("2025-03-01T12:00:00Z"),
    minIncrementAmount: 10,
    startAmount: 1000,
  };

  const outputCreateAuction = await createAuction.execute(inputCreateAuction);
  expect(outputCreateAuction.auctionId).toBeDefined();

  const inputCreateBid1 = {
    auctionId: outputCreateAuction.auctionId,
    customer: "John Doe",
    amount: 1000,
    date: new Date("2025-03-01T11:00:00Z"),
  };

  const outputCreateBid1 = await createBid.execute(inputCreateBid1);
  expect(outputCreateBid1.bidId).toBeDefined();

  await connection.close();
});
