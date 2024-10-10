import React, { useEffect, useState } from 'react';

const BMRDisplay: React.FC = () => {
  const [bmr, setBmr] = useState<string | null>(null);

  useEffect(() => {
    const bmrData = localStorage.getItem('bmr');
    if (bmrData) {
      setBmr(bmrData);
    }
  }, []);

  return (
    <div>
      {bmr ? <p>BMR: {bmr}</p> : <p>Loading BMR...</p>}
    </div>
  );
};

export default BMRDisplay;