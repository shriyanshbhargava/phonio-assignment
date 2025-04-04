// "use client";

// import { useState } from "react";

// export default function RebuildButton({ initialBuildTime }) {
  
//   const [message, setMessage] = useState("Page built at");
//   const [buildTime, setBuildTime] = useState(initialBuildTime);

//   const handleRebuild = async () => {
//     const response = await fetch("/api/revalidate", { method: "GET" });
//     const data = await response.json();
//     console.log(`[Client] ${data.message}: ${data.buildTime}`);
//     setMessage(data.message);
//     setBuildTime(data.buildTime);
//   };

//   return (
//     <>
//       <span>{`${message}: ${buildTime}`}</span>
//       <button onClick={handleRebuild}>Rebuild Page</button>
//     </>
//   );
// }