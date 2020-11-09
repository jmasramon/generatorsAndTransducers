const pipeline = (...fns) => fns.reduce((a, b) => (c) => a(b(c)))
const pipelineR = (...fns) => fns.reduceRight((a, b) => (c) => b(a(c)))

const add3 = (a) => a + 3
const subst2 = (a) => a - 2

console.log(pipeline(add3, subst2)(6));
console.log(pipelineR(add3, subst2)(6));