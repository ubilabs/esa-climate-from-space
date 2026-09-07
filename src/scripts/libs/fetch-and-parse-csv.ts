import Papa from "papaparse";

const fetchAndParseCSV = <T>(url?: string): Promise<T[]> => {
  if (!url) {
    return Promise.resolve([]);
  }

  return fetch(url)
    .then((response) => response.text())
    .then((csvText) => {
      return new Promise<T[]>((resolve) => {
        Papa.parse(csvText, {
          header: true,
          complete: (results: Papa.ParseResult<T>) => {
            resolve(results.data);
          },
        });
      });
    });
};

export default fetchAndParseCSV;
