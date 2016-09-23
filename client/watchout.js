// start slingin' some d3 here.
var gameOptions = {
  boardWidth: 2000,
  boardHeight: 1000,
  numberOfEnemies: 10
};

var infoboard = {
  score: 0,
  highscore: 0
};

var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.boardWidth]),
  y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.boardHeight])
};

var makeEnemies = function(amount = gameOptions.numberOfEnemies) {
  return _.range(0, amount).map(index => {
    return {
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100
    };
  });
};

var enemies = makeEnemies();

var showEnemies = function(enemiesData) {
  d3.select('.board').append('svg')
    .attr('width', '2000')
    .attr('height', '1000');

  d3.select('svg').selectAll('image')
  .data(enemiesData, d => { d.id; })

  .enter()
    .append('svg')
    .attr('class', 'enemy')
    .append('image')
    .attr('x', enemy => axes.x(enemy.x))
    .attr('y', enemy => axes.y(enemy.y))
    .attr('xlink:href', 'asteroid.png')
    .attr('height', '100px')
    .attr('width', '100px');
  
  // .exit().remove();
};

showEnemies(enemies);


// <svg width="10cm" height="8cm" version="1.1"
//     xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink">
//   <image xlink:href="asteroid.png" x="50" y="50" height="100px" width="100px"/>
// </svg> 