// ─────────────────────────────────────────────────────────────────────────────
// GOVERNING BODY RULES  — hardcoded, not editable via UI
// athleteKey: unique identifier for conflict detection
// board: "1m" | "3m" | "Plat"
// ─────────────────────────────────────────────────────────────────────────────
export const GB = {
  USA_DIVING: {
    label:"USA Diving", abbr:"USD",
    defaultSpd:35, defaultWarmup:15, defaultBuffer:5,
    events:[
      {tmplId:"usd-gD-1m",  label:"Group D Girls", board:"1m",  gender:"F", group:"D",    dives:5,  athleteKey:"D-F"    },
      {tmplId:"usd-bD-1m",  label:"Group D Boys",  board:"1m",  gender:"M", group:"D",    dives:5,  athleteKey:"D-M"    },
      {tmplId:"usd-gC-1m",  label:"Group C Girls", board:"1m",  gender:"F", group:"C",    dives:7,  athleteKey:"C-F"    },
      {tmplId:"usd-bC-1m",  label:"Group C Boys",  board:"1m",  gender:"M", group:"C",    dives:7,  athleteKey:"C-M"    },
      {tmplId:"usd-gC-3m",  label:"Group C Girls", board:"3m",  gender:"F", group:"C",    dives:7,  athleteKey:"C-F"    },
      {tmplId:"usd-bC-3m",  label:"Group C Boys",  board:"3m",  gender:"M", group:"C",    dives:7,  athleteKey:"C-M"    },
      {tmplId:"usd-gB-1m",  label:"Group B Girls", board:"1m",  gender:"F", group:"B",    dives:8,  athleteKey:"B-F"    },
      {tmplId:"usd-bB-1m",  label:"Group B Boys",  board:"1m",  gender:"M", group:"B",    dives:8,  athleteKey:"B-M"    },
      {tmplId:"usd-gB-3m",  label:"Group B Girls", board:"3m",  gender:"F", group:"B",    dives:8,  athleteKey:"B-F"    },
      {tmplId:"usd-bB-3m",  label:"Group B Boys",  board:"3m",  gender:"M", group:"B",    dives:8,  athleteKey:"B-M"    },
      {tmplId:"usd-gB-pl",  label:"Group B Girls", board:"Plat",gender:"F", group:"B",    dives:8,  athleteKey:"B-F"    },
      {tmplId:"usd-bB-pl",  label:"Group B Boys",  board:"Plat",gender:"M", group:"B",    dives:8,  athleteKey:"B-M"    },
      {tmplId:"usd-gA-1m",  label:"Group A Girls", board:"1m",  gender:"F", group:"A",    dives:10, athleteKey:"A-F"    },
      {tmplId:"usd-bA-1m",  label:"Group A Boys",  board:"1m",  gender:"M", group:"A",    dives:10, athleteKey:"A-M"    },
      {tmplId:"usd-gA-3m",  label:"Group A Girls", board:"3m",  gender:"F", group:"A",    dives:10, athleteKey:"A-F"    },
      {tmplId:"usd-bA-3m",  label:"Group A Boys",  board:"3m",  gender:"M", group:"A",    dives:10, athleteKey:"A-M"    },
      {tmplId:"usd-gA-pl",  label:"Group A Girls", board:"Plat",gender:"F", group:"A",    dives:10, athleteKey:"A-F"    },
      {tmplId:"usd-bA-pl",  label:"Group A Boys",  board:"Plat",gender:"M", group:"A",    dives:10, athleteKey:"A-M"    },
      {tmplId:"usd-gO-1m",  label:"Open Women",    board:"1m",  gender:"F", group:"Open", dives:11, athleteKey:"Open-F" },
      {tmplId:"usd-bO-1m",  label:"Open Men",      board:"1m",  gender:"M", group:"Open", dives:11, athleteKey:"Open-M" },
      {tmplId:"usd-gO-3m",  label:"Open Women",    board:"3m",  gender:"F", group:"Open", dives:11, athleteKey:"Open-F" },
      {tmplId:"usd-bO-3m",  label:"Open Men",      board:"3m",  gender:"M", group:"Open", dives:11, athleteKey:"Open-M" },
    ],
  },
  AAU:{
    label:"AAU", abbr:"AAU",
    defaultSpd:35, defaultWarmup:12, defaultBuffer:5,
    events:[
      {tmplId:"aau-g9u-1m",   label:"Girls 9&U",   board:"1m",  gender:"F", group:"9U",    dives:5,  athleteKey:"9U-F"    },
      {tmplId:"aau-b9u-1m",   label:"Boys 9&U",    board:"1m",  gender:"M", group:"9U",    dives:5,  athleteKey:"9U-M"    },
      {tmplId:"aau-g1011-1m", label:"Girls 10–11", board:"1m",  gender:"F", group:"10-11", dives:6,  athleteKey:"10-11-F" },
      {tmplId:"aau-b1011-1m", label:"Boys 10–11",  board:"1m",  gender:"M", group:"10-11", dives:6,  athleteKey:"10-11-M" },
      {tmplId:"aau-g1213-1m", label:"Girls 12–13", board:"1m",  gender:"F", group:"12-13", dives:7,  athleteKey:"12-13-F" },
      {tmplId:"aau-b1213-1m", label:"Boys 12–13",  board:"1m",  gender:"M", group:"12-13", dives:7,  athleteKey:"12-13-M" },
      {tmplId:"aau-g1415-1m", label:"Girls 14–15", board:"1m",  gender:"F", group:"14-15", dives:8,  athleteKey:"14-15-F" },
      {tmplId:"aau-b1415-1m", label:"Boys 14–15",  board:"1m",  gender:"M", group:"14-15", dives:8,  athleteKey:"14-15-M" },
      {tmplId:"aau-g1618-1m", label:"Girls 16–18", board:"1m",  gender:"F", group:"16-18", dives:9,  athleteKey:"16-18-F" },
      {tmplId:"aau-b1618-1m", label:"Boys 16–18",  board:"1m",  gender:"M", group:"16-18", dives:10, athleteKey:"16-18-M" },
      {tmplId:"aau-gO-1m",    label:"Open Women",  board:"1m",  gender:"F", group:"Open",  dives:10, athleteKey:"Open-F"  },
      {tmplId:"aau-bO-1m",    label:"Open Men",    board:"1m",  gender:"M", group:"Open",  dives:11, athleteKey:"Open-M"  },
      {tmplId:"aau-g1011-3m", label:"Girls 10–11", board:"3m",  gender:"F", group:"10-11", dives:5,  athleteKey:"10-11-F" },
      {tmplId:"aau-b1011-3m", label:"Boys 10–11",  board:"3m",  gender:"M", group:"10-11", dives:5,  athleteKey:"10-11-M" },
      {tmplId:"aau-g1213-3m", label:"Girls 12–13", board:"3m",  gender:"F", group:"12-13", dives:6,  athleteKey:"12-13-F" },
      {tmplId:"aau-b1213-3m", label:"Boys 12–13",  board:"3m",  gender:"M", group:"12-13", dives:6,  athleteKey:"12-13-M" },
      {tmplId:"aau-g1415-3m", label:"Girls 14–15", board:"3m",  gender:"F", group:"14-15", dives:7,  athleteKey:"14-15-F" },
      {tmplId:"aau-b1415-3m", label:"Boys 14–15",  board:"3m",  gender:"M", group:"14-15", dives:7,  athleteKey:"14-15-M" },
      {tmplId:"aau-g1618-3m", label:"Girls 16–18", board:"3m",  gender:"F", group:"16-18", dives:9,  athleteKey:"16-18-F" },
      {tmplId:"aau-b1618-3m", label:"Boys 16–18",  board:"3m",  gender:"M", group:"16-18", dives:10, athleteKey:"16-18-M" },
    ],
  },
  NFHS:{
    label:"NFHS / High School", abbr:"NFHS",
    defaultSpd:30, defaultWarmup:10, defaultBuffer:3,
    events:[
      {tmplId:"nfhs-gV-1m",  label:"Girls Varsity", board:"1m",  gender:"F", group:"Varsity", dives:11, athleteKey:"Varsity-F"},
      {tmplId:"nfhs-bV-1m",  label:"Boys Varsity",  board:"1m",  gender:"M", group:"Varsity", dives:11, athleteKey:"Varsity-M"},
      {tmplId:"nfhs-gV-3m",  label:"Girls Varsity", board:"3m",  gender:"F", group:"Varsity", dives:11, athleteKey:"Varsity-F"},
      {tmplId:"nfhs-bV-3m",  label:"Boys Varsity",  board:"3m",  gender:"M", group:"Varsity", dives:11, athleteKey:"Varsity-M"},
      {tmplId:"nfhs-gJV-1m", label:"Girls JV",      board:"1m",  gender:"F", group:"JV",      dives:6,  athleteKey:"JV-F"    },
      {tmplId:"nfhs-bJV-1m", label:"Boys JV",       board:"1m",  gender:"M", group:"JV",      dives:6,  athleteKey:"JV-M"    },
    ],
  },
  CUSTOM:{
    label:"Custom", abbr:"CUS",
    defaultSpd:35, defaultWarmup:15, defaultBuffer:5,
    events:[],
  },
};

// Board type compatibility: which event board types each physical board can hold
export const BOARD_TYPE_COMPAT = {
  "1m":  ["1m"],
  "3m":  ["3m"],
  "Plat":["Plat"],
};