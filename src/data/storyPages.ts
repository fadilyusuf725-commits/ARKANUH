import { StoryPage } from "../types/domain";

export const storyPages: StoryPage[] = [
  {
    id: "1",
    title: "Nabi Nuh Berdakwah",
    objective: "Siswa mengenal bahwa Nabi Nuh mengajak kaumnya menyembah Allah.",
    markerImage: "/assets/markers/hiro.png",
    arAsset: "nuh-dakwah",
    voAudio: "tts:id-ID:page-01",
    interactionType: "tap",
    interactionPrompt: "Ketuk objek AR untuk memulai dakwah.",
    completionRule: "Siswa menekan tombol ketuk dakwah satu kali.",
    narration:
      "Nabi Nuh mengajak kaumnya beriman kepada Allah. Nabi Nuh tetap sabar saat mengajar dengan lembut."
  },
  {
    id: "2",
    title: "Kaum Menolak Dakwah",
    objective: "Siswa membedakan sikap menerima nasihat dan menolak nasihat.",
    markerImage: "/assets/markers/hiro.png",
    arAsset: "kaum-menolak",
    voAudio: "tts:id-ID:page-02",
    interactionType: "choice",
    interactionPrompt: "Pilih sikap yang benar saat mendengar nasihat baik.",
    completionRule: "Siswa memilih jawaban sikap yang benar.",
    narration:
      "Sebagian kaum Nabi Nuh menolak nasihat yang baik. Kita belajar untuk mendengar nasihat yang benar.",
    interactionChoices: ["Mendengar dan berpikir baik", "Mengejek dan menolak"],
    correctChoiceIndex: 0
  },
  {
    id: "3",
    title: "Nabi Nuh Tetap Teguh",
    objective: "Siswa memahami arti sabar dalam berbuat baik.",
    markerImage: "/assets/markers/hiro.png",
    arAsset: "tetap-teguh",
    voAudio: "tts:id-ID:page-03",
    interactionType: "tap",
    interactionPrompt: "Ketuk objek untuk menyalakan semangat sabar.",
    completionRule: "Siswa menekan tombol semangat sabar.",
    narration:
      "Nabi Nuh tidak menyerah walaupun banyak yang menolak. Nabi Nuh tetap sabar dan terus berdoa."
  },
  {
    id: "4",
    title: "Perintah Membuat Bahtera",
    objective: "Siswa mengenal ketaatan Nabi Nuh pada perintah Allah.",
    markerImage: "/assets/markers/hiro.png",
    arAsset: "perintah-bahtera",
    voAudio: "tts:id-ID:page-04",
    interactionType: "choice",
    interactionPrompt: "Pilih tindakan yang menunjukkan taat kepada Allah.",
    completionRule: "Siswa memilih jawaban tindakan taat.",
    narration:
      "Allah memerintahkan Nabi Nuh membuat bahtera. Nabi Nuh langsung taat melaksanakan perintah itu.",
    interactionChoices: ["Segera membuat bahtera", "Mengabaikan perintah"],
    correctChoiceIndex: 0
  },
  {
    id: "5",
    title: "Mempersiapkan Bahtera",
    objective: "Siswa memahami bahwa persiapan baik perlu kerja sama dan ketekunan.",
    markerImage: "/assets/markers/hiro.png",
    arAsset: "persiapan-bahtera",
    voAudio: "tts:id-ID:page-05",
    interactionType: "drag",
    interactionPrompt: "Seret (simulasi ketuk) bagian bahtera ke tempatnya.",
    completionRule: "Siswa memindahkan semua bagian bahtera.",
    narration:
      "Bahtera disiapkan dengan sungguh-sungguh. Persiapan yang baik membantu kita menghadapi keadaan sulit.",
    interactionItems: ["Kayu", "Paku", "Tali"]
  },
  {
    id: "6",
    title: "Datangnya Banjir Besar",
    objective: "Siswa memahami hubungan sebab dan akibat dari peristiwa banjir.",
    markerImage: "/assets/markers/hiro.png",
    arAsset: "banjir-datang",
    voAudio: "tts:id-ID:page-06",
    interactionType: "tap",
    interactionPrompt: "Ketuk objek air untuk melihat banjir mulai naik.",
    completionRule: "Siswa menekan tombol simulasi banjir.",
    narration:
      "Ketika banjir besar datang, bahtera Nabi Nuh menjadi tempat keselamatan bagi yang beriman."
  },
  {
    id: "7",
    title: "Naik ke Bahtera",
    objective: "Siswa mengetahui bahwa Nabi Nuh mengajak orang beriman dan hewan berpasangan.",
    markerImage: "/assets/markers/hiro.png",
    arAsset: "naik-bahtera",
    voAudio: "tts:id-ID:page-07",
    interactionType: "drag",
    interactionPrompt: "Seret (simulasi ketuk) pasangan hewan ke bahtera.",
    completionRule: "Siswa memindahkan seluruh pasangan hewan.",
    narration:
      "Orang beriman dan hewan berpasangan naik ke bahtera. Semua dilakukan tertib sesuai petunjuk Allah.",
    interactionItems: ["Burung", "Kambing", "Kucing"]
  },
  {
    id: "8",
    title: "Keselamatan Orang Beriman",
    objective: "Siswa memahami bahwa iman dan taat membawa keselamatan.",
    markerImage: "/assets/markers/hiro.png",
    arAsset: "selamat-beriman",
    voAudio: "tts:id-ID:page-08",
    interactionType: "choice",
    interactionPrompt: "Pilih sikap yang membawa kebaikan.",
    completionRule: "Siswa memilih jawaban akhlak yang tepat.",
    narration:
      "Allah menolong Nabi Nuh dan orang-orang beriman. Kita diajak untuk selalu taat dan berbuat baik.",
    interactionChoices: ["Taat dan berdoa", "Membangkang dan sombong"],
    correctChoiceIndex: 0
  },
  {
    id: "9",
    title: "Banjir Mulai Surut",
    objective: "Siswa mengenal bahwa pertolongan Allah datang pada waktu terbaik.",
    markerImage: "/assets/markers/hiro.png",
    arAsset: "banjir-surut",
    voAudio: "tts:id-ID:page-09",
    interactionType: "tap",
    interactionPrompt: "Ketuk objek matahari untuk menandai banjir surut.",
    completionRule: "Siswa menekan tombol simbol surut.",
    narration:
      "Setelah waktu yang ditetapkan, banjir mulai surut. Bahtera berhenti di tempat yang aman."
  },
  {
    id: "10",
    title: "Hikmah Kisah Nabi Nuh",
    objective: "Siswa menyimpulkan nilai iman, sabar, taat, dan jujur.",
    markerImage: "/assets/markers/hiro.png",
    arAsset: "hikmah-akhir",
    voAudio: "tts:id-ID:page-10",
    interactionType: "choice",
    interactionPrompt: "Pilih nilai teladan yang tepat untuk kehidupan sehari-hari.",
    completionRule: "Siswa memilih nilai teladan yang benar.",
    narration:
      "Kisah Nabi Nuh mengajarkan kita untuk beriman, sabar, taat kepada Allah, dan berkata jujur.",
    interactionChoices: ["Sabar, jujur, dan taat", "Mudah marah dan mengejek"],
    correctChoiceIndex: 0
  }
];

export const totalStoryPages = storyPages.length;
export const storyPageMap = new Map(storyPages.map((page) => [page.id, page]));

export function getNextPageId(pageId: string): string | null {
  const index = storyPages.findIndex((page) => page.id === pageId);
  if (index === -1 || index === storyPages.length - 1) {
    return null;
  }
  return storyPages[index + 1].id;
}
