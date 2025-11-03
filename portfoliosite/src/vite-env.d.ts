/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAILJS_SERVICE_ID: string
  readonly VITE_EMAILJS_TEMPLATE_ID: string
  readonly VITE_EMAILJS_PUBLIC_KEY: string
  readonly VITE_EMAILJS_TO_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'lottie-web' {
  export interface AnimationConfig {
    container: HTMLElement
    renderer: 'svg' | 'canvas' | 'html'
    loop?: boolean | number
    autoplay?: boolean
    path?: string
    animationData?: any
  }

  export interface AnimationItem {
    destroy(): void
    play(): void
    pause(): void
    stop(): void
    setSpeed(speed: number): void
    setDirection(direction: number): void
  }

  interface LottiePlayer {
    loadAnimation(config: AnimationConfig): AnimationItem
  }

  const lottie: LottiePlayer
  export default lottie
}
