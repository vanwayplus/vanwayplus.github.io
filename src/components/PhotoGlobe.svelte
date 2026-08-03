<script lang="ts">
  import createGlobe, { type Globe, type Marker } from 'cobe'
  import { onMount } from 'svelte'

  type PhotoLocation = {
    name: string
    latitude: number
    longitude: number
  }

  type PhotoStory = {
    title: string
    url: string
    locations: PhotoLocation[]
  }

  export let stories: PhotoStory[] = []

  let canvas: HTMLCanvasElement
  let stage: HTMLDivElement
  let globe: Globe | undefined
  let selectedIndex = 0
  let ready = false
  let phi = 0.55
  let theta = 0.32
  let targetPhi: number | null = null
  let targetTheta: number | null = null
  let dragging = false
  let pointerX = 0
  let pointerY = 0

  $: selectedStory = stories[selectedIndex]
  $: markerCount = stories.reduce((total, story) => total + story.locations.length, 0)

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
  const normalizeAngle = (value: number) => {
    let angle = value
    while (angle > Math.PI) angle -= Math.PI * 2
    while (angle < -Math.PI) angle += Math.PI * 2
    return angle
  }

  function buildMarkers(activeIndex = selectedIndex): Marker[] {
    return stories.flatMap((story, storyIndex) => story.locations.map(location => ({
      location: [location.latitude, location.longitude] as [number, number],
      size: storyIndex === activeIndex ? 0.065 : 0.035,
      color: storyIndex === activeIndex
        ? [0.98, 0.48, 0.14] as [number, number, number]
        : [0.72, 0.34, 0.12] as [number, number, number],
    })))
  }

  function focusStory(index: number) {
    selectedIndex = index
    const location = stories[index]?.locations[0]
    if (!location) return

    const destination = -Math.PI / 2 - location.longitude * Math.PI / 180
    targetPhi = phi + normalizeAngle(destination - phi)
    targetTheta = clamp(location.latitude * Math.PI / 180, -0.72, 0.72)
    globe?.update({ markers: buildMarkers(index) })
  }

  function startDrag(event: PointerEvent) {
    dragging = true
    targetPhi = null
    targetTheta = null
    pointerX = event.clientX
    pointerY = event.clientY
    canvas.setPointerCapture(event.pointerId)
  }

  function dragGlobe(event: PointerEvent) {
    if (!dragging) return
    phi += (event.clientX - pointerX) / 160
    theta = clamp(theta - (event.clientY - pointerY) / 220, -0.8, 0.8)
    pointerX = event.clientX
    pointerY = event.clientY
  }

  function stopDrag(event: PointerEvent) {
    dragging = false
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
  }

  onMount(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2)
    const isDark = () => document.documentElement.classList.contains('dark')
    const palette = () => isDark()
      ? {
          dark: 1,
          mapBrightness: 4.2,
          mapBaseBrightness: 0.08,
          baseColor: [0.78, 0.62, 0.46] as [number, number, number],
          glowColor: [0.075, 0.06, 0.045] as [number, number, number],
        }
      : {
          dark: 0.08,
          mapBrightness: 5.2,
          mapBaseBrightness: 0.03,
          baseColor: [0.46, 0.30, 0.18] as [number, number, number],
          glowColor: [0.98, 0.95, 0.91] as [number, number, number],
        }

    const size = Math.max(280, Math.floor(stage.getBoundingClientRect().width))
    globe = createGlobe(canvas, {
      devicePixelRatio,
      width: size,
      height: size,
      phi,
      theta,
      diffuse: 1.15,
      mapSamples: 12000,
      markerColor: [0.82, 0.38, 0.12],
      markers: buildMarkers(),
      markerElevation: 0.035,
      scale: 0.94,
      offset: [0, 4],
      opacity: 1,
      ...palette(),
    })

    const resizeObserver = new ResizeObserver(entries => {
      const nextSize = Math.max(280, Math.floor(entries[0].contentRect.width))
      globe?.update({ width: nextSize, height: nextSize })
    })
    resizeObserver.observe(stage)

    const themeObserver = new MutationObserver(() => globe?.update(palette()))
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    let frame = 0
    const animate = () => {
      if (!ready) ready = true

      if (!dragging) {
        if (targetPhi !== null && targetTheta !== null) {
          phi += (targetPhi - phi) * 0.075
          theta += (targetTheta - theta) * 0.075
          if (Math.abs(targetPhi - phi) < 0.002 && Math.abs(targetTheta - theta) < 0.002) {
            targetPhi = null
            targetTheta = null
          }
        } else if (!prefersReducedMotion && !document.hidden) {
          phi += 0.0014
        }
      }

      globe?.update({ phi, theta })
      frame = requestAnimationFrame(animate)
    }

    focusStory(0)
    frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      globe?.destroy()
    }
  })
</script>

