--
-- PostgreSQL database dump
--

-- Dumped from database version 11.5
-- Dumped by pg_dump version 12.2

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

--
-- Name: anforandetext; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.anforandetext (
    anforande_id character varying(150) NOT NULL,
    text character varying NOT NULL,
    dokument_id character varying(50) NOT NULL,
    datum date NOT NULL,
    person_id bigint NOT NULL
);


ALTER TABLE public.anforandetext OWNER TO root;

--
-- Name: resultat_sentiment; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.resultat_sentiment (
    anforande_id character varying(150) NOT NULL,
    resultat double precision NOT NULL
);


ALTER TABLE public.resultat_sentiment OWNER TO root;

--
-- Name: riksdagsledamot; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.riksdagsledamot (
    person_id bigint NOT NULL,
    namn character varying(50) NOT NULL,
    parti character varying(10) NOT NULL
);


ALTER TABLE public.riksdagsledamot OWNER TO root;

--
-- Name: anforandetext pk_anforande; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.anforandetext
    ADD CONSTRAINT pk_anforande PRIMARY KEY (anforande_id);


--
-- Name: riksdagsledamot pk_anforandeperson; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.riksdagsledamot
    ADD CONSTRAINT pk_anforandeperson PRIMARY KEY (person_id);


--
-- Name: resultat_sentiment pk_resultat; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.resultat_sentiment
    ADD CONSTRAINT pk_resultat PRIMARY KEY (anforande_id);


--
-- Name: fkidx_20; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX fkidx_20 ON public.anforandetext USING btree (person_id);


--
-- Name: fkidx_31; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX fkidx_31 ON public.resultat_sentiment USING btree (anforande_id);


--
-- Name: anforandetext fk_20; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.anforandetext
    ADD CONSTRAINT fk_20 FOREIGN KEY (person_id) REFERENCES public.riksdagsledamot(person_id);


--
-- Name: resultat_sentiment fk_31; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.resultat_sentiment
    ADD CONSTRAINT fk_31 FOREIGN KEY (anforande_id) REFERENCES public.anforandetext(anforande_id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: root
--

REVOKE ALL ON SCHEMA public FROM rdsadmin;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO root;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

