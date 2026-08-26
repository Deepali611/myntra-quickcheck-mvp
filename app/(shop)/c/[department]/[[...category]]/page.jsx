export default async function CategoryPage({ params }) {
  const { department, category } = await params;
  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ fontSize: '18px', textTransform: 'capitalize' }}>
        {department} {category ? `- ${category.join(' / ')}` : ''}
      </h1>
      <p style={{ color: '#7e818c', marginTop: '8px' }}>Category Listing Page</p>
    </div>
  );
}
