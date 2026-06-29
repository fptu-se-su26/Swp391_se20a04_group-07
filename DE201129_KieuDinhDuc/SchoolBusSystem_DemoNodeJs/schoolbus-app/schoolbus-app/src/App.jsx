import React, { useState, useEffect } from 'react';
import { getToken, getRole, setRole, clearToken } from './hooks/api';
import { Spinner } from './components/UI';

import Login     from './pages/Login';
import AdminApp  from './pages/admin/AdminApp';
import ParentApp from './pages/parent/ParentApp';
import DriverApp from './pages/driver/DriverApp';

export default function App() {
  const [role,    setRoleState] = useState(null);
  const [user,    setUser]      = useState(null);
  const [loading, setLoading]   = useState(true);

  // Kiểm tra OAuth callback (parent Google login)
  useEffect(() => {
    const path   = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const token  = params.get('token');

    if (path === '/auth/callback' && token) {
      const { setToken } = require('./hooks/api');
      setToken(token);
      setRole('parent');
      setRoleState('parent');
      setUser({ name:'Phụ huynh', email:'' });
      window.history.replaceState({}, '', '/');
      setLoading(false);
      return;
    }

    // Restore session
    const savedRole  = getRole();
    const savedToken = getToken();
    if (savedRole && savedToken) {
      setRoleState(savedRole);
      // Mock restore user theo role
      if (savedRole === 'admin')  setUser({ name:'Admin', role:'admin' });
      if (savedRole === 'driver') {
        const { MOCK_DRIVER_USER } = require('./data/mockData');
        setUser(MOCK_DRIVER_USER);
      }
      if (savedRole === 'parent') {
        const { MOCK_PARENT_USER } = require('./data/mockData');
        setUser(MOCK_PARENT_USER);
      }
    }
    setLoading(false);
  }, []);

  function handleLogin(roleParam, userData) {
    setRole(roleParam);
    setRoleState(roleParam);
    setUser(userData);
  }

  function handleLogout() {
    clearToken();
    localStorage.removeItem('sb_role');
    setRoleState(null);
    setUser(null);
  }

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🚌</div>
          <Spinner size={36}/>
          <div style={{ marginTop:12, fontSize:14, color:'#6B7280' }}>Đang tải...</div>
        </div>
      </div>
    );
  }

  if (!role || !user) {
    const params = new URLSearchParams(window.location.search);
    return <Login onLogin={handleLogin} error={params.get('error')}/>;
  }

  if (role === 'admin')  return <AdminApp  onLogout={handleLogout}/>;
  if (role === 'parent') return <ParentApp user={user} onLogout={handleLogout}/>;
  if (role === 'driver') return <DriverApp driver={user} onLogout={handleLogout}/>;

  return <Login onLogin={handleLogin}/>;
}
