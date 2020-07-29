/*
{
  `textId`: {
    `chunkId` : [ `word` ]
  }
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
    localStorage.setItem("allMarked", JSON.stringify(allMarked));
    for (const s of subscribers) {
      s(allMarked);
    }
  },

  set(value) {
    allMarked = value;
    this.applyChanges();
  },

  updateCurrent(textId, chunkId, marked) {
    if(textId == null || chunkId == null) return;

    if(!allMarked[textId])
      allMarked[textId] = {}

    allMarked[textId][chunkId] = marked.length ? marked : [];
    this.applyChanges();
  }
}
