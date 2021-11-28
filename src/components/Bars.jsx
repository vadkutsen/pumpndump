import React from 'react';
import {Bar} from 'react-chartjs-2';

export default function Chart({ candidates }) {
  const state = {
    labels: candidates.map(candidate => {
      return candidate[1]
    }),
    datasets: [
      {
        label: 'votes',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor:  'rgb(66, 65, 65)',
        borderWidth: 2,
        // color: '#666',
        data: candidates.map(candidate => {
          return candidate[2]})
      }
    ]
  }
    return (
        <div>
            <Bar
              data={state}
              options={{
                title:{
                  display:true,
                  text:'Votes',
                  fontSize:20
                },
                plugins: {
                  legend:{
                    display:true,
                    position:'top'
                  }
                }
              }}
            />
        </div>
    )
}