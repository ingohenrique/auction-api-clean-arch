import Auction from "../../domain/Auction";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface AuctionRepository {
  save(auction: Auction): Promise<void>;
  get(auctionId: string): Promise<Auction>;
}

export class AuctionRepositoryDatabase implements AuctionRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async save(auction: Auction): Promise<void> {
    await this.connection.query(
      "insert into girao.auction (auction_id, start_date, end_date, min_increment_amount, start_amount) values ($1, $2, $3, $4, $5)",
      [
        auction.auctionId,
        auction.startDate,
        auction.endDate,
        auction.minIncrementAmount,
        auction.startAmount,
      ]
    );
  }

  async get(auctionId: string): Promise<Auction> {
    const [auction] = await this.connection.query(
      "select * from girao.auction where auction_id = $1",
      [auctionId]
    );
    if (!auction) throw new Error("Auction not found");
    return new Auction(
      auction.auction_id,
      auction.start_date,
      auction.end_date,
      auction.min_increment_amount,
      auction.start_amount
    );
  }
}
