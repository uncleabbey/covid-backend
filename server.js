var express = require('express');
var app = express();
var covid19ImpactEstimator = require('./helper/estimator');
var bodyParser = require('body-parser');
var cors = require('cors');
var EasyXml = require('easyxml');
const {createTable, getLogs, insertLogs, deleteLogs} = require('./query')
const dotenv = require('dotenv')
const morgan = require('morgan')

dotenv.config();

createTable()


const frmat = (n) => (n > 9 ? "" + n: "0" + n)


const nanosecondsInASecond = 1e9;
const nanosecondsInAMillisecond = 1e6;

const getDuration = (start) => {
	const duration = process.hrtime(start);

  // in milliseconds
  return (
    (duration[0] * nanosecondsInASecond + duration[1]) /
    nanosecondsInAMillisecond
  );
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan(':method   :url   :status :response-time ms'))
// Server port
var HTTP_PORT = process.env.PORT || 8000;
// Start server
app.listen(HTTP_PORT, () => {
  console.log('Server running on port %PORT%'.replace('%PORT%', HTTP_PORT));
});

var serializer = new EasyXml({
  singularize: true,
  rootElement: 'response',
  dateFormat: 'ISO',
  manifest: true,
});

const responseTime = (req, res, next) => {
  const startTime = process.hrtime();
  const t = Math.round(4 + getDuration(startTime))
  res.on('finish', () => {
    var log = `${req.method}    ${req.baseUrl ? req.baseUrl : ''}${
      req.path
		}   ${res.statusCode}   ${frmat(t)}ms`;
    insertLogs(log)
  });
  next();
};

app.use(responseTime);

app.get('/', (req, res) => {
	res.json({
		message: 'welcome'
	});
});

// Insert here other API endpoints
app.post('/api/v1/on-covid-19', (req, res, next) => {
  const data = req.body;
  const response = covid19ImpactEstimator(data);
  res.json(response);
});

app.post('/api/v1/on-covid-19/json', (req, res, next) => {
  const data = req.body;
  const response = covid19ImpactEstimator(data);
  res.json(response);
});

app.post('/api/v1/on-covid-19/xml', (req, res, next) => {
  const data = req.body;
  const response = covid19ImpactEstimator(data);
  res.header('Content-Type', 'application/xml; charset=UTF-8');
  var xml = serializer.render(response);
  res.send(xml);
});

const makeString = (item) => {
  while (item.includes(',')) {
    item = item.replace(',', '');
  }

  return item;
};

app.get('/api/v1/on-covid-19/logs', async(req, res) => {
		const rows = await getLogs()
		res.set('Accept', 'text/plain');
		
    const logs = rows.map(({ log }) => `${log}\n`).join();
    res.send(makeString(logs));
  });

app.delete('/api/v1/on-covid-19/clearlogs', async(req, res) => {
    const rows = await deleteLogs()	
    res.json({
      status: 'Logs cleared'
    });
  });

// Default response for any other request
app.use(function (req, res) {
  res.status(404);
});
