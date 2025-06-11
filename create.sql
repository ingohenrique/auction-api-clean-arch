drop schema if exists girao cascade;

create schema girao;

create table girao.auction (
    auction_id uuid,
    start_date timestamptz,
    end_date timestamptz,
    min_increment_amount numeric,
    start_amount numeric
);

create table girao.bid (
    bid_id uuid,
    auction_id uuid,
    customer text,
    amount numeric,
    bid_date timestamptz
);