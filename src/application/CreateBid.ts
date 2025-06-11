import Bid from "../domain/Bid";
import Mediator from "../infra/mediator/Mediator";
import AuctionRepository from "../infra/repository/AuctionRepository";
import BidRepository from "../infra/repository/BidRepository";
import crypto from "crypto";

export default class CreateBid {
  constructor(
    readonly auctionRepository: AuctionRepository,
    readonly bidRepository: BidRepository,
    readonly mediator: Mediator
  ) {}

  async execute(input: Input): Promise<Output> {
    const bid = new Bid(
      crypto.randomUUID(),
      input.auctionId,
      input.customer,
      input.amount,
      input.date
    );

    const auction = await this.auctionRepository.get(input.auctionId);
    if (!auction) {
      throw new Error("Auction not found");
    }
    const highestBid = await this.bidRepository.getHighestBidByAuctionId(
      input.auctionId
    );

    auction.validateBid(bid, highestBid);

    await this.bidRepository.save(bid);
    await this.mediator.notify("bid_created", bid);
    return { bidId: bid.bidId };
  }
}

type Input = {
  auctionId: string;
  customer: string;
  amount: number;
  date: Date;
};

type Output = {
  bidId: string;
};
