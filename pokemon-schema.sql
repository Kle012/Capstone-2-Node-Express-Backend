CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1)
);

CREATE TABLE favorites (
    user_id VARCHAR(25)
        REFERENCES users ON DELETE CASCADE,
    pokemon_id INTEGER,
    PRIMARY KEY (user_id)
);

