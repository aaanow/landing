import Image from 'next/image';

export function AboutUsBanner() {
  return (
    <div className="jfeopjfe" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
      <div className="div-block-60" style={{ gridColumn: '1 / 13' }}>
        <div className="audience__sidebar">
          <h2>About us</h2>
          <p className="body__large">
            AAAnow is The Digital Confidence Company. We use AI to reduce manual effort across digital operations – from executive reporting to diagnostics and content correction.
            <br /><br />
            With 25+ years of automation experience, we help organisations deliver faster, more compliant, continuously improving websites – giving you the clarity, control, and confidence to move forward.
          </p>
        </div>
      </div>
      <div className="div-block-159" style={{ gridColumn: '13 / 25', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="div-block-85" style={{ width: '100%', height: '100%' }}>
          <Image src="/images/25anniversary.svg" alt="25 year anniversary" width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      </div>
    </div>
  );
}
