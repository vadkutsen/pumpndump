import React from 'react';

export default function CandidateCard({ show, candidate, vote, voted, close }) {
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
            <h2 className="modal_header-title"> {candidate} </h2>
            <button className="close" onClick={close}>
              x
            </button>
          </header>
          <main className="modal_content">
          Blockchain ninja passionate about creativity and innovations.
          </main>
          <footer className="modal_footer">
            {!voted ? <button className="submit" onClick={vote}>Vote</button> : <span></span>}
          </footer>
        </div>
      </div>
      : null
     }
    </>
    )
}