const { assert } = require("chai")

const TodoList = artifacts.require('./TodoList.sol')

contract('TodoList', (accounts) => {
    // accounts will be an array of all smart contracts that we can see in Ganache
    before(async () => {
        this.todoList = await TodoList.deployed()
    })

    it('deploys successfully', async () => {
        const address = await this.todoList.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it('lists tasks', async() => {
        const taskCount = await this.todoList.taskCount()
        const task = await this.todoList.tasks(taskCount)
        assert.equal(task.id.toNumber(), taskCount.toNumber())
        assert.equal(task.content, 'Follow Yash on Github :)')
        assert.equal(task.completed, false)
        assert.equal(taskCount.toNumber(), 1)
    })

    it('creates Task', async() => {
        const results = await this.todoList.createTask('A new Task')
        const taskCount = await this.todoList.taskCount()
        assert.equal(taskCount, 2)
        // Accessing the event we created in TodoList.sol file
        // You can colsole log this and write 'truffle test' to check
        const event = result.log[0].args
        assert.equal(event.id.toNumber(), 2)
        assert.equal(event.completed, false)
        assert.equal(event.content, 'A new Task')
    })
})