#!/usr/bin/env python3
"""Create a source presentation for the ARKANUH flipbook."""

from __future__ import annotations

from pathlib import Path
import sys

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_AUTO_SHAPE_TYPE, MSO_CONNECTOR
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt


ROOT_DIR = Path(__file__).resolve().parent.parent
OUTPUT_FILE = ROOT_DIR / "assets" / "flipbook" / "source" / "cerita-nabi-nuh-generated.pptx"
SLIDE_WIDTH = Inches(10)
SLIDE_HEIGHT = Inches(5.625)

SLIDES = [
    {
        "title": "Nabi Nuh dan Kaumnya",
        "content": (
            "Pada zaman dahulu, hiduplah Nabi Nuh yang saleh dan baik hati. "
            "Beliau tinggal di tengah kaum yang sudah lupa kepada Allah.\n\n"
            "Kaum Nabi Nuh justru menyembah patung-patung dan tidak mau mengikuti ajaran yang benar."
        ),
    },
    {
        "title": "Dakwah Nabi Nuh",
        "content": (
            "Nabi Nuh mengajak kaumnya kembali menyembah Allah. "
            "Beliau berdakwah dengan sabar dan penuh kasih sayang.\n\n"
            "Setiap hari Nabi Nuh mengingatkan bahwa hanya Allah yang pantas disembah."
        ),
    },
    {
        "title": "Penolakan Kaum",
        "content": (
            "Kaum Nabi Nuh menolak ajakan beliau. Mereka berkata bahwa Nabi Nuh hanya manusia biasa.\n\n"
            "Bahkan mereka menertawakan dan meremehkan Nabi Nuh, walaupun beliau berdakwah sangat lama."
        ),
    },
    {
        "title": "Orang Beriman yang Setia",
        "content": (
            "Hanya sedikit orang yang mau mengikuti Nabi Nuh. Mereka adalah orang-orang yang rendah hati.\n\n"
            "Nabi Nuh tetap bersyukur karena masih ada pengikut yang beriman dan setia."
        ),
    },
    {
        "title": "Perintah Membuat Kapal",
        "content": (
            "Allah memerintahkan Nabi Nuh untuk membuat kapal yang sangat besar.\n\n"
            "Walaupun tempat itu jauh dari laut, Nabi Nuh tetap taat dan langsung memulai pekerjaannya."
        ),
    },
    {
        "title": "Kapal Dibangun",
        "content": (
            "Nabi Nuh dan para pengikutnya bekerja keras membangun kapal.\n\n"
            "Kaum kafir datang mengejek, tetapi Nabi Nuh tetap tenang dan tidak berhenti."
        ),
    },
    {
        "title": "Banjir Besar Datang",
        "content": (
            "Air memancar dari bumi dan hujan turun sangat lebat dari langit.\n\n"
            "Nabi Nuh segera membawa orang-orang beriman dan hewan-hewan ke dalam kapal."
        ),
    },
    {
        "title": "Kan'an Menolak",
        "content": (
            "Nabi Nuh memanggil putranya, Kan'an, agar naik ke kapal.\n\n"
            "Namun Kan'an menolak dan memilih mencari perlindungan sendiri di gunung yang tinggi."
        ),
    },
    {
        "title": "Kaum Kafir Tenggelam",
        "content": (
            "Air semakin tinggi dan menenggelamkan daratan. Orang-orang kafir tidak dapat menyelamatkan diri.\n\n"
            "Kapal Nabi Nuh tetap selamat karena Allah menjaga orang-orang yang beriman."
        ),
    },
    {
        "title": "Air Surut dan Hikmah",
        "content": (
            "Setelah banjir surut, kapal Nabi Nuh berlabuh dengan selamat.\n\n"
            "Kita belajar untuk taat kepada Allah, sabar saat menghadapi cobaan, dan tidak sombong."
        ),
    },
]


def add_full_slide_background(slide, color: RGBColor) -> None:
    background = slide.shapes.add_shape(
        MSO_AUTO_SHAPE_TYPE.RECTANGLE,
        Inches(0),
        Inches(0),
        SLIDE_WIDTH,
        SLIDE_HEIGHT,
    )
    background.fill.solid()
    background.fill.fore_color.rgb = color
    background.line.fill.background()


