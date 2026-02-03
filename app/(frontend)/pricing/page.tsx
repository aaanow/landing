'use client';

import { useState } from 'react';

// Checkmark SVG component
const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
  </svg>
);

const subscriptionPlans = [
  {
    license: 25,
    users: 5,
    pricePerMonth: 125,
    resaleMargin: '54%',
  },
  {
    license: 50,
    users: 10,
    pricePerMonth: 110,
    resaleMargin: '60%',
  },
  {
    license: 100,
    users: 25,
    pricePerMonth: 95,
    resaleMargin: '65%',
  },
  {
    license: 250,
    users: 50,
    pricePerMonth: 80,
    resaleMargin: '70%',
  },
];

const subscriptionFeatures = [
  {
    name: 'Weekly Audit',
    description: 'Each website is assessed each week, fundamentals confirmed.',
    included: [true, true, true, true],
  },
  {
    name: 'Alert',
    description: 'Changes, clients and you need to know as soon as possible.',
    included: [true, true, true, true],
  },
  {
    name: 'Download',
    description: 'Take the data into your CRM, automate quotation and f/u.',
    included: [true, true, true, true],
  },
  {
    name: 'Change (anytime)',
    description: 'Update the websites being assessed, anytime.',
    included: [true, true, true, true],
  },
];

const trialPlans = [
  { name: 'FREE', fee: 'FREE', users: 'NA', buttonLabel: '/CONFIRM' },
  { name: 'PoC', fee: '£1,250', users: 'NA', buttonLabel: 'PoC' },
  { name: 'Unlimited', fee: '£4,750', users: 'Unlimited', buttonLabel: 'Unlimited' },
];

