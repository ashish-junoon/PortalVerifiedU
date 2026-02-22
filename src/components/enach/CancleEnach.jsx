import { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet";
import TextPassword from "../fields/TextInput";
import TextInput from "../fields/TextInput";
import Loader from "../utils/Loader";
import { toast } from "react-toastify";
import Sidebar from "../Sidebar";
import SelectInput from "../fields/SelectInput";
import { AuthContext } from "../Context/AuthContext";
import { CancelEMandate } from "../services/Services_API";
import { useSidebar } from "../Context/SidebarContext";
import Modal from "../utils/Modal";

function CancleEnach() {
    const [loading, setLoading] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [pendingValues, setPendingValues] = useState(null);

    const { deductAmount } = useContext(AuthContext);
    const { isOpenSidebar } = useSidebar();

    // Token check & redirect
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("authData"));
        if (!token?.data?.Token && !token?.data?.status) {
            window.location.href = "/login";
        }
    }, []);


    // ------------------ FORM START ------------------------
    const form = useFormik({
        initialValues: {
            id: "",
            remarks: "",
        },

        validationSchema: Yup.object({
            id: Yup.string().required("Mandate ID is required"),
            remarks: Yup.string().required("Remark is required"),
        }),

        onSubmit: async (values) => {
            setPendingValues(values); // to be used for continueSubmitting
            setIsModal(true);
        }
    });

    const continueSubmitting = async () => {

            try {
                setLoading(true);
                // let concent = confirm("Are you sure?")
                // if(!concent) return;

                const payload = {
                    id: pendingValues.id,
                    remarks: pendingValues.remarks,
                    status: "cancel",
                    url: "/verifiedu/CancelEMandate"
                };

                const response = await CancelEMandate(payload);
                console.log(response);
                if (response.success === true) {
                    setLoading(false);
                    form.resetForm();
                    toast.success(response.message);
                } else {
                    setLoading(false);
                    toast.error(response.message);
                }

            } catch (error) {
                toast.error(error.message);
                setLoading(false);
            }
            finally{
                setIsModal(false);
            }
        }

    //   if (loading) return <Loader message="Processing..." color="#63BB89" />;

    // ------------------ FORM END ------------------------

    return (
        <div>
            <Helmet>
                <title>Enach Form</title>
            </Helmet>

            <div className="flex">
                {isOpenSidebar && <Sidebar />}
                {/* <div className="ml-64 p-6 flex-1"> */}
                <div className={`${isOpenSidebar && "lg:ml-64"} md:p-6 p-2 flex-1`}>
                    <div className="md:w-full w-full mx-auto text-black  mt-10">
                        <div className="border border-green-300  md:w-2/3 mx-auto p-8 shadow-md rounded">
                            <h2 className="text-xl font-semibold italic text-green-600">Cancel ENach</h2>
                            <p className="text-xs italic mb-1">Enter all required fields below</p>
                            <div className="border w-full mb-5 border-green-300 " />

                            {/* FORM */}
                            <form onSubmit={form.handleSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <TextInput
                                        label="Mandate ID"
                                        name="id"
                                        value={form.values.id}
                                        onChange={form.handleChange}
                                        onBlur={form.handleBlur}
                                        placeholder="Enter Mandate id"
                                        error={form.touched.id && form.errors.id}
                                    />

                                    <TextInput
                                        label="Remark"
                                        name="remarks"
                                        value={form.values.remarks}
                                        onChange={form.handleChange}
                                        onBlur={form.handleBlur}
                                        placeholder="Enter Remarks"
                                        error={form.touched.remarks && form.errors.remarks}
                                    />
                                </div>

                                <div className="flex gap-4 items-center justify-center my-5">
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300 font-semibold"
                                    >
                                        Submit
                                    </button>

                                    <button
                                        type="reset"
                                        onClick={form.handleReset}
                                        className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300 font-semibold"
                                    >
                                        Reset Form
                                    </button>
                                </div>
            <Modal
                isOpen={isModal}
                onClose={() => setIsModal(false)}
                heading={"Cancel Enach"}
            >
                <div className="px-10 py-5 flex justify-start flex-col gap-5">
                    {/* <div className="flex text-2/xl font-semibold">Cancel Enach</div> */}
                    <div className="flex -mt-5 mb-5">Are you sure that you want to cancel the mandate?</div>

                    <div className="flex gap-4">
                        <button
                            className='px-8 py-1 shadow border border-black bg-red-600 text-white rounded-full text-xs font-bold hover:bg-red-700 hover:cursor-pointer'
                            onClick={continueSubmitting}
                            disabled={loading}
                        >
                            {loading?"Submiting...":"Submit"}
                        </button>

                        <button
                            className='px-8 py-1 shadow border border-black bg-gray-50 text-black rounded-full text-xs font-bold hover:cursor-pointer'
                            onClick={() => setIsModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default CancleEnach;
