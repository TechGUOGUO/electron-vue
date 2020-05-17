// var winapi = require('winapi');
// winapi.MaximizeWindow('有道云笔记',(e)=>{
  
//   console.log(e)
// })
// const ffi = require('ffi')
// function TEXT(text)  {
//   return Buffer.from(`${text}\0`,'ucs2')
// }
// const user32 = new ffi.Library('user32',{
//   FindWindowW:['int32',['string','string']]
// })
// var hwnd =user32.FindWindowW(TEXT('program'),null);
// console.log(hwnd)
// console.log(hwnd.toString(16))

let nodeAbi = require('node-abi')
let val = nodeAbi.getTarget('57', 'electron');
console.log(val)