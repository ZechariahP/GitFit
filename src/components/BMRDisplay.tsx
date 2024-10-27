import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateBMR } from '../redux/reducers/bmrReducer';

interface BMRDisplayProps {
  bmr: number;
}

const BMRDisplay: React.FC<BMRDisplayProps> = () => {
  const [localBmr, setLocalBmr] = useState<number>(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const bmrData = localStorage.getItem('bmr');
    if (bmrData) {
      const parsedBmr = parseFloat(bmrData);
      setLocalBmr(parsedBmr);
      dispatch(updateBMR(parsedBmr));
    }
  }, [dispatch]);

  return (
    <div>
      {localBmr !== null ? <p>BMR: {localBmr}</p> : <p>Loading BMR...</p>}
    </div>
  );
};

export default BMRDisplay;