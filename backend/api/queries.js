const Pool = require("pg").Pool;

/** Connect to db */
const pool = new Pool({
  host: process.env.DBHOST || "localhost",
  port: 5432,
  database: process.env.DBDB || "MVK",
  user: process.env.DBUSER || "postgres",
  password: process.env.DBPASS || "",
});

/** Rank the politicians who are most negative in their
 * speeches according to the sentimentanalysis, SA.
 * Sends response to enter dates for HTTP requests without specified dates,
 * example http://localhost:3000/getMostAbsent*/
const getSAResultMostNegative = (req, res) => {
  if (!req.query.startdate || !req.query.enddate) {
    res.json({
      info:
        "Please enter dates (startdate and enddate) for which you would like to get data between",
    });
  } else {
    let startdate = req.query.startdate;
    let enddate = req.query.enddate;
    // console.log(startdate);
    // console.log(enddate);
    pool.query(
      `SELECT DENSE_RANK () OVER (ORDER BY AVG(resultat_sentiment.resultat) ASC) AS rank, info.person_id, info.parti, info.namn, AVG(resultat_sentiment.resultat) as resultat
        FROM (SELECT person_id, parti, namn, datum, anforande_id FROM anforandetext
        NATURAL JOIN riksdagsledamot) as info
        NATURAL JOIN resultat_sentiment WHERE info.datum > $1
        AND info.datum < $2
        GROUP BY info.person_id, info.parti, info.namn;`,
      [startdate, enddate],
      (error, results) => {
        if (error) {
          res.status(500).json({ error: "error" });
        } else {
          res.status(200).json(results.rows);
        }
      }
    );
  }
};

/** Rank the politicians who are most positive in their
 * speeches according to the sentimentanalysis, SA.
 * Different to getSAResultMostNegative is DENSE_RANK ORDER BY --DESC-- instead of ASC
 * sends response to enter dates for HTTP requests without specified dates,
 * example http://localhost:3000/getMostAbsent*/

const getSAResultMostPositive = (req, res) => {
  if (!req.query.startdate || !req.query.enddate) {
    res.json({
      info:
        "Please enter dates (startdate and enddate) for which you would like to get data between",
    });
  } else {
    let startdate = req.query.startdate;
    let enddate = req.query.enddate;
    pool.query(
      `SELECT DENSE_RANK () OVER (ORDER BY AVG(resultat_sentiment.resultat) DESC) AS rank, info.person_id, info.parti, info.namn, AVG(resultat_sentiment.resultat) as resultat
        FROM (SELECT person_id, parti, namn, datum, anforande_id FROM anforandetext
        NATURAL JOIN riksdagsledamot) as info
        NATURAL JOIN resultat_sentiment WHERE info.datum > $1
        AND info.datum < $2
        GROUP BY info.person_id, info.parti, info.namn;`,
      [startdate, enddate],
      (error, results) => {
        if (error) {
          res.status(500).json({ error: "error" });
        } else {
          res.status(200).json(results.rows);
        }
      }
    );
  }
};

/** Rank the politicians who are most absent.
 * Sends response to enter dates for HTTP requests without specified dates,
 * example http://localhost:3000/getMostAbsent*/
const getMostAbsent = (req, res) => {
  if (!req.query.startdate || !req.query.enddate) {
    res.json({
      info:
        "Please enter dates (startdate and enddate) for which you would like to get data between",
    });
  } else {
    let startdate = req.query.startdate;
    let enddate = req.query.enddate;
    pool.query(
      `SELECT DENSE_RANK () OVER (ORDER BY COUNT(vot) DESC) AS rank, P.person_id, P.parti, P.namn, COUNT(vot) AS resultat
        FROM voteringar as V
        NATURAL JOIN riksdagsledamot as P
        WHERE vot = 'Frånvarande' AND vot_datum > $1
        AND vot_datum < $2
        GROUP BY P.person_id, P.namn, P.parti
        ORDER BY rank;`,
      [startdate, enddate],
      (error, results) => {
        if (error) {
          res.status(500).json({ error: "error" });
        } else {
          res.status(200).json(results.rows);
        }
      }
    );
  }
};

/** Rank the politicians who votes against their own party's modal vot.
 * Sends response to enter dates for HTTP requests without specified dates,
 * example http://localhost:3000/getMostAbsent*/

