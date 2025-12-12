// import React from "react";
// import PageBackButton from "../shared/PageBackButton";

// interface Props {
//   name: string;
//   primary: string;
//   secondary?: string[];
// }

// export default function DetailHeader({ name, primary, secondary }: Props) {
//   return (
//     <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//       <div>
//         <PageBackButton />
//         <h1 className="text-2xl font-semibold text-slate-50">{name}</h1>
//         <div className="mt-2 flex flex-wrap gap-2 text-xs">
//           <span className="rounded-full bg-sky-500/10 px-2 py-1 text-sky-300">
//             {primary}
//           </span>
//           {secondary?.map((group) => (
//             <span
//               key={group}
//               className="rounded-full bg-slate-700/80 px-2 py-1 text-slate-100"
//             >
//               {group}
//             </span>
//           ))}
//         </div>
//       </div>
//     </header>
//   );
// }
