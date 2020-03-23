import { WebGLRenderer, Scene, WebGLRendererParameters } from 'three';
import { ControlsManager } from './controls-manager';

export class RendererManager {
  // MEMBERS
  private mainRenderer: WebGLRenderer = null;
  private overlayRenderer: WebGLRenderer = null;
  private renderers: WebGLRenderer[] = [];
  private fixedOverlay: boolean;


  // CONSTRUCTOR
  constructor() {
    // Main renderer for current browsers
    this.setRenderer();
  }

  public render(scene: Scene, controlsManager: ControlsManager) {
    if (this.getOverlayRenderer()) {
      if (!this.getOverlayRenderer().domElement.hidden) {
        const sceneColor = scene.background;
        scene.background = null;

        if (!this.isFixedOverlay()) {
          this.getOverlayRenderer().render(
            scene,
            controlsManager.getOverlayCamera()
          );
        }
        scene.background = sceneColor;
      }
    }
  }

  private setRenderer() {
    const renderer: WebGLRenderer = new WebGLRenderer();

    this.addRenderer(renderer);
    this.setMainRenderer(renderer);
    this.getMainRenderer().setSize(
      window.innerWidth,
      window.innerHeight,
      false
    );
    this.getMainRenderer().domElement.className = 'ui-element';
    this.getMainRenderer().domElement.id = 'three-canvas';
    let canvas = document.getElementById('eventDisplay');
    if (canvas == null) {
      canvas = document.body;
    }
    canvas.appendChild(this.getMainRenderer().domElement);
  }

  // SET/GET
  setMainRenderer(renderer: WebGLRenderer) {
    this.mainRenderer = renderer;
  }

  public setOverlayRenderer(overlayCanvas: HTMLCanvasElement): void {
    const parameters: WebGLRendererParameters = {
      canvas: overlayCanvas,
      antialias: false,
      alpha: true
    };
    const overlayRenderer: WebGLRenderer = new WebGLRenderer(parameters);
    this.addRenderer(overlayRenderer);
    this.overlayRenderer = overlayRenderer;
  }

  setRenderers(renderers: WebGLRenderer[]) {
    this.renderers = renderers;
  }

  getMainRenderer(): WebGLRenderer {
    return this.mainRenderer;
  }

  getOverlayRenderer(): WebGLRenderer {
    return this.overlayRenderer;
  }

  getRenderers(): WebGLRenderer[] {
    return this.renderers;
  }


  // FUNCTIONS
  public addRenderer(renderer: WebGLRenderer) {
    if (!this.containsObject(renderer, this.renderers)) {
      this.renderers.push(renderer);
    }
  }

  public removeControls(renderer: WebGLRenderer): void {
    const index: number = this.renderers.indexOf(renderer);
    if (index > -1) {
      this.renderers.splice(index, 1);
    }
  }

  public swapRenderers(rendererA: WebGLRenderer, rendererB: WebGLRenderer): void {
    const temp: WebGLRenderer = rendererA;
    rendererA = rendererB;
    rendererB = temp;
  }

  private containsObject(obj: WebGLRenderer, list: WebGLRenderer[]): boolean {
    for (const object of list) {
      if (object === obj) {
        return true;
      }
    }
    return false;
  }

  public setLocalClippingEnabled(value: boolean): void {
    for (const renderer of this.renderers) {
      renderer.localClippingEnabled = value;
    }
  }

  isFixedOverlay(): boolean {
    return this.fixedOverlay;
  }

  setFixOverlay(value: boolean) {
    this.fixedOverlay = value;
  }
}
