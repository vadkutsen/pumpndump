import React from 'react';
import PropTypes from 'prop-types';

export default function Candidates({ candidates, getCandidate }) {
  const votes = candidates.map(candidate => {
    return parseInt(candidate[2])
  })
  const sum = votes.reduce((partial_sum, a) => partial_sum + a, 0)
  return (
    <>
    {candidates.length > 0 ?
      <div style={{ overflowY: 'scroll', maxHeight: '300px' }}>
        {candidates.map((candidate, i) =>
          <div key={i} className="card">
            <p style={{ marginLeft: '20px', marginRight: '20px' }} onClick={() => getCandidate(candidate[1])}>
              <strong>{candidate[1]}</strong>{' '}
              <span>{' '}{parseInt(candidate[2]) > 0 ? (candidate[2]*100/sum).toFixed(1) : 0}%</span>
            </p>
          </div>
        )}
      </div>
    :
      <div>
        <p>No candidates yet. Add your favorite ones.</p>
      </div>
    }
    </>
  )
}

Candidates.propTypes = {
  candidates: PropTypes.array,
};
