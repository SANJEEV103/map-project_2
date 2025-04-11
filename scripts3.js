const facilityChart1825 = new Chart(document.getElementById('facilityChart1825'), {
    type: 'bar',
    data: {
        labels: ['No', 'Yes'],
        datasets: [{
            label: 'Access to Facilities vs Educational Institutions',
            data: [191, 126],
            backgroundColor: ['red', 'green'],
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const employmentChart2640 = new Chart(document.getElementById('employmentChart2640'), {
    type: 'pie',
    data: {
        labels: ['Unemployed', 'Employed'],
        datasets: [{
            label: 'Employment Status',
            data: [912, 42],
            backgroundColor: ['grey', 'yellow'],
        }]
    }
});

const govtSchemeChart4160 = new Chart(document.getElementById('govtSchemeChart4160'), {
    type: 'pie',
    data: {
        labels: ['No Benefit', 'Receives Benefit'],
        datasets: [{
            label: 'Benefit from Govt Schemes',
            data: [330, 159],
            backgroundColor: ['brown', 'cyan'],
        }]
    }
});
