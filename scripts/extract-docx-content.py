#!/usr/bin/env python3
"""Extract content from DOCX file."""

import sys
import json
from pathlib import Path
import zipfile
import xml.etree.ElementTree as ET


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


def main():
    docx_path = Path("d:/ARKANUH/assets/flipbook/source/CERITA NABI NUH (MEDIA PEMBELAJARAN).docx")
    
    if not docx_path.exists():
        print(f"Error: DOCX file not found at {docx_path}", file=sys.stderr)
        sys.exit(1)
    
    paragraphs = extract_text_from_docx(str(docx_path))
    
    # Output as JSON
    print(json.dumps({"paragraphs": paragraphs}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
