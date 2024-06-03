<script setup lang="ts">
  import { ref, computed } from 'vue';
  import TitleStyled from './TitleStyled.vue';
  import ButtonStyled from './ButtonStyled.vue';
  
  interface Order {
    id: number;
    customerName: string;
    status: string;
    items: Array<{ id: number; name: string; price: string }>;
    total: string;
    address: string;
    expanded: boolean;
  }
  
  const orders = ref<Order[]>([
    {
      id: 1,
      customerName: 'Cliente 1',
      status: 'new',
      items: [
        { id: 1, name: 'Item 1', price: 'R$ 10,00' },
        { id: 2, name: 'Item 2', price: 'R$ 20,00' },
      ],
      total: 'R$ 30,00',
      address: 'Rua Exemplo, 123',
      expanded: false,
    },
  ]);
  
  const filter = ref('all');
  
  const filteredOrders = computed(() => {
    if (filter.value === 'all') return orders.value;
    return orders.value.filter(order => order.status === filter.value);
  });
  
  const filterOrders = (status: string) => {
    filter.value = status;
  };
  
  const toggleOrderDetails = (orderId: number) => {
    const order = orders.value.find(order => order.id === orderId);
    if (order) order.expanded = !order.expanded;
  };
  
  const acceptOrder = (orderId: number) => {
  const order = orders.value.find(order => order.id === orderId);
  if (order) {
    order.status = 'preparing';
  }
};

const completeOrder = (orderId: number) => {
  const order = orders.value.find(order => order.id === orderId);
  if (order) {
    order.status = 'completed';
  }
};

const cancelledOrder = (orderId: number) => {
  const order = orders.value.find(order => order.id === orderId);
  if (order) {
    order.status = 'cancelled';
  }
}
  
  const rejectOrder = (orderId: number) => {
    const order = orders.value.find(order => order.id === orderId);
    if (order) {
    order.status = 'cancelled';
  }
  };
  
  const openChat = (orderId: number) => {
    console.log(`Abrindo chat para o pedido ${orderId}.`);
    // Implementar lógica para abrir chat
  };
  </script>
<template>
    <div class="order-management-container">
      <TitleStyled class="title-styled" title="Gerenciamento de Pedidos"/>
  
      <div class="filter-buttons">
        <ButtonStyled className="login-button" @click="filterOrders('all')" label="Todos"
        width="10rem"
        height="2.5rem"/>
        <ButtonStyled @click="filterOrders('new')" label="Novos" className="login-button" width="10rem"
        height="2.5rem"/>
        <ButtonStyled @click="filterOrders('preparing')" label="Preparando"
        className="login-button" width="10rem"
        height="2.5rem"/>
        <ButtonStyled @click="filterOrders('completed')" label="Finalizados" className="login-button" width="10rem"
        height="2.5rem"/>
        <ButtonStyled @click="filterOrders('cancelled')" label="Cancelados" className="login-button" width="10rem"
        height="2.5rem"/>
      </div>
  
      <div v-for="order in filteredOrders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-info">
            <p>Nome: {{ order.customerName }}</p>
            <p>Número do Pedido: {{ order.id }}</p>
            <p>Status: {{ order.status }}</p>
          </div>
          <ButtonStyled @click="toggleOrderDetails(order.id)" label="Exibir detalhes"/>
        </div>
        
        <div v-if="order.expanded" class="order-details">
          <div v-for="item in order.items" :key="item.id" class="order-item">
            <p>{{ item.name }} - {{ item.price }}</p>
          </div>
          <p>Total: {{ order.total }}</p>
          <p>Nome: {{ order.customerName }}</p>
          <p>Endereço: {{ order.address }}</p>
          <div class="order-actions">
            <ButtonStyled v-if="order.status === 'new'" @click="acceptOrder(order.id)" label="Aceitar"/>
            <ButtonStyled v-if="order.status === 'new'" @click="rejectOrder(order.id)" label="Recusar"/>
            <ButtonStyled v-if="order.status === 'preparing'" @click="completeOrder(order.id)" label="Finalizar"/>
            <ButtonStyled v-if="order.status === 'preparing'" @click="cancelledOrder(order.id)" label="Cancelar"/>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <style scoped>
  .order-management-container {
    width: 80%;
    margin: 30px auto;
  }
  
  .filter-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .order-card {
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
    justify-content: space-around;
    margin-top: 10px;
  }
  </style>
  