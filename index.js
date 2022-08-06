const db = require("./db")
const inquirer = require('inquirer')

module.exports.add = async (title) => {
  const list = await db.read()
  list.push({title, done: false})
  await db.write(list)
}

module.exports.clear = async () => {
  await db.write([])
}

module.exports.showAll = async () => {
  const list = await db.read()
  printAllTasks(list)
}


function askForCreateTask(list) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: 'Enter The Title For A New Task:',
  }).then(answer4 => {
    list.push({
      title: answer4.title,
      done: false,
    })
    db.write(list).then()
  })
}

function markAsDone(list, index) {
  list[index].done = true
  db.write(list).then()
}

function markAsUndone(list, index) {
  list[index].done = false
  db.write(list).then()
}

function changeTitle(list, index) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: 'Enter A New Title:',
    default: list[index].title
  }).then(answer3 => {
    list[index].title = answer3.title
    db.write(list).then()
  })
}

function removeTask(list, index) {
  list.splice(index, 1)
  db.write(list).then()
}

function askForAction(list, index) {
  const actions = {markAsUndone, markAsDone, changeTitle, removeTask}
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What to do with the task?',
    choices: [
      {name: 'Exit', value: 'quit'},
      {name: 'Mark as Done', value: 'markAsDone'},
      {name: 'Mark as Undone', value: 'markAsUndone'},
      {name: 'Edit Title', value: 'changeTitle'},
      {name: 'Delete', value: 'removeTask'},
    ]
  }).then(answer2 => {
    const action = actions[answer2.action]
    action && action(list, index)
  })
}

function printAllTasks(list) {
  inquirer
    .prompt(
      {
        type: 'list',
        name: 'index',
        message: 'Which task do you wanna operate?',
        choices: [{name: 'Exit', value: '-1'}, ...list.map((task, index) => {
          return {name: `${task.done ? '[√]' : '[_]'} ${index + 1} - ${task.title}`, value: index.toString()}
        }), {name: ' +  Add a new task', value: '-2'}],
      },
    ).then(answer => {
    const index = parseInt(answer.index)
    if (index >= 0) {
      askForAction(list, index)
    } else if (index === -2) {
      askForCreateTask(list)
    }
  })
}

