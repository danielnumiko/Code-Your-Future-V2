import { useState, useEffect } from 'react'
import HomePageV1 from './pages/HomePageV1'
import HomePageV2 from './pages/HomePageV2'
import HomePageV3 from './pages/HomePageV3'
import HomePageV4 from './pages/HomePageV4'

const VALID = ['v1', 'v2', 'v3', 'v4']

function getConceptFromHash() {
  const hash = window.location.hash.slice(1)
  return VALID.includes(hash) ? hash : 'v1'
}

function App() {
  const [concept, setConcept] = useState(getConceptFromHash)

  function switchConcept(v) {
    setConcept(v)
    window.location.hash = v
  }

  useEffect(() => {
    const onHashChange = () => setConcept(getConceptFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (concept === 'v2') return <HomePageV2 onSwitchConcept={switchConcept} activeConcept={concept} />
  if (concept === 'v3') return <HomePageV3 onSwitchConcept={switchConcept} activeConcept={concept} />
  if (concept === 'v4') return <HomePageV4 onSwitchConcept={switchConcept} activeConcept={concept} />
  return <HomePageV1 onSwitchConcept={switchConcept} activeConcept={concept} />
}

export default App
