'use client';

import { useState } from 'react';

// Icon component matching other pages
const PricingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 64 64" fill="none" className="icon__64">
    <path d="M54.8574 27.4287V34.7427C54.8574 35.7526 54.0387 36.5713 53.0289 36.5713H47.5424C46.5325 36.5713 45.7139 37.39 45.7139 38.3999V43.8853C45.7139 44.8952 44.8952 45.7139 43.8853 45.7139H38.3999C37.39 45.7139 36.5713 46.5325 36.5713 47.5424V53.0289C36.5713 54.0387 35.7526 54.8574 34.7427 54.8574H10.9711C9.96126 54.8574 9.14258 54.0387 9.14258 53.0289V47.5424C9.14258 46.5325 9.96126 45.7139 10.9711 45.7139H16.4576C17.4675 45.7139 18.2861 44.8952 18.2861 43.8853V38.3999C18.2861 37.39 19.1048 36.5713 20.1147 36.5713H25.6001C26.61 36.5713 27.4287 35.7526 27.4287 34.7427V29.2573C27.4287 28.2474 28.2474 27.4287 29.2573 27.4287H54.8574ZM64 25.6001C64 26.61 63.1813 27.4287 62.1714 27.4287H54.8574V20.1147C54.8574 19.1048 55.6761 18.2861 56.686 18.2861H62.1714C63.1813 18.2861 64 19.1048 64 20.1147V25.6001ZM54.8574 18.2861H47.5424C46.5325 18.2861 45.7139 17.4675 45.7139 16.4576V10.9711C45.7139 9.96126 46.5325 9.14258 47.5424 9.14258H53.0289C54.0387 9.14258 54.8574 9.96126 54.8574 10.9711V18.2861ZM45.7139 9.14258H38.3999C37.39 9.14258 36.5713 8.3239 36.5713 7.31401V1.82857C36.5713 0.818679 37.39 0 38.3999 0H53.0289C54.0387 0 54.8574 0.818679 54.8574 1.82857V7.31401C54.8574 8.3239 53.7574 9.14258 52.7475 9.14258H45.7139ZM18.2861 27.4287H10.9711C9.96126 27.4287 9.14258 26.61 9.14258 25.6001V10.9711C9.14258 9.96126 8.3239 9.14258 7.31401 9.14258H1.82857C0.818679 9.14258 0 8.3239 0 7.31401V1.82857C0 0.818679 0.818679 0 1.82857 0H16.4576C17.4675 0 18.2861 0.818679 18.2861 1.82857V7.31401C18.2861 8.3239 19.1048 9.14258 20.1147 9.14258H25.6001C26.61 9.14258 27.4287 9.96126 27.4287 10.9711V25.6001C27.4287 26.61 26.61 27.4287 25.6001 27.4287H18.2861Z" fill="currentColor"/>
  </svg>
);

// Checkmark SVG component
const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
  </svg>
);

// CTA Icon
const CTAIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 64 64" fill="none" className="icon__64">
    <path d="M54.8574 45.7139V53.0289C54.8574 54.0387 54.0387 54.8574 53.0289 54.8574H20.1147C19.1048 54.8574 18.2861 54.0387 18.2861 53.0289V47.5424C18.2861 46.5325 19.1048 45.7139 20.1147 45.7139H54.8574ZM64 43.8853C64 44.8952 63.1813 45.7139 62.1714 45.7139H54.8574V38.3999C54.8574 37.39 55.6761 36.5713 56.686 36.5713H62.1714C63.1813 36.5713 64 37.39 64 38.3999V43.8853ZM27.4287 7.31401C27.4287 8.3239 26.61 9.14258 25.6001 9.14258H20.1147C19.1048 9.14258 18.2861 9.96126 18.2861 10.9711V25.6001C18.2861 26.61 17.4675 27.4287 16.4576 27.4287H10.9711C9.96126 27.4287 9.14258 26.61 9.14258 25.6001V10.9711C9.14258 9.96126 8.3239 9.14258 7.31401 9.14258H1.82857C0.818679 9.14258 0 8.3239 0 7.31401V1.82857C0 0.818679 0.818679 0 1.82857 0H25.6001C26.61 0 27.4287 0.818679 27.4287 1.82857V7.31401ZM45.7139 25.6001C45.7139 26.61 44.8952 27.4287 43.8853 27.4287H38.3999C37.39 27.4287 36.5713 26.61 36.5713 25.6001V20.1147C36.5713 19.1048 37.39 18.2861 38.3999 18.2861H45.7139V25.6001ZM64 25.6001C64 26.61 63.1813 27.4287 62.1714 27.4287H56.686C55.6761 27.4287 54.8574 26.61 54.8574 25.6001V18.2861H62.1714C63.1813 18.2861 64 19.1048 64 20.1147V25.6001ZM54.8574 18.2861H45.7139V10.9711C45.7139 9.96126 46.5325 9.14258 47.5424 9.14258H53.0289C54.0387 9.14258 54.8574 9.96126 54.8574 10.9711V18.2861Z" fill="currentColor"/>
  </svg>
);

