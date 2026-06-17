import React, { useEffect, useState } from "react";
import "./WelcomeSplash.css";

const WelcomeSplash = () => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("disdel_splash");

    if (!hasSeen) {
      setVisible(true);

      const closeTimer = setTimeout(() => {
        setClosing(true);
      }, 850);

      const removeTimer = setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem("disdel_splash", "true");
      }, 1200);

      return () => {
        clearTimeout(closeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  if (!visible) return null;

  return (
    <div className={`splash-overlay ${closing ? "closing" : ""}`}>
      <div className="splash-content">

        <img 
            src={`${process.env.PUBLIC_URL}/logo-disdel.png`} 
            alt="Disdel" 
            className="splash-logo" 
        />

        <div className="splash-line"></div>

        <p className="splash-text">
          Así de limpio
        </p>

      </div>

      <div className={`screen-wipe ${closing ? "active" : ""}`}></div>
    </div>
  );
};

export default WelcomeSplash;