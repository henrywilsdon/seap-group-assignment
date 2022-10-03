--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: athletes; Type: TABLE; Schema: public; Owner: zoestevens
--

CREATE TABLE public.athletes (
    athlete_id character(8) NOT NULL,
    firstname character varying,
    lastname character varying,
    height_cm integer,
    weight_kg double precision,
    cp_watts integer,
    wdash_joules integer
);


ALTER TABLE public.athletes OWNER TO zoestevens;

--
-- Name: users; Type: TABLE; Schema: public; Owner: zoestevens
--

CREATE TABLE public.users (
    user_id character(8) NOT NULL,
    firstname character varying,
    lastname character varying,
    email character varying,
    password character varying
);


ALTER TABLE public.users OWNER TO zoestevens;

--
-- Data for Name: athletes; Type: TABLE DATA; Schema: public; Owner: zoestevens
--

COPY public.athletes (athlete_id, firstname, lastname, height_cm, weight_kg, cp_watts, wdash_joules) FROM stdin;
abcd1234	John	Stanley	172	86.1	430	35000
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: zoestevens
--

COPY public.users (user_id, firstname, lastname, email, password) FROM stdin;
0000001a	Mary	Smith	MSmith123@gmail.com	MSmith123
0000002a	Andrew	Strange	andystrange01@gmail.com	andystrange01
0000003a	Nic	Ashe	Nic30Ashe@gmail.com	Nic30Ashe
0000004a	Valarie	Rigby	VRigby99@gmail.com	VRigby99
0000005a	Jodie	Fitzroy	JFitzroy11@gmail.com	JFitzroy11
0000006a	Benjamin	Holland	Ben77Holland@gmail.com	Ben77Holland
0000007a	Deana	Platt	DeanaPlatt05@gmail.com	DeanaPlatt05
0000008a	Shaun	Kay	Shaunkay123@gmail.com	Shaunkay123
0000009a	Ollie	Lane	OLane33@gmail.com	OLane33
0000010a	Levi	West	Levi88West@gmail.com	Levi88West
\.


--
-- Name: athletes athletes_pkey; Type: CONSTRAINT; Schema: public; Owner: zoestevens
--

ALTER TABLE ONLY public.athletes
    ADD CONSTRAINT athletes_pkey PRIMARY KEY (athlete_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: zoestevens
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- PostgreSQL database dump complete
--

