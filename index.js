const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

app.post('/calculate-data', (req, res) => {
  const { file, product } = req.body;

  try {
    const filePath = path.join(__dirname, '/app/', file);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        file,
        error: 'File not found.',
      });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');

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

    if (filteredData.length === 0) {
      return res.json({
        file,
        sum: 0,
      });
    }

    const sum = filteredData.reduce(
      (acc, row) => acc + parseFloat(row.amount),
      0
    );

    return res.json({
      file,
      sum,
    });
  } catch (error) {
    return res.status(500).json({
      file,
      error: 'An error occurred while processing the file.',
      des: error.message,
      ddd: error.response,
    });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
