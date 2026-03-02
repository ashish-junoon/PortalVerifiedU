import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { useFormik } from 'formik';
import { isMobile, isTablet, isDesktop, osName, browserName, engineName, getUA } from "react-device-detect";
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";

import Background from "../utils/Background";
import { CreatePassword, ForgetPasswordOTP, resendOTP, UserLogin, VendorLogin, verifyEmailOTP } from "../services/Services_API";
import { AuthContext } from '../Context/AuthContext';
import { toast } from 'react-toastify';
import Loader from '../utils/Loader';

function ForgotPassword() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const [register, setRegister] = useState(true);
    const [sendOtp, setSendOtp] = useState(false);
    const [password, setPassword] = useState(false);
    const [userId, setUserId] = useState();
    const [timer, setTimer] = useState(60);
    const [device, setDevice] = useState()
    const [canResend, setCanResend] = useState(false);
    const [userOTP, setUserOTP] = useState();

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    // Timer logic for OTP
    useEffect(() => {
        let interval;
        if (sendOtp && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [sendOtp, timer]);

    // Generate Reset Password OTP
    const mobileFormik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format')
                .required('Email is required'),
        }),
        onSubmit: async (values, {setSubmitting}) => {
            const userRequest = {
                email: values.email,
                // company_id: import.meta.env.VITE_COMPANY_ID,
                product_Code: "JC"
            };

            try {
                const data = await ForgetPasswordOTP(userRequest);
                if (data.status) {
                    setUserId(data.user_id)
                    setRegister(false);
                    setSendOtp(true)
                    setUserOTP(data.mobile_otp);
                    toast.success(data.message);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error('Reset password failed:', error);
            } finally {
                setSubmitting(false)
            }
        },
    });

    // Validation for OTP Verification
    const otpFormik = useFormik({
        initialValues: {
            otp: '',
        },
        validationSchema: Yup.object({
            otp: Yup.string()
                .matches(/^\d{6}$/, 'Invalid OTP.')
                .required('Required'),
        }),
        onSubmit: async (values) => {
            const userRequest = {
                email: mobileFormik.values.email,
                otp: values.otp,
            };

            try {
                const res = await verifyEmailOTP(userRequest);
                if (res.status) {
                    setSendOtp(false);
                    setPassword(true);
                    toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
            } catch (error) {
                console.error('OTP verification failed:', error);
                toast.error('An error occurred during OTP verification.');
            }
        },
    });

    // Validation for Create Password
    const passwordFormik = useFormik({
        initialValues: {
            password: '',
            cnfrmPassword: '',
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .matches(
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,20}$/,
                    'Password must be 8+ characters and include at least one letter, one number, and one special character.'
                )
                .required('Required'),
            cnfrmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords do not match.')
                .required('Required'),
        }),
        onSubmit: async values => {
            const userRequest = {
                email: mobileFormik.values.email,
                password: values.password,
                confirmPassword: values.cnfrmPassword,
            };

            try {
                const data = await CreatePassword(userRequest);
                if (data.status) {
                    toast.success(data.message);
                    navigate('/login');
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error('Something went wrong. Please try again.');
                console.error('CreatePassword API failed:', error);
            }
        },
    });

    useEffect(() => {
        const deviceInfo = {
            deviceType: isMobile ? "Mobile" : isTablet ? "Tablet" : isDesktop ? "Desktop" : "Unknown",
            os: osName,
            browser: browserName,
            // engine: engineName,
            // userAgent: navigator.userAgent,
        };

        setDevice(deviceInfo.deviceType + " " + deviceInfo.browser + " " + deviceInfo.os)
    }, []);

    const handleResendOtp = async () => {
        setSendOtp(true);
        setCanResend(false);
        setTimer(60);

        const userRequest = {
            mobile_no: mobileFormik.values.mobileNumber,
            device_info: device,
            company_id: import.meta.env.VITE_COMPANY_ID,
            product_name: import.meta.env.VITE_PRODUCT_NAME
        };

        try {
            // const res = await resendOTP(userRequest);
            const res = {
                status: true,
                user_id: "abc",
                otp: "124",
            }
            if (res.status) {
                toast.success(res.message);
                localStorage.setItem('user_id', res.user_id);
                setUserOTP(res.otp);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error('Failed to resend OTP:', error);
            toast.error('Failed to resend OTP. Please try again.');
        }
    };

    if (isPending) {
        return <Loader />
    }

    return (
        <div>
            <Helmet>
                <title>Forgot Password | VerifiedU</title>
            </Helmet>
            <Background />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white rounded-lg shadow-md py-8 px-8 md:px-10 md:w-sm w-xs ">
                    {/* Logo and Text */}
                    <div className="flex items-center space-x-2 justify-center mt-5">
                        <img src="/logo.svg" alt="VerifiedU Logo" className="h-8 w-auto" />
                        <div className="text-black text-2xl italic font-semibold tracking-tight ">Verified<span className="text-green-600 font-bold">U</span></div>
                    </div>

                    {/* Mobile Number Form */}
                    {register && (
                        <form className="mt-10" onSubmit={mobileFormik.handleSubmit}>
                            <div className="mb-6">
                                {/* <label className="block text-gray-400 italic" htmlFor="username">
                                Username
                            </label> */}
                                <input
                                    className={`shadow border border-green-300 rounded w-full py-2 px-3 text-gray-700 outline-green-200 leading-tight focus:outline-green-300 focus:shadow-outline ${sendOtp ? 'bg-dark' : 'bg-white'}`}
                                    name="email"
                                    id="email"
                                    type="email"
                                    onChange={mobileFormik.handleChange}
                                    onBlur={mobileFormik.handleBlur}
                                    value={mobileFormik.values.email}
                                    disabled={sendOtp}
                                    placeholder="Email"
                                />
                                <span className="text-red-500 text-xs italic">{mobileFormik.touched.email && mobileFormik.errors.email}</span>
                            </div>

                            <div className="flex items-center justify-center my-8 mt-2">
                                <button
                                    className={`w-full ${mobileFormik.isSubmitting ? "bg-green-700":"bg-green-600"} hover:bg-green-700 shadow-md text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline cursor-pointer`}
                                    type="submit"
                                    disabled={mobileFormik.isSubmitting}
                                >
                                    Get OTP{mobileFormik.isSubmitting && "..."}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* OTP Form */}
                    {sendOtp && (
                        <form className="mt-10" onSubmit={otpFormik.handleSubmit}>
                            <div className="mb-6">
                                <input
                                    className={`shadow border border-green-300 rounded w-full py-2 px-3 text-gray-700 outline-green-200 leading-tight focus:outline-green-300 focus:shadow-outline ${sendOtp ? 'bg-gray-100' : 'bg-white'}`}
                                    name="email"
                                    id="email"
                                    type="email"
                                    value={mobileFormik.values.email}
                                    disabled
                                    placeholder="Email"
                                />
                                <span className="text-red-500 text-xs italic">{mobileFormik.touched.email && mobileFormik.errors.email}</span>
                            </div>
                            <div className="mb-1">
                                <input
                                    className="shadow appearance-none border border-green-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline   "
                                    id="otp"
                                    type="text"
                                    maxLength={6}
                                    value={otpFormik.values.otp}
                                    onChange={otpFormik.handleChange}
                                    onBlur={otpFormik.handleBlur}
                                    placeholder="otp"
                                />
                                <span className="text-red-500 text-xs italic">{otpFormik.touched.otp && otpFormik.errors.otp}</span>
                            </div>

                            <div className="flex justify-end my-2 mb-4">
                                {canResend ? (
                                    <button
                                        className="text-primary text-xs font-semibold underline hover:cursor-pointer"
                                        type="button"
                                        onClick={handleResendOtp}
                                    >
                                        Resend OTP
                                    </button>
                                ) : (
                                    <span className="text-[9px] sm:text-xs font-semibold text-dark">
                                        Resend OTP in {timer} sec
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-center my-8 mt-2">
                                <button
                                    className="w-full bg-green-600 hover:bg-green-700 shadow-md text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline cursor-pointer"
                                    type="submit"
                                >
                                    Verify OTP
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Password Form */}
                    {password && (
                        <form className="mt-10" onSubmit={passwordFormik.handleSubmit}>
                            <div className="mb-6">
                                <input
                                    className={`shadow border border-green-300 rounded w-full py-2 px-3 text-gray-700 outline-green-200 leading-tight focus:outline-green-300 focus:shadow-outline ${sendOtp ? 'bg-gray-100' : 'bg-white'}`}
                                    name="password"
                                    id="password"
                                    type="password"
                                    maxLength={30}
                                    value={passwordFormik.values.password}
                                    onChange={passwordFormik.handleChange}
                                    onBlur={passwordFormik.handleBlur}
                                    placeholder="Enter Password"
                                />
                                <span className="text-red-500 text-xs italic">{passwordFormik.touched.password && passwordFormik.errors.password}</span>
                            </div>
                            <div className="mb-6">
                                <input
                                    className={`shadow border border-green-300 rounded w-full py-2 px-3 text-gray-700 outline-green-200 leading-tight focus:outline-green-300 focus:shadow-outline ${sendOtp ? 'bg-gray-100' : 'bg-white'}`}
                                    name="cnfrmPassword"
                                    id="cnfrmPassword"
                                    type="password"
                                    maxLength={30}
                                    value={passwordFormik.values.cnfrmPassword}
                                    onChange={passwordFormik.handleChange}
                                    onBlur={passwordFormik.handleBlur}
                                    placeholder="Confirm Password"
                                />
                                <span className="text-red-500 text-xs italic">{passwordFormik.touched.cnfrmPassword && passwordFormik.errors.cnfrmPassword}</span>
                            </div>

                            <div className="flex items-center justify-center my-8 mt-2">
                                <button
                                    className="w-full bg-green-600 hover:bg-green-700 shadow-md text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline cursor-pointer"
                                    type="submit"
                                >
                                    Sumbit
                                </button>
                            </div>
                        </form>
                    )}

                </div>
            </div>
        </div>
    )
}
export default ForgotPassword;