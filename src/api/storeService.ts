import { BaseService } from './baseService'

class StoreService extends BaseService {
  constructor() {
    super()
  }

  getStores(onSuccess: () => void, onFailure: () => void) {
    const token = this.getFallback('token')
    fetch(`${URL}/stores`, {
      method: 'GET',
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

  createStore(name: string, image: File, onSuccess: () => void, onFailure: () => void) {
    const formData = new FormData()
    formData.append('store[image]', image)
    formData.append('store[name]', name)

    const token = this.getFallback('token')
    console.log(token)
    console.log(formData)
    fetch(`${URL}/stores`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: formData
    }).then((response) => {
      if (response.ok) {
        this.success(response, onSuccess)
      } else {
        this.failure(response, onFailure)
      }
    })
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