const getVotedAgainstPartiMode = (req, res) => {
  if (!req.query.startdate || !req.query.enddate) {
    res.json({
      info:
        "Please enter dates (startdate and enddate) for which you would like to get data between",
    });
  } else {
    let startdate = req.query.startdate;
    let enddate = req.query.enddate;
    pool.query(
      `select rank, person_id, parti, namn, resultat from 
      (SELECT DENSE_RANK () OVER (ORDER BY CountPVAPartiMode.CountVA DESC) as rank, CountPVAPartiMode.parti AS parti, CountPVAPartiMode.namn AS namn, CountPVAPartiMode.countVA AS resultat
      FROM (SELECT PVAPartiMode.parti AS parti, PVAPartiMode.namn AS namn, count(namn) as CountVA
      FROM (SELECT P1.parti AS parti, P1.namn AS namn, vot, modal_value, V1.vot_datum AS vot_datum
      FROM voteringar V1
      NATURAL JOIN riksdagsledamot P1
      NATURAL JOIN (SELECT mode() WITHIN GROUP (ORDER BY vot) AS modal_value, P.Parti, voterings_id
      FROM (SELECT voterings_id, person_id, vot FROM voteringar as V WHERE NOT V.vot = 'Frånvarande') as V
      NATURAL JOIN riksdagsledamot as P
      WHERE NOT P.parti = '-'
      GROUP BY voterings_id, P.Parti) PartiMode
      WHERE NOT vot = 'Frånvarande' AND NOT vot = modal_value AND V1.vot_datum > $1 AND V1.vot_datum< $2
      ORDER BY P1.namn) AS PVAPartiMode
      GROUP BY PVAPartiMode.parti, PVAPartiMode.namn) AS CountPVAPartiMode
      GROUP BY CountPVAPartiMode.namn, CountPVAPartiMode.CountVA, countpvapartimode.parti) as nopersonid
      natural join riksdagsledamot;`,
      [startdate, enddate],
      (error, results) => {
        if (error) {
          res.status(500).json({ error: "error" });
        } else {
          res.status(200).json(results.rows);
        }
      }
    );
  }
};

/** Get all ledamoter that has results within a time interval **/
/**
http://localhost:3000/getLedamot?startdate=2019-01-01&enddate=2020-04-09&type=posneg
http://localhost:3000/getLedamot?startdate=2019-01-01&enddate=2020-04-09&type=absent
http://localhost:3000/getLedamot?startdate=2019-01-01&enddate=2020-04-09&type=votedagainst
**/
const getLedamot = (req, res) => {
  if (!req.query.startdate || !req.query.enddate || !req.query.type) {
    res.json({
      info:
        "Please enter dates (startdate and enddate) for which you would like to get data between and what type of results you want to see",
    });
  } else {
    let startdate = req.query.startdate;
    let enddate = req.query.enddate;
    let type = req.query.type;
    // console.log(startdate);
    // console.log(enddate);
    // console.log(type);
    if (type == "posneg") {
      pool.query(
        `select person_id, namn, parti
            from riksdagsledamot r
            where exists
                (select 1 from anforandetext a
                where r.person_id = a.person_id
                and a.datum < $1 and a.datum > $2);`,
        [enddate, startdate],
        (error, results) => {
          if (error) {
            res.status(500).json({ error: "error" });
          } else {
            res.status(200).json(results.rows);
          }
        }
      );
    } else if (type == "absent") {
      pool.query(
        `select person_id, namn, parti
            from riksdagsledamot r
            where exists
                (select 1 from voteringar v
                where v.vot = 'Frånvarande' AND v.vot_datum > $1
                AND v.vot_datum < $2
                and r.person_id = v.person_id
                order by namn);`,
        [startdate, enddate],
        (error, results) => {
          if (error) {
            res.status(500).json({ error: "error" });
          } else {
            res.status(200).json(results.rows);
          }
        }
      );
    } else if (type == "votedagainst") {
      pool.query(
        `select person_id, namn, parti
            from riksdagsledamot r
            natural join
                (SELECT DENSE_RANK () OVER (ORDER BY CountPVAPartiMode.CountVA DESC) as rank, CountPVAPartiMode.parti AS parti, CountPVAPartiMode.namn AS namn, CountPVAPartiMode.countVA AS resultat
                  FROM (SELECT PVAPartiMode.parti AS parti, PVAPartiMode.namn AS namn, count(namn) as CountVA
                  FROM (SELECT P1.parti AS parti, P1.namn AS namn, vot, modal_value, V1.vot_datum AS vot_datum
                  FROM voteringar V1
                  NATURAL JOIN riksdagsledamot P1
                  NATURAL JOIN (SELECT mode() WITHIN GROUP (ORDER BY vot) AS modal_value, P.Parti, voterings_id
                  FROM (SELECT voterings_id, person_id, vot FROM voteringar as V WHERE NOT V.vot = 'Frånvarande') as V
                  NATURAL JOIN riksdagsledamot as P
                  WHERE NOT P.parti = '-'
                  GROUP BY voterings_id, P.Parti) PartiMode
                  WHERE NOT vot = 'Frånvarande' AND NOT vot = modal_value AND V1.vot_datum < $1 AND V1.vot_datum > $2
                  ORDER BY P1.namn) AS PVAPartiMode
                  GROUP BY PVAPartiMode.parti, PVAPartiMode.namn) AS CountPVAPartiMode
                  GROUP BY CountPVAPartiMode.namn, CountPVAPartiMode.CountVA, countpvapartimode.parti) as bar;`,
        [enddate, startdate],
        (error, results) => {
          if (error) {
            res.status(500).json({ error: "error" });
          } else {
            res.status(200).json(results.rows);
          }
        }
      );
    }
  }
};

