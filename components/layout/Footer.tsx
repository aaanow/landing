import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <section className="footer">
      <div className="container">
        <div className="footer__link-container">
          <div className="footer__group">
            <h5 className="footer-heading">About AAAnow</h5>
            <div className="footer__link-list">
              <Link href="/our-capability" className="footer__link">
                Our capability
              </Link>
              <Link href="#" className="footer__link">
                LinkedIn
              </Link>
            </div>
          </div>

          <div className="footer__group">
            <h5 className="footer-heading">AiSC</h5>
            <div className="footer__link-list">
              {/* Dynamic content will be added here */}
            </div>
          </div>

          <div className="footer__group">
            <h5 className="footer-heading">Public scorecards</h5>
            <div className="footer__link-list">
              <Link href="/pricing" className="footer__link">
                Introduction
              </Link>
            </div>
          </div>

          <div className="footer__group">
            <h5 className="footer-heading">Resources</h5>
            <div className="footer__link-list">
              <Link href="/reference-material" className="footer__link">
                All Reference Materials
              </Link>
              <Link href="/reference-material#i-want-to" className="footer__link">
                I want to...
              </Link>
            </div>
          </div>

          <div className="footer__group">
            <h5 className="footer-heading">Legal</h5>
            <div className="footer__link-list">
              {/* Dynamic legal links will be added here */}
            </div>
          </div>
        </div>

        <div className="spacer-vertical" />

        <div className="footer__bottom">
          <div className="div-block-77">
            <p className="footer__text long">
              This website, all of its content and any/all documents offered directly or
              otherwise, should be considered as introduction, an overview and a starting
              point only – it should not be used as a single, sole authoritative guide. You
              should not consider this legal guidance.
              <br />
              <br />
              The services provided by AAAnow are based on general best practices and on
              audits of the available areas of websites at a point in time. Sections of the
              site that are not open to public access or are not being served (possibly due
              to site errors or downtime) may not be covered by our reports.
              <br />
              <br />
              Where matters of legal compliance are concerned you should always take
              independent advice from appropriately qualified individuals or firms.
            </p>
            <div className="footer__link copyrigtt">
              © 2026 AAAnow.al Limited All rights reserved.
            </div>
          </div>
          <div className="div-block-74">
            <Image
              src="/images/aaanow_logo.svg"
              alt="AAAnow Logo"
              width={120}
              height={30}
              className="footer__logo-copy"
            />
            <div className="div-block-82">
              <a
                href="https://willneeteson.com"
                className="footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Website by SOWN
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
