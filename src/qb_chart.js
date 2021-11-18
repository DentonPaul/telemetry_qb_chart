import React from 'react';
import { Line } from 'react-chartjs-2';
import player_scores from './player_scores_telemetry.json';

const QB_data = player_scores.filter(function(item) {
  return item.pos_group === "QB";
});

function getQBStatData(arr, stat, player_name) {
  var x = arr.filter(function(item) {
    return (item.player_name === player_name);
  });

  var stat_list = [];
  var week_list = [];

  for (var i = 1; i < 9; i++) {

    var week_x = x.filter(function(item) {
      return (item.week===i)
    })

    if (week_x.length === 0) {
      stat_list.push(0);
      week_list.push(i);
      continue;
    } 

    try {
      stat_list.push(week_x[0][stat].score_percentile);
    } catch(err) {
      // object does not contain key
      stat_list.push(0);
    }
    week_list.push(i);
  }

  return stat_list;
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function getQBList() {
  var qb_list = [];
  for (var i = 0; i < QB_data.length; i++) {
    qb_list.push(QB_data[i].player_name);
  }

  return qb_list.filter(onlyUnique);
};

function getTeam(data, player_name) {
  var player = data.filter(function(item) {
    return item.player_name===player_name;
  })
  return player[0].team;
};

const qb_stats = [
  'qb_accuracy_overall',
  'qb_accuracy_short',
  'qb_accuracy_medium',
  'qb_accuracy_long',
  'passing_composite',
  'play_speed_non_st',
  'qb_accuracy_tight',
  'qb_decision_making',
  'qb_aggressiveness',
];

const nfl_colors = {
  "ARI": {"border": "#97233F", "fill": "#FFB612", },
  "BUF": {"border": "#00338D", "fill": "#C60C30", },
  "CIN": {"border": "#000000", "fill": "#FB4F14", },
  "DEN": {"border": "#002244", "fill": "#FB4F14", },
  "HOU": {"border": "#00143F", "fill": "#00143F", },
  "KC": {"border": "#CA2430", "fill": "#FFB612", },
  "MIN": {"border": "#4F2E84", "fill": "#FEC62F", },
  "NYG": {"border": "#192E6C", "fill": "#B20032", },
  "PHI": {"border": "#014A53", "fill": "#BBC4C9", },
  "SF": {"border": "#C9243F", "fill": "#C8AA76", },
  "TEN": {"border": "#4095D1", "fill": "#00295B", },
  "ATL": {"border": "#A71930", "fill": "#A5ACAF", },
  "CAR": {"border": "#0085CA", "fill": "#BFC0BF", },
  "CLE": {"border": "#22150C", "fill": "#FB4F14", },
  "DET": {"border": "#046EB4", "fill": "#B0B7BC", },
  "IND": {"border": "#003D79", "fill": "#FFFFFF", },
  "LA": {"border": "#002147", "fill": "#95774C", },
  "NE": {"border": "#0A2342", "fill": "#C81F32", },
  "NYJ": {"border": "#203731", "fill": "#FFFFFF", },
  "PIT": {"border": "#000000", "fill": "#FFC20E", },
  "SEA": {"border": "#002A5C", "fill": "#7AC142 ", },
  "WAS": {"border": "#7C1415", "fill": "#FFC20F", },
  "BAL": {"border": "#241773", "fill": "#9E7C0C", },
  "CHI": {"border": "#00143F", "fill": "#F26522", },
  "DAL": {"border": "#0C264C", "fill": "#B0B7BC", },
  "GB": {"border": "#24423C", "fill": "#FCBE14", },
  "JAX": {"border": "#136677", "fill": "#D8A328", },
  "MIA": {"border": "#0091A0", "fill": "#FF8500", },
  "NO": {"border": "#A08A58", "fill": "#000000", },
  "LV": {"border": "#000000", "fill": "#C4C9CC", },
  "LAC": {"border": "#0A2342", "fill": "#2072BA", },
  "TB": {"border": "#D40909", "fill": "#B0B9BF",}
};

var d = {};
var QB_list = getQBList();
for(var i = 0; i<QB_list.length; i++) {
  var team = getTeam(QB_data, QB_list[i]);
  for(var j = 0; j < qb_stats.length; j++) {
    d[QB_list[i]+qb_stats[j]]= {
      labels: [1, 2, 3, 4, 5, 6, 7, 8],
      datasets: [
        {
          label: QB_list[i] + ' ' + team,
          fill: false,
          lineTension: 0.1,
          backgroundColor: nfl_colors[team]["fill"],
          borderColor: nfl_colors[team]["border"],
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#046EB4',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: getQBStatData(QB_data, qb_stats[j], QB_list[i])
        },]
    }
  }
}

const lineData = d['Aaron Rodgersqb_accuracy_overall'];

class App extends React.Component {

  constructor(props) {
    super(props);
    this.changeMetric = this.changeMetric.bind(this);
    this.stat = 'qb_accuracy_overall';
    this.player = 'Aaron Rodgers';
    this.state = {
      data: lineData,
    };
  }

  changeMetric(event) {
    let key;
    if (event.target.value.includes('_')) {
      this.stat = event.target.value;
    } else {
      this.player = event.target.value;
    }
    key = this.player + this.stat;
    this.setState({
      data: d[key],
    });

  }

  render() {
    const lineOptions = {
      title: {
        display: true,
        text: 'QB Stats'
      },
      tooltips: {
        enabled: true,
      },
      legend: {
        display: true
      },
      maintainAspectRatio: true,
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'percentile'
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'x_axis'
          }
        }],
      }

    };

    return (
      <div className="center">
        <h1>QB Stats by Week</h1>

        {/* I know this is not the ideal way to append options
        I am confident I can develop a way to automatically list these options
        rather than inputing them manually */}
        <select onChange={this.changeMetric} value={this.state.selectedMetric}>
          <option value="Aaron Rodgers">Aaron Roders</option>
          <option value="Andy Dalton">Andy Dalton</option>
          <option value="Baker Mayfield">Baker Mayfield</option>
          <option value="Ben Roethlisberger">Ben Roethlisberger</option>
          <option value="Carson Wentz">Carson Wentz</option>
          <option value="Dak Prescott">Dak Prescott</option>
          <option value="Daniel Jones">Daniel Jones</option>
          <option value="Davis Mills">Davis Mills</option>
          <option value="Derek Carr">Derek Carr</option>
          <option value="Jacoby Brissett">Jacoby Brissett</option>
          <option value="Jalen Hurts">Jalen Hurts</option>
          <option value="Jameis Winston">Jameis Winston</option>
          <option value="Jared Goff">Jared Goff</option>
          <option value="Jimmy Garoppolo">Jimmy Garoppolo</option>
          <option value="Joe Burrow">Joe Burrow</option>
          <option value="Josh Allen">Josh Allen</option>
          <option value="Justin Herbert">Justin Herbert</option>
          <option value="Kirk Cousins">Kirk Cousins</option>
          <option value="Kyler Murray">Kyler Murray</option>
          <option value="Lamar Jackson">Lamar Jackson</option>
          <option value="Mac Jones">Mac Jones</option>
          <option value="Matthew Stafford">Matthew Stafford</option>
          <option value="Patrick Mahomes">Patrick Mahomes</option>
          <option value="Russell Wilson">Russell Wilson</option>
          <option value="Ryan Tannehill">Ryan Tannehill</option>
          <option value="Sam Darnold">Sam Darnold</option>
          <option value="Taylor Heinicke">Taylor Heinicke</option>
          <option value="Ryan Tannehill">Ryan Tannehill</option>
          <option value="Teddy Bridgewater">Teddy Bridgewater</option>
          <option value="Tom Brady">Tom Brady</option>
          <option value="Trevor Lawrence">Trevor Lawrence</option>
          <option value="Tua Tagovailoa">Tua Tagovailoa</option>
          <option value="Tyrod Taylor">Tyrod Taylor</option>
          <option value="Zach Wilson">Zach Wilson</option>
        </select>

        <select onChange={this.changeMetric} value={this.state.selectedMetric}>
          <option value="qb_accuracy_overall">qb_overall_accuracy</option>
          <option value="qb_accuracy_short">qb_accuracy_short</option>
          <option value="qb_accuracy_medium">qb_accuracy_medium</option>
          <option value="qb_accuracy_long">qb_accuracy_long</option>
          <option value="passing_composite">passing_composite</option>
          <option value="play_speed_non_st">play_speed_non_st</option>
          <option value="qb_accuracy_tight">qb_accuracy_tight</option>
          <option value="qb_decision_making">qb_decision_making</option>
          <option value="qb_aggressiveness">qb_aggressiveness</option>
        </select>

            <Line data={this.state.data} options={lineOptions} />

          <h3>Notes</h3>
          <ul>
            <li>All statistics are displayed as <b>score_percentile</b>.</li>
            <li>Points that are zeros correspond with that player not meeting the threshold for that statistic on that specific week.</li>
            <li>Code repository: <a href="https://github.com/DentonPaul/telemetry_qb_chart" target="_blank">Click Here</a></li>
            <li>This app is hosted on AWS Amplify.</li>
            <li>If there is anything else you would like to see, please let me know.</li>
          </ul>
          
          <h4>Let me know what you think, thanks!</h4>

      </div>

    )

  }
}

export default App;