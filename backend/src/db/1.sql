create table users (
    id uuid primary key,
    email varchar(255) not null unique,
    first_name varchar(100) not null,
    last_name varchar(100) not null
);

create table types (
    id uuid primary key,
    custom_fields jsonb not null
);

create table lists (
    id uuid primary key,
    owner_id uuid references users(id),
    name varchar(255) not null,
    frozen boolean not null default false
);

create table members (
    user_id uuid references users(id),
    list_id uuid references lists(id),
    owner boolean not null default false,
    primary key (user_id, list_id)
);

create table items (
    id uuid primary key,
    list_id uuid references lists(id) not null,
    index integer not null,
    parent_id uuid references items(id),
    type_id uuid references types(id),
    description text,
    name text,
    done boolean not null default false,
    custom_fields jsonb
);

