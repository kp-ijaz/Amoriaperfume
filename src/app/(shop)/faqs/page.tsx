import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  { q: 'Are all fragrances 100% authentic?', a: 'Yes, absolutely. Every fragrance sold on Amoria is sourced directly from authorized distributors and brand partners. We guarantee 100% authenticity on every product.' },
  { q: 'What is the delivery timeframe?', a: 'Standard delivery within UAE takes 3–5 business days. Express delivery (1–2 days) is available in Dubai and Abu Dhabi. We also offer same-day delivery in selected areas.' },
  { q: 'Is there free shipping?', a: 'Yes! Orders over AED 200 qualify for free standard shipping anywhere in the UAE. Orders under AED 200 have a flat shipping fee of AED 25.' },
  { q: 'What is your return policy?', a: 'We accept returns within 7 days of delivery for unopened, sealed products. If you received a damaged or incorrect item, contact us immediately and we\'ll arrange a free replacement.' },
  { q: 'Can I track my order?', a: 'Yes, you\'ll receive a tracking number via WhatsApp and email once your order is shipped. You can also track your order from the My Orders section of your account.' },
  { q: 'What payment methods do you accept?', a: 'We accept credit/debit cards (Visa, Mastercard), Apple Pay, and Cash on Delivery (COD). COD is available with a small AED 10 handling fee.' },
  { q: 'How do I use the Fragrance Finder?', a: 'The Fragrance Finder is our quiz tool that helps you discover your perfect scent. Answer 5 quick questions about your mood, preferences, and budget, and we\'ll match you with your ideal fragrances.' },
  { q: 'Can I cancel or modify my order?', a: 'Orders can be cancelled or modified within 1 hour of placement. After that, the order enters processing and cannot be changed. Contact our support team immediately if you need assistance.' },
  { q: 'Do you offer gift wrapping?', a: 'Yes! Gift wrapping is available for all orders. Select the gift wrapping option at checkout and add a personalized message. Perfect for any occasion.' },
];

export default function FAQsPage() {
  return (
    <div>
      <div className="py-10 px-4 text-center" style={{ backgroundColor: 'var(--color-amoria-primary)' }}>
        <h1 className="text-3xl md:text-4xl font-light text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          Frequently Asked Questions
        </h1>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Accordion className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border px-4" style={{ borderColor: 'var(--color-amoria-border)' }}>
              <AccordionTrigger className="text-sm font-medium text-left" style={{ color: 'var(--color-amoria-primary)' }}>
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm pb-4" style={{ color: 'var(--color-amoria-text-muted)' }}>
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
