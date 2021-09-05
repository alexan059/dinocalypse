export function drawBoundingBox(ctx, x, y, width, height, color, scale = 1.0) {
  ctx.strokeStyle = color;
  ctx.beginPath();

  const xRatio = (width / 2) * (1 - scale);
  const yRatio = (height / 2) * (1 - scale);

  x += xRatio;
  width -= xRatio * 2;

  y += yRatio;
  height -= yRatio * 2;

  ctx.rect(x, y, width, height);
  // ctx.arc(x + width / 2, y + height / 2, width / 2, Math.PI * 4, 2 * Math.PI);
  ctx.stroke();
}