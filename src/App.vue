<template>
  <div id="app">
    <app-header></app-header>

    <router-view></router-view>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader'
import store from './store'
import localStorage from './store/localStorage'

export default {
  name: 'app',
  components: {
    'app-header': AppHeader
  },
  mounted () {
    store.dispatch('setTasks', localStorage.get('tasks'))
  }
}
</script>

<style lang="sass" src="bulma"></style>
<style lang="sass">
  $fa-font-path: '../node_modules/font-awesome/fonts/';
  @import '../node_modules/font-awesome/scss/font-awesome';
</style>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
