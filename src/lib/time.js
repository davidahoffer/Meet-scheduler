export function uid(p="x"){
  return `${p}_${Math.random().toString(36).slice(2,9)}`;
}

export function toMin(t){
  if(!t) return 0;
  const [h,m]=t.split(":").map(Number);
  return h*60+m;
}

export function toHHMM(n){
  const h=Math.floor(n/60)%24;
  const m=n%60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}

export function fmt12(hhmm){
  if(!hhmm) return "";
  let [h,m]=hhmm.split(":").map(Number);
  const ap=h>=12?"PM":"AM";
  h=h%12||12;
  return `${h}:${String(m).padStart(2,"0")} ${ap}`;
}

export function hm(m){
  const h=Math.floor(m/60);
  const mm=m%60;
  return h?`${h}h ${mm}m`:`${mm}m`;
}