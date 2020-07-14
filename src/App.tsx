import React, { PureComponent } from 'react';
import moment from 'moment';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter
} from 'recharts';
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';

import USdata from './data/us.json';
import Statedata from './data/states.json';
// console.log(USdata);

//@ts-ignore
// const data:any = Statedata['TX'];


//@ts-ignore
// const data:any = Statedata['CT'];
const data:any = USdata;

function App() {
  return (
    <div className="App">
      <ResponsiveContainer width='95%' height='95%' >
        <LineChart data={data}>
          <XAxis
            dataKey='date'
            domain={['auto', 'auto']}
            name='Day'
            tickFormatter={(unixTime) => moment(unixTime).format('MM/DD/YYYY')}
            type='number'
          />
          {/* <YAxis dataKey='hospitalizedCurrently' name='Hospital' /> */}
          {/* <YAxis dataKey='positive' name='Value' /> */}
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="left2" />
          <YAxis yAxisId="right"  orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="right" type="monotoneY"  strokeWidth={3}  dot={false} dataKey="deathIncrease" stroke="#a71616" activeDot={{ r: 8 }} />

          <Line yAxisId="left2" type="monotoneY" strokeWidth={3} dot={false}  dataKey="positiveIncrease" stroke="#82ca9d" activeDot={{ r: 8 }} />
          <Line yAxisId="left" type="monotoneY" strokeWidth={3} dot={false}  dataKey="normalizedIncrease" stroke="#2981b9" activeDot={{ r: 8 }} />
      </LineChart>

          {/* <Scatter
            line={{ stroke: '#eee' }}
            lineJointType='monotoneX'
            lineType='joint'
            name='Values'
          />

        </ScatterChart> */}
      </ResponsiveContainer>
    </div>
  );
}

export default App;

