create table users (
    id serial primary key,
    email varchar(255) not null unique,
    first_name varchar(100) not null,
    last_name varchar(100) not null
);

INSERT INTO users(email, first_name, last_name) VALUES ('simon@svenskkod.io', 'Simon', 'Forssell');

create table types (
    id serial primary key,
    custom_fields jsonb not null
);

create table lists (
    id serial primary key,
    owner_id integer references users(id),
    name varchar(255) not null,
    frozen boolean not null default false
);

create table members (
    user_id integer references users(id),
    list_id integer references lists(id),
    owner boolean not null default false,
    primary key (user_id, list_id)
);

create table items (
    id serial primary key,
    list_id integer references lists(id) not null,
    index integer not null,
    parent_id integer references items(id),
    type_id integer references types(id),
    description text,
    name text,
    done boolean not null default false,
    custom_fields jsonb
);

