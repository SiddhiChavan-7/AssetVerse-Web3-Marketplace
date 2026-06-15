import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import UploadAsset from "./pages/UploadAsset";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyPurchases from "./pages/MyPurchases";
import AssetDetails from "./pages/AssetDetails";
import MyWishlist from "./pages/MyWishlist";

function App() {
  return (
    
    <BrowserRouter>
      <Navbar />


      <ToastContainer
  position="top-right"
  autoClose={2500}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  pauseOnHover
  theme="dark"
/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/upload" element={<UploadAsset />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/purchases" element={<MyPurchases />} />
        <Route path="/asset/:id" element={<AssetDetails />} />
        <Route path="/wishlist" element={<MyWishlist />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;