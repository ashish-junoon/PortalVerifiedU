import React, { useState } from "react";
import qrCode from "../../assets/Junoon_Capital_qr_code.png";

const PaymentStaticQR = ({handlePaymentDone}) => {
  const [paymentDone, setPaymentDone] = useState(false);

  // Replace with your actual static QR image link or local file import
//   const qrImage =
//     "http://localhost:5173/Junoon_Capital_qr_code.png/?data=upi://pay?pa=example@upi&pn=MyShop&am=250&cu=INR&size=200x200";

 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
        {!paymentDone ? (
          <>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Pay Using QR Code
            </h2>
            <p className="text-gray-600 mb-6">
              Scan this code with any UPI app (PhonePe, GPay, Paytm, etc.)
            </p>

            {/* QR Code Image */}
            <div className="flex justify-center mb-6">
              <img
                src={qrCode}
                alt="Payment QR Code"
                className="border-4 border-gray-200 rounded-lg w-48 h-48"
              />
            </div>

            {/* Payment Info */}
            <div className="bg-gray-50 p-3 rounded-md mb-4 text-gray-700 text-sm">
              <p>
                <span className="font-semibold">Account Name:</span> My Shop
              </p>
              <p>
                <span className="font-semibold">UPI ID:</span> example@upi
              </p>
              <p>
                <span className="font-semibold">Minimum Amount:</span> ₹250
              </p>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handlePaymentDone}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              close
            </button>
          </>
        ) : (
          // ✅ Success State
          <div className="text-center">
            <div className="text-green-600 text-5xl mb-3">✔</div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mt-2">
              Thank you for your payment. We’ll verify and confirm soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStaticQR;
