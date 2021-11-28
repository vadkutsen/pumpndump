import React from 'react';
import banner from '../assets/vote.jpeg';

export default function SignIn() {
  return (
    <>
      <div style={{paddingTop: '20px'}} className="image-container">
        <img src={banner} style={{width: '100%'}} alt="Vote" />
      </div>
    </>
  );
}
