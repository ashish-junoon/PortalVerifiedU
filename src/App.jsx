import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";

// User Components
import Home from "./components/pages/Home";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import Experian from "./components/credit/Experian";
import Equifax from "./components/credit/Equifax";
import TransUnion from "./components/credit/TransUnion";
import LoginPage from "./components/pages/LoginPage";
import CrifReport from "./components/credit/CrifReport";
import UserPrefill from "./components/kyc/UserPrefill";
import PanToMobile from "./components/kyc/PanToMobile";
import PanBasic from "./components/kyc/PanBasic";
import PanComprehensive from "./components/kyc/PanComprehensive";
import BankDetails from "./components/bank/BankDetails";
import ProfilePage from "./components/pages/ProfilePage";
import AadhaarKyc from "./components/kyc/AadhaarKyc";
import Unauthorized from "./components/pages/Unauthorized";
import ProtectedRoute from "./components/utils/ProtectedRoute";

// Admin Components
import AdminHome from "./components/admin/Home";
import UserList from "./components/admin/pages/UserList";
import ServiceType from "./components/admin/pages/ServiceType";
import ServiceMaster from "./components/admin/pages/ServiceMaster";
import AdminLoginPage from "./components/admin/pages/AdminLoginPage";
import Gst from "./components/bank/Gst";
import DrivingLicence from "./components/kyc/DrivingLicence";
import SuccessPage from "./components/pages/SuccessPage";
import FailurePage from "./components/pages/FailurePage";
import IfscVerify from "./components/bank/IfscVerify";
import UpiVerify from "./components/bank/UpiVerify";
import AadhaarMasked from "./components/kyc/AadharMasked";
import Enach from "./components/enach/Enach";
import CancleEnach from "./components/enach/cancleenach";
import PullPayement from "./components/enach/PullPayment";
import PaymentGateway from "./components/payment/PaymentGateway";
import CreatePaymentLink from "./components/payment/CreatePaymentLink";
import CreatePaymentQR from "./components/payment/CreatePaymentQR";
import QuickTransfer from "./components/payment/QuickTransfer";

// import UserLocation from "./components/kyc/UserLocation";


// Wrapper for routing based on URL
function AppContent() {
  const location = useLocation();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const path = location.pathname;
  const isAdminRoute = path.startsWith("/admin");

  // useEffect(() => {
  //   const token = JSON.parse(localStorage.getItem("authData"));
  //   const adminToken = JSON.parse(localStorage.getItem("authAdminData"));

  //   setIsAuthenticated(!!(token?.data?.vendorLogin?.token && token?.data?.status));
  //   setIsAdminAuthenticated(!!(adminToken?.token || adminToken?.data?.Token));
  // }, [path]);
const [isAuthenticated, setIsAuthenticated] = useState(() => {
  const token = JSON.parse(localStorage.getItem("authData"));
  return !!(token?.data?.vendorLogin?.token && token?.data?.status);
});

const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
  const adminToken = JSON.parse(localStorage.getItem("authAdminData"));
  return !!(adminToken?.token || adminToken?.data?.Token);
});
  //  Admin Routes
  if (isAdminRoute) {
    return (
      <Routes>
        {isAdminAuthenticated ? (
          <>
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/service-type" element={<ServiceType />} />
            <Route path="/admin/service-master" element={<ServiceMaster />} />
            <Route path="/admin/user-list" element={<UserList />} />
            <Route path="/admin/user-assign" element={<AdminHome />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </>
        ) : (
          <>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="*" element={<Navigate to="/admin/login" />} />
          </>
        )}
      </Routes>
    );
  }

  //  User Routes
  return (
    <Routes>
      {isAuthenticated ? (
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          {/* <Route path="/bureau/experian" element={<Experian />} /> */}
          <Route path="/bureau/experian" element={<ProtectedRoute><Experian /></ProtectedRoute>} /> 
          <Route path="/bureau/crif" element={<ProtectedRoute><CrifReport /></ProtectedRoute>} />
          <Route path="/bureau/equifax" element={<ProtectedRoute><Equifax /></ProtectedRoute>} />
          {/* <Route path="/bureau/transunion" element={ <TransUnion />}/> */}
          <Route path="/bureau/transunion" element={<ProtectedRoute> <TransUnion /></ProtectedRoute>} />
          <Route path="/bureau/user-prefill" element={<ProtectedRoute><UserPrefill /></ProtectedRoute>} />
          <Route path="/bureau/pan" element={<ProtectedRoute><PanToMobile /></ProtectedRoute>} />
          <Route path="/bureau/pan-basic" element={<ProtectedRoute><PanBasic /></ProtectedRoute>} />
          <Route path="/bureau/pancomp" element={<ProtectedRoute><PanComprehensive /></ProtectedRoute>} />
          <Route path="/bureau/bank-account" element={<ProtectedRoute><BankDetails /></ProtectedRoute>} />
          <Route path="/bureau/aadhar-verification" element={<ProtectedRoute><AadhaarKyc /></ProtectedRoute>} />
          <Route path="/bureau/driving-license" element={<ProtectedRoute><DrivingLicence /></ProtectedRoute>} />
          <Route path="/bureau/gst" element={<ProtectedRoute><Gst /></ProtectedRoute>} />
          <Route path="/bureau/ifsc" element={<ProtectedRoute><IfscVerify/></ProtectedRoute>} />
          <Route path="/bureau/upi" element={<ProtectedRoute><UpiVerify/></ProtectedRoute>} />
          <Route path="/bureau/aadhar-masked" element={<ProtectedRoute><AadhaarMasked/></ProtectedRoute>} />
          <Route path="/enach/register" element={<ProtectedRoute><Enach /></ProtectedRoute>} />
          <Route path="/enach/cancel-enach" element={<ProtectedRoute><CancleEnach /></ProtectedRoute>} />
          <Route path="/enach/pull-payment" element={<ProtectedRoute><PullPayement /></ProtectedRoute>} />
          {/* <Route path="/payment/payment-gateway" element={<PaymentGateway />} /> */}
          <Route path="/payment/payment-link" element={<ProtectedRoute><CreatePaymentLink /></ProtectedRoute>} />
          <Route path="/payment/payment-qr" element={<ProtectedRoute><CreatePaymentQR /></ProtectedRoute>} />
          <Route path="/payment/quick-transfer" element={<ProtectedRoute><QuickTransfer /></ProtectedRoute>} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* <Route path="/location" element={<UserLocation />} /> */}
          <Route path="/success" element={<SuccessPage fromAction={location.state?.fromAction}/>} />
          <Route path="/failure" element={<FailurePage fromAction={location.state?.fromAction}/>} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      ) : (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
  );
}

// Main App
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
