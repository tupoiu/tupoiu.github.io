## A logarithmic algorithm for Fibonacci numbers

I've been reading the book Structure and Interpretation of Computer Programs (Abelson, Sussman), and within it, I found a beautiful algorithm for the Fibonacci numbers.

The intuitive relation for the Fibonacci numbers is:
```hs
-- Haskell code
fib 0 = 1
fib 1 = 1
fib n = fib (n-1) + fib (n-2)
```
While it is amazing that this code snippet runs correctly in Haskell, unfortunately, this way of doing recursion is in general slow. Let's expand a few terms for `n = 4`.
```hs
fib 4 = fib 3                 + fib 2
fib 4 = fib 2         + fib 1 + fib 1 + fib 0
fib 4 = fib 1 + fib 0 + 1     + 1     + 1
fib 4 = 1     + 1     + 1     + 1     + 1
```
The number of operations quickly grows with `n` - worse than `O(n)`. You may be thinking, "why can't we just reuse the result for `fib 2`? Why not memoise/cache the results?"
We can do better by caching in place. Consider the Fibonacci sequence as a child of a function like this:
```hs
fibNext a b = (a + b, a)
```
Try transforming this quickly into an algorithm yourself.
.  
.  
.  
.  
.  
Ok, here's mine:
```hs
fib n = fibIter 1 1 n

fibIter _ b 0 = b
fibIter a b n = fibIter (a + b) a (n - 1)
```
Now, we have `O(1)` memory usage and `O(n)` time complexity.
But... this isn't even close to the best algorithm. 

Let's do some experiments.
```
(a, b)
(a + b, a)
(2a + b, a + b)
(3a + 2b, 2a + b)
(5a + 3b, 3a + 2b)
(8a + 5b, 5a + 3b)
```
At each successive fibNext, we seem to be producing the Fibonacci sequence within the coefficients. Notice how the middle 2 coefficients always match. Writing these transformations as matrices, we get:
```
|1 1| * |a|
|1 0|   |b|
...
|8 5| * |a|
|5 3|   |b|
```
Calling our first matrix `T`, we can hypothesise a form for any `T^n`. Try and guess the form, keeping in mind the original Fibonacci relation `fib n = fib (n - 1) + fib (n - 2)`.
.  
.  
.  
.  
.  
.  
.  
Ok, the form of `T^n` is:
```
|(p + q) q|
|   q    p|
```
You can prove by induction that any `T^n` will be of this form. Using this, we can get a formula for `(T^n)^2`. You may be starting to get an inkling of how to improve the algorithm now... think `2^8 = (2^4)^2 = ((2^2)^2)^2 = ...`.
So, if:
```
T^n = |(p + q) q|
      |   q    p|
```
Then:
```
T^(2n) = |(p + q) q| |(p + q) q| 
         |   q    p| |   q    p|
       
       = |(p^2 + 2pq + 2q^2) (    2pq + q^2)|
         |(      2pq +  q^2) (p^2     + q^2)|
```
Try and work from here to find the algorithm yourself!  

Hint: The time complexity is `O(log n)`. Try and write a logarithmic time exponentiation algorithm first using `(b^(n/2))^2 = b^n`!  
.  
.  
.  
.  
Hint 2: Write a function `fibIterT` of so that:
```hs
fibIterT p q a b n =
  |(p + q) q| ^n |a|
  |   q    p|    |b|
```
Ok, here it is:
```hs
fibIterT _ _ a b 0 = b
fibIterT p q a b n
  | even n = fibIterT p' q' a b (n `div` 2)
  | otherwise = fibIterT p q a' b' (n - 1)
  where
    a' = (p+q)*a + q*b
    b' = q*a + p*b
    p' = p^2 + q^2
    q' = 2*p*q + q^2

fib n = fibIterT 0 1 1 1 n
```
Hopefully you can see where `p'` and `q'` come from. If you have an odd n, you can just multiply by your pq matrix once, and you'll be back to an even n. This is the origin of `a'` and `b'`, `pq_matrix (a, b) = (a', b')`.

SICP has been really interesting so far. I can finally see why people enjoy writing Lisp, even if it is horrendously ugly - it's very simple, and all the brackets make sure that you're never confused about operator precedence!