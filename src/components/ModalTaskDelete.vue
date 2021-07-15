<template>
  <div class="modal" v-bind:class="{ 'is-active' : modalProps.showModal }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ modalProps.title }}</p>
        <button class="delete" v-on:click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <p>id: <span class="is-size-7">{{ modalProps.item.id }}</span></p>
        <p>{{ modalProps.item.description }}</p>
        <p><span v-bind:class="{ 'has-text-danger': !this.modalProps.item.completed, 'has-text-success': this.modalProps.item.completed }">{{ isCompletedLabel }}</span></p>
      </section>
      <footer class="modal-card-foot">
        <a class="button is-success" v-on:click="confirmDelete()">Delete</a>
        <a class="button" v-on:click="closeModal">Cancel</a>
      </footer>
    </div>
  </div>
</template>

<script>
  import store from '../store'

  export default {
    name: 'modal-task-delete-confirmation',
    props: ['modalProps', 'allTasks'],
    methods: {
      closeModal: function () {
        this.modalProps.showModal = false
      },
      confirmDelete: function () {
        store.dispatch('deleteTask', this.modalProps.itemIndex) // delete the task asynchronously
        this.closeModal()
      }
    },
    computed: {
      isCompletedLabel: function () {
        return this.modalProps.item.completed ? 'Completed' : 'Not completed'
      }
    }
  }
</script>
