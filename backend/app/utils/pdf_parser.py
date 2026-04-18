import fitz


def extract_text_from_pdf(file_path: str) -> tuple[str, int]:
    document = fitz.open(file_path)

    try:
        page_count = document.page_count
        pages_text: list[str] = []

        for page in document:
            page_text = page.get_text("text", sort=True).strip()

            if page_text:
                pages_text.append(page_text)

        full_text = "\n\n".join(pages_text).strip()

        return full_text, page_count
    finally:
        document.close()