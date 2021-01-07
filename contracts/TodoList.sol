pragma solidity ^0.5.0;

// Whenever you add a new contract dont forget to do truffle migrate --reset to see it's effect
contract TodoList {
    uint public taskCount = 0;

    
    // A user defined Data Structure
    struct Task {
        uint id;
        string content;
        bool completed;
    }
    // You can think of it as a hash map of a key value pair : uint = Key and Task = Value
    mapping(uint => Task) public tasks;
    // Must be capitalised
    event TaskCreated(
        uint id,
        string content,
        bool completed
    );

    event TaskCompleted(
        uint id,
        bool completed
    );
    // A usual constructor called when the smart contract is run for the first time (upon deployment)
    constructor() public {
        createTask("Follow Yash on Github :)");
    }

    // A function to create new tasks into blockchain.
    function createTask(string memory _content) public {
        //  Increment taskCount
        taskCount++;
        // Add the new task to map:tasks (we pass the parameters in the same order as the order in which we defined)
        tasks[taskCount] = Task(taskCount, _content, false);
        // This event will be excecuted everytime a new createTask smart contract is called, and we can access this even from external code
        emit TaskCreated(taskCount, _content, false);
    }

    function toggleCompleted(uint _id) public {
        // "memory _var-name" tells that the variable is a local variable and not a state variable. It should be stored in memory nad not on block chain
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit TaskCompleted(_id, _task.completed);
    }
}
