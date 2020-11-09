This shows different approaches to complex data transformations.

From https://raganwald.com/2017/04/30/transducers.html

First we try a stagged approach -> very good readability
    as a nested call to functions. We use lots of maps and reductions!
    as a pipeline 
    "it’s decomposed nicely, it’s easy to test, it’s easy to reuse the components, and we get names for things that matter."

Then we try an optimized approach with single pass transformations
    normal code -> becomes very entangled and complex code
    
Then we use generators to have both performance and readability
    With generators we create iterables which act as streams through 
        for..of directly
        a custom made mapIterableWith based on for..of
    The last two transformations were done "normally" because they are reducers

Finally we try an even better approach based on trasducers
    same performance and readability than generators but more reusability
        for the transformations of each element we just use map transducers
        for the collation part we use a stateful filter
        we used the "final" reducer to do the counting
        The last transformation is done "normally" because it is a final reduction
    "The elegance of the transducer pattern is that transformers compose naturally to produce new transformers. So we can chain as many transformers together as we like"

Notes - 
    We also learn how to use 
        bind to partially apply
        reduce to make a function(s) pipeline
    In the generators version we needed to keep state to collate two consecutive input elements
        we did that with higher order functions and closures 
    Also important: yield * arr returns nothing for an empty array. This was the trick to generate transitions in a single pass
    In transducers, part of the state management can be done in the reducer accomulator.
