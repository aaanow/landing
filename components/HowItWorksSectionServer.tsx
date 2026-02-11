import { getPayloadClient } from '@/src/payload'
import type { HowItWorksGlobal } from '@/types/cms'
import { getMediaUrl } from '@/types/cms'
import { HowItWorksSection } from './HowItWorksSection'
import { HOW_IT_WORKS_TABS, HOW_IT_WORKS_HEADING } from '@/data/how-it-works-data'
import type { HowItWorksTab } from '@/data/how-it-works-data'

function mapCmsToTabs(data: HowItWorksGlobal): HowItWorksTab[] {
  if (!data.tabs || data.tabs.length === 0) return HOW_IT_WORKS_TABS

  const defaultIds = ['day', 'week', 'month']

  return data.tabs.map((tab, i) => {
    const imageUrl = getMediaUrl(tab.image)

    return {
      id: defaultIds[i] || `tab${i + 1}`,
      number: tab.number,
      timeLabel: tab.timeLabel,
      outcomeLabel: tab.outcomeLabel,
      actionTitle: tab.actionTitle,
      actionDescription: tab.actionDescription || '',
      steps: (tab.steps || []).map((s) => ({
        label: s.label,
        title: s.title,
        description: s.description || '',
      })),
      outcomeTitle: tab.outcomeTitle || '',
      outcomeDescription: tab.outcomeDescription || '',
      image: {
        src: imageUrl || '/images/1_11.avif',
        srcSet: imageUrl || '',
        sizes: '(max-width: 767px) 100vw, (max-width: 991px) 728px, 783px',
      },
    }
  })
}

export async function HowItWorksSectionServer() {
  let heading = HOW_IT_WORKS_HEADING
  let tabs = HOW_IT_WORKS_TABS

  try {
    const payload = await getPayloadClient()
    const data = (await payload.findGlobal({ slug: 'how-it-works' })) as HowItWorksGlobal

    if (data.heading !== undefined) heading = data.heading
    const mappedTabs = mapCmsToTabs(data)
    if (mappedTabs.length > 0) tabs = mappedTabs
  } catch (error) {
    console.error('HowItWorksSectionServer: Failed to fetch global:', error)
  }

  return <HowItWorksSection heading={heading} tabs={tabs} />
}
