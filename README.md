# token-contract

A minimal implementation of a Solana token mint and swap program.
This program uses the SPL Token library and the Anchor framework to mint and transfer token/nft to other associated
token accounts.

# develop env

* install solana

```
$ rm -rf $HOME/.cache/solana
$ sh -c "$(curl -sSfL https://release.solana.com/v1.14.17/install)"
$ solana --version
solana-cli 1.14.17 (src:b29a37cf; feat:3488713414)
$ solana config set --url localhost
$ solana address
$ solana-keygen new
```

* install anchor

```
$ cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
$ avm install 0.27.0 
$ avm use 0.27.0
$ anchor --version
anchor-cli 0.27.0
```

* install dependencies

```
$ yarn install 
```

* build

```
$ anchor build --arch sbf
or
$ yarn build
```

* test

```
$ anchor test --arch sbf
or
$ yarn test
```

# reference

```
https://lorisleiva.com/create-a-solana-dapp-from-scratch/getting-started-with-solana-and-anchor 
```

```
https://www.wordcelclub.com/conciselabs.sol/the-ultimate-developer-guide-to-the-solana-web3-stack
```

```
https://medium.com/makedeveasy/build-solana-dapps-with-anchor-rust-react-simple-way-5d2e018b0cab
```

```
https://blog.techchee.com/simple-tutorial-on-solana-rust-smart-contract-with-anchor-framework/
```

