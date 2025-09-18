import pathlib
from web3 import Web3
from solcx import install_solc, set_solc_version, compile_standard
from eth_tester import EthereumTester, PyEVMBackend

# --- setup
install_solc("0.8.24")
set_solc_version("0.8.24")

root = pathlib.Path(__file__).resolve().parents[1]   # .../nft-cert
sol_rel = "contracts/CertNFT.sol"
source = (root / sol_rel).read_text(encoding="utf-8")

compiled = compile_standard(
    {
        "language": "Solidity",
        "sources": {sol_rel: {"content": source}},
        "settings": {
            "optimizer": {"enabled": True, "runs": 200},
            "remappings": ["@openzeppelin/=node_modules/@openzeppelin/"],
            "outputSelection": {"*": {"*": ["abi", "evm.bytecode.object"]}},
        },
    },
    allow_paths=str(root / "node_modules"),
    base_path=str(root),
)

# ---- LƯU Ý: dùng sol_rel làm key
abi = compiled["contracts"][sol_rel]["CertNFT"]["abi"]
bytecode = compiled["contracts"][sol_rel]["CertNFT"]["evm"]["bytecode"]["object"]

# --- local chain
backend = PyEVMBackend()
w3 = Web3(Web3.EthereumTesterProvider(EthereumTester(backend=backend)))

owner, user1 = w3.eth.accounts[0], w3.eth.accounts[1]

CertNFT = w3.eth.contract(abi=abi, bytecode=bytecode)
tx = CertNFT.constructor("DTU Certificate", "DTUCERT").transact({"from": owner})
rc = w3.eth.wait_for_transaction_receipt(tx)
contract = w3.eth.contract(address=rc.contractAddress, abi=abi)
print("Deployed at:", contract.address)

assert contract.functions.nextTokenId().call() == 1
w3.eth.wait_for_transaction_receipt(
    contract.functions.mintTo(user1, "ipfs://CID1").transact({"from": owner})
)
assert contract.functions.nextTokenId().call() == 2
assert contract.functions.tokenURI(1).call() == "ipfs://CID1"

failed = False
try:
    contract.functions.mintTo(owner, "ipfs://CID2").transact({"from": user1})
except Exception:
    failed = True
assert failed, "Non-owner should not be able to mint"

print("✅ All offchain checks passed.")
