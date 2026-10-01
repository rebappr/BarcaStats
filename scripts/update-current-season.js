const fs = require("fs");

const CLUB_MAP = {
  "Real Madrid CF": "Real Madrid",
  "Club Atlético de Madrid": "Atlético de Madrid",
  "Athletic Club": "Athletic Bilbao",
  "Real Betis Balompié": "Real Betis",
  "Real Sociedad de Fútbol": "Real Sociedad",
  "Villarreal CF": "Villarreal",
  "Valencia CF": "Valencia",
  "Sevilla FC": "Sevilla",
  "Getafe CF": "Getafe",
  "Rayo Vallecano de Madrid": "Rayo Vallecano",
  "CA Osasuna": "Osasuna",
  "RC Celta de Vigo": "Celta Vigo",
  "RCD Espanyol de Barcelona": "Espanyol",
  "Deportivo Alavés": "Alavés",
  "Girona FC": "Girona",
  "RCD Mallorca": "Mallorca",
  "Real Racing Club de Santander": "Racing Santander"
};

const COMPETITION_MAP = {
  "Primera Division": "La Liga",
  "UEFA Champions League": "Champions League",
  "Copa del Rey": "Copa del Rey",
  "Super Cup": "Spanish Super Cup",
  "FIFA Club World Cup": "Club World Cup"
};

function formatDate(dateStr) {
  const d = new Date(dateStr);

  return (
    d.getDate() +
    "." +
    (d.getMonth() + 1) +
    "." +
    d.getFullYear()
  );
}

async function run() {

  const response = await fetch(
    "https://api.football-data.org/v4/teams/81/matches?limit=200",
    {
      headers: {
        "X-Auth-Token": process.env.API_KEY
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      "API returned " + response.status
    );
  }

  const data = await response.json();

  const matches = data.matches.map(function(match) {

    const home =
      CLUB_MAP[match.homeTeam.name] ||
      match.homeTeam.name;

    const away =
      CLUB_MAP[match.awayTeam.name] ||
      match.awayTeam.name;

    const isHome =
      home === "FC Barcelona";

    const opponent =
      isHome ? away : home;

    let result = "-:-";

    if (
      match.status === "FINISHED" &&
      match.score &&
      match.score.fullTime
    ) {
      result =
        match.score.fullTime.home +
        ":" +
        match.score.fullTime.away;
    }

    return {
      "Date": formatDate(match.utcDate),

      "Competition":
        COMPETITION_MAP[
          match.competition.name
        ] ||
        match.competition.name,

      "Opp. Team": opponent,

      "Home/Away":
        isHome ? "Home" : "Away",

      "Result": result
    };
  });

  fs.writeFileSync(
    "current-season.json",
    JSON.stringify(
      matches,
      null,
      2
    )
  );

  console.log(
    "Saved " +
    matches.length +
    " matches"
  );
}

run().catch(function(err) {
  console.error(err);
  process.exit(1);
});

