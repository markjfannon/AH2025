import { invoke } from '@tauri-apps/api/core';


export function setupCounter(element) {

  let counter = 0
  const setCounter = (count) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => 
    invoke('read_file', {filePath: "../src/assets/alley.png"})
    .then((data) => console.log(data))
  )
  setCounter(0)
}