/** Get daily results for a ledamot
 * Example:
 * http://localhost:3000/getResultOverTime?type=posneg&personid=309480686522
 * http://localhost:3000/getResultOverTime?type=absent&personid=309480686522
 * http://localhost:3000/getResultOverTime?type=votedagainst&personid=309480686522 **/
const getResultOverTime = (req, res) => {
  if (!req.query.type || !req.query.personid) {
    res.json({
      info: "Please enter dates type of result and person_id",
    });
  } else {
    let type = req.query.type;
    let personid = req.query.personid;
    if (type == "posneg") {
      pool.query(
        `select to_char(datum, 'YYYY-MM-DD') as datum, resultat from
                (select date_trunc('day', datum)::date as datum,
                avg(resultat) as resultat, count(1) from
                (select datum, resultat from resultat_sentiment
                    natural join anforandetext
                    natural join riksdagsledamot
                    where person_id = $1) as bar
                    group by 1
                    order by datum) as foo;`,
        [personid],
        (error, results) => {
          if (error) {
            res.status(500).json({ error: "error" });
          } else {
            res.status(200).json(results.rows);
          }
        }
      );
    } else if (type == "absent") {
      pool.query(
        `select to_char(datum, 'YYYY-MM-DD') as datum, resultat from
            (select d.datum, COALESCE(b.resultat,0) as resultat from
                (select generate_series(min(datum), max(datum), '1d')::date as datum from
                    (select date_trunc('day', vot_datum)::date as datum,
                    count(vot) as resultat from
                    (select vot_datum, vot from voteringar
                        where person_id = $1
                        and vot = 'Frånvarande') as foo
                        group by vot_datum
                        order by vot_datum asc) as res
                    order by datum asc) as d

                left join

                (select date_trunc('day', vot_datum)::date as datum,
                count(vot) as resultat from
                (select vot_datum, vot from voteringar
                    where person_id = $1
                    and vot = 'Frånvarande') as foo
                    group by vot_datum
                    order by vot_datum asc) as b on d.datum = b.datum
                group by d.datum, b.resultat
                order by datum asc) as final;`,
        [personid],
        (error, results) => {
          if (error) {
            res.status(500).json({ error: "error" });
          } else {
            res.status(200).json(results.rows);
          }
        }
      );
    } else if (type == "votedagainst") {
      pool.query(
        `select to_char(datum, 'YYYY-MM-DD') as datum, resultat from
            (select d.datum, COALESCE(b.resultat,0) as resultat from
                (select generate_series(min(datum), max(datum), '1d')::date as datum from
                    (select date_trunc('day', vot_datum)::date as datum, count(*) as resultat from
                        (select * from
                            (select voterings_id, vot_datum, parti_vot, vot as personal_vot, parti from voteringar natural join
                                (select voterings_id, vot_datum, vot as parti_vot, parti from
                                    (select distinct on (voterings_id) voterings_id, vot_datum, max(count), vot, parti from
                                        (select voterings_id, vot_datum, vot, count(vot), parti from
                                            (select * from voteringar
                                            natural join riksdagsledamot
                                            where parti =
                                                (select parti from riksdagsledamot
                                                where person_id = $1)) as foo
                                            group by voterings_id, vot_datum, vot, parti) as bar
                                        group by voterings_id, vot, vot_datum, parti
                                        order by voterings_id, max desc) as boo
                                    order by vot_datum asc) as far
                                where person_id = $1
                                order by vot_datum asc) as doo
                            where not personal_vot = parti_vot
                            and not personal_vot = 'Frånvarande'
                            and not parti_vot = 'Frånvarande'
                            and not parti = '-') as dar
                        group by vot_datum order by vot_datum asc) as final) as d

                     left join

                        (select date_trunc('day', vot_datum)::date as datum, count(*) as resultat from
                            (select * from
                                (select voterings_id, vot_datum, parti_vot, vot as personal_vot, parti from voteringar natural join
                                    (select voterings_id, vot_datum, vot as parti_vot, parti from
                                        (select distinct on (voterings_id) voterings_id, vot_datum, max(count), vot, parti from
                                            (select voterings_id, vot_datum, vot, count(vot), parti from
                                                (select * from voteringar
                                                natural join riksdagsledamot
                                                where parti =
                                                    (select parti from riksdagsledamot
                                                    where person_id = $1)) as foo
                                                group by voterings_id, vot_datum, vot, parti) as bar
                                            group by voterings_id, vot, vot_datum, parti
                                            order by voterings_id, max desc) as boo
                                        order by vot_datum asc) as far
                                    where person_id = $1
                                    order by vot_datum asc) as doo
                                where not personal_vot = parti_vot
                                and not personal_vot = 'Frånvarande'
                                and not parti_vot = 'Frånvarande'
                                and not parti = '-') as dar
                            group by vot_datum order by vot_datum asc) as b on d.datum = b.datum
                        group by d.datum, b.resultat
                        order by datum asc) as final;`,
        [personid],
        (error, results) => {
          if (error) {
            res.status(500).json({ error: "error" });
          } else {
            res.status(200).json(results.rows);
          }
        }
      );
    }
  }
};

