// "use client";

// /**
//  * PlaylistEditModal
//  * -----------------
//  * Glass morphism modal for editing playlist details.
//  * Opens when user clicks "Name & details" or clicks the cover/title/description in the hero.
//  *
//  * Props:
//  *   playlist       — current playlist (read initial values from here)
//  *   isOpen         — controls visibility
//  *   onClose        — close without saving
//  *   onSave         — called with { title, description } — page dispatches updatePlaylistMeta
//  *   onEditCover    — called when user clicks the cover inside the modal (Cloudinary upload later)
//  */

// import { useState, useEffect, useRef } from "react";
// import { X, Lock, Pencil } from "lucide-react";
// import Image from "next/image";
// import { Playlist } from "@/types/playlist";

// interface PlaylistEditModalProps {
//   playlist: Playlist;
//   isOpen: boolean;
//   songCovers: string[];
//   onClose: () => void;
//   onSave: (data: { title: string; description: string }) => void;
//   onEditCover: () => void;
// }

// export default function PlaylistEditModal({
//   playlist,
//   isOpen,
//   songCovers,
//   onClose,
//   onSave,
//   onEditCover,
// }: PlaylistEditModalProps) {
//   const [title, setTitle] = useState(playlist.title);
//   const [description, setDescription] = useState(playlist.description ?? "");
//   const [coverHovered, setCoverHovered] = useState(false);
//   const titleInputRef = useRef<HTMLInputElement>(null);

//   // Sync state when playlist changes (e.g. navigating between playlists)

//   useEffect(() => {
//     setTitle(playlist.title);
//     setDescription(playlist.description ?? "");
//   }, [playlist.id, playlist.title, playlist.description]);

//   // Focus title input when modal opens
//   useEffect(() => {
//     if (isOpen) {
//       setTimeout(() => titleInputRef.current?.focus(), 50);
//     }
//   }, [isOpen]);

//   // Close on Escape
//   useEffect(() => {
//     if (!isOpen) return;
//     const handler = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   const handleSave = () => {
//     if (!title.trim()) return;
//     onSave({ title: title.trim(), description: description.trim() });
//     onClose();
//   };

//   // Cover preview — single or mosaic
//   const slots = Array.from({ length: 4 }, (_, i) => songCovers[i]);
//   const hasCover = Boolean(playlist.coverImage);

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div
//         className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
//                    w-[90vw] max-w-[540px]
//                    glass rounded-2xl p-6
//                    shadow-2xl border border-white/10"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-white font-bold text-xl">Edit details</h2>
//           <button
//             onClick={onClose}
//             aria-label="Close"
//             className="text-white/50 hover:text-white transition-colors duration-150
//                        w-8 h-8 flex items-center justify-center rounded-full
//                        hover:bg-white/10"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="flex gap-5">
//           {/* ── Cover preview ── */}
//           <button
//             onClick={onEditCover}
//             onMouseEnter={() => setCoverHovered(true)}
//             onMouseLeave={() => setCoverHovered(false)}
//             aria-label="Change playlist cover"
//             className="relative rounded-lg overflow-hidden shrink-0 shadow-xl
//                        w-[160px] h-[160px] sm:w-[180px] sm:h-[180px]"
//           >
//             {/* Cover image or mosaic */}
//             {hasCover ? (
//               <Image
//                 src={playlist.coverImage!}
//                 alt={playlist.title}
//                 fill
//                 className="object-cover"
//                 draggable={false}
//               />
//             ) : (
//               <div className="w-full h-full grid grid-cols-2">
//                 {slots.map((src, i) =>
//                   src ? (
//                     <Image
//                       key={i}
//                       src={src}
//                       alt=""
//                       width={90}
//                       height={90}
//                       className="object-cover w-full h-full"
//                       draggable={false}
//                     />
//                   ) : (
//                     <div key={i} className="bg-white/10" />
//                   ),
//                 )}
//               </div>
//             )}

//             {/* Hover overlay */}
//             <div
//               className={`absolute inset-0 flex flex-col items-center justify-center gap-2
//                          bg-black/60 transition-opacity duration-200
//                          ${coverHovered ? "opacity-100" : "opacity-0"}`}
//             >
//               <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
//                 <Pencil className="w-5 h-5 text-white" />
//               </div>
//               <span className="text-white text-xs font-semibold">
//                 Choose photo
//               </span>
//             </div>
//           </button>

//           {/* ── Inputs ── */}
//           <div className="flex flex-col gap-3 flex-1 min-w-0">
//             {/* Title */}
//             <div className="flex flex-col gap-1">
//               <label className="text-xs text-white/50 font-medium uppercase tracking-wider">
//                 Name
//               </label>
//               <input
//                 ref={titleInputRef}
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSave()}
//                 maxLength={100}
//                 placeholder="Playlist name"
//                 className="w-full bg-white/10 border border-white/15 rounded-lg
//                            px-3 py-2.5 text-white text-sm placeholder:text-white/30
//                            focus:outline-none focus:border-white/40 focus:bg-white/15
//                            transition-colors duration-150"
//               />
//             </div>

//             {/* Description */}
//             <div className="flex flex-col gap-1 flex-1">
//               <label className="text-xs text-white/50 font-medium uppercase tracking-wider">
//                 Description
//               </label>
//               <textarea
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 maxLength={300}
//                 placeholder="Add an optional description"
//                 rows={4}
//                 className="w-full flex-1 bg-white/10 border border-white/15 rounded-lg
//                            px-3 py-2.5 text-white text-sm placeholder:text-white/30
//                            focus:outline-none focus:border-white/40 focus:bg-white/15
//                            transition-colors duration-150 resize-none"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-between mt-6">
//           {/* Make private — placeholder for future */}
//           <button
//             className="flex items-center gap-2 text-sm text-white/60
//                        border border-white/20 rounded-full px-4 py-2
//                        hover:border-white/40 hover:text-white
//                        transition-colors duration-150"
//           >
//             <Lock className="w-4 h-4" />
//             Make private
//           </button>

//           {/* Save */}
//           <button
//             onClick={handleSave}
//             disabled={!title.trim()}
//             className="px-8 py-2.5 rounded-full bg-white text-black text-sm font-bold
//                        hover:bg-white/90 active:scale-95 transition-all duration-150
//                        disabled:opacity-40 disabled:cursor-not-allowed"
//           >
//             Save
//           </button>
//         </div>

//         {/* Legal note */}
//         <p className="text-white/30 text-[11px] mt-4 leading-relaxed">
//           By proceeding, you confirm you have the right to use this image and
//           content.
//         </p>
//       </div>
//     </>
//   );
// }
