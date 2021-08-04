function coordEquals(coord1, coord2){
  return (coord1.x == coord2.x && coord1.y == coord2.y);
}

function myHas(collection, targetcoord){
  for(var index = 0; index < collection.length; index++){
    //alert("at myhas loop");
    if(coordEquals(collection[index], targetcoord)){
      return true;
    }
  }

  return false;
}

class Agent{
  constructor(strat, repeat){
    this.strat = strat;
    //alert("wa " + repeat);
    this.repetition = repeat;

    this.path = [];//May change according to strategy.

    /*
    * Agent states {0, 1, 2}
    * 0: Puzzle in progress.
    * 1: Puzzle solved. Success!
    * 2: Agent gets trapped or in fire. Failure.
    */
    this.state = 0;
  }

  generatePath(maze, goal){
    //alert("AT GENERATE PATH");
    var path = [];
    var temp = goal;
    var i = 0;
    while(temp != null){
      //alert("AT GENERATE PATH LOOPs: " + temp.toString());
      path.push(temp);
      temp = temp.parent;
      if(i > 150){
        var ok = [];
        ok.push(goal);
        return ok;
      }
      i++;
    }
    //alert("GENERATEPATH CONCLUDED");
    return path;
  }

  generateChildren(maze, tempcoord, collection, visited, target, code){
    var children = [];
    //alert("a");
    //alert("tempcoord: " + tempcoord.toString());

    //Left
    if(tempcoord.x > 0)
      children.push(maze.map[tempcoord.y][tempcoord.x-1]);
    //Up
    if(tempcoord.y > 0)
      children.push(maze.map[tempcoord.y-1][tempcoord.x]);
    //Right
    if(tempcoord.x < maze.dim-1)
      children.push(maze.map[tempcoord.y][tempcoord.x+1]);
    //Down
    if(tempcoord.y < maze.dim-1)
      children.push(maze.map[tempcoord.y+1][tempcoord.x]);


    //alert("children length: " + children.length);
    for(var i = 0; i < children.length; i++){
      //alert("ALERT! Visited Length: " + visited.length);
      var temp = children[i];
      //if(code == 3.3)
      //  alert("Child evaluated: " + temp.toString());
      if(temp.isWall)
        continue;

      if(code < 3 || code == 3.3){
        //if(temp.isFire || myHas(visited, temp)){
        if(temp.isFire || temp.visited){
          continue;
        }
        //visited.push(temp);
        temp.visited = true;
      }
      else{
        if(code == 3.1){
          //alert("code 3.1");
          if(temp.visited){
            //alert("VISITED!");
            continue;
          }
          temp.visited = true;
          if(temp.isFire){
            //alert("IS FIRE!");
            temp.visited = true;
            this.path.push(temp);
            continue;
          }
          temp.score = tempcoord.score + 1;
        }
        if(code == 3.2){
          //alert("code 3.2");
          if(temp.isFire)
            continue;
          temp.risk += Math.pow(maze.flama/100, (tempcoord.pathDistance+1));
          //temp.score = temp.score * temp.risk;// * temp.score;
          temp.score = temp.risk;
          //alert("distance: " + (tempcoord.pathDistance+1));
          //alert("flama: " + maze.flama);
          //alert("Risk: " + temp.risk);
        }
      }

      temp.parent = tempcoord;
      temp.pathDistance = tempcoord.pathDistance+1;

      if(collection.constructor == Stack){
        collection.push(temp);
        //alert("At collection push");
      }
      else if(collection.constructor == Queue){
        //alert("At collection queue");
        collection.enqueue(temp);
        //alert("after enqueue, size: " + collection.size);
      }
      else if(code < 3 && collection.constructor == MinHeap){
        //alert("At collection push minheap");
        temp.score = tempcoord.pathDistance + 1 * this.euclideanDistance(temp, target);
        collection.push(temp);
      }
      else if(code >= 3 && collection.constructor == MinHeap){
        //alert("At collection push minheap");
        //temp.score = temp.score + temp.risk * temp.score;
        temp.score = temp.score * (tempcoord.pathDistance+1) + (tempcoord.pathDistance+1);
        collection.push(temp);
      }

    }//For loop end (for each possible child, validate)
    //alert("generate done");
  }

  searchLoop(maze, origin, target, collection, code){
    var count = 0;

    origin.visited = true;
    var visited = [];
    //visited.push(origin);
    var tempcoord = null;
    while(!collection.isEmpty()){
      if(collection.constructor === Stack){
        //alert("At constructor === stack");
        tempcoord = collection.pop();
      }
      else if(collection.constructor === Queue){
        //alert("At constructor === queue");
        tempcoord = collection.dequeue();
      }
      else if(collection.constructor === MinHeap){
        //alert("At constructor === MinHeap");
        //alert("Heap size: " + collection.box.length);
        //alert(collection.toString());
        tempcoord = collection.pop();
      }
      //alert("POPPED TEMPCOORD: " + tempcoord);
      if(tempcoord.isGoal){
        //alert("GOAL FOUND!");
        var resultpath = this.generatePath(maze, tempcoord);
        //maze.resetPathsAndScore();
        return resultpath;
      }
      //alert("POPPED TEMPCOORD: " + tempcoord.toString());
      this.generateChildren(maze, tempcoord, collection, visited, target, code);
      //alert("COUNT: " + count);
      count++;
    }

    alert("GOAL NOT REACHABLE");
    return null;
  }

