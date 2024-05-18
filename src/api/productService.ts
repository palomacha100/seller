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

  async createProduct(
    id: number,
    data: any,
    image: File,
    onSuccess: () => void,
    onFailure: () => void
  ) {
    const formData = new FormData()
    if (image) {
      formData.append('product[image]', image)
    }
    formData.append('product[title]', data.productName.value)
    formData.append('product[price]', data.price.value)
    formData.append('product[description]', data.description.value)
    formData.append('product[category]', data.category.value)
    formData.append('product[portion]', data.portion.value)

    const response = await this.create(`stores/${id}/products`, formData)
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
