import React from 'react';

export default function CandidateCard({ show, close }) {
    return (
    <>
     {
     show ?
     <div
        className="modalContainer"
        onClick={() => close()}
      >
        <div className="modal" >
          <header className="modal_header">
            <h2 className="modal_header-title"> Loans </h2>
            <button className="close" onClick={close}>
              x
            </button>
          </header>
          <main className="modal_content">
            <form>
              <fieldset id="fieldset" style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}} >
                <span style={{width: '80%', background: 'rgb(66, 65, 65)', marginLeft: '10px', marginRight: '10px'}} className="highlight">
                  <label htmlFor="amount">Amount:</label>
                  <input
                    autoComplete="off"
                    id="amount"
                    min="1"
                    step="1"
                    type="number"
                    onChange={e => fieldChanged(e.target.value)}
                  />
                </span>
              </fieldset>
            </form>
          </main>
          <footer className="modal_footer">
          <button className="submit">Borrow</button>
            {/* {!voted ? <button className="submit" onClick={vote}>Vote</button> : <span></span>} */}
          </footer>
        </div>
      </div>
      : null
     }
    </>
    )
}