import { BaseService } from './baseService'

class StoreService extends BaseService {
  constructor() {
    super()
  }

  async getStores(onSuccess: (data?: any) => void, onFailure: () => void) {
    const response = await this.getEntity('stores')
    if (response.ok) {
      this.success(response, onSuccess, 'getAll')
    } else if (response.status === 401) {
      const refresh_token = this.storage.get('refresh_token') || '[]'
      const parseRefresh = refresh_token
      await this.auth.refreshTokens(parseRefresh)
      const newResponse = await this.getEntity('stores')
      if (newResponse.ok) {
        this.success(newResponse, onSuccess, 'getAll')
      } else {
        this.failure(newResponse, onFailure)
      }
    } else {
      this.failure(response, onFailure)
    }
  }

  async getStoresById(id: number, onSuccess: (data: any) => void, onFailure: () => void) {
    const response = await this.getEntity(`stores/${id}`)
    if (response.ok) {
      this.success(response, onSuccess, 'byId')
    } else {
      this.failure(response, onFailure)
    }
  }

  async createStore(data: any, image: File, onSuccess: () => void, onFailure: () => void) {
    const formData = new FormData()
    if (image) {
      formData.append('store[image]', image)
    }
    formData.append('store[name]', data.name.value)
    formData.append('store[cnpj]', data.cnpj.value)
    formData.append('store[phonenumber]', data.phonenumber.value)
    formData.append('store[cep]', data.cep.value)
    formData.append('store[state]', data.state.value)
    formData.append('store[city]', data.city.value)
    formData.append('store[neighborhood]', data.neighborhood.value)
    formData.append('store[address]', data.address.value)
    formData.append('store[numberaddress]', data.numberaddress.value)
    formData.append('store[establishment]', data.establishment.value)
    formData.append('store[theme]', data.theme.value)
    const response = await this.create('stores', formData)
    if (response.ok) {
      this.success(response, onSuccess, 'generate')
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
    console.log(data)
    console.log(data.fullName)
    console.log(data.active)
    formData.append('store[name]', data.fullName)
    formData.append('store[cnpj]', data.cnpj)
    formData.append('store[phonenumber]', data.phoneNumber)
    formData.append('store[cep]', data.cep)
    formData.append('store[state]', data.state)
    formData.append('store[city]', data.city)
    formData.append('store[neighborhood]', data.neighborhood)
    formData.append('store[address]', data.address)
    formData.append('store[numberaddress]', data.numberAddress)
    formData.append('store[establishment]', data.establishment)
    formData.append('store[theme]', data.theme)
    formData.append('store[active]', data.active)
    const response = await this.update(id, 'stores', formData)
    if (response.ok) {
      this.success(response, onSuccess, 'generate')
    } else {
      this.failure(response, onFailure)
    }
  }

    
  async getTheme(onSuccess: (data?: any) => void, onFailure: () => void) {
    const response = await this.getEntity('theme_options')
    if (response.ok) {
      this.success(response, onSuccess)
    } else if (response.status === 401) {
      const refresh_token = this.storage.get('refresh_token') || '[]'
      const parseRefresh = refresh_token
      await this.auth.refreshTokens(parseRefresh)
      const newResponse = await this.getEntity('theme_options')
      if (newResponse.ok) {
        this.success(newResponse, onSuccess)
      } else {
        this.failure(newResponse, onFailure)
      }
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

  success(response: Response, onSuccess: (data?: any) => void, action = '') {
    response.json().then((json) => {
      if (action === 'generate') {
        const store = {
          id: json.id,
          src: `${this.apiUrl}${json.image_url}`,
          name: json.name,
          cnpj: json.cnpj,
          phonenumber: json.phonenumber,
          cep: json.cep,
          state: json.state,
          city: json.city,
          address: json.address,
          neighborhood: json.neighborhood,
          establishment: json.establishment,
          numberaddress: json.numberaddress,
          complementaddress: json.complementadress,
          theme: json.theme,
          active: json.active
        }
        this.storage.store('store', JSON.stringify(store))
        onSuccess()
      } else if (action === 'getAll' && Array.isArray(json)) {
        const storeData = json.map((fields: any) => ({
          id: fields.id,
          name: fields.name,
          image_url: fields.image_url && `${this.apiUrl}${fields?.image_url}`,
          active: fields.active,
          cnpj: fields.cnpj,
          phonenumber: fields.phonenumber,
          cep: fields.cep,
          state: fields.state,
          city: fields.city,
          address: fields.address,
          neighborhood: fields.neighborhood,
          establishment: fields.establishment,
          numberaddress: fields.numberaddress,
          complementaddress: fields.complementadress,
          theme: fields.theme
        }))
        onSuccess(storeData)
      } else if (action == 'byId') {
        const store = {
          id: json.id,
          src: `${this.apiUrl}${json.image_url}`,
          name: json.name,
          cnpj: json.cnpj,
          phonenumber: json.phonenumber,
          cep: json.cep,
          state: json.state,
          city: json.city,
          address: json.address,
          neighborhood: json.neighborhood,
          establishment: json.establishment,
          numberaddress: json.numberaddress,
          complementaddress: json.complementadress,
          theme: json.theme,
          active: json.active
        }
        onSuccess(store)
      } else {
        onSuccess(json)
      }
    })
  }
}

export { StoreService }
