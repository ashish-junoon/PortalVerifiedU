import React, { useState } from "react";
import html2pdf from "html2pdf.js";
// import crif from '../../assets/crif.png'; // CRIF logo

function CRIFReportData({ response }) {
  // Your previous logic for data...
  const data = response.data;
  const inquiryData = data?.inquirY_HISTORY?.["history"];

  // Normalize: always make HISTORY an array
  const historyArray = Array.isArray(inquiryData) ? inquiryData : [inquiryData];
  // console.log(inquiryData);
  // console.log(historyArray);

  // Section for displaying Name variations (used in the table)

  const summary = data?.accountS_SUMMARY;
  const primary = summary?.primarY_ACCOUNTS_SUMMARY || {};
  const secondary = summary?.secondarY_ACCOUNTS_SUMMARY || {};

  const SCORE_FACTOR_MAP = {
    SF01: "No missed payments, healthy balance ratio",
    SF02: "Normal proportion of outstanding balance to disbursed amount",
    SF03: "Low credit utilization across accounts",
    SF04: "Long and satisfactory credit history",
    SF05: "Limited number of active credit accounts",
    SF06: "No recent adverse credit events",
    SF07: "Timely repayment behavior on recent loans",
    SF08: "Balanced mix of secured and unsecured credit",
    SF09: "Low number of recent credit enquiries",
    SF10: "Stable outstanding balance over time",
    SF11: "No settlement, write-off, or default history",
  };

  const factorCodes = data?.scores?.score?.scorE_FACTORS
    ?.split("|")
    .filter(Boolean); // removes empty values

  function NameVariations({ data, ispan }) {
    const variations = Array.isArray(data["variation"])
      ? data["variation"]
      : [data["variation"]];

    // Helper: parse DD-MM-YYYY into a Date object
    const parseDate = (dateStr) => {
      if (!dateStr) return new Date(0); // fallback
      const [day, month, year] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day);
    };

    // Sort descending by REPORTED-DATE
    const sortedVariations = [...variations].sort((a, b) => {
      const dateA = parseDate(a["reporteD_DATE"]);
      const dateB = parseDate(b["reporteD_DATE"]);
      return dateB - dateA; // latest first
    });

    return (
      <>
        {sortedVariations.map((item, index) => (
          <div
            key={index}
            style={{
              display: "table",
              width: "100%",
              backgroundColor: "#f3f4f6",
              padding: "2px 8px",
              marginBottom: "1px",
              color: "#656565",
            }}
          >
            <span
              style={{
                display: "table-cell",
                width: "70%",
                fontSize: "10px",
              }}
            >
              {item.value} {ispan && "[PAN]"}
            </span>

            <span
              style={{
                display: "table-cell",
                width: "30%",
                textAlign: "right",
                fontSize: "10px",
                whiteSpace: "nowrap",
              }}
            >
              {item?.["reporteD_DATE"]}
            </span>
          </div>
        ))}
      </>
    );
  }
  // Function to render a loan section

  // function LoanSection({ loan, serial }) {
  //   const details = loan["loaN_DETAILS"];
  //   const title = {
  //     AccountType: details["accT_TYPE"],
  //     CreditGrantor: details["crediT_GUARANTOR"],
  //     Account: details["accT_NUMBER"],
  //     Info: details["datE_REPORTED"],
  //     Status: details["accounT_STATUS"],
  //   };

  //   const data = [
  //     ["Ownership", details["ownershiP_IND"]],
  //     ["Disbursed Date", details["disburseD_DT"] || ""],
  //     ["Disbd Amt/High", details["disburseD_AMT"] || ""],
  //     ["Credit Limit", details["crediT_LIMIT"] || ""],
  //     ["Last Payment Date", details["lasT_PAYMENT_DATE"] || ""],
  //     ["Current Balance", `${details["currenT_BAL"] || ""}`],
  //     ["Closed Date", details["closeD_DATE"] || ""],
  //     ["Last Paid Amt", details["actuaL_PAYMENT"] || ""],
  //     ["InstlAmt/Freq", details["installmenT_AMT"] || ""],
  //     ["Tenure (Month)", details["repaymenT_TENURE"] || ""],
  //     ["Overdue Amt", `${details["overduE_AMT"] || ""}`],
  //   ];

  //   const headers = [
  //     "",
  //     "January",
  //     "February",
  //     "March",
  //     "April",
  //     "May",
  //     "June",
  //     "July",
  //     "August",
  //     "September",
  //     "October",
  //     "November",
  //     "December",
  //   ];

  //   const history = details["combineD_PAYMENT_HISTORY"] || "";
  //   const historyMap = {};
  //   history.split("|").forEach((entry) => {
  //     if (!entry) return;
  //     const [monthYear, status] = entry.split(",");
  //     const [month, year] = monthYear.split(":");
  //     historyMap[month] = status;
  //     historyMap["year"] = year;
  //   });

  //   const rows = [
  //     [
  //       historyMap["year"] || "",
  //       historyMap["Jan"] || "",
  //       historyMap["Feb"] || "",
  //       historyMap["Mar"] || "",
  //       historyMap["Apr"] || "",
  //       historyMap["May"] || "",
  //       historyMap["Jun"] || "",
  //       historyMap["Jul"] || "",
  //       historyMap["Aug"] || "",
  //       historyMap["Sep"] || "",
  //       historyMap["Oct"] || "",
  //       historyMap["Nov"] || "",
  //       historyMap["Dec"] || "",
  //     ],
  //   ];

  //   return (
  //     // <Section title="Account Information">
  //     <div>
  //       <AccountBlock id={serial} title={title} data={data} />
  //       <div className="px-6 py-0 mt-[-15px]">
  //         <SimpleTable2 headers={headers} rows={rows} />
  //       </div>
  //     </div>
  //     // </Section>
  //   );
  // }

  function LoanSection({ loan, serial }) {
    const details = loan?.loaN_DETAILS || {};

    /* ===========================
     ACCOUNT TITLE DATA
  ============================ */
    const title = {
      AccountType: details.accT_TYPE || "",
      CreditGrantor: details.crediT_GUARANTOR || "",
      Account: details.accT_NUMBER || "",
      Info: details.datE_REPORTED || "",
      Status: details.accounT_STATUS || "",
    };

    /* ===========================
     ACCOUNT INFO DATA
  ============================ */
    const data = [
      ["Ownership", details.ownershiP_IND || ""],
      ["Disbursed Date", details.disburseD_DT || ""],
      ["Disbd Amt/High", details.disburseD_AMT || ""],
      ["Credit Limit", details.crediT_LIMIT || ""],
      ["Last Payment Date", details.lasT_PAYMENT_DATE || ""],
      ["Current Balance", details.currenT_BAL || ""],
      ["Closed Date", details.closeD_DATE || ""],
      ["Last Paid Amt", details.actuaL_PAYMENT || ""],
      ["Instl Amt/Freq", details.installmenT_AMT || ""],
      ["Tenure (Month)", details.repaymenT_TENURE || ""],
      ["Overdue Amt", details.overduE_AMT || ""],
    ];

    /* ===========================
     TABLE HEADERS
  ============================ */
    const headers = [
      "",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    /* ===========================
     PAYMENT HISTORY PARSE
  ============================ */
    const history = details.combineD_PAYMENT_HISTORY || "";
    const historyByYear = {};

    history.split("|").forEach((entry) => {
      if (!entry) return;

      const [monthYear, status] = entry.split(",");
      const [month, year] = monthYear.split(":");

      if (!historyByYear[year]) {
        historyByYear[year] = {};
      }

      historyByYear[year][month] = status;
    });

    /* ===========================
     TABLE ROWS (MULTI-YEAR)
  ============================ */
    const rows = Object.keys(historyByYear)
      .sort((a, b) => b - a) // latest year first
      .map((year) => [
        year,
        historyByYear[year]["Jan"] || "",
        historyByYear[year]["Feb"] || "",
        historyByYear[year]["Mar"] || "",
        historyByYear[year]["Apr"] || "",
        historyByYear[year]["May"] || "",
        historyByYear[year]["Jun"] || "",
        historyByYear[year]["Jul"] || "",
        historyByYear[year]["Aug"] || "",
        historyByYear[year]["Sep"] || "",
        historyByYear[year]["Oct"] || "",
        historyByYear[year]["Nov"] || "",
        historyByYear[year]["Dec"] || "",
      ]);

    /* ===========================
     RENDER
  ============================ */
    return (
      <div>
        <AccountBlock id={serial} title={title} data={data} />

        <div className="px-6 py-0 mt-[-15px]">
          <SimpleTable2 headers={headers} rows={rows} />
        </div>
      </div>
    );
  }

  // Render all loans in the report
  function LoanList({ responses }) {
    return (
      <div>
        <Section title="Account Information">
          {responses["response"].map((loan, index) => (
            <LoanSection key={index} loan={loan} serial={index + 1} />
          ))}
        </Section>
      </div>
    );
  }

  return (
    <>
      {/* <button onClick={handleDownloadPDF}>View</button> */}
      <div id="pdf-content" style={{ width: "100%", display: "none" }}>
        {/* A4 PDF Container */}
        <div
          style={{
            width: "100%",
            margin: "0 auto",
            minHeight: "1123px",
            backgroundColor: "#ffffff",
            fontSize: "10px",
            color: "#1f2937",
          }}
        >
          {/* ================= HEADER ================= */}

          <div
            style={{
              padding: 6,
              display: "grid",
              gridTemplateColumns: "1fr 2fr 1fr",
              alignItems: "center",
              gap: "30px",
              borderBottom: "1px solid #d1d5db",
            }}
          >
            {/* LOGO */}
            <div style={{ width: 150 }}>
              <img
                src={`${window.location.origin}/images/crif.png`}
                alt=""
                style={{ width: "100%" }}
              />
            </div>

            {/* TITLE */}
            <div style={{ paddingLeft: 12, width: "fit-content" }}>
              <h1
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#083a5dc4",
                  margin: 0,
                  textAlign: "right",
                }}
              >
                Consumer Base
                <sup style={{ fontSize: 8 }}>TM</sup> Report
              </h1>

              <p
                style={{
                  fontWeight: 700,
                  margin: 0,
                  width: "fit-content",
                  color: "#000",
                  fontSize: 10,
                  textTransform: "uppercase",
                  float: "right",
                }}
              >
                For {data?.request?.name}
              </p>
            </div>

            {/* META INFO */}
            <div
              style={{
                paddingTop: 16,
                paddingBottom: 16,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                minWidth: 260,
                fontSize: 10,
              }}
            >
              <p style={{ fontWeight: 700, margin: 0, marginBottom: -5 }}>
                <span style={{ color: "#083a5dc4" }}>CHM Ref #:</span>{" "}
                {data?.header?.reporT_ID}
              </p>

              <p style={{ fontWeight: 700, margin: 0, marginBottom: -5 }}>
                <span style={{ color: "#083a5dc4" }}>Application ID:</span> -
              </p>

              <p style={{ fontWeight: 700, margin: 0, marginBottom: -5 }}>
                <span style={{ color: "#083a5dc4" }}>Prepared For:</span> JUNOON
                CAPITAL SERVICES PRIVATE LIMITED
              </p>

              <p style={{ fontWeight: 700, margin: 0, marginBottom: -5 }}>
                <span style={{ color: "#083a5dc4" }}>Date of Request:</span>{" "}
                {data?.header?.datE_OF_REQUEST}
              </p>

              <p style={{ fontWeight: 700, margin: 0, marginBottom: -5 }}>
                <span style={{ color: "#083a5dc4" }}>Date of Issue:</span>{" "}
                {data?.header?.datE_OF_ISSUE}
              </p>
            </div>
          </div>

          {/* ================= INQUIRY INPUT ================= */}
          <Section title="Inquiry Input Information">
            <InfoGrid
              data={[
                ["Name", `${data.request.name}`],
                ["DOB", `${data.request.dob}`],
                ["Phone Number", `${data.request?.["phonE_1"]}`],
                ["Id(s)", `${data.request.pan}[PAN]`],
                ["Email Id(s)", `${data.request?.["emaiL_1"]}`],
              ]}
            />
            <p
              style={{
                marginTop: 8,
                fontSize: 10,
                fontWeight: 700,
                paddingLeft: 12,
              }}
            >
              <span style={{ color: "#083a5dc4" }}>Entity Id</span>
            </p>
            <p
              style={{
                marginTop: 8,
                fontSize: 10,
                fontWeight: 700,
                paddingLeft: 12,
              }}
            >
              <span style={{ color: "#083a5dc4" }}>Current Address:</span>
              {data?.request["addresS_1"]}
            </p>
            <p
              style={{
                marginTop: 8,
                fontSize: 10,
                fontWeight: 700,
                paddingLeft: 12,
              }}
            >
              <span style={{ color: "#083a5dc4" }}>Other Address:</span>
              {data?.request["addresS_2"]}
            </p>
          </Section>

          {/* ================= SCORE ================= */}
          <Section title="CRIF HM Score(s):">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    color: "#083a5dc4",
                    opacity: 0.8,
                    textTransform: "uppercase",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: 6 }}>Score Name</th>
                  <th style={{ padding: 6 }}>Score</th>
                  <th style={{ padding: 6 }}>Scoring Factors</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: "#dedbfe", opacity: 0.6 }}>
                <tr>
                  <td style={{ padding: 6, fontWeight: 700 }}>
                    {data.scores?.score?.["scorE_TYPE"]}
                  </td>
                  <td style={{ padding: 6 }}>
                    <span style={{ fontSize: 20, fontWeight: 700 }}>
                      {data.scores?.score?.["scorE_VALUE"]}
                    </span>{" "}
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#0d0d0d",
                      }}
                    >
                      Score Range : 300-900
                    </span>
                  </td>
                  {/* <td style={{ padding: 6, fontWeight: 700 }}>
                    <ul style={{ padding: 0, margin: 0 }}>
                      <li
                        style={{
                          position: "relative",
                          paddingLeft: 14,
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 12,
                            width: 5,
                            height: 5,
                            backgroundColor: "#15803d",
                            borderRadius: "50%",
                          }}
                        />
                        No missed payments, healthy balance ratio
                      </li>
                      <li style={{ position: "relative", paddingLeft: 14 }}>
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 12,
                            width: 5,
                            height: 5,
                            backgroundColor: "#15803d",
                            borderRadius: "50%",
                          }}
                        />
                        Normal proportion of outstanding balance to disbursed
                        amount
                      </li>
                    </ul>
                  </td> */}

                  <td style={{ padding: 6, fontWeight: 700 }}>
                    <ul style={{ padding: 0, margin: 0 }}>
                      {factorCodes?.map((code) => (
                        <li
                          key={code}
                          style={{
                            position: "relative",
                            paddingLeft: 14,
                            marginBottom: 0,
                            listStyle: "none",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 10,
                              width: 5,
                              height: 5,
                              // backgroundColor: "#22c55e",
                              backgroundColor:
                                data.scores?.score?.["scorE_VALUE"] < 500
                                  ? "red"
                                  : "#22c55e"
                            }}
                          />
                          {SCORE_FACTOR_MAP[code] || "Unknown scoring factor"}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                paddingRight: 24,
                marginTop: 8,
              }}
            >
              <span style={{ fontSize: 10 }}>Tip :</span>

              <span
                style={{ position: "relative", paddingLeft: 12, fontSize: 10 }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 10,
                    width: 5,
                    height: 5,
                    backgroundColor: "#22c55e",
                  }}
                />
                Positive impact on credit score
              </span>

              <span
                style={{ position: "relative", paddingLeft: 12, fontSize: 10 }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 10,
                    width: 5,
                    height: 5,
                    backgroundColor: "#ef4444",
                  }}
                />
                Negative impact on credit score
              </span>
            </div>
          </Section>

          {/* ================= VARIATIONS ================= */}
          <Section
            title="Personal Information – Variations"
            note="Tip: These are applicant's personal information variations as contributed by various financial institutions."
          >
            <div style={{ width: "100%", fontSize: 10 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: 24,
                  padding: "4px 16px",
                  fontWeight: 700,
                  fontSize: 10,
                }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "#0f3c64",
                        borderBottom: "1px solid #93c5fd",
                        paddingBottom: "10px",
                      }}
                    >
                      <span>Name Variations</span>
                      <span>Reported On</span>
                    </div>

                    <NameVariations
                      data={data?.personaL_INFO_VARIATION["namE_VARIATIONS"]}
                    />
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "#0f3c64",
                        borderBottom: "1px solid #93c5fd",
                        paddingBottom: "10px",
                      }}
                    >
                      <span>Address Variations</span>
                      <span>Reported On</span>
                    </div>

                    <NameVariations
                      data={
                        data?.["personaL_INFO_VARIATION"]["addresS_VARIATIONS"]
                      }
                    />
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "#0f3c64",
                        borderBottom: "1px solid #93c5fd",
                        paddingBottom: "10px",
                      }}
                    >
                      <span>Email ID Variations</span>
                      <span>Reported On</span>
                    </div>

                    <NameVariations
                      data={
                        data?.["personaL_INFO_VARIATION"]["emaiL_VARIATIONS"]
                      }
                    />
                  </div>
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "#0f3c64",
                        borderBottom: "1px solid #93c5fd",
                        paddingBottom: "10px",
                      }}
                    >
                      <span>DOB Variations</span>
                      <span>Reported On</span>
                    </div>

                    <NameVariations
                      data={
                        data?.["personaL_INFO_VARIATION"][
                          "datE_OF_BIRTH_VARIATIONS"
                        ]
                      }
                    />
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "#0f3c64",
                        borderBottom: "1px solid #93c5fd",
                        paddingBottom: "10px",
                      }}
                    >
                      <span>Phone Variations</span>
                      <span>Reported On</span>
                    </div>

                    <NameVariations
                      data={
                        data?.["personaL_INFO_VARIATION"][
                          "phonE_NUMBER_VARIATIONS"
                        ]
                      }
                    />
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "#0f3c64",
                        borderBottom: "1px solid #93c5fd",
                        paddingBottom: "10px",
                      }}
                    >
                      <span>ID Variations</span>
                      <span>Reported On</span>
                    </div>

                    <NameVariations
                      data={data?.["personaL_INFO_VARIATION"]["paN_VARIATIONS"]}
                      ispan={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* ================= ACCOUNT SUMMARY ================= */}
          <Section
            title="Account Summary"
            note="Tip: These are applicant's personal information variations as contributed by various financial institutions."
            notet="Tip: All amounts are in INR."
          >
            <SimpleTable
              border={true}
              headers={[
                "Type",
                "Number of Account(s)",
                "Active Account(s)",
                "Overdue Account(s)",
                "Current Balance",
                "Amt Disbd/High Credit",
              ]}
              rows={[
                [
                  "Primary Match",
                  data?.["accountS_SUMMARY"]?.["primarY_ACCOUNTS_SUMMARY"]?.[
                    "primarY_NUMBER_OF_ACCOUNTS"
                  ] || 0,
                  data?.["accountS_SUMMARY"]?.["primarY_ACCOUNTS_SUMMARY"]?.[
                    "primarY_ACTIVE_NUMBER_OF_ACCOUNTS"
                  ] || 0,
                  data?.["accountS_SUMMARY"]?.["primarY_ACCOUNTS_SUMMARY"]?.[
                    "primarY_OVERDUE_NUMBER_OF_ACCOUNTS"
                  ] || 0,
                  data?.["accountS_SUMMARY"]?.["primarY_ACCOUNTS_SUMMARY"]?.[
                    "primarY_CURRENT_BALANCE"
                  ] || 0,
                  data?.["accountS_SUMMARY"]?.["primarY_ACCOUNTS_SUMMARY"]?.[
                    "primarY_DISBURSED_AMOUNT"
                  ] || 0,
                ],
                [
                  "Total",
                  data?.["accountS_SUMMARY"]?.["primarY_ACCOUNTS_SUMMARY"]?.[
                    "primarY_NUMBER_OF_ACCOUNTS"
                  ] || 0,
                  data?.["accountS_SUMMARY"]?.["primarY_ACCOUNTS_SUMMARY"]?.[
                    "primarY_ACTIVE_NUMBER_OF_ACCOUNTS"
                  ] || 0,
                  data?.["accountS_SUMMARY"]?.["primarY_ACCOUNTS_SUMMARY"]?.[
                    "primarY_OVERDUE_NUMBER_OF_ACCOUNTS"
                  ] || 0,
                  data?.["accountS_SUMMARY"]?.["primarY_ACCOUNTS_SUMMARY"]?.[
                    "primarY_CURRENT_BALANCE"
                  ] || 0,
                  data?.["accountS_SUMMARY"]?.["primarY_ACCOUNTS_SUMMARY"]?.[
                    "primarY_DISBURSED_AMOUNT"
                  ] || 0,
                ],
              ]}
            />
            <div
              style={{
                border: "2px solid #bfdbfe",
                borderTop: "transparent",
                padding: 6,
                display: "flex",
                justifyContent: "space-between",
                marginTop: -10,
              }}
            >
              <p
                style={{
                  margin: "2px 0px",
                  color: "#083a5dc4",
                  fontWeight: 700,
                }}
              >
                Inquiries in last 24 Months:{" "}
                <span style={{ color: "#000" }}>1</span>
              </p>
              <p
                style={{
                  margin: "2px 0px",
                  color: "#083a5dc4",
                  fontWeight: 700,
                }}
              >
                New Account(s) in last 6 Months:{" "}
                <span style={{ color: "#000" }}>0</span>
              </p>
              <p
                style={{
                  margin: "2px 0px",
                  color: "#083a5dc4",
                  fontWeight: 700,
                }}
              >
                New Delinquent Account(s) in last 6 Months:{" "}
                <span style={{ color: "#000" }}>0</span>
              </p>
            </div>
          </Section>

          {/* ================= ACCOUNT DETAILS ================= */}
          <LoanList responses={data?.responses} />

          {/* ================= HEADER ADVANCE OVERLAPE REPORT ================= */}
          <div className="px-6 pt-2 pb-3 flex justify-between items-center gap-5 border-b border-b-[#d1d5db] ">
            <div className="w-[150px]">
              <img
                className="w-full rounded-md"
                src={`${window.location.origin}/images/crif.png`}
                alt=""
              />
            </div>

            <div>
              <h1 className="text-lg font-bold uppercase text-[#083a5dc4]">
                ADVANCED OVERLAP REPORT
              </h1>
              <p className="font-bold float-right">For {data.request.name}</p>
            </div>

            {/* ================= META INFO ================= */}
            <div className="py-4 gap-y-2">
              <p className="font-bold">
                <span className="text-[#083a5dc4]">CHM Ref #:</span>{" "}
                {data.header?.["reporT_ID"]}
              </p>
              <p className="font-bold">
                <span className="text-[#083a5dc4]">Application ID:</span> -
              </p>
              <p className="font-bold">
                <span className="text-[#083a5dc4]">Prepared For:</span> JUNOON
                CAPITAL SERVICES PRIVATE LIMITED
              </p>
              <p className="font-bold">
                <span className="text-[#083a5dc4]">Date of Request:</span>{" "}
                {data.header?.["datE_OF_REQUEST"]}
              </p>
              <p className="font-bold">
                <span className="text-[#083a5dc4]">Date of Issue:</span>{" "}
                {data.header?.["datE_OF_ISSUE"]}
              </p>
            </div>
          </div>

          {/* <Section
            title="Summary"
            note="Tip: Current Balance, Disbursed Amount & Instalment Amount is considered ONLY for ACTIVE account"
            notet="Tip: All amounts are in INR"
          >
            <div>
              <table
                style={{ border: "2px solid #bfdbfe" }}
                className="w-full text-[12px]"
              >
                
                <thead
                  style={{ border: "2px solid #bfdbfe", paddingBottom: 5 }}
                  className=""
                >
                  
                  <tr className="text-[#083a5dc4] font-semibold text-left leading-3.5">
                    <th rowSpan={2} className="px-1 align-middle">
                      Type
                    </th>

                    <th colSpan={2} className="px-1 text-center">
                      Association
                    </th>

                    <th colSpan={3} className="px-1 text-center">
                      Account Summary
                    </th>

                    <th colSpan={2} className="px-1 text-center">
                      Disbursed Amount
                    </th>

                    <th colSpan={2} className="px-1 text-center">
                      Installment Amount
                    </th>

                    <th colSpan={2} className="px-1 text-center">
                      Current Balance
                    </th>
                  </tr>

                  <tr className="text-center font-semibold">

                    <th className="p-1">Own</th>
                    <th className="p-1">Others</th>

                    <th className="p-1">Total</th>
                    <th className="p-1">Active</th>
                    <th className="p-1">Overdue</th>

                    <th className="p-1">Own</th>
                    <th className="p-1">Others</th>

                    <th className="p-1">Own</th>
                    <th className="p-1">Others</th>

                    <th className="p-1">Own</th>
                    <th className="p-1">Others</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="p-1 font-semibold">Primary Match</td>

                    <td className="p-1 text-center">0</td>
                    <td className="p-1 text-center">0</td>

                    <td className="p-1 text-center">0</td>
                    <td className="p-1 text-center">0</td>
                    <td className="p-1 text-center">0</td>

                    <td className="p-1 text-center">-</td>
                    <td className="p-1 text-center">-</td>

                    <td className="p-1 text-center">-</td>
                    <td className="p-1 text-center">-</td>

                    <td className="p-1 text-center">-</td>
                    <td className="p-1 text-center"></td>
                  </tr>

                  <tr className="font-semibold">
                    <td className="p-1">Secondary Match</td>

                    <td className="p-1 text-center">0</td>
                    <td className="p-1 text-center">0</td>

                    <td className="p-1 text-center">0</td>
                    <td className="p-1 text-center">0</td>
                    <td className="p-1 text-center">0</td>

                    <td className="p-1 text-center">-</td>
                    <td className="p-1 text-center">-</td>

                    <td className="p-1 text-center">-</td>
                    <td className="p-1 text-center">-</td>

                    <td className="p-1 text-center">-</td>
                    <td className="p-1 text-center">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section> */}

          <Section
            title="Summary"
            note="Tip: Current Balance, Disbursed Amount & Instalment Amount is considered ONLY for ACTIVE account"
            notet="Tip: All amounts are in INR"
          >
            <div>
              <table
                style={{ border: "2px solid #bfdbfe" }}
                className="w-full text-[12px]"
              >
                {/* ================= HEADER ================= */}
                <thead style={{ border: "2px solid #bfdbfe" }}>
                  <tr className="text-[#083a5dc4] font-semibold text-left leading-3.5">
                    <th rowSpan={2} className="px-1 align-middle">
                      Type
                    </th>

                    <th colSpan={2} className="text-center">
                      Association
                    </th>
                    <th colSpan={3} className="text-center">
                      Account Summary
                    </th>
                    <th colSpan={2} className="text-center">
                      Disbursed Amount
                    </th>
                    <th colSpan={2} className="text-center">
                      Installment Amount
                    </th>
                    <th colSpan={2} className="text-center">
                      Current Balance
                    </th>
                  </tr>

                  <tr className="text-center font-semibold">
                    <th>Own</th>
                    <th>Others</th>

                    <th>Total</th>
                    <th>Active</th>
                    <th>Overdue</th>

                    <th>Own</th>
                    <th>Others</th>

                    <th>Own</th>
                    <th>Others</th>

                    <th>Own</th>
                    <th>Others</th>
                  </tr>
                </thead>

                {/* ================= BODY ================= */}
                <tbody>
                  {/* ================= PRIMARY ================= */}
                  <tr>
                    <td className="p-1 font-semibold">Primary Match</td>

                    {/* Association */}
                    <td className="p-1 text-center">
                      {primary.primarY_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">0</td>

                    {/* Account Summary */}
                    <td className="p-1 text-center">
                      {primary.primarY_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">
                      {primary.primarY_ACTIVE_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">
                      {primary.primarY_OVERDUE_NUMBER_OF_ACCOUNTS || 0}
                    </td>

                    {/* Disbursed */}
                    <td className="p-1 text-center">
                      {primary.primarY_DISBURSED_AMOUNT || "-"}
                    </td>
                    <td className="p-1 text-center">-</td>

                    {/* Installment */}
                    <td className="p-1 text-center">-</td>
                    <td className="p-1 text-center">-</td>

                    {/* Current Balance */}
                    <td className="p-1 text-center">
                      {primary.primarY_CURRENT_BALANCE || "-"}
                    </td>
                    <td className="p-1 text-center">-</td>
                  </tr>

                  {/* ================= SECONDARY ================= */}
                  <tr className="font-semibold">
                    <td className="p-1">Secondary Match</td>

                    <td className="p-1 text-center">
                      {secondary.secondarY_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">0</td>

                    <td className="p-1 text-center">
                      {secondary.secondarY_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">
                      {secondary.secondarY_ACTIVE_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">
                      {secondary.secondarY_OVERDUE_NUMBER_OF_ACCOUNTS || 0}
                    </td>

                    <td className="p-1 text-center">
                      {secondary.secondarY_DISBURSED_AMOUNT || "-"}
                    </td>
                    <td className="p-1 text-center">-</td>

                    <td className="p-1 text-center">-</td>
                    <td className="p-1 text-center">-</td>

                    <td className="p-1 text-center">
                      {secondary.secondarY_CURRENT_BALANCE || "-"}
                    </td>
                    <td className="p-1 text-center">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Account Details - Primary"></Section>

          {/* ================= HEADER ADVANCE OVERLAPE REPORT ================= */}

          <div
            style={{
              padding: 6,
              display: "grid",
              gridTemplateColumns: "1fr 2fr 1fr",
              alignItems: "center",
              gap: 30,
              borderBottom: "1px solid #d1d5db",
            }}
          >
            {/* LOGO */}
            <div style={{ width: 150 }}>
              <img
                src={`${window.location.origin}/images/crif.png`}
                alt=""
                style={{ width: "100%" }}
              />
            </div>

            {/* TITLE */}
            <div>
              <h1 className="text-lg font-bold uppercase text-[#083a5dc4]">
                GROUP DETAILS
              </h1>
            </div>

            {/* META INFO */}
            <div
              style={{
                paddingTop: 16,
                paddingBottom: 16,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                minWidth: 260,
                fontSize: 10,
              }}
            >
              <p style={{ fontWeight: 700, margin: 0, marginBottom: -5 }}>
                <span style={{ color: "#083a5dc4" }}>CHM Ref #:</span>{" "}
                {data?.header?.reporT_ID}
              </p>

              <p style={{ fontWeight: 700, margin: 0, marginBottom: -5 }}>
                <span style={{ color: "#083a5dc4" }}>Application ID:</span> -
              </p>

              <p style={{ fontWeight: 700, margin: 0, marginBottom: -5 }}>
                <span style={{ color: "#083a5dc4" }}>Prepared For:</span> JUNOON
                CAPITAL SERVICES PRIVATE LIMITED
              </p>

              <p style={{ fontWeight: 700, margin: 0, marginBottom: -5 }}>
                <span style={{ color: "#083a5dc4" }}>Date of Request:</span>{" "}
                {data?.header?.datE_OF_REQUEST}
              </p>

              <p style={{ fontWeight: 700, margin: 0, marginBottom: -5 }}>
                <span style={{ color: "#083a5dc4" }}>Date of Issue:</span>{" "}
                {data?.header?.datE_OF_ISSUE}
              </p>
            </div>
          </div>
          {/* ================= Summary GT ================= */}

          <Section
            title="Summary"
            note="Tip: Current Balance, Disbursed Amount & Instalment Amount is considered ONLY for ACTIVE account"
            notet="Tip: All amounts are in INR"
          >
            <div>
              <table
                style={{ border: "2px solid #bfdbfe" }}
                className="w-full text-[12px]"
              >
                {/* ================= HEADER ================= */}
                <thead style={{ border: "2px solid #bfdbfe" }}>
                  <tr className="text-[#083a5dc4] font-semibold text-left leading-3.5">
                    <th rowSpan={2} className="px-1 align-middle">
                      Type
                    </th>

                    <th colSpan={2} className="text-center">
                      Association
                    </th>
                    <th colSpan={3} className="text-center">
                      Account Summary
                    </th>
                    <th colSpan={2} className="text-center">
                      Disbursed Amount
                    </th>
                    <th colSpan={2} className="text-center">
                      Installment Amount
                    </th>
                    <th colSpan={2} className="text-center">
                      Current Balance
                    </th>
                  </tr>

                  <tr className="text-center font-semibold">
                    <th>Own</th>
                    <th>Others</th>

                    <th>Total</th>
                    <th>Active</th>
                    <th>Overdue</th>

                    <th>Own</th>
                    <th>Others</th>

                    <th>Own</th>
                    <th>Others</th>

                    <th>Own</th>
                    <th>Others</th>
                  </tr>
                </thead>

                {/* ================= BODY ================= */}
                <tbody>
                  {/* ================= PRIMARY ================= */}
                  <tr>
                    <td className="p-1 font-semibold">Primary Match</td>

                    {/* Association */}
                    <td className="p-1 text-center">
                      {primary.primarY_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">0</td>

                    {/* Account Summary */}
                    <td className="p-1 text-center">
                      {primary.primarY_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">
                      {primary.primarY_ACTIVE_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">
                      {primary.primarY_OVERDUE_NUMBER_OF_ACCOUNTS || 0}
                    </td>

                    {/* Disbursed */}
                    <td className="p-1 text-center">
                      {primary.primarY_DISBURSED_AMOUNT || "-"}
                    </td>
                    <td className="p-1 text-center">-</td>

                    {/* Installment */}
                    <td className="p-1 text-center">-</td>
                    <td className="p-1 text-center">-</td>

                    {/* Current Balance */}
                    <td className="p-1 text-center">
                      {primary.primarY_CURRENT_BALANCE || "-"}
                    </td>
                    <td className="p-1 text-center">-</td>
                  </tr>

                  {/* ================= SECONDARY ================= */}
                  <tr className="font-semibold">
                    <td className="p-1">Secondary Match</td>

                    <td className="p-1 text-center">
                      {secondary.secondarY_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">0</td>

                    <td className="p-1 text-center">
                      {secondary.secondarY_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">
                      {secondary.secondarY_ACTIVE_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">
                      {secondary.secondarY_OVERDUE_NUMBER_OF_ACCOUNTS || 0}
                    </td>

                    <td className="p-1 text-center">
                      {secondary.secondarY_DISBURSED_AMOUNT || "-"}
                    </td>
                    <td className="p-1 text-center">-</td>

                    <td className="p-1 text-center">-</td>
                    <td className="p-1 text-center">-</td>

                    <td className="p-1 text-center">
                      {secondary.secondarY_CURRENT_BALANCE || "-"}
                    </td>
                    <td className="p-1 text-center">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Account Details - Primary"></Section>

          {/* ================= HEADER ADVANCE OVERLAPE REPORT ================= */}
          <div
            style={{
              padding: 6,
              display: "grid",
              gridTemplateColumns: "1fr 2fr 1fr",
              alignItems: "center",
              gap: 30,
              borderBottom: "1px solid #d1d5db",
            }}
          >
            {/* LOGO */}
            <div style={{ width: 150 }}>
              <img
                src={`${window.location.origin}/images/crif.png`}
                alt=""
                style={{ width: "100%" }}
              />
            </div>

            {/* TITLE */}
            <div>
              <h1 className="text-lg font-bold uppercase text-[#083a5dc4]">
                GROUP DETAILS
              </h1>
            </div>

            {/* META INFO */}
            <div
              style={{
                paddingTop: 16,
                paddingBottom: 16,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                minWidth: 260,
                fontSize: 10,
              }}
            >
              <p style={{ fontWeight: 700, margin: 0, marginBottom: -5 }}>
                <span style={{ color: "#083a5dc4" }}>CHM Ref #:</span>{" "}
                {data?.header?.reporT_ID}
              </p>

              <p style={{ fontWeight: 700, margin: 0, marginBottom: -5 }}>
                <span style={{ color: "#083a5dc4" }}>Application ID:</span> -
              </p>

              <p style={{ fontWeight: 700, margin: 0, marginBottom: -5 }}>
                <span style={{ color: "#083a5dc4" }}>Prepared For:</span> JUNOON
                CAPITAL SERVICES PRIVATE LIMITED
              </p>

              <p style={{ fontWeight: 700, margin: 0, marginBottom: -5 }}>
                <span style={{ color: "#083a5dc4" }}>Date of Request:</span>{" "}
                {data?.header?.datE_OF_REQUEST}
              </p>

              <p style={{ fontWeight: 700, margin: 0, marginBottom: -5 }}>
                <span style={{ color: "#083a5dc4" }}>Date of Issue:</span>{" "}
                {data?.header?.datE_OF_ISSUE}
              </p>
            </div>
          </div>
          {/* ================= Summary GT ================= */}

          <Section
            title="Summary"
            note="Tip: Current Balance, Disbursed Amount & Instalment Amount is considered ONLY for ACTIVE account"
            notet="Tip: All amounts are in INR"
          >
            <div>
              <table
                style={{ border: "2px solid #bfdbfe" }}
                className="w-full text-[12px]"
              >
                {/* ================= HEADER ================= */}
                <thead style={{ border: "2px solid #bfdbfe" }}>
                  <tr className="text-[#083a5dc4] font-semibold text-left leading-3.5">
                    <th rowSpan={2} className="px-1 align-middle">
                      Type
                    </th>

                    <th colSpan={2} className="text-center">
                      Association
                    </th>
                    <th colSpan={3} className="text-center">
                      Account Summary
                    </th>
                    <th colSpan={2} className="text-center">
                      Disbursed Amount
                    </th>
                    <th colSpan={2} className="text-center">
                      Installment Amount
                    </th>
                    <th colSpan={2} className="text-center">
                      Current Balance
                    </th>
                  </tr>

                  <tr className="text-center font-semibold">
                    <th>Own</th>
                    <th>Others</th>

                    <th>Total</th>
                    <th>Active</th>
                    <th>Overdue</th>

                    <th>Own</th>
                    <th>Others</th>

                    <th>Own</th>
                    <th>Others</th>

                    <th>Own</th>
                    <th>Others</th>
                  </tr>
                </thead>

                {/* ================= BODY ================= */}
                <tbody>
                  {/* ================= PRIMARY ================= */}
                  <tr>
                    <td className="p-1 font-semibold">Primary Match</td>

                    {/* Association */}
                    <td className="p-1 text-center">
                      {primary.primarY_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">0</td>

                    {/* Account Summary */}
                    <td className="p-1 text-center">
                      {primary.primarY_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">
                      {primary.primarY_ACTIVE_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">
                      {primary.primarY_OVERDUE_NUMBER_OF_ACCOUNTS || 0}
                    </td>

                    {/* Disbursed */}
                    <td className="p-1 text-center">
                      {primary.primarY_DISBURSED_AMOUNT || "-"}
                    </td>
                    <td className="p-1 text-center">-</td>

                    {/* Installment */}
                    <td className="p-1 text-center">-</td>
                    <td className="p-1 text-center">-</td>

                    {/* Current Balance */}
                    <td className="p-1 text-center">
                      {primary.primarY_CURRENT_BALANCE || "-"}
                    </td>
                    <td className="p-1 text-center">-</td>
                  </tr>

                  {/* ================= SECONDARY ================= */}
                  <tr className="font-semibold">
                    <td className="p-1">Secondary Match</td>

                    <td className="p-1 text-center">
                      {secondary.secondarY_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">0</td>

                    <td className="p-1 text-center">
                      {secondary.secondarY_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">
                      {secondary.secondarY_ACTIVE_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">
                      {secondary.secondarY_OVERDUE_NUMBER_OF_ACCOUNTS || 0}
                    </td>

                    <td className="p-1 text-center">
                      {secondary.secondarY_DISBURSED_AMOUNT || "-"}
                    </td>
                    <td className="p-1 text-center">-</td>

                    <td className="p-1 text-center">-</td>
                    <td className="p-1 text-center">-</td>

                    <td className="p-1 text-center">
                      {secondary.secondarY_CURRENT_BALANCE || "-"}
                    </td>
                    <td className="p-1 text-center">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Account Details - Primary"></Section>

          {/* ================= HEADER ADVANCE OVERLAPE REPORT ================= */}
          <div
            style={{
              padding: 6,
              display: "grid",
              gridTemplateColumns: "1fr 2fr 1fr",
              alignItems: "center",
              gap: 30,
              borderBottom: "1px solid #d1d5db",
            }}
          >
            {/* LOGO */}
            <div style={{ width: 150 }}>
              <img
                src={`${window.location.origin}/images/crif.png`}
                alt=""
                style={{ width: "100%" }}
              />
            </div>

            {/* TITLE */}
            <div>
              <h1 className="text-lg font-bold uppercase text-[#083a5dc4]">
                GROUP DETAILS
              </h1>
            </div>

            {/* META INFO */}
            <div
              style={{
                paddingTop: 16,
                paddingBottom: 16,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                minWidth: 260,
                fontSize: 10,
              }}
            >
              <p style={{ fontWeight: 700, margin: 0, marginBottom: -5 }}>
                <span style={{ color: "#083a5dc4" }}>CHM Ref #:</span>{" "}
                {data?.header?.reporT_ID}
              </p>

              <p style={{ fontWeight: 700, margin: 0, marginBottom: -5 }}>
                <span style={{ color: "#083a5dc4" }}>Application ID:</span> -
              </p>

              <p style={{ fontWeight: 700, margin: 0, marginBottom: -5 }}>
                <span style={{ color: "#083a5dc4" }}>Prepared For:</span> JUNOON
                CAPITAL SERVICES PRIVATE LIMITED
              </p>

              <p style={{ fontWeight: 700, margin: 0, marginBottom: -5 }}>
                <span style={{ color: "#083a5dc4" }}>Date of Request:</span>{" "}
                {data?.header?.datE_OF_REQUEST}
              </p>

              <p style={{ fontWeight: 700, margin: 0, marginBottom: -5 }}>
                <span style={{ color: "#083a5dc4" }}>Date of Issue:</span>{" "}
                {data?.header?.datE_OF_ISSUE}
              </p>
            </div>
          </div>
          {/* ================= Summary GT ================= */}

          <Section
            title="Summary"
            note="Tip: Current Balance, Disbursed Amount & Instalment Amount is considered ONLY for ACTIVE account"
            notet="Tip: All amounts are in INR"
          >
            <div>
              <table
                style={{ border: "2px solid #bfdbfe" }}
                className="w-full text-[12px]"
              >
                {/* ================= HEADER ================= */}
                <thead style={{ border: "2px solid #bfdbfe" }}>
                  <tr className="text-[#083a5dc4] font-semibold text-left leading-3.5">
                    <th rowSpan={2} className="px-1 align-middle">
                      Type
                    </th>

                    <th colSpan={2} className="text-center">
                      Association
                    </th>
                    <th colSpan={3} className="text-center">
                      Account Summary
                    </th>
                    <th colSpan={2} className="text-center">
                      Disbursed Amount
                    </th>
                    <th colSpan={2} className="text-center">
                      Installment Amount
                    </th>
                    <th colSpan={2} className="text-center">
                      Current Balance
                    </th>
                  </tr>

                  <tr className="text-center font-semibold">
                    <th>Own</th>
                    <th>Others</th>

                    <th>Total</th>
                    <th>Active</th>
                    <th>Overdue</th>

                    <th>Own</th>
                    <th>Others</th>

                    <th>Own</th>
                    <th>Others</th>

                    <th>Own</th>
                    <th>Others</th>
                  </tr>
                </thead>

                {/* ================= BODY ================= */}
                <tbody>
                  {/* ================= PRIMARY ================= */}
                  <tr>
                    <td className="p-1 font-semibold">Primary Match</td>

                    {/* Association */}
                    <td className="p-1 text-center">
                      {primary.primarY_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">0</td>

                    {/* Account Summary */}
                    <td className="p-1 text-center">
                      {primary.primarY_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">
                      {primary.primarY_ACTIVE_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">
                      {primary.primarY_OVERDUE_NUMBER_OF_ACCOUNTS || 0}
                    </td>

                    {/* Disbursed */}
                    <td className="p-1 text-center">
                      {primary.primarY_DISBURSED_AMOUNT || "-"}
                    </td>
                    <td className="p-1 text-center">-</td>

                    {/* Installment */}
                    <td className="p-1 text-center">-</td>
                    <td className="p-1 text-center">-</td>

                    {/* Current Balance */}
                    <td className="p-1 text-center">
                      {primary.primarY_CURRENT_BALANCE || "-"}
                    </td>
                    <td className="p-1 text-center">-</td>
                  </tr>

                  {/* ================= SECONDARY ================= */}
                  <tr className="font-semibold">
                    <td className="p-1">Secondary Match</td>

                    <td className="p-1 text-center">
                      {secondary.secondarY_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">0</td>

                    <td className="p-1 text-center">
                      {secondary.secondarY_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">
                      {secondary.secondarY_ACTIVE_NUMBER_OF_ACCOUNTS || 0}
                    </td>
                    <td className="p-1 text-center">
                      {secondary.secondarY_OVERDUE_NUMBER_OF_ACCOUNTS || 0}
                    </td>

                    <td className="p-1 text-center">
                      {secondary.secondarY_DISBURSED_AMOUNT || "-"}
                    </td>
                    <td className="p-1 text-center">-</td>

                    <td className="p-1 text-center">-</td>
                    <td className="p-1 text-center">-</td>

                    <td className="p-1 text-center">
                      {secondary.secondarY_CURRENT_BALANCE || "-"}
                    </td>
                    <td className="p-1 text-center">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Account Details - Primary"></Section>

          {/* ================= INQUIRIES ================= */}

          <Section title="Inquiries (reported Last 24 Months)">
            <SimpleTable
              headers={[
                "Credit Grantor",
                "Date of Inquiry",
                "Purpose",
                "Amount",
                "Remark",
              ]}
              rows={historyArray.map((item) => [
                item?.["membeR_NAME"],
                item?.["inquirY_DATE"],
                item?.["purpose"],
                item?.["amount"],
                // `${item?.["amount"]}`,
                item?.["remark"],
              ])}
            />
            <p
              style={{
                textAlign: "center",
                fontSize: 15,
                fontWeight: 700,
                color: "#083a5dc4",
                opacity: 0.8,
              }}
            >
              - END OF INDIVIDUAL REPORT -
            </p>
          </Section>

          {/* ================= Appendix ================= */}
          <Section title="Appendix">
            <SimpleTable
              headers={["Section", "Code", "Description"]}
              rows={[
                [
                  "Account Summary",
                  "Number of Delinquent Accounts",
                  "Indicates number of accounts that the applicant has defaulted on within the last 6 months",
                ],
                [
                  "Account Information – Credit Grantor",
                  "XXXX",
                  "Name of grantor undisclosed as credit grantor is different from inquiring institution",
                ],
                [
                  "Account Information – Account #",
                  "xxxx",
                  "Account Number undisclosed as credit grantor is different from inquiring institution",
                ],
                [
                  "Payment History / Asset Classification",
                  "XXX",
                  "Data not reported by institution",
                ],
                [
                  "Payment History / Asset Classification",
                  "-",
                  "Not applicable",
                ],
                [
                  "Payment History / Asset Classification",
                  "STD",
                  "Account Reported as STANDARD Asset",
                ],
                [
                  "Payment History / Asset Classification",
                  "SUB",
                  "Account Reported as SUB-STANDARD Asset",
                ],
                [
                  "Payment History / Asset Classification",
                  "DBT",
                  "Account Reported as DOUBTFUL Asset",
                ],
                [
                  "Payment History / Asset Classification",
                  "LOS",
                  "Account Reported as LOSS Asset",
                ],
                [
                  "Payment History / Asset Classification",
                  "SMA",
                  "Account Reported as SPECIAL MENTION",
                ],
                [
                  "Account Information – Account #",
                  "CI-Ceased/Membership Terminated",
                  "Credit Institution has Ceased to Operate or Membership Terminated",
                ],
                [
                  "Account Information – Account #",
                  "License Cancelled Entities",
                  "License of the credit institution cancelled by RBI",
                ],
              ]}
            />
          </Section>

          <div className="print-disclaimer px-6 text-[10px] leading-relaxed text-[#9ca3af] font-medium pt-10">
            <p>
              <b>Disclaimer:</b> This document is prepared based on the data
              submitted by member institutions of CRIF High Mark Credit
              Information Services Private Limited (CRIF High Mark) and by using
              the proprietary match logic of CRIF High Mark. No alterations are
              made to the data submitted by member institutions and the same is
              up to date as well as accurate to the best of its knowledge. By
              using data contained in this document, the user acknowledges that
              CRIF High Mark is not responsible for errors/omissions resulting
              from submission of erroneous data from Members to CRIF High Mark.
              This document may not be used or disclosed to others, except with
              the written permission of CRIF High Mark. Any paper copy of this
              document will be considered uncontrolled. If you are not the
              intended recipient, you are not authorized to read, print, retain,
              copy, disseminate, distribute or use this information or any part
              thereof. PERFORM score provided in this document is joint work of
              CRIF SPA (Italy) and CRIF High Mark (India). For any assistance on
              this report, reach out to us at: customerservice@crifhighmark.com
            </p>

            <div className="text-[#9ca3af] text-center text-[10px] flex justify-between font-semibold mt-2">
              <p>© Copyright 2025. All rights reserved</p>
              <p>CRIF High Mark Credit Information Services Pvt. Ltd</p>
              <p>Confidential</p>
            </div>
          </div>

          {/* ================= DOWNLOAD BUTTON ================= */}
          {/* <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-green-600 text-[#ffffff] rounded hover:bg-[#15803d] transition duration-300 ease-in-out text-md font-semibold cursor-pointer mt-5"
          >
            Download Report as PDF
          </button> */}
        </div>
      </div>
    </>
  );
}

//* ================= REUSABLE COMPONENTS ================= */

const Section = ({ title, children, note, notet }) => (
  <div style={{ padding: "0px 12px", marginTop: 10 }}>
    {notet && (
      <span
        style={{
          color: "#9ca3af",
          fontSize: 9,
          display: "block",
          textAlign: "right",
          marginBottom: 5,
        }}
      >
        {notet}
      </span>
    )}
    <h2
      style={{
        color: "#ffffff",
        fontWeight: 700,
        paddingLeft: "6px",
        fontSize: 12,
        backgroundColor: "#08395d",
        opacity: 0.9,
        paddingBottom: "13px",
      }}
    >
      {title}
    </h2>

    {note && (
      <span
        style={{
          color: "#9ca3af",
          fontSize: 9,
          display: "block",
          marginBottom: 12,
          textAlign: "right",
        }}
      >
        {note}
      </span>
    )}
    {children}
  </div>
);

const InfoGrid = ({ data }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "4px",
      paddingLeft: 12,
      paddingRight: 12,
    }}
  >
    {data.map(([k, v], i) => (
      <p
        key={i}
        style={{
          display: "grid",
          gridTemplateColumns: "120px 1fr",
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        <span style={{ color: "#083a5dc4" }}>{k}:</span>
        <span>{v}</span>
      </p>
    ))}
  </div>
);

const SimpleTable = ({ headers, rows, border }) => (
  <table
    style={{
      width: "100%",
      border: border ? "2px solid #bfdbfe" : "none",
      borderCollapse: "collapse",
    }}
  >
    <thead style={{ color: "#083a5dc4", textAlign: "left" }}>
      <tr>
        {headers.map((h, i) => (
          <th key={i} style={{ padding: 6, borderBottom: "1px solid #bfdbfe" }}>
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody style={{ lineHeight: 1 }}>
      {rows.map((r, i) => (
        <tr key={i}>
          {r.map((c, j) => (
            <td
              key={j}
              style={{
                fontSize: 10,
                padding: 2,
                paddingBottom: 6,
                fontWeight: 700,
              }}
            >
              {c}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

const SimpleTable2 = ({ headers, rows, title }) => (
  <div style={{ width: "100%", position: "relative", right: 0 }}>
    <p
      style={{
        color: "#083a5dc4",
        opacity: 0.8,
        fontWeight: 700,
        fontSize: 14,
      }}
    >
      Payment History/Asset Classification:
    </p>
    <table
      style={{
        marginTop: 5,
        width: "100%",
        borderCollapse: "collapse",
        border: "1px solid #d1d5db",
      }}
    >
      <thead style={{ backgroundColor: "#dedbfe", opacity: 0.5 }}>
        <tr>
          {headers.map((h, i) => (
            <th
              key={i}
              style={{
                paddingBottom: 5,
                border: "1px solid #d1d5db",
                fontSize: "10px",
                color: "#000",
                padding: "2px 2px",
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td
                key={j}
                style={{
                  paddingBottom: 5,
                  border: "1px solid #d1d5db",
                  fontSize: "10px",
                  padding: "2px 2px",
                  fontWeight: 700,
                }}
              >
                {c || "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AccountBlock = ({ id, title, data }) => (
  <div style={{ marginBottom: 16 }}>
    {/* <div
      style={{
        backgroundColor: "#eff6ff",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginTop: 10
      }}
    >
      <span
        style={{
          backgroundColor: "#083a5dc4",
          color: "#ffffff",
          fontSize: 10,
          height: 25,
          width: 25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // paddingTop: "1px",
        }}
      >
        {id}
      </span>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          flexWrap: "wrap",
          gap: 12,
          fontSize: "10px"
        }}
      >
        <p style={{ margin: 0 }}>
          <span style={{ color: "#083a5dc4", fontWeight: 700 }}>
            Account Type:
          </span>{" "}
          <span
            style={{
              color: "#b91c1c",
              textTransform: "uppercase",
              fontWeight: 700,
              fontSize: 10,
            }}
          >
            {title.AccountType}
          </span>
        </p>
        <p style={{ margin: 0 }}>
          <span style={{ color: "#083a5dc4", fontWeight: 700 }}>
            Credit Grantor:
          </span>{" "}
          {title.CreditGrantor}
        </p>
        <p style={{ margin: 0 }}>
          <span style={{ color: "#083a5dc4", fontWeight: 700 }}>Account #:</span>{" "}
          {title.Account}
        </p>
        <p style={{ margin: 0 }}>
          <span style={{ color: "#083a5dc4", fontWeight: 700 }}>
            Info. as of:
          </span>{" "}
          {title.Info}
        </p>
      </div>
    </div> */}

    <div
      style={{
        backgroundColor: "#eff6ff",
        fontWeight: 600,
        marginTop: 10,
        // padding: "6px 10px",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 10,
        }}
      >
        <tbody>
          <tr>
            {/* ID */}
            <td
              style={{
                width: 30,
                verticalAlign: "middle",
                textAlign: "center", // horizontal safety
              }}
            >
              <div
                style={{
                  backgroundColor: "#083a5dc4",
                  color: "#ffffff",
                  width: 20,
                  height: 20,
                  margin: "auto", // 👈 PRINT SAFE CENTER
                  textAlign: "center",
                  lineHeight: "25px",
                  fontSize: 8,
                  fontWeight: 700,
                }}
              >
                <span style={{ position: "relative", bottom: "5px" }}>
                  {id}
                </span>
              </div>
            </td>

            {/* Account Type */}
            <td style={{ position: "relative", bottom: 5 }}>
              <span style={{ color: "#083a5dc4", fontWeight: 700 }}>
                Account Type:
              </span>{" "}
              <span
                style={{
                  color: "#b91c1c",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {title.AccountType}
              </span>
            </td>

            {/* Credit Grantor */}
            <td style={{ position: "relative", bottom: 5 }}>
              <span style={{ color: "#083a5dc4", fontWeight: 700 }}>
                Credit Grantor:
              </span>{" "}
              {title.CreditGrantor}
            </td>

            {/* Account # */}
            <td style={{ position: "relative", bottom: 5 }}>
              <span style={{ color: "#083a5dc4", fontWeight: 700 }}>
                Account #:
              </span>{" "}
              {title.Account}
            </td>

            {/* Info */}
            <td style={{ position: "relative", bottom: 5 }}>
              <span style={{ color: "#083a5dc4", fontWeight: 700 }}>
                Info. as of:
              </span>{" "}
              {title.Info}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style={{ position: "relative", paddingLeft: 18 }}>
      <div
        style={{
          transform: "rotate(90deg)",
          padding: "0px 5px",
          fontWeight: 600,
          fontSize: 16,
          position: "absolute",
          top: 28,
          left: -30,
          paddingLeft: 8,
          paddingRight: 8,
          paddingTop: 2,
          backgroundColor: title?.Status == "Closed" ? "#fecaca" : "#E1F0BE",
          color: title?.Status == "Closed" ? "#dc2626" : "inherit",
        }}
      >
        <p style={{ position: "relative", bottom: 10, margin: 0 }}>
          {title?.Status == "Closed" ? "CLOSED" : "ACTIVE"}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          marginTop: 8,
          padding: "12px 20px",
          fontSize: 10,
        }}
      >
        {data.map(([k, v], i) => (
          <p
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              fontWeight: 700,
              margin: 0,
            }}
          >
            <span style={{ color: "#083a5dc4", fontWeight: 700 }}>{k}:</span>
            <span style={{ fontWeight: 700, textTransform: "uppercase" }}>
              {v}
            </span>
          </p>
        ))}
      </div>
    </div>
  </div>
);

export default CRIFReportData;
