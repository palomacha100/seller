<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Bar } from 'vue-chartjs';
import { fetchAnalysis } from '@/api/analisysService';
import TitleStyled from './TitleStyled.vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartOptions
} from 'chart.js';
import Swal from 'sweetalert2';

const imagePath = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const { storeId } = defineProps<{ storeId: number }>();

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function calculateAverageRevenue() {
  const revenueData = [
    { day: 'Sunday', revenue: [100, 150, 200] },
    { day: 'Monday', revenue: [90, 120, 110] },
    { day: 'Tuesday', revenue: [80, 85, 90] },
    { day: 'Wednesday', revenue: [70, 60, 65] },
    { day: 'Thursday', revenue: [60, 70, 75] },
    { day: 'Friday', revenue: [120, 130, 125] },
    { day: 'Saturday', revenue: [150, 160, 170] }
  ];

  return revenueData.map(dayData => {
    const totalRevenue = dayData.revenue.reduce((a, b) => a + b, 0);
    const averageRevenue = totalRevenue / dayData.revenue.length;
    return averageRevenue;
  });
}

const src = ref('');

const chartData = ref({
  labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  datasets: [
    {
      label: 'Faturamento médio em R$',
      backgroundColor: '#2c5c8f',
      maxBarThickness: 30,
      data: calculateAverageRevenue()
    }
  ]
});

const chartOptions = ref<ChartOptions<'bar'>>({
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    }
  }
});

const getAnalysis = async (storeId: number) => {
  try {
    const image = await fetchAnalysis(storeId);
    if (image) {
      imagePath.value = `${image}?${Date.now()}`;
      src.value = imagePath.value;
    } else {
      errorMessage.value = 'Falha ao carregar a imagem da análise';
    }
  } catch (error) {
    errorMessage.value = 'Erro ao buscar dados de análise';
    Swal.fire('Erro ao carregar a imagem');
  }
};

onMounted(async () => {
  await getAnalysis(storeId);
});
</script>

<template>
  <div class="container reports">
    <div class="row justify-content-center mb-4">
      <div class="col text-center">
        <TitleStyled className="title-container" title="Dashboard - Análise dos últimos 30 dias"/>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6 mb-4">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Média de faturamento por dia</h2>
          </div>
          <div class="card-body">
            <Bar v-if="chartOptions" :data="chartData" :options="chartOptions" />
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Vendas por Produto e Dia da Semana</h2>
          </div>
          <div class="card-body text-center">
            <div v-if="src">
              <img class="img-fluid img-graphs" :src="src" alt="média de venda de produtos por dia">
            </div>
            <div v-else>
              <h2>Carregando...</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.reports {
  background-color: #f8f9fa; 
  padding: 0.5rem;
  border-radius: 5px;
}

.card {
  border-radius: 0.25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  width: 500px;
}

.card-title {
  font-size: 1.25rem;
  margin-top: 10px;
  color: var(--dark-gray);
  text-align: center;
}

.img-graphs {
  max-width: 500px;
  height: auto;
}

.text-center h2 {
  font-size: 1.25rem;
  text-align: start;
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 20px
}
</style>