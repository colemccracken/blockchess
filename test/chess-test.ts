
import { ethers } from 'hardhat'
import { deployContract, MockProvider } from 'ethereum-waffle';

import chai from 'chai'

import ChessArtifact from '../artifacts/contracts/Chess.sol/Chess.json'
import { Chess } from "../typechain-types/Chess"

const { expect } = chai


describe("Chess", function () {
    let chess: Chess;
    let gameId: number;
    const [wallet] = new MockProvider().getWallets();
    beforeEach(async () => {
        chess = (await deployContract(wallet, ChessArtifact)) as Chess
        // Create a game and set the appropriate gameId
        gameId = await (await (await chess.createGame()).wait()).events[0].args.id;
    })

    it("Should create game and increment counter", async function () {
        await expect(chess.createGame()).to.emit(chess, "NewGame").withArgs(1, wallet.address)
        expect(await chess.getCount()).to.equal(2)
    });

    it("Should fail when the wrong color moves", async function () {
        await expect(chess.move(gameId, "black", "d5")).to.be.reverted
    });

    it("Should emit an event when the right color moves", async function () {
        await expect(chess.move(gameId, "white", "d4")).to.emit(chess, "Move").withArgs(gameId, wallet.address, "white", "d4")
        expect(await chess.whiteMovesMapping(gameId, 0)).to.equal("d4");
        await expect(chess.move(gameId, "black", "d5")).to.emit(chess, "Move").withArgs(gameId, wallet.address, "black", "d5")
        expect(await chess.blackMovesMapping(gameId, 0)).to.equal("d5");
    });

    it("Should handle empty PGN case", async function () {
        await expect(chess.getPGN(gameId)).to.be.empty;
    });

    it("Should handle white with extra move", async function () {
        // setup
        await (await chess.move(gameId, "white", "d4")).wait();

        // assert
        expect(await chess.getPGN(gameId)).to.equal("1. d4 ");
    });
    it("Should handle multiple moves for white and black", async function () {
        // setup
        await (await chess.move(gameId, "white", "d4")).wait();
        await (await chess.move(gameId, "black", "d5")).wait();
        await (await chess.move(gameId, "white", "e4")).wait();
        await (await chess.move(gameId, "black", "dxe4")).wait();

        // assert
        expect(await chess.getPGN(gameId)).to.equal("1. d4 d5 2. e4 dxe4 ");
    });

});