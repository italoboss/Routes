PGDMP                           u            routesDB    9.5.3    9.5.3 !    T           0    0    ENCODING    ENCODING         SET client_encoding = 'LATIN1';
                       false            U           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false            V           1262    16427    routesDB    DATABASE     �   CREATE DATABASE "routesDB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'Portuguese_Brazil.1252' LC_CTYPE = 'Portuguese_Brazil.1252';
    DROP DATABASE "routesDB";
             postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
             postgres    false            W           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                  postgres    false    6            X           0    0    public    ACL     �   REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;
                  postgres    false    6                        3079    12355    plpgsql 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
    DROP EXTENSION plpgsql;
                  false            Y           0    0    EXTENSION plpgsql    COMMENT     @   COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';
                       false    1            �            1259    16440    routes    TABLE     �   CREATE TABLE routes (
    id integer NOT NULL,
    name character varying(40),
    vehicle_id integer,
    path text,
    user_id integer NOT NULL,
    route_date timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
    DROP TABLE public.routes;
       public         postgres    false    6            �            1259    16438    routes_id_seq    SEQUENCE     o   CREATE SEQUENCE routes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.routes_id_seq;
       public       postgres    false    6    184            Z           0    0    routes_id_seq    SEQUENCE OWNED BY     1   ALTER SEQUENCE routes_id_seq OWNED BY routes.id;
            public       postgres    false    183            �            1259    16453    stops    TABLE     �   CREATE TABLE stops (
    id integer NOT NULL,
    name character varying(40),
    lat double precision NOT NULL,
    lng double precision NOT NULL,
    route_id integer NOT NULL
);
    DROP TABLE public.stops;
       public         postgres    false    6            �            1259    16451    stops_id_seq    SEQUENCE     n   CREATE SEQUENCE stops_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.stops_id_seq;
       public       postgres    false    6    186            [           0    0    stops_id_seq    SEQUENCE OWNED BY     /   ALTER SEQUENCE stops_id_seq OWNED BY stops.id;
            public       postgres    false    185            �            1259    16430    users    TABLE     �   CREATE TABLE users (
    id integer NOT NULL,
    login character varying(30) NOT NULL,
    password character varying(40) NOT NULL
);
    DROP TABLE public.users;
       public         postgres    false    6            �            1259    16428    users_id_seq    SEQUENCE     n   CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public       postgres    false    6    182            \           0    0    users_id_seq    SEQUENCE OWNED BY     /   ALTER SEQUENCE users_id_seq OWNED BY users.id;
            public       postgres    false    181            �           2604    16443    id    DEFAULT     X   ALTER TABLE ONLY routes ALTER COLUMN id SET DEFAULT nextval('routes_id_seq'::regclass);
 8   ALTER TABLE public.routes ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    183    184    184            �           2604    16456    id    DEFAULT     V   ALTER TABLE ONLY stops ALTER COLUMN id SET DEFAULT nextval('stops_id_seq'::regclass);
 7   ALTER TABLE public.stops ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    186    185    186            �           2604    16433    id    DEFAULT     V   ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    181    182    182            O          0    16440    routes 
   TABLE DATA               J   COPY routes (id, name, vehicle_id, path, user_id, route_date) FROM stdin;
    public       postgres    false    184   �       ]           0    0    routes_id_seq    SEQUENCE SET     5   SELECT pg_catalog.setval('routes_id_seq', 14, true);
            public       postgres    false    183            Q          0    16453    stops 
   TABLE DATA               6   COPY stops (id, name, lat, lng, route_id) FROM stdin;
    public       postgres    false    186           ^           0    0    stops_id_seq    SEQUENCE SET     3   SELECT pg_catalog.setval('stops_id_seq', 8, true);
            public       postgres    false    185            M          0    16430    users 
   TABLE DATA               -   COPY users (id, login, password) FROM stdin;
    public       postgres    false    182   �        _           0    0    users_id_seq    SEQUENCE SET     3   SELECT pg_catalog.setval('users_id_seq', 2, true);
            public       postgres    false    181            �           2606    16448    route_pk 
   CONSTRAINT     F   ALTER TABLE ONLY routes
    ADD CONSTRAINT route_pk PRIMARY KEY (id);
 9   ALTER TABLE ONLY public.routes DROP CONSTRAINT route_pk;
       public         postgres    false    184    184            �           2606    16458    stop_id 
   CONSTRAINT     D   ALTER TABLE ONLY stops
    ADD CONSTRAINT stop_id PRIMARY KEY (id);
 7   ALTER TABLE ONLY public.stops DROP CONSTRAINT stop_id;
       public         postgres    false    186    186            �           2606    16437    un_login 
   CONSTRAINT     C   ALTER TABLE ONLY users
    ADD CONSTRAINT un_login UNIQUE (login);
 8   ALTER TABLE ONLY public.users DROP CONSTRAINT un_login;
       public         postgres    false    182    182            �           2606    16450    un_name 
   CONSTRAINT     B   ALTER TABLE ONLY routes
    ADD CONSTRAINT un_name UNIQUE (name);
 8   ALTER TABLE ONLY public.routes DROP CONSTRAINT un_name;
       public         postgres    false    184    184            �           2606    16435    user_pk 
   CONSTRAINT     D   ALTER TABLE ONLY users
    ADD CONSTRAINT user_pk PRIMARY KEY (id);
 7   ALTER TABLE ONLY public.users DROP CONSTRAINT user_pk;
       public         postgres    false    182    182            �           2606    16478    fk_route    FK CONSTRAINT     s   ALTER TABLE ONLY stops
    ADD CONSTRAINT fk_route FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE;
 8   ALTER TABLE ONLY public.stops DROP CONSTRAINT fk_route;
       public       postgres    false    186    2003    184            �           2606    16464    user_pk    FK CONSTRAINT     _   ALTER TABLE ONLY routes
    ADD CONSTRAINT user_pk FOREIGN KEY (user_id) REFERENCES users(id);
 8   ALTER TABLE ONLY public.routes DROP CONSTRAINT user_pk;
       public       postgres    false    184    182    2001            O   O   x�]ʱ� �:����?�CXX�8����zv6�z���u$dn4D����0̇�Υ6E�.�����Ž��΢�7o�      Q   w   x�Uλ1�ت���{+A$Dd���̍�p�7���c=��f�ja�D��>���������8��w���R�̑���y��5�0/f�'��Bc(�1�|�b, �~Խ��.u      M   '   x�3�,-N-r�442615�2s�8�LM���b���� ���     