-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "riksdagsledamot"

CREATE TABLE "riksdagsledamot"
(
 "person_id" bigint NOT NULL,
 "namn"      varchar(50) NOT NULL,
 "parti"     varchar(10) NOT NULL,
 CONSTRAINT "PK_anforandeperson" PRIMARY KEY ( "person_id" )
);




-- ************************************** "voteringar"

CREATE TABLE "voteringar"
(
 "voterings_id" varchar(50) NOT NULL,
 "person_id"    bigint NOT NULL,
 "vot"          varchar(50) NOT NULL,
 "vot_datum"    date NOT NULL,
 CONSTRAINT "PK_voteringar" PRIMARY KEY ( "voterings_id", "person_id" ),
 CONSTRAINT "FK_73" FOREIGN KEY ( "person_id" ) REFERENCES "riksdagsledamot" ( "person_id" )
);



-- ************************************** "anforandetext"

CREATE TABLE "anforandetext"
(
 "anforande_id" varchar(150) NOT NULL,
 "text"         varchar NOT NULL,
 "datum"        date NOT NULL,
 "person_id"    bigint NOT NULL,
 CONSTRAINT "PK_anforande" PRIMARY KEY ( "anforande_id" ),
 CONSTRAINT "FK_20" FOREIGN KEY ( "person_id" ) REFERENCES "riksdagsledamot" ( "person_id" )
);



-- ************************************** "resultat_votering"

CREATE TABLE "resultat_votering"
(
 "voterings_id" varchar(50) NOT NULL,
 "person_id"    bigint NOT NULL,
 "vot"          varchar(50) NOT NULL,
 CONSTRAINT "PK_resultat_votering" PRIMARY KEY ( "voterings_id", "person_id" ),
 CONSTRAINT "FK_84" FOREIGN KEY ( "voterings_id", "person_id" ) REFERENCES "voteringar" ( "voterings_id", "person_id" )
);



-- ************************************** "resultat_sentiment"

CREATE TABLE "resultat_sentiment"
(
 "anforande_id" varchar(150) NOT NULL,
 "resultat"     float NOT NULL,
 CONSTRAINT "PK_resultat" PRIMARY KEY ( "anforande_id" ),
 CONSTRAINT "FK_31" FOREIGN KEY ( "anforande_id" ) REFERENCES "anforandetext" ( "anforande_id" )
);








