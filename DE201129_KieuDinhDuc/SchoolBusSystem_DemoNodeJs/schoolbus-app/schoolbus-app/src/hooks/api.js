const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function getToken()   { return localStorage.getItem('sb_token'); }
export function setToken(t)  { localStorage.setItem('sb_token', t); }
export function clearToken() { localStorage.removeItem('sb_token'); }
export function getRole()    { return localStorage.getItem('sb_role'); }
export function setRole(r)   { localStorage.setItem('sb_role', r); }

export async function api(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (res.status === 401) { clearToken(); window.location.reload(); return; }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Lỗi server');
  return data;
}

export function loginWithGoogle() {
  window.location.href = `${BASE}/api/auth/google`;
}

// Nearest Neighbor route optimization
export function optimizeRoute(start, points) {
  if (!points.length) return [];
  const rem = [...points]; const ordered = []; let cur = start;
  while (rem.length) {
    let ni = 0, nd = Infinity;
    rem.forEach((p, i) => { const d = haversine(cur.lat, cur.lng, p.lat, p.lng); if (d < nd) { nd = d; ni = i; } });
    ordered.push({ ...rem[ni], dist_km: nd });
    cur = rem[ni]; rem.splice(ni, 1);
  }
  return ordered;
}

export function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371, dL = (lat2-lat1)*Math.PI/180, dN = (lng2-lng1)*Math.PI/180;
  const a = Math.sin(dL/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dN/2)**2;
  return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
