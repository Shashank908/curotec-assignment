<template>
  <section>

    <modal-task-delete-confirmation v-bind:modal-props="modal.delete" v-bind:all-tasks="allTasks"></modal-task-delete-confirmation>

    <section class="section">

      <nav class="panel">
        <div class="panel-heading">
          <div class="columns level-item">
            <div class="column">Tasks</div>
            <div class="column is-half">
              <div class="field has-addons is-pulled-right">
                <p class="control">
                  <input class="input" type="text" placeholder="Add a new task" v-model="newTask" v-on:keyup.enter="addTask" />
                </p>
                <p class="control">
                  <button class="button is-primary" v-on:click="addTask" v-html="buttons.addTask.icon" v-bind:title="buttons.addTask.title" v-bind:disabled="buttons.addTask.disabled"></button>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="panel-block">
          <div class="field has-addons">
            <div class="control has-icons-left">
              <input class="input is-small" type="text" placeholder="Search" v-model="filterStr" size="30">
              <span class="icon is-small is-left">
                <i class="fa fa-search"></i>
              </span>
            </div>
            <div class="control level-item">
              <button v-bind:disabled="buttons.filterTasks.disabled" class="button is-small" v-on:click="removeFilter" v-html="buttons.filterTasks.icon"></button>
              &nbsp;&nbsp;
              <label class="checkbox">
                <input v-model="buttons.filterTasks.matchCase" type="checkbox"><span class="small-font">Match Case</span>
              </label>
            </div>
          </div>
        </div>

        <div class="panel-tabs">
          <a v-bind:class="{ 'is-active': tab.allActive }" v-on:click="activateTab(1)">All ({{ allTasks.length }})</a>
          <a v-bind:class="{ 'is-active': tab.incompleteActive }" v-on:click="activateTab(2)">Incomplete ({{ incompleteTasks.length }})</a>
          <a v-bind:class="{ 'is-active': tab.completedActive }" v-on:click="activateTab(3)">Completed ({{ completedTasks.length }})</a>
          <a v-bind:class="{ 'is-active': tab.deletedActive }" v-on:click="activateTab(4)">Deleted ({{ deletedTasks.length }})</a>
        </div>

        <div class="panel-block" v-if="!allTasks.length">
          There are no tasks yet
        </div>

        <div class="panel-block incomplete-tasks" v-for="task in incompleteTasks" v-bind:key="task.id" v-if="tab.allActive || tab.incompleteActive">
            <p class="control">
              <label class="checkbox">
                <input v-bind:checked="task.completed"  v-on:change="toggleCompleted(task.id)" type="checkbox">
                {{ task.description }}
              </label>
              <span class="icon is-pulled-right" v-on:click="deleteTask(task.id)">
                  <i class="fa fa-remove"></i>
              </span>
            </p>
        </div>

        <div class="panel-block complete-tasks" v-for="task in completedTasks" v-bind:key="task.id" v-if="tab.allActive || tab.completedActive">
            <p class="control">
              <label class="checkbox">
                <input v-bind:checked="task.completed"  v-on:change="toggleCompleted(task.id)" type="checkbox">
                {{ task.description }}
              </label>
              <span class="icon is-pulled-right" v-on:click="deleteTask(task.id)">
                  <i class="fa fa-remove"></i>
              </span>
            </p>
        </div>

        <div class="panel-block deleted-tasks" v-for="task in deletedTasks" v-bind:key="task.id" v-if="tab.deletedActive">
            <p class="control">
              <label class="checkbox disabled">
                <input v-bind:checked="task.completed" type="checkbox">
                {{ task.description }}
              </label>
            </p>
        </div>

      </nav>

    </section>

  </section>
</template>

<script>
import _ from 'lodash'
import Crypto from 'crypto-browserify'
import store from '../store'
import ModalTaskDelete from './ModalTaskDelete'

export default {
  name: 'todo',
  components: {
    'modal-task-delete-confirmation': ModalTaskDelete
  },
  data () {
    return {
      title: 'ToDo List',
      newTask: '',
      tasks: [],
      tab: {
        allActive: true,
        incompleteActive: false,
        completedActive: false,
        deletedActive: false
      },
      filterStr: '',
      buttons: {
        addTask: {
          title: 'Click to add a new task',
          icon: `<i class="fa fa-plus" aria-hidden="true"></i>`,
          disabled: true
        },
        filterTasks: {
          label: '',
          icon: `<i class="fa fa-remove"></i>`,
          disabled: true,
          matchCase: false
        }
      },
      modal: {
        delete: {
          showModal: false,
          title: 'Are you sure you want to delete this task?',
          item: {},
          itemIndex: undefined
        }
      }
    }
  },
  methods: {
    addTask: function () {
      if (this.newTask.length) {
        const newId = this.genRandTaskId(this.tasks.length + 1, this.newTask)
        const task = { id: newId, description: this.newTask, completed: false, deleted: false }
        store.dispatch('addTask', task) // add the task asynchronously
        this.newTask = '' // clear the text box
      }
    },
    activateTab: function (i) {
      this.tab = {
        allActive: i === 1,
        incompleteActive: i === 2,
        completedActive: i === 3,
        deletedActive: i === 4
      }
    },
    toggleCompleted: function (id) {
      store.dispatch('toggleCompletedFlag', id)
    },
    removeFilter: function () {
      this.filterStr = ''
    },
    genRandTaskId: function (num, seed) {
      const thisseed = seed || Math.random()
      return Crypto.createHash('sha256').update(new Date() + num.toString() + thisseed).digest('hex')
    },
    deleteTask: function (id) {
      const itemIndex = _.findIndex(this.allTasks, task => task.id === id)

      // Open the Delete Task Confirmation Modal
      // and pass it the current task object
      this.modal.delete.showModal = true
      this.modal.delete.item = this.allTasks[itemIndex]

      // also pass the array index of the item to be deleted
      this.modal.delete.itemIndex = itemIndex
    }
  },
  computed: {
    allTasks: function () {
      return store.getters.allTasks(this.filterStr)
    },
    completedTasks: function () {
      return store.getters.completedTasks(this.filterStr)
    },
    incompleteTasks: function () {
      return store.getters.incompleteTasks(this.filterStr)
    },
    deletedTasks: function () {
      return store.getters.deletedTasks(this.filterStr)
    }
  },
  watch: {
    // Watch for text being entered in the New Task box
    newTask: function () {
      this.buttons.addTask.disabled = !this.newTask.length
    },
    // Watch for text being entered in the Filter Task box
    filterStr: function () {
      this.buttons.filterTasks.disabled = !this.filterStr.length
    }
  }
}
</script>
