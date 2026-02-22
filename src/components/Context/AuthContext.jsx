import React, { createContext, useState, useEffect, useCallback } from 'react';
import { GetServicesUses, GetVendorAmount } from '../services/Services_API';
// import { vendorList } from '../services/Services_API';

// Create context
export const AuthContext = createContext();

// Helper to get auth from localStorage
const getStoredAuth = () => {
    const stored = localStorage.getItem('authData');
    if (!stored) return null;

    const { data, expiry } = JSON.parse(stored);
    const now = new Date().getTime();

    // Check if token expired
    if (now > expiry) {
        localStorage.removeItem('authData');
        return null;
    }

    return data;
};

export const AuthProvider = ({ children }) => {

    const [authData, setAuthData] = useState(getStoredAuth());
    const [wallet, setWallet] = useState(); // starting balance
    const [serviceHistory, setServiceHistory] = useState(); 
    const token = JSON.parse(localStorage.getItem("authData"));
    const vendorDetails = token?.data?.vendorLogin;
    const servicesDetails = token?.data?.services;
    const vendorcode = token?.data?.vendorLogin?.vendorcode;
    const [profileImages, setProfileImages] = useState(); // starting balance
    const login = (data) => {
        const expiry = new Date().getTime() + 12 * 60 * 60 * 1000; // 12 hours
        const storedData = { data, expiry };
        if (data.role == 'admin') {
            localStorage.setItem('authAdminData', JSON.stringify(storedData));
            setAuthData(data);
        } else {
            localStorage.setItem('authData', JSON.stringify(storedData));
            setAuthData(data);
        }

    };

    const logout = (data) => {
        if (data == 'admin') {
            localStorage.removeItem('authAdminData');
            setAuthData(null);
        } else {
            localStorage.removeItem('authData');
            setAuthData(null);
        }

    };

    const getVendorList = useCallback(async () => {
        try {
            const response = await vendorList();
            if (response.status) {
                console.log("Vendor list fetched successfully:", response.data);
                return response.data;  //  Return only vendor array
            } else {
                console.error("Vendor list error:", response.message);
                return [];
            }
        } catch (error) {
            console.error("Vendor list fetch failed:", error);
            return [];
        }
    }, []);
    useEffect(() => {
        // Auto logout if expired (for extra safety)
        const checkExpiry = setInterval(() => {
            const stored = localStorage.getItem('authData');
            if (!stored) return;

            const { expiry } = JSON.parse(stored);
            const now = new Date().getTime();

            if (now > expiry) {
                logout();
            }
        }, 60 * 1000); // check every 1 minute

        return () => clearInterval(checkExpiry);
    }, []);


    useEffect(() => {

        const imageObj = {
            EWPL: "earlywages_logo.jpg",
            PUX: "pasia_udhar_logo.jpg",
            JCS: "junoon_logo.jpeg",
            TXT: "junoon_logo.jpeg",
        };

        const img = imageObj[vendorDetails?.vendorcode] || "profile_images.png";
        setProfileImages(img);
        // const fetchAmount = async () => {
        //     const responseAmount = await GetVendorAmount();

        //     if (responseAmount.status === true) {
        //         setWallet(responseAmount.getVendorAmount[0].wallet_modified_amount);
        //         // console.log(responseAmount.getVendorAmount.wallet_amount)
        //     } else {
        //         console.error(responseAmount.message);
        //     }
        // };

        updateWallet();
        ServicesUses();
    }, []);

    const deductAmount = (amount) => {
        setWallet((prev) => prev - amount);
    };

    const updateWallet = async () => {
        const responseAmount = await GetVendorAmount();

        if (responseAmount.status === true) {
            setWallet(responseAmount.getVendorAmount[0].wallet_modified_amount);
            // console.log(responseAmount.getVendorAmount.wallet_amount)
        } else {
            console.error(responseAmount.message);
        }

    };
    const ServicesUses = async () => {
        const payload ={
                    from_date: "string",
                    to_date: "string"
                    };
        const response = await GetServicesUses(payload);

        if (response.status === true) {
            setServiceHistory(response.dashboardVendors);
            console.log(response.dashboardVendors)
        } else {
            console.error(response.message);
        }

    };
    const hasPermission = (path) => {
        const serviceNames = servicesDetails?.map(service => service.servicename.toLowerCase().replaceAll(" ", "-")) || [];
            
        // If no services found → no permission
        if (serviceNames.length === 0) return false;

        // Check if this path matches any allowed service
        return serviceNames.some((service) =>

            path.startsWith(`/bureau/${service}`)
        );
    };
    return (
        <AuthContext.Provider value={{ authData, login, logout, wallet, deductAmount, updateWallet, hasPermission, vendorDetails, servicesDetails, getVendorList, vendorcode, profileImages,serviceHistory }}>
            {children}
        </AuthContext.Provider>
    );
};
