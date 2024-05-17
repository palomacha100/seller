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
    if (image) {
      formData.append('store[image]', image)
    }
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
  async updateStore(
    id: number,
    data: any,
    image: File | string | null,
    onSuccess: () => void,
    onFailure: () => void
  ) {
    const formData = new FormData()
    if (image) {
      formData.append('store[image]', image)
    }
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
    const response = await this.update(id, 'stores', formData)
    if (response.ok) {
      this.success(response, onSuccess)
    } else {
      this.failure(response, onFailure)
    }
  }

  async deleteStore(id: number, onSuccess: () => void, onFailure: () => void) {
    const response = await this.delete(id, 'stores')
    if (response.ok) {
      onSuccess()
    } else {
      this.failure(response, onFailure)
    }
  }

  failure(response: Response, onFailure: () => void) {
    onFailure()
  }

  success(response: Response, onSuccess: () => void) {
    onSuccess()
  }
}

export { StoreService }
