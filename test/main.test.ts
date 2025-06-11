import axios from "axios";
import WebSocket, { Server } from "ws";

axios.defaults.validateStatus = () => true;

let ws: WebSocket;
let messages: any = [];

beforeEach(async () => {
  ws = new WebSocket("ws://localhost:8080");

  ws.on("message", (message) => {
    messages.push(JSON.parse(message.toString()));
  });
});

test("Must create a new auction and bid three times", async () => {
  const inputAuction = {
    startDate: "2025-03-01T10:00:00Z",
    endDate: "2025-03-01T12:00:00Z",
    minIncrementAmount: 10,
    startAmount: 1000,
  };

  const responseCreateAuction = await axios.post(
    "http://localhost:3000/auctions",
    inputAuction
  );
  const outputCreateAuction = responseCreateAuction.data;
  expect(outputCreateAuction.auctionId).toBeDefined();

  const inputBid1 = {
    auctionId: outputCreateAuction.auctionId,
    customer: "John Doe",
    amount: 1000,
    date: "2025-03-01T11:00:00Z",
  };

  const responseCreateBid1 = await axios.post(
    "http://localhost:3000/bids",
    inputBid1
  );
  const outputCreateBid1 = responseCreateBid1.data;
  expect(outputCreateBid1.bidId).toBeDefined();

  const inputBid2 = {
    auctionId: outputCreateAuction.auctionId,
    customer: "Jane Smith",
    amount: 1010,
    date: "2025-03-01T11:15:00Z",
  };

  const responseCreateBid2 = await axios.post(
    "http://localhost:3000/bids",
    inputBid2
  );
  const outputCreateBid2 = responseCreateBid2.data;
  expect(outputCreateBid2.bidId).toBeDefined();

  const inputBid3 = {
    auctionId: outputCreateAuction.auctionId,
    customer: "Bob Wilson",
    amount: 1100,
    date: "2025-03-01T11:30:00Z",
  };

  const responseCreateBid3 = await axios.post(
    "http://localhost:3000/bids",
    inputBid3
  );
  const outputCreateBid3 = responseCreateBid3.data;
  expect(outputCreateBid3.bidId).toBeDefined();

  const responseGetAuction = await axios.get(
    `http://localhost:3000/auctions/${outputCreateAuction.auctionId}`
  );
  const outputGetAuction = responseGetAuction.data;
  expect(outputGetAuction.highestBid.customer).toBe("Bob Wilson");
  expect(outputGetAuction.highestBid.amount).toBe("1100");
  expect(messages).toHaveLength(3);
  expect(messages[0].customer).toBe("John Doe");
  expect(messages[1].customer).toBe("Jane Smith");
  expect(messages[2].customer).toBe("Bob Wilson");
});

test("Must now allow bid out of time", async () => {
  const inputAuction = {
    startDate: "2025-03-01T10:00:00Z",
    endDate: "2025-03-01T12:00:00Z",
    minIncrementAmount: 10,
    startAmount: 1000,
  };
  const responseCreateAuction = await axios.post(
    "http://localhost:3000/auctions",
    inputAuction
  );
  const outputCreateAuction = responseCreateAuction.data;

  const inputBid1 = {
    auctionId: outputCreateAuction.auctionId,
    customer: "John Doe",
    amount: 1000,
    date: "2025-03-01T14:00:00Z",
  };

  const responseCreateBid1 = await axios.post(
    "http://localhost:3000/bids",
    inputBid1
  );
  expect(responseCreateBid1.status).toBe(422);
  const outputCreateBid1 = responseCreateBid1.data;
  expect(outputCreateBid1.error).toBe("Auction already ended");
});

test("Must now allow bid with amount less than the previous bid", async () => {
  const inputAuction = {
    startDate: "2025-03-01T10:00:00Z",
    endDate: "2025-03-01T12:00:00Z",
    minIncrementAmount: 10,
    startAmount: 1000,
  };
  const responseCreateAuction = await axios.post(
    "http://localhost:3000/auctions",
    inputAuction
  );
  const outputCreateAuction = responseCreateAuction.data;

  const inputBid1 = {
    auctionId: outputCreateAuction.auctionId,
    customer: "John Doe",
    amount: 1100,
    date: "2025-03-01T11:00:00Z",
  };

  const responseCreateBid1 = await axios.post(
    "http://localhost:3000/bids",
    inputBid1
  );

  const inputBid2 = {
    auctionId: outputCreateAuction.auctionId,
    customer: "Jane Smith",
    amount: 1000,
    date: "2025-03-01T11:30:00Z",
  };

  const responseCreateBid2 = await axios.post(
    "http://localhost:3000/bids",
    inputBid2
  );
  expect(responseCreateBid2.status).toBe(422);
  const outputCreateBid2 = responseCreateBid2.data;
  expect(outputCreateBid2.error).toBe(
    "Bid amount must be greater than the highest bid"
  );
});

test("Must now allow two following bids by the same customer", async () => {
  const inputCreateAuction = {
    startDate: "2025-03-01T10:00:00Z",
    endDate: "2025-03-01T12:00:00Z",
    minIncrementAmount: 10,
    startAmount: 1000,
  };

  const responseCreateAuction = await axios.post(
    "http://localhost:3000/auctions",
    inputCreateAuction
  );
  const outputCreateAuction = responseCreateAuction.data;

  const inputBid1 = {
    auctionId: outputCreateAuction.auctionId,
    customer: "John Doe",
    amount: 1000,
    date: "2025-03-01T11:00:00Z",
  };

  await axios.post("http://localhost:3000/bids", inputBid1);

  const inputBid2 = {
    auctionId: outputCreateAuction.auctionId,
    customer: "John Doe",
    amount: 1100,
    date: "2025-03-01T11:00:00Z",
  };

  await axios.post("http://localhost:3000/bids", inputBid2);

  const responseCreateBid2 = await axios.post(
    "http://localhost:3000/bids",
    inputBid2
  );
  expect(responseCreateBid2.status).toBe(422);
  const outputCreateBid2 = responseCreateBid2.data;
  expect(outputCreateBid2.error).toBe(
    "Auction does not accept sequential bids from the same customer"
  );
});

afterEach(async () => {
  ws.close();
});
