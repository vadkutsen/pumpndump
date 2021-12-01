import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PumpForm from './components/PumpForm';
import Bids from './components/Bids';
import LineChart from './components/LineChart';
import Loader from './components/Loader';
import SignIn from './components/SignIn';
import Notification from './components/Notification';

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  const [price, setPrice] = useState()
  const [amount, setAmount] = useState()
  const [bids, setBids] = useState([])
  const [balance, setBalance] = useState()
  const [showNotification, setShowNotification] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    getPrice()
    getBids()
    getBalance()
  }, [])

  const getBalance = () => {
    setBalance(currentUser ? (currentUser.balance/1000000000000000000000000).toFixed(4) : 0)
  }

  const fieldChanged = (value) => {
    setAmount(value)
  }

  const getPrice = () => {
    contract.get_price().then(price => {
      setPrice(price)})
  }

  const getBids = () => {
    contract.get_bids().then(bids => {
      setBids(bids)
    })
  }

  const buy = (e) => {
    e.preventDefault();
    setShowLoader(true)
    contract.buy({
            amount: amount
          })
    .then((response) => {
      setShowLoader(false)
      getPrice()
      getBids()
      getBalance()
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

  const sell = (e) => {
    e.preventDefault();
    setShowLoader(true)
    contract.sell({
            amount: amount
          })
    .then((response) => {
      setShowLoader(false)
      getPrice()
      getBids()
      getBalance()
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
            <h3 className="logo">Pump'n'Dump</h3>
            <div className="account">
              <div>Hi <span>{currentUser.accountId}!</span> Balance: <span>{(currentUser.balance/1000000000000000000000000).toFixed(4)} NEAR</span></div>
            </div>
            <button className="signout" onClick={signOut}>Log out</button>
          </header>
          <h1 style={{ textAlign: 'center' }}>Pump'n'Dump simulator</h1>
          <p style={{ textAlign: 'center' }}>Pump or dump the price like a whale</p>
            <div>
              <div>
                <div className="stats">
                  <div>Current Price: {(price/1000000000000000000000000000).toFixed(4)}</div>
                </div>
              </div>
              <div className="charts">
                <div style={{ flex: 1, paddingRight: '20px' }}>
                  <Bids bids={bids} />
                </div>
                <div style={{ flex: 2, paddingRight: '20px'}}>
                  <LineChart bids={bids} />
                </div>
              </div>
            </div>
            <div>
              <div className="charts">
                <div style={{ flex: 1 }}>
                  <PumpForm balance={balance} fieldChanged={fieldChanged} buy={buy} sell={sell} />
                </div>
              </div>
            </div>
        </div>
      :
        <div>
          <header>
            <h1 className="logo">Pump'n'Dump</h1>
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
    get_price: PropTypes.func.isRequired,
    // get_candidates: PropTypes.func.isRequired,
    // add_candidate: PropTypes.func.isRequired,
    // vote: PropTypes.func.isRequired,
    // get_winner: PropTypes.func.isRequired
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
