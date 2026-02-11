import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { checkSeedAuth } from '@/lib/seed-auth'

export async function GET(request: Request) {
  const authError = checkSeedAuth(request)
  if (authError) return authError

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
