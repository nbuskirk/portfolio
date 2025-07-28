// Number of pages begin with 1
export const computePageNumber = (
  totalTableLength: number,
  rowsPerPage: number
) => {
  let pageNum = Math.floor(totalTableLength / rowsPerPage);
  if (totalTableLength % rowsPerPage !== 0) {
    pageNum += 1;
  }
  if (pageNum === 0 && totalTableLength !== 0) {
    pageNum = 1;
  }

  return pageNum;
};

// Page index begins with page index 0
export const computePageIndex = (rowCount: number, rowsPerPage: number) => {
  const pageIdx = Math.floor((rowCount - 1) / rowsPerPage);
  return pageIdx >= 0 ? pageIdx : 0;
};
