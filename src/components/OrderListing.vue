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

const orders = ref<Order[]>([])

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
    orderService.acceptOrder(storeId, orderId, (data: any) => {
      order.status = data.order.state
    }, () => {
      console.error('Failed to accept order')
    })
  }
}

const completeOrder = (orderId: number) => {
  const order = orders.value.find((order) => order.id === orderId)
  if (order) {
    orderService.completeOrder(storeId, orderId, (data: any) => {
      console.log(data)
      order.status = data.order.state
    }, () => {
      console.error('Failed to complete order')
    })
  }
}

const cancelledOrder = (orderId: number) => {
  const order = orders.value.find((order) => order.id === orderId)
  if (order) {
    orderService.cancelOrder(storeId, orderId, (data: any) => {
      console.log(data)
      order.status = data.order.state
    }, () => {
      console.error('Failed to cancel order')
    })
  }
}

const dispatchOrder = (orderId: number) => {
  const order = orders.value.find((order) => order.id === orderId)
  if (order) {
    orderService.dispatchOrder(storeId, orderId, (data: any) => {
      console.log(data)
      order.status = data.order.state
    }, () => {
      console.error('Failed to dispatch order')
    })
  }
}

onMounted(() => {
  orderService.sseOrderUpdates(storeId, 
  (data: any) => {
    const parse = JSON.parse(data)
    orders.value = parse.orders
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
      <TitleStyled className="title-container" title="Gerenciamento de Pedidos" />
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
            v-if="order.status === 'payment_confirmed'"
            @click="acceptOrder(order.id)"
            label="Aceitar"
          />
          <ButtonStyled
            className="small-green-button"
            v-if="order.status === 'accepted'"
            @click="completeOrder(order.id)"
            label="Finalizar"
          />
          <ButtonStyled
            className="small-green-button"
            v-if="order.status === 'ready_to_dispatch'"
            @click="dispatchOrder(order.id)"
            label="Entregar"
          />
          <ButtonStyled
            className="small-red-button"
            v-if="order.status === 'accepted' || order.status === 'payment_confirmed'"
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
