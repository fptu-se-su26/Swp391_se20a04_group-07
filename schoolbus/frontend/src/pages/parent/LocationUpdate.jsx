import React, { useState, useEffect, useRef, useCallback } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { parentApi } from '../../api';
import toast from 'react-hot-toast';
import { LoadingScreen } from '../../components/common';
import axios from 'axios';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const DEFAULT_CENTER = { longitude: 108.2022, latitude: 16.0544 }; // Da Nang center
const DN_BOUNDS = { latMin: 15.90, latMax: 16.20, lngMin: 108.00, lngMax: 108.35 };

function isInDaNang(lat, lng) {
  if (lat == null || lng == null) return false;
  return lat >= DN_BOUNDS.latMin && lat <= DN_BOUNDS.latMax
      && lng >= DN_BOUNDS.lngMin && lng <= DN_BOUNDS.lngMax;
}


export default function LocationUpdate() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [child, setChild] = useState(null);

  // Map state
  const [viewState, setViewState] = useState({
    longitude: DEFAULT_CENTER.longitude,
    latitude: DEFAULT_CENTER.latitude,
    zoom: 12,
  });
  
  
  // Marker state
  const [markerPos, setMarkerPos] = useState(null);
  
  // Address state
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  
  // Status flag to know if the current location is confirmed by parent
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const mapRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchChildData();
  }, []);

  const fetchChildData = async () => {
    try {
      setLoading(true);
      // Parent has 1:1 relation with student, get the first one
      const res = await parentApi.getChildren();
      const children = res.data.data || [];
      if (children.length > 0) {
        const childData = children[0];
        
        // Fetch specific location details for the child
        const locRes = await parentApi.getChildLocation(childData.id);
        const locData = locRes.data.data;
        
        setChild(locData);
        setAddress(locData.home_address || '');
        setHasConfirmed(locData.hasConfirmed);
        
        if (locData.home_lat && locData.home_lng) {
          setMarkerPos({ lat: locData.home_lat, lng: locData.home_lng });
          setViewState({
            longitude: locData.home_lng,
            latitude: locData.home_lat,
            zoom: 15,
          });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải thông tin học sinh');
    } finally {
      setLoading(false);
    }
  };

  // ── Autocomplete Search ──────────────────────────────────────────────────
  
  const handleAddressChange = (e) => {
    const val = e.target.value;
    setAddress(val);
    
    if (searchTimeout) clearTimeout(searchTimeout);
    
    if (!val.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    setSearchTimeout(setTimeout(() => searchMapbox(val), 400));
  };
  
  const searchMapbox = async (query) => {
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`;
      const { data } = await axios.get(url, {
        params: {
          access_token: MAPBOX_TOKEN,
          country: 'vn',
          language: 'vi',
          types: 'address,poi,place',
          proximity: '108.2208,16.0544',
          fuzzyMatch: true,
          limit: 5,
        }
      });
      
      const validResults = (data.features || []).filter(f => {
        const [lng, lat] = f.center;
        return isInDaNang(lat, lng);
      });
      
      setSuggestions(validResults);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Search error:', err);
    }
  };
  
  const selectSuggestion = (feature) => {
    const [lng, lat] = feature.center;
    setAddress(feature.place_name);
    setMarkerPos({ lat, lng });
    setHasConfirmed(false); // They need to save to confirm
    setViewState({
      longitude: lng,
      latitude: lat,
      zoom: 16,
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Marker Dragging ──────────────────────────────────────────────────────
  
  const onMarkerDragEnd = useCallback((e) => {
    setMarkerPos({
      lng: e.lngLat.lng,
      lat: e.lngLat.lat
    });
    setHasConfirmed(false); // Moved, so needs saving
  }, []);

  // ── Save Location ────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!child) return;
    if (!address.trim()) {
      return toast.error('Vui lòng nhập địa chỉ');
    }
    
    // Warn if they didn't place a marker but we are saving
    if (!markerPos) {
      return toast.error('Vui lòng chọn địa chỉ từ gợi ý để xác định toạ độ trên bản đồ');
    }

    // Validate bounds one last time
    if (!isInDaNang(markerPos.lat, markerPos.lng)) {
      return toast.error('Vị trí này nằm ngoài khu vực hỗ trợ (Đà Nẵng)');
    }

    try {
      setSaving(true);
      const res = await parentApi.updateChildLocation(child.id, {
        home_address: address,
        home_lat: markerPos.lat,
        home_lng: markerPos.lng,
      });
      
      toast.success('Đã lưu vị trí nhà thành công!');
      
      const updated = res.data.data;
      setChild(updated);
      setHasConfirmed(updated.hasConfirmed);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi lưu vị trí');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
      
      {/* Header Panel */}
      <div className="p-4 md:p-5 border-b border-gray-100 bg-white z-10 shadow-sm relative">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
          <span className="text-xl">📍</span> Cập nhật vị trí nhà
        </h2>
        
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 flex items-start gap-3">
          <span className="text-xl mt-0.5">ℹ️</span>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-0.5">Hướng dẫn:</p>
            <ol className="list-decimal ml-4 space-y-1 text-xs text-blue-700/90">
              <li>Tìm địa chỉ nhà ở ô tìm kiếm bên dưới.</li>
              <li>Chạm và <strong>kéo (drag) ghim đỏ</strong> đến đúng cổng nhà trên bản đồ.</li>
              <li>Nhấn nút "Lưu vị trí" để hoàn tất. Tài xế sẽ thấy chính xác điểm này.</li>
            </ol>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1 w-full" ref={inputRef}>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Địa chỉ của {child?.full_name}
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                placeholder="Nhập số nhà, tên đường..."
                value={address}
                onChange={handleAddressChange}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              />
              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {suggestions.map(s => (
                    <button
                      key={s.id}
                      onClick={() => selectSuggestion(s)}
                      className="w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-b-0"
                    >
                      <p className="text-sm font-semibold text-gray-800 truncate">{s.text}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{s.place_name}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving || !markerPos}
            className="w-full md:w-auto px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              '💾'
            )}
            Lưu vị trí
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-gray-100 min-h-[500px]">
        
        {/* Status Badge Overlays */}
        <div className="absolute top-4 left-4 z-10">
          {hasConfirmed ? (
            <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-bold text-xs shadow-md border border-green-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Đã xác nhận
            </div>
          ) : markerPos ? (
            <div className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-bold text-xs shadow-md border border-amber-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Chưa lưu
            </div>
          ) : null}
        </div>

        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="bottom-right" />
          
          {markerPos && (
            <Marker
              longitude={markerPos.lng}
              latitude={markerPos.lat}
              draggable
              onDragEnd={onMarkerDragEnd}
              anchor="bottom"
            >
              <div className="relative group cursor-grab active:cursor-grabbing">
                <div className="w-8 h-8 flex items-center justify-center text-3xl transform -translate-y-2 group-hover:-translate-y-4 transition-transform duration-200 drop-shadow-md">
                  📍
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/20 rounded-[100%] blur-[2px]" />
              </div>
            </Marker>
          )}
        </Map>
      </div>
    </div>
  );
}
