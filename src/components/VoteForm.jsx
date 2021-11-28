import React from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';

export default function VoteForm({ vote }) {
  return (
    <form onSubmit={vote}>
        <fieldset id="fieldset">
        <p>Vote</p>
          <p className="highlight">
            <label htmlFor="candidate">Candidate:</label>
            <input
              autoComplete="off"
              autoFocus
              id="candidate"
              required
            />
          </p>
          <button type="submit">
            Vote
          </button>
        </fieldset>
    </form>
  );
}

VoteForm.propTypes = {
  vote: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
  })
};
