import React from 'react';

export interface BMRDisplayProps {
  bmr: number;
}

const BMRDisplay: React.FC<BMRDisplayProps> = ({ bmr }) => {
  return (
    <div>
      {bmr !== null ? <p>BMR: {bmr}</p> : <p>Loading BMR...</p>}
    </div>
  );
};

export default BMRDisplay;