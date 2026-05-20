import { useState, useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// GOVERNING BODY RULES  — hardcoded, not editable via UI
// athleteKey: unique identifier for conflict detection
// board: "1m" | "3m" | "Plat"
// ─────────────────────────────────────────────────────────────────────────────
const GB = {
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
const BOARD_TYPE_COMPAT = {
  "1m":  ["1m"],
  "3m":  ["3m"],
  "Plat":["Plat"],
};

// ─────────────────────────────────────────────────────────────────────────────
// SCHEDULING ENGINE — pure functions
// Architecture: Day → Session → Board → Event
// ─────────────────────────────────────────────────────────────────────────────

function uid(p="x"){ return `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`; }

// Minutes since midnight
function toMin(t){
  if (typeof t === "number" && Number.isFinite(t)) return t;
  if (!t) return 8 * 60;

  const raw = String(t).trim().toUpperCase();

  let m = raw.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/);
  if (m) {
    let h = Number(m[1]) % 12;
    if (m[3] === "PM") h += 12;
    return h * 60 + Number(m[2]);
  }

  m = raw.match(/^(\d{1,2}):(\d{2})$/);
  if (m) return Number(m[1]) * 60 + Number(m[2]);

  return 8 * 60;
}

// Minutes → "HH:MM" (24h internal)
function toHHMM(n){ const s=((Math.round(n)%1440)+1440)%1440; return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`; }

// "HH:MM" → "h:MM AM/PM"
function fmt12(hhmm){
  if(!hhmm) return "";
  const [h,m]=hhmm.split(":").map(Number);
  const ampm=h<12?"AM":"PM";
  const h12=((h%12)||12);
  return `${h12}:${String(m).padStart(2,"0")} ${ampm}`;
}

// Duration minutes → "Xh Ym"
function hm(m){ return `${Math.floor(m/60)}h ${Math.round(m%60)}m`; }

// Event competition time in minutes (board-aware: split boards halve the diver count)
function evCompMin(ev, spd, boardSplit=false){
  const effectiveDivers = boardSplit ? Math.ceil(ev.divers / 2) : ev.divers;
  return (effectiveDivers * ev.dives * spd) / 60;
}

// Board duration: sum of all event durations on that board (round-robin interleaving = same total)
function boardDurMin(board, spd){
  if(!board.events || !board.events.length) return 0;
  const isSplit = board.split;
  return board.events.reduce((sum, ev) => sum + evCompMin(ev, spd, isSplit), 0);
}

// Session total:
//   warmup + max(boardDuration across all boards) + buffer
// Boards run simultaneously; session ends when slowest board finishes.
function sessCalc(sess, globalSpd, globalBuf){
  const spd = sess.secondsPerDive ?? globalSpd;
  const buf = sess.bufferMinutes ?? globalBuf;
  const warmupMin = sess.warmupMinutes ?? 0;
  if(!sess.boards || !sess.boards.length) return {compMin:0, warmupMin, bufMin:buf, total:warmupMin+buf};
  const boardDurs = sess.boards.map(b => boardDurMin(b, spd));
  const compMin = Math.ceil(Math.max(...boardDurs, 0));
  return {compMin, warmupMin, bufMin:buf, total:Math.ceil(compMin+warmupMin+buf)};
}

// Annotate full meet with computed timing (all times in 12h display)
function recalcMeet(days, globalSpd, globalBuf){
  return (days || []).map(day => {
    const dayStartMin = toMin(day.startTime ?? "08:00");
    let cur = dayStartMin;

    const sessions = (day.sessions || []).map(sess => {
      const spd = Number(sess.secondsPerDive ?? globalSpd ?? 35);
      const warmupMin = Number(sess.warmupMinutes ?? 0);
      const bufMin = Number(sess.bufferMinutes ?? globalBuf ?? 0);

      const boardDurations = (sess.boards || []).map(board => {
        return (board.events || []).reduce((sum, ev) => {
          const divers = Number(ev.divers ?? 0);
          const dives = Number(ev.dives ?? 0);
          const boardSplit = !!board.split;
          const effectiveDivers = boardSplit ? Math.ceil(divers / 2) : divers;
          const evMin = (effectiveDivers * dives * spd) / 60;
          return sum + (Number.isFinite(evMin) ? evMin : 0);
        }, 0);
      });

      const compMin = boardDurations.length ? Math.ceil(Math.max(...boardDurations, 0)) : 0;
      const sessStartMin = cur; 
      const warmupEndMin = sessStartMin + warmupMin;
      const compStartMin = warmupEndMin;
      const sessionEndMin = compStartMin + compMin + bufMin;

      const boards = (sess.boards || []).map((board, boardIdx) => {
        const boardCompMin = Math.ceil(boardDurations[boardIdx] ?? 0);
        const boardStartMin = compStartMin;
        const boardEndMin = boardStartMin + boardCompMin;

        const boardStart = toHHMM(boardStartMin);
        const boardEnd = toHHMM(boardEndMin);

        const events = (board.events || []).map(ev => {
          const divers = Number(ev.divers ?? 0);
          const dives = Number(ev.dives ?? 0);
          const boardSplit = !!board.split;
          const effectiveDivers = boardSplit ? Math.ceil(divers / 2) : divers;
          const evMin = Math.ceil((effectiveDivers * dives * spd) / 60);

          return {
            ...ev,
            _start: boardStart,
            _end: boardEnd,
            _min: evMin,
            _start12: fmt12(boardStart),
            _end12: fmt12(boardEnd),
            _boardStart: boardStart,
            _boardEnd: boardEnd,
            _boardSplit: boardSplit,
          };
        });

        return {
          ...board,
          events,
          _start: boardStart,
          _end: boardEnd,
          _start12: fmt12(boardStart),
          _end12: fmt12(boardEnd),
          _durMin: boardCompMin,
        };
      });

      const timedSess = {
        ...sess,
        boards,
        _start: toHHMM(sessStartMin),
        _end: toHHMM(sessionEndMin),
        _start12: fmt12(toHHMM(sessStartMin)),
        _end12: fmt12(toHHMM(sessionEndMin)),
        _compStart: toHHMM(compStartMin),
        _compStart12: fmt12(toHHMM(compStartMin)),
        _dur: {
          compMin,
          warmupMin,
          bufMin,
          total: compMin + warmupMin + bufMin,
        },
        _warmupEnd12: fmt12(toHHMM(warmupEndMin)),
      };

      cur = sessionEndMin;
      return timedSess;
    });

    const dayEndMin = sessions.length ? toMin(sessions[sessions.length - 1]._end) : dayStartMin;
    const dayMin = sessions.reduce((s, se) => s + (Number(se._dur?.total) || 0), 0);

    return {
      ...day,
      sessions,
      _start: toHHMM(dayStartMin),
      _end: toHHMM(dayEndMin),
      _start12: fmt12(toHHMM(dayStartMin)),
      _end12: fmt12(toHHMM(dayEndMin)),
      _totalMin: dayMin,
    };
  });
}

// Conflict detection: same athleteKey >1x in one session (across all boards)
function detectConflicts(days){
  const out=[];
  days.forEach((day,di) => {
    day.sessions.forEach((sess,si) => {
      const seen={};
      const allEvs = (sess.boards||[]).flatMap(b => b.events||[]);
      allEvs.forEach(ev => {
        const k=ev.athleteKey; if(!k) return;
        if(seen[k]) out.push({
          dayIdx:di, sessIdx:si, sessId:sess.id,
          msg:`Day ${di+1} · Session ${si+1}: "${ev.label} ${ev.board}" shares athlete group (${k}) with another event in this session.`
        });
        seen[k]=true;
      });
    });
  });
  return out;
}

// Generate default structure from GB: one session per board type, one board per session
function generateFromGB(gbKey){
  const gb = GB[gbKey];

  const boardTypes = ["1m", "3m", "Plat"];

  const boards = boardTypes
    .map(boardType => {
      const events = gb.events
        .filter(ev => ev.board === boardType)
        .map(ev => ({
          ...ev,
          id: uid("ev"),
          divers: 10,
          customLabel: null,
        }));

      return {
        id: uid("brd"),
        label: boardType === "Plat" ? "Platform" : `${boardType} Board`,
        boardType,
        split: false,
        events,
      };
    })
    .filter(board => board.events.length > 0);

  return [{
    id: uid("day"),
    label: "Day 1",
    startTime: "08:00",
    sessions: [{
      id: uid("sess"),
      label: "Session 1",
      secondsPerDive: gb.defaultSpd,
      bufferMinutes: gb.defaultBuffer,
      warmupMinutes: gb.defaultWarmup,
      boards,
    }],
  }];
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARE
// ─────────────────────────────────────────────────────────────────────────────
function enc(m){ try{return btoa(encodeURIComponent(JSON.stringify(m)));}catch{return null;} }
function dec(s){ try{return JSON.parse(decodeURIComponent(atob(s)));}catch{return null;} }

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────
const P={
  drag:"M9 3h2v2H9zm0 4h2v2H9zm0 4h2v2H9zM5 3h2v2H5zm0 4h2v2H5zm0 4h2v2H5z",
  plus:"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
  print:"M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z",
  share:"M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z",
  x:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
  check:"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  copy:"M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z",
  warn:"M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
  trash:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
  cog:"M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.21.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
  split:"M16 1v4h3L12 12 5 5h3V1H4v4.17L11.17 12 4 19v4h4v-4H5l7-7 7 7h-3v4h4v-4L13.83 12 21 5.17V1h-5z",
  board:"M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h4v4H7V7zm6 0h4v4h-4V7zM7 13h4v4H7v-4zm6 0h4v4h-4v-4z",
};
const Ic=({n,sz=14,c="currentColor"})=>(
  <svg width={sz} height={sz} viewBox="0 0 24 24" fill={c} style={{flexShrink:0,display:"block"}}>
    <path d={P[n]||""}/>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0b0d12;--s1:#12151d;--s2:#181c27;--s3:#1e2332;
  --b1:#252b3a;--b2:#2f3850;
  --tx:#ccd4ee;--mu:#58637e;
  --ac:#3d8bff;--ac2:#1a5ed4;
  --wo:#f5a623;--gn:#22c47e;--rd:#e84444;--pu:#9b6dff;
  --mono:'IBM Plex Mono',monospace;--sans:'IBM Plex Sans',sans-serif;
}
body{background:var(--bg);color:var(--tx);font-family:var(--sans);font-size:20px;line-height:1.5}
::-webkit-scrollbar{width:5px;height:8px}
::-webkit-scrollbar-track{background:var(--s1)}
::-webkit-scrollbar-thumb{background:var(--b2);border-radius:3px}

/* ─── LAYOUT ─── */
.app{
  display:flex;
  flex-direction:column;
  width:100vw;
  min-width:100vw;
  min-height:100vh;
  overflow:auto;
  align-items:flex-start;
}
.main{
  display:flex;
  flex:1;
  width:100%;
  min-width:0;
  overflow:hidden;
  justify-content:flex-start;
}


/* ─── NAV ─── */
.nav{display:flex;align-items:center;gap:14px;padding:0 20px;height:56px;
  background:var(--s1);border-bottom:1px solid var(--b1);flex-shrink:0}
.brand{font-family:var(--mono);font-size:14px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--ac)}
.meetname{font-family:var(--mono);font-size:13px;color:var(--mu);
  padding:5px 10px;background:var(--bg);border:1px solid var(--b1);border-radius:4px;
  cursor:pointer;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.meetname:hover{border-color:var(--ac);color:var(--tx)}
.nav-sp{flex:1}
.tabs{display:flex}
.tab{padding:9px 14px;font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--mu);cursor:pointer;border-bottom:2px solid transparent;transition:all .12s}
.tab:hover{color:var(--tx)}
.tab.on{color:var(--ac);border-bottom-color:var(--ac)}
.conflict-pill{display:flex;align-items:center;gap:4px;padding:3px 8px;
  background:rgba(232,68,68,.1);border:1px solid rgba(232,68,68,.3);border-radius:3px;
  font-family:var(--mono);font-size:10px;color:var(--rd)}

/* ─── BUTTONS ─── */
.btn{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:10px 14px;
  border-radius:10px;
  border:1px solid var(--b1);
  background:var(--s2);
  color:var(--tx);
  font-family:var(--mono);
  font-size:12px;
  font-weight:700;
  letter-spacing:.04em;
  cursor:pointer;
  transition:all .12s;
  text-transform:uppercase;
  white-space:nowrap;
  flex-shrink:0;
}
.btn:hover{border-color:var(--ac);color:var(--ac)}
.btn.p{background:var(--ac);border-color:var(--ac);color:#fff}
.btn.p:hover{background:var(--ac2);border-color:var(--ac2)}
.btn.d:hover{border-color:var(--rd);color:var(--rd)}
.btn.g{background:transparent;border-color:transparent}
.btn.g:hover{background:var(--s2);border-color:var(--b1);color:var(--tx)}
.btn.sm{padding:6px 10px;font-size:10px;border-radius:8px}

/* ─── SIDEBAR ─── */
.sidebar{width:340px;flex-shrink:0;background:var(--s1);border-right:1px solid var(--b1);
  display:flex;flex-direction:column;overflow-y:auto}
.ss{padding:20px;border-bottom:1px solid var(--b1)}
.sl{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--mu);margin-bottom:14px;font-weight:600}
.fr{display:flex;flex-direction:column;gap:5px;margin-bottom:12px}
.fl{font-size:13px;color:var(--tx);font-family:var(--mono);font-weight:500}
.fi{background:var(--bg);border:1px solid var(--b1);color:var(--tx);
  font-family:var(--mono);font-size:15px;padding:12px 14px;border-radius:3px;outline:none;width:100%}
.fi:focus{border-color:var(--ac)}
.fi option{background:var(--s1)}

/* ─── KANBAN ─── */
.kanban{
  display:flex;
  gap:22px;
  flex:1;
  width:100%;
  min-width:0;
  overflow-x:auto;
  overflow-y:auto;
  padding:20px 16px 20px 0;
  align-items:flex-start;
  justify-content:flex-start;
}
.day-col{
  width:max-content;
  min-width:min(95vw, 560px);
  display:flex;
  flex-direction:column;
  gap:14px;
  margin-right:0;
}
.day-hdr{background:var(--s2);border:1px solid var(--b1);border-top:2px solid var(--wo);
  border-radius:8px;padding:14px 16px;display:flex;align-items:flex-start;gap:8px}
.day-title{font-family:var(--mono);font-size:clamp(13px, 1.2vw, 16px);;font-weight:700;color:var(--wo);
  letter-spacing:.08em;text-transform:uppercase;flex:1}
.day-meta{font-family:var(--mono);font-size:12px;color:var(--mu);margin-top:4px}
.day-actions{display:flex;gap:3px;flex-shrink:0;align-items:center}

/* ─── SESSION ─── */
.sess-card{
  background:var(--s1);
  border:1px solid var(--b1);
  border-radius:12px;
  overflow:hidden;
  transition:border-color .15s;
  width:100%;
}
.sess-card.dov{border-color:var(--ac);background:rgba(61,139,255,.03)}
.sess-hdr{
  display:flex;
  align-items:center;
  gap:8px;
  padding:14px 16px;
  background:var(--s2);
  border-bottom:1px solid var(--b1);
}
.sess-lbl{
  font-family:var(--mono);
  font-size:15px;
  font-weight:800;
  color:var(--tx);
  flex:1;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.sess-time{
  font-family:var(--mono);
  font-size:12px;
  color:var(--mu);
  white-space:nowrap;
}
.sess-wu{
  display:flex;
  align-items:center;
  gap:8px;
  padding:11px 16px;
  background:rgba(155,109,255,.07);
  border-top:1px solid var(--b1);
  border-bottom:1px solid var(--b1);
  font-family:var(--mono);
  font-size:11px;
  color:var(--pu);
  font-weight:700;
  letter-spacing:.04em;
  text-transform:uppercase;
}
.sess-boards{
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  gap:14px;
  align-items:flex-start;
  overflow-x:auto;
  overflow-y:hidden;
  min-height:40px;
}
.board-card{
  min-width:340px;
  flex:1 0 340px;
  background:var(--s1);
  border:1px solid var(--b1);
  border-radius:12px;
  overflow:hidden;
  display:flex;
  flex-direction:column;
}
.board-hdr{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:12px 14px;
  background:var(--s2);
  border-bottom:1px solid var(--b1);
}

.board-title{
  font-family:var(--mono);
  font-size:12px;
  font-weight:800;
  letter-spacing:.12em;
  text-transform:uppercase;
  color:var(--wo);
}

.board-meta{
  font-family:var(--mono);
  font-size:10px;
  color:var(--mu);
}
.board-body{
  padding:12px;
  display:flex;
  flex-direction:column;
  gap:12px;
  flex:1;
}
.sess-foot{padding:8px 10px;border-top:1px solid var(--b1);display:flex;align-items:center;gap:6px;background:var(--s2)}
.sess-stat{font-family:var(--mono);font-size:11px;color:var(--mu);flex:1;line-height:1.6}
.sess-cfg-panel{
  padding:18px;
  background:var(--s3);
  border-bottom:1px solid var(--b1);
  display:flex;
  flex-direction:column;
  gap:12px;
}
.cfg-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:14px;
  font-family:var(--mono);
  font-size:14px;
  color:var(--tx);
  margin-bottom:0;
}
.cfg-row label{
  flex:1;
  font-size:14px;
  font-weight:700;
}
.cfg-i{
  background:var(--bg);
  border:1px solid var(--b1);
  color:var(--tx);
  font-family:var(--mono);
  font-size:14px;
  padding:9px 11px;
  border-radius:8px;
  outline:none;
  width:96px;
}
.cfg-i:focus{border-color:var(--ac)}
.sess-conflict{background:rgba(232,68,68,.07);border-top:1px solid rgba(232,68,68,.2);
  padding:6px 10px;font-family:var(--mono);font-size:10px;color:var(--rd);
  display:flex;gap:5px;align-items:flex-start;line-height:1.5}

/* ─── BOARD ─── */
.board-block{
  min-width:clamp(240px, 28vw, 360px);
  flex:1 1 clamp(240px, 28vw, 360px);
  background:var(--s1);
  border:1px solid var(--b1);
  border-radius:10px;
  overflow:hidden;
  display:flex;
  flex-direction:column;
  box-shadow:0 0 0 1px rgba(255,255,255,.02) inset;
}
.board-block.drop-valid{border-color:var(--gn);background:rgba(34,196,126,.04)}
.board-block.drop-invalid{border-color:var(--rd);background:rgba(232,68,68,.04)}
.board-hdr{
  display:flex;
  align-items:center;
  gap:8px;
  padding:12px 14px;
  background:var(--s2);
  border-bottom:1px solid var(--b1);
  flex-wrap:wrap;
}
.board-lbl{
  font-family:var(--mono);
  font-size:clamp(10px, 1vw, 12px);
  font-weight:700;
  letter-spacing:.12em;
  text-transform:uppercase;
  color:var(--wo);
}
.board-dur{
  margin-left:auto;
  font-family:var(--mono);
  font-size:11px;
  color:var(--mu);
}
.board-split-badge{display:inline-flex;align-items:center;gap:3px;padding:2px 6px;
  background:rgba(155,109,255,.18);color:var(--pu);border-radius:2px;
  font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}

.board-events{
  display:flex;
  flex-direction:column;
  gap:10px;
  padding:12px;
  min-height:60px;
}

/* ─── EVENT CARD ─── */
.ev-card{
  background:var(--bg);
  border:1px solid var(--b1);
  border-radius:8px;
  margin-bottom:0;
  cursor:grab;
  user-select:none;
  transition:opacity .12s,border-color .12s;
  overflow:hidden;
}
.ev-card:last-child{margin-bottom:0}
.ev-card:active{cursor:grabbing}
.ev-card.isdrag{opacity:.3;border-style:dashed;border-color:var(--ac)}
.ev-card.dbefore{border-top:2px solid var(--ac)}
.ev-card.dafter{border-bottom:2px solid var(--ac)}
.ev-card.conflict{border-left:3px solid var(--rd)}
.ev-inner{
  display:flex;
  align-items:flex-start;
  padding:12px 14px;
  gap:8px;
}
.ev-grip{color:var(--b2);flex-shrink:0;padding-right:4px;margin-top:2px}
.ev-body{flex:1;min-width:0}
.ev-name{
  font-family:var(--mono);
  font-size:13px;
  font-weight:800;
  color:var(--tx);
  display:flex;
  align-items:center;
  gap:6px;
  flex-wrap:wrap;
  margin-bottom:6px;
}
.ev-fields{
  display:flex;
  gap:12px;
  font-family:var(--mono);
  font-size:12px;
  color:var(--mu);
  flex-wrap:wrap;
  align-items:center;
}
.ev-timing{
  text-align:right;
  flex-shrink:0;
  margin-left:6px;
}
.ev-t{
  font-family:var(--mono);
  font-size:12px;
  font-weight:800;
  color:var(--tx);
  white-space:nowrap;
}
.ev-d{
  font-family:var(--mono);
  font-size:11px;
  color:var(--mu);
}
.inum{background:transparent;border:none;border-bottom:1px solid var(--b2);
  color:var(--tx);font-family:var(--mono);font-size:13px;width:52px;text-align:center;outline:none;padding:0 1px}
.inum:focus{border-bottom-color:var(--ac)}

/* ─── BADGES ─── */
.badge{display:inline-flex;align-items:center;gap:3px;padding:1px 5px;border-radius:2px;
  font-family:var(--mono);font-size:8px;font-weight:600;letter-spacing:.06em;text-transform:uppercase}
.b1m{background:rgba(61,139,255,.14);color:var(--ac)}
.b3m{background:rgba(245,166,35,.14);color:var(--wo)}
.bPl{background:rgba(34,196,126,.14);color:var(--gn)}
.bF{background:rgba(232,68,68,.1);color:var(--rd)}
.bM{background:rgba(61,139,255,.1);color:var(--ac)}
.bSp{background:rgba(155,109,255,.18);color:var(--pu)}
.bCf{background:rgba(232,68,68,.14);color:var(--rd)}

/* ─── INVALID DROP FLASH ─── */
.invalid-drop-flash{animation:flashRed .45s ease-out}
@keyframes flashRed{0%{background:rgba(232,68,68,.25)}100%{background:transparent}}

/* ─── ADD ZONES ─── */
.add-board{border:1px dashed var(--b2);border-radius:10px;padding:10px 14px;text-align:center;
  cursor:pointer;font-family:var(--mono);font-size:11px;color:var(--mu);transition:all .12s;margin:6px 10px}
.add-board:hover{border-color:var(--gn);color:var(--gn);background:rgba(34,196,126,.04)}
.add-sess{border:1px dashed var(--b2);border-radius:10px;padding:18px;text-align:center;
  cursor:pointer;font-family:var(--mono);font-size:13px;color:var(--mu);transition:all .12s}
.add-sess:hover{border-color:var(--ac);color:var(--ac);background:rgba(61,139,255,.04)}
.add-day-col{width:180px;flex-shrink:0}
.add-day-btn{border:1px dashed var(--b2);border-radius:10px;padding:16px 12px;text-align:center;
  cursor:pointer;font-family:var(--mono);font-size:13px;color:var(--mu);transition:all .12s;
  display:flex;flex-direction:column;align-items:center;gap:6px;height:76px;justify-content:center}
.add-day-btn:hover{border-color:var(--wo);color:var(--wo);background:rgba(245,166,35,.04)}

/* ─── START TIME PICKER ─── */
.stp{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:4px}
.stp-val{font-family:var(--mono);font-size:14px;color:var(--tx);font-weight:600;min-width:80px}
.stp-btn{padding:4px 8px;border-radius:3px;border:1px solid var(--b1);background:var(--s3);
  color:var(--mu);font-family:var(--mono);font-size:10px;cursor:pointer;transition:all .1s}
.stp-btn:hover{border-color:var(--ac);color:var(--ac)}

/* ─── MODAL ─── */
.ov{position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:100;display:flex;align-items:center;justify-content:center}
.modal{
  background:var(--s1);
  border:1px solid var(--b1);
  border-radius:14px;
  padding:20px;
  width:560px;
  max-width:95vw;
  max-height:85vh;
  display:flex;
  flex-direction:column;
  gap:12px;
}
.modal-title{
  font-family:var(--mono);
  font-size:11px;
  letter-spacing:.18em;
  text-transform:uppercase;
  color:var(--ac);
}
.picker-list{overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:3px;max-height:320px}
.pick-row{
  display:flex;
  align-items:center;
  gap:8px;
  padding:10px 12px;
  background:var(--s2);
  border:1px solid var(--b1);
  border-radius:8px;
  cursor:pointer;
  font-family:var(--mono);
  font-size:12px;
  transition:border-color .1s, background .1s;
}
.pick-row:hover{border-color:var(--ac);color:var(--ac)}
.pick-row.used{opacity:.4;cursor:not-allowed;pointer-events:none}
.pick-row.wrong-type{opacity:.45;cursor:not-allowed;pointer-events:none;border-left:2px solid var(--rd)}
.urlbox{background:var(--bg);border:1px solid var(--b1);border-radius:3px;
  padding:9px 11px;font-family:var(--mono);font-size:10px;color:var(--mu);word-break:break-all}

/* ─── EMPTY ─── */
.empty-board{
  font-family:var(--mono);
  font-size:12px;
  color:var(--mu);
  padding:16px 10px;
  text-align:center;
  border-radius:8px;
  border:1px dashed var(--b1);
}

/* ─── PRINT / TABLE ─── */
.print-view{flex:1;overflow-y:auto;padding:20px}
.ptbl{width:100%;border-collapse:collapse}
.ptbl th{font-family:var(--mono);font-size:9px;letter-spacing:.15em;text-transform:uppercase;
  color:var(--mu);padding:5px 8px;text-align:left;border-bottom:1px solid var(--b1);background:var(--bg);position:sticky;top:0}
.ptbl td{padding:5px 8px;border-bottom:1px solid var(--b1);font-family:var(--mono);font-size:10px}
.pday-title{font-family:var(--mono);font-size:13px;font-weight:600;color:var(--wo);
  border-bottom:1px solid var(--b1);padding-bottom:6px;margin-bottom:12px}
.psess-title{font-family:var(--mono);font-size:10px;font-weight:600;color:var(--tx);
  background:var(--s2);border:1px solid var(--b1);padding:6px 10px;margin-bottom:0}
.psess-wu{font-family:var(--mono);font-size:9px;color:var(--pu);
  padding:4px 10px;background:rgba(155,109,255,.07);border:1px solid var(--b1);border-top:none}
.pboard-title{font-family:var(--mono);font-size:9px;font-weight:600;color:var(--gn);
  padding:5px 10px;background:var(--s3);border:1px solid var(--b1);border-top:none}
.psess-foot{font-family:var(--mono);font-size:9px;color:var(--mu);
  padding:5px 10px;background:var(--s2);border:1px solid var(--b1);border-top:none;margin-bottom:14px}

/* ─── DASHBOARD ─── */
.dash{flex:1;overflow-y:auto;padding:18px}
.stat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:10px;margin-bottom:18px}
.stat{background:var(--s1);border:1px solid var(--b1);border-radius:4px;padding:13px 15px}
.stat-v{font-family:var(--mono);font-size:26px;font-weight:600;color:var(--tx);line-height:1}
.stat-l{font-family:var(--mono);font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--mu);margin-top:5px}
.cf-panel{background:rgba(232,68,68,.07);border:1px solid rgba(232,68,68,.3);
  border-radius:4px;padding:12px;margin-bottom:16px}
.cf-title{font-family:var(--mono);font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:var(--rd);margin-bottom:8px}
.cf-item{font-family:var(--mono);font-size:10px;color:var(--tx);padding:3px 0;display:flex;gap:6px;align-items:flex-start;line-height:1.5}

/* ─── READ-ONLY ─── */
.ro-banner{background:var(--ac);color:#fff;font-family:var(--mono);font-size:10px;
  letter-spacing:.1em;text-align:center;padding:5px;flex-shrink:0}

/* ─── PRINT ─── */
@media print{
  .no-print{display:none!important}
  .app{height:auto;overflow:visible}
  .main{flex-direction:column;overflow:visible}
  .sidebar{display:none}
  body{background:#fff;color:#000}
  :root{--tx:#000;--mu:#555;--b1:#bbb;--s1:#f8f8f8;--s2:#efefef;--bg:#fff;--wo:#333;--b2:#ccc;--s3:#e8e8e8;--pu:#6600cc;--gn:#006633}
}

/* ─── RESPONSIVE ─── */
@media (max-width: 1200px){

  .sidebar{
    width:320px;
    min-width:320px;
  }

  .board-block{
    min-width:260px;
    flex:1 1 260px;
  }

  .sess-boards{
    gap:10px;
  }

  .kanban{
    gap:22px;
    padding:20px 16px 20px 0;
  }
}
`;

// ─────────────────────────────────────────────────────────────────────────────
// DRAG REGISTRY — module-level (no re-render on drag move)
// Stores: {evId, fromDayId, fromSessId, fromBoardId, evBoardType}
// ─────────────────────────────────────────────────────────────────────────────
const DRAG = {current: null};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function BoardBadge({board}){
  const cls = board==="1m"?"b1m":board==="3m"?"b3m":"bPl";
  return <span className={`badge ${cls}`}>{board}</span>;
}

// Check if an event's board type is compatible with a physical board
function isCompatible(evBoardType, physicalBoardType){
  const compat = BOARD_TYPE_COMPAT[physicalBoardType] || [];
  return compat.includes(evBoardType);
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: StartTimePicker — 12h AM/PM step-based control
// ─────────────────────────────────────────────────────────────────────────────
function StartTimePicker({value, onChange}){
  // value is "HH:MM" 24h
  const min = toMin(value);

  function step(delta){
    const next = ((min + delta) % 1440 + 1440) % 1440;
    onChange(toHHMM(next));
  }

  const steps = [-30, -15, -5, 5, 15, 30];

  return (
    <div className="stp">
      {steps.slice(0,3).map(s => (
        <button key={s} className="stp-btn" onClick={()=>step(s)}>{s}m</button>
      ))}
      <span className="stp-val">{fmt12(value)}</span>
      {steps.slice(3).map(s => (
        <button key={s} className="stp-btn" onClick={()=>step(s)}>+{s}m</button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: EventCard
// ─────────────────────────────────────────────────────────────────────────────
function EventCard({ev, dayId, sessId, boardId, boardType, sessSpd, globalSpd, isBoardSplit, onUpdate, onDelete, isRO, hasConflict, onDrop}){
  const spd = sessSpd ?? globalSpd;
  const compMin = Math.ceil(evCompMin(ev, spd, isBoardSplit));
  const [over, setOver] = useState(null);
  const cardRef = useRef(null);

  function dragStart(e){
    DRAG.current = {evId:ev.id, fromDayId:dayId, fromSessId:sessId, fromBoardId:boardId, evBoardType:ev.board};
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", ev.id);
    setTimeout(()=>{ if(cardRef.current) cardRef.current.classList.add("isdrag"); }, 0);
  }
  function dragEnd(){
    DRAG.current = null;
    setOver(null);
    if(cardRef.current) cardRef.current.classList.remove("isdrag");
  }
  function dragOver(e){
    if(!DRAG.current) return;
    e.preventDefault(); e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setOver(e.clientY < rect.top + rect.height/2 ? "before" : "after");
  }
  function drop(e){
    e.preventDefault(); e.stopPropagation();
    if(!DRAG.current || DRAG.current.evId===ev.id){ setOver(null); return; }
    // Board-type compatibility check
    if(!isCompatible(DRAG.current.evBoardType, boardType)){
      setOver(null);
      if(cardRef.current){ cardRef.current.classList.add("invalid-drop-flash"); setTimeout(()=>cardRef.current?.classList.remove("invalid-drop-flash"),500); }
      return;
    }
    onDrop({...DRAG.current, toDayId:dayId, toSessId:sessId, toBoardId:boardId, targetEvId:ev.id, side:over??"after"});
    setOver(null);
  }

  const cls = ["ev-card", hasConflict?"conflict":"", over==="before"?"dbefore":over==="after"?"dafter":""].filter(Boolean).join(" ");

  return(
    <div ref={cardRef} className={cls} draggable={!isRO}
      onDragStart={dragStart} onDragEnd={dragEnd}
      onDragOver={dragOver} onDragLeave={()=>setOver(null)} onDrop={drop}>
      <div className="ev-inner">
        {!isRO&&<div className="ev-grip no-print"><Ic n="drag" sz={13} c="var(--b2)"/></div>}
        <div className="ev-body">
          <div className="ev-name">
            <span>{ev.customLabel||ev.label}</span>
            <BoardBadge board={ev.board}/>
            <span className={`badge ${ev.gender==="F"?"bF":"bM"}`}>{ev.gender==="F"?"Girls":"Boys"}</span>
            {hasConflict&&<span className="badge bCf">conflict</span>}
          </div>
          <div className="ev-fields">
            <span>Divers:{" "}
              {isRO ? ev.divers : (
                <input className="inum" type="number" min={1} max={999} value={ev.divers}
                  onChange={e=>onUpdate(ev.id,"divers",Number(e.target.value))}
                  onClick={e=>e.stopPropagation()}/>
              )}
            </span>
            <span>Dives:<strong style={{color:"var(--tx)",marginLeft:2}}>{ev.dives}</strong></span>
            {isBoardSplit && <span style={{color:"var(--pu)",fontSize:10}}>÷2 split</span>}
          </div>
        </div>
        <div className="ev-timing">
          <div className="ev-t">{ev._start12}–{ev._end12}</div>
          <div className="ev-d">{compMin}min</div>
        </div>
        {!isRO&&(
          <button className="btn g sm no-print" style={{marginLeft:4}} onClick={()=>onDelete(ev.id)}>
            <Ic n="x" sz={10}/>
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: EventPickerModal — filters to board-compatible events only
// ─────────────────────────────────────────────────────────────────────────────
function EventPickerModal({gbKey, boardType, existingAthKeys, onSelect, onClose}){
  const gb = GB[gbKey];
  const [divers, setDivers] = useState(10);
  const [filt, setFilt] = useState("");
  const filtered = gb.events.filter(t => !filt || `${t.label} ${t.board}`.toLowerCase().includes(filt.toLowerCase()));

  return(
    <div className="ov" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">Add Event to {boardType} Board — {gb.label}</div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <input style={{flex:1,background:"var(--bg)",border:"1px solid var(--b1)",color:"var(--tx)",
            fontFamily:"var(--mono)",fontSize:11,padding:"5px 8px",borderRadius:3,outline:"none",minWidth:120}}
            placeholder="Filter…" value={filt} onChange={e=>setFilt(e.target.value)}/>
          <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--mu)"}}>Divers:
            <input className="inum" type="number" min={1} max={999} value={divers}
              onChange={e=>setDivers(Number(e.target.value))} style={{width:40,marginLeft:4}}/>
          </span>
        </div>
        <div className="picker-list">
          {filtered.length===0&&<div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--mu)",padding:12,textAlign:"center"}}>No matches</div>}
          {filtered.map(t => {
            const cfl = existingAthKeys.has(t.athleteKey);
            const incompatible = !isCompatible(t.board, boardType);
            return(
              <div key={t.tmplId} className={`pick-row${cfl?" used":""}${incompatible?" wrong-type":""}`}
                onClick={()=>!cfl&&!incompatible&&onSelect(t,divers)}
                title={cfl?"Athlete group already in session":incompatible?`Event type ${t.board} incompatible with ${boardType} board`:""}>
                <span style={{flex:1}}>{t.label}</span>
                <BoardBadge board={t.board}/>
                <span className={`badge ${t.gender==="F"?"bF":"bM"}`}>{t.gender==="F"?"Girls":"Boys"}</span>
                <span style={{color:"var(--mu)",fontSize:9,marginLeft:4}}>{t.dives} dives</span>
                {cfl&&<span className="badge bCf">conflict</span>}
                {incompatible&&<span style={{color:"var(--rd)",fontSize:9,marginLeft:4}}>wrong type</span>}
              </div>
            );
          })}
        </div>
        <button className="btn" onClick={onClose}><Ic n="x" sz={10}/>Close</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: BoardBlock
// ─────────────────────────────────────────────────────────────────────────────
function BoardBlock({rawBoard, timedBoard, dayId, sessId, sessSpd, globalSpd,
  conflicts, dupKeys, onUpdateBoard, onDeleteBoard, onUpdateEv, onDeleteEv,
  onAddEv, onDrop, isRO, gbKey, sessConflictIds}){

  const [picker, setPicker] = useState(false);
  const [dropState, setDropState] = useState(null); // "valid" | "invalid" | null
  const blockRef = useRef(null);

  // All athleteKeys already in this session (across all boards) for conflict gating
  const existingAthKeys = new Set(
    conflicts.allSessEvs ? conflicts.allSessEvs.map(e=>e.athleteKey).filter(Boolean) : []
  );

  function onBoardDragOver(e){
    if(!DRAG.current) return;
    e.preventDefault();
    const compat = isCompatible(DRAG.current.evBoardType, rawBoard.boardType);
    setDropState(compat ? "valid" : "invalid");
  }
  function onBoardDragLeave(){ setDropState(null); }
  function onBoardDrop(e){
    e.preventDefault();
    if(!DRAG.current){ setDropState(null); return; }
    if(!isCompatible(DRAG.current.evBoardType, rawBoard.boardType)){
      setDropState(null);
      if(blockRef.current){ blockRef.current.classList.add("invalid-drop-flash"); setTimeout(()=>blockRef.current?.classList.remove("invalid-drop-flash"),500); }
      return;
    }
    onDrop({...DRAG.current, toDayId:dayId, toSessId:sessId, toBoardId:rawBoard.id, targetEvId:null, side:"after"});
    setDropState(null);
  }

  const boardDurMin = timedBoard._durMin;

  return(
    <div ref={blockRef}
      className={`board-block${dropState==="valid"?" drop-valid":dropState==="invalid"?" drop-invalid":""}`}
      onDragOver={onBoardDragOver} onDragLeave={onBoardDragLeave} onDrop={onBoardDrop}>

      <div className="board-hdr">
        <div className="board-lbl">
          <Ic n="board" sz={11} c="var(--mu)"/>
          {" "}{rawBoard.label}
        </div>
        {rawBoard.split && (
          <span className="board-split-badge"><Ic n="split" sz={8} c="var(--pu)"/>SPLIT</span>
        )}
        <span className="board-dur">{boardDurMin}min</span>
        {!isRO&&(
          <>
            <button className="btn g sm no-print" title={rawBoard.split?"Disable split":"Enable split board"}
              onClick={()=>onUpdateBoard(rawBoard.id,"split",!rawBoard.split)}
              style={{marginLeft:4}}>
              <Ic n="split" sz={10} c={rawBoard.split?"var(--pu)":"var(--mu)"}/>
            </button>
            {timedBoard.events.length===0&&(
              <button className="btn d sm no-print" title="Delete board"
                onClick={()=>onDeleteBoard(rawBoard.id)}>
                <Ic n="trash" sz={10}/>
              </button>
            )}
          </>
        )}
      </div>

      <div className="board-events">
        {timedBoard.events.map(ev=>(
          <EventCard key={ev.id} ev={ev} dayId={dayId} sessId={sessId} boardId={rawBoard.id}
            boardType={rawBoard.boardType}
            sessSpd={sessSpd} globalSpd={globalSpd} isBoardSplit={rawBoard.split}
            onUpdate={onUpdateEv} onDelete={onDeleteEv}
            isRO={isRO} hasConflict={dupKeys.has(ev.athleteKey)}
            onDrop={onDrop}/>
        ))}
        {timedBoard.events.length===0&&(
          <div className="empty-board">Drop {rawBoard.boardType} events here</div>
        )}
      </div>

      {!isRO&&(
        <div className="add-board" style={{margin:"0 8px 8px",padding:"7px 10px"}}
          onClick={()=>setPicker(true)}>
          <Ic n="plus" sz={10}/>  Add event
        </div>
      )}

      {picker&&!isRO&&(
        <EventPickerModal gbKey={gbKey} boardType={rawBoard.boardType}
          existingAthKeys={conflicts.allSessKeys||new Set()}
          onSelect={(t,divers)=>{onAddEv(dayId,sessId,rawBoard.id,t,divers);setPicker(false);}}
          onClose={()=>setPicker(false)}/>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: AddBoardModal
// ─────────────────────────────────────────────────────────────────────────────
function AddBoardModal({onAdd, onClose}){
  const types = ["1m","3m","Plat"];
  const [label, setLabel] = useState("");
  const [type, setType] = useState("1m");
  return(
    <div className="ov" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:360}}>
        <div className="modal-title">Add Board to Session</div>
        <div className="fr"><div className="fl">Board Type</div>
          <select className="fi" value={type} onChange={e=>{setType(e.target.value);if(!label)setLabel(`${e.target.value} Board`);}}>
            {types.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="fr"><div className="fl">Label (optional)</div>
          <input className="fi" value={label} placeholder={`${type} Board`}
            onChange={e=>setLabel(e.target.value)}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn p" onClick={()=>onAdd(type, label||`${type} Board`)}>
            <Ic n="plus" sz={10}/>Add Board
          </button>
          <button className="btn" onClick={onClose}><Ic n="x" sz={10}/>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: SessionCard
// ─────────────────────────────────────────────────────────────────────────────
function SessionCard({rawSess, timedSess, dayId, conflicts, globalSpd, globalBuffer,
  onUpdateSess, onDeleteSess, onUpdateBoard, onDeleteBoard,
  onUpdateEv, onDeleteEv, onAddEv, onDrop, isRO, gbKey}){

  const [cfg, setCfg] = useState(false);
  const [addBoardModal, setAddBoardModal] = useState(false);

  const dur = timedSess._dur;
  const sessCfls = conflicts.filter(c=>c.sessId===rawSess.id);

  // Build set of all athleteKeys in this session (across all boards) for conflict detection
  const allSessEvs = (timedSess.boards||[]).flatMap(b=>b.events||[]);
  const allSessKeys = new Set(allSessEvs.map(e=>e.athleteKey).filter(Boolean));
  const dupKeys = new Set();
  if(sessCfls.length){
    const seen={};
    allSessEvs.forEach(ev=>{
      const k=ev.athleteKey; if(!k) return;
      if(seen[k]) dupKeys.add(k);
      seen[k]=true;
    });
  }

  const conflictsCtx = {allSessEvs, allSessKeys};

  return(
    <div className="sess-card">
      {/* Header */}
      <div className="sess-hdr">
        <div className="sess-lbl">{timedSess.label}</div>
        <div className="sess-time">{timedSess._start12}–{timedSess._end12}</div>
        {!isRO&&(
          <>
            <button
              className="btn g no-print"
              title="Session Settings"
              onClick={()=>setCfg(v=>!v)}
              style={{
                padding:"8px 12px",
                fontSize:14,
                fontWeight:700
            }}
>
  <Ic n="cog" sz={14}/> Session Settings
</button>
            <button className="btn d sm no-print" title="Delete session" onClick={()=>onDeleteSess(rawSess.id)}>
              <Ic n="trash" sz={10}/>
            </button>
          </>
        )}
      </div>

      {/* Config panel */}
      {cfg&&!isRO&&(
        <div className="sess-cfg-panel">
          <div className="cfg-row"><label>Label</label>
            <input className="cfg-i" style={{width:150}} value={timedSess.label}
              onChange={e=>onUpdateSess(rawSess.id,"label",e.target.value)}/></div>
          <div className="cfg-row"><label>Sec / dive</label>
            <input className="cfg-i" type="number" min={5} max={120}
              value={timedSess.secondsPerDive??globalSpd}
              onChange={e=>onUpdateSess(rawSess.id,"secondsPerDive",Number(e.target.value))}/></div>
          <div className="cfg-row"><label>Buffer (min)</label>
            <input className="cfg-i" type="number" min={0} max={60}
              value={timedSess.bufferMinutes??globalBuffer}
              onChange={e=>onUpdateSess(rawSess.id,"bufferMinutes",Number(e.target.value))}/></div>
          <div className="cfg-row"><label>Warm-up (min)</label>
            <input className="cfg-i" type="number" min={0} max={60}
              value={timedSess.warmupMinutes??0}
              onChange={e=>onUpdateSess(rawSess.id,"warmupMinutes",Number(e.target.value))}/></div>
          <button
            className="btn p"
            style={{
              marginTop:8,
              padding:"10px 14px",
              fontSize:14,
              fontWeight:700,
              alignSelf:"flex-start"
            }}
            onClick={()=>setCfg(false)}
          >
            Done
          </button>
        </div>
      )}

      {/* Warm-up block — session-level, not draggable */}
      <div className="sess-wu">
        <Ic n="split" sz={10} c="var(--pu)"/>
        WARM-UP {timedSess.warmupMinutes??0}min
        {timedSess._start12 ? ` · starts ${timedSess._start12}` : ""}
        {timedSess._warmupEnd12 ? ` · ends ${timedSess._warmupEnd12}` : ""}
      </div>

      {/* Boards */}
      <div className="sess-boards">
        {(timedSess.boards||[]).map(tb => {
          const rawBoard = (rawSess.boards||[]).find(b=>b.id===tb.id);
          if(!rawBoard) return null;
          return(
            <BoardBlock key={tb.id}
              rawBoard={rawBoard} timedBoard={tb}
              dayId={dayId} sessId={rawSess.id}
              sessSpd={timedSess.secondsPerDive} globalSpd={globalSpd}
              conflicts={conflictsCtx} dupKeys={dupKeys}
              onUpdateBoard={onUpdateBoard} onDeleteBoard={onDeleteBoard}
              onUpdateEv={onUpdateEv} onDeleteEv={onDeleteEv} onAddEv={onAddEv}
              onDrop={onDrop} isRO={isRO} gbKey={gbKey}/>
          );
        })}
        {!isRO&&(
          <div className="add-board" onClick={()=>setAddBoardModal(true)}>
            <Ic n="plus" sz={11}/>  Add Board
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sess-foot">
        <div className="sess-stat">
          Comp (max board): {dur.compMin}min · Warm-up: {dur.warmupMin}min · Buffer: {dur.bufMin}min · Total: {dur.total}min
        </div>
      </div>

      {/* Conflict strip */}
      {sessCfls.length>0&&(
        <div className="sess-conflict">
          <Ic n="warn" sz={10} c="var(--rd)"/>
          {sessCfls.length} athlete-group conflict{sessCfls.length>1?"s":""} — same group competing twice in one session
        </div>
      )}

      {addBoardModal&&!isRO&&(
        <AddBoardModal
          onAdd={(type,label)=>{ onUpdateSess(rawSess.id,"_addBoard",{type,label}); setAddBoardModal(false); }}
          onClose={()=>setAddBoardModal(false)}/>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: DayColumn
// ─────────────────────────────────────────────────────────────────────────────
function DayColumn({rawDay, timedDay, dayIdx, conflicts, globalSpd, globalBuffer,
  onUpdateDay, onDeleteDay, onAddSession, onUpdateSess, onDeleteSess,
  onUpdateBoard, onDeleteBoard,
  onUpdateEv, onDeleteEv, onAddEv, onDrop, isRO, gbKey}){

  return(
    <div className="day-col">
      <div className="day-hdr">
        <div style={{flex:1}}>
          <div className="day-title">{timedDay.label}</div>
          <div className="day-meta">{timedDay._start12}–{timedDay._end12} · {hm(timedDay._totalMin)}</div>
        </div>
        {!isRO&&(
          <div className="day-actions no-print">
            <button className="btn g sm" title="Rename"
              onClick={()=>{const l=prompt("Day label:",timedDay.label);if(l)onUpdateDay(rawDay.id,"label",l);}}>✎</button>
            <div style={{display:"flex",flexDirection:"column",gap:2,marginLeft:4}}>
              <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--mu)",marginBottom:2}}>Start time:</div>
              <StartTimePicker value={rawDay.startTime} onChange={v=>onUpdateDay(rawDay.id,"startTime",v)}/>
            </div>
            {timedDay.sessions.length===0&&(
              <button className="btn d sm" title="Delete day" onClick={()=>onDeleteDay(rawDay.id)} style={{marginLeft:4}}>
                <Ic n="trash" sz={9}/>
              </button>
            )}
          </div>
        )}
      </div>

      {timedDay.sessions.map((ts,si)=>(
        <SessionCard key={ts.id}
          rawSess={rawDay.sessions[si]} timedSess={ts}
          dayId={rawDay.id}
          conflicts={conflicts.filter(c=>c.dayIdx===dayIdx&&c.sessIdx===si)}
          globalSpd={globalSpd} globalBuffer={globalBuffer}
          onUpdateSess={onUpdateSess} onDeleteSess={onDeleteSess}
          onUpdateBoard={onUpdateBoard} onDeleteBoard={onDeleteBoard}
          onUpdateEv={onUpdateEv} onDeleteEv={onDeleteEv} onAddEv={onAddEv}
          onDrop={onDrop} isRO={isRO} gbKey={gbKey}/>
      ))}

      {!isRO&&(
        <div className="add-sess" onClick={()=>onAddSession(rawDay.id)}>
          <Ic n="plus" sz={11}/>  Add Session
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: KanbanBoard
// ─────────────────────────────────────────────────────────────────────────────
function KanbanBoard({timedDays, rawDays, conflicts, globalSpd, globalBuffer,
  onUpdateDay, onDeleteDay, onAddDay, onAddSession,
  onUpdateSess, onDeleteSess, onUpdateBoard, onDeleteBoard,
  onUpdateEv, onDeleteEv, onAddEv, onDrop, isRO, gbKey}){
  return(
    <div className="kanban">
      {timedDays.map((td,di)=>(
        <DayColumn key={td.id}
          rawDay={rawDays[di]} timedDay={td} dayIdx={di}
          conflicts={conflicts}
          globalSpd={globalSpd} globalBuffer={globalBuffer}
          onUpdateDay={onUpdateDay} onDeleteDay={onDeleteDay} onAddSession={onAddSession}
          onUpdateSess={onUpdateSess} onDeleteSess={onDeleteSess}
          onUpdateBoard={onUpdateBoard} onDeleteBoard={onDeleteBoard}
          onUpdateEv={onUpdateEv} onDeleteEv={onDeleteEv} onAddEv={onAddEv}
          onDrop={onDrop} isRO={isRO} gbKey={gbKey}/>
      ))}
      {!isRO&&(
        <div className="add-day-col">
          <div className="add-day-btn" onClick={onAddDay}>
            <Ic n="plus" sz={16} c="var(--mu)"/>
            <span>Add Day</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: PrintView
// ─────────────────────────────────────────────────────────────────────────────
function PrintView({timedDays, meet}){
  return(
    <div className="print-view">
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:"var(--mono)",fontSize:16,fontWeight:600,color:"var(--tx)"}}>{meet.name}</div>
        <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--mu)",marginTop:3}}>
          {meet.startDate} · {GB[meet.governingBody].label} · Printed {new Date().toLocaleDateString()}
        </div>
      </div>
      {timedDays.map(day=>(
        <div key={day.id} style={{marginBottom:28}}>
          <div className="pday-title">{day.label} · {day._start12}–{day._end12} · {hm(day._totalMin)}</div>
          {day.sessions.map(sess=>(
            <div key={sess.id} style={{marginBottom:0}}>
              <div className="psess-title">
                {sess.label} · {sess._start12}–{sess._end12} · {hm(sess._dur.total)}
                {" · "}{(sess.boards||[]).length} board{(sess.boards||[]).length!==1?"s":""}
              </div>
              <div className="psess-wu">
                ▶ WARM-UP: {sess.warmupMinutes??0}min · Starts {sess._start12} · Ends {sess._warmupEnd12}
              </div>
              {(sess.boards||[]).map((board,bi)=>(
                <div key={board.id}>
                  <div className="pboard-title">
                    Board {bi+1}: {board.label}
                    {board.split ? " · SPLIT BOARD" : ""}
                    {board.split ? ` (timing: ceil(divers/2)×dives×spd)` : ""}
                    {" · "}{board._durMin}min
                  </div>
                  <table className="ptbl">
                    <thead><tr>
                      <th>#</th><th>Event</th><th>Board</th><th>Group</th>
                      <th>Dives</th><th>Divers</th>
                      {board.split&&<th>Eff. Divers</th>}
                      <th>Start</th><th>End</th><th>Comp min</th>
                    </tr></thead>
                    <tbody>
                      {(board.events||[]).map((ev,i)=>(
                        <tr key={ev.id}>
                          <td>{i+1}</td>
                          <td>{ev.customLabel||ev.label}</td>
                          <td>{ev.board}</td>
                          <td>{ev.group}</td>
                          <td>{ev.dives}</td>
                          <td>{ev.divers}</td>
                          {board.split&&<td>{Math.ceil(ev.divers/2)}</td>}
                          <td style={{fontWeight:600}}>{ev._start12}</td>
                          <td style={{fontWeight:600}}>{ev._end12}</td>
                          <td>{ev._min}min</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
              <div className="psess-foot">
                Boards run simultaneously · Session comp (slowest board): {sess._dur.compMin}min
                · Warm-up: {sess._dur.warmupMin}min · Buffer: {sess._dur.bufMin}min
                · Session total: {sess._dur.total}min
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: DashboardView
// ─────────────────────────────────────────────────────────────────────────────
function DashboardView({timedDays, meet, conflicts}){
  const allBoards = timedDays.flatMap(d=>d.sessions.flatMap(s=>s.boards||[]));
  const allEvs = allBoards.flatMap(b=>b.events||[]);
  const allSess = timedDays.flatMap(d=>d.sessions);
  const totalMin = timedDays.reduce((s,d)=>s+d._totalMin,0);
  const gb = GB[meet.governingBody];
  const stats=[
    ["Days",timedDays.length],
    ["Sessions",allSess.length],
    ["Boards",allBoards.length],
    ["Events",allEvs.length],
    ["Total Divers",allEvs.reduce((s,e)=>s+e.divers,0)],
    ["Est. Duration",hm(totalMin)],
    ["Split Boards",allBoards.filter(b=>b.split).length],
    ["Conflicts",conflicts.length],
  ];
  return(
    <div className="dash">
      <div style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:".2em",textTransform:"uppercase",color:"var(--mu)",marginBottom:12}}>
        Active rules: {gb.label} ({gb.abbr}) · {gb.events.length} events in profile
      </div>
      <div className="stat-grid">
        {stats.map(([l,v])=>(
          <div key={l} className="stat">
            <div className="stat-v" style={l==="Conflicts"&&conflicts.length?{color:"var(--rd)"}:{}}>{v}</div>
            <div className="stat-l">{l}</div>
          </div>
        ))}
      </div>
      {conflicts.length>0&&(
        <div className="cf-panel">
          <div className="cf-title">Athlete Group Conflicts — {conflicts.length}</div>
          {conflicts.map((c,i)=>(
            <div key={i} className="cf-item"><Ic n="warn" sz={10} c="var(--rd)"/><span>{c.msg}</span></div>
          ))}
        </div>
      )}
      {timedDays.map(day=>(
        <div key={day.id} style={{marginBottom:20}}>
          <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".12em",textTransform:"uppercase",
            color:"var(--wo)",borderBottom:"1px solid var(--b1)",paddingBottom:5,marginBottom:10}}>
            {day.label} · {day._start12}–{day._end12} · {hm(day._totalMin)}
          </div>
          {day.sessions.map(sess=>(
            <div key={sess.id} style={{marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <span style={{fontFamily:"var(--mono)",fontSize:11,fontWeight:600}}>{sess.label}</span>
                <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--mu)"}}>{sess._start12}–{sess._end12} · {hm(sess._dur.total)}</span>
              </div>
              {(sess.boards||[]).map((board,bi)=>(
                <div key={board.id} style={{marginBottom:8}}>
                  <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--gn)",marginBottom:4,display:"flex",gap:6,alignItems:"center"}}>
                    Board {bi+1}: {board.label}
                    {board.split&&<span className="badge bSp">SPLIT</span>}
                    <span style={{color:"var(--mu)"}}>{board._durMin}min</span>
                  </div>
                  <table className="ptbl">
                    <thead><tr><th>#</th><th>Event</th><th>Board</th><th>Dives</th><th>Divers</th><th>Start</th><th>End</th><th>Comp</th></tr></thead>
                    <tbody>
                      {(board.events||[]).map((ev,i)=>(
                        <tr key={ev.id}>
                          <td>{i+1}</td><td>{ev.customLabel||ev.label}</td><td>{ev.board}</td>
                          <td>{ev.dives}</td><td>{ev.divers}</td>
                          <td style={{fontWeight:600}}>{ev._start12}</td>
                          <td style={{fontWeight:600}}>{ev._end12}</td>
                          <td>{ev._min}min</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: Sidebar
// ─────────────────────────────────────────────────────────────────────────────
function Sidebar({meet, setMeet, onGenerate}){
  const gb = GB[meet.governingBody];
  const up = (k,v) => setMeet(m=>({...m,[k]:v}));
  return(
    <div className="sidebar no-print">
      <div className="ss">
        <div className="sl">Meet Setup</div>
        <div className="fr">
          <div className="fl">Meet Name</div>
          <input className="fi" value={meet.name} onChange={e=>up("name",e.target.value)} placeholder="Spring Invitational 2025"/>
        </div>
        <div className="fr">
          <div className="fl">Date</div>
          <input className="fi" type="date" value={meet.startDate} onChange={e=>up("startDate",e.target.value)}/>
        </div>
      </div>

      <div className="ss">
        <div className="sl">Governing Body</div>
        <select className="fi" value={meet.governingBody} onChange={e=>up("governingBody",e.target.value)}>
          {Object.entries(GB).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div className="ss">
        <div className="sl">Global Defaults</div>
        <div className="fr">
          <div className="fl">Seconds per dive</div>
          <input className="fi" type="number" min={5} max={120} value={meet.secondsPerDive}
            onChange={e=>up("secondsPerDive",Number(e.target.value))}/>
        </div>
        <div className="fr">
          <div className="fl">Warm-up minutes</div>
          <input className="fi" type="number" min={0} max={60} value={meet.warmupMinutes}
            onChange={e=>up("warmupMinutes",Number(e.target.value))}/>
        </div>
        <div className="fr">
          <div className="fl">Buffer between sessions</div>
          <input className="fi" type="number" min={0} max={60} value={meet.bufferMinutes}
            onChange={e=>up("bufferMinutes",Number(e.target.value))}/>
        </div>
      </div>

      <div className="ss">
        <button className="btn p" style={{width:"100%"}} onClick={onGenerate}>
          <Ic n="cog" sz={11}/>Generate from {gb.abbr} rules
        </button>
        <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--mu)",marginTop:8,lineHeight:1.7}}>
          Builds Day → Session → Board → Event structure from governing body defaults. Replaces existing schedule.
        </div>
      </div>

      <div className="ss">
        <div className="sl">Rule Profile (read-only)</div>
        <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--mu)",lineHeight:1.9}}>
          {gb.events.slice(0,8).map(e=>(
            <div key={e.tmplId} style={{display:"flex",justifyContent:"space-between"}}>
              <span>{e.label} {e.board}</span>
              <span style={{color:"var(--tx)"}}>{e.dives}d</span>
            </div>
          ))}
          {gb.events.length>8&&<div style={{color:"var(--b2)"}}>+{gb.events.length-8} more</div>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: ShareModal
// ─────────────────────────────────────────────────────────────────────────────
function ShareModal({meet, onClose}){
  const encoded = enc(meet);
  const url = `${window.location.href.split("?")[0]}?share=${encoded}`;
  const [copied, setCopied] = useState(false);
  function copy(){ navigator.clipboard.writeText(url).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); }); }
  return(
    <div className="ov" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">Share Meet Schedule</div>
        <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--mu)"}}>
          Full schedule is encoded in the URL. Anyone with this link sees a read-only view.
        </div>
        <div className="urlbox">{url.slice(0,100)}…</div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn p" onClick={copy}>
            {copied?<Ic n="check" sz={11}/>:<Ic n="copy" sz={11}/>}{copied?"Copied!":"Copy Link"}
          </button>
          <button className="btn" onClick={onClose}><Ic n="x" sz={11}/>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PURE STATE MUTATION HELPERS
// Architecture: Day → Session → Board → Event
// ─────────────────────────────────────────────────────────────────────────────
const mutDay = (days,id,k,v) => days.map(d=>d.id===id?{...d,[k]:v}:d);
const delDay = (days,id) => days.filter(d=>d.id!==id);
const addDay = (days) => [...days,{id:uid("day"),label:`Day ${days.length+1}`,startTime:"08:00",sessions:[]}];

const addSess = (days,dayId,spd,buf,wu) => days.map(d=>{
  if(d.id!==dayId) return d;
  const si = d.sessions.length+1;
  return {...d, sessions:[...d.sessions, {
    id:uid("sess"), label:`Session ${si}`,
    secondsPerDive:spd, bufferMinutes:buf, warmupMinutes:wu,
    boards:[],
  }]};
});

// mutSess: intercepts the special "_addBoard" key to add a board to a session
const mutSess = (days,sessId,k,v) => days.map(d=>({...d, sessions:d.sessions.map(s=>{
  if(s.id!==sessId) return s;
  if(k==="_addBoard"){
    return {...s, boards:[...(s.boards||[]), {
      id:uid("brd"), label:v.label, boardType:v.type, split:false, events:[],
    }]};
  }
  return {...s,[k]:v};
})}));

const delSess = (days,sessId) => days.map(d=>({...d,sessions:d.sessions.filter(s=>s.id!==sessId)}));

const mutBoard = (days,boardId,k,v) => days.map(d=>({...d,sessions:d.sessions.map(s=>({
  ...s, boards:(s.boards||[]).map(b=>b.id===boardId?{...b,[k]:v}:b)
}))}));

const delBoard = (days,boardId) => days.map(d=>({...d,sessions:d.sessions.map(s=>({
  ...s, boards:(s.boards||[]).filter(b=>b.id!==boardId)
}))}));

const mutEv = (days,evId,k,v) => days.map(d=>({...d,sessions:d.sessions.map(s=>({
  ...s, boards:(s.boards||[]).map(b=>({...b,events:b.events.map(e=>e.id===evId?{...e,[k]:v}:e)}))
}))}));

const delEv = (days,evId) => days.map(d=>({...d,sessions:d.sessions.map(s=>({
  ...s, boards:(s.boards||[]).map(b=>({...b,events:b.events.filter(e=>e.id!==evId)}))
}))}));

const addEv = (days,dayId,sessId,boardId,tmpl,divers) => days.map(d=>{
  if(d.id!==dayId) return d;
  return {...d, sessions:d.sessions.map(s=>{
    if(s.id!==sessId) return s;
    return {...s, boards:(s.boards||[]).map(b=>{
      if(b.id!==boardId) return b;
      return {...b, events:[...b.events, {...tmpl,id:uid("ev"),divers,customLabel:null}]};
    })};
  })};
});

// moveEv: board-aware move. Extracts event from source board, inserts into target board.
function moveEv(days, {evId, fromDayId, fromSessId, fromBoardId, toDayId, toSessId, toBoardId, targetEvId, side}){
  let moved = null;
  // Remove from source
  const without = days.map(d=>({...d,sessions:d.sessions.map(s=>({
    ...s, boards:(s.boards||[]).map(b=>{
      const e = b.events.find(e=>e.id===evId);
      if(e) moved = e;
      return {...b, events:b.events.filter(e=>e.id!==evId)};
    })
  }))}));
  if(!moved) return days;
  // Insert into target
  return without.map(d=>{
    if(d.id!==toDayId) return d;
    return {...d, sessions:d.sessions.map(s=>{
      if(s.id!==toSessId) return s;
      return {...s, boards:(s.boards||[]).map(b=>{
        if(b.id!==toBoardId) return b;
        const evs = [...b.events];
        if(!targetEvId){ evs.push(moved); }
        else{
          const ti = evs.findIndex(e=>e.id===targetEvId);
          if(ti===-1) evs.push(moved);
          else if(side==="before") evs.splice(ti,0,moved);
          else evs.splice(ti+1,0,moved);
        }
        return {...b, events:evs};
      })};
    })};
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT = {
  name:"2025 Spring Invitational",
  startDate:new Date().toISOString().split("T")[0],
  governingBody:"USA_DIVING",
  secondsPerDive:35,
  warmupMinutes:15,
  bufferMinutes:5,
  days:[],
};

function makeFreshMeetFromGB(meet, gbKey){
  const gb = GB[gbKey];

  return {
    ...DEFAULT,
    name: meet.name,
    startDate: meet.startDate,
    governingBody: gbKey,
    secondsPerDive: gb.defaultSpd,
    warmupMinutes: gb.defaultWarmup,
    bufferMinutes: gb.defaultBuffer,
    days: generateFromGB(gbKey),
  };
}

function loadSaved(){
  try{ const s=localStorage.getItem("divesheet_v4"); return s?JSON.parse(s):null; }
  catch{ return null; }
}

export default function App(){
  const urlParams = new URLSearchParams(window.location.search);
  const shareParam = urlParams.get("share");
  const sharedMeet = shareParam ? dec(shareParam) : null;
  const isRO = !!sharedMeet;

  const [meet, setMeet] = useState(sharedMeet || loadSaved() || DEFAULT);
  const [view, setView] = useState("kanban");
  const [showShare, setShowShare] = useState(false);

  useEffect(()=>{
    if(!isRO) localStorage.setItem("divesheet_v4",JSON.stringify(meet));
  },[meet,isRO]);

  // DERIVED — recalc is pure and fast
  const timedDays = recalcMeet(meet.days, meet.secondsPerDive, meet.bufferMinutes);
  const conflicts = detectConflicts(meet.days);

  function handleGenerate(){
    if(meet.days.length > 0 && !window.confirm(
      `This will clear the current schedule and rebuild it from ${GB[meet.governingBody].label} rules. Continue?`
    )) return;

    const gb = GB[meet.governingBody];

    setMeet(m => ({
      ...m,
      secondsPerDive: gb.defaultSpd,
      warmupMinutes: gb.defaultWarmup,
      bufferMinutes: gb.defaultBuffer,
      days: generateFromGB(m.governingBody),
    }));
  }

  const D = (fn) => (...args) => setMeet(m=>({...m, days:fn(m.days,...args)}));

  const handleUpdateDay    = D(mutDay);
  const handleDeleteDay    = D(delDay);
  const handleAddDay       = () => setMeet(m=>({...m,days:addDay(m.days)}));
  const handleAddSession   = D((days,dayId) => addSess(days,dayId,meet.secondsPerDive,meet.bufferMinutes,meet.warmupMinutes));
  const handleUpdateSess   = D(mutSess);
  const handleDeleteSess   = D(delSess);
  const handleUpdateBoard  = D(mutBoard);
  const handleDeleteBoard  = D(delBoard);
  const handleUpdateEv     = D(mutEv);
  const handleDeleteEv     = D(delEv);
  const handleAddEv        = D(addEv);
  const handleDrop         = useCallback((payload)=>setMeet(m=>({...m,days:moveEv(m.days,payload)})),[]);

  return(
    <>
      <style>{CSS}</style>
      <div className="app">
        {isRO&&<div className="ro-banner">READ-ONLY — {meet.name} · Shared view</div>}

        {/* NAV */}
        <div className="nav no-print">
          <span className="brand">DiveSheet</span>
          <span className="meetname"
            onClick={()=>{const n=prompt("Meet name:",meet.name);if(n!==null)setMeet(m=>({...m,name:n}));}}>
            {meet.name}
          </span>
          <div className="tabs">
            {[["kanban","Board"],["print","Print / Export"],["dashboard","Dashboard"]].map(([v,l])=>(
              <div key={v} className={`tab${view===v?" on":""}`} onClick={()=>setView(v)}>{l}</div>
            ))}
          </div>
          <div className="nav-sp"/>
          {conflicts.length>0&&(
            <div className="conflict-pill">
              <Ic n="warn" sz={11} c="var(--rd)"/>
              {conflicts.length} conflict{conflicts.length>1?"s":""}
            </div>
          )}
          <button className="btn" onClick={()=>setShowShare(true)}><Ic n="share" sz={11}/>Share</button>
          <button className="btn" onClick={()=>window.print()}><Ic n="print" sz={11}/>Print</button>
        </div>

        <div className="main">
          {!isRO&&<Sidebar meet={meet} setMeet={setMeet} onGenerate={handleGenerate}/>}

          {view==="kanban"&&(
            <KanbanBoard
              timedDays={timedDays} rawDays={meet.days} conflicts={conflicts}
              globalSpd={meet.secondsPerDive} globalBuffer={meet.bufferMinutes}
              onUpdateDay={handleUpdateDay} onDeleteDay={handleDeleteDay} onAddDay={handleAddDay}
              onAddSession={handleAddSession} onUpdateSess={handleUpdateSess} onDeleteSess={handleDeleteSess}
              onUpdateBoard={handleUpdateBoard} onDeleteBoard={handleDeleteBoard}
              onUpdateEv={handleUpdateEv} onDeleteEv={handleDeleteEv} onAddEv={handleAddEv}
              onDrop={handleDrop} isRO={isRO} gbKey={meet.governingBody}/>
          )}
          {view==="print"&&<PrintView timedDays={timedDays} meet={meet}/>}
          {view==="dashboard"&&<DashboardView timedDays={timedDays} meet={meet} conflicts={conflicts}/>}
        </div>

        {showShare&&<ShareModal meet={meet} onClose={()=>setShowShare(false)}/>}
      </div>
    </>
  );
}
