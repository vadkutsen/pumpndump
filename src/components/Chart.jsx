import React from 'react';
import {Doughnut} from 'react-chartjs-2';

export default function Chart({ candidates }) {
    const state = {
        labels: candidates.map(candidate => {
            return candidate[1]
          }),
        datasets: [
          {
            label: 'Votes',
            borderColor:  'rgb(66, 65, 65)',
            backgroundColor: [
              '#B21F00',
              '#C9DE00',
              '#2FDE00',
              '#00A6B4',
              '#6800B4'
            ],
            hoverBackgroundColor: [
            '#501800',
            '#4B5000',
            '#175000',
            '#003350',
            '#35014F'
            ],
            data: candidates.map(candidate => {
                return candidate[2]})
          }
        ]
      }
    return (
        <div>
            <Doughnut
            data={state}
            options={{
                title:{
                display:false,
                text:'Persentage',
                fontSize:20
                },
                plugins:{
                  legend:{
                    display:false,
                    position:'bottom'
                    }
                }
            }}
            />
        </div>
    )
}