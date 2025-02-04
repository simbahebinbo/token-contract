import * as anchor from "@coral-xyz/anchor";
import {Program} from "@coral-xyz/anchor";
// @ts-ignore
import {TokenContract} from "../target/types/token_contract";
import {
    createAssociatedTokenAccountInstruction,
    createInitializeMintInstruction,
    getAssociatedTokenAddress,
    MINT_SIZE,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {assert} from "chai";

describe("token-contract", () => {
    // Configure the client to use the local cluster.
    let provider = anchor.AnchorProvider.env();
    let connection = provider.connection;
    anchor.setProvider(provider);
    // Get the TokenContract struct from the contract
    const program = anchor.workspace.TokenContract as Program<TokenContract>;
    // Generate a random keypair that will represent out token
    const mintKey: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    // AssociatedTokenAccount for anchor's workspace wallet
    let associatedTokenAccount = undefined;

    it("Initialized!", async () => {
        // Add your test here.
        const tx = await program.methods.initialize().accounts({}).rpc();
        console.log("initialize transaction signature", tx);
    });

    it("Mint Token", async () => {
        // Get anchor's wallets public key
        const userPubKey = provider.wallet.publicKey;
        // Gets the amount of SOL needed to pay rent for out Token Mint
        const lamports: number = await connection.getMinimumBalanceForRentExemption(
            MINT_SIZE
        );
        // Get the address of the associated token account for a given mint and owner
        associatedTokenAccount = await getAssociatedTokenAddress(
            mintKey.publicKey,
            userPubKey
        );
        // Fires a list of instructions
        const mint_tx = new anchor.web3.Transaction().add(
            // Use anchor to create an account from the mint key(token) that we created
            anchor.web3.SystemProgram.createAccount({
                fromPubkey: userPubKey,
                newAccountPubkey: mintKey.publicKey,
                space: MINT_SIZE,
                programId: TOKEN_PROGRAM_ID,
                lamports,
            }),
            // A transaction to create our mint account that is controlled by our anchor wallet
            createInitializeMintInstruction(
                mintKey.publicKey, 0, userPubKey, userPubKey
            ),
            // Create the ATA account that is associated with our mint on our anchor wallet
            createAssociatedTokenAccountInstruction(
                userPubKey, associatedTokenAccount, userPubKey, mintKey.publicKey
            )
        );
        // sends and creates the transaction(mint key is the signer)
        const res = await provider.sendAndConfirm(mint_tx, [mintKey]);

        console.log(
            await connection.getParsedAccountInfo(mintKey.publicKey)
        );
        console.log("Account: ", res);
        console.log("Mint key: ", mintKey.publicKey.toString());
        console.log("User: ", userPubKey.toString());
        // Executes our code to mint our token into our specified ATA
        await program.methods.mintToken().accounts({
            mint: mintKey.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenAccount: associatedTokenAccount,
            authority: userPubKey,
        })
            .rpc();
        // Get minted token amount on the ATA for our anchor wallet
        // @ts-ignore
        const minted = (await connection.getParsedAccountInfo(associatedTokenAccount)).value.data.parsed.info.tokenAmount.amount;
        assert.equal(minted, 10);
    });

    it("Transfer Token", async () => {
        // Get anchor's wallets public key
        const userPubKey = provider.wallet.publicKey;
        // Wallet that will receive the token
        const toWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();
        // The ATA for a token on the To wallet(but might not exist yet)
        const toATA = await getAssociatedTokenAddress(
            mintKey.publicKey,
            toWallet.publicKey
        );
        // Fires a list of instructions
        const mint_tx = new anchor.web3.Transaction().add(
            // Create the ATA account that is associated with our To wallet
            createAssociatedTokenAccountInstruction(
                userPubKey, toATA, toWallet.publicKey, mintKey.publicKey
            )
        );
        // Sends and create the transaction
        const res = await provider.sendAndConfirm(mint_tx, []);
        console.log(
            await connection.getParsedAccountInfo(mintKey.publicKey)
        );
        console.log("Account: ", res);
        console.log("Mint key: ", mintKey.publicKey.toString());
        console.log("User: ", userPubKey.toString());

        // Executes our transfer smart contract
        await program.methods.transferToken().accounts({
            tokenProgram: TOKEN_PROGRAM_ID,
            from: associatedTokenAccount,
            fromAuthority: userPubKey,
            to: toATA,
        })
            .rpc();
        // Get minted token amount on the ATA for our anchor wallet
        // @ts-ignore
        const transferred = (await connection.getParsedAccountInfo(associatedTokenAccount)).value.data.parsed.info.tokenAmount.amount;
        assert.equal(transferred, 5);
    });
});
