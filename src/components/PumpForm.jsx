import React from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';

export default function PumpForm({ balance, buy, sell, fieldChanged }) {
  return (
    <>
    {/* <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}> */}
    <form>
      <fieldset id="fieldset" style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}} >
          <button style={{backgroundColor: 'green'}} onClick={buy}>
            Buy
          </button>
        <span style={{width: '30%', background: 'rgb(66, 65, 65)'}} className="highlight">
          <label htmlFor="amount">Amount:</label>
          <input
            autoComplete="off"
            id="amount"
            max={balance}
            min="1"
            step="1"
            type="number"
            onChange={e => fieldChanged(e.target.value)}
          />
        </span>
        <button style={{backgroundColor: 'red'}} onClick={sell}>
            Sell
          </button>
      </fieldset>
    </form>
    {/* </div> */}
    </>
  );
}

// AddCandidateForm.propTypes = {
//   addCandidate: PropTypes.func.isRequired,
//   getCandidate: PropTypes.func.isRequired,
//   currentUser: PropTypes.shape({
//     accountId: PropTypes.string.isRequired,
//     balance: PropTypes.string.isRequired,
//   }),
//   candidates: PropTypes.array,
// };
