'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { ArrowIcon, CheckIcon, CTAIcon } from '@/components/icons';

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

export function PricingContent() {
  const [activeTab, setActiveTab] = useState<'subscription' | 'trial'>('subscription');
  const [selectedTab, setSelectedTab] = useState<'subscription' | 'trial'>('subscription');
  const [transitioning, setTransitioning] = useState(false);

  const goToTab = useCallback((id: 'subscription' | 'trial') => {
    if (id === selectedTab) return;
    setSelectedTab(id);
    setTransitioning(true);
    setTimeout(() => {
      setActiveTab(id);
      setTimeout(() => setTransitioning(false), 20);
    }, 300);
  }, [selectedTab]);

  return (
    <>
      {/* Main Pricing Section */}
      <section className="section">
        <div className="container top-padding">
          <div className="section-header__wrapper hero-animate hero-animate-delay-1">
            <h1>Pricing</h1>
            <div className="subheading__wrapper">
              <p className="body__xlarge">
                Understand &ldquo;right now&rdquo; where value can be added. Talk to present or lapsed clients using findings generated minutes after adding their website to your private client Scorecard.
              </p>
            </div>
          </div>

          <div className="section__content-wrapper dark-green">
            {/* Tab Toggle */}
            <div className="pricing-wrapper">
              <div className="pricing-tabs hero-animate hero-animate-delay-2" role="tablist" aria-label="Pricing options" style={{ display: 'none' }}>
                <div
                  className="pricing-tabs__slider"
                  style={{
                    width: 'calc((100% - 0.5rem) / 2)',
                    transform: selectedTab === 'trial' ? 'translateX(100%)' : 'translateX(0)',
                  }}
                />
                <button
                  role="tab"
                  id="tab-subscription"
                  aria-selected={activeTab === 'subscription'}
                  aria-controls="panel-subscription"
                  className={`pricing-tab ${selectedTab === 'subscription' ? 'pricing-tab--active' : ''}`}
                  onClick={() => goToTab('subscription')}
                >
                  Subscription
                </button>
                <button
                  role="tab"
                  id="tab-trial"
                  aria-selected={activeTab === 'trial'}
                  aria-controls="panel-trial"
                  className={`pricing-tab ${selectedTab === 'trial' ? 'pricing-tab--active' : ''}`}
                  onClick={() => goToTab('trial')}
                >
                  Trial
                </button>
              </div>

              <div className={`hero-animate hero-animate-delay-3 tab__pane${transitioning ? ' tab__pane--exit' : ' tab__pane--enter'}`}>
              {/* Description */}
              {activeTab === 'trial' && (
                <p className="pricing-intro">
                  After trying /CONFIRM, agencies get unlimited usage for 45 days, creating sector, corporate, and client Scorecards for present or lapsed accounts. A PoC option supports internal validation on a single client and sector Scorecard. Trial spend is credited against subscription.
                </p>
              )}

              {activeTab === 'subscription' && (
                <div id="panel-subscription" role="tabpanel" aria-labelledby="tab-subscription" className="pricing-content">
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
                      <div className="pricing-row pricing-row--thick-border">
                        <div className="pricing-row__label">
                          <span className="pricing-row__name">Users</span>
                          <span className="pricing-row__desc">(unlimited end of &apos;26)</span>
                        </div>
                        {subscriptionPlans.map((plan, index) => (
                          <div key={index} className="pricing-row__value">
                            <span className="pricing-badge pricing-badge--primary">{plan.users}</span>
                          </div>
                        ))}
                      </div>

                      {/* Price Row */}
                      <div className="pricing-row">
                        <div className="pricing-row__label">
                          <span className="pricing-row__name">Client / Website / Month</span>
                          <span className="pricing-row__desc">(paid annually. Year1 has onboarding fee of £2,450)</span>
                        </div>
                        {subscriptionPlans.map((plan, index) => (
                          <div key={index} className="pricing-row__value">
                            <span className="pricing-badge pricing-badge--primary">£{plan.pricePerMonth}</span>
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
                      <div className="pricing-row" style={{ display: 'none' }}>
                        <div className="pricing-row__label">
                          <Link href="/legal" className="pricing-legal-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Full details</span>
                            <span className="pricing-legal-note">(Legal pages)</span>
                          </Link>
                        </div>
                        {subscriptionPlans.map((plan, index) => (
                          <div key={index} className="pricing-row__value">
                            <Button
                              variant="sub"
                              color="green"
                              data-cal-namespace="aisc-prove"
                              data-cal-link="aaanow-ljs/aisc-prove"
                              data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
                            >
                              Choose {plan.license}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Skeptic Section */}
                  <div className="pricing-card pricing-card--skeptic">
                    <h2 className="pricing-card__title">I don&apos;t believe you....</h2>
                    <div className="pricing-card__body">
                      <p>
                        You would not be the first to be skeptical of our numbers, and perhaps even more so when you compare the potential value we describe against what we charge. <em>If it is real, why does it feel like we should already have this?</em>
                      </p>
                      <p>
                        Those selling diagnostic, TQM, quality assurance and similar services are multi-million £ businesses. They are built on taking money agencies &ldquo;leave on the table&rdquo; and then positioning themselves as the authority over work delivered. No fancy accountancy. Fact.
                      </p>
                      <p>
                        Discount, even ignore, the value we reference around improved pitch wins or being heard above the noise. Offer clients services they are already taking from third parties, make 50%+ margin, and use that as a reason to stay in conversation. Ongoing value? Client confidence, agency revenue.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'trial' && (
                <div id="panel-trial" role="tabpanel" aria-labelledby="tab-trial" className="pricing-content">
                  <div className="pricing-card">
                    <h2 className="pricing-card__title">Trial options</h2>

                    <div className="pricing-table-grid">
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
                      <div className="pricing-row pricing-row--trial pricing-row--thick-border">
                        <div className="pricing-row__label">
                          <span className="pricing-row__name">Users</span>
                          <span className="pricing-row__desc">(unlimited end of &apos;26)</span>
                        </div>
                        {trialPlans.map((plan, index) => (
                          <div key={index} className="pricing-row__value">
                            <span className="pricing-badge pricing-badge--primary">{plan.users}</span>
                          </div>
                        ))}
                      </div>

                      {/* Fee Row */}
                      <div className="pricing-row pricing-row--trial">
                        <div className="pricing-row__label">
                          <span className="pricing-row__name">Fee</span>
                        </div>
                        {trialPlans.map((plan, index) => (
                          <div key={index} className="pricing-row__value">
                            <span className="pricing-badge pricing-badge--primary">{plan.fee}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Row */}
                      <div className="pricing-row pricing-row--trial">
                        <div className="pricing-row__label">
                          <Link href="/legal" className="pricing-legal-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Full details</span>
                            <span className="pricing-legal-note">(Legal pages)</span>
                          </Link>
                        </div>
                        {trialPlans.map((plan, index) => (
                          <div key={index} className="pricing-row__value">
                            <Button
                              variant="sub"
                              color="green"
                              data-cal-namespace="aisc-prove"
                              data-cal-link="aaanow-ljs/aisc-prove"
                              data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
                            >
                              {plan.buttonLabel}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Skeptic Section */}
                  <div className="pricing-card pricing-card--skeptic">
                    <h2 className="pricing-card__title">I don&apos;t believe you....</h2>
                    <div className="pricing-card__body">
                      <p>
                        You would not be the first to be skeptical of our numbers, and perhaps even more so when you compare the potential value we describe against what we charge. <em>If it is real, why does it feel like we should already have this?</em>
                      </p>
                      <p>
                        Those selling diagnostic, TQM, quality assurance and similar services are multi-million £ businesses. They are built on taking money agencies &ldquo;leave on the table&rdquo; and then positioning themselves as the authority over work delivered. No fancy accountancy. Fact.
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="section sticky last">
        <div className="container top-bottom-padding landing">
          <div className="section__content-wrapper light-green">
            <div className="section-header__wrapper">
              <CTAIcon />
              <h2>Ready to Get Started?</h2>
              <div className="subheading__wrapper">
                <p className="body__xlarge">
                  Have questions? Want to see a demo?<br />
                  Let&apos;s talk about how AiSC can transform your client relationships.
                </p>
                <Button
                  variant="main"
                  data-cal-namespace="aisc-prove"
                  data-cal-link="aaanow-ljs/aisc-prove"
                  data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
                  icon={<ArrowIcon className="icon-16 green" />}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
