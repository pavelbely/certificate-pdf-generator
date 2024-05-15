import fs from 'fs';
import Papa from 'papaparse';

const csv_to_convert = fs.createReadStream('./scripts/csv_to_convert.csv');

Papa.parse(csv_to_convert, {
  header: true,
  complete: (result) => {
    let price_data = result.data.map(({ ID, Price }) => ({ ID, Price }));
    fs.writeFileSync(
      './scripts/csv_converted.json',
      JSON.stringify(price_data)
    );
  },
});
