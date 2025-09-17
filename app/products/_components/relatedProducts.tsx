import { ProductCard } from "@/components/ui/product-card"
import { dbProductwihtoutAll } from "@/actions/product"

interface RelatedProductsProps {
  products: dbProductwihtoutAll[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-6">Related Items</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.slice(0,8).map((product, index) => (
      <ProductCard product={product} key={index}/>
        ))}
      </div>
    </div>
  )
}
