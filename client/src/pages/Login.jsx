import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate(); 

  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("MetaMask not detected!");
    }
  };

  return (
    <div style={styles.page}>

      {/* NAVBAR */}
      <div style={styles.topBar}>
        <div style={styles.btnWrapper}>
          <button style={styles.connectBtn} onClick={connectToMetaMask}>
            {account ? "Connected" : "Connect MetaMask"}
          </button>
        </div>
      </div>

      {/* BACKGROUND GLOW */}
      <div style={styles.bgGlow}></div>

      {/* MAIN CONTENT */}
      <div style={styles.mainContent}>
        <h1 style={styles.title}>OBSIDIAN CYBER TRIAGE SYSTEM</h1>

        <p style={styles.subtitle}>
          A next-generation decentralized cyber forensics platform with blockchain identity,
          intelligent threat analysis, and encrypted evidence storage powered by IPFS.
        </p>

        <button
  style={styles.enterBtn}
  onClick={() => navigate("/dashboard")}
>
  Enter Dashboard
</button>

      </div>

      {/* SCAN LINE */}
      <div style={styles.bottomLine}></div>
    </div>
  );
}

const styles = {
  page: {
    width: "100%",
    height: "100vh",
    background: "radial-gradient(circle at top, #021d1d, #000 60%)",
    color: "#00f7c2",
    fontFamily: "Orbitron, Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
  },

  /* TOP BAR */
  topBar: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    position: "absolute",
    top: 0,
    left: 0,
    padding: "30px 40px",
    zIndex: 20,
  },

  /* WRAPPER THAT CONTROLS POSITION */
  btnWrapper: {
    position: "relative",
    right: "60px",     // ← CHANGE THIS NUMBER TO MOVE THE BUTTON LEFT/RIGHT
    top: "5px",        // adjust vertical position if needed
  },

  /* CONNECT BUTTON */
  connectBtn: {
    padding: "12px 28px",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    color: "#000",
    background: "#00f7c2",
    boxShadow: "0 0 20px #00f7c2",
    transition: "0.3s",
  },

  /* BACKGROUND GLOW */
  bgGlow: {
    width: "800px",
    height: "800px",
    background: "rgba(0, 255, 180, 0.15)",
    filter: "blur(140px)",
    position: "absolute",
    top: "-200px",
    left: "50%",
    transform: "translateX(-50%)",
  },

  /* MAIN CONTENT */
  mainContent: {
    textAlign: "center",
    marginTop: "200px",
    padding: "20px",
    position: "relative",
    zIndex: 10,
  },

  title: {
    fontSize: "55px",
    letterSpacing: "3px",
    textShadow: "0 0 25px #00f7c2",
    fontWeight: "900",
  },

  subtitle: {
    marginTop: "25px",
    fontSize: "20px",
    maxWidth: "760px",
    marginLeft: "auto",
    marginRight: "auto",
    lineHeight: "1.7",
    color: "#b8fff0",
  },

  enterBtn: {
    marginTop: "50px",
    padding: "14px 32px",
    borderRadius: "14px",
    background: "transparent",
    border: "2px solid #00f7c2",
    color: "#00f7c2",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "17px",
    boxShadow: "0 0 18px #00f7c2",
    transition: "0.3s",
  },

  bottomLine: {
    width: "100%",
    height: "6px",
    background:
      "linear-gradient(to right, transparent, #00f7c2, transparent)",
    position: "absolute",
    bottom: "120px",
  },
};
