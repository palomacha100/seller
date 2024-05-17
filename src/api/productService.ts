import { BaseService } from './baseService'

class ProductService extends BaseService {
  constructor() {
    super()
  }
  async getProducts(id: number, onSuccess: () => void, onFailure: () => void) {
    const response = await this.getAll(`stores/${id}/products`)
    if (response.ok) {
      this.success(response, onSuccess)
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

export { ProductService }
