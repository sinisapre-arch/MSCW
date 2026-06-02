/**
 * Remove the "Built with Spline" overlay rendered by the runtime.
 * Official removal: Spline export → Play Settings → disable logo (paid plan).
 */
export function disableSplineWatermark(app) {
  const pipeline = app?._renderer?.pipeline;
  if (!pipeline) return;

  if (typeof pipeline.setWatermark === 'function') {
    pipeline.setWatermark(null);
  } else if (pipeline.logoOverlayPass) {
    pipeline.logoOverlayPass.enabled = false;
    pipeline.logoOverlayPass.texture = null;
  }

  app.requestRender?.();
}

/**
 * Hide MSCW / logo geometry embedded in the Spline robot scene.
 */
export function hideSplineSceneLogos(app) {
  if (!app?.getAllObjects) return;

  const pattern = /logo|mscw|bureau|brand|emblem|mark|text|typography|label/i;

  app.getAllObjects().forEach((obj) => {
    if (!obj?.name || !pattern.test(obj.name)) return;
    obj.hide?.();
    obj.visible = false;
    if (obj.scale) {
      obj.scale.x = 0;
      obj.scale.y = 0;
      obj.scale.z = 0;
    }
  });

  const names = [
    'Logo', 'MSCW', 'MSCW Logo', 'mscw_logo', 'Logo_MSCW',
    'Text', 'MSCW_Text', 'Bureau', 'Brand'
  ];

  names.forEach((name) => {
    const obj = app.findObjectByName?.(name);
    if (obj) {
      obj.hide?.();
      obj.visible = false;
    }
  });
}
