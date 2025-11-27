import Link from 'next/link';

export default function Home() {
  return (
    <div style={{fontFamily:'Inter, Arial', padding:24}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1>LabTrain — HPLC Courses (Starter)</h1>
        <nav>
          <Link href="/course/hplc-basics">HPLC Course</Link>
        </nav>
      </header>
      <main style={{marginTop:24}}>
        <p>This starter shows how to integrate Stripe Checkout + webhook + Supabase + signed S3 URLs.</p>
        <ul>
          <li><Link href="/course/hplc-basics">Open sample course</Link></li>
        </ul>
      </main>
    </div>
  )
}