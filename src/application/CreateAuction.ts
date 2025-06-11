import crypto from "crypto";
import Auction from "../domain/Auction";
import AuctionRepository from "../infra/repository/AuctionRepository";

export default class CreateAuction {
  constructor(readonly auctionRepository: AuctionRepository) {}

  async execute(input: Input): Promise<Output> {
    const auctionId = crypto.randomUUID();
    const auction = new Auction(
      auctionId,
      input.startDate,
      input.endDate,
      input.minIncrementAmount,
      input.startAmount
    );
    await this.auctionRepository.save(auction);
    return { auctionId };
  }
}

type Input = {
  startDate: Date;
  endDate: Date;
  minIncrementAmount: number;
  startAmount: number;
};

type Output = {
  auctionId: string;
};
