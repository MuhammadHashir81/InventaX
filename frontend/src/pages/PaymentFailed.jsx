import React from "react";
import { FaTimesCircle, FaRedo, FaHome } from "react-icons/fa";

const PaymentFailed = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <FaTimesCircle className="text-red-500 text-6xl" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white">
            Payment Failed
          </h1>

          <p className="text-blue-100 mt-2">
            We couldn't complete your transaction.
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Payment Details */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Payment Details
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-semibold text-red-600">
                  Failed
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-medium text-gray-800">
                  TXN-87456231
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-800">
                  {new Date().toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-gray-800">
                  $99.00
                </span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Transaction Could Not Be Processed
            </h3>

            <p className="text-gray-600 leading-relaxed">
              This may have happened due to insufficient funds, an expired
              card, network issues, or your bank declining the transaction.
              Please try again or use a different payment method.
            </p>
          </div>

          {/* Possible Reasons */}
          <div className="bg-blue-50 rounded-2xl p-5 mb-8">
            <h4 className="font-semibold text-gray-800 mb-3">
              Possible Reasons
            </h4>

            <ul className="space-y-2 text-gray-600 text-sm">
              <li>• Insufficient account balance</li>
              <li>• Incorrect card information</li>
              <li>• Expired debit/credit card</li>
              <li>• Bank declined the transaction</li>
              <li>• Temporary network or server issue</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => (window.location.href = "/payment")}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <FaRedo />
              Try Again
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FaHome />
              Back to Home
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 text-center py-4 border-t">
          <p className="text-sm text-gray-500">
            If the issue persists, please contact our support team for
            assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;