// backend/src/utils/geocode.util.js
// ============================================================
// Chuyển địa chỉ dạng text -> tọa độ (lat, lng) bằng Mapbox Geocoding API.
// v2: thêm relevance filter, in-memory cache, types=address, language=vi
// ============================================================
const axios = require('axios');

// Phạm vi tọa độ hợp lệ cho Đà Nẵng
const DN_BOUNDS = { latMin: 15.90, latMax: 16.20, lngMin: 108.00, lngMax: 108.35 };

// Ngưỡng relevance tối thiểu — kết quả dưới mức này cần xác nhận tay
const RELEVANCE_THRESHOLD   = 0.75; // cần xác nhận
const RELEVANCE_MIN_ACCEPT  = 0.55; // thấp hơn này → reject hoàn toàn

// In-memory cache: key = address.toLowerCase().trim(), value = { result, cachedAt }
const _cache = new Map();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 giờ

function isInDaNang(lat, lng) {
  if (lat == null || lng == null) return false;
  return lat >= DN_BOUNDS.latMin && lat <= DN_BOUNDS.latMax
      && lng >= DN_BOUNDS.lngMin && lng <= DN_BOUNDS.lngMax;
}

/**
 * Geocode một địa chỉ văn bản thành toạ độ.
 *
 * @param {string} address   Địa chỉ tiếng Việt cần geocode
 * @returns {Promise<{lat, lng, matchedAddress, relevance, needsConfirmation}|null>}
 *   - null nếu không tìm thấy hoặc ngoài Đà Nẵng
 *   - needsConfirmation = true nếu relevance < RELEVANCE_THRESHOLD
 */
async function fetchMapbox(query, fuzzy) {
  const token = process.env.MAPBOX_TOKEN;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`;
  const { data } = await axios.get(url, {
    params: {
      access_token: token,
      country:    'vn',
      language:   'vi',
      types:      'address,place,poi,neighborhood,locality',
      proximity:  '108.2208,16.0544',
      fuzzyMatch: fuzzy,
      limit:      5,
    },
    timeout: 8000,
  });

  return (data.features || [])
    .filter(f => {
      const [lng, lat] = f.center;
      return isInDaNang(lat, lng);
    })
    // For fuzzy, require high relevance (0.75+) to avoid wild hallucinations
    .filter(f => (f.relevance || 0) >= (fuzzy ? 0.75 : RELEVANCE_MIN_ACCEPT))
    .sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
}

function stripHouseNumber(address) {
  // Loại bỏ phần số nhà ở đầu chuỗi (VD: "218 ", "59-61 ", "12/4A ")
  return address.replace(/^[\d\-\/]+[a-zA-Z]*\s+/, '').trim();
}

/**
 * Geocode một địa chỉ văn bản thành toạ độ.
 */
async function geocodeAddress(address) {
  if (!address || !process.env.MAPBOX_TOKEN) return null;

  const cacheKey = address.toLowerCase().trim();
  const cached = _cache.get(cacheKey);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return cached.result;
  }

  try {
    // 1. Thử strict match với địa chỉ đầy đủ
    let candidates = await fetchMapbox(address, false);

    // 2. Nếu thất bại, thử bỏ số nhà (chỉ tìm đường) với strict match
    if (!candidates.length) {
      const withoutHouseNum = stripHouseNumber(address);
      if (withoutHouseNum !== address) {
        candidates = await fetchMapbox(withoutHouseNum, false);
      }
    }

    // 3. Nếu vẫn thất bại, thử fuzzy match (với điều kiện relevance cao)
    if (!candidates.length) {
      candidates = await fetchMapbox(address, true);
    }

    if (!candidates.length) {
      _cache.set(cacheKey, { result: null, cachedAt: Date.now() });
      return null;
    }

    const best = candidates[0];
    const [lng, lat] = best.center;
    const relevance = best.relevance || 0;

    const result = {
      lat,
      lng,
      matchedAddress:      best.place_name,
      relevance,
      needsConfirmation:   relevance < RELEVANCE_THRESHOLD,
    };

    _cache.set(cacheKey, { result, cachedAt: Date.now() });
    return result;

  } catch (err) {
    console.error('geocodeAddress lỗi:', err.message);
    return null;
  }
}

/**
 * Xoá cache của một địa chỉ (khi address thay đổi)
 * @param {string} address
 */
function clearGeocodeCache(address) {
  if (!address) return;
  _cache.delete(address.toLowerCase().trim());
}

module.exports = { geocodeAddress, isInDaNang, clearGeocodeCache };