import Image from 'next/image';
import { getPayloadClient } from '@/src/payload';

export async function AboutUsBanner() {
  let heading = 'About us';
  let body = '';
  let image = '/images/25anniversary.svg';
  let imageAlt = '25 year anniversary';

  try {
    const payload = await getPayloadClient();
    const aboutUs = await payload.findGlobal({ slug: 'about-us' });
    if (aboutUs.heading) heading = aboutUs.heading;
    if (aboutUs.body) body = aboutUs.body;
    if (aboutUs.image) image = aboutUs.image;
    if (aboutUs.imageAlt) imageAlt = aboutUs.imageAlt;
  } catch (error) {
    console.error('AboutUsBanner: Failed to fetch about-us global:', error);
  }

  const paragraphs = body.split('\n\n').filter(Boolean);

  return (
    <div className="jfeopjfe" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
      <div className="div-block-60" style={{ gridColumn: '1 / 13' }}>
        <div className="audience__sidebar">
          <h2>{heading}</h2>
          <p className="body__large">
            {paragraphs.map((p, i) => (
              <span key={i}>
                {i > 0 && <><br /><br /></>}
                {p}
              </span>
            ))}
          </p>
        </div>
      </div>
      <div className="div-block-159" style={{ gridColumn: '13 / 25', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="div-block-85" style={{ width: '100%', height: '100%' }}>
          <Image src={image} alt={imageAlt} width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      </div>
    </div>
  );
}
