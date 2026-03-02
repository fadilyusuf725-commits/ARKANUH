import { SlideLayout } from "../types/domain";
import { withBasePath } from "../lib/assetPaths";

function layer(srcName: string, alt: string, zIndex: number, effect: "fade" | "slide_up" | "none" = "fade") {
  return {
    src: withBasePath(`assets/ppt-story/optimized/${srcName}`),
    alt,
    zIndex,
    effect
  };
}

export const pptSlideLayoutByPageId: Record<string, SlideLayout> = {
  "1": {
    style: "ppt_story",
    pageBadgeLabel: "Hal 1",
    bodyText:
      "Dahulu kala, hiduplah orang-orang saleh bernama Wadd, Suwa', Yaghuts, Ya'uq, dan Nasr. Mereka dikenal baik hati dan dicintai masyarakat. Ketika mereka wafat, sebagian orang membuat patung untuk mengenang kebaikan mereka.",
    emphasizeText: "Mengingat orang baik boleh, menyembah hanya kepada Allah.",
    layers: [layer("image1.webp", "Latar cerita awal kaum Nabi Nuh", 1, "none")]
  },
  "2": {
    style: "ppt_story",
    pageBadgeLabel: "Hal 2",
    bodyText:
      "Waktu berlalu. Patung yang awalnya hanya pengingat mulai disalahgunakan. Generasi berikutnya lupa tujuan awal dan malah memuliakan patung itu. Sedikit demi sedikit, manusia menjauh dari ajaran Allah.",
    emphasizeText: "Kesalahan kecil bisa menjadi besar jika terus dibiarkan.",
    layers: [
      layer("image1.webp", "Latar kaum Nabi Nuh", 1, "none"),
      layer("image2.webp", "Tokoh masyarakat dan patung", 2, "slide_up")
    ]
  },
  "3": {
    style: "ppt_story",
    pageBadgeLabel: "Hal 3",
    bodyText:
      "Semakin lama, penyimpangan semakin nyata. Banyak orang mengikuti kebiasaan salah tanpa berpikir. Mereka meninggalkan ibadah yang benar. Kondisi ini membuat kehidupan rohani kaum Nabi Nuh menjadi gelap.",
    emphasizeText: "Iman perlu dijaga agar tidak ikut arus yang salah.",
    layers: [
      layer("image1.webp", "Latar masyarakat", 1, "none"),
      layer("image2.webp", "Kelompok masyarakat", 2),
      layer("image3.webp", "Simbol penyembahan patung", 3, "slide_up")
    ]
  },
  "4": {
    style: "ppt_story",
    pageBadgeLabel: "Hal 4",
    bodyText:
      "Allah mengutus Nabi Nuh untuk mengajak kaumnya kembali menyembah Allah saja. Nabi Nuh berdakwah dengan sabar dalam waktu sangat lama. Beliau terus mengingatkan dengan lembut, siang dan malam.",
    emphasizeText: "Nabi Nuh berdakwah dengan sabar dan tidak putus asa.",
    layers: [
      layer("image1.webp", "Latar dakwah Nabi Nuh", 1, "none"),
      layer("image2.webp", "Kaum yang mendengar dakwah", 2),
      layer("image3.webp", "Nabi Nuh menyeru kaumnya", 3),
      layer("image4.webp", "Ilustrasi dakwah berlangsung lama", 4, "slide_up")
    ]
  },
  "5": {
    style: "ppt_story",
    pageBadgeLabel: "Hal 5",
    bodyText:
      "Sebagian besar kaum tetap menolak. Mereka menutup telinga, mengejek, dan merasa paling benar. Nabi Nuh tetap sabar serta memohon pertolongan Allah. Beliau tidak berhenti menyampaikan kebenaran.",
    emphasizeText: "Saat ditolak, seorang mukmin tetap sabar dan santun.",
    layers: [
      layer("image1.webp", "Latar perkampungan", 1, "none"),
      layer("image3.webp", "Nabi Nuh tetap berdakwah", 2),
      layer("image4.webp", "Kaum menolak dakwah", 3),
      layer("image5.webp", "Ekspresi penolakan kaum", 4, "slide_up")
    ]
  },
  "6": {
    style: "ppt_story",
    pageBadgeLabel: "Hal 6",
    bodyText:
      "Allah memerintahkan Nabi Nuh membuat kapal besar. Meski diejek, Nabi Nuh taat dan mulai membangun kapal dengan tekun. Orang beriman membantu sesuai kemampuan. Ini adalah persiapan menghadapi ujian besar.",
    emphasizeText: "Taat kepada Allah meski belum memahami semuanya.",
    layers: [
      layer("image1.webp", "Latar pembangunan kapal", 1, "none"),
      layer("image4.webp", "Nabi Nuh menerima perintah", 2),
      layer("image5.webp", "Proses pembuatan kapal", 3),
      layer("image6.webp", "Kapal besar mulai terlihat", 4, "slide_up")
    ]
  },
  "7": {
    style: "ppt_story",
    pageBadgeLabel: "Hal 7",
    bodyText:
      "Kapal selesai. Nabi Nuh mengajak orang beriman naik ke kapal. Hewan-hewan juga masuk berpasangan. Tak lama, hujan sangat lebat turun dan air memancar dari bumi. Banjir besar pun datang.",
    emphasizeText: "Ketaatan dan kesiapan menyelamatkan orang beriman.",
    layers: [
      layer("image1.webp", "Latar sebelum banjir", 1, "none"),
      layer("image4.webp", "Nabi Nuh memimpin", 2),
      layer("image5.webp", "Orang beriman menaiki kapal", 3),
      layer("image6.webp", "Hewan berpasangan naik", 4),
      layer("image7.webp", "Hujan deras dan banjir", 5, "slide_up")
    ]
  },
  "8": {
    style: "ppt_story",
    pageBadgeLabel: "Hal 8",
    bodyText:
      "Air semakin tinggi. Orang yang menolak kebenaran tidak menemukan tempat aman. Sementara itu, Nabi Nuh dan orang beriman tetap berada di kapal, berdoa, dan saling menolong. Allah menjaga mereka.",
    emphasizeText: "Keselamatan datang bersama iman dan doa.",
    layers: [
      layer("image1.webp", "Latar banjir", 1, "none"),
      layer("image4.webp", "Nabi Nuh dan pengikut", 2),
      layer("image5.webp", "Kondisi kapal saat banjir", 3),
      layer("image6.webp", "Kaum beriman bertahan", 4),
      layer("image7.webp", "Gelombang banjir besar", 5, "slide_up")
    ]
  },
  "9": {
    style: "ppt_story",
    pageBadgeLabel: "Hal 9",
    bodyText:
      "Atas izin Allah, banjir mulai surut. Langit kembali cerah dan kapal berhenti di tempat yang aman. Nabi Nuh dan para pengikutnya bersyukur. Mereka belajar bahwa pertolongan Allah datang pada waktu terbaik.",
    emphasizeText: "Syukur adalah sikap orang beriman setelah ditolong Allah.",
    layers: [
      layer("image1.webp", "Latar pasca banjir", 1, "none"),
      layer("image4.webp", "Nabi Nuh bersyukur", 2),
      layer("image5.webp", "Orang beriman selamat", 3),
      layer("image6.webp", "Kapal di tempat aman", 4),
      layer("image8.webp", "Langit cerah setelah banjir", 5, "slide_up")
    ]
  },
  "10": {
    style: "ppt_story",
    pageBadgeLabel: "Hal 10",
    bodyText:
      "Dari kisah Nabi Nuh, kita belajar untuk beriman kepada Allah, sabar saat menghadapi ujian, taat pada perintah, dan jujur dalam ucapan. Nilai-nilai ini membuat kita menjadi anak saleh yang bermanfaat bagi sesama.",
    emphasizeText: "Iman, sabar, taat, dan jujur adalah teladan utama.",
    layers: [
      layer("image1.webp", "Latar penutup cerita", 1, "none"),
      layer("image8.webp", "Ilustrasi penutup penuh hikmah", 2, "slide_up")
    ]
  }
};

export function getPptSlideLayout(pageId: string): SlideLayout {
  return (
    pptSlideLayoutByPageId[pageId] ?? {
      style: "ppt_story",
      pageBadgeLabel: `Hal ${pageId}`,
      bodyText: "Cerita halaman ini belum tersedia.",
      emphasizeText: "Tetap semangat belajar.",
      layers: [layer("image1.webp", "Latar cerita", 1, "none")]
    }
  );
}
