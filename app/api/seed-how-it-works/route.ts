import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    await payload.updateGlobal({
      slug: 'how-it-works',
      data: {
        heading: '',
        tabs: [
          {
            number: '01',
            timeLabel: 'in 1 Day',
            outcomeLabel: 'Grow Client Revenue',
            actionTitle: 'Evidence billable time',
            actionDescription:
              'Profile present (& lapsed) clients. Value / Risk fundamentals costed for each; email, engage and sell work.',
            researchLinkLabel: 'The research behind our numbers.',
            researchLinkDescription:
              'How behavioural science, AI modelling evidence can be used to removes noise, and increases profit.',
            steps: [
              {
                label: '1',
                title: "Email \u2018advisor note\u2019",
                description:
                  "Send Value / Risk summary (example) \u2018confirm\u2019 importance of ongoing, independent clarity of position.",
              },
              {
                label: '2',
                title: 'AiSC audits, completes costs assessment',
                description:
                  'No human input, Value/Risk results and costed work|packs ready in 2.5hrs.',
              },
              {
                label: '3',
                title: 'Review results, share; client by client',
                description:
                  '1-click, share results, book calls. Feed detail to CRM. Foundations in place for retention improvement.',
              },
            ],
            outcomeTitle: 'Client Confidence, Revenue Growth',
            outcomeDescription:
              'How agencies can protect value, retain clients and grow revenue by using AiSC to create continuous clarity, guide priorities, replace competitors and strengthen confidence before and after launch.',
            videoLinks: [
              { label: 'Client confidence, Agency revenue', url: 'https://youtu.be/TMWlp4o-ezk' },
              { label: 'Introduction \u2013 why AiSC, what value?', url: 'https://youtu.be/vKpIORM39f0' },
            ],
            resourceLinks: [
              { label: 'AiSC \u2013 what, why, how much', url: 'https://aaanow.aflip.in/AiSC_Application.html' },
              { label: 'See how it works', url: '#' },
            ],
          },
          {
            number: '02',
            timeLabel: 'in a Week',
            outcomeLabel: 'Win More Business',
            actionTitle: 'Be heard by key prospects',
            actionDescription:
              'Use unique, 1-2-1 findings to get heard and engage. You are now in meaningful discussion about protecting and maximising online investment.',
            steps: [
              {
                label: '1',
                title: "Email \u2018advisor note\u2019",
                description:
                  "Send Value / Risk summary (example) \u2018confirm\u2019 importance of ongoing, independent clarity of position.",
              },
              {
                label: '2',
                title: 'Add website using /CONFIRM',
                description:
                  'Takes you 1min, click go. AiSC audits, understands fundamentals and grades Value and Risk, summary done.',
              },
              {
                label: '3',
                title: 'ONE-CLICK - share results by email',
                description:
                  'Directly engage, and offer time slots to walk through findings, and share complementary 3 quick wins call.',
              },
            ],
            outcomeTitle: 'Win More Business',
            outcomeDescription:
              'This video shows how agencies win more work by adding Number 11. AiSC provides continuous proof of value and risk, creating confidence that differentiates pitches and secures wider programs.',
            videoLinks: [
              { label: 'Client confidence, Agency revenue', url: 'https://youtu.be/TMWlp4o-ezk' },
              { label: 'Differentiate \u2013 have number 11.', url: 'https://youtu.be/y0PhgZxybnA' },
            ],
            resourceLinks: [
              {
                label: 'Losing a pitch \u2013 with AiSC there are 40,000 reasons to.',
                url: 'https://aaanow.webflow.io/post/how-losing-the-pitch-is-worth-more-30-days-40-000',
              },
              { label: 'AiSC \u2013 what, why, how much', url: 'https://aaanow.aflip.in/AiSC_Application.html' },
            ],
          },
          {
            number: '03',
            timeLabel: 'in a Month',
            outcomeLabel: 'Stop Funding Competitors',
            actionTitle: 'Have the boardroom keys',
            actionDescription:
              'With unique value, and the human want to compare, above the noise your message is heard from the boardroom down.',
            steps: [
              {
                label: 'a',
                title: 'Advise all Value / Risk results coming',
                description:
                  'Have known contacts communicate internally, new target advise of value, uniqueness - Board \u2192 Digital leads.',
              },
              {
                label: 'b',
                title: 'Against target account (new or to expand)',
                description:
                  'Securely upload the websites, covering the full landscape to AiSC. Using XLS file, takes you 7mins.',
              },
              {
                label: 'c',
                title: 'Share (start with known contacts - then board)',
                description:
                  'Distribution of the results. Invite to webinar to walk through and access to site specifics.',
              },
            ],
            outcomeTitle: 'Stop funding competitors.',
            outcomeDescription:
              'Agencies lose value when clients adopt external tools. AiSC gives agencies the clarity to replace those competitors, regain control, strengthen retention and protect revenue through continuous oversight and clear priorities.',
            videoLinks: [
              { label: 'Client confidence, Agency revenue', url: 'https://youtu.be/TMWlp4o-ezk' },
              { label: "Stop Funding \u2018competition\u2019", url: 'https://youtu.be/LiWdhqfseHE' },
            ],
            resourceLinks: [
              { label: 'AiSC \u2013 what, why, how much', url: 'https://aaanow.aflip.in/AiSC_Application.html' },
            ],
          },
          {
            number: '04',
            timeLabel: 'in a Quarter',
            outcomeLabel: 'Your growth engine',
            actionTitle: 'Own your target sector',
            actionDescription:
              'Evergreen PR and event content, sector want to understand position - you set the digital standard others report against.',
            steps: [
              {
                label: 'a',
                title: 'Sector constituents loaded',
                description: 'Securely add websites via XLS file, takes you 7mins.',
              },
              {
                label: 'b',
                title: 'Influencer reach out',
                description:
                  'Partner with memberbody, associations (direct value to them) sector media to collaborate on results distribution.',
              },
              {
                label: 'c',
                title: 'Against target account (new or to expand)',
                description:
                  'Repeating 90Day cycle, monthly announcement / update - continuous sector engagement and discussion.',
              },
            ],
            outcomeTitle: 'Your growth engine',
            outcomeDescription:
              'How AiSC drives agency growth by adding pitch differentiation, strengthening retainers, revealing billable work, protecting value after launch and giving account teams continuous clarity across the full client lifecycle.',
            videoLinks: [
              { label: 'Client confidence, Agency revenue', url: 'https://youtu.be/TMWlp4o-ezk' },
              { label: 'AiSC \u2013 Agency growth engine', url: 'https://youtu.be/zL-Cne8VJQc' },
            ],
            resourceLinks: [
              { label: 'AiSC \u2013 what, why, how much', url: 'https://aaanow.aflip.in/AiSC_Application.html' },
            ],
          },
        ],
      },
    })

    return NextResponse.json({ success: true, message: 'How It Works global seeded successfully' })
  } catch (error) {
    console.error('Seed how-it-works error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
