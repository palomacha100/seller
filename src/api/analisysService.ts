const fetchAnalysis = async (storeId: number): Promise<string | null> => {
  try {
    const response = await fetch(`http://localhost:3000/analysis/anacor?store_id=${storeId}`)
    const data = await response.json()
    // Garantir que o caminho da imagem está correto
    return data.plot_image ? `http://localhost:3000${data.plot_image}` : null
  } catch (error) {
    console.error('Error fetching analysis data:', error)
    return null
  }
}

export { fetchAnalysis }



  