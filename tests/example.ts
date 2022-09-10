import * as anchor from "@project-serum/anchor"
import { Program } from "@project-serum/anchor"
import {
  getAssociatedTokenAddress,
  createMint,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAccount,
} from "@solana/spl-token"
import { Example } from "../target/types/example"

describe("Example", () => {
  anchor.setProvider(anchor.AnchorProvider.env())

  const program = anchor.workspace.Example as Program<Example>
  const connection = anchor.getProvider().connection
  const userWallet = anchor.workspace.Example.provider.wallet

  it("Test Instruction", async () => {
    const mint = await createMint(
      connection,
      userWallet.payer,
      userWallet.publicKey,
      userWallet.publicKey,
      6
    )

    const tokenAccountAddress = await getAssociatedTokenAddress(
      mint,
      userWallet.publicKey
    )

    const test = await program.methods
      .initialize()
      .accounts({
        payer: userWallet.publicKey,
        tokenAccount: tokenAccountAddress,
        mint: mint,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .simulate()

    console.log(test)

    // const account = await getAccount(connection, tokenAccountAddress)
    // console.log(account)
  })

  it("Test Instruction", async () => {
    const mint = await createMint(
      connection,
      userWallet.payer,
      userWallet.publicKey,
      userWallet.publicKey,
      6
    )

    const tokenAccountAddress = await getAssociatedTokenAddress(
      mint,
      userWallet.publicKey
    )

    await program.methods
      .initialize()
      .accounts({
        tokenAccount: tokenAccountAddress,
        mint: mint,
      })
      .rpc()

    const account = await getAccount(connection, tokenAccountAddress)
    console.log(account)
  })
})
