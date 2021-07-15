<template>
  <nav class="nav has-shadow">
      <div class="nav-left">
          <a class="nav-item">
            <i class="fa fa-list" aria-hidden="true"></i>
            &nbsp;
            To-Do List
          </a>
      </div>
      <!-- This "nav-toggle" hamburger menu is only visible on mobile -->
      <!-- You need JavaScript to toggle the "is-active" class on "nav-menu" -->
      <span class="nav-toggle" v-on:click="toggleMenu()">
          <span></span>
          <span></span>
          <span></span>
      </span>

      <!-- This "nav-menu" is hidden on mobile -->
      <!-- Add the modifier "is-active" to display it on mobile -->
      <div class="nav-right nav-menu" v-bind:class="{ 'is-active': menuIsActive }">
          <a class="nav-item" href="/#/ToDo">To-dos</a>
      </div>
  </nav>
</template>

<script>
  export default {
    name: 'app-header',
    data () {
      return {
        menuIsActive: false
      }
    },
    methods: {
      toggleMenu: function () {
        this.menuIsActive = !this.menuIsActive
      }
    }
  }
</script>
