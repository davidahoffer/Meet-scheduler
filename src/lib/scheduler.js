import * as governingBodies from "../data/governingBodies";
import { uid, toMin, toHHMM, fmt12, hm } from "./time";

const GB = governingBodies.GB;

export function evCompMin(ev, spd, boardSplit=false){
  const effectiveDivers = boardSplit ? Math.ceil(ev.divers / 2) : ev.divers;
  return (effectiveDivers * ev.dives * spd) / 60;
}

export function boardDurMin(board, spd){
  if(!board.events || !board.events.length) return 0;
  const isSplit = board.split;
  return board.events.reduce((sum, ev) => sum + evCompMin(ev, spd, isSplit), 0);
}

export function sessCalc(sess, globalSpd, globalBuf){
  const spd = sess.secondsPerDive ?? globalSpd;
  const buf = sess.bufferMinutes ?? globalBuf;
  const warmupMin = sess.warmupMinutes ?? 0;
  if(!sess.boards || !sess.boards.length) return {compMin:0, warmupMin, bufMin:buf, total:warmupMin+buf};
  const boardDurs = sess.boards.map(b => boardDurMin(b, spd));
  const compMin = Math.ceil(Math.max(...boardDurs, 0));
  return {compMin, warmupMin, bufMin:buf, total:Math.ceil(compMin+warmupMin+buf)};
}

export function recalcMeet(days, globalSpd, globalBuf){
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
      const sessionEndMin = warmupEndMin + compMin + bufMin;

      const boards = (sess.boards || []).map((board, boardIdx) => {
        const boardCompMin = Math.ceil(boardDurations[boardIdx] ?? 0);
        const boardStartMin = warmupEndMin;
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

export function detectConflicts(days){
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

export function generateFromGB(gbKey, wu, buf, spd){
  const gb = GB[gbKey];
  const s = spd ?? gb.defaultSpd;
  const w = wu ?? gb.defaultWarmup;
  const b = buf ?? gb.defaultBuffer;

  const boardOrder = ["1m", "3m", "Plat"];

  const boards = boardOrder
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
      secondsPerDive: s,
      bufferMinutes: b,
      warmupMinutes: w,
      splitBoards: false,
      boardCount: boards.length,
      boards,
    }],
  }];
}