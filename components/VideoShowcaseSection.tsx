'use client'

export function VideoShowcaseSection() {
  return (
    <section className="section sticky">
      <div className="w-[95%] max-w-[1440px] mx-auto py-8">
        <div className="section__content-wrapper card _2 dark-section-green">
          <div className="section-header__wrapper">
            <h2 className="heading-3">See AiSC in Action</h2>
          </div>

          <div className="video-showcase">
            <div className="video-showcase__player">
              <iframe
                src="https://www.youtube.com/embed/TMWlp4o-ezk"
                title="AiSC Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
