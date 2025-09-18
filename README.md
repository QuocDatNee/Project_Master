# NFT Academic Certificate (ERC-721)

Dự án demo phát hành chứng chỉ học thuật dưới dạng NFT (ERC-721).

## Cấu trúc
- `contracts/` — Solidity smart contracts (ví dụ: `CertNFT.sol`)
- `scripts/` — Python scripts (compile, deploy, mint, test)
- `logs/` — Lưu địa chỉ contract, tx hash, log triển khai
- `assets/` — Hình ảnh / metadata JSON cho NFT
- `.env` — Config riêng (RPC_URL, PRIVATE_KEY) — **không commit**
- `requirements.txt` — Danh sách thư viện Python
- `.gitignore` — File/Folder cần bỏ qua khi commit

## Thiết lập nhanh
```bash
python -m venv venv
# Windows:   venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
