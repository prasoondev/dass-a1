import './App.css'
import React from 'react'
import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Search from './pages/search'
import Profile from './pages/profile'
import Support from './pages/support'
import Cart from './pages/cart'
import Deliver from './pages/deliver'
import Orders from './pages/orders'
import Items from './pages/items'
import Login from './pages/login'
import Register from './pages/register'
import Layout from './Layout'
import ProtectedRoute from './components/protectedroute';

function App() {
  const [cookies] = useCookies(['token']);
  return (
    <Router>
      <Routes>
        {/*Public routes*/}
          <Route path="/" element={cookies.token ? <Navigate to="/profile" /> : <Login />} />
          <Route path="/register" element={cookies.token ? <Navigate to="/profile" /> : <Register />} />
        {/*Private routes*/}
        <Route element={<Layout />}>
          <Route path="/search" element={
            <ProtectedRoute token={cookies.token}>
              <Search />
            </ProtectedRoute>
            } />
          <Route path="/profile" element={
            <ProtectedRoute token={cookies.token}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/support" element={
            <ProtectedRoute token={cookies.token}>
              <Support />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute token={cookies.token}>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/deliver" element={
            <ProtectedRoute token={cookies.token}>
              <Deliver />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute token={cookies.token}>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/items" element={
            <ProtectedRoute token={cookies.token}>
              <Items />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
