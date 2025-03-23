const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

app.post('/calculate-data', (req, res) => {
  console.log('Request received:', req.body);
  const { file, product } = req.body;

  try {
    const filePath = path.join('/faizan_PV_dir/', file);
    console.log({filePath});
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        file,
        error: 'File not found.',
      });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    console.log({fileContent});

    const rows = fileContent.trim().split('\n');
    const headers = rows[0].split(',');
    const data = rows
      .slice(1)
      .map((line) =>
        Object.fromEntries(
          line.split(',').map((value, index) => [headers[index], value])
        )
      );

    const filteredData = data.filter((row) => row.product === product);

    console.log({filteredData});

    if (filteredData.length === 0) {
      return res.json({
        file,
        sum: 0,
      });
    }

    const sum = filteredData.reduce(
      (acc, row) => acc + parseFloat(row.amount.trim()),
      0
    );

    console.log({sum});

    return res.json({
      file,
      sum,
    });
  } catch (error) {
    return res.status(500).json({
      file,
      error: 'An error occurred while processing the file.',
      message: error.message,
      c: 'two'
    });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
