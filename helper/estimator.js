const infectionsByRequestedTime = (data, theCurrentlyInfected) => {
  let infected = null;
  const { periodType, timeToElapse } = data;
  switch (periodType) {
    case 'weeks':
      infected = theCurrentlyInfected * 2 ** Math.trunc((timeToElapse * 7) / 3);
      break;
    case 'months':
      infected = theCurrentlyInfected * 2 ** Math.trunc((timeToElapse * 30) / 3);
      break;
    default:
      infected = theCurrentlyInfected * 2 ** Math.trunc(timeToElapse / 3);
  }
  return infected;
};

const currentlyInfected = (reportedCases, estimate) => reportedCases * estimate;

const severeCasesByRequestedTime = (time) => time * 0.15;

const hospitalBedsByRequestedTime = (data, severity) => {
  const { totalHospitalBeds } = data;
  const availableBeds = totalHospitalBeds * 0.35;
  return availableBeds - severity;
};


const casesForICUByRequestedTime = (infections) => infections * 0.05;

const casesForVentilatorsByRequestedTime = (infections) => infections * 0.02;

const dollarsInFlight = (data, infection) => {
  const { avgDailyIncomePopulation, avgDailyIncomeInUSD } = data.region;
  const { periodType, timeToElapse } = data;
  let dollars;
  switch (periodType) {
    case 'weeks':
      dollars = (infection
        * avgDailyIncomePopulation
        * avgDailyIncomeInUSD)
        / (timeToElapse * 7);
      break;
    case 'months':
      dollars = (infection
        * avgDailyIncomePopulation
        * avgDailyIncomeInUSD)
        / (timeToElapse * 30);
      break;
    default:
      dollars = (infection
        * avgDailyIncomePopulation
        * avgDailyIncomeInUSD)
        / (timeToElapse);
  }
  return dollars;
};

const covid19ImpactEstimator = (data) => {
  const { reportedCases } = data;
  const infections = infectionsByRequestedTime(
    data,
    currentlyInfected(reportedCases, 10)
  );
  const infectionsFS = infectionsByRequestedTime(
    data,
    currentlyInfected(reportedCases, 50)
  );
  const severeCaseFI = (severeCasesByRequestedTime(infections));
  const severeCaseFS = (severeCasesByRequestedTime(infectionsFS));
  return {
    data,
    impact: {
      currentlyInfected: currentlyInfected(reportedCases, 10),
      infectionsByRequestedTime: infections,
      severeCasesByRequestedTime: severeCaseFI,
      hospitalBedsByRequestedTime: Math.trunc(hospitalBedsByRequestedTime(data, severeCaseFI)),
      casesForICUByRequestedTime: casesForICUByRequestedTime(infections),
      casesForVentilatorsByRequestedTime: Math.trunc(
        casesForVentilatorsByRequestedTime(infections)
      ),
      dollarsInFlight: Math.trunc(dollarsInFlight(data, infections))
    },
    severeImpact: {
      currentlyInfected: currentlyInfected(reportedCases, 50),
      infectionsByRequestedTime: infectionsFS,
      severeCasesByRequestedTime: severeCaseFS,
      hospitalBedsByRequestedTime: Math.trunc(hospitalBedsByRequestedTime(data, severeCaseFS)),
      casesForICUByRequestedTime: casesForICUByRequestedTime(infectionsFS),
      casesForVentilatorsByRequestedTime: Math.trunc(
        casesForVentilatorsByRequestedTime(infectionsFS)
      ),
      dollarsInFlight: Math.trunc(dollarsInFlight(data, infectionsFS))
    }
  };
};


module.exports = covid19ImpactEstimator;
