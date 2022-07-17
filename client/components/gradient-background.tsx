import React from "react";

export const GradientBackground: React.FC = () => {
  return (
    <>
      <div
        style={{
          top: "-70px",
          left: "-70px",
          position: "fixed",
          animation: "rotation 1s infinite linear",
          transform: "rotate(200deg)",
          borderRadius: "50%",
          width: "550px",
          height: "550px",
          opacity:  0.2,
          filter: "blur(70px)",
        }}
      >
        <img src="/background-blur.png"></img>
      </div>


      <div
        style={{
          top: "-180px",
          left: "250px",
          position: "fixed",
          zIndex: 1,
          borderRadius: "50%",
          width: "500px",
          opacity: 0.2,
          height: "500px",
          filter:  "blur(70px)",
          animation: "rotation 1s infinite linear",
        }}
      >
        <img src="/background-blur.png"></img>
      </div>

      <div
        style={{
          top: "500px",
          right: "-150px",
          position: "fixed",
          transform: "rotate(-80deg)",
          borderRadius: "50%",
          width: "600px",
          opacity: 0.2,
          height: "600px",
          filter: "blur(150px)",
        }}
      >
        <img
          style={{
            
          }}
          src="/background-blur.png"
        ></img>
      </div>
      <div
        style={{
          bottom: "-390px",
          right: "250px",
          position: "fixed",
          transform: "rotate(-80deg)",
          borderRadius: "50%",
          width: "800px",
          opacity: 0.2,
          height: "700px",
          filter: "blur(150px)",
        }}
      >
        <img
          style={{
            
          }}
          src="/background-blur.png"
        ></img>
      </div>

      <div
        style={{
          bottom: "-500px",
          left: "0px",
          position: "fixed",
          transform: "rotate(-80deg)",
          borderRadius: "50%",
          width: "600px",
          opacity: 0.2,
          height: "600px",
          filter: "blur(150px)",
        }}
      >
        <img
          style={{
            
          }}
          src="/background-blur.png"
        ></img>
      </div>
    </>
  );
};
