function formatPrice(price) {
  return parseInt(price * 100) / 100
}

function getEmployerContribution(employerContribution, price) {
  if (employerContribution.mode === 'dollar') {
    return employerContribution.contribution
  } else {
    var dollarsOff = price * (employerContribution.contribution / 100)
    return dollarsOff
  }
}

function getMedicalPricePerRole(role, costs) {
  var roleCost = costs.find(function (cost) {
    return cost.role === role
  })

  return roleCost.price
}

function calculateMedicalPrice(product, selectedOptions) {
  let price = 0

  selectedOptions.familyMembersToCover.forEach(function (role) {
    price += getMedicalPricePerRole(role, product.costs)
  })

  return price
}

function calculateVolLifePricePerRole(role, coverageLevel, costs) {
  var eeCoverage = coverageLevel.find(function (coverage) {
    return coverage.role === role
  })

  var eeCost = costs.find(function (cost) {
    return cost.role === role
  })

  return (eeCoverage.coverage / eeCost.costDivisor) * eeCost.price
}

function calculateVolLifePrice(product, selectedOptions) {
  var price = 0

  selectedOptions.familyMembersToCover.forEach(function (role) {
    price += calculateVolLifePricePerRole(role, selectedOptions.coverageLevel, product.costs)
  })

  return price
}

function calculateLTDPrice(product, employee, selectedOptions) {
  var price = 0

  if (selectedOptions.familyMembersToCover.includes('ee')) {
    var eeCoverage = product.coverage.find(function (coverage) {
      return coverage.role === 'ee'
    })

    var eeCost = product.costs.find(function (cost) {
      return cost.role === 'ee'
    })

    var salaryPercentage = eeCoverage.percentage / 100

    price += ((employee.salary * salaryPercentage) / eeCost.costDivisor) * eeCost.price
  }

  return price
}

module.exports.calculateProductPrice = function (product, employee, selectedOptions) {
  var price
  var employerContribution

  switch (product.type) {
    case 'medical':
      price = calculateMedicalPrice(product, selectedOptions)
      return formatPrice(price)
    case 'volLife':
      price = calculateVolLifePrice(product, selectedOptions)
      employerContribution = getEmployerContribution(product.employerContribution, price)
      return formatPrice(price - employerContribution)
    case 'ltd':
      price = calculateLTDPrice(product, employee, selectedOptions)
      employerContribution = getEmployerContribution(product.employerContribution, price)
      return formatPrice(price - employerContribution)
    default:
      return 0
  }
}
