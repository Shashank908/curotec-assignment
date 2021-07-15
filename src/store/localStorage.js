const set = (key, data) => {
  window.localStorage.setItem(key, JSON.stringify(data))
}

const get = (key) => {
  return JSON.parse(window.localStorage.getItem(key))
}

export default ({
  set,
  get
})
