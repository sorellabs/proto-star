require 'harmony-reflect'
{create: clone, getPrototypeOf: proto, keys,
 defineProperty: define, hasOwnProperty: hasOwn} = Object
slice = []~slice
Nothing = {}

uniaue = ->
  (`it.reduce` []) (xs, x) ->
    if ~xs.indexOf x
      xs
    else
      xs ++ x

flatten = ->
  (`it.reduce` []) (xs, ys) ->
    xs ++ ys

all = ->
  [it] ++ it.proto$

firstMatch = (o, f) ->
  (all o).reduce (r, a) ->
      if r is Nothing
        f a
      else
        r
  , Nothing

lookup = (o, s) ->
  firstMatch o, (a) ->
    if s of a
      a[s]
    else
      Nothing

propertyNames = ->
  (all o)
  .map keys
  .reduce flatten
  .sort!
  |> unique

makeObject = (obj) ->
  Proxy obj,
    getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor
    getOwnPropertyNames: Object.getOwnPropertyNames
    getPrototypeOf: (.proto$)
    defineProperty: (o, n, d) ->
      define o, n, d
    deleteProperty: (o, n, d) ->
      delete! o[n]
    has: (o, name) ->
      lookup(o, name) isnt Nothing
    hasOwn: (o, name) ->
      hasOwn.call o, name
    get: (o, name) ->
      lookup o, name
        return if .. is Nothing then void else ..
    set: (o, name, val) ->
      o[name] = val
    keys: (o) ->
      propertyNames o
    enumerate: (o) ->
      propertyNames o

Base =
  proto$: []

  addDelegation: (to) ->
    unique @proto$ = [to] ++ @proto$

  removeDelegation: (to) ->
    @proto$ = @proto$.filter (isnt to)

  clone: (f) ->
    result = makeObjec proto$: [this]
    if f?.call result
    result

  cloneWith: (o) ->
    @clone! <<< o


module.exports = makeObject Base
