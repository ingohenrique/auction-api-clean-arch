import Bid from "../domain/Bid";

export default class Auction {
  constructor(
    public auctionId: string,
    public startDate: Date,
    public endDate: Date,
    public minIncrementAmount: number,
    public startAmount: number
  ) {}

  validateBid(bid: Bid, highestBid: Bid) {
    if (bid.date.getTime() > this.endDate.getTime()) {
      throw new Error("Auction already ended");
    }
    if (highestBid && highestBid.amount > bid.amount) {
      throw new Error("Bid amount must be greater than the highest bid");
    }
    if (highestBid && highestBid.customer === bid.customer) {
      throw new Error(
        "Auction does not accept sequential bids from the same customer"
      );
    }
    return true;
  }
}
