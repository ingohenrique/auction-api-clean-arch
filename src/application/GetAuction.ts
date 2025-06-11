import AuctionRepository from "../infra/repository/AuctionRepository";
import BidRepository from "../infra/repository/BidRepository";

export default class GetAuction {
  constructor(
    readonly auctionRepository: AuctionRepository,
    readonly bidRepository: BidRepository
  ) {}

  async execute(auctionId: string): Promise<Output> {
    const auction = await this.auctionRepository.get(auctionId);
    const highestBid = await this.bidRepository.getHighestBidByAuctionId(
      auctionId
    );
    return {
      auctionId: auction.auctionId,
      highestBid,
    };
  }
}

type Input = {
  auctionId: string;
};

type Output = {
  auctionId: string;
  highestBid: {
    customer: string;
    amount: number;
  };
};
