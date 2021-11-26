import React from 'react';
import PropTypes from 'prop-types';

export default function RegisterReceiverForm({ registerReceiver }) {
  return (
    <form onSubmit={registerReceiver}>
      <fieldset id="fieldset">
        <span className="highlight">
          <label htmlFor="receiver">Receiver account:</label>
          <input
            autoComplete="off"
            autoFocus
            id="receiver"
            required
          />
          <button type="submit">Register</button>
        </span>
      </fieldset>
    </form>
  );
}

RegisterReceiverForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
