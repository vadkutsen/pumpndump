import React from 'react'

export default function Loader () {
    return (
    <div style={{display: 'flex', justifyContent: 'center', paddingTop: '2rem'}}>
        <div className="loader center">
            <i className="fa fa-cog fa-spin" />
            {' '}
            <span>Processing...</span>
        </div>
    </div>
    )
}