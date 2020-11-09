const logContents = `1a2ddc2, 5f2b932
f1a543f, 5890595
3abe124, bd11537
f1a543f, 5f2b932
f1a543f, bd11537
f1a543f, 5890595
1a2ddc2, bd11537
1a2ddc2, 5890595
3abe124, 5f2b932
f1a543f, 5f2b932
f1a543f, bd11537
f1a543f, 5890595
1a2ddc2, 5f2b932
1a2ddc2, bd11537
1a2ddc2, 5890595`;

// function composition 
const pipeline = (...fns) => fns.reduceRight((a, b) => c => a(b(c)));

// partial application
const leftPartApplication = (fn, ...args) => fn.bind(null, ...args);

// generators
function* asStream(iterable) {
  yield* iterable;
}
function* mapIterableWith(mapFn, iterable) {
  for (const elem of iterable) {
    yield mapFn(elem);
  }
}
const sortedFlatMap = (mapFnMaker, keyFn) =>
  function* (values) {
    const mappersByKey = new Map();

    for (const value of values) {
      const key = keyFn(value);
      let mapperFn;

      if (mappersByKey.has(key)) {
        mapperFn = mappersByKey.get(key);
      } else {
        mapperFn = mapFnMaker();
        mappersByKey.set(key, mapperFn);
      }

      let res =  mapperFn(value) 
      console.log('going to yield: yield * ', res);

      yield* res; //delegating yield to the array of arrays. if empty does not yield !!
    }
  };

// utility functions
const userKey = ([user, _]) => user;
const transitionsMaker = () => {
  let locations = [];

  return ([_, location]) => {
    locations.push(location);

    if (locations.length === 2) {
      const transition = locations;
      locations = locations.slice(1);
      return [transition];
    } else {
      return [];
    }
  };
};

const transitionCounter = () => {
    let transitions = {}

    return (transition) => {
        if (transitions[transition]){
            transitions[transition] += 1
        } else {
            transitions[transition] = 1
        }
        return transitions
    }
}

// functions as data
const lines = (str) => str.split("\n");
const datums = (str) => str.split(", ");
const transitionStrings = (transition) => transition.join('->');
const popularTransitions = (transitions) => {
    const transitionNumbers = new Map()
    
    for (const transition of transitions){
        if (transitionNumbers.has(transition)) {
            transitionNumbers.set(transition, transitionNumbers.get(transition) + 1)
        } else {
            transitionNumbers.set(transition, 1)
        }
    }

    return transitionNumbers
}
const mostPopulars = (map) => 
    Array.from(map.entries()).reduce(
        ([wasKeys, wasCount], [transitionKey, count]) => {
            if (count < wasCount) {
              return [wasKeys, wasCount];
            } else if (count > wasCount) {
              return [new Set([transitionKey]), count];
            } else {
              wasKeys.add(transitionKey);
              return [wasKeys, wasCount];
            }
          },
        [new Set(), 0])

// partially applied generators
const datumizeStream = leftPartApplication(mapIterableWith, datums);
const stringifyStream = leftPartApplication(mapIterableWith, transitionStrings);

// streams one by one
const streamOfLines = asStream(lines(logContents));
const streamOfDatums = datumizeStream(streamOfLines);
const transitionsStream = sortedFlatMap(
  transitionsMaker,
  userKey
)(streamOfDatums);
const transStringStream = stringifyStream(transitionsStream)

// all steps composed
const theStagedSolution = pipeline(
    lines,
    asStream,
    datumizeStream,
    sortedFlatMap(transitionsMaker,userKey),
    stringifyStream,
    popularTransitions,
    mostPopulars
)

// ----------------
console.log(theStagedSolution(logContents));
