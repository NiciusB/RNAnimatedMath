import { Animated } from 'react-native'

function pow(node, times) {
  return times === 0 ? 1 : times === 1 ? node : Animated.multiply(node, pow(node, Math.floor(times) - 1))
}

function cos(node) {
  return sin(Animated.add(Math.PI / 2, node))
}

// Lookup tables are faster than taylor's or any other approximation
const sinLookupTable = {
  inputRange: [],
  outputRange: [],
}
;(function() {
  const points = 100
  // For low points values (For example: 1k), milliseconds to populate are in the double digits.
  // But when using it, creating the interpolation will fire checkValidInputRange which can take hundreds of ms
  const multiplier = (Math.PI * 2) / points
  for (var x = 0; x < points; x++) {
    const key = x * multiplier
    sinLookupTable.inputRange.push(key)
    sinLookupTable.outputRange.push(Math.sin(key))
  }
})()

function sin(node) {
  const angle = Animated.modulo(node, 2 * Math.PI) // Clamp to [0, 2PI]
  return angle.interpolate(sinLookupTable)
}

function tan(node) {
  return Animated.divide(sin(node), cos(node))
}

function abs(node) {
  return node.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [1, 0, 1],
  })
}

function opposite(node) {
  return Animated.multiply(node, -1)
}

function subtract(node1, node2) {
  return Animated.add(node1, opposite(node2))
}

function inverse(node) {
  return Animated.divide(1, node)
}

export default {
  sin,
  cos,
  tan,
  pow,
  abs,
  opposite,
  inverse,
  subtract,
}
