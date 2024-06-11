<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { OrderService } from '@/api/orderService'
import TitleStyled from './TitleStyled.vue'
import ButtonStyled from './ButtonStyled.vue'
import ContainerStyled from './ContainerStyled.vue'
import TextStyled from './TextStyled.vue'

const {storeId} = defineProps<{
  storeId: number
}>()

interface Order {
  id: number
  customerName: string
  status: string
  items: Array<{ id: number; name: string; price: string }>
  total: string
  address: string
  expanded: boolean
}

const orderService = new OrderService();

const orders = ref<Order[]>([
  {
    id: 1,
    customerName: 'Cliente 1',
    status: 'novo',
    items: [
      { id: 1, name: 'Item 1', price: 'R$ 10,00' },
      { id: 2, name: 'Item 2', price: 'R$ 20,00' }
    ],
    total: 'R$ 30,00',
    address: 'Rua Exemplo, 123',
    expanded: false
  }
])

const filter = ref('todos')

const filteredOrders = computed(() => {
  if (filter.value === 'todos') return orders.value
  return orders.value.filter((order) => order.status === filter.value)
})

const filterOrders = (status: string) => {
  filter.value = status
}

const toggleOrderDetails = (orderId: number) => {
  const order = orders.value.find((order) => order.id === orderId)
  if (order) order.expanded = !order.expanded
}

const acceptOrder = (orderId: number) => {
  const order = orders.value.find((order) => order.id === orderId)
  if (order) {
    order.status = 'preparando'
  }
}

const completeOrder = (orderId: number) => {
  const order = orders.value.find((order) => order.id === orderId)
  if (order) {
    order.status = 'finalizado'
  }
}

const cancelledOrder = (orderId: number) => {
  const order = orders.value.find((order) => order.id === orderId)
  if (order) {
    order.status = 'cancelado'
  }
}

const rejectOrder = (orderId: number) => {
  const order = orders.value.find((order) => order.id === orderId)
  if (order) {
    order.status = 'cancelado'
  }
}

const openChat = (orderId: number) => {
  console.log(`Abrindo chat para o pedido ${orderId}.`)
  // Implementar lógica para abrir chat
}

onMounted(() => {
  orderService.sseOrderUpdates(storeId, 
  (data: any) => {
    const parse = JSON.parse(data)
    orders.value = parse.orders
    console.log(parse)
    console.log(orders.value)
  }, () => {}) 
  }
)

const getStatusClass = (status: string) => {
  switch (status) {
    case 'novo':
      return 'green-text'
    case 'preparando':
      return 'yellow-text'
    case 'finalizado':
      return 'gray-text'
    case 'cancelado':
      return 'red-text'
    default:
      return 'gray-text'
  }
}
</script>

<template>
  <div class="order-management-container">
    <ContainerStyled class="title-container">
      <TitleStyled class="title-styled" title="Gerenciamento de Pedidos" />
    </ContainerStyled>
    <ContainerStyled class="buttons-container">
      <ButtonStyled @click="filterOrders('todos')" label="todos" className="small-blue-button" />
      <ButtonStyled @click="filterOrders('novo')" label="novo" className="small-green-button" />
      <ButtonStyled
        @click="filterOrders('preparando')"
        label="preparando"
        className="small-yellow-button"
      />
      <ButtonStyled
        @click="filterOrders('finalizado')"
        label="finalizado"
        className="small-gray-button"
      />
      <ButtonStyled
        @click="filterOrders('cancelado')"
        label="cancelado"
        className="small-red-button"
      />
    </ContainerStyled>

    <div v-for="order in filteredOrders" :key="order.id" class="order-card">
      <div class="order-header">
        <div class="order-info">
          <TextStyled class="gray-text" :text="`Cliente: ${order.customerName}`" />
          <TextStyled class="gray-text" :text="`Número do pedido: ${order.id}`" />
          <TextStyled :className="getStatusClass(order.status)" :text="`Status: ${order.status}`" />
        </div>
        <ButtonStyled
          className="small-blue-button"
          @click="toggleOrderDetails(order.id)"
          label="Exibir detalhes"
        />
      </div>

      <div v-if="order.expanded" class="order-details">
        <div v-for="item in order.items" :key="item.id" class="order-item">
          <p>{{ item.name }} - {{ item.price }}</p>
        </div>
        <p>Total: {{ order.total }}</p>
        <p>Endereço: {{ order.address }}</p>
        <div class="order-actions">
          <ButtonStyled
            className="small-green-button"
            v-if="order.status === 'novo'"
            @click="acceptOrder(order.id)"
            label="Aceitar"
          />
          <ButtonStyled
            className="small-red-button"
            v-if="order.status === 'novo'"
            @click="rejectOrder(order.id)"
            label="Recusar"
          />
          <ButtonStyled
            className="small-green-button"
            v-if="order.status === 'preparando'"
            @click="completeOrder(order.id)"
            label="Finalizar"
          />
          <ButtonStyled
            className="small-red-button"
            v-if="order.status === 'preparando'"
            @click="cancelledOrder(order.id)"
            label="Cancelar"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-management-container {
  width: 1100px;
  margin: 30px auto;
}

.filter-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.order-card {
  width: 68.75rem;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info {
  flex: 1;
}

.order-details {
  margin-top: 10px;
}

.order-item {
  margin-left: 10px;
}

.order-actions {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.gray-text {
  color: var(--dark-gray);
  font-weight: 700;
}

.green-text {
  color: var(--green);
  font-weight: 700;
}

.yellow-text {
  color: var(--yellow);
  font-weight: 700;
}

.red-text {
  color: var(--red);
  font-weight: 700;
}
</style>
