import _ from "lodash";
import md5 from "md5";
import XRegExp from "xregexp";
import exportToCsv, { exportToFile } from "./exportToCSV.js"

export function arrayToggle(arr, el) {
  for (let x of arr) {
    if (el.word == x.word) return _.without(arr, x);
  }

  return [...arr, el];
}

export function wordToggleMark(word) {
  return { ...word, marked: !word.marked };
}

export function wordUnmark(word) {
  return { ...word, marked: false };
}

export function inferEnteredFromInput(input, marked) {
  return marked.filter(word => containsWord(input, word.word));
}

export function updateMarkedFromInput(marked, input) {
  return marked.map(word => ({
    ...word,
    marked: containsWord(input, word.word)
  }));
}

const punctuation = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@[\]^_`{|}~]/;

const endingPunctuation = RegExp(punctuation.source + "+$");

const trailingPunctuation = RegExp(
  "^" + punctuation.source + "+|" + punctuation.source + "+$"
);

export function trimPunctuation(str) {
  return str.replace(trailingPunctuation, "");
}

export function makeWordPresenceRegex(word) {
  const bounadry = "(?:\\P{L}|^|$)"; // unlike \\b, works properly no non-ascii chars

  return XRegExp(bounadry + _.escapeRegExp(trimPunctuation(word)) + bounadry, "i");
}

export function containsWord(str, word) {
  return makeWordPresenceRegex(word).test(str);
}

function smartSpaceConcat(a, b) {
  a = a.trimRight();
  b = b.trimLeft();

  if (a.length == 0 || b.length == 0 || endingPunctuation.test(a)) return a + b;

  return a + " " + b;
}

export function smartRemoveFromString(str, word) {
  const presence = str.match(makeWordPresenceRegex(word));

  if (presence == null) return str;

  const before = str.substr(0, presence.index);
  const after = str.substr(presence.index + presence[0].length);

  return smartSpaceConcat(trimPunctuation(before), trimPunctuation(after));
}

export function smartToggleSubstring(str, word) {
  const withRemovedWord = smartRemoveFromString(str, word);

  if (withRemovedWord != str) return withRemovedWord;

  return smartSpaceConcat(str, word);
}

export function emphasizeWordInStr(str, word) {
  const presence = str.match(makeWordPresenceRegex(word));

  if (!presence) return str;

  const before = str.slice(0, presence.index - 1);
  const matchedWord = str.slice(
    presence.index,
    presence.index + presence[0].length
  );
  const after = str.slice(presence.index + presence[0].length);

  return before + "<b>" + matchedWord + "</b>" + after;
}

// @TODO Name this function
// @NOTE Longest function in the whole repo so far.
export function normalizeLines(lines, joinIfShorterThan) {
  let accumulator = "";
  for (let i = 0; i < lines.length; ++i) {
    if (lines[i].length + accumulator.length < joinIfShorterThan) {
      // The line is short, don't add it yet
      accumulator += " " + lines[i];
      lines[i] = ""; // The dirtiest way to *not add the line yet*
    } else {
      // The line is long enough

      if (accumulator.length) {
        // But there is a non-empty accumulator!
        if (i < 1) {
          // A non-empty accumulator at the first step?
          // Someone modified our source code, then.
          // Pack your stuff and flee away!;
          alert("The Impossible Happened!");
          throw "FxCK!";
        } else {
          if (lines[i - 1].length < lines[i]) {
            // The previous line is shorter, add it there:
            lines[i - 1] += " " + accumulator;
          } else {
            lines[i] += " " + accumulator;
          }
          accumulator = "";
        }
      } else {
        // No accumulator, everything's fine
      }
    }
  }
  lines.push(accumulator);
  return lines.filter(line => trimPunctuation(line) != "");
}

export function persistSavedWords(title, savedChunks) {
  localStorage.setItem("chunks-" + md5(title), JSON.stringify(savedChunks));
}

export function immutableSplice(arr, i) {
  return [
    ...arr.slice(0, i), // `slice` extracts up to but not including `end`
    ...arr.slice(i + 1)
  ];
}

export function immutableArrayUpdate(arr, i, newVal) {
  return [
    ...arr.slice(0, i), // `slice` extracts up to but not including `end`
    newVal,
    ...arr.slice(i + 1)
  ];
}

export function retrieveSavedWords(title) {
  const saved = localStorage.getItem("chunks-" + md5(title));
  return saved ? JSON.parse(saved) : {};
}

export function textDeleterCreator(resetCurrentlyEditing, textsUpdater) {
  return (currentTextId, texts) => ({ detail }) => {
    const i = detail; // the text id to delete

    if(!confirm("Delete text ", texts[i][0]))
      return;

    localStorage.removeItem("chunks-" + md5(texts[i][0]));
    textsUpdater(immutableSplice(texts, i));

    if(currentTextId == i) resetCurrentlyEditing()
  }
}

export function savedWordDeleterCreator(savedChunksUpdater, resetCurrentWord) {
  return (currentlyEditing, savedChunks) => ({ detail: { chunk, word } }) => {
    if(currentlyEditing.chunk == chunk && currentlyEditing.word == word)
    {
      if(!confirm("You're currently editing this word.\n" +
        "Are you sure you want to delete it?"))
        return;

      resetCurrentWord();
    }
    else if(!confirm("Wanna delete this word?")) {
      return;
    }

    savedChunksUpdater(chunk, immutableSplice(savedChunks[chunk], word));
  };
}

export function persistTexts(texts) {
  localStorage.setItem("texts", JSON.stringify(texts));
}

export function switchChunkCreator(currentChunkIdUpdater) {
  return (currentlyEditing, currentText) => ({ detail }) => {
    const dir = detail > 0 ? 1 : -1;
    if(currentlyEditing.word != null) {
      alert("A word is currently being edited!")
      return
    }

    const nextChunkId = dir + currentlyEditing.chunk;

    if(!(nextChunkId in currentText[1])) {
      alert("Next chunk id '" + nextChunkId + "' not found in text.");
      return
    }

    currentChunkIdUpdater(nextChunkId);
  }
}

export function onSaveChunkCreator(resetCurrentWord, savedChunksUpdater) {
  return (currentlyEditingWord, currentChunkSaved = []) => ({ detail }) => {
    if(currentlyEditingWord == null) {
      savedChunksUpdater([...currentChunkSaved, detail]);
    } else {
      savedChunksUpdater(immutableArrayUpdate(currentChunkSaved, currentlyEditingWord, detail));
      resetCurrentWord();
    }
  }
}

export function combineAllState() {
  let state = {};

  for(let i = 0; i < localStorage.length; ++i) {
    let name = localStorage.key(i);
    state[name] = JSON.parse(localStorage.getItem(name));
  }

  return state;
}

export function exportState() {
  const fileName = "slovo_choser_v2_state_" + new Date().toISOString() + ".json";
  exportToFile(fileName, JSON.stringify(combineAllState()));
}

export function downloadSavedWords(currentTextTitle, savedChunks) {
  const csvArray = _.flatMap(savedChunks).map(_.values);

  if(!csvArray.length) {
    alert("No saved chunks!");
    return;
  }

  exportToCsv(currentTextTitle + ".csv", csvArray);
}

