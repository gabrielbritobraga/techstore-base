import { get } from './api'

function normalizarNumero(valor) {
  if (valor === null || valor === undefined || valor === '') {
    return Number.NaN
  }

  if (typeof valor === 'number') {
    return Number.isFinite(valor) ? valor : Number.NaN
  }

  const texto = String(valor).trim()

  if (!texto) {
    return Number.NaN
  }

  const valorSemMoeda = texto.replace(/R\$\s*/gi, '').replace(/\s/g, '')

  if (!valorSemMoeda) {
    return Number.NaN
  }

  let valorNormalizado = valorSemMoeda

  if (valorSemMoeda.includes(',') && valorSemMoeda.includes('.')) {
    valorNormalizado = valorSemMoeda.replace(/\./g, '').replace(',', '.')
  } else if (valorSemMoeda.includes(',')) {
    valorNormalizado = valorSemMoeda.replace(',', '.')
  }

  const numero = Number(valorNormalizado)
  return Number.isFinite(numero) ? numero : Number.NaN
}

function normalizarProduto(produto) {
  const price = normalizarNumero(produto?.price)

  if (!Number.isFinite(price) || price <= 0) {
    return null
  }

  const precoOriginal = produto?.precoOriginal
  return {
    ...produto,
    price,
    precoOriginal: precoOriginal === undefined || precoOriginal === null ? undefined : normalizarNumero(precoOriginal),
  }
}

// Formato dos produtos documentado em docs/api.md
export function buscarProdutos() {
  return get('/products.json').then((dados) =>
    Array.isArray(dados) ? dados.map(normalizarProduto).filter(Boolean) : []
  )
}
