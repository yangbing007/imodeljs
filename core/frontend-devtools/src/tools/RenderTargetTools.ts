/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

/** @packageDocumentation
 * @module Tools
 */

import { IModelApp, PrimitiveVisibility, RenderTargetDebugControl, ScreenViewport, Tool } from "@bentley/imodeljs-frontend";
import { parseToggle } from "./parseToggle";

/** Executes some code against a RenderTargetDebugControl obtained from the selected viewport.
 * @beta
 */
export abstract class RenderTargetDebugControlTool extends Tool {
  public run(_args: any[]): boolean {
    const view = IModelApp.viewManager.selectedView;
    const control = undefined !== view ? view.target.debugControl : undefined;
    if (undefined !== control)
      this.execute(control, view!);

    return true;
  }

  protected abstract execute(_control: RenderTargetDebugControl, _vp: ScreenViewport): void;
}

type DebugControlBoolean = "displayDrapeFrustum" | "drawForReadPixels" | "displayRealityTileRanges" | "displayRealityTileRanges" |
  "displayRealityTilePreload" | "freezeRealityTiles" | "logRealityTiles" | "vcSupportIntersectingVolumes";

/** Toggles some aspect of a RenderTargetDebugControl for the selected viewport.
 * @beta
 */
export abstract class RenderTargetDebugControlToggleTool extends RenderTargetDebugControlTool {
  public static get minArgs() { return 0; }
  public static get maxArgs() { return 1; }

  private _enable?: boolean;

  protected abstract get aspect(): DebugControlBoolean;

  protected execute(control: RenderTargetDebugControl, vp: ScreenViewport): void {
    const value = undefined !== this._enable ? this._enable : !control[this.aspect];
    control[this.aspect] = value;
    vp.invalidateRenderPlan();
  }

  public parseAndRun(...args: string[]): boolean {
    const enable = parseToggle(args[0]);
    if (typeof enable !== "string") {
      this._enable = enable;
      this.run([]);
    }

    return true;
  }
}

/** Toggles between normal rendering and rendering as if drawing to an off-screen framebuffer for element locate. Useful for debugging locate issues.
 * @beta
 */
export class ToggleReadPixelsTool extends RenderTargetDebugControlToggleTool {
  public static toolId = "ToggleReadPixels";
  public get aspect(): DebugControlBoolean { return "drawForReadPixels"; }
}

/** Turn on the display of the draping frustum.
 * @alpha
 */
export class ToggleDrapeFrustumTool extends RenderTargetDebugControlToggleTool {
  public static toolId = "ToggleDrapeFrustum";
  public get aspect(): DebugControlBoolean { return "displayDrapeFrustum"; }
}
/** Control whether all geometry renders, or only instanced or batched geometry.
 * Allowed argument: "instanced", "batched", "all". Defaults to "all" if no arguments supplied.
 * @beta
 */
export class TogglePrimitiveVisibilityTool extends RenderTargetDebugControlTool {
  public static toolId = "TogglePrimitiveVisibility";
  public static get minArgs() { return 0; }
  public static get maxArgs() { return 1; }

  private _visibility = PrimitiveVisibility.All;

  public execute(control: RenderTargetDebugControl, vp: ScreenViewport): void {
    control.primitiveVisibility = this._visibility;
    vp.invalidateScene();
  }

  public parseAndRun(...args: string[]): boolean {
    if (0 < args.length) {
      switch (args[0].toLowerCase()) {
        case "instanced":
          this._visibility = PrimitiveVisibility.Instanced;
          break;
        case "batched":
          this._visibility = PrimitiveVisibility.Uninstanced;
          break;
        case "all":
          break;
        default:
          return true;
      }
    }

    return this.run(args);
  }
}

/** Turn on display of reality tile boundaies.
 * @alpha
 */
export class ToggleRealityTileBounds extends RenderTargetDebugControlToggleTool {
  public static toolId = "ToggleRealityTileBounds";
  public get aspect(): DebugControlBoolean { return "displayRealityTileRanges"; }
}

/** Turn on display of reality tile preload debugging.
 * @alpha
 */
export class ToggleRealityTilePreload extends RenderTargetDebugControlToggleTool {
  public static toolId = "ToggleRealityTilePreload";
  public get aspect(): DebugControlBoolean { return "displayRealityTilePreload"; }
}
/** Freeze loading of reality tiles.
 * @alpha
 */
export class ToggleRealityTileFreeze extends RenderTargetDebugControlToggleTool {
  public static toolId = "ToggleRealityTileFreeze";
  public get aspect(): DebugControlBoolean { return "freezeRealityTiles"; }
}

/** Turn on logging of console tile selection and loadding (to console).
 * @alpha
 */
export class ToggleRealityTileLogging extends RenderTargetDebugControlToggleTool {
  public static toolId = "ToggleRealityTileLogging";
  public get aspect(): DebugControlBoolean { return "logRealityTiles"; }
}

/** Toggles support for intersecting volume classifiers.
 * @internal
 */
export class ToggleVolClassIntersect extends RenderTargetDebugControlToggleTool {
  public static toolId = "ToggleVCIntersect";
  public get aspect(): DebugControlBoolean { return "vcSupportIntersectingVolumes"; }
}
