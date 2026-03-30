import HeroV3 from '../components/HeroV3'
import PipelineStrategyV3 from '../components/PipelineStrategyV3'
import PartnerLogos from '../components/PartnerLogos'
import TestimonialCarouselV3 from '../components/TestimonialCarouselV3'
import TraineeSectionV3 from '../components/TraineeSectionV3'
import BlogPreviewV3 from '../components/BlogPreviewV3'
import NewsletterV3 from '../components/NewsletterV3'
import FooterV3 from '../components/FooterV3'

export default function HomePageV3({ onSwitchConcept, activeConcept }) {
  return (
    <>
      {/* Content layer — sits above the fixed footer via z-index */}
      <div className="relative bg-white" style={{ zIndex: 2 }}>
        <main>
          <HeroV3 onSwitchConcept={onSwitchConcept} />
          <PipelineStrategyV3 />
          <PartnerLogos />
          <TraineeSectionV3 />
          <TestimonialCarouselV3 />
          <BlogPreviewV3 />
          <NewsletterV3 />
        </main>
      </div>

      {/* Transparent spacer = footer height (100vh) */}
      <div aria-hidden="true" style={{ height: '100vh' }} />

      <FooterV3 />
    </>
  )
}
