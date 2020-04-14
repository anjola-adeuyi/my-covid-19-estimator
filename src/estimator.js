const covid19ImpactEstimator = (data) => {
  const input = data;

  const impact = {
    currentlyInfected: 0,
    infectionsByRequestedTime: 0,
    //
    severeCasesByRequestedTime: 0,
    hospitalBedsByRequestedTime: 0,
    //
    casesForICUByRequestedTime: 0,
    casesForVentilatorsByRequestedTime: 0,
    dollarsInFlight: 0
  };

  const severeImpact = {
    currentlyInfected: 0,
    infectionsByRequestedTime: 0,
    //
    severeCasesByRequestedTime: 0,
    hospitalBedsByRequestedTime: 0,
    //
    casesForICUByRequestedTime: 0,
    casesForVentilatorsByRequestedTime: 0,
    dollarsInFlight: 0
  };

  // impact
  // ch-1
  impact.currentlyInfected = Math.trunc(input.reportedCases * 10);
  // console.log(impact.currentlyInfected);

  let checkType = input.periodType;
  const numDays;

  switch (checkType) {
    case 'days':
      numDays = input.timeToElapse;
      break;
    case 'weeks':
      numDays = input.timeToElapse * 7;
      break;
    case 'months':
      numDays = input.timeToElapse * 30;
      break;
  }
  const factorDays = Math.trunc(numDays / 3);
  impact.infectionsByRequestedTime = Math.trunc(impact.currentlyInfected * (2 ** factorDays));

  // ch-2
  impact.severeCasesByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * 0.15);

  impact.hospitalBedsByRequestedTime = Math.trunc(input.totalHospitalBeds * 0.95 * (1 - 0.65) - impact.severeCasesByRequestedTime * 0.35);

  // ch-3
  impact.casesForICUByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * 0.05);

  impact.casesForVentilatorsByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * 0.02);

  impact.dollarsInFlight = Math.trunc((impact.infectionsByRequestedTime * input.region.avgDailyIncomePopulation * input.region.avgDailyIncomeInUSD) / numDays );

  // severeImpact
  // ch-1
  severeImpact.currentlyInfected = Math.trunc(input.reportedCases * 50);
  severeImpact.infectionsByRequestedTime = Math.trunc(severeImpact.currentlyInfected * (2 ** factorDays));

  // ch-2
  severeImpact.severeCasesByRequestedTime = Math.trunc( severeImpact.infectionsByRequestedTime * 0.15 );

  severeImpact.hospitalBedsByRequestedTime = Math.trunc(input.totalHospitalBeds * 0.95 * (1 - 0.65) - severeImpact.severeCasesByRequestedTime * 0.35);

  // ch-3
  severeImpact.casesForICUByRequestedTime = Math.trunc(severeImpact.infectionsByRequestedTime * 0.05);

  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    severeImpact.infectionsByRequestedTime * 0.02
  );

  severeImpact.dollarsInFlight = Math.trunc((severeImpact.infectionsByRequestedTime * input.region.avgDailyIncomePopulation * input.region.avgDailyIncomeInUSD) / numDays);

  return {
    data: input,
    impact: impact,
    severeImpact: severeImpact
  };
};

export default covid19ImpactEstimator;

// dataSet = {
//   region: {
//     name: 'Africa',
//     avgAge: 19.7,
//     avgDailyIncomeInUSD: 5,
//     avgDailyIncomePopulation: 0.71
//   },
//   periodType: 'days',
//   timeToElapse: 58,
//   reportedCases: 674,
//   population: 66622705,
//   totalHospitalBeds: 1380614
// };

// console.log(covid19ImpactEstimator(dataSet));
