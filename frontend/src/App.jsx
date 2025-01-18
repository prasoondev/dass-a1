import './App.css'
import React from 'react'
import Cookies from "universal-cookie";
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
import Sell from './pages/sell'
import Buy from './pages/buy'
import Transaction from './pages/transaction'
import Layout from './Layout'
import ProtectedRoute from './components/protectedroute';

function App() {
  const cookies = new Cookies();
  return (
    <Router>
      <Routes>
        {/*Public routes*/}
          <Route path="/" element={cookies.get("token") ? <Navigate to="/profile" /> : <Login />} />
          <Route path="/register" element={cookies.get("token") ? <Navigate to="/profile" /> : <Register />} />
        {/*Private routes*/}
        <Route element={<Layout />}>
          <Route path="/search" element={
            <ProtectedRoute token={cookies.get("token")}>
              <Search />
            </ProtectedRoute>
            } />
          <Route path="/profile" element={
            <ProtectedRoute token={cookies.get("token")}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/support" element={
            <ProtectedRoute token={cookies.get("token")}>
              <Support />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute token={cookies.get("token")}>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/sell" element={
            <ProtectedRoute token={cookies.get("token")}>
              <Sell />
            </ProtectedRoute>
          } />
          <Route path="/buy" element={
            <ProtectedRoute token={cookies.get("token")}>
              <Buy />
            </ProtectedRoute>
          } />
          <Route path="/deliver" element={
            <ProtectedRoute token={cookies.get("token")}>
              <Deliver />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute token={cookies.get("token")}>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/items/:itemId" element={
            <ProtectedRoute token={cookies.get("token")}>
              <Items />
            </ProtectedRoute>
          } />
        </Route>
        <Route path="/transaction/:transactionId" element={
            <ProtectedRoute token={cookies.get("token")}>
              <Transaction />
            </ProtectedRoute>
          } />
      </Routes>
    </Router>
  )
}

export default App
