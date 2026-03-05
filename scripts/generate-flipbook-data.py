#!/usr/bin/env python3
"""Extract and organize DOCX content into 10 flipbook pages."""

import sys
import json
from pathlib import Path
import zipfile
import xml.etree.ElementTree as ET
import re


def extract_text_from_docx(docx_path):
    """Extract all paragraphs from DOCX file."""
    paragraphs = []
    
    try:
        with zipfile.ZipFile(docx_path, 'r') as zip_ref:
            xml_content = zip_ref.read('word/document.xml')
            root = ET.fromstring(xml_content)
            
            # Namespace for Office Open XML
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            # Find all paragraphs
            for para in root.findall('.//w:p', ns):
                # Get all text runs in this paragraph
                texts = []
                for t in para.findall('.//w:t', ns):
                    if t.text:
                        texts.append(t.text)
                
                para_text = "".join(texts).strip()
                if para_text:
                    paragraphs.append(para_text)
    
    except Exception as e:
        print(f"Error extracting DOCX: {e}", file=sys.stderr)
        return []
    
    return paragraphs


def organize_into_pages(paragraphs):
    """Organize paragraphs into 10 logical pages based on content."""
    
    # Define page boundaries and titles
    pages = [
        {
            "id": "1",
            "title": "Nabi Nuh dan Masyarakatnya yang Menyembah Patung",
            "objective": "Memahami bahwa Nabi Nuh adalah nabi yang saleh dan kaumnya menyembah patung, bukan Allah",
            "narration_indices": list(range(2, 5)),  # Paragraphs 2-4
            "floatingText": "Penyembahan Patung"
        },
        {
            "id": "2",
            "title": "Dakwah Nabi Nuh yang Panjang dan Ditolak",
            "objective": "Memahami bahwa Nabi Nuh berdakwah dengan sabar tetapi ditolak oleh kaumnya selama 950 tahun",
            "narration_indices": list(range(6, 10)),  # Paragraphs 6-9
            "floatingText": "Dakwah Nabi Nuh"
        },
        {
            "id": "3",
            "title": "Arogansi Kaum Nuh dan Pengikut Setia Nabi",
            "objective": "Memahami bahwa hanya orang-orang rendah hati yang percaya kepada Nabi Nuh",
            "narration_indices": list(range(11, 17)),  # Paragraphs 11-16
            "floatingText": "Pilihan Iman"
        },
        {
            "id": "4",
            "title": "Perintah Allah: Membuat Kapal",
            "objective": "Memahami bahwa Nabi Nuh menerima perintah Allah untuk membuat kapal meskipun jauh dari laut",
            "narration_indices": list(range(18, 22)),  # Paragraphs 18-21
            "floatingText": "Perintah Allah"
        },
        {
            "id": "5",
            "title": "Pembangunan Kapal dan Ejekan Kaum Kafir",
            "objective": "Memahami bahwa Nabi Nuh tetap tenang dan sabar menghadapi ejekan saat membangun kapal",
            "narration_indices": list(range(23, 27)),  # Paragraphs 23-26
            "floatingText": "Pembangunan Kapal"
        },
        {
            "id": "6",
            "title": "Tanda Azab dari Allah: Air dan Hujan Lebat",
            "objective": "Memahami tanda-tanda permulaan azab yang dikirim Allah",
            "narration_indices": list(range(29, 33)),  # Paragraphs 29-32
            "floatingText": "Tanda Azab"
        },
        {
            "id": "7",
            "title": "Anaknya Kan'an Menolak Naik Kapal",
            "objective": "Memahami bahwa bahkan keluarga Nabi Nuh ada yang menolak kebenaran",
            "narration_indices": list(range(34, 38)),  # Paragraphs 34-37
            "floatingText": "Keputusan Kan'an"
        },
        {
            "id": "8",
            "title": "Tenggelamnya Orang-Orang Kafir",
            "objective": "Memahami bahwa azab Allah menimpa orang-orang kafir yang menolak kebenaran",
            "narration_indices": list(range(40, 43)),  # Paragraphs 40-42
            "floatingText": "Azab Allah"
        },
        {
            "id": "9",
            "title": "Air Surut dan Kapal Berlabuh",
            "objective": "Memahami bahwa Allah menyelamatkan orang-orang beriman dan menghentikan azab",
            "narration_indices": list(range(44, 48)),  # Paragraphs 44-47
            "floatingText": "Keselamatan"
        },
        {
            "id": "10",
            "title": "Pesan Penting dari Kisah Nabi Nuh",
            "objective": "Memahami pelajaran penting tentang taat kepada Allah dan kesabaran dalam berdakwah",
            "narration_indices": [48],  # Last paragraph
            "floatingText": "Pelajaran Penting"
        }
    ]
    
    # Extract narration for each page
    for page in pages:
        narrations = []
        for idx in page["narration_indices"]:
            if idx < len(paragraphs):
                para = paragraphs[idx]
                # Skip 3D model lines and URLs
                if not para.startswith("3D Model:") and not para.startswith("http"):
                    narrations.append(para)
        page["narration"] = " ".join(narrations)
    
    return pages


def main():
    docx_path = Path("d:/ARKANUH/assets/flipbook/source/CERITA NABI NUH (MEDIA PEMBELAJARAN).docx")
    
    if not docx_path.exists():
        print(f"Error: DOCX file not found at {docx_path}", file=sys.stderr)
        sys.exit(1)
    
    paragraphs = extract_text_from_docx(str(docx_path))
    pages = organize_into_pages(paragraphs)
    
    # Output as JSON
    print(json.dumps(pages, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
