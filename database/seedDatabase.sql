-- RUN USING THIS COMMAND IN COMMAND PROMPT:
-- " psql -d snake -a -f ./database/seedDatabase.sql "

DROP DATABASE IF EXISTS snake;

CREATE DATABASE snake;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS games;

CREATE TABLE users(
  id serial PRIMARY KEY,
  phone_id VARCHAR NOT NULL UNIQUE,
  username VARCHAR NOT NULL UNIQUE,
  password_hash VARCHAR NOT NULL,
  email VARCHAR UNIQUE,
  created_ts TIMESTAMPTZ default NOW(),
  last_updated_ts TIMESTAMPTZ
);

CREATE TABLE games(
  id serial PRIMARY KEY,
  score int NOT NULL,
  num_of_touches int NOT NULL,
  played_on_ts TIMESTAMPTZ default NOW(),
  user_id int REFERENCES users(id)
);

INSERT INTO users (phone_id, username, password_hash, email, created_ts, last_updated_ts)
VALUES 
  ('iphone1234', 'bobuser', 'INSERT HASH HERE', 'bob@user.com', '2019-06-18 04:10:25-07', '2019-07-18 09:10:25-07'),
  ('android4321', 'billuser', 'INSERT HASH HERE', 'bill@user.com', '2019-06-11 04:10:25-07', '2019-07-18 09:10:25-07');

INSERT INTO games (score, num_of_touches, played_on_ts, user_id)
VALUES 
  (1234, 13, '2019-07-01 05:55:55-07', 1),
  (2345, 29, '2019-07-02 05:55:55-07', 1),
  (4443, 44, '2019-07-03 05:55:55-07', 1),
  (3000, 10, '2019-07-04 05:55:55-07', 2);