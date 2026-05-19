function animal(
  name,
  maxSpeed,
  maxSpeedRange,
  midSpeed,
  midSpeedRange,
  speed,
  distance,
) {
    let time;

    if (distance <= maxSpeedRange) {
        time = distance / maxSpeed;
    }
    if (distance > maxSpeedRange && distance <= maxSpeedRange + midSpeedRange) {
        time = (maxSpeedRange / maxSpeed) + ((distance - maxSpeedRange) / midSpeed);
    }
    if (distance > maxSpeedRange + midSpeedRange) {
        time = (maxSpeedRange / maxSpeed) + (midSpeedRange / midSpeed) + ((distance - maxSpeedRange - midSpeedRange) / speed)
    }

    return new Promise((resolve) => setTimeout(() => resolve(name), time))
}

function zooRace(animals) {
  return Promise.race(
    animals.map(val => animal(val))
  )
}