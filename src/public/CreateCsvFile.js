/**
 * 輸出csv
 * @param {Array} data 匯出內容 ex: [['title1','title2'] , ['content1','content2']]
 */
function createCsvFile(data) {
  const noData = (
    !data
    || data.length === 0
    || JSON.stringify(data) === '{}'
  );

  if (noData) {
    return '';
  }

  const csvContent = data.reduce((accumulator, currentValue) => {
    const content = currentValue.map(v => `\t${v.toString()}`).join(',');

    return `${accumulator}${content}\r\n`;
  }, '');

  const url = URL.createObjectURL(new Blob([`\uFEFF${csvContent}`],
    { type: 'text/csv;charset=utf-8;' }));

  return url;
}

export default createCsvFile;
