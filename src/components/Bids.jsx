import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

export default function Bids({ bids }) {
  return (
    <>
      {bids.length > 0 ?
      <div style={{ overflowY: 'scroll', maxHeight: '18rem' }}>
        {bids.map((bid, i) =>
          <div key={i} className="card">
            <p style={{ marginLeft: '20px', marginRight: '20px' }}>
              <span><Moment format="HH:MM:SS">{bid[0]/1000}</Moment></span>{' '}
              <span style={bid[1] === "Buy" ? { color: 'green' } : { color: 'red' }}>{bid[1]}</span>{' '}
              <span>{(bid[2]/1000000000000000000000000000).toFixed(4)}</span>
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

// Candidates.propTypes = {
//   candidates: PropTypes.array,
// };
