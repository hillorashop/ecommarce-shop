import { CheckoutContent } from "./_components/checkout-content";

interface Props {
    searchParams: Promise<{ productId?: string; qty?: string; }>
}

export default async function CheckoutPage({searchParams}:Props) {
    const resolvedSearchParams = await searchParams;

  const productId = resolvedSearchParams?.productId
  const qty = resolvedSearchParams?.qty ? Number(resolvedSearchParams.qty) : undefined;


  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-10">
    <CheckoutContent productId={productId}   qty={qty}/>
      </main>
    </div>
  );
}
