const Escrow = artifacts.require('Escrow');;
const chaiModule = require('chai');
const { BigNumber } = require("ethers");
const { chaiEthers } = require('chai-ethers');
const truffleAssert = require('truffle-assertions');
chaiModule.use(chaiEthers);
const { expect } = chaiModule;

contract("Escrow", async (accounts) => {

    let escrow;
    let owner;
    let alice;
    let bob;
    const projectNumber = 101;
    const commission = 10;

    beforeEach(async () => {
        [owner, alice, bob] = accounts;
        escrow = await Escrow.deployed();
    })

    describe("Deposit", () => {

        it('should NOT deposit if value = 0', async () => {

            await (expect(escrow.deposit(projectNumber)).to.be.revertedWith("!value"));

        })

        it('should NOT deposit if projectNumber = 0', async () => {

            await (expect(escrow.deposit(0, {
                value: "1000000000000000"
            })).to.be.revertedWith("!project"));

        })

        it('should NOT let owner claim stake if totalStake = 0', async () => {

            await (expect(escrow.claimOwnerStake({
                from: owner
            })).to.be.revertedWith("!value"));

        })

        it('should deposit successfully', async () => {

            const tx = await escrow.deposit(projectNumber, {
                value: "1000000000000000"
            });
            const tx2 = await escrow.deposit(projectNumber, {
                value: "1500000000000000",
                from: alice
            });

            truffleAssert.eventEmitted(tx, 'Deposit', obj => {
                return obj.from == owner && obj.value == "1000000000000000"
            });
            truffleAssert.eventEmitted(tx2, 'Deposit', obj => {
                return obj.from == alice && obj.value == "1500000000000000"
            });

        })

    })

    describe("Withdraw", () => {

        it('should NOT withdraw if sender is NOT owner', async () => {

            await (expect(escrow.withdraw(projectNumber, owner, {
                from: alice
            })).to.be.revertedWith("!owner"));

        })

        it('should NOT withdraw if projectNumber = 0', async () => {

            await (expect(escrow.withdraw(0, owner)).to.be.revertedWith("!project"));

        })

        it('should NOT withdraw if peyee = 0', async () => {

            await (expect(escrow.withdraw(projectNumber, "0x0000000000000000000000000000000000000000")).to.be.revertedWith("!address"));

        })

        it('should withdraw successfully', async () => {

            const balanceBeforeWithdraw = BigNumber.from(await web3.eth.getBalance(alice));

            const tx = await escrow.withdraw(projectNumber, alice, {
                from: owner
            });

            const balanceAfterWithdraw = BigNumber.from(await web3.eth.getBalance(alice));

            const expectedValue = BigNumber.from((100 - commission) * 2500000000000000 / 100);

            //1- expect emitted event 
            truffleAssert.eventEmitted(tx, 'Withdraw', obj => {
                return obj.payee == alice && obj.project == projectNumber && obj.value == `${expectedValue}`
            });

            //2- expect balance change
            expect(balanceAfterWithdraw).to.eq(balanceBeforeWithdraw.add(expectedValue));

            //3- expect another withdraw shows error
            await (expect(escrow.withdraw(projectNumber, alice, {
                from: owner
            })).to.be.revertedWith("!value"));

        })

        it("should claim owner's stake successfully", async () => {

            const tx = await escrow.claimOwnerStake({from: owner});
            
            //1- expect emitted event 
            truffleAssert.eventEmitted(tx, 'Withdraw', obj => {

                expect(obj.value).not.eq(0); // totalStake

                return obj.payee == owner && obj.project == 0;
            });
            
            //2- expect another claim shows error
            await (expect(escrow.claimOwnerStake({
                from: owner
            })).to.be.revertedWith("!value"));

        })
    })
})