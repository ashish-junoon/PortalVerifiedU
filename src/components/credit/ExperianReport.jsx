import { useEffect } from 'react';


const ExperianReport = ({
    providerName = "Experian",
    providerDescription = "View & Download Credit Report",
    applicantName = "N/A",
    mobileNumber = "N/A",
    panNumber = "N/A",
    creditScore = 0,
    // applicantName = "Alok Ranjan",
    // mobileNumber = "+91 1234567890",
    // panNumber = "ABCDE1234F",
    // creditScore = 700,
    scoreLabel = "Good",
    onDownloadReport = () => console.log("Download report clicked"),
    onGetNewReport = () => console.log("Get new report clicked"),
    className = "",
    showScoreMeter = true,
    showStatusBadge = true,
}) => {

    // Determine score color based on value
    const getScoreColor = (score) => {
        if (score >= 800) return "text-purple-600 ";
        if (score >= 750) return "text-blue-600 ";
        if (score >= 700) return "text-green-600 ";
        if (score >= 650) return "text-yellow-600 ";
        if (score >= 600) return "text-orange-600 ";
        return "text-red-600 ";
    };

    // Determine score bar width based on value
    const getScoreWidth = (score) => {
        return `${((score - 300) / (900 - 300)) * 100}%`;
    };

    // Determine status badge based on score
    const getScoreStatus = (score) => {
        if (score >= 800) return "Excellent";
        if (score >= 750) return "Very Good";
        if (score >= 700) return "Good";
        if (score >= 650) return "Fair";
        if (score >= 600) return "Poor";
        return "Very Poor";
    };


    const token = JSON.parse(localStorage.getItem('authData'));

    useEffect(() => {
        if (!token?.data?.Token && !token?.data?.status) {
            window.location.href = "/login";
        }
    }, [token]);

    return (
        <div className={`bg-white  rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}>
            {/* Card Header */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50   p-6 border-b border-gray-100 ">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100  rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 ">{providerName}</h2>
                            <p className="text-sm text-gray-600 ">{providerDescription}</p>
                        </div>
                    </div>
                    {showStatusBadge && (
                        <div className="bg-green-100  text-green-800  px-3 py-1 rounded-full text-sm font-medium">
                            {getScoreStatus(creditScore)}
                        </div>
                    )}
                </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-500  uppercase tracking-wider">Applicant Name</p>
                        <p className="text-lg font-medium text-gray-800 ">{applicantName}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-500  uppercase tracking-wider">Mobile Number</p>
                        <p className="text-lg font-medium text-gray-800 ">{mobileNumber}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-500  uppercase tracking-wider">PAN Number</p>
                        <p className="text-lg font-medium text-gray-800 ">{panNumber?.toUpperCase()}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-500  uppercase tracking-wider">Credit Score</p>
                        <div className="flex items-center">
                            <p className={`text-lg font-bold ${getScoreColor(creditScore)}`}>{creditScore}</p>
                            {scoreLabel && (
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                    {getScoreStatus(creditScore)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Score Meter - Optional */}
                {showScoreMeter && (
                    <div className="mt-8">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Credit Score Range
                        </p>

                        {/* Progress Bar Wrapper */}
                        <div className="relative group w-full bg-gray-200  rounded-full h-2.5">

                            {/* Progress Fill */}
                            <div
                                className="bg-gradient-to-r from-green-400 to-emerald-600 h-2.5 rounded-full"
                                style={{ width: getScoreWidth(creditScore) }}
                            ></div>

                            {/* Tooltip */}
                            <div
                                className="absolute -top-8 px-2 py-1 text-xs text-white bg-black rounded 
                 opacity-0 group-hover:opacity-100 transition 
                 whitespace-nowrap left-[var(--score-pos)] -translate-x-1/2"
                                style={{
                                    "--score-pos": `${(creditScore - 300) / 6}%`,
                                }}
                            >{creditScore}
                            </div>
                        </div>

                        {/* Range Labels */}
                        <div className="flex justify-between text-xs text-gray-500  mt-2">
                            <span>300</span>
                            <span>900</span>
                        </div>
                    </div>

                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    {/* { providerName && providerName=='TransUnion' || providerName=='CRIF Highmark'?'':  */}
                    {/* {providerName && providerName == 'CRIF Highmark' ? '' : */}
                        <button
                            onClick={onDownloadReport}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow hover:shadow-md cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            View Full Report
                        </button>
                        {/* } */}


                    <button
                        onClick={onGetNewReport}
                        className="flex-1 flex items-center justify-center gap-2 bg-white  border border-gray-300  hover:bg-gray-50  text-gray-800  font-medium py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer shadow hover:shadow-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Get New Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExperianReport;