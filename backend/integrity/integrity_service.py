from backend.integrity.signature_detection import detect_signature
from backend.integrity.signature_verifier import verify_signature


def derive_signature_status(result: dict) -> str:
    if result["reason"] == "no_signature":
        return "unsigned"

    if result["crypto_valid"] is False:
        return "invalid"

    if result["crypto_valid"] and result["trusted"]:
        return "trusted"

    if result["crypto_valid"] and not result["trusted"]:
        return "self_signed_or_untrusted"

    return "unknown"


async def evaluate_integrity(file_path: str, file_type: str) -> dict:
    result = {
        "file_type": file_type,
        "is_signed": False,
        "crypto_valid": None,
        "trusted": None,
        "signer_fingerprint": None,
        "reason": None,
        "signature_status": None
    }

    if file_type != "pdf":
        result["reason"] = "non_pdf"
        result["signature_status"] = "not_applicable"
        return result

    detection = detect_signature(file_path)

    if not detection.get("present"):
        result["reason"] = "no_signature"
        result["signature_status"] = "unsigned"
        return result

    verification = await verify_signature(file_path)

    result["is_signed"] = True
    result["crypto_valid"] = verification.get("valid")
    result["trusted"] = verification.get("trusted")
    result["signer_fingerprint"] = verification.get("fingerprint")

    if verification.get("valid") and verification.get("trusted"):
        result["reason"] = "trusted_signature"
    elif verification.get("valid") and not verification.get("trusted"):
        result["reason"] = "self_signed_or_untrusted"
    else:
        result["reason"] = "invalid_signature"

    result["signature_status"] = derive_signature_status(result)
    return result
