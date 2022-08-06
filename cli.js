#!/usr/bin/env node
const program = require('commander')
const api = require('./index')
const pkg = require('./package.json')

program
  .version(pkg.version)

program
  .command('add')
  .description('add a task')
  .action((...args) => {
    const words = args.slice(0, -1).join(' ')
    api.add(words).then(() => {
      console.log('The task has been successfully added')
    }, () => {
      console.log('Failed to add the task')
    })
  })

program
  .command('clear')
  .description('clear all tasks')
  .action(() => {
    api.clear().then(() => {
      console.log('All tasks have been successfully removed')
    }, () => {
      console.log('Failed to remove all the tasks')
    })
  })


program.parse(process.argv)

if (process.argv.length === 2) {
  void api.showAll()
}