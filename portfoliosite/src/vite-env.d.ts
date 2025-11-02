/// <reference types="vite/client" />

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
