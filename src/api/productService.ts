import { BaseService } from './baseService'

class ProductService extends BaseService {
  constructor() {
    super()
  }
  async getProducts(id: number, onSuccess: () => void, onFailure: () => void) {
    const response = await this.getEntity(`stores/${id}/products`)
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

  async updateProduct(
    idStore: number,
    idProduct: number,
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
    const response = await this.update(idProduct, `stores/${idStore}/products`, formData)
    if (response.ok) {
      this.success(response, onSuccess)
    } else {
      this.failure(response, onFailure)
    }
  }

  async deleteProduct(
    idStore: number,
    idProduct: number,
    onSuccess: () => void,
    onFailure: () => void
  ) {
    const response = await this.delete(idProduct, `stores/${idStore}/products`)
    if (response.ok) {
      onSuccess()
    } else {
      this.failure(response, onFailure)
    }
  }

  failure(response: Response, onFailure: () => void) {
    onFailure()
  }

  success(response: Response, onSuccess: () => void, action = 'generate') {
    onSuccess()
    response.json().then((json) => {
      console.log(json)
      if (action === 'generate') {
        const product = {
          id: json.id,
          src: `${this.apiUrl}${json.image_url}`,
          productName: json.title,
          price: json.price,
          description: json.description,
          category: json.category,
          portion: json.portion
        }
        this.storage.store('product', JSON.stringify(product))
      }
    })
  }
}

export { ProductService }
