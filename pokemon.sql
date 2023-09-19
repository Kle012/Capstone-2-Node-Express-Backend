\echo 'Delete and recreate pokemon db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE pokemon;
CREATE DATABASE pokemon;
\connect pokemon

\i pokemon-schema.sql
\i pokemon-seed.sql

\echo 'Delete and recreate pokemon_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE pokemon_test;
CREATE DATABASE pokemon_test;
\connect pokemon_test

\i pokemon-schema.sql