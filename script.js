google.charts.load('current', {
    'packages': ['corechart']
});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    let policy = {
        "2024": {
            "single": {
                "magi_min": 146000,
                "magi_max": 161000,
                "contrib_limit": 7000,
                "contrib_limit_over_50": 8000,
            },
            "married": {
                "magi_min": 230000,
                "magi_max": 240000,
                "contrib_limit": 7000,
                "contrib_limit_over_50": 8000,
            }
        },
        "2025": {
            "single": {
                "magi_min": 150000,
                "magi_max": 165000,
                "contrib_limit": 7000,
                "contrib_limit_over_50": 8000,
            },
            "married": {
                "magi_min": 236000,
                "magi_max": 246000,
                "contrib_limit": 7000,
                "contrib_limit_over_50": 8000,
            }
        },
        "2023": {
            "single": {
                "magi_min": 138000,
                "magi_max": 153000,
                "contrib_limit": 6500,
                "contrib_limit_over_50": 7500,
            },
            "married": {
                "magi_min": 218000,
                "magi_max": 228000,
                "contrib_limit": 6500,
                "contrib_limit_over_50": 7500,
            }
        },
        "2022": {
            "single": {
                "magi_min": 129000,
                "magi_max": 144000,
                "contrib_limit": 6000,
                "contrib_limit_over_50": 7000,
            },
            "married": {
                "magi_min": 204000,
                "magi_max": 214000,
                "contrib_limit": 6000,
                "contrib_limit_over_50": 7000,
            }
        }
    }

    let year = document.getElementById("years").value;
    let isMarried = document.getElementById("married").checked;
    let isOld = document.getElementById("old").checked;
    let sal = document.getElementById("income").value;

    console.log(year, isMarried, isOld, sal)

    p = isMarried ? policy[year]["married"] : policy[year]["single"];

    console.log(p)

    salaryBottomSingle = p["magi_min"];
    salaryTopSingle = p["magi_max"];
    contribLimit = isOld ? p["contrib_limit_over_50"]: p["contrib_limit"];

    console.log(contribLimit)

    function calculateTrad(inc) {
        if (inc < salaryBottomSingle) {
            return 0;
        };
        if (inc > salaryTopSingle) {
            return contribLimit;
        };
        return ((inc - salaryBottomSingle) * (contribLimit)) / (salaryTopSingle - salaryBottomSingle);
    };

    let incomes = [
        ['Income', 'Roth', 'Traditional'],
    ];
    incomes.push([0, contribLimit, 0]);
    for (let income = salaryBottomSingle; income <= salaryTopSingle; income += 100) {
        let tradContrib = calculateTrad(income);
        let rothContrib = contribLimit - tradContrib;

        incomes.push([income, parseFloat(rothContrib.toFixed(2)), parseFloat(tradContrib.toFixed(2))]);
    }

    incomes.push([400000, 0, contribLimit]);

    console.log(incomes);
    var data = google.visualization.arrayToDataTable(incomes);

    let window = 5000;

    var options = {
        title: 'Roth IRA Income Contrib Maxes',
        legend: {
            position: 'bottom'
        },
        hAxis: {
            viewWindow: {
                max: salaryTopSingle + window,
                min: salaryBottomSingle - window
            }
        },
    };

    if (sal && sal > 0) {
        document.getElementById('contribution').innerHTML ="<p>" + "Trad Contribution: $" + calculateTrad(sal).toFixed(2) + " </p> <p> Roth Contribution:  $"+ (contribLimit - calculateTrad(sal)).toFixed(2) + "</p>";
    }

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}
