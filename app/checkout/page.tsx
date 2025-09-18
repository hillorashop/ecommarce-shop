import { CheckoutContent } from "./_components/checkout-content";

interface Props {
    searchParams: Promise<{ productId?: string }>
}

export default async function CheckoutPage({searchParams}:Props) {
    const resolvedSearchParams = await searchParams;

  const productId = resolvedSearchParams?.productId


  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-10">
    <CheckoutContent productId={productId}/>
      </main>
    </div>
  );
}