  DFS(maze, origin, target){//code: 0
    //alert("ORIGIN: " + origin.x + ", " + origin.y);
    var count = 0;
    var stack = new Stack();
    stack.push(origin);
    target.visited = false;
    //alert(stack.pop().x);
    return this.searchLoop(maze, origin, target, stack, 0);
  }

  BFS(maze, origin, target){//code: 1
    //alert("ORIGIN: " + origin.x + ", " + origin.y);
    var count = 0;
    var queue = new Queue();
    queue.enqueue(origin);
    //alert(stack.pop().x);
    return this.searchLoop(maze, origin, target, queue, 1);
  }

  euclideanDistance(coordinate1, coordinate2){
    let diffx = coordinate1.x - coordinate2.x;
    let diffy = coordinate1.y - coordinate2.y;
    return Math.sqrt((diffx*diffx)+(diffy*diffy));
  }

  Astar(maze, origin, target){//code: 2
    var heap = new MinHeap();
    origin.score = this.euclideanDistance(origin, target);
    origin.pathDistance = 0;
    heap.push(origin);
    //alert(stack.pop().x);
    return this.searchLoop(maze, origin, target, heap, 2);
  }

  completeSearch(maze, origin, target){//code: 3, 3.1, 3.2
    //First do preparation, get all flames on surface while determining path distance.
    var queue = new Queue();
    queue.enqueue(target);
    target.visited = true;
    target.score = 0;
    var flamesNeeded = this.collectFlamesLoop(maze, origin, target, queue);
    ////alert(maze.scoresToString());
    maze.resetPaths();
    this.path = [];
    //maze.resetVisited();
    this.markRisks(maze, origin, target, flamesNeeded);
    ////alert(maze.risksToString());
    var resultpath = this.BPS(maze, origin, target);
    //////alert(maze.scoresToString());
    this.path = [];
    //maze.reseltAll();
    return resultpath;
  }

  collectFlamesLoop(maze, origin, target, collection){// code: 3.1
    var visited = [];
    visited.push(origin);
    var tempcoord = null;
    while(!collection.isEmpty()){
      if(collection.constructor === Queue){
        ////alert("At constructor === queue");
        tempcoord = collection.dequeue();
        //alert("After dequeue, size: " + collection.size);
      }
      else if(collection.constructor === MinHeap){
        //alert("At constructor === MinHeap");
        //alert("Heap size: " + collection.box.length);
        //alert(collection.toString());
        tempcoord = collection.pop();
      }

      ////alert("POPPED TEMPCOORD: " + tempcoord.toString());
      this.generateChildren(maze, tempcoord, collection, visited, target, 3.1);
      //alert("after generate children, size: " + collection.size);
      //alert("COUNT: " + count);
      //count++;
    }
    ////alert("COLLECTED ALL FLAMES");
    return this.path;
  }

  markRisks(maze, origin, target, flames){//code: 3.2
    var tempcoord = null;
    var queue = null;
    var visited = [];
    //alert("num flames: " + flames.length);
    var str = "";
    for(var j = 0; j < flames.length; j++){
      str += flames[j].toString();
    }
    //alert("flames:" + str);
    for(var i = 0; i < flames.length; i++){
      //alert("STARTING 1 FLAME EVALUATION");
      queue = new Queue();
      var tempflame = flames[i];//flames.pop();
      //alert("FLAME: " + tempflame.toString());
      tempflame.pathDistance = 0;
      queue.enqueue(tempflame);
      while(!queue.isEmpty()){
        tempcoord = queue.dequeue();
        //alert("POPPED TEMPCOORD: " + tempcoord.toString());
        if(tempcoord.visited){
        //  alert("VISITED!");
          continue;
        }
        tempcoord.visited = true;
        this.generateChildren(maze, tempcoord, queue, visited, target, 3.2);
        /////alert("AFTER GENERATE CHILDREN");
      }
      //alert("FLAME " + i + " DONE");
      maze.resetPaths();
      ////alert(maze.risksToString());
    }
    //alert("ALL FLAMES DONE");
  }

  //Best Path Search
  BPS(maze, origin, target){//code: 3.3
    var heap = new MinHeap();
    //origin.score = this.euclideanDistance(origin, target);
    origin.pathDistance = 0;
    heap.push(origin);
    //alert(stack.pop().x);
    return this.searchLoop(maze, origin, target, heap, 3.3);
  }

}
