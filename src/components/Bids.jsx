import React from 'react';
import Moment from 'react-moment';

export default function Bids({ bids }) {
  return (
    <>
    {bids.length > 0 ?
      <div style={{ overflowY: 'scroll', maxHeight: '18rem' }}>
        {bids.map((bid, i) =>
          <div key={i} className="card">
            <p style={{ marginLeft: '30px', marginRight: '30px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{(bid[2]/1000000000000000000000000000).toFixed(4)}</span>
              <span style={bid[1] === "Buy" ? { color: 'green' } : { color: 'red' }}>{bid[1]}</span>{' '}
              <span><Moment format="HH:MM:ss">{bid[0]/1000000}</Moment></span>{' '}
            </p>
          </div>
        )}
      </div>
    :
      <div>
        <p>No bids yet. Make your trade now!</p>
      </div>
    }
    </>
  )
}