/** Get daily results by party
 * Example
 * http://localhost:3000/getResultOverTimeParty?type=posneg&party=S
 * http://localhost:3000/getResultOverTimeParty?type=absent&party=S
 * http://localhost:3000/getResultOverTimeParty?type=votedagainst&party=S **/
const getResultOverTimeParty = (req, res) => {
  if (!req.query.type || !req.query.party) {
    res.json({
      info: "Please enter dates type of result and person_id",
    });
  } else {
    let type = req.query.type;
    let party = req.query.party;
    if (type == "posneg") {
      pool.query(
        `select to_char(datum, 'YYYY-MM-DD') as datum, resultat from
                (select date_trunc('day', datum)::date as datum, avg(resultat) as resultat, count(1) from
                    (select datum, resultat from resultat_sentiment
                    natural join anforandetext natural join riksdagsledamot
                    where parti = $1) as bar
                group by 1
                order by datum) as foo;`,
        [party],
        (error, results) => {
          if (error) {
            res.status(500).json({ error: "error" });
          } else {
            res.status(200).json(results.rows);
          }
        }
      );
    } else if (type == "absent") {
      pool.query(
        `select to_char(datum, 'YYYY-MM-DD') as datum, resultat from
                (select date_trunc('day', vot_datum)::date as datum, count(vot) as resultat from
                    (select vot_datum, vot from voteringar
                    natural join riksdagsledamot
                    where parti = $1
                    and vot = 'Frånvarande') as foo
                group by vot_datum
                order by vot_datum asc) as bar;`,
        [party],
        (error, results) => {
          if (error) {
            res.status(500).json({ error: "error" });
          } else {
            res.status(200).json(results.rows);
          }
        }
      );
    } else if (type == "votedagainst") {
      pool.query(
        `select to_char(datum, 'YYYY-MM-DD') as datum, resultat from
                (select date_trunc('day', vot_datum)::date as datum, count(*) as resultat from
                    (select vot_id as voterings_id, vot as personal_vot, parti_vot, p as parti, vot_datum from
                        (select * from
                            (select voterings_id as vot_id, person_id, vot, parti as p from voteringar
                            natural join riksdagsledamot
                            where parti = $1) as dar
                            cross join
                            (select voterings_id, vot_datum, vot as parti_vot, parti from
                                (select distinct on (voterings_id) voterings_id, vot_datum, max(count), vot, parti from
                                    (select voterings_id, vot_datum, vot, count(vot), parti from
                                        (select * from voteringar
                                        natural join riksdagsledamot
                                        where parti = $1) as foo
                                        group by voterings_id, vot_datum, vot, parti) as bar
                                    group by voterings_id, vot, vot_datum, parti
                                    order by voterings_id, max desc) as boo
                                order by vot_datum asc) as doo
                            where dar.vot_id = doo.voterings_id) as goo
                            where not vot = parti_vot
                            and not vot = 'Frånvarande'
                            and not parti_vot = 'Frånvarande'
                            and not p = '-') as gar
                        group by vot_datum
                        order by vot_datum asc) as final;`,
        [party],
        (error, results) => {
          if (error) {
            res.status(500).json({ error: "error" });
          } else {
            res.status(200).json(results.rows);
          }
        }
      );
    }
  }
};

