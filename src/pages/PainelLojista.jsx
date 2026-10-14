import { formatarPreco } from '../utils/formatarPreco'

const CATEGORIAS = [
    { id: 'roupas', nome: 'Roupas' },
    { id: 'eletronicos', nome: 'Eletrônicos' },
    { id: 'acessorios', nome: 'Acessórios' },
    { id: 'casa', nome: 'Casa' },
]

export default function PainelLojista({ produtos }) {
    const withPrice = produtos.filter((produto) => Number.isFinite(Number(produto.price)))
    const produtosEsgotados = produtos.filter((produto) => produto.estoque === 0)
    const produtosSemPreco = produtos.filter((produto) => !Number.isFinite(Number(produto.price)))

    const resumoPorCategoria = CATEGORIAS.map((categoria) => {
        const itensCategoria = withPrice.filter((produto) => produto.category === categoria.id)
        const valorEstoque = itensCategoria.reduce(
            (total, produto) => total + Number(produto.price) * Number(produto.estoque || 0),
            0
        )

        const lucroEstimado = itensCategoria.reduce((total, produto) => {
            const margem = produto.precoOriginal ? Number(produto.precoOriginal) - Number(produto.price) : Number(produto.price) * 0.35
            return total + Math.max(margem, 0) * Number(produto.estoque || 0)
        }, 0)

        return {
            ...categoria,
            valorEstoque,
            lucroEstimado,
            qtdItens: itensCategoria.length,
        }
    })

    const valorTotalEstoque = resumoPorCategoria.reduce((total, categoria) => total + categoria.valorEstoque, 0)
    const lucroTotalEstimado = resumoPorCategoria.reduce((total, categoria) => total + categoria.lucroEstimado, 0)

    return (
        <section>
            <p className="sobretitulo">Painel do lojista</p>
            <h1>Resumo da loja</h1>

            <div className="painel-grid">
                <div className="painel-card painel-card-destaque">
                    <span className="painel-label">Dinheiro em estoque</span>
                    <strong>{formatarPreco(valorTotalEstoque)}</strong>
                    <small>Valor bruto disponível hoje</small>
                </div>

                <div className="painel-card">
                    <span className="painel-label">Produtos sem preço</span>
                    <strong>{produtosSemPreco.length}</strong>
                    <small>Esperando cadastro do time de suprimentos</small>
                </div>

                <div className="painel-card">
                    <span className="painel-label">Clientes esperando</span>
                    <strong>{produtosEsgotados.length}</strong>
                    <small>Produtos esgotados em fila de reposição</small>
                </div>

                <div className="painel-card">
                    <span className="painel-label">Lucro estimado</span>
                    <strong>{formatarPreco(lucroTotalEstimado)}</strong>
                    <small>Baseado no ticket médio por categoria</small>
                </div>
            </div>

            <div className="painel-bloco">
                <h2>Estoque por categoria</h2>

                <div className="tabela-moldura">
                    <table className="tabela">
                        <thead>
                            <tr>
                                <th>Categoria</th>
                                <th>Itens em estoque</th>
                                <th>Valor em estoque</th>
                                <th>Lucro estimado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resumoPorCategoria.map((categoria) => (
                                <tr key={categoria.id}>
                                    <td>{categoria.nome}</td>
                                    <td>{categoria.qtdItens}</td>
                                    <td>{formatarPreco(categoria.valorEstoque)}</td>
                                    <td>{formatarPreco(categoria.lucroEstimado)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="painel-bloco">
                <h2>Itens em espera</h2>

                <div className="painel-lista">
                    {produtosSemPreco.length === 0 ? (
                        <p className="aviso">Nenhum produto está aguardando preço no momento.</p>
                    ) : (
                        produtosSemPreco.map((produto) => (
                            <div key={produto.id} className="painel-item">
                                <span>{produto.title}</span>
                                <span className="selo selo-alerta">Sem preço</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}
