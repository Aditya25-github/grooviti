import React, { useState } from "react";
import axios from "axios";
import { Scanner } from "@yudiel/react-qr-scanner";

const MarkAttendance = ({ url }) => {
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");
  const [scanning, setScanning] = useState(true);
const [scanned, setScanned] = useState(false);

const handleScan = async (result) => {
  if (scanned) return;

  const scannedValue =
    result?.[0]?.rawValue ||
    result?.text ||
    result?.rawValue;

  if (scannedValue) {
    console.log("Scanned QR:", scannedValue);

    setScanned(true);

    await markAttendance(scannedValue);

    setTimeout(() => {
      setScanned(false);
    }, 3000);
  }
};

  // ❌ Handle errors
  const handleError = (err) => {
    console.log("QR Error:", err);
  };

  // 🔥 API CALL
  const markAttendance = async (id) => {
    try {
      const res = await axios.post(`${url}/api/organizer/mark-attendance`, {
        orderId: id,
      });

      setMessage(res.data.message);
    } catch (err) {
      console.log(err);
      setMessage("❌ Error marking attendance");
    }
  };

  // 🔹 Manual Submit
  const handleManualSubmit = async () => {
    if (!orderId) return;
    await markAttendance(orderId);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>🎟 Mark Attendance</h2>

      {/* 🔳 QR SCANNER */}
      {scanning && (
        <div style={{ maxWidth: "400px", margin: "auto" }}>
          {!scanned && <Scanner onScan={handleScan} onError={handleError} />}
        </div>
      )}

      {/* 🔁 Restart Scan */}
      {!scanning && (
        <button onClick={() => setScanning(true)}>Scan Again</button>
      )}

      <hr />

      {/* ✍️ MANUAL INPUT */}
      <h3>Enter Order ID</h3>
      <input
        type="text"
        placeholder="Enter Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        style={{ padding: "10px", width: "250px" }}
      />

      <br />
      <br />

      <button onClick={handleManualSubmit}>Mark Attendance</button>

      <br />
      <br />

      {/* 📢 RESULT */}
      {message && <h3>{message}</h3>}
    </div>
  );
};

export default MarkAttendance;
