console.log("server URL:", window.portLink);
document.addEventListener("DOMContentLoaded", ()=> {loadCountries();})
let pieChart= null;

const selection = document.getElementById("selectCountry");
selection.addEventListener("change", (country) => {
    const selectedCountry = country.target.value;
    console.log(`selected country in scriptjs: ${selectedCountry}`);
    if (selectedCountry){
        updateChart(selectedCountry);
    }
});


async function loadCountries(){
    console.log("loadCountries called");
    const response = await fetch("/countries");
    const countries = await response.json();
    //console.log(`countriesList: ${countries}`);
    selection.innerHTML = "";

    countries.forEach(country => {
        const option = document.createElement("option");
        option.value = country;
        option.textContent = country;
        selection.appendChild(option);
    });
    console.log("Dropdown populated");
}

async function updateChart(country){
    console.log("called update Chart");
    const response = await fetch(`/country-data/${country}`);
    if (!response.ok){
        console.log("response was NOT ok");
        return;
    }
    console.log("response was ok");
    const data = await response.json();
    console.log(`data from json: ${data}`);
    const pieChartData = [
        data.basic,
        data.limited,
        data.unimproved,
        data.surfaceWater
    ];
    console.log(`piechart data: ${pieChartData}`);
    console.log(pieChartData);

    if (pieChart){
        pieChart.destroy();
    } 
    var ctx = document.getElementById('myChart').getContext('2d');
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['At least basic', 'Limited', 'Unimproved', 'Surface water'],
            datasets: [{
                label: 'Votes',
                data: pieChartData,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(223, 135, 1, 0.6)',
                    'rgba(237, 1, 1, 0.6)',
                    
                    
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(252, 101, 0, 1)',
                    'rgba(255, 0, 0, 1)',
                    
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels:{
                        color: "white",
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2);
                        }
                    }
                }
            }
        }
    });
    
}
