const token = JSON.parse(localStorage.getItem("authData"));
const vendorcode=token?.data?.vendorLogin?.vendorcode;
const userToken=token?.data?.vendorLogin?.token;

import axios from "axios";

// Create an Axios instance with a base URL
const currentUrl = window.location.href;
const isAdmin = currentUrl.includes("admin");

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "token": isAdmin ? 'anonyms' : userToken,
        "companyid": isAdmin ? 'anonyms' : vendorcode,
    },
    // maxRedirects: 0, // optional
});

//------------------------------------------
//User Login
//------------------------------------------

// Register Applicant Mobile
export const UserLogin = async (req) => {
    try {
        const response = await api.post("User/LoginUser", req);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const VendorLogin = async (req) => {
    try {
        api.defaults.headers = {
            "Content-Type": "application/json",
            "token": 'anonyms',
            "companyid": 'anonyms',
        };
        const response = await api.post("User/VendorLogin", req);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

//Forget Password
export const ForgetPasswordOTP = async (req) => {
    try {
        const response = await api.post("/User/SendForgotPasswordOtp", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Forget password error:", error.response?.data || error.message);
        throw error;
    }
};

//Resend OTP
export const resendOTP = async (req) => {
    try {
        const response = await api.post("/User/ResendMobileOTP", req);
        return response.data;
    } catch (error) {
        console.error("Resend OTP:", error.response?.data || error.message);
        throw error;
    }
}

//Verify Email OTP
export const verifyEmailOTP = async (req) => {
    try {
        const response = await api.post("/User/VerifyForgotPasswordOtp", req);
        return response.data;
    } catch (error) {
        console.error("Verify Email OTP:", error.response?.data || error.message);
        throw error;
    }
};

// Applicant Account Password Creation
export const CreatePassword = async (req) => {
    try {
        const response = await api.post("/User/ResetPassword", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Password creation error:", error.response?.data || error.message);
        throw error;
    }
};

export const GetVendorAmount = async (req) => {
    
    try {
        const response = await api.post("Admin/GetVendorAmount");
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const GetVendorRechargeHistory = async (req) => {
    
    try {
        const response = await api.post("User/VendorWalletRechargeHistory");
        return response.data;
    } catch (error) {
        console.error("Transaction history error:", error.response?.data || error.message);
        throw error;
    }
};

export const GetServicesUses = async (req) => {
    
    try {
        const response = await api.post("Admin/VendorDashboard",req);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const GetExprianReport = async (req) => {
    try {
        const response = await api.post("Experian/GetIndivisualCreditReportPdf", req);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};


export const GetCrifReport = async (req) => {
    try {
        const response = await api.post("Crif/Credit-Report/Individual-pdf", req);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};


export const GetTransUnionReport = async (req) => {
    try {
        const response = await api.post("TransUnion/GetIndivisualCreditReport", req);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};


export const GetTUReport = async (req) => {
    try {
        const response = await api.post("/Cibil/GetCibilReport", req);
        
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const GetUserPrefillReport = async (req) => {
    try {
        // console.log(req);
        const response = await api.post("Prefill/GetKYCInfo", req);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};
export const GetUserPanReport = async (req) => {
    try {
        const response = await api.post(req.url, req);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.error_message);
        throw error;
    }
};

export const GetUserAadhaarReport = async (req) => {
    try {
        const response = await api.post(req.url, req);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};
export const GetUserBankReport = async (req) => {
    try {
        // const data=serviceAmountDeduct();
        
        const response = await api.post(req.url, req);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const GetUserEnachReport = async (req) => {
    try {
        // const data=serviceAmountDeduct();
        
        const response = await api.post(req.url, req);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const GetMandateDetailsById = async (req) => {
    try {
        // const data=serviceAmountDeduct();
        
        const response = await api.post("/verifiedu/GetMandateDetailsById", req);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const GetPaymentDetailsById = async (req) => {
    try {        
        const response = await api.post("/api/EasebuzzIntegration/GetPaymentDetaisByID", req);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};


export const PullPaymentUsingEMandate = async (req) => {
    try {
        const response = await api.post(req.url, req);
        return response.data;
    } catch (error) {
        console.error("PullPaymentUsingEMandate error:", error.response?.data || error.message);
        throw error;
    }
};

export const CancelEMandate = async (req) => {
    try {
        const response = await api.post(req.url, req);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const GetUserGstReport = async (req) => {
    try {
        // const data=serviceAmountDeduct();
        const response = await api.post(req.url,req);
        
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};
// Vender Registration 
export const vendorRegistration = async (req) => {
    
    try {
        console.log(req);
        const response = await api.post("User/VendorRegister", req);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const vendorUpdateRegistration = async (req) => {
    
    try {
        const response = await api.post(req.url, req);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};


// Vender Assign
export const vendorAssingService = async (req) => {
    
    try {
        const response = await api.post("User/AssignService", req);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const vendorGetList = async () => {
    
    try {
        const response = await api.get("User/GetVendorCode");
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const vendorPayment = async (req) => {
    
    try {
        const response = await api.post("verifiedu/InitiatePayment", req);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const CreatePaymentLinkURL = async (req) => {
    
    try {
        const response = await api.post("/verifiedu/CreatePaymentLink", req);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const CreatePaymentQRLink = async (req) => {
    
    try {
        const response = await api.post("/verifiedu/CreatePaymentQR", req);
        return response.data;
    } catch (error) {
        console.error("Payment QR error:", error.response?.data || error.message);
        throw error;
    }
};

export const InitiateQuickTransfer = async (req) => {
    
    try {
        const response = await api.post("/verifiedu/InitiateQuickTransfer", req);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const vendorServiceType = async (req) => {
    console.log(req)
    try {
        const response = await api.post(req.url, req);
        return response.data;
    } catch (error) {
        console.error("Vendor service type error:", error.response?.data || error.message);
        throw error;
    }
};

export const vendorGetServiceTypeList = async (req) => {
    
    try {
        const response = await api.get(req.url);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};
export const vendorGetServiceNameTypeList = async (req) => {
    
    try {
        const response = await api.post(req.url);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};
export const vendorFetchServiceAssignList = async (req) => {
    
    try {
        const response = await api.post(req.url,req);
        
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};


export const getBankCodeList = async (req) => {
    
    try {
        const response = await api.get(req.url);
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};
function serviceAmountDeduct(){
    const response={
        status:"success"
    }
    return response;
}