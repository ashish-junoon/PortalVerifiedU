import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { Helmet } from 'react-helmet';
import Background from '../../utils/Background';
// import { Helmet } from "react-helmet";

// import Background from "../utils/Background";
// import { UserLogin } from "../services/Services_API";
// import { AuthContext } from '../Context/AuthContext';
import { toast } from 'react-toastify';
import Loader from '../../utils/Loader';
import { UserLogin } from '../../services/Services_API';
// import Loader from '../utils/Loader';

function AdminLoginPage() {


    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const loginUser = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username required'),
            password: Yup.string().required('Password required'),
        }),
        onSubmit: async ({ username, password }) => {
            setIsPending(true);
            const payload = {
                VendorCode: username,
                password: password,
                
            };

            try {
                const response = await UserLogin(payload);

                if (response.status === true) {
                    response.allowedUrls= [ "/bureau/crif", "/bureau/equifax"]
                    response.role="admin";
                    login(response);
                    setIsAdminAuthenticated(true);
                    window.location.reload();
                    setIsPending(false);
                } else {
                    toast.error(response?.message || "Something went wrong!");
                    setIsPending(false);
                }
            } catch (error) {
                setIsPending(false);
                toast.error(error?.response?.data?.errors?.VendorCode?.[0] || "Something went wrong!")
                console.error('Login error:', error);
            }
        },
    });


    useEffect(() => {
        setIsPending(true);
        if (isAdminAuthenticated) {
            navigate('/admin');
            setIsPending(false);
        } else {
            navigate('/admin/login');
            setIsPending(false);
        }
    }, [isAdminAuthenticated]);


    if (isPending) {
        return <Loader />
    }

    return (
        <div>
            <Helmet>
                <title>VerifiedU loginUser</title>
            </Helmet>
            <Background />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white rounded-lg shadow-md py-8 px-8 md:px-10 md:w-sm w-xs ">
                    {/* Logo and Text */}
                    <div className="flex items-center space-x-2 justify-center mt-5">
                        <img src="/logo.svg" alt="VerifiedU Logo" className="h-8 w-auto" />
                        <div className="text-black text-2xl italic font-semibold tracking-tight ">Verified<span className="text-green-600 font-bold">U</span></div>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="text-center text-gray-600 italic ">Please loginAdmin to Continue.</div>
                    </div>

                    <form className="mt-10" onSubmit={loginUser.handleSubmit}>
                        <div className="mb-6">
                            {/* <label className="block text-gray-400 italic" htmlFor="username">
                                Username
                            </label> */}
                            <input
                                className="shadow border border-green-300 rounded w-full py-2 px-3 text-gray-700 outline-green-200 leading-tight focus:outline-green-300 focus:shadow-outline   "
                                id="username"
                                type="userName"
                                value={loginUser.values.username}
                                onChange={loginUser.handleChange}
                                onBlur={loginUser.handleBlur}
                                placeholder="Username"
                            />
                            <span className="text-red-500 text-xs italic">{loginUser.touched.username && loginUser.errors.username}</span>
                        </div>
                        <div className="mb-6">
                            {/* <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                                Password
                            </label> */}
                            <input
                                className="shadow appearance-none border border-green-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline   "
                                id="password"
                                type="password"
                                value={loginUser.values.password}
                                onChange={loginUser.handleChange}
                                onBlur={loginUser.handleBlur}
                                placeholder="Password"
                            />
                            <span className="text-red-500 text-xs italic">{loginUser.touched.password && loginUser.errors.password}</span>
                        </div>
                        <div className="flex items-center justify-center my-8">
                            <button
                                className="w-full bg-green-600 hover:bg-green-700 shadow-md text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline cursor-pointer"
                                type="submit"
                            >
                                Login
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}
export default AdminLoginPage