const subscriptionPlans = [
  { license: 25, users: 5, pricePerMonth: 125, resaleMargin: '54%' },
  { license: 50, users: 10, pricePerMonth: 110, resaleMargin: '60%' },
  { license: 100, users: 25, pricePerMonth: 95, resaleMargin: '65%' },
  { license: 250, users: 50, pricePerMonth: 80, resaleMargin: '70%' },
];

const subscriptionFeatures = [
  { name: 'Weekly Audit', description: 'Each website is assessed each week, fundamentals confirmed.', included: [true, true, true, true] },
  { name: 'Alert', description: 'Changes, clients and you need to know as soon as possible.', included: [true, true, true, true] },
  { name: 'Download', description: 'Take the data into your CRM, automate quotation and f/u.', included: [true, true, true, true] },
  { name: 'Change (anytime)', description: 'Update the websites being assessed, anytime.', included: [true, true, true, true] },
];

const trialPlans = [
  { name: 'FREE', fee: 'FREE', users: 'NA', buttonLabel: '/CONFIRM' },
  { name: 'PoC', fee: '£1,250', users: 'NA', buttonLabel: 'PoC' },
  { name: 'Unlimited', fee: '£4,750', users: 'Unlimited', buttonLabel: 'Unlimited' },
];

const trialFeatures = [
  { name: 'Client Scorecard', description: "What's undermining value, creating risk – results open conversations", values: ['By page', 'check', 'check'] },
  { name: 'Sector Scorecard', description: 'Driven engagement with 1-2-1 results, use rankings for OR', values: ['By page', 'check', 'check'] },
  { name: 'Q&A Session', description: "How can we use the findings? What does 'this' mean?", values: [null, 'check', 'check'] },
  { name: 'BDR / SDR', description: 'Rise above todays continuous noise – have emails that are opened', values: ['check', 'check', 'check'] },
];

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<'subscription' | 'trial'>('subscription');

  return (
    <>
      {/* Main Pricing Section */}
      <section className="section sticky">
        <div className="w-layout-blockcontainer container top-padding w-container">
          <div className="section__content-wrapper">
            <div className="section-header__wrapper">
              <PricingIcon />
              <h1>Pricing</h1>
              <div className="subheading__wrapper">
                <p className="body__xlarge">
                  Transparent pricing designed for agencies of all sizes. Start with a trial or commit to ongoing value.
                </p>
              </div>
            </div>

            {/* Tab Toggle */}
            <div className="card-grid animate">
              <div className="pricing-tabs">
                <button
                  className={`pricing-tab ${activeTab === 'subscription' ? 'pricing-tab--active' : ''}`}
                  onClick={() => setActiveTab('subscription')}
                >
                  Subscription
                </button>
                <button
                  className={`pricing-tab ${activeTab === 'trial' ? 'pricing-tab--active' : ''}`}
                  onClick={() => setActiveTab('trial')}
                >
                  Trial
                </button>
              </div>

              {/* Description */}
              <p className="pricing-intro">
                {activeTab === 'subscription'
                  ? 'Understand "right now" where value can be added. Talk to present or lapsed clients using findings generated minutes after adding their website to your private client Scorecard. Choose a level, pay an initial 5% by card with the balance by invoice, upload your list, and we handle the rest.'
                  : 'After trying /CONFIRM, agencies get unlimited usage for 45 days, creating sector, corporate, and client Scorecards for present or lapsed accounts. A PoC option supports internal validation on a single client and sector Scorecard. Trial spend is credited against subscription.'}
              </p>

              {activeTab === 'subscription' && (
                <div className="pricing-content">
                  <div className="pricing-card">
                    <h2 className="pricing-card__title">Subscription level</h2>

                    <div className="pricing-table-grid">
                      {/* License Row */}
                      <div className="pricing-row">
                        <div className="pricing-row__label">
                          <span className="pricing-row__name">License (web addresses)</span>
                        </div>
                        {subscriptionPlans.map((plan, index) => (
                          <div key={index} className="pricing-row__value">
                            <span className="pricing-badge pricing-badge--primary">{plan.license}</span>
                          </div>
                        ))}
                      </div>

                      {/* Feature Rows */}
                      {subscriptionFeatures.map((feature, featureIndex) => (
                        <div key={featureIndex} className="pricing-row">
                          <div className="pricing-row__label">
                            <span className="pricing-row__name">{feature.name}</span>
                            <span className="pricing-row__desc">{feature.description}</span>
                          </div>
                          {feature.included.map((included, planIndex) => (
                            <div key={planIndex} className="pricing-row__value">
                              {included && <span className="pricing-check"><CheckIcon /></span>}
                            </div>
                          ))}
                        </div>
                      ))}

                      {/* Users Row */}
                      <div className="pricing-row">
                        <div className="pricing-row__label">
                          <span className="pricing-row__name">Users</span>
                          <span className="pricing-row__desc">(unlimited end of '26)</span>
                        </div>
                        {subscriptionPlans.map((plan, index) => (
                          <div key={index} className="pricing-row__value">
                            <span className="pricing-badge pricing-badge--primary">{plan.users}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pricing-divider"></div>

                      {/* Price Row */}
                      <div className="pricing-row">
                        <div className="pricing-row__label">
                          <span className="pricing-row__name">Client / Website / Month</span>
                          <span className="pricing-row__desc">(paid annually. Year1 has onboarding fee of £2,450)</span>
                        </div>
                        {subscriptionPlans.map((plan, index) => (
                          <div key={index} className="pricing-row__value">
                            <span className="pricing-price">£{plan.pricePerMonth}</span>
                          </div>
                        ))}
                      </div>

                      {/* Resale Margin Row */}
                      <div className="pricing-row">
                        <div className="pricing-row__label">
                          <span className="pricing-row__name">Resale Margin</span>
                          <span className="pricing-row__desc">(billing at £275)</span>
                        </div>
                        {subscriptionPlans.map((plan, index) => (
                          <div key={index} className="pricing-row__value">
                            <span className="pricing-margin">{plan.resaleMargin}</span>
                          </div>
                        ))}
                      </div>

                      <p className="pricing-note">
                        Resale earnings minor, compared with value of client confidence, agency revenue
                      </p>

                      {/* CTA Row */}
                      <div className="pricing-row">
                        <div className="pricing-row__label">
                          <a href="/legal" className="pricing-legal-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Full details</span>
                            <span className="pricing-legal-note">(Legal pages)</span>
                          </a>
                        </div>
                        {subscriptionPlans.map((plan, index) => (
                          <div key={index} className="pricing-row__value">
                            <button className="pricing-btn">Choose {plan.license}</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Skeptic Section */}
                  <div className="pricing-card pricing-card--skeptic">
                    <h2 className="pricing-card__title">I don't believe you....</h2>
                    <div className="pricing-card__body">
                      <p>
                        You would not be the first to be skeptical of our numbers, and perhaps even more so when you compare the potential value we describe against what we charge. <em>If it is real, why does it feel like we should already have this?</em>
                      </p>
                      <p>
                        Those selling diagnostic, TQM, quality assurance and similar services are multi-million £ businesses. They are built on taking money agencies "leave on the table" and then positioning themselves as the authority over work delivered. No fancy accountancy. Fact.
                      </p>
                      <p>
                        Discount, even ignore, the value we reference around improved pitch wins or being heard above the noise. Offer clients services they are already taking from third parties, make 50%+ margin, and use that as a reason to stay in conversation. Ongoing value? Client confidence, agency revenue.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'trial' && (
                <div className="pricing-content">
                  <div className="pricing-card">
                    <h2 className="pricing-card__title">Trial options</h2>

                    <div className="pricing-table-grid pricing-table-grid--trial">
                      {/* Type Row */}
                      <div className="pricing-row pricing-row--trial">
                        <div className="pricing-row__label">
                          <span className="pricing-row__name">Type / level</span>
                        </div>
                        {trialPlans.map((plan, index) => (
                          <div key={index} className="pricing-row__value">
                            <span className="pricing-badge pricing-badge--primary">{plan.name}</span>
                          </div>
                        ))}
                      </div>

                      {/* Feature Rows */}
                      {trialFeatures.map((feature, featureIndex) => (
                        <div key={featureIndex} className="pricing-row pricing-row--trial">
                          <div className="pricing-row__label">
                            <span className="pricing-row__name">{feature.name}</span>
                            <span className="pricing-row__desc">{feature.description}</span>
                          </div>
                          {feature.values.map((value, planIndex) => (
                            <div key={planIndex} className="pricing-row__value">
                              {value === 'check' ? (
                                <span className="pricing-check"><CheckIcon /></span>
                              ) : value === 'By page' ? (
                                <span className="pricing-by-page">By page</span>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ))}

                      {/* Users Row */}
                      <div className="pricing-row pricing-row--trial">
                        <div className="pricing-row__label">
                          <span className="pricing-row__name">Users</span>
                          <span className="pricing-row__desc">(unlimited end of '26)</span>
                        </div>
                        {trialPlans.map((plan, index) => (
                          <div key={index} className="pricing-row__value">
                            <span className="pricing-badge pricing-badge--primary">{plan.users}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pricing-divider"></div>

                      {/* Fee Row */}
                      <div className="pricing-row pricing-row--trial">
                        <div className="pricing-row__label">
                          <span className="pricing-row__name">Fee</span>
                        </div>
                        {trialPlans.map((plan, index) => (
                          <div key={index} className="pricing-row__value">
                            <span className="pricing-badge pricing-badge--fee">{plan.fee}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Row */}
                      <div className="pricing-row pricing-row--trial">
                        <div className="pricing-row__label">
                          <a href="/legal" className="pricing-legal-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Full details</span>
                            <span className="pricing-legal-note">(Legal pages)</span>
                          </a>
                        </div>
                        {trialPlans.map((plan, index) => (
                          <div key={index} className="pricing-row__value">
                            <button className="pricing-btn">{plan.buttonLabel}</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Skeptic Section */}
                  <div className="pricing-card pricing-card--skeptic">
                    <h2 className="pricing-card__title">I don't believe you....</h2>
                    <div className="pricing-card__body">
                      <p>
                        You would not be the first to be skeptical of our numbers, and perhaps even more so when you compare the potential value we describe against what we charge. <em>If it is real, why does it feel like we should already have this?</em>
                      </p>
                      <p>
                        Those selling diagnostic, TQM, quality assurance and similar services are multi-million £ businesses. They are built on taking money agencies "leave on the table" and then positioning themselves as the authority over work delivered. No fancy accountancy. Fact.
                      </p>
                      <p>
                        Discount, even ignore, the value we reference around improved pitch wins or being heard above the noise. Offer clients services they are already taking from third parties, make 50%+ margin, and use that as a reason to stay in conversation. Ongoing value? Client confidence, agency revenue.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section sticky last">
        <div className="w-layout-blockcontainer container top-bottom-padding landing w-container">
          <div className="section__content-wrapper light-green">
            <div className="section-header__wrapper">
              <CTAIcon />
              <h2>Ready to Get Started?</h2>
              <div className="subheading__wrapper">
                <p className="body__xlarge">
                  Have questions? Want to see a demo?<br />
                  Let's talk about how AiSC can transform your client relationships.
                </p>
                <a data-modal-open="get-started" href="#" className="super-btn w-inline-block">
                  <div>Arrange a Call</div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 17 17" fill="none" className="icon-16 green">
                    <path d="M9.18563 14.6168C9.43803 14.6169 9.64258 14.8216 9.64258 15.074V16.445C9.64258 16.6975 9.43791 16.9022 9.18544 16.9022H7.81456C7.56209 16.9022 7.35742 16.6975 7.35742 16.445V15.0734C7.35742 14.8208 7.56221 14.6161 7.81476 14.6163L9.18563 14.6168ZM11.9287 14.1589C11.9287 14.4114 11.724 14.6161 11.4716 14.6161H10.0997C9.84725 14.6161 9.64258 14.4114 9.64258 14.1589V12.788C9.64258 12.5356 9.84725 12.3309 10.0997 12.3309H11.9287V14.1589ZM16.5 9.58763C16.5 9.8401 16.2953 10.0448 16.0429 10.0448H14.6718C14.4194 10.0448 14.2148 10.2493 14.2146 10.5017L14.2141 11.874C14.214 12.1264 14.0093 12.3309 13.7569 12.3309H11.9287V10.0448H13.7567C14.0092 10.0448 14.2139 9.8401 14.2139 9.58763V7.75961H16.0429C16.2953 7.75961 16.5 7.96428 16.5 8.21676V9.58763ZM11.9287 10.0448H0.957143C0.70467 10.0448 0.5 9.8401 0.5 9.58763V8.21676C0.5 7.96428 0.70467 7.75961 0.957143 7.75961H11.9287V10.0448ZM14.2139 7.75961H11.9287V5.47348H13.7575C14.0101 5.47348 14.2148 5.67827 14.2146 5.93082L14.2139 7.75961ZM11.4718 3.18813C11.7242 3.18824 11.9287 3.39287 11.9287 3.64527V5.47348H10.0997C9.84725 5.47348 9.64258 5.26881 9.64258 5.01634V3.64469C9.64258 3.39214 9.84737 3.18743 10.0999 3.18754L11.4718 3.18813ZM9.64258 2.73118C9.64258 2.98365 9.43791 3.18832 9.18544 3.18832H7.81456C7.56209 3.18832 7.35742 2.98365 7.35742 2.73118V1.35933C7.35742 1.10686 7.56209 0.902191 7.81456 0.902191H9.18544C9.43791 0.902191 9.64258 1.10686 9.64258 1.35933V2.73118Z" fill="currentColor"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
