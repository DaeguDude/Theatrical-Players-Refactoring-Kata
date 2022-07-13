// TODO: adds code to print the statement as HTML in addition to the existing plain text version
// TODO: Theatrical players want to add new kinds of plays to their repertoire, i.e) history and pastoral
function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;

  const format = getFormatter();

  // NOTE: Smell: loop
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];

    const thisAmount = calculateThisAmount(play, perf);

    volumeCredits += calculateVolumeCredit(perf);
    if ("comedy" === play.type)
      volumeCredits += calculateExtraVolumeCredit(perf);

    // print line for this order
    result += ` ${play.name}: ${format(thisAmount / 100)} (${
      perf.audience
    } seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}

function calculateVolumeCredit(perf) {
  return Math.max(perf.audience - 30, 0);
}

function calculateExtraVolumeCredit(perf) {
  return Math.floor(perf.audience / 5);
}

function getFormatter() {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;
}

function calculateThisAmount(play, perf) {
  let result = 0;
  switch (play.type) {
    case "tragedy":
      result = 40000;
      if (perf.audience > 30) {
        result += 1000 * (perf.audience - 30);
      }
      break;
    case "comedy":
      result = 30000;
      if (perf.audience > 20) {
        result += 10000 + 500 * (perf.audience - 20);
      }
      result += 300 * perf.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }

  return result;
}

module.exports = statement;