/** Rank the politicians who are most absent combined with sentiement
 * example http://localhost:3000/getInfluence?startdate=2019-01-01&enddate=2020-04-09 **/
const getInfluence = (req, res) => {
  if (!req.query.startdate || !req.query.enddate) {
    res.json({
      info:
        "Please enter dates (startdate and enddate) for which you would like to get data between",
    });
  } else {
    let startdate = req.query.startdate;
    let enddate = req.query.enddate;
    pool.query(
      `select dense_rank () over (order by absrank ASC) as rank, person_id, parti, namn from
        (select (rank1 + rank2) as absrank, person_id, parti, namn from
            (select dense_rank () over (order by r DESC) as rank1, person_id, parti, namn from
                (select abs(rank1 - rank2) as r, person_id, parti, namn from
                    (SELECT DENSE_RANK () OVER (ORDER BY AVG(resultat_sentiment.resultat) ASC) AS rank1, info.parti, info.namn, person_id, AVG(resultat_sentiment.resultat) as resultat
                        FROM (SELECT person_id, parti, namn, datum, anforande_id FROM anforandetext
                        NATURAL JOIN riksdagsledamot) as info
                        NATURAL JOIN resultat_sentiment WHERE info.datum > $1
                        AND info.datum < $2
                        GROUP BY info.parti, info.namn, info.person_id) as neg

                    natural join

                    (SELECT DENSE_RANK () OVER (ORDER BY AVG(resultat_sentiment.resultat) DESC) AS rank2, info.parti, info.namn, person_id, AVG(resultat_sentiment.resultat) as resultat
                        FROM (SELECT person_id, parti, namn, datum, anforande_id FROM anforandetext
                        NATURAL JOIN riksdagsledamot) as info
                        NATURAL JOIN resultat_sentiment WHERE info.datum > $1
                        AND info.datum < $2
                        GROUP BY info.parti, info.namn, info.person_id) as pos
                    where neg.person_id = pos.person_id)
                as posneg)
            as sentiment

            natural join

            (SELECT DENSE_RANK () OVER (ORDER BY COUNT(vot) ASC) AS rank2, P.person_id,  P.parti, P.namn, COUNT(vot) AS resultat
                FROM voteringar as V
                NATURAL JOIN riksdagsledamot as P
                WHERE vot = 'Frånvarande' AND vot_datum > $1
                AND vot_datum < $2
                GROUP BY P.person_id, P.namn, P.parti
                ORDER BY rank2) as absent
            where sentiment.person_id = absent.person_id) as final;`,
      [startdate, enddate],
      (error, results) => {
        if (error) {
          res.status(500).json({ error: "error" });
        } else {
          res.status(200).json(results.rows);
        }
      }
    );
  }
};

/**
 * Export all neccessary modules
 **/
module.exports = {
  getSAResultMostNegative,
  getSAResultMostPositive,
  getMostAbsent,
  getVotedAgainstPartiMode,
  getLedamot,
  getResultOverTime,
  getResultOverTimeParty,
  getInfluence,
};
