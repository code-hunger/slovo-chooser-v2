/*
{
  `chunkId` : [ `word` ]
}
*/

let subscribers = [];

let allMarked = JSON.parse(localStorage.getItem("allMarked")) || {};

export default {
  subscribe(subscription) {
    subscribers.push(subscription);
    subscription(allMarked);
    return () => {
      subscribers.splice(subscribers.indexOf(subscription), 1);
    }
  },

  applyChanges() {
    console.log("Saving marked words!", allMarked)
    localStorage.setItem("allMarked", JSON.stringify(allMarked));
    for (const s of subscribers) {
      s(allMarked);
    }
  },

  updateCurrent(id, marked) {
    if(id == null) return;
    if(!marked.length)
      allMarked[id] = [];
    else
      allMarked[id] = marked;
    this.applyChanges();
  }
}
