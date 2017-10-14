import store from '../store'

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
function find (list, f) {
  return list.filter(f)[0]
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy (obj, cache = []) {
  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // if obj is hit, it is in circular structure
  const hit = find(cache, c => c.original === obj)
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy
  })

  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}

/**
 * forEach for object
 */
export function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

export function isPromise (val) {
  return val && typeof val.then === 'function'
}

export function assert (condition, msg) {
  if (!condition) throw new Error(`[vuex] ${msg}`)
}

export function warn (condition, msg) {
  if (process.env.NODE_ENV !== 'production'){
    if (condition) console.error(`[Application warn]: ${msg}`)
  }
}

export function formatDate (date) {
  if (!date || date === '') return ''
  if (typeof date === 'string') {
    date = new Date(date)
  }
  const y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  return y + '-' + m + '-' + d
}

export function checkPermission (item) {

  if (!item.meta || !item.meta.auth) return true // return true if the menu has no access control

  let userRoles = store.getters.roles
  if (!(userRoles instanceof Array) || userRoles.length === 0) return false  // return false if the user has no role

  if (userRoles && userRoles.indexOf('ROLE_ADMIN') >= 0) return true // administrator has full access
  if (item.meta && item.meta.auth) {
    if (item.meta.auth instanceof Array) {
      return userRoles && userRoles.some(role => item.meta.auth.indexOf(role) > -1)
    } else {
      return userRoles && userRoles.indexOf(item.meta.auth) > -1
    }
  } else {
    return true
  }
}

let util = {}

util.title = function (title) {
  title = title ? title + ' - Home' : 'iView Admin'
  window.document.title = title
}

export default util
