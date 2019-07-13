module.exports.calculateProductPrice = function (product, employee, selectedOptions) {
  var price = 0
  var fmtc = selectedOptions.familyMembersToCover
  
// KMC: Lots of if statements in this switch - start there? 
  switch (product.type) {
    case 'medical':
      if (fmtc.includes('ee')) {
        var eeCost = product.costs.find(function (cost) {
          return cost.role === 'ee'
        })

        price += eeCost.price
      }

      if (fmtc.includes('sp')) {
        var spCost = product.costs.find(function (cost) {
          return cost.role === 'sp'
        })

        price += spCost.price
      }

      if (fmtc.includes('ch')) {
        var chCost = product.costs.find(function (cost) {
          return cost.role === 'ch'
        })

        price += chCost.price
      }

      if (fmtc.includes('chs')) {
        var chsCost = product.costs.find(function (cost) {
          return cost.role === 'chs'
        })

        price += chsCost.price
      }

      return parseInt(price * 100) / 100
    case 'volLife':
      if (fmtc.includes('ee')) {
        var eeCoverage = selectedOptions.coverageLevel.find(function (coverage) {
          return coverage.role === 'ee'
        })

        var eeCost = product.costs.find(function (cost) {
          return cost.role === 'ee'
        })

        price += (eeCoverage.coverage / eeCost.costDivisor) * eeCost.price
      }

      if (fmtc.includes('sp')) {
        var spCoverage = selectedOptions.coverageLevel.find(function (coverage) {
          return coverage.role === 'sp'
        })

        var spCost = product.costs.find(function (cost) {
          return cost.role === 'sp'
        })

        price += (spCoverage.coverage / spCost.costDivisor) * spCost.price
      }

      if (product.employerContribution.mode === 'dollar') {
        price = price - product.employerContribution.contribution
      } else {
        var dollarsOff = price * (product.employerContribution.contribution / 100)
        price = price - dollarsOff
      }

      return parseInt(price * 100) / 100
    case 'ltd':
      if (fmtc.includes('ee')) {
        var eeCoverage = product.coverage.find(function (coverage) {
          return coverage.role === 'ee'
        })

        var eeCost = product.costs.find(function (cost) {
          return cost.role === 'ee'
        })

        var salaryPercentage = eeCoverage.percentage / 100

        price += ((employee.salary * salaryPercentage) / eeCost.costDivisor) * eeCost.price
      }

      if (product.employerContribution.mode === 'dollar') {
        price = price - product.employerContribution.contribution
      } else {
        var dollarsOff = price * product.employerContribution.contribution
        price = price - dollarsOff
      }

      return parseInt(price * 100) / 100
    default:
      return 0
  }
}
