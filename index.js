// # Module proto*
//
// Proxy-based Self-and-Slate-inspired slow-as-fuck multiple-delegation
// for ECMAScript6-aka-JavaScript
//
//
// Copyright (c) 2013 Quildreen "Sorella" Motta <quildreen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

require('harmony-reflect')
var clone   = Object.create
var proto   = Object.getPrototypeOf
var keys    = Object.keys
var define  = Object.defineProperty
var slice   = Function.call.bind([].slice)
var Nothing = {}

function unique(xs) {
  return xs.reduce(function(as, b) {
                     return as.indexOf(b) != -1?  as
                     :                            as.concat([b]) }, [])}

function flatten(xs) {
  return xs.reduce(function(as, bs){ return as.concat(bs) }, []) }

function extend(target) {
  slice(arguments, 1).forEach(function(x){
                                keys(x).forEach(function(k){
                                                  target[k] = x[k] })})
  return target }

function all(o) {
  return [o].concat(o.proto$) }

function firstMatch(o, f) {
  return all(o).reduce(function(r, a) {
                         return r !== Nothing?  r
                         :                      f(a) }, Nothing)}

function lookup(o, s) {
  return firstMatch(o, function(a) {
                         return s in a?  a[s]
                         :               Nothing })}

function propertyNames(o) {
  return unique(all(o).map(keys).reduce(flatten).sort()) }



function makeObject(anObject) {
  return Proxy(anObject, {
    getOwnPropertyDescriptor: function(o, n) {
      return Object.getOwnPropertyDescriptor(o, n) }

  , getOwnPropertyNames: function(o) {
      return Object.getOwnPropertyNames(o) }

  , getPrototypeOf: function(o) {
      return o.proto$ }

  , defineProperty: function(o, n, d) {
      return define(o, n, d) }

  , deleteProperty: function(o, n, d) {
      return delete o[n] }

  , has: function(o, name) {
      return lookup(o, name) !== Nothing }

  , hasOwn: function(o, name) {
      return o.hasOwnProperty(name) }

  , get: function(o, name) {
      var result = lookup(o, name)
      return result === Nothing? undefined : result }

  , set: function(o, name, val) {
      return o[name] = val }

  , keys: function(o) {
      return propertyNames(o) }

  , enumerate: function(o) {
      return propertyNames(o) }
  }) }

Base = {
  proto$: []

, addDelegation: function(to) {
    unique(this.proto$ = [to].concat(this.proto$)) }

, removeDelegation: function(to) {
    this.proto$ = this.proto$.filter(function(a){ return a !== to })}

, clone: function(f) {
    var result = makeObject({ proto$: [this] })
    if (f)  f.call(result)
    return result }

, cloneWith: function(o) {
    return extend(this.clone(), o) }
}

module.exports = makeObject(Base)
