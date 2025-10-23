const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3334;

const sampleResponse = {
  quoteId: "Q123456789",
  carrier: "Mock Insurance Co",
  term: "6 months",
  totalPremium: 582.45,
  monthlyPremium: 97.07,
  state: "MD",
  breakdown: [ { vehicle: "2020 Honda Civic", premium: 320.15 } ],
  chosenCoverage: {
    liability: { biPerPerson: 100000, biPerAccident: 300000, pd: 100000 },
    umUim: true,
    pipMedpay: false,
    collisionDeductible: 500,
    compDeductible: 500,
    roadside: false,
    rental: false
  }
};

app.post('/quotes', (req, res) => {
  // In a real server you'd validate request and compute a quote.
  // Here we return a static response merging any provided state.
  const resp = Object.assign({}, sampleResponse, { state: (req.body && req.body.state) || sampleResponse.state });
  res.json(resp);
});

app.get('/quotes/:id', (req, res) => {
  res.json(Object.assign({}, sampleResponse, { quoteId: req.params.id }));
});

app.use(express.static('.'));

app.listen(PORT, () => {
  console.log(`Mock AutoQuote server listening on http://localhost:${PORT}`);
});
