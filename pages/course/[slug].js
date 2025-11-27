import { useState } from 'react';

export default function CoursePage({ course }) {
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    setLoading(true);
    // Call server to create checkout session
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: course.id })
    });
    const data = await res.json();
    if (data.url) {
      window.location = data.url;
    } else {
      alert('Error creating checkout session');
      setLoading(false);
    }
  }

  return (
    <div style={{padding:24, fontFamily:'Inter, Arial'}}>
      <h2>{course.title}</h2>
      <p>Price: {course.is_free ? 'Free' : (course.price_cents/100).toFixed(2) + ' ' + course.currency}</p>

      <section style={{marginTop:12}}>
        <h3>Lessons</h3>
        <ol>
          <li>Intro</li>
          <li>Theory</li>
          <li>Instrument walkthrough</li>
          <li>Method setup</li>
        </ol>
      </section>

      <div style={{marginTop:18}}>
        {course.is_free ? (
          <button className="btn">Enroll (Free)</button>
        ) : (
          <button onClick={handleBuy} disabled={loading} className="btn">
            {loading ? 'Processing...' : 'Buy Course'}
          </button>
        )}
      </div>
    </div>
  )
}

// Simple server-side props simulation for demo purposes
export async function getServerSideProps(ctx) {
  // In real app: fetch course from DB by slug
  const slug = ctx.params.slug;
  const course = {
    id: '00000000-0000-0000-0000-000000000001',
    slug: slug,
    title: 'HPLC Fundamentals & Operation',
    price_cents: 19900,
    currency: 'usd',
    is_free: false
  };
  return { props: { course } };
}