const trialFeatures = [
  {
    name: 'Client Scorecard',
    description: "What's undermining value, creating risk – results open conversations",
    values: ['By page', 'check', 'check'],
  },
  {
    name: 'Sector Scorecard',
    description: 'Driven engagement with 1-2-1 results, use rankings for OR',
    values: ['By page', 'check', 'check'],
  },
  {
    name: 'Q&A Session',
    description: "How can we use the finings? What does 'this' mean?",
    values: [null, 'check', 'check'],
  },
  {
    name: 'BDR / SDR',
    description: 'Site above todays continuous noise – have emails that are opened',
    values: ['check', 'check', 'check'],
  },
];

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<'subscription' | 'trial'>('subscription');

  return (
    <section className="section background-cream pricing-section">
      <div className="container top-bottom-padding">
        <div className="pricing-container">
          {/* Header */}
          <h1 className="pricing-title">Pricing</h1>

          {/* Tab Toggle */}
          <div className="tab-toggle">
            <button
              className={`tab-button ${activeTab === 'subscription' ? 'tab-button-active' : ''}`}
              onClick={() => setActiveTab('subscription')}
            >
              Subscription
            </button>
            <button
              className={`tab-button ${activeTab === 'trial' ? 'tab-button-active' : ''}`}
              onClick={() => setActiveTab('trial')}
            >
              Trial
            </button>
          </div>

          {/* Description */}
          <p className="pricing-description">
            {activeTab === 'subscription'
              ? 'Understand "right now" where value can be added. Talk to present or lapsed clients using findings generated minutes after adding their website to your private client Scorecard. Choose a level, pay an initial 5% by card with the balance by invoice, upload your list, and we handle the rest.'
              : 'After trying /CONFIRM, agencies get unlimited usage for 45 days, creating sector, corporate, and client Scorecards for present or lapsed accounts. A PoC option supports internal validation on a single client and sector Scorecard. Trial spend is credited against subscription.'}
          </p>

          {activeTab === 'subscription' && (
            <>
              {/* Pricing Table */}
              <div className="table-card">
                <h2 className="subscription-title">Subscription level</h2>

                <div className="pricing-table">
                  {/* License Row */}
                  <div className="table-row">
                    <div className="label-cell">
                      <span className="feature-name">License (web addresses)</span>
                    </div>
                    {subscriptionPlans.map((plan, index) => (
                      <div key={index} className="value-cell">
                        <span className="license-value">{plan.license}</span>
                      </div>
                    ))}
                  </div>

                  {/* Feature Rows */}
                  {subscriptionFeatures.map((feature, featureIndex) => (
                    <div key={featureIndex} className="table-row">
                      <div className="label-cell">
                        <span className="feature-name">{feature.name}</span>
                        <span className="feature-description">{feature.description}</span>
                      </div>
                      {feature.included.map((included, planIndex) => (
                        <div key={planIndex} className="value-cell">
                          {included && (
                            <span className="checkmark">
                              <CheckIcon />
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Users Row */}
                  <div className="table-row">
                    <div className="label-cell">
                      <span className="feature-name">Users</span>
                      <span className="feature-description">(unlimited end of '26)</span>
                    </div>
                    {subscriptionPlans.map((plan, index) => (
                      <div key={index} className="value-cell">
                        <span className="users-value">{plan.users}</span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="table-divider"></div>

                  {/* Price Row */}
                  <div className="table-row">
                    <div className="label-cell">
                      <span className="feature-name">Client / Website / Month</span>
                      <span className="feature-description">(paid annually. Year1 has onboarding fee of £2,450)</span>
                    </div>
                    {subscriptionPlans.map((plan, index) => (
                      <div key={index} className="value-cell">
                        <span className="price-value">£{plan.pricePerMonth}</span>
                      </div>
                    ))}
                  </div>

                  {/* Resale Margin Row */}
                  <div className="table-row">
                    <div className="label-cell">
                      <span className="feature-name">Resale Margin</span>
                      <span className="feature-description">(billing at £275)</span>
                    </div>
                    {subscriptionPlans.map((plan, index) => (
                      <div key={index} className="value-cell">
                        <span className="margin-value">{plan.resaleMargin}</span>
                      </div>
                    ))}
                  </div>

                  {/* Note */}
                  <div className="table-note">
                    Resale earnings minor, compared with value of client confidence, agency revenue
                  </div>

                  {/* CTA Buttons Row */}
                  <div className="table-row">
                    <div className="label-cell">
                      <div className="pdf-link">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Full details.</span>
                        <span className="legal-note">(Legal pages)</span>
                      </div>
                    </div>
                    {subscriptionPlans.map((plan, index) => (
                      <div key={index} className="value-cell">
                        <button className="choose-button">
                          Choose {plan.license}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* I don't believe you section */}
              <div className="skeptic-section">
                <h2 className="skeptic-title">I don't believe you....</h2>
                <p>
                  You would not be the first to be skeptical of our numbers, and perhaps even more so when you compare the potential value we describe against what we charge. <em>If it is real, why does it feel like we should already have this?</em>
                </p>
                <p>
                  Those selling diagnostic, TQM, quality assurance and similar services are multi-million £ businesses. They are built on taking money agencies "leave on the table" and then positioning themselves as the authority over work delivered. No fancy accountancy. Fact.
                </p>
                <p>
                  Discount, even ignore, the value we reference around improved pitch wins or being heard above the noise. Offer clients services they are already taking from third parties, make 50%+ margin, and use that as a reason to stay in conversation. Ongoing value? Client confidence, agency revenue.
                </p>

                <div className="call-to-action">
                  <a href="#" className="cta-button">
                    Click here to arrange a call.
                  </a>
                  <span className="cta-subtext">after all anyone can put words on a web page.</span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'trial' && (
            <>
              {/* Trial Table */}
              <div className="table-card">
                <h2 className="subscription-title">Trial options</h2>

                <div className="pricing-table">
                  {/* Type / Level Row */}
                  <div className="table-row-trial">
                    <div className="label-cell">
                      <span className="feature-name">Type / level</span>
                    </div>
                    {trialPlans.map((plan, index) => (
                      <div key={index} className="value-cell">
                        <span className="license-value">{plan.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Trial Feature Rows */}
                  {trialFeatures.map((feature, featureIndex) => (
                    <div key={featureIndex} className="table-row-trial">
                      <div className="label-cell">
                        <span className="feature-name">{feature.name}</span>
                        <span className="feature-description">{feature.description}</span>
                      </div>
                      {feature.values.map((value, planIndex) => (
                        <div key={planIndex} className="value-cell">
                          {value === 'check' ? (
                            <span className="checkmark">
                              <CheckIcon />
                            </span>
                          ) : value === 'By page' ? (
                            <span className="by-page-text">By page</span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Users Row */}
                  <div className="table-row-trial">
                    <div className="label-cell">
                      <span className="feature-name">Users</span>
                      <span className="feature-description">(unlimited end of '26)</span>
                    </div>
                    {trialPlans.map((plan, index) => (
                      <div key={index} className="value-cell">
                        <span className="users-value">{plan.users}</span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="table-divider"></div>

                  {/* Fee Row */}
                  <div className="table-row-trial">
                    <div className="label-cell">
                      <span className="feature-name">Fee</span>
                    </div>
                    {trialPlans.map((plan, index) => (
                      <div key={index} className="value-cell">
                        <span className="fee-value">{plan.fee}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Buttons Row */}
                  <div className="table-row-trial">
                    <div className="label-cell">
                      <div className="pdf-link">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Full details.</span>
                        <span className="legal-note">(Legal pages)</span>
                      </div>
                    </div>
                    {trialPlans.map((plan, index) => (
                      <div key={index} className="value-cell">
                        <button className="choose-button">
                          {plan.buttonLabel}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* I don't believe you section */}
              <div className="skeptic-section">
                <h2 className="skeptic-title">I don't believe you....</h2>
                <p>
                  You would not be the first to be skeptical of our numbers, and perhaps even more so when you compare the potential value we describe against what we charge. <em>If it is real, why does it feel like we should already have this?</em>
                </p>
                <p>
                  Those selling diagnostic, TQM, quality assurance and similar services are multi-million £ businesses. They are built on taking money agencies "leave on the table" and then positioning themselves as the authority over work delivered. No fancy accountancy. Fact.
                </p>
                <p>
                  Discount, even ignore, the value we reference around improved pitch wins or being heard above the noise. Offer clients services they are already taking from third parties, make 50%+ margin, and use that as a reason to stay in conversation. Ongoing value? Client confidence, agency revenue.
                </p>

                <div className="call-to-action">
                  <a href="#" className="cta-button">
                    Click here to arrange a call.
                  </a>
                  <span className="cta-subtext">after all anyone can put words on a web page.</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
