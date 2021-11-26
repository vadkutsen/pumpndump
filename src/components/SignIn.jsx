import React from 'react';
// import banner from '../assets/big-spaceman.png';
import banner from '../assets/beard.svg';

export default function SignIn() {
  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Nearvember challenge 6.</h1>
      <h2 style={{ textAlign: 'center' }}>Welcome to Beard Token</h2>
      <div className="image-container">
        <img src={banner} style={{width: '40%' }} alt="Near to the moon" />
      </div>
    </>
  );
}
