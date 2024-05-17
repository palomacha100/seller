import { BaseService } from './baseService'

class StoreService extends BaseService {
  constructor() {
    super()
  }

  async getStores(onSuccess: () => void, onFailure: () => void) {
    const response = await this.getAll('stores')
    if (response.ok) {
      this.success(response, onSuccess)
    } else {
      this.failure(response, onFailure)
    }
  }

  async createStore(data: any, image: File, onSuccess: () => void, onFailure: () => void) {
    const formData = new FormData()
    formData.append('store[image]', image)
    formData.append('store[name]', data.fullName.value)
    formData.append('store[cnpj]', data.cnpj.value)
    formData.append('store[phonenumber]', data.phoneNumber.value)
    formData.append('store[cep]', data.cep.value)
    formData.append('store[state]', data.state.value)
    formData.append('store[city]', data.city.value)
    formData.append('store[neighborhood]', data.neighborhood.value)
    formData.append('store[address]', data.address.value)
    formData.append('store[numberaddress]', data.numberAddress.value)
    formData.append('store[establishment]', data.establishment.value)
    const response = await this.create('stores', formData)
    if (response.ok) {
      this.success(response, onSuccess)
    } else {
      this.failure(response, onFailure)
    }
  }
  updateStore(id: number, name: string, onSuccess: () => void, onFailure: () => void) {
    const body = {
      store: {
        name: name
      }
    }
    const token = this.getFallback('token')

    fetch(`${URL}/stores/${id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    }).then((response) => {
      if (response.ok) {
        this.success(response, onSuccess)
      } else {
        this.failure(response, onFailure)
      }
    })
  }
  deleteStore(id: number, onSuccess: () => void, onFailure: () => void) {
    const token = this.getFallback('token')

    fetch(`${URL}/stores/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        this.success(response, onSuccess)
      } else {
        this.failure(response, onFailure)
      }
    })
  }

  failure(response: Response, onFailure: () => void) {
    onFailure()
  }

  success(response: Response, onSuccess: () => void) {
    onSuccess()
  }
}

export { StoreService }

// import { StoreService } from '../../utils/storeService'
