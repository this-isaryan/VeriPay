import os
import platform
from shutil import which
from pathlib import Path


def ensure_poppler_available():
    system = platform.system().lower()

    # Windows (local dev only)
    if system == "windows":
        poppler_env = os.getenv("POPPLER_PATH")

        if poppler_env:
            os.environ["PATH"] += f";{poppler_env}"
            return

        # fallback ONLY for local dev
        fallback = Path(r"C:\poppler\poppler-25.12.0\Library\bin")
        if fallback.exists():
            os.environ["PATH"] += f";{fallback}"
            return

        raise RuntimeError(
            "Poppler not found. Set POPPLER_PATH env variable."
        )

    # Linux / macOS (hosting)
    else:
        if which("pdftoppm") is None:
            raise RuntimeError(
                "Poppler not found. Install poppler-utils."
            )
