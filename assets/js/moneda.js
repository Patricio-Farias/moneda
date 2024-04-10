const selectMonedas = document.getElementById('selectMonedas');
const btnBuscar = document.getElementById('btnBuscar');
const resultado = document.getElementById('resultado');
const graficoCanvas = document.getElementById('miGrafico');

async function getMonedas() {
  try {
    const res = await fetch("https://mindicador.cl/api");
    const monedas = await res.json();
    Object.entries(monedas).forEach(([key, value]) => {
      if (key !== 'autor' && key !== 'fecha') {
        selectMonedas.innerHTML += `<option value="${value.valor}">${value.nombre}</option>`;
      }
    });
  } catch (error) {
    alert(error.message);
  }
}

getMonedas();

btnBuscar.addEventListener("click", () => {
  const clpValue = parseFloat(document.getElementById('clpValue').value);
  const convert = clpValue * parseFloat(selectMonedas.value);
  resultado.textContent = 'CLP$ ' + convert.toFixed(2);
});

async function getMonedasPorFecha() {
  const endpoint = "https://mindicador.cl/api/dolar";
  const res = await fetch(endpoint);
  const monedas = await res.json();
  return monedas;
}

async function renderGrafico() {
  const monedas = await getMonedasPorFecha();
  const fechas = monedas.serie.map(moneda => moneda.fecha);
  const valores = monedas.serie.map(moneda => Number(moneda.valor));
  
  new Chart(graficoCanvas, {
    type: 'line',
    data: {
      labels: fechas,
      datasets: [{
        label: 'Valor Dólar',
        data: valores,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
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
}

renderGrafico();