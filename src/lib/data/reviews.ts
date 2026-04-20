import { Review } from '@/types/product';

export const reviewsMap: Record<string, Review[]> = {
  '1': [
    { id: 'r1-1', productId: '1', reviewerName: 'Ahmed Al Rashid', location: 'Dubai', rating: 5, comment: 'Simply magnificent. Shaghaf Oud Aswad is my signature scent. The longevity is incredible — I can smell it on my clothes the next day. Worth every dirham.', date: '2024-11-15', isVerified: true },
    { id: 'r1-2', productId: '1', reviewerName: 'Fatima Hassan', location: 'Abu Dhabi', rating: 5, comment: 'I bought this for my husband and he absolutely loves it. The dark oud note is rich without being overpowering. A true statement fragrance.', date: '2024-10-20', isVerified: true },
    { id: 'r1-3', productId: '1', reviewerName: 'Mohammed Al Zaabi', location: 'Sharjah', rating: 4, comment: 'Very impressive fragrance. The sillage is fantastic — everyone in my office noticed. My only wish is it came in a larger bottle.', date: '2024-09-05', isVerified: false },
    { id: 'r1-4', productId: '1', reviewerName: 'Layla Bin Hamad', location: 'Dubai', rating: 5, comment: 'The perfect unisex oud. I wear it to work, to events, everywhere. It transforms on my skin in the most beautiful way.', date: '2024-08-14', isVerified: true },
    { id: 'r1-5', productId: '1', reviewerName: 'Khalid Al Marzouqi', location: 'Ras Al Khaimah', rating: 4, comment: 'Excellent quality. The bottle is stunning and the scent is everything I hoped for. Swiss Arabian never disappoints.', date: '2024-07-28', isVerified: true },
    { id: 'r1-6', productId: '1', reviewerName: 'Sara Al Blooshi', location: 'Fujairah', rating: 5, comment: 'This is my third bottle. I always receive compliments when I wear it. The rose-oud combination is perfect.', date: '2024-06-12', isVerified: true },
  ],
  '7': [
    { id: 'r7-1', productId: '7', reviewerName: 'Sultan Al Nuaimi', location: 'Dubai', rating: 5, comment: 'Shumukh lives up to its name. This is true pride in a bottle. The ingredients are unparalleled, and the fragrance evolves beautifully over hours.', date: '2024-11-10', isVerified: true },
    { id: 'r7-2', productId: '7', reviewerName: 'Noor Al Amri', location: 'Abu Dhabi', rating: 5, comment: 'I received this as a wedding gift and I still tear up when I smell it. The Bulgarian rose and oud combination is heavenly. Worth every penny.', date: '2024-10-05', isVerified: true },
    { id: 'r7-3', productId: '7', reviewerName: 'Hassan Al Dhaheri', location: 'Sharjah', rating: 5, comment: 'The world record bottle does not lie — this is a world-class fragrance. I wear it only for very special occasions to make it last.', date: '2024-09-18', isVerified: true },
    { id: 'r7-4', productId: '7', reviewerName: 'Maryam Al Sayed', location: 'Dubai', rating: 4, comment: 'Exceptional fragrance. The sillage is powerful but not overwhelming. I love the vanilla and sandalwood in the drydown.', date: '2024-08-22', isVerified: false },
    { id: 'r7-5', productId: '7', reviewerName: 'Rashid Al Falasi', location: 'Umm Al Quwain', rating: 5, comment: 'Shumukh is in a league of its own. The complexity is breathtaking — different notes emerge every hour. A true olfactory journey.', date: '2024-07-14', isVerified: true },
    { id: 'r7-6', productId: '7', reviewerName: 'Aisha Al Suwaidi', location: 'Dubai', rating: 5, comment: 'Gifted this to my father for his birthday. He said it was the finest perfume he had ever received. Cannot recommend highly enough.', date: '2024-06-30', isVerified: true },
    { id: 'r7-7', productId: '7', reviewerName: 'Tariq Al Mansoori', location: 'Abu Dhabi', rating: 5, comment: 'A masterpiece. The ambrette and saffron opening is unlike anything I have experienced. This will always be in my collection.', date: '2024-05-15', isVerified: true },
  ],
  '10': [
    { id: 'r10-1', productId: '10', reviewerName: 'Omar Al Shamsi', location: 'Dubai', rating: 5, comment: 'Club de Nuit Intense is the best value luxury fragrance I have ever bought. The longevity is incredible and everyone thinks I am wearing something much more expensive.', date: '2024-11-20', isVerified: true },
    { id: 'r10-2', productId: '10', reviewerName: 'Hessa Al Ketbi', location: 'Abu Dhabi', rating: 4, comment: 'I bought this for my brother and he has been wearing it non-stop. The smoky birch and ambergris are distinctive and sophisticated.', date: '2024-10-14', isVerified: true },
    { id: 'r10-3', productId: '10', reviewerName: 'Yousef Al Muhairi', location: 'Sharjah', rating: 5, comment: 'This is the fragrance I recommend to everyone. It smells expensive, lasts all day, and gets tons of compliments. Armaf is incredible.', date: '2024-09-28', isVerified: false },
    { id: 'r10-4', productId: '10', reviewerName: 'Mariam Bin Gharib', location: 'Dubai', rating: 4, comment: 'Perfectly crafted. The drydown is my favorite part — warm and slightly smoky. Perfect for the office or evenings.', date: '2024-08-11', isVerified: true },
    { id: 'r10-5', productId: '10', reviewerName: 'Saeed Al Kaabi', location: 'Ajman', rating: 5, comment: 'My signature scent for 3 years running. Never getting tired of it. The value for money is unmatched.', date: '2024-07-05', isVerified: true },
    { id: 'r10-6', productId: '10', reviewerName: 'Reem Al Rashidi', location: 'Dubai', rating: 5, comment: 'Ordered for my husband and he absolutely loves it. Great packaging too. Highly recommend this fragrance.', date: '2024-06-20', isVerified: true },
  ],
};

// Generate generic reviews for products not in the map
function generateReviews(productId: string): Review[] {
  const names = ['Ahmed', 'Fatima', 'Mohammed', 'Layla', 'Khalid', 'Sara', 'Omar', 'Hessa'];
  const locations = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah'];
  const comments = [
    'Absolutely love this fragrance. Long lasting and gets many compliments.',
    'Great scent for the price. Will definitely buy again.',
    'The fragrance is exactly as described. Very happy with my purchase.',
    'A beautiful scent that is both elegant and unique. Highly recommend.',
    'Excellent longevity and sillage. This is now my signature scent.',
    'Perfect for daily wear. Fresh and pleasant throughout the day.',
    'Quality packaging and authentic fragrance. Very satisfied.',
    'My family loves this scent. Will be ordering more.',
  ];

  return names.map((name, i) => ({
    id: `r${productId}-${i + 1}`,
    productId,
    reviewerName: `${name} Al ${['Rashid', 'Hassan', 'Zaabi', 'Bin Hamad', 'Marzouqi', 'Blooshi', 'Shamsi', 'Ketbi'][i]}`,
    location: locations[i % locations.length],
    rating: i < 5 ? 5 : i < 7 ? 4 : 3,
    comment: comments[i],
    date: `2024-${String(11 - (i % 11)).padStart(2, '0')}-${String(15 - (i % 14)).padStart(2, '0')}`,
    isVerified: i % 3 !== 0,
  }));
}

export function getReviewsForProduct(productId: string): Review[] {
  return reviewsMap[productId] ?? generateReviews(productId);
}
