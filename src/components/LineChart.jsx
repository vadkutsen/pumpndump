import React from 'react';
import {Line} from 'react-chartjs-2';
import moment from 'moment';

export default function LineChart({ bids }) {
  const state = {
    // labels: bids.map(bid => {
    //   return candidate[1]
    // }),
    datasets: [
      {
        label: 'votes',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor:  'rgb(66, 65, 65)',
        borderWidth: 2,
        // color: '#666',
        // data: candidates.map(candidate => {
        //   return candidate[2]})
      }
    ]
  }

  const data = bids.map((bid) => [moment(bid[0]/1000).format('hh:mm:ss'), (bid[2]/1000000000000000000000000000).toFixed(4)])
  const labels = data.map(x => x[0])
    return (
          <Line
            options = {{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: false,
                  text: 'Chart.js Line Chart',
                },
              },
            }}
            data = {{
              labels,
              datasets: [
                {
                  label: 'Token price',
                  data: data,
                  borderColor: 'rgb(255, 99, 132)',
                  backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }
              ],
            }}
          />
    )
}