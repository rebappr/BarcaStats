const fs = require("fs");

const CLUB_MAP = {
  "FC Barcelona": "FC Barcelona",
  "Real Madrid CF": "Real Madrid",
  "Club Atlético de Madrid": "Atlético de Madrid",
  "Athletic Club": "Athletic Club",
  "Real Betis Balompié": "Real Betis",
  "Real Sociedad de Fútbol": "Real Sociedad",
  "Villarreal CF": "Villarreal CF",
  "Valencia CF": "Valencia CF",
  "Sevilla FC": "FC Sevilla",
  "Getafe CF": "Getafe CF",
  "Rayo Vallecano de Madrid": "Rayo Vallecano",
  "CA Osasuna": "CA Osasuna",
  "RC Celta de Vigo": "Celta de Vigo",
  "RCD Espanyol de Barcelona": "RCD Espanyol",
  "Deportivo Alavés": "Deportivo Alavés",
  "Levante UD": "Levante UD",
  "Elche CF": "Elche CF",
  "RC Deportivo La Coruña": "Deportivo A Coruña",
  "Málaga CF": "Málaga CF",
  "Real Racing Club de Santander": "Racing Santander",
  "Girona FC": "Girona FC",
  "CD Leganés": "CD Leganés",
  "RCD Mallorca": "RCD Mallorca",
  "UD Las Palmas": "UD Las Palmas",
  "Real Valladolid CF": "Valladolid",
  "Real Oviedo": "Real Oviedo",
  "Real Zaragoza": "Real Zaragoza",

  "Feyenoord Rotterdam": "Feyenoord Rotterdam",
  "Galatasaray SK": "Galatasaray SK",
  "Paris Saint-Germain FC": "Paris Saint-Germain",
  "Aston Villa FC": "Aston Villa",
  "Sabah FK": "Sabah FK",
  "Manchester City FC": "FC Manchester City",
  "Sporting Clube de Portugal": "Sporting CP",
  "Como 1907": "Como 1907"
};

const COMPETITION_MAP = {
  "Primera Division": "La Liga",
  "UEFA Champions League": "UEFA Champions League",
  "Copa del Rey": "Copa del Rey",
  "Super Cup": "Supercopa de España",
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

  const currentSeason =
    new Date().getMonth() >= 6
      ? new Date().getFullYear() +
        "/" +
        String(
          new Date().getFullYear() + 1
        ).slice(2)
      : (new Date().getFullYear() - 1) +
        "/" +
        String(
          new Date().getFullYear()
        ).slice(2);

  const seasonMatches = data.matches.filter(
    function(match) {

      const startYear =
        new Date(
          match.season.startDate
        ).getFullYear();

      const endYear =
        new Date(
          match.season.endDate
        ).getFullYear();

      const matchSeason =
        startYear +
        "/" +
        String(endYear).slice(2);

      return (
        matchSeason === currentSeason
      );
    }
  );

  const matches = seasonMatches.map(
    function(match) {

      if (
        !CLUB_MAP[
          match.homeTeam.name
        ]
      ) {
        console.log(
          "UNKNOWN CLUB: " +
          match.homeTeam.name
        );
      }

      if (
        !CLUB_MAP[
          match.awayTeam.name
        ]
      ) {
        console.log(
          "UNKNOWN CLUB: " +
          match.awayTeam.name
        );
      }

      const home =
        CLUB_MAP[
          match.homeTeam.name
        ] ||
        match.homeTeam.name;

      const away =
        CLUB_MAP[
          match.awayTeam.name
        ] ||
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
        "Date":
          formatDate(
            match.utcDate
          ),

        "Competition":
          COMPETITION_MAP[
            match.competition.name
          ] ||
          match.competition.name,

        "Opp. Team":
          opponent,

        "Home/Away":
          isHome
            ? "Home"
            : "Away",

        "Result":
          result
      };
    }
  );

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
    " matches for " +
    currentSeason
  );
}

run().catch(function(err) {
  console.error(err);
  process.exit(1);
});
