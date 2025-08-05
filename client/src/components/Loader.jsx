import React from "react";

function Loader() {
  return (
    // Full-width overlay loader centered on the screen
    <div className='loader-container w-full absolute flex justify-center top-0 left-0'>
        {/* Optional: Replace with image loader if desired */}
        <span className="loader"></span>
    </div>
  );
}

export default Loader;