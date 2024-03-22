
const phi = Math.PI * (3. - Math.sqrt(5.))

export function getSpherePoint(i, n) {
  let y = 1 - (i / (n - 1)) * 2;
  let radius = Math.sqrt(1 - y * y);
  let theta = phi * i;
  let x = Math.cos(theta) * radius;
  let z = Math.sin(theta) * radius;
  
  return {'x': x, 'y': y, 'z': z};
}

