App = {
    loading: false,
    contracts:{}, // For truffle contract to store the JS contracts
    load: async() => {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },

    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider
          web3 = new Web3(web3.currentProvider)
        } else {
          window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
          window.web3 = new Web3(ethereum)
          try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */})
          } catch (error) {
            // User denied account access...
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          App.web3Provider = web3.currentProvider
          window.web3 = new Web3(web3.currentProvider)
          // Acccounts always exposed
          web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      },
    
      loadAccount: async () => {
        // Set the current blockchain account
        App.account = web3.eth.accounts[0]
      },
      
      loadContract: async ()=> {
        const todoList = await $.getJSON('TodoList.json')
        // Creating a Truffle contract which is just the JS representation of a smart contract
        App.contracts.TodoList = TruffleContract(todoList)
        App.contracts.TodoList.setProvider(App.web3Provider)

        // Read the vales of todo list from the block chain and stor it in contracts object
        App.todoList = await App.contracts.TodoList.deployed();
      },

      render: async() => {
        // Prevent Double Rendering
        if(App.loading) {
            return
        }

        // Update loading state of app
        App.setLoading(true)

        // Render Account
        $('#account').html(App.account)

        await App.renderTask()

        // Update loading state
        App.setLoading(false)
      },

      renderTask: async () => {
          // Load total task count
          const taskCount = await App.todoList.taskCount()

          const $taskTemplate = $('.taskTemplate')
        

          // Load each task according to our frontend
          // Note that this loop can't start from 0 as the valid id in the hashmap we created on blockchain starts from 1 (Use Truffle console to check) 
          for(var i = 1; i <= taskCount; i++) {
              // Fetching data
              const task = await App.todoList.tasks(i);
              // The above tasks() call returns an array indexed from 0
              const taskId = task[0].toNumber()
              const taskContent = task[1]
              const taskCompleted = task[2]

              const $newTaskTemplate = $taskTemplate.clone()
              $newTaskTemplate.find('.content').html(taskContent)
              $newTaskTemplate.find('.input')
                              .prop('name', taskId)
                              .prop('checked', taskCompleted)
                            //   .on('click', App.toggleCompleted)

              if(taskCompleted) {
                  $('#completedTaskList').append($newTaskTemplate)
              }
              else {
                  $('#taskList').append($newTaskTemplate)
              }
              // Show the task
              $newTaskTemplate.show()
          }

          // Show them on frontend
      },

      createTask: async () => {
        App.setLoading(true)
        const content = $('#newTask').val()
        await App.todoList.createTask(content)

        // Reload the page
        window.location.reload()
      },

      setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
          loader.show()
          content.hide()
        } else {
          loader.hide()
          content.show()
        }
    }
}



// Run App.load() when the app loads
$(() => {
    $(window).load(() => {
        App.load()
    })
})