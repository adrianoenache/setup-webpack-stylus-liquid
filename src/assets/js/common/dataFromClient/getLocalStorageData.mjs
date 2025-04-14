function getLocalStorageData(key) {

  return JSON.parse(localStorage.getItem(key))

}

export default getLocalStorageData
