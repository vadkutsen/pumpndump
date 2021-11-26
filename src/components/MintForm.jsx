import React from 'react';
import PropTypes from 'prop-types';

export default function MintForm({ onMintSubmit }) {
  return (
    <form onSubmit={onMintSubmit}>
        <fieldset id="fieldset">
          <p>Mint</p>
          <p className="highlight">
            <label htmlFor="amount">Amount:</label>
            <input
              autoComplete="off"
              defaultValue={'1000'}
              id="amount"
              max={1000}
              min="0"
              step="1"
              type="number"
            />
            <label htmlFor="amount">BRD</label>
          </p>
          <button type="submit">
            Mint
          </button>
        </fieldset>
    </form>
  );
}

MintForm.propTypes = {
  onMintSubmit: PropTypes.func.isRequired,
};