def add_cover_slide(prs: Presentation, image_path: Path | None, title: str, subtitle: str) -> None:
    slide = prs.slides.add_slide(prs.slide_layouts[6])

    if image_path and image_path.exists():
        slide.shapes.add_picture(str(image_path), Inches(0), Inches(0), width=SLIDE_WIDTH, height=SLIDE_HEIGHT)
    else:
        add_full_slide_background(slide, RGBColor(180, 226, 255))

    overlay = slide.shapes.add_shape(
        MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        Inches(1.7),
        Inches(1.4),
        Inches(6.6),
        Inches(2.8),
    )
    overlay.fill.solid()
    overlay.fill.fore_color.rgb = RGBColor(11, 65, 122)
    overlay.fill.transparency = 0.18
    overlay.line.color.rgb = RGBColor(245, 196, 80)
    overlay.line.width = Pt(2)

    title_box = slide.shapes.add_textbox(Inches(2.0), Inches(1.85), Inches(6.0), Inches(1.0))
    title_frame = title_box.text_frame
    title_frame.word_wrap = True
    title_paragraph = title_frame.paragraphs[0]
    title_paragraph.text = title
    title_paragraph.font.size = Pt(30)
    title_paragraph.font.bold = True
    title_paragraph.font.color.rgb = RGBColor(255, 255, 255)
    title_paragraph.alignment = PP_ALIGN.CENTER

    subtitle_box = slide.shapes.add_textbox(Inches(2.1), Inches(3.0), Inches(5.8), Inches(0.7))
    subtitle_frame = subtitle_box.text_frame
    subtitle_frame.word_wrap = True
    subtitle_paragraph = subtitle_frame.paragraphs[0]
    subtitle_paragraph.text = subtitle
    subtitle_paragraph.font.size = Pt(18)
    subtitle_paragraph.font.color.rgb = RGBColor(255, 245, 184)
    subtitle_paragraph.alignment = PP_ALIGN.CENTER


def add_content_slide(prs: Presentation, title: str, content: str, slide_number: int) -> None:
    slide = prs.slides.add_slide(prs.slide_layouts[6])

    add_full_slide_background(slide, RGBColor(244, 250, 255))

    title_box = slide.shapes.add_textbox(Inches(0.45), Inches(0.25), Inches(9.1), Inches(0.7))
    title_frame = title_box.text_frame
    title_frame.word_wrap = True
    title_paragraph = title_frame.paragraphs[0]
    title_paragraph.text = title
    title_paragraph.font.size = Pt(24)
    title_paragraph.font.bold = True
    title_paragraph.font.color.rgb = RGBColor(22, 66, 121)
    title_paragraph.alignment = PP_ALIGN.CENTER

    divider = slide.shapes.add_connector(
        MSO_CONNECTOR.STRAIGHT,
        Inches(0.7),
        Inches(1.0),
        Inches(9.3),
        Inches(1.0),
    )
    divider.line.color.rgb = RGBColor(110, 182, 238)
    divider.line.width = Pt(2)

    content_box = slide.shapes.add_textbox(Inches(0.65), Inches(1.35), Inches(5.8), Inches(3.7))
    content_frame = content_box.text_frame
    content_frame.word_wrap = True
    content_paragraph = content_frame.paragraphs[0]
    content_paragraph.text = content
    content_paragraph.font.size = Pt(16)
    content_paragraph.font.color.rgb = RGBColor(48, 70, 95)
    content_paragraph.line_spacing = 1.25

    note_box = slide.shapes.add_shape(
        MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        Inches(6.8),
        Inches(1.4),
        Inches(2.55),
        Inches(3.4),
    )
    note_box.fill.solid()
    note_box.fill.fore_color.rgb = RGBColor(255, 255, 255)
    note_box.line.color.rgb = RGBColor(179, 213, 238)
    note_box.line.width = Pt(1.5)

    note_text = slide.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(2.1), Inches(1.7))
    note_frame = note_text.text_frame
    note_frame.word_wrap = True
    note_paragraph = note_frame.paragraphs[0]
    note_paragraph.text = f"Ilustrasi Hal {slide_number}\n\nTambahkan visual akhir di sini."
    note_paragraph.font.size = Pt(13)
    note_paragraph.font.color.rgb = RGBColor(100, 120, 145)
    note_paragraph.alignment = PP_ALIGN.CENTER


def create_presentation(image_path: Path | None = None) -> Path:
    presentation = Presentation()
    presentation.slide_width = SLIDE_WIDTH
    presentation.slide_height = SLIDE_HEIGHT

    add_cover_slide(presentation, image_path, "KISAH NABI NUH", "Media Belajar ARKANUH")

    for index, slide_data in enumerate(SLIDES, start=1):
        add_content_slide(
            presentation,
            title=slide_data["title"],
            content=slide_data["content"],
            slide_number=index,
        )

    add_cover_slide(presentation, image_path, "Terima Kasih", "Selamat belajar dan semoga bermanfaat")

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    presentation.save(str(OUTPUT_FILE))
    return OUTPUT_FILE


def main() -> None:
    image_path = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else None
    output_file = create_presentation(image_path)
    print(f"Presentation created: {output_file}")


if __name__ == "__main__":
    main()
