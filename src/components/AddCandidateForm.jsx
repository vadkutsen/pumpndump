import React from 'react';
import PropTypes from 'prop-types';

export default function AddCandidateForm({ addCandidate, candidates, getCandidate }) {
  return (
    <>
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <h2>It's time to vote!</h2>
      <h5>Click on a candidate to vote or add your own candidate</h5>
      {candidates.length > 0 ?
      <div style={{ overflowY: 'scroll', maxHeight: '300px', width: '50%', textAlign: 'center'}}>
        {candidates.map((candidate, i) =>
          <div key={i} className="card" onClick={() => getCandidate(candidate[1])}>
            <p style={{ marginLeft: '20px', marginRight: '20px' }}>
              <strong>{candidate[1]}</strong>{' '}
            </p>
          </div>
        )}
      </div>
    :
      <div>
        <p>No candidates yet. Add your favorite ones.</p>
      </div>
    }
    <form onSubmit={addCandidate}>
        <fieldset id="fieldset">
          <p>Add Candidate</p>
          <p className="highlight">
            <label htmlFor="candidate">Candidate:</label>
            <input
              autoComplete="off"
              autoFocus
              id="candidate"
              required
            />
            <button type="submit">
              Add
            </button>
          </p>
        </fieldset>
    </form>
    </div>
    </>
  );
}

AddCandidateForm.propTypes = {
  addCandidate: PropTypes.func.isRequired,
  getCandidate: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
  }),
  candidates: PropTypes.array,
};
