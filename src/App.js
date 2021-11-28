import 'regenerator-runtime/runtime';
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import AddCandidateForm from './components/AddCandidateForm';
import Candidates from './components/Candidates';
import CandidateCard from './components/CandidateCard';
import Chart from './components/Chart';
import Bars from './components/Bars';
import Loader from './components/Loader';
import SignIn from './components/SignIn';
import Notification from './components/Notification';

const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  const [question, setQuestion] = useState()
  const [candidates, setCandidates] = useState([])
  const [votes, setVotes] = useState(0)
  const [voted, setVoted] = useState()
  const [winner, setWinner] = useState([])
  const [candidate, setCandidate] = useState()
  const [num, setNum] = useState(59)
  const [showNotification, setShowNotification] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [modal, setModal] = useState(false)

  const { networkId } = nearConfig

  let intervalRef = useRef();
  const decreaseNum = () => setNum((prev) => prev - 1);

  useEffect(() => {
    getQuestion()
    getVote()
    getCandidates()
    getWinner()
    setVotes(calculateVotes(candidates))
    intervalRef.current = setInterval(decreaseNum, 1000);
    return () => clearInterval(intervalRef.current);
  }, [voted])

  const getQuestion = () => {
    contract.get_question().then(question => {setQuestion(question)})
  }

  const getVote = () => {
    if (currentUser) {
      contract.get_vote({
        account_id: currentUser.accountId
      }).then(voted =>
        voted === 'It\'s time to vote!' ? setVoted(false) : setVoted(true),
      )
    } else {
      setVoted(true)
    }
  }

  const addCandidate = (e) => {
    e.preventDefault();
    const { fieldset, candidate } = e.target.elements;
    fieldset.disabled = true;
    setShowLoader(true)
    contract.add_candidate(
      {
        candidate: candidate.value,
      },
      BOATLOAD_OF_GAS,
    ).then((response) => {
      setShowLoader(false)
      candidate.value = ''
      fieldset.disabled = false
      getCandidates()
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false)
      }, 11000)
    }).catch((e) => {
      alert(
        'Something went wrong! ' +
        'Maybe you need to sign out and back in? ' +
        'Check your browser console for more info.'
      )
    })
  }

  const getCandidates = () => {
    contract.get_candidates().then(candidates => {
      setCandidates(candidates)
      setVotes(calculateVotes(candidates))
    })
  }

  const getCandidate = (candidate) => {
      setCandidate(candidate)
      toggleModal()
  }

  const calculateVotes = (candidates) => {
    const voted = candidates.map(candidate => {
      return parseInt(candidate[2])
    })
      const sum = voted.reduce((partial_sum, a) => partial_sum + a, 0)
      return sum
  }

  const vote = () => {
    setShowLoader(true)
    contract.vote(
      {
        candidate: candidate
      },
      BOATLOAD_OF_GAS,
    ).then(() => {
      setShowLoader(false)
      setVoted(true)
      toggleModal()
      setCandidate()
      getCandidates()
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false)
      }, 11000)
    }).catch((e) => {
      alert(
        'Something went wrong! ' +
        'Maybe you need to sign out and back in? ' +
        'Check your browser console for more info.'
      )
    })
  }

  const getWinner = () => {
    contract.get_winner().then(winner => {
      setWinner(winner)
    })
  }

  const toggleModal = () => {
    setModal(!modal)
  }

  const signIn = () => {
    wallet.requestSignIn(
      nearConfig.contractName,
      'Near voting'
    )
  }

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname)
  }

  return (
    <main>
      {currentUser ?
        <div>
          <header>
            <h3 className="logo">Near Voting</h3>
            <div className="account">
              <div>Hi <span>{currentUser.accountId}!</span> Balance: <span>{(currentUser.balance/1000000000000000000000000).toFixed(4)} NEAR</span></div>
            </div>
            <button className="signout" onClick={signOut}>Log out</button>
          </header>
          <h1 style={{ textAlign: 'center' }}>{question}</h1>
          {voted ?
            <div>
              <div>
                <div className="stats">
                <div>
                  Time remaining: {num > 0 ? <span><strong>00:00:{num}</strong></span> : <span>Time's up! I'm kidding :)</span>}</div>
                  <div> Candidates: <strong>{candidates.length}</strong></div>
                  <div> Votes: <strong>{votes}</strong></div>
                  <div> Leader: <strong className="leader">{winner[0]}</strong>,{' '}<strong> {winner[1]} votes</strong></div>
                </div>
              </div>
              <div className="charts">
                <div style={{ flex: 1, paddingRight: '20px' }}>
                <h5>Leaderboard</h5>
                <Candidates candidates={candidates} getCandidate={getCandidate} />
                <CandidateCard show={modal} candidate={candidate} vote={vote} close={toggleModal} voted={voted}/>
                </div>
                <div style={{ flex: 2, paddingRight: '20px'}}>
                  <h5>Bar</h5>
                  <Bars candidates={candidates} />
                </div>
                <div>
                  <h5>Doughnut</h5>
                  <Chart candidates={candidates} />
                </div>
              </div>
            </div>
          :
            <div>
              <div className="charts">
                <div style={{ flex: 1 }}>
                  <AddCandidateForm addCandidate={addCandidate} candidates={candidates} getCandidate={getCandidate} />
                  <CandidateCard show={modal} candidate={candidate} vote={vote} close={toggleModal} />
                </div>
              </div>
            </div>
          }
        </div>
      :
        <div>
          <header>
            <h1 className="logo">Nearvember community voting platform</h1>
            <button className="signin" onClick={signIn}>Log In</button>
          </header>
          <SignIn />
        </div>
      }
      {showNotification && <Notification />}
      {showLoader && <Loader />}
    </main>
  );
};

App.propTypes = {
  contract: PropTypes.shape({
    get_question: PropTypes.func.isRequired,
    get_candidates: PropTypes.func.isRequired,
    add_candidate: PropTypes.func.isRequired,
    vote: PropTypes.func.isRequired,
    get_winner: PropTypes.func.isRequired
  }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
  }),
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
  }).isRequired
};

export default App;
