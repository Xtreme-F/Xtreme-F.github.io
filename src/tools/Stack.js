class Stack{
  constructor(){
    this.first = null;
    this.last = null;
    this.size = 0;
  }

  push(val){
    var newNode = new Node(val);
    //if stack is empty
    if (!this.first) {
      this.first = newNode;
      this.last = newNode;
      // add current first pointer to new first(new node), and make new node new first
    } else {
      newNode.next = this.first;
      this.first = newNode;
    }
    //add 1 to size
    this.size++;

    return this;
  }

  pop(){
    //alert("AT POP");
    //if stack is empty return false
    if (this.size === 0) return false;
    //get poppednode
    var poppedNode = this.first;
    //get new first (could be NULL if stack is length 1)
    var newFirst = this.first.next;
    //if newFirst is null, reassign last to newFirst(null)
    if (!newFirst) {
        this.last = newFirst;
    }
    //assign new first
    this.first = newFirst;
    //remove reference to list
    poppedNode.next = null;
    //remove 1 from size
    this.size--;
    //alert("popped x: " + poppedNode.value.x);
    //return poppednode
    return poppedNode.value;
  }

  isEmpty(){
    if(!this.first || this.size == 0)
      return true;
    else
      return false;
  }

}
