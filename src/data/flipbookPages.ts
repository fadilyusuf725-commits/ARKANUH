import { FlipbookPage } from "../types/domain";

export const flipbookPages: FlipbookPage[] = [
  {
    id: "1",
    title: "Nabi Nuh Berdakwah",
    objective: "Siswa mengenal ajakan Nabi Nuh untuk beriman kepada Allah.",
    arAsset: "nuh-dakwah",
    voAudio: "/assets/voice/page-01.mp3",
    interactionType: "tap",
    interactionPrompt: "Ketuk pop-up dakwah untuk memulai cerita.",
    completionRule: "Siswa menekan tombol ketuk satu kali.",
    narration:
      "Di tengah kaumnya, Nabi Nuh berdiri dengan tenang lalu mengajak semua orang menyembah Allah. Beliau berbicara lembut, sabar, dan tidak memaksa. Walaupun belum banyak yang mengikuti, Nabi Nuh tetap menyampaikan kebaikan setiap hari dengan hati yang ikhlas.",
    popupTemplate: "ark",
    floatingText: "Nabi Nuh mengajak dengan kata-kata baik, lembut, dan penuh kesabaran.",
    popupAccent: "#2f9bff",
    coverTitle: "ARKANUH - Perjalanan Nabi Nuh"
  },
  {
    id: "2",
    title: "Kaum Menolak Dakwah",
    objective: "Siswa membedakan sikap menerima nasihat dan menolak nasihat.",
    arAsset: "kaum-menolak",
    voAudio: "/assets/voice/page-02.mp3",
    interactionType: "choice",
    interactionPrompt: "Pilih sikap yang benar saat mendapat nasihat baik.",
    completionRule: "Siswa memilih jawaban sikap yang benar.",
    narration:
      "Sebagian kaum Nabi Nuh menolak nasihat yang baik. Ada yang mengejek, ada juga yang tidak mau mendengar. Nabi Nuh tidak marah berlebihan. Beliau tetap sabar, tetap berdoa, dan terus memberi contoh akhlak baik supaya kaumnya belajar membedakan sikap benar dan salah.",
    interactionChoices: ["Mendengar dan berpikir baik", "Mengejek dan menolak"],
    correctChoiceIndex: 0,
    popupTemplate: "rain",
    floatingText: "Ketika ditolak, Nabi Nuh tetap sabar dan tidak membalas dengan keburukan.",
    popupAccent: "#1669c1"
  },
  {
    id: "3",
    title: "Nabi Nuh Tetap Teguh",
    objective: "Siswa memahami arti sabar saat melakukan kebaikan.",
    arAsset: "tetap-teguh",
    voAudio: "/assets/voice/page-03.mp3",
    interactionType: "tap",
    interactionPrompt: "Ketuk cahaya semangat untuk menyalakan keteguhan hati.",
    completionRule: "Siswa menekan tombol semangat sabar.",
    narration:
      "Waktu terus berjalan, tantangan semakin banyak, tetapi Nabi Nuh tidak menyerah. Beliau tetap teguh karena yakin Allah selalu melihat usaha yang baik. Dari kisah ini kita belajar bahwa kesabaran membuat hati kuat, dan orang yang sabar akan lebih mudah berbuat benar.",
    popupTemplate: "light",
    floatingText: "Keteguhan hati tumbuh dari iman, doa, dan kesabaran setiap hari.",
    popupAccent: "#71c7ff"
  },
  {
    id: "4",
    title: "Perintah Membuat Bahtera",
    objective: "Siswa mengenal ketaatan Nabi Nuh pada perintah Allah.",
    arAsset: "perintah-bahtera",
    voAudio: "/assets/voice/page-04.mp3",
    interactionType: "choice",
    interactionPrompt: "Pilih tindakan yang menunjukkan taat kepada Allah.",
    completionRule: "Siswa memilih jawaban tindakan taat.",
    narration:
      "Allah memberi perintah kepada Nabi Nuh untuk membuat bahtera. Perintah itu diterima dengan hati patuh tanpa menunda-nunda. Nabi Nuh segera bekerja sesuai petunjuk Allah. Ketaatan beliau mengajarkan bahwa orang beriman mendahulukan perintah Allah dibanding rasa malas atau ragu.",
    interactionChoices: ["Segera membuat bahtera", "Mengabaikan perintah"],
    correctChoiceIndex: 0,
    popupTemplate: "ark",
    floatingText: "Taat berarti segera melakukan kebaikan tanpa menunda.",
    popupAccent: "#2f9bff"
  },
  {
    id: "5",
    title: "Mempersiapkan Bahtera",
    objective: "Siswa memahami pentingnya kerja sama dan ketekunan.",
    arAsset: "persiapan-bahtera",
    voAudio: "/assets/voice/page-05.mp3",
    interactionType: "drag",
    interactionPrompt: "Seret bagian bahtera sampai susunannya lengkap.",
    completionRule: "Siswa memindahkan semua bagian bahtera.",
    narration:
      "Bahtera disiapkan dengan teliti. Kayu, tali, dan bagian lain disusun satu per satu dengan rapi. Pekerjaan besar tidak selesai dalam satu langkah, tetapi selesai karena tekun dan teratur. Kita belajar bahwa persiapan yang baik membantu kita menghadapi masa sulit dengan lebih siap.",
    interactionItems: ["Kayu", "Paku", "Tali"],
    popupTemplate: "mountain",
    floatingText: "Kerja tekun dan tertib membuat hasil menjadi kuat dan aman.",
    popupAccent: "#3f8cff"
  },
  {
    id: "6",
    title: "Datangnya Banjir Besar",
    objective: "Siswa memahami hubungan sebab dan akibat peristiwa banjir.",
    arAsset: "banjir-datang",
    voAudio: "/assets/voice/page-06.mp3",
    interactionType: "tap",
    interactionPrompt: "Ketuk gelombang air untuk memulai adegan banjir.",
    completionRule: "Siswa menekan tombol simulasi banjir.",
    narration:
      "Akhirnya banjir besar datang seperti yang telah diperingatkan. Air naik perlahan lalu semakin tinggi. Bahtera yang sudah dipersiapkan menjadi tempat perlindungan bagi orang beriman. Dari peristiwa ini kita memahami bahwa nasihat baik perlu didengar sebelum keadaan menjadi sulit.",
    popupTemplate: "wave",
    floatingText: "Bahtera menjadi tempat aman saat gelombang semakin tinggi.",
    popupAccent: "#59b3ff"
  },
  {
    id: "7",
    title: "Naik ke Bahtera",
    objective: "Siswa mengetahui manusia beriman dan hewan berpasangan naik bahtera.",
    arAsset: "naik-bahtera",
    voAudio: "/assets/voice/page-07.mp3",
    interactionType: "drag",
    interactionPrompt: "Seret pasangan hewan masuk ke bahtera.",
    completionRule: "Siswa memindahkan seluruh pasangan hewan.",
    narration:
      "Nabi Nuh mengajak orang beriman naik ke bahtera dengan tertib. Hewan-hewan juga masuk berpasangan sesuai petunjuk Allah. Semua dilakukan dengan tenang dan teratur. Pelajaran pentingnya adalah disiplin dan kepatuhan membuat perjalanan bersama menjadi lebih aman dan lebih terarah.",
    interactionItems: ["Burung", "Kambing", "Kucing"],
    popupTemplate: "ark",
    floatingText: "Tertib dan patuh membuat perjalanan bersama menjadi selamat.",
    popupAccent: "#2f9bff"
  },
  {
    id: "8",
    title: "Keselamatan Orang Beriman",
    objective: "Siswa memahami bahwa iman dan taat membawa keselamatan.",
    arAsset: "selamat-beriman",
    voAudio: "/assets/voice/page-08.mp3",
    interactionType: "choice",
    interactionPrompt: "Pilih sikap yang membawa kebaikan dalam hidup.",
    completionRule: "Siswa memilih jawaban akhlak yang tepat.",
    narration:
      "Di tengah banjir yang besar, Allah menolong Nabi Nuh dan orang-orang yang beriman. Mereka tetap berdoa, saling membantu, dan menjaga sikap baik. Kita belajar bahwa iman bukan hanya kata-kata, tetapi juga perilaku taat, sabar, dan peduli kepada sesama.",
    interactionChoices: ["Taat dan berdoa", "Membangkang dan sombong"],
    correctChoiceIndex: 0,
    popupTemplate: "light",
    floatingText: "Iman terlihat dari doa, taat, dan sikap saling menolong.",
    popupAccent: "#89d2ff"
  },
  {
    id: "9",
    title: "Banjir Mulai Surut",
    objective: "Siswa mengenal bahwa pertolongan Allah datang pada waktu terbaik.",
    arAsset: "banjir-surut",
    voAudio: "/assets/voice/page-09.mp3",
    interactionType: "tap",
    interactionPrompt: "Ketuk cahaya langit untuk menandai air mulai surut.",
    completionRule: "Siswa menekan tombol simbol surut.",
    narration:
      "Setelah masa yang ditentukan, air banjir mulai surut. Langit perlahan cerah, dan bahtera berhenti di tempat aman. Semua yang ada di bahtera merasa lega dan bersyukur. Dari sini kita memahami bahwa pertolongan Allah datang tepat waktu bagi orang yang sabar dan percaya.",
    popupTemplate: "mountain",
    floatingText: "Saat air surut, rasa syukur tumbuh karena pertolongan Allah datang tepat waktu.",
    popupAccent: "#2f9bff"
  },
  {
    id: "10",
    title: "Hikmah Kisah Nabi Nuh",
    objective: "Siswa menyimpulkan nilai iman, sabar, taat, dan jujur.",
    arAsset: "hikmah-akhir",
    voAudio: "/assets/voice/page-10.mp3",
    interactionType: "choice",
    interactionPrompt: "Pilih nilai teladan yang tepat untuk kehidupan sehari-hari.",
    completionRule: "Siswa memilih nilai teladan yang benar.",
    narration:
      "Kisah Nabi Nuh memberi kita banyak pelajaran untuk diamalkan setiap hari. Kita diajak beriman kepada Allah, sabar saat menghadapi tantangan, taat pada kebaikan, dan jujur dalam perkataan. Nilai-nilai ini membuat kita menjadi anak yang kuat, baik, dan dipercaya.",
    interactionChoices: ["Sabar, jujur, dan taat", "Mudah marah dan mengejek"],
    correctChoiceIndex: 0,
    popupTemplate: "light",
    floatingText: "Akhir cerita mengingatkan kita untuk hidup dengan iman, sabar, taat, dan jujur.",
    popupAccent: "#1669c1",
    backCoverSummary: ["Iman kepada Allah", "Sabar dalam ujian", "Taat pada kebaikan", "Jujur dalam ucapan"]
  }
];

export const totalFlipbookPages = flipbookPages.length;
export const flipbookPageMap = new Map(flipbookPages.map((page) => [page.id, page]));

export function getNextFlipbookPageId(pageId: string): string | null {
  const index = flipbookPages.findIndex((page) => page.id === pageId);
  if (index === -1 || index === flipbookPages.length - 1) {
    return null;
  }
  return flipbookPages[index + 1].id;
}

export function getPrevFlipbookPageId(pageId: string): string | null {
  const index = flipbookPages.findIndex((page) => page.id === pageId);
  if (index <= 0) {
    return null;
  }
  return flipbookPages[index - 1].id;
}
