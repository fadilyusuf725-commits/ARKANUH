import { FlipbookPage } from "../types/domain";
import { withBasePath } from "../lib/assetPaths";

export const flipbookPages: FlipbookPage[] = [
  {
    id: "1",
    title: "Nabi Nuh dan Masyarakatnya yang Menyembah Patung",
    objective: "Memahami bahwa Nabi Nuh adalah nabi yang saleh dan kaumnya menyembah patung, bukan Allah",
    narration: "Pada zaman dahulu, hiduplah seorang nabi yang bernama Nuh. Beliau tinggal di negeri Babilonia. Nabi Nuh adalah hamba Allah yang saleh dan baik hati.\n\nKaum Nabi Nuh tidak menyembah Allah. Mereka menyembah patung-patung. Patung itu diberi nama Wadd, Suwa', Yaghuts, Ya'uq, dan Nasr. Mereka lupa kepada Allah yang menciptakan mereka.\n\nNabi Nuh sedih melihat kaumnya yang sesat. Beliau ingin mengajak mereka kembali menyembah Allah. Dengan sabar, Nabi Nuh mulai berdakwah kepada kaumnya.",
    arAsset: "prophet_nuh_idols",
    voAudio: withBasePath("assets/voice/page-01.wav"),
    interactionType: "tap",
    interactionPrompt: "Tampilkan 3D model para penyembah patung",
    completionRule: "tap_to_reveal",
    interactionChoices: undefined,
    popupTemplate: "light",
    floatingText: "Penyembahan Patung",
    popupAccent: "#A67C52",
  },
  {
    id: "2",
    title: "Dakwah Nabi Nuh yang Panjang dan Ditolak",
    objective: "Memahami bahwa Nabi Nuh berdakwah dengan sabar tetapi ditolak oleh kaumnya selama 950 tahun",
    narration: "Nabi Nuh berdakwah setiap hari. Beliau berkata, 'Wahai kaumku, sembahlah Allah. Tidak ada Tuhan selain Dia. Aku takut kalian akan mendapat azab jika tidak taat.'\n\nKaum Nabi Nuh menolak ajakan beliau. Mereka berkata, 'Wahai Nuh, kamu hanya manusia biasa seperti kami. Kami tidak percaya kepadamu!'\n\nMereka menertawakan Nabi Nuh. Namun Nabi Nuh tidak marah. Beliau tetap sabar mengajak mereka beriman.\n\nNabi Nuh berdakwah selama 950 tahun lamanya. Wah, lama sekali, ya!",
    arAsset: "prophet_preaching",
    voAudio: withBasePath("assets/voice/page-02.wav"),
    interactionType: "tap",
    interactionPrompt: "Lihat Nabi Nuh berdakwah di mimbar",
    completionRule: "tap_to_reveal",
    interactionChoices: undefined,
    popupTemplate: "light",
    floatingText: "Dakwah Nabi Nuh",
    popupAccent: "#8B7355",
  },
  {
    id: "3",
    title: "Arogansi Kaum Nuh dan Pengikut Setia Nabi",
    objective: "Memahami bahwa hanya orang-orang rendah hati yang percaya kepada Nabi Nuh",
    narration: "Kaum Nabi Nuh semakin sombong. Mereka berkata, 'Wahai Nuh, jika kamu benar, datangkanlah azab yang kamu ancamkan itu!'\n\nMereka tidak percaya bahwa Nabi Nuh utusan Allah. Mereka menganggap pengikut Nabi Nuh hanyalah orang-orang miskin dan hina.\n\nPara pemuka kaum berkata, 'Kami tidak akan beriman seperti orang-orang hina itu.' Mereka tetap menyembah patung dan menolak kebenaran.\n\nHanya sedikit orang yang mau beriman kepada Nabi Nuh. Mereka adalah orang-orang yang rendah hati dan tidak sombong.\n\nMereka percaya bahwa Nabi Nuh adalah utusan Allah. Mereka rajin beribadah dan mengikuti ajaran Nabi Nuh.\n\nNabi Nuh sangat bersyukur memiliki pengikut yang setia. Beliau membimbing mereka dengan sabar dan penuh kasih sayang.",
    arAsset: "believers_gathering",
    voAudio: withBasePath("assets/voice/page-03.wav"),
    interactionType: "choice",
    interactionPrompt: "Apakah kamu akan mengikuti Nabi Nuh seperti pengikutnya yang rendah hati?",
    completionRule: "choice_selection",
    interactionChoices: ["Ya, saya ingin beriman", "Tidak, saya memilih untuk menolak"],
    correctChoiceIndex: 0,
    popupTemplate: "light",
    floatingText: "Pilihan Iman",
    popupAccent: "#D4A574",
  },
  {
    id: "4",
    title: "Perintah Allah: Membuat Kapal",
    objective: "Memahami bahwa Nabi Nuh menerima perintah Allah untuk membuat kapal meskipun jauh dari laut",
    narration: "Nabi Nuh berdoa kepada Allah, 'Ya Tuhanku, jangan biarkan seorang pun dari orang kafir tinggal di bumi.'\n\nAllah mengabulkan doa Nabi Nuh. Allah memerintahkan Nabi Nuh membuat kapal yang besar.\n\nPadahal, tempat tinggal Nabi Nuh jauh dari laut. Di sekitarnya hanya ada daratan kering dan pasir.\n\nNabi Nuh segera melaksanakan perintah Allah. Beliau mulai mengumpulkan kayu yang kuat.",
    arAsset: "ark_construction",
    voAudio: withBasePath("assets/voice/page-04.wav"),
    interactionType: "tap",
    interactionPrompt: "Tampilkan bagaimana Nabi Nuh membuat kapal",
    completionRule: "tap_to_reveal",
    interactionChoices: undefined,
    popupTemplate: "ark",
    floatingText: "Perintah Allah",
    popupAccent: "#8B4513",
  },
  {
    id: "5",
    title: "Pembangunan Kapal dan Ejekan Kaum Kafir",
    objective: "Memahami bahwa Nabi Nuh tetap tenang dan sabar menghadapi ejekan saat membangun kapal",
    narration: "Nabi Nuh dan pengikutnya membuat kapal besar. Mereka bekerja keras setiap hari.\n\nKaum kafir melihat mereka membuat kapal. Mereka tertawa dan mengejek, 'Hai Nuh! Mengapa membuat kapal di padang pasir? Mau berlayar di atas pasir?'\n\nNabi Nuh menjawab dengan tenang, 'Kalian boleh mengejek sekarang. Kelak kalian akan tahu siapa yang benar.'\n\nBeliau terus bekerja tanpa marah. Kapal besar itu akhirnya selesai dibuat.",
    arAsset: "ark_building",
    voAudio: withBasePath("assets/voice/page-05.wav"),
    interactionType: "drag",
    interactionPrompt: "Seret kayu untuk membantu membuat kapal",
    completionRule: "drag_to_build",
    interactionItems: ["kayu_1", "kayu_2", "kayu_3"],
    popupTemplate: "ark",
    floatingText: "Pembangunan Kapal",
    popupAccent: "#A0522D",
  },
  {
    id: "6",
    title: "Tanda Azab dari Allah: Air dan Hujan Lebat",
    objective: "Memahami tanda-tanda permulaan azab yang dikirim Allah",
    narration: "Tiba-tiba datang tanda azab dari Allah. Dari dalam tanah, dari tempat pembakaran roti, memancar air dengan deras.\n\nLangit menjadi gelap. Hujan lebat turun belum pernah terjadi sebelumnya. Air mulai naik ke mana-mana.\n\nNabi Nuh segera memerintahkan pengikutnya naik ke kapal. Beliau juga membawa hewan-hewan, sepasang jantan dan betina.\n\nBeliau memanggil keluarganya untuk naik. Istrinya naik, tetapi istri yang lain tidak mau beriman.",
    arAsset: "flood_beginning",
    voAudio: withBasePath("assets/voice/page-06.wav"),
    interactionType: "tap",
    interactionPrompt: "Lihat bagaimana air mulai naik",
    completionRule: "tap_to_reveal",
    interactionChoices: undefined,
    popupTemplate: "rain",
    floatingText: "Tanda Azab",
    popupAccent: "#4169E1",
  },
  {
    id: "7",
    title: "Anaknya Kan'an Menolak Naik Kapal",
    objective: "Memahami bahwa bahkan keluarga Nabi Nuh ada yang menolak kebenaran",
    narration: "Nabi Nuh memanggil putranya yang bernama Kan'an. 'Wahai anakku, naiklah ke kapal! Sebentar lagi bumi akan tenggelam.'\n\nKan'an menolak. Ia berkata sombong, 'Aku tidak perlu kapal, Ayah! Aku akan pergi ke gunung yang tinggi. Gunung itu akan melindungiku.'\n\nNabi Nuh berkata lagi, 'Tidak ada yang bisa melindungi dari azab Allah, Nak. Naiklah!'\n\nKan'an tetap menolak. Ia berlari menuju gunung. Nabi Nuh sedih sekali melihat anaknya durhaka.",
    arAsset: "kanan_rejection",
    voAudio: withBasePath("assets/voice/page-07.wav"),
    interactionType: "choice",
    interactionPrompt: "Apakah Kan'an akan selamat?",
    completionRule: "choice_selection",
    interactionChoices: ["Ya, dia akan naik kapal", "Tidak, dia akan tenggelam"],
    correctChoiceIndex: 1,
    popupTemplate: "mountain",
    floatingText: "Keputusan Kan'an",
    popupAccent: "#696969",
  },
  {
    id: "8",
    title: "Tenggelamnya Orang-Orang Kafir",
    objective: "Memahami bahwa azab Allah menimpa orang-orang kafir yang menolak kebenaran",
    narration: "Air semakin naik. Semua daratan mulai tenggelam. Orang-orang kafir berlarian ke gunung, tapi air terus naik.\n\nGunung-gunung tinggi pun tenggelam. Kan'an ikut tenggelam bersama orang-orang kafir. Betapa sedih hati Nabi Nuh.\n\nKapal Nabi Nuh terapung dengan selamat. Di dalam kapal, Nabi Nuh dan pengikutnya berdoa kepada Allah.",
    arAsset: "great_flood",
    voAudio: withBasePath("assets/voice/page-08.wav"),
    interactionType: "tap",
    interactionPrompt: "Saksikan banjir besar menenggelamkan bumi",
    completionRule: "tap_to_reveal",
    interactionChoices: undefined,
    popupTemplate: "wave",
    floatingText: "Azab Allah",
    popupAccent: "#1E90FF",
  },
  {
    id: "9",
    title: "Air Surut dan Kapal Berlabuh",
    objective: "Memahami bahwa Allah menyelamatkan orang-orang beriman dan menghentikan azab",
    narration: "Allah berfirman, 'Hai bumi, telanlah airmu! Hai langit, berhentilah hujan!' Air pun surut.\n\nKapal Nabi Nuh berlabuh di atas sebuah gunung. Gunung itu bernama Gunung Judi.\n\nNabi Nuh dan semua pengikutnya turun dari kapal. Mereka bersyukur kepada Allah. Hanya orang beriman yang selamat. Orang kafir yang sombong telah binasa.",
    arAsset: "salvation",
    voAudio: withBasePath("assets/voice/page-09.wav"),
    interactionType: "tap",
    interactionPrompt: "Lihat keselamatan Nabi Nuh dan pengikutnya",
    completionRule: "tap_to_reveal",
    interactionChoices: undefined,
    popupTemplate: "light",
    floatingText: "Keselamatan",
    popupAccent: "#FFD700",
  }
];

export const flipbookPageMap = new Map<string, FlipbookPage>(
  flipbookPages.map((page) => [page.id, page])
);

export const totalFlipbookPages = flipbookPages.length;

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