{#if stories.length > 0}
  <section class="photo-atlas" aria-labelledby="photo-atlas-title">
    <div class="atlas-copy">
      <div class="atlas-kicker">Photo atlas · {stories.length} stories · {markerCount} places</div>
      <h2 id="photo-atlas-title">Where the light found me.</h2>
      <p class="atlas-intro">Drag the globe or choose a journey. Each glowing point opens a photographic field note from the road.</p>

      {#if selectedStory}
        <div class="selected-story" aria-live="polite">
          <span>Now in view</span>
          <strong>{selectedStory.title}</strong>
          <p>{selectedStory.locations.map(location => location.name).join(' · ')}</p>
          <a href={selectedStory.url}>View photo story <span aria-hidden="true">↗</span></a>
        </div>
      {/if}

      <div class="story-list" aria-label="Photography locations">
        {#each stories as story, index}
          <button
            type="button"
            class:active={index === selectedIndex}
            aria-pressed={index === selectedIndex}
            on:click={() => focusStory(index)}
          >
            <span class="story-dot" aria-hidden="true"></span>
            {story.locations[0].name}
          </button>
        {/each}
      </div>
    </div>

    <div class="globe-column">
      <div
        class:ready
        class:dragging
        class="globe-stage"
        bind:this={stage}
      >
        <div class="globe-ring globe-ring-one" aria-hidden="true"></div>
        <div class="globe-ring globe-ring-two" aria-hidden="true"></div>
        <canvas
          bind:this={canvas}
          class="globe-canvas"
          aria-label={`Interactive globe showing ${markerCount} photography locations`}
          on:pointerdown={startDrag}
          on:pointermove={dragGlobe}
          on:pointerup={stopDrag}
          on:pointercancel={stopDrag}
        ></canvas>
      </div>
      <div class="globe-hint"><span aria-hidden="true">↔</span> Drag to explore</div>
    </div>
  </section>
{/if}

<style>
  .photo-atlas {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 0.88fr) minmax(19rem, 1.12fr);
    min-height: 31rem;
    margin-bottom: 2rem;
    overflow: hidden;
    color: rgba(26, 22, 18, 0.9);
    background:
      radial-gradient(circle at 78% 48%, color-mix(in srgb, var(--primary) 10%, transparent), transparent 37%),
      linear-gradient(135deg, rgba(255, 252, 248, 0.98), rgba(248, 241, 233, 0.9));
    border: 1px solid rgba(107, 82, 60, 0.12);
    box-shadow: 0 26px 70px rgba(74, 49, 28, 0.08);
  }

  .photo-atlas::before {
    position: absolute;
    inset: 0;
    content: '';
    pointer-events: none;
    background-image: linear-gradient(rgba(126, 91, 59, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(126, 91, 59, 0.035) 1px, transparent 1px);
    background-size: 2.5rem 2.5rem;
    mask-image: linear-gradient(90deg, black, transparent 72%);
  }

  .atlas-copy {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: clamp(2rem, 5vw, 3.5rem) 0 clamp(2rem, 5vw, 3.5rem) clamp(1.6rem, 5vw, 3.5rem);
  }

  .atlas-kicker {
    margin-bottom: 1rem;
    color: var(--primary);
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.17em;
    text-transform: uppercase;
  }

  h2 {
    max-width: 9ch;
    margin: 0;
    color: rgba(22, 18, 15, 0.94);
    font-family: var(--font-display);
    font-size: clamp(2.25rem, 5vw, 4rem);
    line-height: 0.98;
    letter-spacing: -0.045em;
  }

  .atlas-intro {
    max-width: 29rem;
    margin: 1.15rem 0 1.4rem;
    color: rgba(50, 40, 32, 0.58);
    font-size: 0.92rem;
    line-height: 1.7;
  }

  .selected-story {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.12rem 1rem;
    max-width: 29rem;
    padding: 0.9rem 1rem;
    background: rgba(255, 255, 255, 0.55);
    border: 1px solid rgba(116, 87, 61, 0.12);
    border-left: 3px solid var(--primary);
  }

  .selected-story > span {
    grid-column: 1 / -1;
    color: rgba(56, 43, 33, 0.45);
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .selected-story strong {
    min-width: 0;
    overflow: hidden;
    color: rgba(31, 25, 20, 0.88);
    font-size: 0.86rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .selected-story p {
    grid-column: 1;
    margin: 0;
    overflow: hidden;
    color: rgba(56, 43, 33, 0.48);
    font-size: 0.72rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .selected-story a {
    grid-column: 2;
    grid-row: 2 / 4;
    align-self: center;
    color: var(--primary);
    font-size: 0.72rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .story-list {
    display: flex;
    max-width: 30rem;
    margin-top: 1.15rem;
    gap: 0.4rem;
    overflow-x: auto;
    padding: 0.1rem 0 0.45rem;
    scrollbar-width: thin;
  }

  .story-list button {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 0.4rem;
    padding: 0.48rem 0.68rem;
    color: rgba(43, 34, 27, 0.54);
    font-size: 0.7rem;
    font-weight: 650;
    background: rgba(255, 255, 255, 0.45);
    border: 1px solid rgba(91, 66, 45, 0.1);
    border-radius: 999px;
    cursor: pointer;
    transition: color 150ms ease, background 150ms ease, border-color 150ms ease, transform 150ms ease;
  }

  .story-list button:hover,
  .story-list button:focus-visible,
  .story-list button.active {
    color: var(--primary);
    background: color-mix(in srgb, var(--primary) 9%, white);
    border-color: color-mix(in srgb, var(--primary) 35%, transparent);
    outline: none;
    transform: translateY(-1px);
  }

  .story-dot {
    width: 0.35rem;
    height: 0.35rem;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 0.5rem currentColor;
  }

  .globe-column {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    min-width: 0;
    padding: 0.75rem;
  }

  .globe-stage {
    position: relative;
    width: min(100%, 34rem);
    aspect-ratio: 1;
    opacity: 0;
    transform: scale(0.96);
    transition: opacity 500ms ease, transform 700ms cubic-bezier(0.2, 0.75, 0.2, 1);
  }

  .globe-stage.ready {
    opacity: 1;
    transform: scale(1);
  }

  .globe-stage.dragging {
    cursor: grabbing;
  }

  .globe-canvas {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    cursor: grab;
    touch-action: none;
  }

  .globe-ring {
    position: absolute;
    z-index: 0;
    inset: 12%;
    pointer-events: none;
    border: 1px solid color-mix(in srgb, var(--primary) 15%, transparent);
    border-radius: 50%;
  }

  .globe-ring-one {
    transform: rotate(24deg) scaleX(1.1) scaleY(0.38);
  }

  .globe-ring-two {
    transform: rotate(-28deg) scaleX(1.08) scaleY(0.32);
  }

  .globe-hint {
    position: absolute;
    right: 1.4rem;
    bottom: 1.1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: rgba(59, 44, 32, 0.42);
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  :global(:root.dark) .photo-atlas {
    color: rgba(246, 241, 236, 0.9);
    background:
      radial-gradient(circle at 78% 48%, color-mix(in srgb, var(--primary) 11%, transparent), transparent 39%),
      linear-gradient(135deg, rgba(35, 31, 27, 0.98), rgba(21, 19, 17, 0.97));
    border-color: rgba(255, 255, 255, 0.09);
    box-shadow: 0 28px 74px rgba(0, 0, 0, 0.26);
  }

  :global(:root.dark) .photo-atlas::before {
    background-image: linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  }

  :global(:root.dark) h2 {
    color: rgba(250, 247, 242, 0.94);
  }

  :global(:root.dark) .atlas-intro,
  :global(:root.dark) .globe-hint {
    color: rgba(243, 236, 227, 0.5);
  }

  :global(:root.dark) .selected-story {
    background: rgba(255, 255, 255, 0.035);
    border-color: rgba(255, 255, 255, 0.08);
    border-left-color: var(--primary);
  }

  :global(:root.dark) .selected-story > span,
  :global(:root.dark) .selected-story p {
    color: rgba(243, 236, 227, 0.43);
  }

  :global(:root.dark) .selected-story strong {
    color: rgba(250, 247, 242, 0.88);
  }

  :global(:root.dark) .story-list button {
    color: rgba(243, 236, 227, 0.5);
    background: rgba(255, 255, 255, 0.035);
    border-color: rgba(255, 255, 255, 0.08);
  }

  :global(:root.dark) .story-list button:hover,
  :global(:root.dark) .story-list button:focus-visible,
  :global(:root.dark) .story-list button.active {
    color: var(--primary);
    background: color-mix(in srgb, var(--primary) 10%, transparent);
    border-color: color-mix(in srgb, var(--primary) 34%, transparent);
  }

  @media (max-width: 900px) {
    .photo-atlas {
      grid-template-columns: 1fr;
    }

    .atlas-copy {
      padding: 2.2rem 1.5rem 0;
    }

    h2 {
      max-width: 11ch;
    }

    .globe-column {
      min-height: 24rem;
      margin-top: -1rem;
    }

    .globe-stage {
      width: min(100%, 30rem);
    }
  }

  @media (max-width: 520px) {
    .photo-atlas {
      min-height: 0;
    }

    .atlas-copy {
      padding: 1.7rem 1.15rem 0;
    }

    .selected-story {
      grid-template-columns: minmax(0, 1fr);
    }

    .selected-story a {
      grid-column: 1;
      grid-row: auto;
      margin-top: 0.5rem;
    }

    .globe-column {
      min-height: 20rem;
      padding: 0.2rem;
    }

    .globe-hint {
      right: 1rem;
      bottom: 0.8rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .globe-stage,
    .story-list button {
      transition: none;
    }
  }
</style>
