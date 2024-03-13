## Blockchains and Merkel trees

Prereqs:
- Hashing
- Linked List

You need a blockchain for success. It's a simple fact of life. This article will tell you what one is, and how to make one.

A linked list is a value, and a pointer to the next list (or some "end of list", which is often written as None, Nil, or []).
```hs
-- Linked list with values of type "a" in Haskell
data LinkedList a = Node {val :: a, next :: LinkedList a}
                  | EndOfList

-- The same thing written more concisely
data List a = Cons a (List a)
            | Nil
```

A blockchain is very similar, but as well as storing the value of a node and the pointer to the next list, we store a the *hash* of the value of the previous node. 

Say you wanted to have a blockchain with a list of names of people who you have high fived, whilst ensuring that no one could falsely claim that you'd high fived them by modifying the earlier elements of the list. You could store the names as a blockchain.

```hs
hash :: String -> Int
hash = (`mod` 128) . sum . map fromEnum

data Blockchain = Node String Int Blockchain
                | EndNode Int
                deriving Show -- To be able print the data in Haskell
```

Looks pretty similar to the linked list from earlier... We will store the hash of each string value as an Int for ease of use. So can we create a blockchain from a list of strings?

```hs
fromList :: [String] -> Blockchain
fromList xs = fromListAux xs 0
    where
        fromListAux [] prevHash = EndNode prevHash
        fromListAux (h:t) prevHash = Node h prevHash (fromListAux t (hash h))
```

In Haskell ```(h:t)``` is a pattern matching on the first element of the list (the "head") and the rest (the "tail"). So what would an example blockchain look like?

```hs
exampleBlockchain = fromList ["Sam", "Rich"]
-- Node "Sam" 0 (Node "Rich" 33 (EndNode 6))
```
Note that ```hash "Sam" == 33``` and ```hash "Rich" == 6```. If anyone tries to mess with the names in the list, say by inserting a new one, then the chance that the EndNode will be valid is very unlikely.

```hs
validate :: Blockchain -> Bool
validate (EndNode 0) = True
validate (EndNode _) = False
validate chain = go chain 0 -- Valid chains start with 0
    where
        go (Node val expectedHash rest) prevHash = (expectedHash == prevHash) && go rest (hash val)
        go (EndNode lastHash) expectedHash = lastHash == expectedHash
```
This validate function lets us check whether the hashes of each node line up.
```hs
validate (Node "Sam" 0 (Node "Rich" 33 (EndNode 6)))
-- True

validate (Node "Sam" 0 (Node "Ron" 33 (EndNode 6)))
-- False, hash "Ron" is 47, not 6
```
This means that if we know the hash in the EndNode, we can be confident in validating the whole chain. You'll notice that validating a blockchain requires looking at every node (if the validation doesn't exit on a failure early). To prevent this, in real usecases, people use alternative data structures, like Merkel trees, which can be validated by only looking at ```log n``` nodes.