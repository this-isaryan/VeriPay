def verify_vendor_identity(
    signature_status: str,
    signer_fingerprint: str | None,
    vendor
) -> str:
    # Invalid or unsigned signatures are never acceptable
    if signature_status in ("invalid", "unsigned"):
        return "not_verified"

    # Vendor not registered
    if vendor is None:
        return "unregistered_vendor"

    # Fingerprint mismatch
    if signer_fingerprint != vendor.public_key_fingerprint:
        return "certificate_mismatch"

    # Vendor inactive
    if vendor.status != "active":
        return "vendor_inactive"

    # Fully trusted case
    if signature_status == "trusted":
        return "verified"

    # Self-signed but vendor-matched case (NEW, explicit)
    if signature_status == "self_signed_or_untrusted":
        return "verified_self_signed"

    return "not_verified"
