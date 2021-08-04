function mazeInit(){
  var sq = new Square(10);
  //alert("Square length: " + sq.getWidth());
  //Get elements data.
  const canvas = document.getElementById("canvas");
  const dim = document.getElementById("inputDim").value;
  const density = document.getElementById("inputDen").value;
  const flama = document.getElementById("inputFlama").value;
  const delay = document.getElementById("inputDel").value;

  var strat = 0;
  if(document.getElementById("algoChoice1").checked)
    strat = 0;
  else if(document.getElementById("algoChoice2").checked)
    strat = 1;
  else if(document.getElementById("algoChoice3").checked)
    strat = 2;
  else if(document.getElementById("algoChoice4").checked)
    strat = 3;

  var repeat = false;
  if(document.getElementById("repeatChoice1").checked)
    repeat = false;
  else if(document.getElementById("repeatChoice2").checked)
    repeat = true;

  alert("Strat: " + strat);
  alert("Repeat: " + repeat);

  //alert("window width " + window.innerWidth);
  //alert("window height " + window.innerHeight);

  //Prepare canvas
  canvas.width = dim*41 + 5;//window.innerWidth;
  canvas.height = dim*41 + 5;//window.innerHeight;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "red";

  //Validate input.
  if(dim <= 1){
    alert("Please, input a valid dimension");
    return;
  }
  if(density < 0 || density > 100){
    alert("Please, input a valid density %");
    return;
  }
  if(flama < 0 || flama > 100){
    alert("Please, input a valid flamability rate %");
    return;
  }

  //Create and start!
  var agent = new Agent(strat, repeat);
  var maze = new Maze(dim, density, flama, delay, agent, canvas, ctx);
  maze.occupy(density);
  maze.startFire();
  maze.drawMaze();
  //alert("AAAA " + agent.repetition);

  startGame(maze);

  /*
  var array = new Array();
  for(var i = 0; i < dim; i++){
    array[i] = 69;
  }
  for(var i = 0; i < array.length; i++){
    for (var j = 0; j < array.length; j++) {
      ctx.fillRect(41 * (i) + 5, 41 * (j) + 5, 40, 40);
    }
  }
  ctx.fillRect(5, 5, 40, 40);
  */
  //alert("MAIN.JS ALERT" + dim);
}

function printPath(path){
  if(path == null){
    alert("Path is null");
    return;
  }

  var result = "Path: ";
  for(var i = 0; i < path.length; i++){
    if(i == path.length-1)
      result += path[i].toString();
    else
      result += path[i].toString() + "";
  }
  alert(result);
}

var interval = null;

function gameIteration(agent, maze){

  //var path = agent.DFS(maze, maze.agentCoord, maze.map[maze.dim-1][maze.dim-1]);
  //alert("agent.repeat: " + agent.repetition);

  if(agent.repetition == false && agent.path.length == 0){
    //alert("repetition false");
    //alert("strat: " + agent.strat);
  //if(agent.strat==0){
    // alert("at == []");
    //alert("before ifs");
    if(agent.strat==0)
      agent.path = agent.DFS(maze, maze.agentCoord, maze.map[maze.dim-1][maze.dim-1]);
    else if(agent.strat==1)
      agent.path = agent.BFS(maze, maze.agentCoord, maze.map[maze.dim-1][maze.dim-1]);
    else if(agent.strat==2)
      agent.path = agent.Astar(maze, maze.agentCoord, maze.map[maze.dim-1][maze.dim-1]);
    else if(agent.strat==3)
      agent.path = agent.completeSearch(maze, maze.agentCoord, maze.map[maze.dim-1][maze.dim-1]);


    if(agent.path!=null)
      agent.path.pop();
  }
  else if(agent.repetition == true){
    //alert("repetition true");
    //alert("strat: " + agent.strat);

    if(agent.strat==0)
      agent.path = agent.DFS(maze, maze.agentCoord, maze.map[maze.dim-1][maze.dim-1]);
    else if(agent.strat==1)
      agent.path = agent.BFS(maze, maze.agentCoord, maze.map[maze.dim-1][maze.dim-1]);
    else if(agent.strat==2)
      agent.path = agent.Astar(maze, maze.agentCoord, maze.map[maze.dim-1][maze.dim-1]);
    else if(agent.strat==3)
      agent.path = agent.completeSearch(maze, maze.agentCoord, maze.map[maze.dim-1][maze.dim-1]);

    //printPath(agent.path);
    if(agent.path!=null)
      agent.path.pop();
  }

  if(agent.path == null){
    agent.state = 2;
    alert("AGENT IS TRAPPED!");
    clearInterval(interval);
    return;
  }
  maze.agentCoord = agent.path.pop();

  if(maze.agentCoord.isGoal){
    maze.drawMaze();
    agent.state = 1;
    alert("Agent Won!");
    clearInterval(interval);
    return;
  }

  maze.expandFire();

  if(maze.agentCoord.isFire){
    maze.drawMaze();
    agent.state = 2;
    alert("Agent on Fire!");
    clearInterval(interval);
    return;
  }

  maze.drawMaze();
  if(agent.repetition){
    agent.path = [];
    maze.resetAll();
  }
  //alert("M");
  //setTimeout(function() {maze.drawMaze()}, 100 * (i+1) * 10);
  //alert(maze.delay + "after settimeout");
  //i++;
}

function startGame(maze){
  var agent = maze.agent;
  //agent.repetition = true;
  var i = 0;

  //var interval = null;

  interval = setInterval( function(){gameIteration(agent, maze);}, maze.delay);

  /*
  while(agent.state == 0){
    if(i > 5){
      break;
    }
    maze.expandFire();

    if(maze.agentCoord.inFire){
      agent.state = 2;
    }

    setTimeout(function() {maze.drawMaze()}, 100 * (i+1) * 10);
    //alert(maze.delay + "after settimeout");
    i++;

  }*/

}
