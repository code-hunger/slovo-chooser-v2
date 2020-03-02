const fieldToString = field => {
  if (field === null) return "";

  const innerValue =
    field instanceof Date ? field.toLocaleString() : field.toString();
  const result = innerValue.replace(/"/g, '""');

  if (result.search(/("|,|\n)/g) >= 0) return '"' + result + '"';
  return result;
};

const processRow = row =>
  row.reduce(
    (finalVal, field, j) =>
      finalVal + (j > 0 ? "," : "") + fieldToString(field),
    ""
  ) + "\n";

export const convertToCsv = rows =>
  rows.reduce((prev, row) => prev + processRow(row), "");

export function exportToFile(filename, content) {
  if(typeof content !== "string") throw "Only strings may be saved to files!";
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

export default (fileName, rows) => exportToFile(fileName, convertToCsv(rows));
