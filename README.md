# token-contract

A minimal implementation of a Solana token mint and swap program.
This program uses the SPL Token library and the Anchor framework to mint and transfer token/nft to other associated
token accounts.

# develop env

```
$ rm -rf $HOME/.cache/solana
$ sh -c "$(curl -sSfL https://release.solana.com/v1.14.6/install)"
```

```
$ anchor build --arch sbf
```

```
$ anchor test --arch sbf
```

