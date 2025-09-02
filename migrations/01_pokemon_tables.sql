create table pokemon_products (
  id serial primary key,
  product_set text,
  product_name text not null,
  pricecharting_slug text not null unique
);

comment on column pokemon_products.pricecharting_slug is 'should include leading slash, for example: /game/pokemon-white-flare/elite-trainer-box';

insert into pokemon_products (product_set, product_name, pricecharting_slug) values
  ('Black Bolt', 'Elite Trainer Box', '/game/pokemon-black-bolt/elite-trainer-box'),
  ('White Flare', 'Elite Trainer Box', '/game/pokemon-white-flare/elite-trainer-box'),
  ('Destined Rivals', 'Mewtwo Collection', '/game/pokemon-destined-rivals/team-rocket''s-mewtwo-ex-box'),
  ('Scarlet & Violet Promo', 'Charizard EX Collection', '/game/pokemon-promo/charizard-ex-special-collection-box'),
  ('Brilliant Stars', 'Leafeon 3P Blister', '/game/pokemon-brilliant-stars/leafeon-3-pack-blister'),
  ('Brilliant Stars', 'Glaceon 3P Blister', '/game/pokemon-brilliant-stars/glaceon-3-pack-blister'),
  ('Black Bolt', 'Tech Sticker Collection', '/game/pokemon-black-bolt/tech-sticker-collection'),
  ('White Flare', 'Tech Sticker Collection', '/game/pokemon-white-flare/tech-sticker-collection'),
  ('Shining Fates', 'Elite Trainer Box', '/game/pokemon-shining-fates/elite-trainer-box'),
  ('Lost Origin', 'Booster Bundle', '/game/pokemon-lost-origin/booster-bundle'),
  ('Paldean Fates', 'Charizard Special Tin', '/game/pokemon-paldean-fates/sealed-charizard-ex-tin'),
  ('Black Bolt', 'Booster Bundle', '/game/pokemon-black-bolt/booster-bundle'),
  ('White Flare', 'Booster Bundle', '/game/pokemon-white-flare/booster-bundle');

create table pokemon_purchases (
  id serial primary key,
  product_id integer not null,
  quantity integer not null check (quantity > 0),
  unit_price decimal(10, 2) not null,
  store_bought text,

  foreign key (product_id) references pokemon_products(id)
);

comment on column pokemon_purchases.unit_price is 'price in nok';
