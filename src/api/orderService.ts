import { BaseService } from './baseService';
const X_API_KEY = import.meta.env.VITE_X_API_KEY;
import { fetchEventSource } from '@microsoft/fetch-event-source';

class OrderService extends BaseService {
  constructor() {
    super()
  }
  async sseOrderUpdates(store_id: number, onSuccess: (data: any) => void, onFailure: (error: any) => void) {
    await fetchEventSource(`${this.apiUrl}/stores/${store_id}/orders/new`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.getFallback('token')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X_API_KEY': X_API_KEY,
      },
      async onopen(response) {
        if (response.ok) {
          console.log('Conexão estabelecida');
        } else {
          console.log('Erro ao estabelecer conexão');
        }
      },
      onmessage(msg) {
        if (msg.event === 'new orders') {
          onSuccess(msg.data);
        } else {
          console.log('Evento desconhecido');
          onFailure('body');
        }
      },
      onerror(err) {
        console.log(err);
      }
    });
  }

  async acceptOrder(store_id: number, order_id: number, onSucces: (data: any) => void, onFailure: (error: any) => void) {
    const response = await this.changeState(`stores/${store_id}/orders/${order_id}/accept`);
    if (response.ok) {
      const data = await response.json();
      onSucces(data);
    } else {
      onFailure(response);
    }
  }

  async cancelOrder(store_id: number, order_id: number, onSucces: (data: any) => void, onFailure: (error: any) => void) {
    const response = await this.changeState(`stores/${store_id}/orders/${order_id}/cancel`);
    if (response.ok) {
      const data = await response.json();
      onSucces(data);
    } else {
      onFailure(response);
    }
  }

  async completeOrder(store_id: number, order_id: number, onSucces: (data: any) => void, onFailure: (error: any) => void) {
    const response = await this.changeState(`stores/${store_id}/orders/${order_id}/ready`);
    if (response.ok) {
      const data = await response.json();
      onSucces(data);
    } else {
      onFailure(response);
    }
  }

  async dispatchOrder(store_id: number, order_id: number, onSucces: (data: any) => void, onFailure: (error: any) => void) {
    const response = await this.changeState(`stores/${store_id}/orders/${order_id}/dispatched`);
    if (response.ok) {
      const data = await response.json();
      onSucces(data);
    } else {
      onFailure(response);
    }
  }
}

export { OrderService }
