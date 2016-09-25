// start slingin' some d3 here.
var gameOptions = {
  boardWidth: 1900,
  boardHeight: 900,
  gameInterval: 3000,
  reactionTime: 250,
  numberOfEnemies: 1
};

var infoBoard = {
  score: 0,
  highscore: 0,
  collisions: 0
};

var makeEnemies = function(amount = gameOptions.numberOfEnemies) {
  return _.range(0, amount).map(index => {
    return {
      id: index,
      x: Math.random() * gameOptions.boardWidth,
      y: Math.random() * gameOptions.boardHeight
    };
  });
};

var makePlayer = function() {
  return [{
    id: 0,
    x: 0,
    y: 0
  }];
};

var drag = d3.behavior.drag()
  .origin(function(d) { return d; })
  .on('dragstart', function(d) { return dragstarted.bind(this)(d); })
  .on('drag', function(d) { return dragged.bind(this)(d); })
  .on('dragend', function(d) { return dragended.bind(this)(d); });

var dragstarted = function(d) {
  d3.select(this).classed('dragging', true);
};

var dragged = function(d) {
  d3.select(this)
    .attr('x', d.x = d3.event.x)
    .attr('y', d.y = d3.event.y);
};

var dragended = function(d) {
  d3.select(this).classed('dragging', false);
};


var onCollision = function() {
  updateBestScore();
  infoBoard.score = 0;
  infoBoard.collisions += 1;
  updateScore();
  updateCollisions();
};

var updateBestScore = function() {
  infoBoard.highscore = _.max([infoBoard.highscore, infoBoard.score]);
  d3.select('.highscore').text(infoBoard.highscore.toString());
};

var updateScore = function() {
  d3.select('.current')
    .text(infoBoard.score.toString());
};

var updateCollisions = function() {
  d3.select('.collisions')
    .text(infoBoard.collisions.toString());
};

var showBoard = function() {
  d3.select('.board').append('svg')
    .attr('width', gameOptions.boardWidth)
    .attr('height', gameOptions.boardHeight);
};

var showEnemies = function(enemiesData) {
  var asteroids = d3.select('svg').selectAll('image').filter('.enemy')
    .data(enemiesData, d => { 
      return d.id; 
    });
  
  var checkCollision = function(asteroid) {
    // console.log('asteroid id: ', asteroid.id);
    var player = d3.select('svg').selectAll('image').filter('.player');
    var radiusSum = parseFloat(player[0][0].attributes.width.value);
    var xDiff = parseFloat(asteroid.x) - parseFloat(player[0][0].attributes.x.value);
    var yDiff = parseFloat(asteroid.y) - parseFloat(player[0][0].attributes.y.value);

    // console.log('radiusSum', radiusSum);
    // console.log('xDiff', xDiff);
    // console.log('yDiff', yDiff);

    var separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    if (separation < radiusSum) {
      console.log('collision occurred !!');
      console.log('separation', separation);
      console.log('asteroidx', asteroid.x);
      console.log('asteroidy', asteroid.y);
      console.log('playerx', player[0][0].attributes.x.value);
      console.log('playerx', player[0][0].attributes.y.value);
      onCollision();
    }
  };

  var collisionTween = function(d, i) {
    var enemy = d3.select(this);

    var startPos = {
      x: parseFloat(enemy.attr('x')),
      y: parseFloat(enemy.attr('y'))
    };

    var endPos = {
      x: d.x,
      y: d.y
    };

    return function(t) {
      checkCollision(d);

      var asteroidNextPos = {
        x: startPos.x + (endPos.x - startPos.x) * t,
        y: startPos.y + (endPos.y - startPos.y) * t
      };

      enemy
        .attr('x', asteroidNextPos.x)
        .attr('y', asteroidNextPos.y);
    };
  };

  asteroids
    .transition()
      .duration(gameOptions.gameInterval - gameOptions.reactionTime)
      .tween('custom', collisionTween)
      .attr('x', enemy => enemy.x)
      .attr('y', enemy => enemy.y);
    // .transition()
      // .duration(3000)

  asteroids.enter()
    .append('svg')
    .append('image')
    .attr('class', 'enemy')
    .attr('id', enemy => enemy.id)
    .attr('x', enemy => enemy.x)
    .attr('y', enemy => enemy.y)
    .attr('xlink:href', 'asteroid.png')
    .attr('height', '100px')
    .attr('width', '100px');

  asteroids.exit().remove();


};

var showPlayer = function(playerData) {
  var player = d3.select('svg').selectAll('image').filter('.player')
    .data(playerData, d => {
      return d.id;
    });

  player.enter()
    .append('svg')
    .append('image')
    .attr('class', 'player')
    .attr('id', player => player.id)
    .attr('x', player => player.x)
    .attr('y', player => player.y)
    .attr('xlink:href', 'astroboy.png')
    .attr('height', '150px')
    .attr('width', '150px')
    .call(drag);

  player.exit().remove();    
};


var play = function() {
  var gameTurn = function() {
    var newEnemyPositions = makeEnemies();
    showEnemies(newEnemyPositions);
  };

  var increaseScore = function() {
    infoBoard.score += 1;
    updateScore();
  };

  // Take a turn every 2 seconds
  showBoard();
  var newPlayerPosition = makePlayer();
  showPlayer(newPlayerPosition);
  gameTurn();
  setInterval(gameTurn, gameOptions.gameInterval);
  setInterval(increaseScore, 50);
};

// Play!
play();



