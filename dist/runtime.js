(function() {
'use strict';
var process=globalThis.process||{env:{NODE_ENV:"production"}};

(function(){var styleId="sadv-react-style";var style=document.getElementById(styleId);if(!style){style=document.createElement("style");style.id=styleId;style.textContent="/*! tailwindcss v4.2.1 | MIT License | https://tailwindcss.com */@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-pan-x:initial;--tw-pan-y:initial;--tw-pinch-zoom:initial;--tw-space-y-reverse:0;--tw-space-x-reverse:0;--tw-divide-x-reverse:0;--tw-border-style:solid;--tw-divide-y-reverse:0;--tw-gradient-position:initial;--tw-gradient-from:#0000;--tw-gradient-via:#0000;--tw-gradient-to:#0000;--tw-gradient-stops:initial;--tw-gradient-via-stops:initial;--tw-gradient-from-position:0%;--tw-gradient-via-position:50%;--tw-gradient-to-position:100%;--tw-leading:initial;--tw-font-weight:initial;--tw-tracking:initial;--tw-ordinal:initial;--tw-slashed-zero:initial;--tw-numeric-figure:initial;--tw-numeric-spacing:initial;--tw-numeric-fraction:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial}}}@layer theme{:root,:host{--font-sans:ui-sans-serif, system-ui, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";--font-mono:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;--color-emerald-400:oklch(76.5% .177 163.223);--color-sky-50:oklch(97.7% .013 236.62);--color-sky-100:oklch(95.1% .026 236.824);--color-sky-200:oklch(90.1% .058 230.902);--color-sky-300:oklch(82.8% .111 230.318);--color-sky-400:oklch(74.6% .16 232.661);--color-sky-500:oklch(68.5% .169 237.323);--color-slate-50:oklch(98.4% .003 247.858);--color-slate-100:oklch(96.8% .007 247.896);--color-slate-300:oklch(86.9% .022 252.894);--color-slate-400:oklch(70.4% .04 256.788);--color-slate-500:oklch(55.4% .046 257.417);--color-slate-950:oklch(12.9% .042 264.695);--color-black:#000;--color-white:#fff;--spacing:.25rem;--text-xs:.75rem;--text-xs--line-height:calc(1 / .75);--text-sm:.875rem;--text-sm--line-height:calc(1.25 / .875);--font-weight-medium:500;--font-weight-semibold:600;--radius-md:.375rem;--radius-lg:.5rem;--radius-xl:.75rem;--radius-2xl:1rem;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4, 0, .2, 1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif, system-ui, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.pointer-events-none{pointer-events:none}.collapse{visibility:collapse}.invisible{visibility:hidden}.visible{visibility:visible}.sr-only{clip-path:inset(50%);white-space:nowrap;border-width:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}.not-sr-only{clip-path:none;white-space:normal;width:auto;height:auto;margin:0;padding:0;position:static;overflow:visible}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.static{position:static}.sticky{position:sticky}.start{inset-inline-start:var(--spacing)}.end{inset-inline-end:var(--spacing)}.top-1{top:calc(var(--spacing) * 1)}.top-1\\/2{top:50%}.top-\\[calc\\(100\\%\\+8px\\)\\]{top:calc(100% + 8px)}.right-0{right:calc(var(--spacing) * 0)}.right-4{right:calc(var(--spacing) * 4)}.right-5{right:calc(var(--spacing) * 5)}.bottom-4{bottom:calc(var(--spacing) * 4)}.bottom-5{bottom:calc(var(--spacing) * 5)}.left-0{left:calc(var(--spacing) * 0)}.left-3{left:calc(var(--spacing) * 3)}.isolate{isolation:isolate}.isolation-auto{isolation:auto}.z-\\[10000001\\]{z-index:10000001}.z-\\[10000012\\]{z-index:10000012}.col-span-2{grid-column:span 2/span 2}.container{width:100%}@media(min-width:40rem){.container{max-width:40rem}}@media(min-width:48rem){.container{max-width:48rem}}@media(min-width:64rem){.container{max-width:64rem}}@media(min-width:80rem){.container{max-width:80rem}}@media(min-width:96rem){.container{max-width:96rem}}.mt-1{margin-top:calc(var(--spacing) * 1)}.mt-2{margin-top:calc(var(--spacing) * 2)}.mt-2\\.5{margin-top:calc(var(--spacing) * 2.5)}.mt-3{margin-top:calc(var(--spacing) * 3)}.mt-4{margin-top:calc(var(--spacing) * 4)}.ml-auto{margin-left:auto}.block{display:block}.contents{display:contents}.flex{display:flex}.flow-root{display:flow-root}.grid{display:grid}.hidden{display:none}.inline{display:inline}.inline-block{display:inline-block}.inline-flex{display:inline-flex}.inline-grid{display:inline-grid}.inline-table{display:inline-table}.list-item{display:list-item}.table{display:table}.table-caption{display:table-caption}.table-cell{display:table-cell}.table-column{display:table-column}.table-column-group{display:table-column-group}.table-footer-group{display:table-footer-group}.table-header-group{display:table-header-group}.table-row{display:table-row}.table-row-group{display:table-row-group}.h-2{height:calc(var(--spacing) * 2)}.h-2\\.5{height:calc(var(--spacing) * 2.5)}.h-3{height:calc(var(--spacing) * 3)}.h-3\\.5{height:calc(var(--spacing) * 3.5)}.h-4{height:calc(var(--spacing) * 4)}.h-8{height:calc(var(--spacing) * 8)}.h-8\\.5{height:calc(var(--spacing) * 8.5)}.h-9{height:calc(var(--spacing) * 9)}.h-9\\.5{height:calc(var(--spacing) * 9.5)}.h-10{height:calc(var(--spacing) * 10)}.h-11{height:calc(var(--spacing) * 11)}.h-\\[280px\\]{height:280px}.h-full{height:100%}.max-h-\\[280px\\]{max-height:280px}.min-h-4{min-height:calc(var(--spacing) * 4)}.w-2{width:calc(var(--spacing) * 2)}.w-2\\.5{width:calc(var(--spacing) * 2.5)}.w-3{width:calc(var(--spacing) * 3)}.w-3\\.5{width:calc(var(--spacing) * 3.5)}.w-4{width:calc(var(--spacing) * 4)}.w-8{width:calc(var(--spacing) * 8)}.w-9{width:calc(var(--spacing) * 9)}.w-10{width:calc(var(--spacing) * 10)}.w-\\[min\\(var\\(--radix-popover-trigger-width\\)\\,448px\\)\\]{width:min(var(--radix-popover-trigger-width),448px)}.w-full{width:100%}.max-w-\\[150px\\]{max-width:150px}.max-w-\\[calc\\(100vw-32px\\)\\]{max-width:calc(100vw - 32px)}.min-w-0{min-width:calc(var(--spacing) * 0)}.min-w-\\[min\\(var\\(--radix-popover-trigger-width\\)\\,448px\\)\\]{min-width:min(var(--radix-popover-trigger-width),448px)}.min-w-max{min-width:max-content}.flex-1{flex:1}.shrink{flex-shrink:1}.shrink-0{flex-shrink:0}.grow{flex-grow:1}.border-collapse{border-collapse:collapse}.-translate-y-1{--tw-translate-y:calc(var(--spacing) * -1);translate:var(--tw-translate-x) var(--tw-translate-y)}.-translate-y-1\\/2{--tw-translate-y: -50% ;translate:var(--tw-translate-x) var(--tw-translate-y)}.translate-none{translate:none}.scale-3d{scale:var(--tw-scale-x) var(--tw-scale-y) var(--tw-scale-z)}.transform{transform:var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,)}.touch-pinch-zoom{--tw-pinch-zoom:pinch-zoom;touch-action:var(--tw-pan-x,) var(--tw-pan-y,) var(--tw-pinch-zoom,)}.resize{resize:both}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-\\[minmax\\(0\\,1fr\\)_auto\\]{grid-template-columns:minmax(0,1fr) auto}.flex-wrap{flex-wrap:wrap}.items-center{align-items:center}.items-start{align-items:flex-start}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.gap-1{gap:calc(var(--spacing) * 1)}.gap-1\\.5{gap:calc(var(--spacing) * 1.5)}.gap-2{gap:calc(var(--spacing) * 2)}.gap-3{gap:calc(var(--spacing) * 3)}:where(.space-y-1>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 1) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 1) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-reverse>:not(:last-child)){--tw-space-y-reverse:1}.gap-x-2{column-gap:calc(var(--spacing) * 2)}:where(.space-x-reverse>:not(:last-child)){--tw-space-x-reverse:1}.gap-y-1{row-gap:calc(var(--spacing) * 1)}.gap-y-1\\.5{row-gap:calc(var(--spacing) * 1.5)}:where(.divide-x>:not(:last-child)){--tw-divide-x-reverse:0;border-inline-style:var(--tw-border-style);border-inline-start-width:calc(1px * var(--tw-divide-x-reverse));border-inline-end-width:calc(1px * calc(1 - var(--tw-divide-x-reverse)))}:where(.divide-y>:not(:last-child)){--tw-divide-y-reverse:0;border-bottom-style:var(--tw-border-style);border-top-style:var(--tw-border-style);border-top-width:calc(1px * var(--tw-divide-y-reverse));border-bottom-width:calc(1px * calc(1 - var(--tw-divide-y-reverse)))}:where(.divide-y-reverse>:not(:last-child)){--tw-divide-y-reverse:1}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.rounded-2xl{border-radius:var(--radius-2xl)}.rounded-full{border-radius:3.40282e38px}.rounded-lg{border-radius:var(--radius-lg)}.rounded-md{border-radius:var(--radius-md)}.rounded-xl{border-radius:var(--radius-xl)}.rounded-s{border-start-start-radius:.25rem;border-end-start-radius:.25rem}.rounded-ss{border-start-start-radius:.25rem}.rounded-e{border-start-end-radius:.25rem;border-end-end-radius:.25rem}.rounded-se{border-start-end-radius:.25rem}.rounded-ee{border-end-end-radius:.25rem}.rounded-es{border-end-start-radius:.25rem}.rounded-t{border-top-left-radius:.25rem;border-top-right-radius:.25rem}.rounded-l{border-top-left-radius:.25rem;border-bottom-left-radius:.25rem}.rounded-tl{border-top-left-radius:.25rem}.rounded-r{border-top-right-radius:.25rem;border-bottom-right-radius:.25rem}.rounded-tr{border-top-right-radius:.25rem}.rounded-b{border-bottom-right-radius:.25rem;border-bottom-left-radius:.25rem}.rounded-br{border-bottom-right-radius:.25rem}.rounded-bl{border-bottom-left-radius:.25rem}.border{border-style:var(--tw-border-style);border-width:1px}.border-x{border-inline-style:var(--tw-border-style);border-inline-width:1px}.border-y{border-block-style:var(--tw-border-style);border-block-width:1px}.border-s{border-inline-start-style:var(--tw-border-style);border-inline-start-width:1px}.border-e{border-inline-end-style:var(--tw-border-style);border-inline-end-width:1px}.border-bs{border-block-start-style:var(--tw-border-style);border-block-start-width:1px}.border-be{border-block-end-style:var(--tw-border-style);border-block-end-width:1px}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-r{border-right-style:var(--tw-border-style);border-right-width:1px}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-l{border-left-style:var(--tw-border-style);border-left-width:1px}.border-sky-300{border-color:var(--color-sky-300)}.border-sky-300\\/45{border-color:#77d4ff73}@supports (color:color-mix(in lab,red,red)){.border-sky-300\\/45{border-color:color-mix(in oklab,var(--color-sky-300) 45%,transparent)}}.border-sky-400{border-color:var(--color-sky-400)}.border-sky-400\\/15{border-color:#00bcfe26}@supports (color:color-mix(in lab,red,red)){.border-sky-400\\/15{border-color:color-mix(in oklab,var(--color-sky-400) 15%,transparent)}}.border-sky-400\\/18{border-color:#00bcfe2e}@supports (color:color-mix(in lab,red,red)){.border-sky-400\\/18{border-color:color-mix(in oklab,var(--color-sky-400) 18%,transparent)}}.border-sky-400\\/35{border-color:#00bcfe59}@supports (color:color-mix(in lab,red,red)){.border-sky-400\\/35{border-color:color-mix(in oklab,var(--color-sky-400) 35%,transparent)}}.border-transparent{border-color:#0000}.border-white{border-color:var(--color-white)}.border-white\\/6{border-color:#ffffff0f}@supports (color:color-mix(in lab,red,red)){.border-white\\/6{border-color:color-mix(in oklab,var(--color-white) 6%,transparent)}}.border-white\\/8{border-color:#ffffff14}@supports (color:color-mix(in lab,red,red)){.border-white\\/8{border-color:color-mix(in oklab,var(--color-white) 8%,transparent)}}.border-white\\/10{border-color:#ffffff1a}@supports (color:color-mix(in lab,red,red)){.border-white\\/10{border-color:color-mix(in oklab,var(--color-white) 10%,transparent)}}.bg-black{background-color:var(--color-black)}.bg-black\\/10{background-color:#0000001a}@supports (color:color-mix(in lab,red,red)){.bg-black\\/10{background-color:color-mix(in oklab,var(--color-black) 10%,transparent)}}.bg-emerald-400{background-color:var(--color-emerald-400)}.bg-emerald-400\\/90{background-color:#00d294e6}@supports (color:color-mix(in lab,red,red)){.bg-emerald-400\\/90{background-color:color-mix(in oklab,var(--color-emerald-400) 90%,transparent)}}.bg-sky-400{background-color:var(--color-sky-400)}.bg-sky-400\\/\\[0\\.08\\]{background-color:#00bcfe14}@supports (color:color-mix(in lab,red,red)){.bg-sky-400\\/\\[0\\.08\\]{background-color:color-mix(in oklab,var(--color-sky-400) 8%,transparent)}}.bg-slate-500{background-color:var(--color-slate-500)}.bg-slate-950{background-color:var(--color-slate-950)}.bg-slate-950\\/60{background-color:#02061899}@supports (color:color-mix(in lab,red,red)){.bg-slate-950\\/60{background-color:color-mix(in oklab,var(--color-slate-950) 60%,transparent)}}.bg-slate-950\\/96{background-color:#020618f5}@supports (color:color-mix(in lab,red,red)){.bg-slate-950\\/96{background-color:color-mix(in oklab,var(--color-slate-950) 96%,transparent)}}.bg-transparent{background-color:#0000}.bg-white{background-color:var(--color-white)}.bg-white\\/10{background-color:#ffffff1a}@supports (color:color-mix(in lab,red,red)){.bg-white\\/10{background-color:color-mix(in oklab,var(--color-white) 10%,transparent)}}.bg-white\\/\\[0\\.02\\]{background-color:#ffffff05}@supports (color:color-mix(in lab,red,red)){.bg-white\\/\\[0\\.02\\]{background-color:color-mix(in oklab,var(--color-white) 2%,transparent)}}.bg-white\\/\\[0\\.03\\]{background-color:#ffffff08}@supports (color:color-mix(in lab,red,red)){.bg-white\\/\\[0\\.03\\]{background-color:color-mix(in oklab,var(--color-white) 3%,transparent)}}.bg-white\\/\\[0\\.04\\]{background-color:#ffffff0a}@supports (color:color-mix(in lab,red,red)){.bg-white\\/\\[0\\.04\\]{background-color:color-mix(in oklab,var(--color-white) 4%,transparent)}}.bg-linear-to-b{--tw-gradient-position:to bottom}@supports (background-image:linear-gradient(in lab,red,red)){.bg-linear-to-b{--tw-gradient-position:to bottom in oklab}}.bg-linear-to-b{background-image:linear-gradient(var(--tw-gradient-stops))}.from-sky-300{--tw-gradient-from:var(--color-sky-300);--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))}.to-sky-500{--tw-gradient-to:var(--color-sky-500);--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))}.bg-repeat{background-repeat:repeat}.mask-no-clip{-webkit-mask-clip:no-clip;mask-clip:no-clip}.mask-repeat{-webkit-mask-repeat:repeat;mask-repeat:repeat}.p-2{padding:calc(var(--spacing) * 2)}.p-\\[1px\\]{padding:1px}.px-2{padding-inline:calc(var(--spacing) * 2)}.px-2\\.5{padding-inline:calc(var(--spacing) * 2.5)}.px-3{padding-inline:calc(var(--spacing) * 3)}.px-3\\.5{padding-inline:calc(var(--spacing) * 3.5)}.px-4{padding-inline:calc(var(--spacing) * 4)}.py-1{padding-block:calc(var(--spacing) * 1)}.py-2{padding-block:calc(var(--spacing) * 2)}.py-2\\.5{padding-block:calc(var(--spacing) * 2.5)}.pt-0{padding-top:calc(var(--spacing) * 0)}.pt-1{padding-top:calc(var(--spacing) * 1)}.pt-1\\.5{padding-top:calc(var(--spacing) * 1.5)}.pt-2{padding-top:calc(var(--spacing) * 2)}.pt-2\\.5{padding-top:calc(var(--spacing) * 2.5)}.pt-3{padding-top:calc(var(--spacing) * 3)}.pt-4{padding-top:calc(var(--spacing) * 4)}.pr-1{padding-right:calc(var(--spacing) * 1)}.pr-3{padding-right:calc(var(--spacing) * 3)}.pb-2{padding-bottom:calc(var(--spacing) * 2)}.pb-2\\.5{padding-bottom:calc(var(--spacing) * 2.5)}.pb-3{padding-bottom:calc(var(--spacing) * 3)}.pl-9{padding-left:calc(var(--spacing) * 9)}.text-left{text-align:left}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.text-\\[9px\\]{font-size:9px}.text-\\[10px\\]{font-size:10px}.text-\\[11px\\]{font-size:11px}.text-\\[12px\\]{font-size:12px}.text-\\[16px\\]{font-size:16px}.leading-4{--tw-leading:calc(var(--spacing) * 4);line-height:calc(var(--spacing) * 4)}.leading-none{--tw-leading:1;line-height:1}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.tracking-\\[-0\\.01em\\]{--tw-tracking:-.01em;letter-spacing:-.01em}.tracking-\\[-0\\.025em\\]{--tw-tracking:-.025em;letter-spacing:-.025em}.tracking-\\[0\\.14em\\]{--tw-tracking:.14em;letter-spacing:.14em}.text-wrap{text-wrap:wrap}.text-clip{text-overflow:clip}.text-ellipsis{text-overflow:ellipsis}.whitespace-nowrap{white-space:nowrap}.text-emerald-400{color:var(--color-emerald-400)}.text-sky-50{color:var(--color-sky-50)}.text-sky-100{color:var(--color-sky-100)}.text-slate-50{color:var(--color-slate-50)}.text-slate-100{color:var(--color-slate-100)}.text-slate-300{color:var(--color-slate-300)}.text-slate-400{color:var(--color-slate-400)}.text-slate-500{color:var(--color-slate-500)}.text-slate-950{color:var(--color-slate-950)}.capitalize{text-transform:capitalize}.lowercase{text-transform:lowercase}.normal-case{text-transform:none}.uppercase{text-transform:uppercase}.italic{font-style:italic}.not-italic{font-style:normal}.diagonal-fractions{--tw-numeric-fraction:diagonal-fractions;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.lining-nums{--tw-numeric-figure:lining-nums;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.oldstyle-nums{--tw-numeric-figure:oldstyle-nums;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.ordinal{--tw-ordinal:ordinal;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.proportional-nums{--tw-numeric-spacing:proportional-nums;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.slashed-zero{--tw-slashed-zero:slashed-zero;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.stacked-fractions{--tw-numeric-fraction:stacked-fractions;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.tabular-nums{--tw-numeric-spacing:tabular-nums;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.normal-nums{font-variant-numeric:normal}.line-through{text-decoration-line:line-through}.no-underline{text-decoration-line:none}.overline{text-decoration-line:overline}.underline{text-decoration-line:underline}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.subpixel-antialiased{-webkit-font-smoothing:auto;-moz-osx-font-smoothing:auto}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a), 0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-\\[0_0_0_4px_rgba\\(16\\,185\\,129\\,0\\.12\\)\\]{--tw-shadow:0 0 0 4px var(--tw-shadow-color,#10b9811f);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-\\[0_14px_32px_rgba\\(56\\,189\\,248\\,0\\.35\\)\\]{--tw-shadow:0 14px 32px var(--tw-shadow-color,#38bdf859);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-\\[0_24px_80px_rgba\\(0\\,0\\,0\\,0\\.45\\)\\]{--tw-shadow:0 24px 80px var(--tw-shadow-color,#00000073);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-\\[inset_0_1px_0_rgba\\(255\\,255\\,255\\,0\\.04\\)\\]{--tw-shadow:inset 0 1px 0 var(--tw-shadow-color,#ffffff0a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.inset-ring{--tw-inset-ring-shadow:inset 0 0 0 1px var(--tw-inset-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.blur{--tw-blur:blur(8px);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.drop-shadow{--tw-drop-shadow-size:drop-shadow(0 1px 2px var(--tw-drop-shadow-color,#0000001a)) drop-shadow(0 1px 1px var(--tw-drop-shadow-color,#0000000f));--tw-drop-shadow:drop-shadow(0 1px 2px #0000001a) drop-shadow(0 1px 1px #0000000f);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.filter{filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.backdrop-blur{--tw-backdrop-blur:blur(8px);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-grayscale{--tw-backdrop-grayscale:grayscale(100%);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-invert{--tw-backdrop-invert:invert(100%);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-sepia{--tw-backdrop-sepia:sepia(100%);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-filter{-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.outline-none{--tw-outline-style:none;outline-style:none}:where(.divide-x-reverse>:not(:last-child)){--tw-divide-x-reverse:1}.ring-inset{--tw-ring-inset:inset}.placeholder\\:text-slate-500::placeholder{color:var(--color-slate-500)}@media(hover:hover){.hover\\:-translate-y-0\\.5:hover{--tw-translate-y:calc(var(--spacing) * -.5);translate:var(--tw-translate-x) var(--tw-translate-y)}.hover\\:border-sky-400\\/25:hover{border-color:#00bcfe40}@supports (color:color-mix(in lab,red,red)){.hover\\:border-sky-400\\/25:hover{border-color:color-mix(in oklab,var(--color-sky-400) 25%,transparent)}}.hover\\:border-sky-400\\/30:hover{border-color:#00bcfe4d}@supports (color:color-mix(in lab,red,red)){.hover\\:border-sky-400\\/30:hover{border-color:color-mix(in oklab,var(--color-sky-400) 30%,transparent)}}.hover\\:border-sky-400\\/40:hover{border-color:#00bcfe66}@supports (color:color-mix(in lab,red,red)){.hover\\:border-sky-400\\/40:hover{border-color:color-mix(in oklab,var(--color-sky-400) 40%,transparent)}}.hover\\:border-white\\/10:hover{border-color:#ffffff1a}@supports (color:color-mix(in lab,red,red)){.hover\\:border-white\\/10:hover{border-color:color-mix(in oklab,var(--color-white) 10%,transparent)}}.hover\\:bg-white\\/\\[0\\.04\\]:hover{background-color:#ffffff0a}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/\\[0\\.04\\]:hover{background-color:color-mix(in oklab,var(--color-white) 4%,transparent)}}.hover\\:bg-white\\/\\[0\\.05\\]:hover{background-color:#ffffff0d}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/\\[0\\.05\\]:hover{background-color:color-mix(in oklab,var(--color-white) 5%,transparent)}}.hover\\:bg-white\\/\\[0\\.07\\]:hover{background-color:#ffffff12}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/\\[0\\.07\\]:hover{background-color:color-mix(in oklab,var(--color-white) 7%,transparent)}}.hover\\:from-sky-200:hover{--tw-gradient-from:var(--color-sky-200);--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))}.hover\\:to-sky-400:hover{--tw-gradient-to:var(--color-sky-400);--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))}.hover\\:text-slate-50:hover{color:var(--color-slate-50)}.hover\\:text-slate-100:hover{color:var(--color-slate-100)}.hover\\:shadow-\\[0_18px_38px_rgba\\(56\\,189\\,248\\,0\\.42\\)\\]:hover{--tw-shadow:0 18px 38px var(--tw-shadow-color,#38bdf86b);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}}.focus\\:border-sky-400\\/30:focus{border-color:#00bcfe4d}@supports (color:color-mix(in lab,red,red)){.focus\\:border-sky-400\\/30:focus{border-color:color-mix(in oklab,var(--color-sky-400) 30%,transparent)}}.focus\\:outline-none:focus{--tw-outline-style:none;outline-style:none}.disabled\\:pointer-events-none:disabled{pointer-events:none}.disabled\\:opacity-50:disabled{opacity:.5}.data-\\[active\\=true\\]\\:border-sky-400\\/35[data-active=true]{border-color:#00bcfe59}@supports (color:color-mix(in lab,red,red)){.data-\\[active\\=true\\]\\:border-sky-400\\/35[data-active=true]{border-color:color-mix(in oklab,var(--color-sky-400) 35%,transparent)}}.data-\\[active\\=true\\]\\:bg-sky-400\\/\\[0\\.08\\][data-active=true]{background-color:#00bcfe14}@supports (color:color-mix(in lab,red,red)){.data-\\[active\\=true\\]\\:bg-sky-400\\/\\[0\\.08\\][data-active=true]{background-color:color-mix(in oklab,var(--color-sky-400) 8%,transparent)}}.data-\\[active\\=true\\]\\:text-sky-50[data-active=true]{color:var(--color-sky-50)}.data-\\[mode\\=all\\]\\:hidden[data-mode=all]{display:none}.data-\\[state\\=active\\]\\:border-sky-400\\/30[data-state=active]{border-color:#00bcfe4d}@supports (color:color-mix(in lab,red,red)){.data-\\[state\\=active\\]\\:border-sky-400\\/30[data-state=active]{border-color:color-mix(in oklab,var(--color-sky-400) 30%,transparent)}}.data-\\[state\\=active\\]\\:bg-sky-400\\/\\[0\\.08\\][data-state=active]{background-color:#00bcfe14}@supports (color:color-mix(in lab,red,red)){.data-\\[state\\=active\\]\\:bg-sky-400\\/\\[0\\.08\\][data-state=active]{background-color:color-mix(in oklab,var(--color-sky-400) 8%,transparent)}}.data-\\[state\\=active\\]\\:text-slate-50[data-state=active]{color:var(--color-slate-50)}}:root{color-scheme:dark}#sadv-react-shell-root{isolation:isolate;contain:layout paint style;flex-shrink:0;font-family:Pretendard Variable,SUIT Variable,Apple SD Gothic Neo,Noto Sans KR,sans-serif;position:relative;width:100%!important;padding:10px 14px 0!important;display:block!important}#sadv-react-shell-root,#sadv-react-shell-root *,#sadv-react-shell-root :before,#sadv-react-shell-root :after{box-sizing:border-box}#sadv-react-shell-root:before{display:none}#sadv-react-shell-root button,#sadv-react-shell-root input,#sadv-react-shell-root [role=tab],#sadv-react-shell-root [role=tablist]{font:inherit!important;letter-spacing:inherit!important;text-transform:none!important}#sadv-react-shell-root button,#sadv-react-shell-root input{appearance:none!important;margin:0!important}#sadv-react-shell-root svg{flex-shrink:0}#sadv-p{overflow:hidden}#sadv-bd{padding-top:10px!important}.sadvx-shell{background:linear-gradient(#060b14fb,#070d16f4),radial-gradient(circle at 0 0,#40c4ff14,#0000 42%);border:1px solid #ffffff14;border-radius:18px;width:100%;position:relative;overflow:hidden;box-shadow:inset 0 -1px #0a121fb8,0 14px 34px #0003}.sadvx-shell:before{content:\"\";pointer-events:none;background:linear-gradient(90deg,#0000,#38bdf86b,#0000);height:1px;position:absolute;inset:0 0 auto}@property --tw-translate-x{syntax:\"*\";inherits:false;initial-value:0}@property --tw-translate-y{syntax:\"*\";inherits:false;initial-value:0}@property --tw-translate-z{syntax:\"*\";inherits:false;initial-value:0}@property --tw-scale-x{syntax:\"*\";inherits:false;initial-value:1}@property --tw-scale-y{syntax:\"*\";inherits:false;initial-value:1}@property --tw-scale-z{syntax:\"*\";inherits:false;initial-value:1}@property --tw-rotate-x{syntax:\"*\";inherits:false}@property --tw-rotate-y{syntax:\"*\";inherits:false}@property --tw-rotate-z{syntax:\"*\";inherits:false}@property --tw-skew-x{syntax:\"*\";inherits:false}@property --tw-skew-y{syntax:\"*\";inherits:false}@property --tw-pan-x{syntax:\"*\";inherits:false}@property --tw-pan-y{syntax:\"*\";inherits:false}@property --tw-pinch-zoom{syntax:\"*\";inherits:false}@property --tw-space-y-reverse{syntax:\"*\";inherits:false;initial-value:0}@property --tw-space-x-reverse{syntax:\"*\";inherits:false;initial-value:0}@property --tw-divide-x-reverse{syntax:\"*\";inherits:false;initial-value:0}@property --tw-border-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-divide-y-reverse{syntax:\"*\";inherits:false;initial-value:0}@property --tw-gradient-position{syntax:\"*\";inherits:false}@property --tw-gradient-from{syntax:\"<color>\";inherits:false;initial-value:#0000}@property --tw-gradient-via{syntax:\"<color>\";inherits:false;initial-value:#0000}@property --tw-gradient-to{syntax:\"<color>\";inherits:false;initial-value:#0000}@property --tw-gradient-stops{syntax:\"*\";inherits:false}@property --tw-gradient-via-stops{syntax:\"*\";inherits:false}@property --tw-gradient-from-position{syntax:\"<length-percentage>\";inherits:false;initial-value:0%}@property --tw-gradient-via-position{syntax:\"<length-percentage>\";inherits:false;initial-value:50%}@property --tw-gradient-to-position{syntax:\"<length-percentage>\";inherits:false;initial-value:100%}@property --tw-leading{syntax:\"*\";inherits:false}@property --tw-font-weight{syntax:\"*\";inherits:false}@property --tw-tracking{syntax:\"*\";inherits:false}@property --tw-ordinal{syntax:\"*\";inherits:false}@property --tw-slashed-zero{syntax:\"*\";inherits:false}@property --tw-numeric-figure{syntax:\"*\";inherits:false}@property --tw-numeric-spacing{syntax:\"*\";inherits:false}@property --tw-numeric-fraction{syntax:\"*\";inherits:false}@property --tw-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:\"*\";inherits:false}@property --tw-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:\"*\";inherits:false}@property --tw-inset-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:\"*\";inherits:false}@property --tw-ring-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:\"*\";inherits:false}@property --tw-inset-ring-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:\"*\";inherits:false}@property --tw-ring-offset-width{syntax:\"<length>\";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:\"*\";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-blur{syntax:\"*\";inherits:false}@property --tw-brightness{syntax:\"*\";inherits:false}@property --tw-contrast{syntax:\"*\";inherits:false}@property --tw-grayscale{syntax:\"*\";inherits:false}@property --tw-hue-rotate{syntax:\"*\";inherits:false}@property --tw-invert{syntax:\"*\";inherits:false}@property --tw-opacity{syntax:\"*\";inherits:false}@property --tw-saturate{syntax:\"*\";inherits:false}@property --tw-sepia{syntax:\"*\";inherits:false}@property --tw-drop-shadow{syntax:\"*\";inherits:false}@property --tw-drop-shadow-color{syntax:\"*\";inherits:false}@property --tw-drop-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:\"*\";inherits:false}@property --tw-backdrop-blur{syntax:\"*\";inherits:false}@property --tw-backdrop-brightness{syntax:\"*\";inherits:false}@property --tw-backdrop-contrast{syntax:\"*\";inherits:false}@property --tw-backdrop-grayscale{syntax:\"*\";inherits:false}@property --tw-backdrop-hue-rotate{syntax:\"*\";inherits:false}@property --tw-backdrop-invert{syntax:\"*\";inherits:false}@property --tw-backdrop-opacity{syntax:\"*\";inherits:false}@property --tw-backdrop-saturate{syntax:\"*\";inherits:false}@property --tw-backdrop-sepia{syntax:\"*\";inherits:false}\n";document.head.appendChild(style);}})();

(function(){"use strict";function hy(a,s){for(var f=0;f<s.length;f++){const v=s[f];if(typeof v!="string"&&!Array.isArray(v)){for(const p in v)if(p!=="default"&&!(p in a)){const S=Object.getOwnPropertyDescriptor(v,p);S&&Object.defineProperty(a,p,S.get?S:{enumerable:!0,get:()=>v[p]})}}}return Object.freeze(Object.defineProperty(a,Symbol.toStringTag,{value:"Module"}))}function Yv(a){return a&&a.__esModule&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a}var ah={exports:{}},ks={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Pv;function vy(){if(Pv)return ks;Pv=1;var a=Symbol.for("react.transitional.element"),s=Symbol.for("react.fragment");function f(v,p,S){var E=null;if(S!==void 0&&(E=""+S),p.key!==void 0&&(E=""+p.key),"key"in p){S={};for(var T in p)T!=="key"&&(S[T]=p[T])}else S=p;return p=S.ref,{$$typeof:a,type:v,key:E,ref:p!==void 0?p:null,props:S}}return ks.Fragment=s,ks.jsx=f,ks.jsxs=f,ks}var Gv;function gy(){return Gv||(Gv=1,ah.exports=vy()),ah.exports}var Y=gy(),rh={exports:{}},lt={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Xv;function by(){if(Xv)return lt;Xv=1;var a=Symbol.for("react.transitional.element"),s=Symbol.for("react.portal"),f=Symbol.for("react.fragment"),v=Symbol.for("react.strict_mode"),p=Symbol.for("react.profiler"),S=Symbol.for("react.consumer"),E=Symbol.for("react.context"),T=Symbol.for("react.forward_ref"),O=Symbol.for("react.suspense"),R=Symbol.for("react.memo"),k=Symbol.for("react.lazy"),L=Symbol.for("react.activity"),U=Symbol.iterator;function V(_){return _===null||typeof _!="object"?null:(_=U&&_[U]||_["@@iterator"],typeof _=="function"?_:null)}var K={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Z=Object.assign,$={};function oe(_,se,Ae){this.props=_,this.context=se,this.refs=$,this.updater=Ae||K}oe.prototype.isReactComponent={},oe.prototype.setState=function(_,se){if(typeof _!="object"&&typeof _!="function"&&_!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,_,se,"setState")},oe.prototype.forceUpdate=function(_){this.updater.enqueueForceUpdate(this,_,"forceUpdate")};function me(){}me.prototype=oe.prototype;function de(_,se,Ae){this.props=_,this.context=se,this.refs=$,this.updater=Ae||K}var ve=de.prototype=new me;ve.constructor=de,Z(ve,oe.prototype),ve.isPureReactComponent=!0;var Te=Array.isArray;function Ee(){}var be={H:null,A:null,T:null,S:null},ce=Object.prototype.hasOwnProperty;function ye(_,se,Ae){var Re=Ae.ref;return{$$typeof:a,type:_,key:se,ref:Re!==void 0?Re:null,props:Ae}}function He(_,se){return ye(_.type,se,_.props)}function Ze(_){return typeof _=="object"&&_!==null&&_.$$typeof===a}function $e(_){var se={"=":"=0",":":"=2"};return"$"+_.replace(/[=:]/g,function(Ae){return se[Ae]})}var st=/\/+/g;function Ge(_,se){return typeof _=="object"&&_!==null&&_.key!=null?$e(""+_.key):se.toString(36)}function Ve(_){switch(_.status){case"fulfilled":return _.value;case"rejected":throw _.reason;default:switch(typeof _.status=="string"?_.then(Ee,Ee):(_.status="pending",_.then(function(se){_.status==="pending"&&(_.status="fulfilled",_.value=se)},function(se){_.status==="pending"&&(_.status="rejected",_.reason=se)})),_.status){case"fulfilled":return _.value;case"rejected":throw _.reason}}throw _}function D(_,se,Ae,Re,pe){var _e=typeof _;(_e==="undefined"||_e==="boolean")&&(_=null);var Xe=!1;if(_===null)Xe=!0;else switch(_e){case"bigint":case"string":case"number":Xe=!0;break;case"object":switch(_.$$typeof){case a:case s:Xe=!0;break;case k:return Xe=_._init,D(Xe(_._payload),se,Ae,Re,pe)}}if(Xe)return pe=pe(_),Xe=Re===""?"."+Ge(_,0):Re,Te(pe)?(Ae="",Xe!=null&&(Ae=Xe.replace(st,"$&/")+"/"),D(pe,se,Ae,"",function(ea){return ea})):pe!=null&&(Ze(pe)&&(pe=He(pe,Ae+(pe.key==null||_&&_.key===pe.key?"":(""+pe.key).replace(st,"$&/")+"/")+Xe)),se.push(pe)),1;Xe=0;var Vt=Re===""?".":Re+":";if(Te(_))for(var Qe=0;Qe<_.length;Qe++)Re=_[Qe],_e=Vt+Ge(Re,Qe),Xe+=D(Re,se,Ae,_e,pe);else if(Qe=V(_),typeof Qe=="function")for(_=Qe.call(_),Qe=0;!(Re=_.next()).done;)Re=Re.value,_e=Vt+Ge(Re,Qe++),Xe+=D(Re,se,Ae,_e,pe);else if(_e==="object"){if(typeof _.then=="function")return D(Ve(_),se,Ae,Re,pe);throw se=String(_),Error("Objects are not valid as a React child (found: "+(se==="[object Object]"?"object with keys {"+Object.keys(_).join(", ")+"}":se)+"). If you meant to render a collection of children, use an array instead.")}return Xe}function J(_,se,Ae){if(_==null)return _;var Re=[],pe=0;return D(_,Re,"","",function(_e){return se.call(Ae,_e,pe++)}),Re}function we(_){if(_._status===-1){var se=_._result;se=se(),se.then(function(Ae){(_._status===0||_._status===-1)&&(_._status=1,_._result=Ae)},function(Ae){(_._status===0||_._status===-1)&&(_._status=2,_._result=Ae)}),_._status===-1&&(_._status=0,_._result=se)}if(_._status===1)return _._result.default;throw _._result}var Pe=typeof reportError=="function"?reportError:function(_){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var se=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof _=="object"&&_!==null&&typeof _.message=="string"?String(_.message):String(_),error:_});if(!window.dispatchEvent(se))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",_);return}console.error(_)},W={map:J,forEach:function(_,se,Ae){J(_,function(){se.apply(this,arguments)},Ae)},count:function(_){var se=0;return J(_,function(){se++}),se},toArray:function(_){return J(_,function(se){return se})||[]},only:function(_){if(!Ze(_))throw Error("React.Children.only expected to receive a single React element child.");return _}};return lt.Activity=L,lt.Children=W,lt.Component=oe,lt.Fragment=f,lt.Profiler=p,lt.PureComponent=de,lt.StrictMode=v,lt.Suspense=O,lt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=be,lt.__COMPILER_RUNTIME={__proto__:null,c:function(_){return be.H.useMemoCache(_)}},lt.cache=function(_){return function(){return _.apply(null,arguments)}},lt.cacheSignal=function(){return null},lt.cloneElement=function(_,se,Ae){if(_==null)throw Error("The argument must be a React element, but you passed "+_+".");var Re=Z({},_.props),pe=_.key;if(se!=null)for(_e in se.key!==void 0&&(pe=""+se.key),se)!ce.call(se,_e)||_e==="key"||_e==="__self"||_e==="__source"||_e==="ref"&&se.ref===void 0||(Re[_e]=se[_e]);var _e=arguments.length-2;if(_e===1)Re.children=Ae;else if(1<_e){for(var Xe=Array(_e),Vt=0;Vt<_e;Vt++)Xe[Vt]=arguments[Vt+2];Re.children=Xe}return ye(_.type,pe,Re)},lt.createContext=function(_){return _={$$typeof:E,_currentValue:_,_currentValue2:_,_threadCount:0,Provider:null,Consumer:null},_.Provider=_,_.Consumer={$$typeof:S,_context:_},_},lt.createElement=function(_,se,Ae){var Re,pe={},_e=null;if(se!=null)for(Re in se.key!==void 0&&(_e=""+se.key),se)ce.call(se,Re)&&Re!=="key"&&Re!=="__self"&&Re!=="__source"&&(pe[Re]=se[Re]);var Xe=arguments.length-2;if(Xe===1)pe.children=Ae;else if(1<Xe){for(var Vt=Array(Xe),Qe=0;Qe<Xe;Qe++)Vt[Qe]=arguments[Qe+2];pe.children=Vt}if(_&&_.defaultProps)for(Re in Xe=_.defaultProps,Xe)pe[Re]===void 0&&(pe[Re]=Xe[Re]);return ye(_,_e,pe)},lt.createRef=function(){return{current:null}},lt.forwardRef=function(_){return{$$typeof:T,render:_}},lt.isValidElement=Ze,lt.lazy=function(_){return{$$typeof:k,_payload:{_status:-1,_result:_},_init:we}},lt.memo=function(_,se){return{$$typeof:R,type:_,compare:se===void 0?null:se}},lt.startTransition=function(_){var se=be.T,Ae={};be.T=Ae;try{var Re=_(),pe=be.S;pe!==null&&pe(Ae,Re),typeof Re=="object"&&Re!==null&&typeof Re.then=="function"&&Re.then(Ee,Pe)}catch(_e){Pe(_e)}finally{se!==null&&Ae.types!==null&&(se.types=Ae.types),be.T=se}},lt.unstable_useCacheRefresh=function(){return be.H.useCacheRefresh()},lt.use=function(_){return be.H.use(_)},lt.useActionState=function(_,se,Ae){return be.H.useActionState(_,se,Ae)},lt.useCallback=function(_,se){return be.H.useCallback(_,se)},lt.useContext=function(_){return be.H.useContext(_)},lt.useDebugValue=function(){},lt.useDeferredValue=function(_,se){return be.H.useDeferredValue(_,se)},lt.useEffect=function(_,se){return be.H.useEffect(_,se)},lt.useEffectEvent=function(_){return be.H.useEffectEvent(_)},lt.useId=function(){return be.H.useId()},lt.useImperativeHandle=function(_,se,Ae){return be.H.useImperativeHandle(_,se,Ae)},lt.useInsertionEffect=function(_,se){return be.H.useInsertionEffect(_,se)},lt.useLayoutEffect=function(_,se){return be.H.useLayoutEffect(_,se)},lt.useMemo=function(_,se){return be.H.useMemo(_,se)},lt.useOptimistic=function(_,se){return be.H.useOptimistic(_,se)},lt.useReducer=function(_,se,Ae){return be.H.useReducer(_,se,Ae)},lt.useRef=function(_){return be.H.useRef(_)},lt.useState=function(_){return be.H.useState(_)},lt.useSyncExternalStore=function(_,se,Ae){return be.H.useSyncExternalStore(_,se,Ae)},lt.useTransition=function(){return be.H.useTransition()},lt.version="19.2.4",lt}var Iv;function Ns(){return Iv||(Iv=1,rh.exports=by()),rh.exports}var H=Ns();const _o=Yv(H),Zv=hy({__proto__:null,default:_o},[H]);var ih={exports:{}},Ls={},oh={exports:{}},ch={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Vv;function my(){return Vv||(Vv=1,(function(a){function s(D,J){var we=D.length;D.push(J);e:for(;0<we;){var Pe=we-1>>>1,W=D[Pe];if(0<p(W,J))D[Pe]=J,D[we]=W,we=Pe;else break e}}function f(D){return D.length===0?null:D[0]}function v(D){if(D.length===0)return null;var J=D[0],we=D.pop();if(we!==J){D[0]=we;e:for(var Pe=0,W=D.length,_=W>>>1;Pe<_;){var se=2*(Pe+1)-1,Ae=D[se],Re=se+1,pe=D[Re];if(0>p(Ae,we))Re<W&&0>p(pe,Ae)?(D[Pe]=pe,D[Re]=we,Pe=Re):(D[Pe]=Ae,D[se]=we,Pe=se);else if(Re<W&&0>p(pe,we))D[Pe]=pe,D[Re]=we,Pe=Re;else break e}}return J}function p(D,J){var we=D.sortIndex-J.sortIndex;return we!==0?we:D.id-J.id}if(a.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var S=performance;a.unstable_now=function(){return S.now()}}else{var E=Date,T=E.now();a.unstable_now=function(){return E.now()-T}}var O=[],R=[],k=1,L=null,U=3,V=!1,K=!1,Z=!1,$=!1,oe=typeof setTimeout=="function"?setTimeout:null,me=typeof clearTimeout=="function"?clearTimeout:null,de=typeof setImmediate<"u"?setImmediate:null;function ve(D){for(var J=f(R);J!==null;){if(J.callback===null)v(R);else if(J.startTime<=D)v(R),J.sortIndex=J.expirationTime,s(O,J);else break;J=f(R)}}function Te(D){if(Z=!1,ve(D),!K)if(f(O)!==null)K=!0,Ee||(Ee=!0,$e());else{var J=f(R);J!==null&&Ve(Te,J.startTime-D)}}var Ee=!1,be=-1,ce=5,ye=-1;function He(){return $?!0:!(a.unstable_now()-ye<ce)}function Ze(){if($=!1,Ee){var D=a.unstable_now();ye=D;var J=!0;try{e:{K=!1,Z&&(Z=!1,me(be),be=-1),V=!0;var we=U;try{t:{for(ve(D),L=f(O);L!==null&&!(L.expirationTime>D&&He());){var Pe=L.callback;if(typeof Pe=="function"){L.callback=null,U=L.priorityLevel;var W=Pe(L.expirationTime<=D);if(D=a.unstable_now(),typeof W=="function"){L.callback=W,ve(D),J=!0;break t}L===f(O)&&v(O),ve(D)}else v(O);L=f(O)}if(L!==null)J=!0;else{var _=f(R);_!==null&&Ve(Te,_.startTime-D),J=!1}}break e}finally{L=null,U=we,V=!1}J=void 0}}finally{J?$e():Ee=!1}}}var $e;if(typeof de=="function")$e=function(){de(Ze)};else if(typeof MessageChannel<"u"){var st=new MessageChannel,Ge=st.port2;st.port1.onmessage=Ze,$e=function(){Ge.postMessage(null)}}else $e=function(){oe(Ze,0)};function Ve(D,J){be=oe(function(){D(a.unstable_now())},J)}a.unstable_IdlePriority=5,a.unstable_ImmediatePriority=1,a.unstable_LowPriority=4,a.unstable_NormalPriority=3,a.unstable_Profiling=null,a.unstable_UserBlockingPriority=2,a.unstable_cancelCallback=function(D){D.callback=null},a.unstable_forceFrameRate=function(D){0>D||125<D?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):ce=0<D?Math.floor(1e3/D):5},a.unstable_getCurrentPriorityLevel=function(){return U},a.unstable_next=function(D){switch(U){case 1:case 2:case 3:var J=3;break;default:J=U}var we=U;U=J;try{return D()}finally{U=we}},a.unstable_requestPaint=function(){$=!0},a.unstable_runWithPriority=function(D,J){switch(D){case 1:case 2:case 3:case 4:case 5:break;default:D=3}var we=U;U=D;try{return J()}finally{U=we}},a.unstable_scheduleCallback=function(D,J,we){var Pe=a.unstable_now();switch(typeof we=="object"&&we!==null?(we=we.delay,we=typeof we=="number"&&0<we?Pe+we:Pe):we=Pe,D){case 1:var W=-1;break;case 2:W=250;break;case 5:W=1073741823;break;case 4:W=1e4;break;default:W=5e3}return W=we+W,D={id:k++,callback:J,priorityLevel:D,startTime:we,expirationTime:W,sortIndex:-1},we>Pe?(D.sortIndex=we,s(R,D),f(O)===null&&D===f(R)&&(Z?(me(be),be=-1):Z=!0,Ve(Te,we-Pe))):(D.sortIndex=W,s(O,D),K||V||(K=!0,Ee||(Ee=!0,$e()))),D},a.unstable_shouldYield=He,a.unstable_wrapCallback=function(D){var J=U;return function(){var we=U;U=J;try{return D.apply(this,arguments)}finally{U=we}}}})(ch)),ch}var Qv;function yy(){return Qv||(Qv=1,oh.exports=my()),oh.exports}var uh={exports:{}},Ml={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Wv;function py(){if(Wv)return Ml;Wv=1;var a=Ns();function s(O){var R="https://react.dev/errors/"+O;if(1<arguments.length){R+="?args[]="+encodeURIComponent(arguments[1]);for(var k=2;k<arguments.length;k++)R+="&args[]="+encodeURIComponent(arguments[k])}return"Minified React error #"+O+"; visit "+R+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function f(){}var v={d:{f,r:function(){throw Error(s(522))},D:f,C:f,L:f,m:f,X:f,S:f,M:f},p:0,findDOMNode:null},p=Symbol.for("react.portal");function S(O,R,k){var L=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:p,key:L==null?null:""+L,children:O,containerInfo:R,implementation:k}}var E=a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function T(O,R){if(O==="font")return"";if(typeof R=="string")return R==="use-credentials"?R:""}return Ml.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=v,Ml.createPortal=function(O,R){var k=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!R||R.nodeType!==1&&R.nodeType!==9&&R.nodeType!==11)throw Error(s(299));return S(O,R,null,k)},Ml.flushSync=function(O){var R=E.T,k=v.p;try{if(E.T=null,v.p=2,O)return O()}finally{E.T=R,v.p=k,v.d.f()}},Ml.preconnect=function(O,R){typeof O=="string"&&(R?(R=R.crossOrigin,R=typeof R=="string"?R==="use-credentials"?R:"":void 0):R=null,v.d.C(O,R))},Ml.prefetchDNS=function(O){typeof O=="string"&&v.d.D(O)},Ml.preinit=function(O,R){if(typeof O=="string"&&R&&typeof R.as=="string"){var k=R.as,L=T(k,R.crossOrigin),U=typeof R.integrity=="string"?R.integrity:void 0,V=typeof R.fetchPriority=="string"?R.fetchPriority:void 0;k==="style"?v.d.S(O,typeof R.precedence=="string"?R.precedence:void 0,{crossOrigin:L,integrity:U,fetchPriority:V}):k==="script"&&v.d.X(O,{crossOrigin:L,integrity:U,fetchPriority:V,nonce:typeof R.nonce=="string"?R.nonce:void 0})}},Ml.preinitModule=function(O,R){if(typeof O=="string")if(typeof R=="object"&&R!==null){if(R.as==null||R.as==="script"){var k=T(R.as,R.crossOrigin);v.d.M(O,{crossOrigin:k,integrity:typeof R.integrity=="string"?R.integrity:void 0,nonce:typeof R.nonce=="string"?R.nonce:void 0})}}else R==null&&v.d.M(O)},Ml.preload=function(O,R){if(typeof O=="string"&&typeof R=="object"&&R!==null&&typeof R.as=="string"){var k=R.as,L=T(k,R.crossOrigin);v.d.L(O,k,{crossOrigin:L,integrity:typeof R.integrity=="string"?R.integrity:void 0,nonce:typeof R.nonce=="string"?R.nonce:void 0,type:typeof R.type=="string"?R.type:void 0,fetchPriority:typeof R.fetchPriority=="string"?R.fetchPriority:void 0,referrerPolicy:typeof R.referrerPolicy=="string"?R.referrerPolicy:void 0,imageSrcSet:typeof R.imageSrcSet=="string"?R.imageSrcSet:void 0,imageSizes:typeof R.imageSizes=="string"?R.imageSizes:void 0,media:typeof R.media=="string"?R.media:void 0})}},Ml.preloadModule=function(O,R){if(typeof O=="string")if(R){var k=T(R.as,R.crossOrigin);v.d.m(O,{as:typeof R.as=="string"&&R.as!=="script"?R.as:void 0,crossOrigin:k,integrity:typeof R.integrity=="string"?R.integrity:void 0})}else v.d.m(O)},Ml.requestFormReset=function(O){v.d.r(O)},Ml.unstable_batchedUpdates=function(O,R){return O(R)},Ml.useFormState=function(O,R,k){return E.H.useFormState(O,R,k)},Ml.useFormStatus=function(){return E.H.useHostTransitionStatus()},Ml.version="19.2.4",Ml}var Jv;function Uf(){if(Jv)return uh.exports;Jv=1;function a(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a)}catch(s){console.error(s)}}return a(),uh.exports=py(),uh.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Kv;function xy(){if(Kv)return Ls;Kv=1;var a=yy(),s=Ns(),f=Uf();function v(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function p(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function S(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function E(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function T(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function O(e){if(S(e)!==e)throw Error(v(188))}function R(e){var t=e.alternate;if(!t){if(t=S(e),t===null)throw Error(v(188));return t!==e?null:e}for(var n=e,l=t;;){var u=n.return;if(u===null)break;var d=u.alternate;if(d===null){if(l=u.return,l!==null){n=l;continue}break}if(u.child===d.child){for(d=u.child;d;){if(d===n)return O(u),e;if(d===l)return O(u),t;d=d.sibling}throw Error(v(188))}if(n.return!==l.return)n=u,l=d;else{for(var x=!1,A=u.child;A;){if(A===n){x=!0,n=u,l=d;break}if(A===l){x=!0,l=u,n=d;break}A=A.sibling}if(!x){for(A=d.child;A;){if(A===n){x=!0,n=d,l=u;break}if(A===l){x=!0,l=d,n=u;break}A=A.sibling}if(!x)throw Error(v(189))}}if(n.alternate!==l)throw Error(v(190))}if(n.tag!==3)throw Error(v(188));return n.stateNode.current===n?e:t}function k(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=k(e),t!==null)return t;e=e.sibling}return null}var L=Object.assign,U=Symbol.for("react.element"),V=Symbol.for("react.transitional.element"),K=Symbol.for("react.portal"),Z=Symbol.for("react.fragment"),$=Symbol.for("react.strict_mode"),oe=Symbol.for("react.profiler"),me=Symbol.for("react.consumer"),de=Symbol.for("react.context"),ve=Symbol.for("react.forward_ref"),Te=Symbol.for("react.suspense"),Ee=Symbol.for("react.suspense_list"),be=Symbol.for("react.memo"),ce=Symbol.for("react.lazy"),ye=Symbol.for("react.activity"),He=Symbol.for("react.memo_cache_sentinel"),Ze=Symbol.iterator;function $e(e){return e===null||typeof e!="object"?null:(e=Ze&&e[Ze]||e["@@iterator"],typeof e=="function"?e:null)}var st=Symbol.for("react.client.reference");function Ge(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===st?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Z:return"Fragment";case oe:return"Profiler";case $:return"StrictMode";case Te:return"Suspense";case Ee:return"SuspenseList";case ye:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case K:return"Portal";case de:return e.displayName||"Context";case me:return(e._context.displayName||"Context")+".Consumer";case ve:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case be:return t=e.displayName||null,t!==null?t:Ge(e.type)||"Memo";case ce:t=e._payload,e=e._init;try{return Ge(e(t))}catch{}}return null}var Ve=Array.isArray,D=s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,J=f.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,we={pending:!1,data:null,method:null,action:null},Pe=[],W=-1;function _(e){return{current:e}}function se(e){0>W||(e.current=Pe[W],Pe[W]=null,W--)}function Ae(e,t){W++,Pe[W]=e.current,e.current=t}var Re=_(null),pe=_(null),_e=_(null),Xe=_(null);function Vt(e,t){switch(Ae(_e,t),Ae(pe,e),Ae(Re,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?Bm(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=Bm(t),e=Hm(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}se(Re),Ae(Re,e)}function Qe(){se(Re),se(pe),se(_e)}function ea(e){e.memoizedState!==null&&Ae(Xe,e);var t=Re.current,n=Hm(t,e.type);t!==n&&(Ae(pe,e),Ae(Re,n))}function _t(e){pe.current===e&&(se(Re),se(pe)),Xe.current===e&&(se(Xe),Nf._currentValue=we)}var Fl,Ue;function ol(e){if(Fl===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);Fl=t&&t[1]||"",Ue=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Fl+e+Ue}var $r=!1;function Fo(e,t){if(!e||$r)return"";$r=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(t){var ge=function(){throw Error()};if(Object.defineProperty(ge.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(ge,[])}catch(re){var te=re}Reflect.construct(e,[],ge)}else{try{ge.call()}catch(re){te=re}e.call(ge.prototype)}}else{try{throw Error()}catch(re){te=re}(ge=e())&&typeof ge.catch=="function"&&ge.catch(function(){})}}catch(re){if(re&&te&&typeof re.stack=="string")return[re.stack,te.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var u=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");u&&u.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var d=l.DetermineComponentFrameRoot(),x=d[0],A=d[1];if(x&&A){var F=x.split(`
`),q=A.split(`
`);for(u=l=0;l<F.length&&!F[l].includes("DetermineComponentFrameRoot");)l++;for(;u<q.length&&!q[u].includes("DetermineComponentFrameRoot");)u++;if(l===F.length||u===q.length)for(l=F.length-1,u=q.length-1;1<=l&&0<=u&&F[l]!==q[u];)u--;for(;1<=l&&0<=u;l--,u--)if(F[l]!==q[u]){if(l!==1||u!==1)do if(l--,u--,0>u||F[l]!==q[u]){var ue=`
`+F[l].replace(" at new "," at ");return e.displayName&&ue.includes("<anonymous>")&&(ue=ue.replace("<anonymous>",e.displayName)),ue}while(1<=l&&0<=u);break}}}finally{$r=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?ol(n):""}function ei(e,t){switch(e.tag){case 26:case 27:case 5:return ol(e.type);case 16:return ol("Lazy");case 13:return e.child!==t&&t!==null?ol("Suspense Fallback"):ol("Suspense");case 19:return ol("SuspenseList");case 0:case 15:return Fo(e.type,!1);case 11:return Fo(e.type.render,!1);case 1:return Fo(e.type,!0);case 31:return ol("Activity");default:return""}}function ma(e){try{var t="",n=null;do t+=ei(e,n),n=e,e=e.return;while(e);return t}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var fn=Object.prototype.hasOwnProperty,Yo=a.unstable_scheduleCallback,pl=a.unstable_cancelCallback,xl=a.unstable_shouldYield,gr=a.unstable_requestPaint,cl=a.unstable_now,gt=a.unstable_getCurrentPriorityLevel,ul=a.unstable_ImmediatePriority,qu=a.unstable_UserBlockingPriority,ti=a.unstable_NormalPriority,Cn=a.unstable_LowPriority,Po=a.unstable_IdlePriority,lu=a.log,ni=a.unstable_setDisableYieldValue,ja=null,gn=null;function ta(e){if(typeof lu=="function"&&ni(e),gn&&typeof gn.setStrictMode=="function")try{gn.setStrictMode(ja,e)}catch{}}var Bn=Math.clz32?Math.clz32:Qt,Go=Math.log,au=Math.LN2;function Qt(e){return e>>>=0,e===0?32:31-(Go(e)/au|0)|0}var rn=256,li=262144,Yl=4194304;function ya(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function br(e,t,n){var l=e.pendingLanes;if(l===0)return 0;var u=0,d=e.suspendedLanes,x=e.pingedLanes;e=e.warmLanes;var A=l&134217727;return A!==0?(l=A&~d,l!==0?u=ya(l):(x&=A,x!==0?u=ya(x):n||(n=A&~e,n!==0&&(u=ya(n))))):(A=l&~d,A!==0?u=ya(A):x!==0?u=ya(x):n||(n=l&~e,n!==0&&(u=ya(n)))),u===0?0:t!==0&&t!==u&&(t&d)===0&&(d=u&-u,n=t&-t,d>=n||d===32&&(n&4194048)!==0)?t:u}function pa(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function Pl(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function ru(){var e=Yl;return Yl<<=1,(Yl&62914560)===0&&(Yl=4194304),e}function Xo(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Zi(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function $u(e,t,n,l,u,d){var x=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var A=e.entanglements,F=e.expirationTimes,q=e.hiddenUpdates;for(n=x&~n;0<n;){var ue=31-Bn(n),ge=1<<ue;A[ue]=0,F[ue]=-1;var te=q[ue];if(te!==null)for(q[ue]=null,ue=0;ue<te.length;ue++){var re=te[ue];re!==null&&(re.lane&=-536870913)}n&=~ge}l!==0&&ai(e,l,0),d!==0&&u===0&&e.tag!==0&&(e.suspendedLanes|=d&~(x&~t))}function ai(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var l=31-Bn(t);e.entangledLanes|=t,e.entanglements[l]=e.entanglements[l]|1073741824|n&261930}function ri(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var l=31-Bn(n),u=1<<l;u&t|e[l]&t&&(e[l]|=t),n&=~u}}function bn(e,t){var n=t&-t;return n=(n&42)!==0?1:sl(n),(n&(e.suspendedLanes|t))!==0?0:n}function sl(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Ht(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function Vi(){var e=J.p;return e!==0?e:(e=window.event,e===void 0?32:iy(e.type))}function fl(e,t){var n=J.p;try{return J.p=e,t()}finally{J.p=n}}var yt=Math.random().toString(36).slice(2),mn="__reactFiber$"+yt,Wn="__reactProps$"+yt,qa="__reactContainer$"+yt,Io="__reactEvents$"+yt,Qi="__reactListeners$"+yt,es="__reactHandles$"+yt,pt="__reactResources$"+yt,St="__reactMarker$"+yt;function mr(e){delete e[mn],delete e[Wn],delete e[Io],delete e[Qi],delete e[es]}function yn(e){var t=e[mn];if(t)return t;for(var n=e.parentNode;n;){if(t=n[qa]||n[mn]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Im(e);e!==null;){if(n=e[mn])return n;e=Im(e)}return t}e=n,n=e.parentNode}return null}function ii(e){if(e=e[mn]||e[qa]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function yr(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(v(33))}function pr(e){var t=e[pt];return t||(t=e[pt]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function dn(e){e[St]=!0}var ts=new Set,oi={};function Ut(e,t){xa(e,t),xa(e+"Capture",t)}function xa(e,t){for(oi[e]=t,e=0;e<t.length;e++)ts.add(t[e])}var Zo=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),wa={},Wi={};function Xs(e){return fn.call(Wi,e)?!0:fn.call(wa,e)?!1:Zo.test(e)?Wi[e]=!0:(wa[e]=!0,!1)}function Vo(e,t,n){if(Xs(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var l=t.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+n)}}function Sa(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+n)}}function Ol(e,t,n,l){if(l===null)e.removeAttribute(n);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,""+l)}}function Jn(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Ea(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function iu(e,t,n){var l=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var u=l.get,d=l.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return u.call(this)},set:function(x){n=""+x,d.call(this,x)}}),Object.defineProperty(e,t,{enumerable:l.enumerable}),{getValue:function(){return n},setValue:function(x){n=""+x},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function ou(e){if(!e._valueTracker){var t=Ea(e)?"checked":"value";e._valueTracker=iu(e,t,""+e[t])}}function ci(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),l="";return e&&(l=Ea(e)?e.checked?"true":"false":e.value),e=l,e!==n?(t.setValue(e),!0):!1}function Wt(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var xr=/[\n"\\]/g;function Kn(e){return e.replace(xr,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function Ji(e,t,n,l,u,d,x,A){e.name="",x!=null&&typeof x!="function"&&typeof x!="symbol"&&typeof x!="boolean"?e.type=x:e.removeAttribute("type"),t!=null?x==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+Jn(t)):e.value!==""+Jn(t)&&(e.value=""+Jn(t)):x!=="submit"&&x!=="reset"||e.removeAttribute("value"),t!=null?Ki(e,x,Jn(t)):n!=null?Ki(e,x,Jn(n)):l!=null&&e.removeAttribute("value"),u==null&&d!=null&&(e.defaultChecked=!!d),u!=null&&(e.checked=u&&typeof u!="function"&&typeof u!="symbol"),A!=null&&typeof A!="function"&&typeof A!="symbol"&&typeof A!="boolean"?e.name=""+Jn(A):e.removeAttribute("name")}function Ca(e,t,n,l,u,d,x,A){if(d!=null&&typeof d!="function"&&typeof d!="symbol"&&typeof d!="boolean"&&(e.type=d),t!=null||n!=null){if(!(d!=="submit"&&d!=="reset"||t!=null)){ou(e);return}n=n!=null?""+Jn(n):"",t=t!=null?""+Jn(t):n,A||t===e.value||(e.value=t),e.defaultValue=t}l=l??u,l=typeof l!="function"&&typeof l!="symbol"&&!!l,e.checked=A?e.checked:!!l,e.defaultChecked=!!l,x!=null&&typeof x!="function"&&typeof x!="symbol"&&typeof x!="boolean"&&(e.name=x),ou(e)}function Ki(e,t,n){t==="number"&&Wt(e.ownerDocument)===e||e.defaultValue===""+n||(e.defaultValue=""+n)}function $a(e,t,n,l){if(e=e.options,t){t={};for(var u=0;u<n.length;u++)t["$"+n[u]]=!0;for(n=0;n<e.length;n++)u=t.hasOwnProperty("$"+e[n].value),e[n].selected!==u&&(e[n].selected=u),u&&l&&(e[n].defaultSelected=!0)}else{for(n=""+Jn(n),t=null,u=0;u<e.length;u++){if(e[u].value===n){e[u].selected=!0,l&&(e[u].defaultSelected=!0);return}t!==null||e[u].disabled||(t=e[u])}t!==null&&(t.selected=!0)}}function Ta(e,t,n){if(t!=null&&(t=""+Jn(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+Jn(n):""}function cu(e,t,n,l){if(t==null){if(l!=null){if(n!=null)throw Error(v(92));if(Ve(l)){if(1<l.length)throw Error(v(93));l=l[0]}n=l}n==null&&(n=""),t=n}n=Jn(t),e.defaultValue=n,l=e.textContent,l===n&&l!==""&&l!==null&&(e.value=l),ou(e)}function ui(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var wr=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function ji(e,t,n){var l=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?l?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":l?e.setProperty(t,n):typeof n!="number"||n===0||wr.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function ns(e,t,n){if(t!=null&&typeof t!="object")throw Error(v(62));if(e=e.style,n!=null){for(var l in n)!n.hasOwnProperty(l)||t!=null&&t.hasOwnProperty(l)||(l.indexOf("--")===0?e.setProperty(l,""):l==="float"?e.cssFloat="":e[l]="");for(var u in t)l=t[u],t.hasOwnProperty(u)&&n[u]!==l&&ji(e,u,l)}else for(var d in t)t.hasOwnProperty(d)&&ji(e,d,t[d])}function uu(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Is=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),jn=/^[\u0000-\u001F ]*j[\n\t]*a[\n\t]*v[\n\t]*a[\n\t]*s[\n\t]*c[\n\t]*r[\n\t]*i[\n\t]*p[\n\t]*t[\n\t]*:/i;function Hn(e){return jn.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Ra(){}var si=null;function fi(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var di=null,Sr=null;function na(e){var t=ii(e);if(t&&(e=t.stateNode)){var n=e[Wn]||null;e:switch(e=t.stateNode,t.type){case"input":if(Ji(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+Kn(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var l=n[t];if(l!==e&&l.form===e.form){var u=l[Wn]||null;if(!u)throw Error(v(90));Ji(l,u.value,u.defaultValue,u.defaultValue,u.checked,u.defaultChecked,u.type,u.name)}}for(t=0;t<n.length;t++)l=n[t],l.form===e.form&&ci(l)}break e;case"textarea":Ta(e,n.value,n.defaultValue);break e;case"select":t=n.value,t!=null&&$a(e,!!n.multiple,t,!1)}}}var qi=!1;function Qo(e,t,n){if(qi)return e(t,n);qi=!0;try{var l=e(t);return l}finally{if(qi=!1,(di!==null||Sr!==null)&&(Bd(),di&&(t=di,e=Sr,Sr=di=null,na(t),e)))for(t=0;t<e.length;t++)na(e[t])}}function Er(e,t){var n=e.stateNode;if(n===null)return null;var l=n[Wn]||null;if(l===null)return null;n=l[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(v(231,t,typeof n));return n}var zl=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Et=!1;if(zl)try{var Aa={};Object.defineProperty(Aa,"passive",{get:function(){Et=!0}}),window.addEventListener("test",Aa,Aa),window.removeEventListener("test",Aa,Aa)}catch{Et=!1}var Gl=null,Cr=null,er=null;function hi(){if(er)return er;var e,t=Cr,n=t.length,l,u="value"in Gl?Gl.value:Gl.textContent,d=u.length;for(e=0;e<n&&t[e]===u[e];e++);var x=n-e;for(l=1;l<=x&&t[n-l]===u[d-l];l++);return er=u.slice(e,1<l?1-l:void 0)}function Tr(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function _a(){return!0}function Ma(){return!1}function Tn(e){function t(n,l,u,d,x){this._reactName=n,this._targetInst=u,this.type=l,this.nativeEvent=d,this.target=x,this.currentTarget=null;for(var A in e)e.hasOwnProperty(A)&&(n=e[A],this[A]=n?n(d):d[A]);return this.isDefaultPrevented=(d.defaultPrevented!=null?d.defaultPrevented:d.returnValue===!1)?_a:Ma,this.isPropagationStopped=Ma,this}return L(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=_a)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=_a)},persist:function(){},isPersistent:_a}),t}var qn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},$i=Tn(qn),Rr=L({},qn,{view:0,detail:0}),vi=Tn(Rr),Ar,Wo,gi,eo=L({},Rr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:qo,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==gi&&(gi&&e.type==="mousemove"?(Ar=e.screenX-gi.screenX,Wo=e.screenY-gi.screenY):Wo=Ar=0,gi=e),Ar)},movementY:function(e){return"movementY"in e?e.movementY:Wo}}),ls=Tn(eo),Zs=L({},eo,{dataTransfer:0}),Vs=Tn(Zs),Qs=L({},Rr,{relatedTarget:0}),to=Tn(Qs),as=L({},qn,{animationName:0,elapsedTime:0,pseudoElement:0}),Ws=Tn(as),rs=L({},qn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Jo=Tn(rs),Js=L({},qn,{data:0}),Ko=Tn(Js),is={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},bi={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},su={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function jo(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=su[e])?!!t[e]:!1}function qo(){return jo}var mi=L({},Rr,{key:function(e){if(e.key){var t=is[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Tr(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?bi[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:qo,charCode:function(e){return e.type==="keypress"?Tr(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Tr(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Ks=Tn(mi),js=L({},eo,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),os=Tn(js),Rn=L({},Rr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:qo}),yi=Tn(Rn),fu=L({},qn,{propertyName:0,elapsedTime:0,pseudoElement:0}),$o=Tn(fu),cs=L({},eo,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),_r=Tn(cs),tr=L({},qn,{newState:0,oldState:0}),no=Tn(tr),nr=[9,13,27,32],pn=zl&&"CompositionEvent"in window,la=null;zl&&"documentMode"in document&&(la=document.documentMode);var Dt=zl&&"TextEvent"in window&&!la,Xl=zl&&(!pn||la&&8<la&&11>=la),ec=" ",pi=!1;function du(e,t){switch(e){case"keyup":return nr.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function tc(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Mr=!1;function nc(e,t){switch(e){case"compositionend":return tc(t);case"keypress":return t.which!==32?null:(pi=!0,ec);case"textInput":return e=t.data,e===ec&&pi?null:e;default:return null}}function lc(e,t){if(Mr)return e==="compositionend"||!pn&&du(e,t)?(e=hi(),er=Cr=Gl=null,Mr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Xl&&t.locale!=="ko"?null:t.data;default:return null}}var Dl={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ac(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Dl[e.type]:t==="textarea"}function lo(e,t,n,l){di?Sr?Sr.push(l):Sr=[l]:di=l,t=Xd(t,"onChange"),0<t.length&&(n=new $i("onChange","change",null,n,l),e.push({event:n,listeners:t}))}var Oa=null,lr=null;function rc(e){Om(e,0)}function Or(e){var t=yr(e);if(ci(t))return e}function ao(e,t){if(e==="change")return t}var hn=!1;if(zl){var hu;if(zl){var za="oninput"in document;if(!za){var ic=document.createElement("div");ic.setAttribute("oninput","return;"),za=typeof ic.oninput=="function"}hu=za}else hu=!1;hn=hu&&(!document.documentMode||9<document.documentMode)}function oc(){Oa&&(Oa.detachEvent("onpropertychange",cc),lr=Oa=null)}function cc(e){if(e.propertyName==="value"&&Or(lr)){var t=[];lo(t,lr,e,fi(e)),Qo(rc,t)}}function uc(e,t,n){e==="focusin"?(oc(),Oa=t,lr=n,Oa.attachEvent("onpropertychange",cc)):e==="focusout"&&oc()}function ro(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Or(lr)}function ar(e,t){if(e==="click")return Or(t)}function us(e,t){if(e==="input"||e==="change")return Or(t)}function zr(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var An=typeof Object.is=="function"?Object.is:zr;function Il(e,t){if(An(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),l=Object.keys(t);if(n.length!==l.length)return!1;for(l=0;l<n.length;l++){var u=n[l];if(!fn.call(t,u)||!An(e[u],t[u]))return!1}return!0}function Dr(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function rr(e,t){var n=Dr(e);e=0;for(var l;n;){if(n.nodeType===3){if(l=e+n.textContent.length,e<=t&&l>=t)return{node:n,offset:t-e};e=l}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Dr(n)}}function ir(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?ir(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function sc(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Wt(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Wt(e.document)}return t}function fc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var kr=zl&&"documentMode"in document&&11>=document.documentMode,aa=null,xi=null,Zl=null,wi=!1;function vu(e,t,n){var l=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;wi||aa==null||aa!==Wt(l)||(l=aa,"selectionStart"in l&&fc(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),Zl&&Il(Zl,l)||(Zl=l,l=Xd(xi,"onSelect"),0<l.length&&(t=new $i("onSelect","select",null,t,n),e.push({event:t,listeners:l}),t.target=aa)))}function Un(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Da={animationend:Un("Animation","AnimationEnd"),animationiteration:Un("Animation","AnimationIteration"),animationstart:Un("Animation","AnimationStart"),transitionrun:Un("Transition","TransitionRun"),transitionstart:Un("Transition","TransitionStart"),transitioncancel:Un("Transition","TransitionCancel"),transitionend:Un("Transition","TransitionEnd")},io={},i={};zl&&(i=document.createElement("div").style,"AnimationEvent"in window||(delete Da.animationend.animation,delete Da.animationiteration.animation,delete Da.animationstart.animation),"TransitionEvent"in window||delete Da.transitionend.transition);function c(e){if(io[e])return io[e];if(!Da[e])return e;var t=Da[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in i)return io[e]=t[n];return e}var g=c("animationend"),m=c("animationiteration"),w=c("animationstart"),M=c("transitionrun"),N=c("transitionstart"),ne=c("transitioncancel"),P=c("transitionend"),le=new Map,he="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");he.push("scrollEnd");function ie(e,t){le.set(e,t),Ut(t,[e])}var Ce=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},Oe=[],at=0,je=0;function Je(){for(var e=at,t=je=at=0;t<e;){var n=Oe[t];Oe[t++]=null;var l=Oe[t];Oe[t++]=null;var u=Oe[t];Oe[t++]=null;var d=Oe[t];if(Oe[t++]=null,l!==null&&u!==null){var x=l.pending;x===null?u.next=u:(u.next=x.next,x.next=u),l.pending=u}d!==0&&Gt(n,u,d)}}function We(e,t,n,l){Oe[at++]=e,Oe[at++]=t,Oe[at++]=n,Oe[at++]=l,je|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function et(e,t,n,l){return We(e,t,n,l),it(e)}function xt(e,t){return We(e,null,null,t),it(e)}function Gt(e,t,n){e.lanes|=n;var l=e.alternate;l!==null&&(l.lanes|=n);for(var u=!1,d=e.return;d!==null;)d.childLanes|=n,l=d.alternate,l!==null&&(l.childLanes|=n),d.tag===22&&(e=d.stateNode,e===null||e._visibility&1||(u=!0)),e=d,d=d.return;return e.tag===3?(d=e.stateNode,u&&t!==null&&(u=31-Bn(n),e=d.hiddenUpdates,l=e[u],l===null?e[u]=[t]:l.push(t),t.lane=n|536870912),d):null}function it(e){if(50<Af)throw Af=0,sv=null,Error(v(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var ot={};function dt(e,t,n,l){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function kt(e,t,n,l){return new dt(e,t,n,l)}function ft(e){return e=e.prototype,!(!e||!e.isReactComponent)}function en(e,t){var n=e.alternate;return n===null?(n=kt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function wt(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function Jt(e,t,n,l,u,d){var x=0;if(l=e,typeof e=="function")ft(e)&&(x=1);else if(typeof e=="string")x=gE(e,n,Re.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case ye:return e=kt(31,n,t,u),e.elementType=ye,e.lanes=d,e;case Z:return Ft(n.children,u,d,t);case $:x=8,u|=24;break;case oe:return e=kt(12,n,t,u|2),e.elementType=oe,e.lanes=d,e;case Te:return e=kt(13,n,t,u),e.elementType=Te,e.lanes=d,e;case Ee:return e=kt(19,n,t,u),e.elementType=Ee,e.lanes=d,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case de:x=10;break e;case me:x=9;break e;case ve:x=11;break e;case be:x=14;break e;case ce:x=16,l=null;break e}x=29,n=Error(v(130,e===null?"null":typeof e,"")),l=null}return t=kt(x,n,t,u),t.elementType=e,t.type=l,t.lanes=d,t}function Ft(e,t,n,l){return e=kt(7,e,l,t),e.lanes=n,e}function Nt(e,t,n){return e=kt(6,e,null,t),e.lanes=n,e}function Fn(e){var t=kt(18,null,null,0);return t.stateNode=e,t}function ka(e,t,n){return t=kt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var dl=new WeakMap;function Yn(e,t){if(typeof e=="object"&&e!==null){var n=dl.get(e);return n!==void 0?n:(t={value:e,source:t,stack:ma(t)},dl.set(e,t),t)}return{value:e,source:t,stack:ma(t)}}var Vl=[],tn=0,$n=null,el=0,jt=[],on=0,tl=null,Mt=1,Pn="";function wl(e,t){Vl[tn++]=el,Vl[tn++]=$n,$n=e,el=t}function dc(e,t,n){jt[on++]=Mt,jt[on++]=Pn,jt[on++]=tl,tl=e;var l=Mt;e=Pn;var u=32-Bn(l)-1;l&=~(1<<u),n+=1;var d=32-Bn(t)+u;if(30<d){var x=u-u%5;d=(l&(1<<x)-1).toString(32),l>>=x,u-=x,Mt=1<<32-Bn(t)+u|n<<u|l,Pn=d+e}else Mt=1<<d|n<<u|l,Pn=e}function oo(e){e.return!==null&&(wl(e,1),dc(e,1,0))}function hc(e){for(;e===$n;)$n=Vl[--tn],Vl[tn]=null,el=Vl[--tn],Vl[tn]=null;for(;e===tl;)tl=jt[--on],jt[on]=null,Pn=jt[--on],jt[on]=null,Mt=jt[--on],jt[on]=null}function vc(e,t){jt[on++]=Mt,jt[on++]=Pn,jt[on++]=tl,Mt=t.id,Pn=t.overflow,tl=e}var nn=null,Lt=null,nt=!1,_n=null,xn=!1,Si=Error(v(519));function nl(e){var t=Error(v(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Na(Yn(t,e)),Si}function gc(e){var t=e.stateNode,n=e.type,l=e.memoizedProps;switch(t[mn]=e,t[Wn]=l,n){case"dialog":vt("cancel",t),vt("close",t);break;case"iframe":case"object":case"embed":vt("load",t);break;case"video":case"audio":for(n=0;n<Mf.length;n++)vt(Mf[n],t);break;case"source":vt("error",t);break;case"img":case"image":case"link":vt("error",t),vt("load",t);break;case"details":vt("toggle",t);break;case"input":vt("invalid",t),Ca(t,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":vt("invalid",t);break;case"textarea":vt("invalid",t),cu(t,l.value,l.defaultValue,l.children)}n=l.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||l.suppressHydrationWarning===!0||Nm(t.textContent,n)?(l.popover!=null&&(vt("beforetoggle",t),vt("toggle",t)),l.onScroll!=null&&vt("scroll",t),l.onScrollEnd!=null&&vt("scrollend",t),l.onClick!=null&&(t.onclick=Ra),t=!0):t=!1,t||nl(e,!0)}function Sl(e){for(nn=e.return;nn;)switch(nn.tag){case 5:case 31:case 13:xn=!1;return;case 27:case 3:xn=!0;return;default:nn=nn.return}}function ra(e){if(e!==nn)return!1;if(!nt)return Sl(e),nt=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||Tv(e.type,e.memoizedProps)),n=!n),n&&Lt&&nl(e),Sl(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(v(317));Lt=Xm(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(v(317));Lt=Xm(e)}else t===27?(t=Lt,Xc(e.type)?(e=Ov,Ov=null,Lt=e):Lt=t):Lt=nn?fr(e.stateNode.nextSibling):null;return!0}function kl(){Lt=nn=null,nt=!1}function or(){var e=_n;return e!==null&&(ha===null?ha=e:ha.push.apply(ha,e),_n=null),e}function Na(e){_n===null?_n=[e]:_n.push(e)}var Ql=_(null),La=null,Ot=null;function ll(e,t,n){Ae(Ql,t._currentValue),t._currentValue=n}function hl(e){e._currentValue=Ql.current,se(Ql)}function ia(e,t,n){for(;e!==null;){var l=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,l!==null&&(l.childLanes|=t)):l!==null&&(l.childLanes&t)!==t&&(l.childLanes|=t),e===n)break;e=e.return}}function Ei(e,t,n,l){var u=e.child;for(u!==null&&(u.return=e);u!==null;){var d=u.dependencies;if(d!==null){var x=u.child;d=d.firstContext;e:for(;d!==null;){var A=d;d=u;for(var F=0;F<t.length;F++)if(A.context===t[F]){d.lanes|=n,A=d.alternate,A!==null&&(A.lanes|=n),ia(d.return,n,e),l||(x=null);break e}d=A.next}}else if(u.tag===18){if(x=u.return,x===null)throw Error(v(341));x.lanes|=n,d=x.alternate,d!==null&&(d.lanes|=n),ia(x,n,e),x=null}else x=u.child;if(x!==null)x.return=u;else for(x=u;x!==null;){if(x===e){x=null;break}if(u=x.sibling,u!==null){u.return=x.return,x=u;break}x=x.return}u=x}}function Mn(e,t,n,l){e=null;for(var u=t,d=!1;u!==null;){if(!d){if((u.flags&524288)!==0)d=!0;else if((u.flags&262144)!==0)break}if(u.tag===10){var x=u.alternate;if(x===null)throw Error(v(387));if(x=x.memoizedProps,x!==null){var A=u.type;An(u.pendingProps.value,x.value)||(e!==null?e.push(A):e=[A])}}else if(u===Xe.current){if(x=u.alternate,x===null)throw Error(v(387));x.memoizedState.memoizedState!==u.memoizedState.memoizedState&&(e!==null?e.push(Nf):e=[Nf])}u=u.return}e!==null&&Ei(t,e,n,l),t.flags|=262144}function Wl(e){for(e=e.firstContext;e!==null;){if(!An(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function El(e){La=e,Ot=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Ct(e){return Nr(La,e)}function cn(e,t){return La===null&&El(e),Nr(e,t)}function Nr(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},Ot===null){if(e===null)throw Error(v(308));Ot=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Ot=Ot.next=t;return n}var Gn=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,l){e.push(l)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},gu=a.unstable_scheduleCallback,co=a.unstable_NormalPriority,Xt={$$typeof:de,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function bc(){return{controller:new Gn,data:new Map,refCount:0}}function Ci(e){e.refCount--,e.refCount===0&&gu(co,function(){e.controller.abort()})}var Cl=null,Ba=0,Tl=0,qt=null;function Ti(e,t){if(Cl===null){var n=Cl=[];Ba=0,Tl=bv(),qt={status:"pending",value:void 0,then:function(l){n.push(l)}}}return Ba++,t.then(Lr,Lr),t}function Lr(){if(--Ba===0&&Cl!==null){qt!==null&&(qt.status="fulfilled");var e=Cl;Cl=null,Tl=0,qt=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function mc(e,t){var n=[],l={status:"pending",value:null,reason:null,then:function(u){n.push(u)}};return e.then(function(){l.status="fulfilled",l.value=t;for(var u=0;u<n.length;u++)(0,n[u])(t)},function(u){for(l.status="rejected",l.reason=u,u=0;u<n.length;u++)(0,n[u])(void 0)}),l}var uo=D.S;D.S=function(e,t){am=cl(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&Ti(e,t),uo!==null&&uo(e,t)};var Ha=_(null);function Ri(){var e=Ha.current;return e!==null?e:Kt.pooledCache}function Ai(e,t){t===null?Ae(Ha,Ha.current):Ae(Ha,t.pool)}function $t(){var e=Ri();return e===null?null:{parent:Xt._currentValue,pool:e}}var Ua=Error(v(460)),cr=Error(v(474)),Fa=Error(v(542)),ur={then:function(){}};function so(e){return e=e.status,e==="fulfilled"||e==="rejected"}function _i(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(Ra,Ra),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,yc(e),e;default:if(typeof t.status=="string")t.then(Ra,Ra);else{if(e=Kt,e!==null&&100<e.shellSuspendCounter)throw Error(v(482));e=t,e.status="pending",e.then(function(l){if(t.status==="pending"){var u=t;u.status="fulfilled",u.value=l}},function(l){if(t.status==="pending"){var u=t;u.status="rejected",u.reason=l}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,yc(e),e}throw al=t,Ua}}function Jl(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(al=n,Ua):n}}var al=null;function vl(){if(al===null)throw Error(v(459));var e=al;return al=null,e}function yc(e){if(e===Ua||e===Fa)throw Error(v(483))}var Rl=null,Br=0;function Nl(e){var t=Br;return Br+=1,Rl===null&&(Rl=[]),_i(Rl,e,t)}function Kl(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Ll(e,t){throw t.$$typeof===U?Error(v(525)):(e=Object.prototype.toString.call(t),Error(v(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function Hr(e){function t(Q,G){if(e){var j=Q.deletions;j===null?(Q.deletions=[G],Q.flags|=16):j.push(G)}}function n(Q,G){if(!e)return null;for(;G!==null;)t(Q,G),G=G.sibling;return null}function l(Q){for(var G=new Map;Q!==null;)Q.key!==null?G.set(Q.key,Q):G.set(Q.index,Q),Q=Q.sibling;return G}function u(Q,G){return Q=en(Q,G),Q.index=0,Q.sibling=null,Q}function d(Q,G,j){return Q.index=j,e?(j=Q.alternate,j!==null?(j=j.index,j<G?(Q.flags|=67108866,G):j):(Q.flags|=67108866,G)):(Q.flags|=1048576,G)}function x(Q){return e&&Q.alternate===null&&(Q.flags|=67108866),Q}function A(Q,G,j,fe){return G===null||G.tag!==6?(G=Nt(j,Q.mode,fe),G.return=Q,G):(G=u(G,j),G.return=Q,G)}function F(Q,G,j,fe){var Ye=j.type;return Ye===Z?ue(Q,G,j.props.children,fe,j.key):G!==null&&(G.elementType===Ye||typeof Ye=="object"&&Ye!==null&&Ye.$$typeof===ce&&Jl(Ye)===G.type)?(G=u(G,j.props),Kl(G,j),G.return=Q,G):(G=Jt(j.type,j.key,j.props,null,Q.mode,fe),Kl(G,j),G.return=Q,G)}function q(Q,G,j,fe){return G===null||G.tag!==4||G.stateNode.containerInfo!==j.containerInfo||G.stateNode.implementation!==j.implementation?(G=ka(j,Q.mode,fe),G.return=Q,G):(G=u(G,j.children||[]),G.return=Q,G)}function ue(Q,G,j,fe,Ye){return G===null||G.tag!==7?(G=Ft(j,Q.mode,fe,Ye),G.return=Q,G):(G=u(G,j),G.return=Q,G)}function ge(Q,G,j){if(typeof G=="string"&&G!==""||typeof G=="number"||typeof G=="bigint")return G=Nt(""+G,Q.mode,j),G.return=Q,G;if(typeof G=="object"&&G!==null){switch(G.$$typeof){case V:return j=Jt(G.type,G.key,G.props,null,Q.mode,j),Kl(j,G),j.return=Q,j;case K:return G=ka(G,Q.mode,j),G.return=Q,G;case ce:return G=Jl(G),ge(Q,G,j)}if(Ve(G)||$e(G))return G=Ft(G,Q.mode,j,null),G.return=Q,G;if(typeof G.then=="function")return ge(Q,Nl(G),j);if(G.$$typeof===de)return ge(Q,cn(Q,G),j);Ll(Q,G)}return null}function te(Q,G,j,fe){var Ye=G!==null?G.key:null;if(typeof j=="string"&&j!==""||typeof j=="number"||typeof j=="bigint")return Ye!==null?null:A(Q,G,""+j,fe);if(typeof j=="object"&&j!==null){switch(j.$$typeof){case V:return j.key===Ye?F(Q,G,j,fe):null;case K:return j.key===Ye?q(Q,G,j,fe):null;case ce:return j=Jl(j),te(Q,G,j,fe)}if(Ve(j)||$e(j))return Ye!==null?null:ue(Q,G,j,fe,null);if(typeof j.then=="function")return te(Q,G,Nl(j),fe);if(j.$$typeof===de)return te(Q,G,cn(Q,j),fe);Ll(Q,j)}return null}function re(Q,G,j,fe,Ye){if(typeof fe=="string"&&fe!==""||typeof fe=="number"||typeof fe=="bigint")return Q=Q.get(j)||null,A(G,Q,""+fe,Ye);if(typeof fe=="object"&&fe!==null){switch(fe.$$typeof){case V:return Q=Q.get(fe.key===null?j:fe.key)||null,F(G,Q,fe,Ye);case K:return Q=Q.get(fe.key===null?j:fe.key)||null,q(G,Q,fe,Ye);case ce:return fe=Jl(fe),re(Q,G,j,fe,Ye)}if(Ve(fe)||$e(fe))return Q=Q.get(j)||null,ue(G,Q,fe,Ye,null);if(typeof fe.then=="function")return re(Q,G,j,Nl(fe),Ye);if(fe.$$typeof===de)return re(Q,G,j,cn(G,fe),Ye);Ll(G,fe)}return null}function ze(Q,G,j,fe){for(var Ye=null,Rt=null,Ne=G,rt=G=0,mt=null;Ne!==null&&rt<j.length;rt++){Ne.index>rt?(mt=Ne,Ne=null):mt=Ne.sibling;var At=te(Q,Ne,j[rt],fe);if(At===null){Ne===null&&(Ne=mt);break}e&&Ne&&At.alternate===null&&t(Q,Ne),G=d(At,G,rt),Rt===null?Ye=At:Rt.sibling=At,Rt=At,Ne=mt}if(rt===j.length)return n(Q,Ne),nt&&wl(Q,rt),Ye;if(Ne===null){for(;rt<j.length;rt++)Ne=ge(Q,j[rt],fe),Ne!==null&&(G=d(Ne,G,rt),Rt===null?Ye=Ne:Rt.sibling=Ne,Rt=Ne);return nt&&wl(Q,rt),Ye}for(Ne=l(Ne);rt<j.length;rt++)mt=re(Ne,Q,rt,j[rt],fe),mt!==null&&(e&&mt.alternate!==null&&Ne.delete(mt.key===null?rt:mt.key),G=d(mt,G,rt),Rt===null?Ye=mt:Rt.sibling=mt,Rt=mt);return e&&Ne.forEach(function(Wc){return t(Q,Wc)}),nt&&wl(Q,rt),Ye}function Ie(Q,G,j,fe){if(j==null)throw Error(v(151));for(var Ye=null,Rt=null,Ne=G,rt=G=0,mt=null,At=j.next();Ne!==null&&!At.done;rt++,At=j.next()){Ne.index>rt?(mt=Ne,Ne=null):mt=Ne.sibling;var Wc=te(Q,Ne,At.value,fe);if(Wc===null){Ne===null&&(Ne=mt);break}e&&Ne&&Wc.alternate===null&&t(Q,Ne),G=d(Wc,G,rt),Rt===null?Ye=Wc:Rt.sibling=Wc,Rt=Wc,Ne=mt}if(At.done)return n(Q,Ne),nt&&wl(Q,rt),Ye;if(Ne===null){for(;!At.done;rt++,At=j.next())At=ge(Q,At.value,fe),At!==null&&(G=d(At,G,rt),Rt===null?Ye=At:Rt.sibling=At,Rt=At);return nt&&wl(Q,rt),Ye}for(Ne=l(Ne);!At.done;rt++,At=j.next())At=re(Ne,Q,rt,At.value,fe),At!==null&&(e&&At.alternate!==null&&Ne.delete(At.key===null?rt:At.key),G=d(At,G,rt),Rt===null?Ye=At:Rt.sibling=At,Rt=At);return e&&Ne.forEach(function(RE){return t(Q,RE)}),nt&&wl(Q,rt),Ye}function Zt(Q,G,j,fe){if(typeof j=="object"&&j!==null&&j.type===Z&&j.key===null&&(j=j.props.children),typeof j=="object"&&j!==null){switch(j.$$typeof){case V:e:{for(var Ye=j.key;G!==null;){if(G.key===Ye){if(Ye=j.type,Ye===Z){if(G.tag===7){n(Q,G.sibling),fe=u(G,j.props.children),fe.return=Q,Q=fe;break e}}else if(G.elementType===Ye||typeof Ye=="object"&&Ye!==null&&Ye.$$typeof===ce&&Jl(Ye)===G.type){n(Q,G.sibling),fe=u(G,j.props),Kl(fe,j),fe.return=Q,Q=fe;break e}n(Q,G);break}else t(Q,G);G=G.sibling}j.type===Z?(fe=Ft(j.props.children,Q.mode,fe,j.key),fe.return=Q,Q=fe):(fe=Jt(j.type,j.key,j.props,null,Q.mode,fe),Kl(fe,j),fe.return=Q,Q=fe)}return x(Q);case K:e:{for(Ye=j.key;G!==null;){if(G.key===Ye)if(G.tag===4&&G.stateNode.containerInfo===j.containerInfo&&G.stateNode.implementation===j.implementation){n(Q,G.sibling),fe=u(G,j.children||[]),fe.return=Q,Q=fe;break e}else{n(Q,G);break}else t(Q,G);G=G.sibling}fe=ka(j,Q.mode,fe),fe.return=Q,Q=fe}return x(Q);case ce:return j=Jl(j),Zt(Q,G,j,fe)}if(Ve(j))return ze(Q,G,j,fe);if($e(j)){if(Ye=$e(j),typeof Ye!="function")throw Error(v(150));return j=Ye.call(j),Ie(Q,G,j,fe)}if(typeof j.then=="function")return Zt(Q,G,Nl(j),fe);if(j.$$typeof===de)return Zt(Q,G,cn(Q,j),fe);Ll(Q,j)}return typeof j=="string"&&j!==""||typeof j=="number"||typeof j=="bigint"?(j=""+j,G!==null&&G.tag===6?(n(Q,G.sibling),fe=u(G,j),fe.return=Q,Q=fe):(n(Q,G),fe=Nt(j,Q.mode,fe),fe.return=Q,Q=fe),x(Q)):n(Q,G)}return function(Q,G,j,fe){try{Br=0;var Ye=Zt(Q,G,j,fe);return Rl=null,Ye}catch(Ne){if(Ne===Ua||Ne===Fa)throw Ne;var Rt=kt(29,Ne,null,Q.mode);return Rt.lanes=fe,Rt.return=Q,Rt}finally{}}}var rl=Hr(!0),pc=Hr(!1),oa=!1;function jl(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Ur(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function gl(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Xn(e,t,n){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(zt&2)!==0){var u=l.pending;return u===null?t.next=t:(t.next=u.next,u.next=t),l.pending=t,t=it(e),Gt(e,null,n),t}return We(e,l,t,n),it(e)}function Bl(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var l=t.lanes;l&=e.pendingLanes,n|=l,t.lanes=n,ri(e,n)}}function bl(e,t){var n=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,n===l)){var u=null,d=null;if(n=n.firstBaseUpdate,n!==null){do{var x={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};d===null?u=d=x:d=d.next=x,n=n.next}while(n!==null);d===null?u=d=t:d=d.next=t}else u=d=t;n={baseState:l.baseState,firstBaseUpdate:u,lastBaseUpdate:d,shared:l.shared,callbacks:l.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var Mi=!1;function Fr(){if(Mi){var e=qt;if(e!==null)throw e}}function ca(e,t,n,l){Mi=!1;var u=e.updateQueue;oa=!1;var d=u.firstBaseUpdate,x=u.lastBaseUpdate,A=u.shared.pending;if(A!==null){u.shared.pending=null;var F=A,q=F.next;F.next=null,x===null?d=q:x.next=q,x=F;var ue=e.alternate;ue!==null&&(ue=ue.updateQueue,A=ue.lastBaseUpdate,A!==x&&(A===null?ue.firstBaseUpdate=q:A.next=q,ue.lastBaseUpdate=F))}if(d!==null){var ge=u.baseState;x=0,ue=q=F=null,A=d;do{var te=A.lane&-536870913,re=te!==A.lane;if(re?(bt&te)===te:(l&te)===te){te!==0&&te===Tl&&(Mi=!0),ue!==null&&(ue=ue.next={lane:0,tag:A.tag,payload:A.payload,callback:null,next:null});e:{var ze=e,Ie=A;te=t;var Zt=n;switch(Ie.tag){case 1:if(ze=Ie.payload,typeof ze=="function"){ge=ze.call(Zt,ge,te);break e}ge=ze;break e;case 3:ze.flags=ze.flags&-65537|128;case 0:if(ze=Ie.payload,te=typeof ze=="function"?ze.call(Zt,ge,te):ze,te==null)break e;ge=L({},ge,te);break e;case 2:oa=!0}}te=A.callback,te!==null&&(e.flags|=64,re&&(e.flags|=8192),re=u.callbacks,re===null?u.callbacks=[te]:re.push(te))}else re={lane:te,tag:A.tag,payload:A.payload,callback:A.callback,next:null},ue===null?(q=ue=re,F=ge):ue=ue.next=re,x|=te;if(A=A.next,A===null){if(A=u.shared.pending,A===null)break;re=A,A=re.next,re.next=null,u.lastBaseUpdate=re,u.shared.pending=null}}while(!0);ue===null&&(F=ge),u.baseState=F,u.firstBaseUpdate=q,u.lastBaseUpdate=ue,d===null&&(u.shared.lanes=0),Uc|=x,e.lanes=x,e.memoizedState=ge}}function r(e,t){if(typeof e!="function")throw Error(v(191,e));e.call(t)}function o(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)r(n[e],t)}var h=_(null),b=_(0);function y(e,t){e=To,Ae(b,e),Ae(h,t),To=e|t.baseLanes}function C(){Ae(b,To),Ae(h,h.current)}function z(){To=b.current,se(h),se(b)}var X=_(null),B=null;function I(e){var t=e.alternate;Ae(Le,Le.current&1),Ae(X,e),B===null&&(t===null||h.current!==null||t.memoizedState!==null)&&(B=e)}function ee(e){Ae(Le,Le.current),Ae(X,e),B===null&&(B=e)}function ae(e){e.tag===22?(Ae(Le,Le.current),Ae(X,e),B===null&&(B=e)):xe()}function xe(){Ae(Le,Le.current),Ae(X,X.current)}function Se(e){se(X),B===e&&(B=null),se(Le)}var Le=_(0);function tt(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||_v(n)||Mv(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Ke=0,Me=null,Be=null,ct=null,On=!1,zn=!1,Fe=!1,vn=0,Bt=0,un=null,Ya=0;function qe(){throw Error(v(321))}function ua(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!An(e[n],t[n]))return!1;return!0}function Hl(e,t,n,l,u,d){return Ke=d,Me=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,D.H=e===null||e.memoizedState===null?Cu:ki,Fe=!1,d=n(l,u),Fe=!1,zn&&(d=Al(t,n,l,u)),wn(e),d}function wn(e){D.H=Eu;var t=Be!==null&&Be.next!==null;if(Ke=0,ct=Be=Me=null,On=!1,Bt=0,un=null,t)throw Error(v(300));e===null||Sn||(e=e.dependencies,e!==null&&Wl(e)&&(Sn=!0))}function Al(e,t,n,l){Me=e;var u=0;do{if(zn&&(un=null),Bt=0,zn=!1,25<=u)throw Error(v(301));if(u+=1,ct=Be=null,e.updateQueue!=null){var d=e.updateQueue;d.lastEffect=null,d.events=null,d.stores=null,d.memoCache!=null&&(d.memoCache.index=0)}D.H=Td,d=t(n,l)}while(zn);return d}function fo(){var e=D.H,t=e.useState()[0];return t=typeof t.then=="function"?ho(t):t,e=e.useState()[0],(Be!==null?Be.memoizedState:null)!==e&&(Me.flags|=1024),t}function Yr(){var e=vn!==0;return vn=0,e}function Pa(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function Pr(e){if(On){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}On=!1}Ke=0,ct=Be=Me=null,zn=!1,Bt=vn=0,un=null}function Dn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ct===null?Me.memoizedState=ct=e:ct=ct.next=e,ct}function Tt(){if(Be===null){var e=Me.alternate;e=e!==null?e.memoizedState:null}else e=Be.next;var t=ct===null?Me.memoizedState:ct.next;if(t!==null)ct=t,Be=e;else{if(e===null)throw Me.alternate===null?Error(v(467)):Error(v(310));Be=e,e={memoizedState:Be.memoizedState,baseState:Be.baseState,baseQueue:Be.baseQueue,queue:Be.queue,next:null},ct===null?Me.memoizedState=ct=e:ct=ct.next=e}return ct}function Ga(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function ho(e){var t=Bt;return Bt+=1,un===null&&(un=[]),e=_i(un,e,t),t=Me,(ct===null?t.memoizedState:ct.next)===null&&(t=t.alternate,D.H=t===null||t.memoizedState===null?Cu:ki),e}function xc(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return ho(e);if(e.$$typeof===de)return Ct(e)}throw Error(v(438,String(e)))}function vo(e){var t=null,n=Me.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var l=Me.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(t={data:l.data.map(function(u){return u.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=Ga(),Me.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),l=0;l<e;l++)n[l]=He;return t.index++,n}function kn(e,t){return typeof t=="function"?t(e):t}function bu(e){var t=Tt();return go(t,Be,e)}function go(e,t,n){var l=e.queue;if(l===null)throw Error(v(311));l.lastRenderedReducer=n;var u=e.baseQueue,d=l.pending;if(d!==null){if(u!==null){var x=u.next;u.next=d.next,d.next=x}t.baseQueue=u=d,l.pending=null}if(d=e.baseState,u===null)e.memoizedState=d;else{t=u.next;var A=x=null,F=null,q=t,ue=!1;do{var ge=q.lane&-536870913;if(ge!==q.lane?(bt&ge)===ge:(Ke&ge)===ge){var te=q.revertLane;if(te===0)F!==null&&(F=F.next={lane:0,revertLane:0,gesture:null,action:q.action,hasEagerState:q.hasEagerState,eagerState:q.eagerState,next:null}),ge===Tl&&(ue=!0);else if((Ke&te)===te){q=q.next,te===Tl&&(ue=!0);continue}else ge={lane:0,revertLane:q.revertLane,gesture:null,action:q.action,hasEagerState:q.hasEagerState,eagerState:q.eagerState,next:null},F===null?(A=F=ge,x=d):F=F.next=ge,Me.lanes|=te,Uc|=te;ge=q.action,Fe&&n(d,ge),d=q.hasEagerState?q.eagerState:n(d,ge)}else te={lane:ge,revertLane:q.revertLane,gesture:q.gesture,action:q.action,hasEagerState:q.hasEagerState,eagerState:q.eagerState,next:null},F===null?(A=F=te,x=d):F=F.next=te,Me.lanes|=ge,Uc|=ge;q=q.next}while(q!==null&&q!==t);if(F===null?x=d:F.next=A,!An(d,e.memoizedState)&&(Sn=!0,ue&&(n=qt,n!==null)))throw n;e.memoizedState=d,e.baseState=x,e.baseQueue=F,l.lastRenderedState=d}return u===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function ss(e){var t=Tt(),n=t.queue;if(n===null)throw Error(v(311));n.lastRenderedReducer=e;var l=n.dispatch,u=n.pending,d=t.memoizedState;if(u!==null){n.pending=null;var x=u=u.next;do d=e(d,x.action),x=x.next;while(x!==u);An(d,t.memoizedState)||(Sn=!0),t.memoizedState=d,t.baseQueue===null&&(t.baseState=d),n.lastRenderedState=d}return[d,l]}function qs(e,t,n){var l=Me,u=Tt(),d=nt;if(d){if(n===void 0)throw Error(v(407));n=n()}else n=t();var x=!An((Be||u).memoizedState,n);if(x&&(u.memoizedState=n,Sn=!0),u=u.queue,yo(tf.bind(null,l,u,e),[e]),u.getSnapshot!==t||x||ct!==null&&ct.memoizedState.tag&1){if(l.flags|=2048,mo(9,{destroy:void 0},ef.bind(null,l,u,n,t),null),Kt===null)throw Error(v(349));d||(Ke&127)!==0||$s(l,t,n)}return n}function $s(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Me.updateQueue,t===null?(t=Ga(),Me.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function ef(e,t,n,l){t.value=n,t.getSnapshot=l,nf(t)&&wc(e)}function tf(e,t,n){return n(function(){nf(t)&&wc(e)})}function nf(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!An(e,n)}catch{return!0}}function wc(e){var t=xt(e,2);t!==null&&va(t,e,2)}function Xa(e){var t=Dn();if(typeof e=="function"){var n=e;if(e=n(),Fe){ta(!0);try{n()}finally{ta(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:kn,lastRenderedState:e},t}function lf(e,t,n,l){return e.baseState=n,go(e,Be,typeof l=="function"?l:kn)}function yd(e,t,n,l,u){if(zc(e))throw Error(v(485));if(e=t.action,e!==null){var d={payload:u,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(x){d.listeners.push(x)}};D.T!==null?n(!0):d.isTransition=!1,l(d),n=t.pending,n===null?(d.next=t.pending=d,Sc(t,d)):(d.next=n.next,t.pending=n.next=d)}}function Sc(e,t){var n=t.action,l=t.payload,u=e.state;if(t.isTransition){var d=D.T,x={};D.T=x;try{var A=n(u,l),F=D.S;F!==null&&F(x,A),af(e,t,A)}catch(q){bo(e,t,q)}finally{d!==null&&x.types!==null&&(d.types=x.types),D.T=d}}else try{d=n(u,l),af(e,t,d)}catch(q){bo(e,t,q)}}function af(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(l){Oi(e,t,l)},function(l){return bo(e,t,l)}):Oi(e,t,n)}function Oi(e,t,n){t.status="fulfilled",t.value=n,Ec(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Sc(e,n)))}function bo(e,t,n){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do t.status="rejected",t.reason=n,Ec(t),t=t.next;while(t!==l)}e.action=null}function Ec(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Cc(e,t){return t}function Tc(e,t){if(nt){var n=Kt.formState;if(n!==null){e:{var l=Me;if(nt){if(Lt){t:{for(var u=Lt,d=xn;u.nodeType!==8;){if(!d){u=null;break t}if(u=fr(u.nextSibling),u===null){u=null;break t}}d=u.data,u=d==="F!"||d==="F"?u:null}if(u){Lt=fr(u.nextSibling),l=u.data==="F!";break e}}nl(l)}l=!1}l&&(t=n[0])}}return n=Dn(),n.memoizedState=n.baseState=t,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Cc,lastRenderedState:t},n.queue=l,n=Su.bind(null,Me,l),l.dispatch=n,l=Xa(!1),d=Oc.bind(null,Me,!1,l.queue),l=Dn(),u={state:t,dispatch:null,action:e,pending:null},l.queue=u,n=yd.bind(null,Me,u,d,n),u.dispatch=n,l.memoizedState=e,[t,n,!1]}function Gr(e){var t=Tt();return fs(t,Be,e)}function fs(e,t,n){if(t=go(e,t,Cc)[0],e=bu(kn)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var l=ho(t)}catch(x){throw x===Ua?Fa:x}else l=t;t=Tt();var u=t.queue,d=u.dispatch;return n!==t.memoizedState&&(Me.flags|=2048,mo(9,{destroy:void 0},rf.bind(null,u,n),null)),[l,d,e]}function rf(e,t){e.action=t}function zi(e){var t=Tt(),n=Be;if(n!==null)return fs(t,n,e);Tt(),t=t.memoizedState,n=Tt();var l=n.queue.dispatch;return n.memoizedState=e,[t,l,!1]}function mo(e,t,n,l){return e={tag:e,create:n,deps:l,inst:t,next:null},t=Me.updateQueue,t===null&&(t=Ga(),Me.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(l=n.next,n.next=e,e.next=l,t.lastEffect=e),e}function mu(){return Tt().memoizedState}function yu(e,t,n,l){var u=Dn();Me.flags|=e,u.memoizedState=mo(1|t,{destroy:void 0},n,l===void 0?null:l)}function Di(e,t,n,l){var u=Tt();l=l===void 0?null:l;var d=u.memoizedState.inst;Be!==null&&l!==null&&ua(l,Be.memoizedState.deps)?u.memoizedState=mo(t,d,n,l):(Me.flags|=e,u.memoizedState=mo(1|t,d,n,l))}function of(e,t){yu(8390656,8,e,t)}function yo(e,t){Di(2048,8,e,t)}function pu(e){Me.flags|=4;var t=Me.updateQueue;if(t===null)t=Ga(),Me.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function cf(e){var t=Tt().memoizedState;return pu({ref:t,nextImpl:e}),function(){if((zt&2)!==0)throw Error(v(440));return t.impl.apply(void 0,arguments)}}function uf(e,t){return Di(4,2,e,t)}function pd(e,t){return Di(4,4,e,t)}function xd(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function ds(e,t,n){n=n!=null?n.concat([e]):null,Di(4,4,xd.bind(null,t,e),n)}function sf(){}function wd(e,t){var n=Tt();t=t===void 0?null:t;var l=n.memoizedState;return t!==null&&ua(t,l[1])?l[0]:(n.memoizedState=[e,t],e)}function Sd(e,t){var n=Tt();t=t===void 0?null:t;var l=n.memoizedState;if(t!==null&&ua(t,l[1]))return l[0];if(l=e(),Fe){ta(!0);try{e()}finally{ta(!1)}}return n.memoizedState=[l,t],l}function sr(e,t,n){return n===void 0||(Ke&1073741824)!==0&&(bt&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=im(),Me.lanes|=e,Uc|=e,n)}function xu(e,t,n,l){return An(n,t)?n:h.current!==null?(e=sr(e,n,l),An(e,t)||(Sn=!0),e):(Ke&42)===0||(Ke&1073741824)!==0&&(bt&261930)===0?(Sn=!0,e.memoizedState=n):(e=im(),Me.lanes|=e,Uc|=e,t)}function Rc(e,t,n,l,u){var d=J.p;J.p=d!==0&&8>d?d:8;var x=D.T,A={};D.T=A,Oc(e,!1,t,n);try{var F=u(),q=D.S;if(q!==null&&q(A,F),F!==null&&typeof F=="object"&&typeof F.then=="function"){var ue=mc(F,l);Mc(e,t,ue,Wa(e))}else Mc(e,t,l,Wa(e))}catch(ge){Mc(e,t,{then:function(){},status:"rejected",reason:ge},Wa())}finally{J.p=d,x!==null&&A.types!==null&&(x.types=A.types),D.T=x}}function Ac(){}function _c(e,t,n,l){if(e.tag!==5)throw Error(v(476));var u=wu(e).queue;Rc(e,u,t,we,n===null?Ac:function(){return hs(e),n(l)})}function wu(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:we,baseState:we,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:kn,lastRenderedState:we},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:kn,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function hs(e){var t=wu(e);t.next===null&&(t=e.alternate.memoizedState),Mc(e,t.next.queue,{},Wa())}function vs(){return Ct(Nf)}function Ed(){return Tt().memoizedState}function gs(){return Tt().memoizedState}function Cd(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=Wa();e=gl(n);var l=Xn(t,e,n);l!==null&&(va(l,t,n),Bl(l,t,n)),t={cache:bc()},e.payload=t;return}t=t.return}}function bs(e,t,n){var l=Wa();n={lane:l,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},zc(e)?ff(t,n):(n=et(e,t,n,l),n!==null&&(va(n,e,l),df(n,t,l)))}function Su(e,t,n){var l=Wa();Mc(e,t,n,l)}function Mc(e,t,n,l){var u={lane:l,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(zc(e))ff(t,u);else{var d=e.alternate;if(e.lanes===0&&(d===null||d.lanes===0)&&(d=t.lastRenderedReducer,d!==null))try{var x=t.lastRenderedState,A=d(x,n);if(u.hasEagerState=!0,u.eagerState=A,An(A,x))return We(e,t,u,0),Kt===null&&Je(),!1}catch{}finally{}if(n=et(e,t,u,l),n!==null)return va(n,e,l),df(n,t,l),!0}return!1}function Oc(e,t,n,l){if(l={lane:2,revertLane:bv(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},zc(e)){if(t)throw Error(v(479))}else t=et(e,n,l,2),t!==null&&va(t,e,2)}function zc(e){var t=e.alternate;return e===Me||t!==null&&t===Me}function ff(e,t){zn=On=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function df(e,t,n){if((n&4194048)!==0){var l=t.lanes;l&=e.pendingLanes,n|=l,t.lanes=n,ri(e,n)}}var Eu={readContext:Ct,use:xc,useCallback:qe,useContext:qe,useEffect:qe,useImperativeHandle:qe,useLayoutEffect:qe,useInsertionEffect:qe,useMemo:qe,useReducer:qe,useRef:qe,useState:qe,useDebugValue:qe,useDeferredValue:qe,useTransition:qe,useSyncExternalStore:qe,useId:qe,useHostTransitionStatus:qe,useFormState:qe,useActionState:qe,useOptimistic:qe,useMemoCache:qe,useCacheRefresh:qe};Eu.useEffectEvent=qe;var Cu={readContext:Ct,use:xc,useCallback:function(e,t){return Dn().memoizedState=[e,t===void 0?null:t],e},useContext:Ct,useEffect:of,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,yu(4194308,4,xd.bind(null,t,e),n)},useLayoutEffect:function(e,t){return yu(4194308,4,e,t)},useInsertionEffect:function(e,t){yu(4,2,e,t)},useMemo:function(e,t){var n=Dn();t=t===void 0?null:t;var l=e();if(Fe){ta(!0);try{e()}finally{ta(!1)}}return n.memoizedState=[l,t],l},useReducer:function(e,t,n){var l=Dn();if(n!==void 0){var u=n(t);if(Fe){ta(!0);try{n(t)}finally{ta(!1)}}}else u=t;return l.memoizedState=l.baseState=u,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:u},l.queue=e,e=e.dispatch=bs.bind(null,Me,e),[l.memoizedState,e]},useRef:function(e){var t=Dn();return e={current:e},t.memoizedState=e},useState:function(e){e=Xa(e);var t=e.queue,n=Su.bind(null,Me,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:sf,useDeferredValue:function(e,t){var n=Dn();return sr(n,e,t)},useTransition:function(){var e=Xa(!1);return e=Rc.bind(null,Me,e.queue,!0,!1),Dn().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var l=Me,u=Dn();if(nt){if(n===void 0)throw Error(v(407));n=n()}else{if(n=t(),Kt===null)throw Error(v(349));(bt&127)!==0||$s(l,t,n)}u.memoizedState=n;var d={value:n,getSnapshot:t};return u.queue=d,of(tf.bind(null,l,d,e),[e]),l.flags|=2048,mo(9,{destroy:void 0},ef.bind(null,l,d,n,t),null),n},useId:function(){var e=Dn(),t=Kt.identifierPrefix;if(nt){var n=Pn,l=Mt;n=(l&~(1<<32-Bn(l)-1)).toString(32)+n,t="_"+t+"R_"+n,n=vn++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=Ya++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:vs,useFormState:Tc,useActionState:Tc,useOptimistic:function(e){var t=Dn();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=Oc.bind(null,Me,!0,n),n.dispatch=t,[e,t]},useMemoCache:vo,useCacheRefresh:function(){return Dn().memoizedState=Cd.bind(null,Me)},useEffectEvent:function(e){var t=Dn(),n={impl:e};return t.memoizedState=n,function(){if((zt&2)!==0)throw Error(v(440));return n.impl.apply(void 0,arguments)}}},ki={readContext:Ct,use:xc,useCallback:wd,useContext:Ct,useEffect:yo,useImperativeHandle:ds,useInsertionEffect:uf,useLayoutEffect:pd,useMemo:Sd,useReducer:bu,useRef:mu,useState:function(){return bu(kn)},useDebugValue:sf,useDeferredValue:function(e,t){var n=Tt();return xu(n,Be.memoizedState,e,t)},useTransition:function(){var e=bu(kn)[0],t=Tt().memoizedState;return[typeof e=="boolean"?e:ho(e),t]},useSyncExternalStore:qs,useId:Ed,useHostTransitionStatus:vs,useFormState:Gr,useActionState:Gr,useOptimistic:function(e,t){var n=Tt();return lf(n,Be,e,t)},useMemoCache:vo,useCacheRefresh:gs};ki.useEffectEvent=cf;var Td={readContext:Ct,use:xc,useCallback:wd,useContext:Ct,useEffect:yo,useImperativeHandle:ds,useInsertionEffect:uf,useLayoutEffect:pd,useMemo:Sd,useReducer:ss,useRef:mu,useState:function(){return ss(kn)},useDebugValue:sf,useDeferredValue:function(e,t){var n=Tt();return Be===null?sr(n,e,t):xu(n,Be.memoizedState,e,t)},useTransition:function(){var e=ss(kn)[0],t=Tt().memoizedState;return[typeof e=="boolean"?e:ho(e),t]},useSyncExternalStore:qs,useId:Ed,useHostTransitionStatus:vs,useFormState:zi,useActionState:zi,useOptimistic:function(e,t){var n=Tt();return Be!==null?lf(n,Be,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:vo,useCacheRefresh:gs};Td.useEffectEvent=cf;function Ni(e,t,n,l){t=e.memoizedState,n=n(l,t),n=n==null?t:L({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var ms={enqueueSetState:function(e,t,n){e=e._reactInternals;var l=Wa(),u=gl(l);u.payload=t,n!=null&&(u.callback=n),t=Xn(e,u,l),t!==null&&(va(t,e,l),Bl(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var l=Wa(),u=gl(l);u.tag=1,u.payload=t,n!=null&&(u.callback=n),t=Xn(e,u,l),t!==null&&(va(t,e,l),Bl(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Wa(),l=gl(n);l.tag=2,t!=null&&(l.callback=t),t=Xn(e,l,n),t!==null&&(va(t,e,n),Bl(t,e,n))}};function Dc(e,t,n,l,u,d,x){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,d,x):t.prototype&&t.prototype.isPureReactComponent?!Il(n,l)||!Il(u,d):!0}function Tu(e,t,n,l){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,l),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,l),t.state!==e&&ms.enqueueReplaceState(t,t.state,null)}function Ia(e,t){var n=t;if("ref"in t){n={};for(var l in t)l!=="ref"&&(n[l]=t[l])}if(e=e.defaultProps){n===t&&(n=L({},n));for(var u in e)n[u]===void 0&&(n[u]=e[u])}return n}function hf(e){Ce(e)}function Li(e){console.error(e)}function vf(e){Ce(e)}function Ru(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(l){setTimeout(function(){throw l})}}function po(e,t,n){try{var l=e.onCaughtError;l(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(u){setTimeout(function(){throw u})}}function ys(e,t,n){return n=gl(n),n.tag=3,n.payload={element:null},n.callback=function(){Ru(e,t)},n}function Au(e){return e=gl(e),e.tag=3,e}function ps(e,t,n,l){var u=n.type.getDerivedStateFromError;if(typeof u=="function"){var d=l.value;e.payload=function(){return u(d)},e.callback=function(){po(t,n,l)}}var x=n.stateNode;x!==null&&typeof x.componentDidCatch=="function"&&(e.callback=function(){po(t,n,l),typeof u!="function"&&(Fc===null?Fc=new Set([this]):Fc.add(this));var A=l.stack;this.componentDidCatch(l.value,{componentStack:A!==null?A:""})})}function _u(e,t,n,l,u){if(n.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(t=n.alternate,t!==null&&Mn(t,n,u,!0),n=X.current,n!==null){switch(n.tag){case 31:case 13:return B===null?Hd():n.alternate===null&&En===0&&(En=3),n.flags&=-257,n.flags|=65536,n.lanes=u,l===ur?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([l]):t.add(l),hv(e,l,u)),!1;case 22:return n.flags|=65536,l===ur?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([l])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([l]):n.add(l)),hv(e,l,u)),!1}throw Error(v(435,n.tag))}return hv(e,l,u),Hd(),!1}if(nt)return t=X.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=u,l!==Si&&(e=Error(v(422),{cause:l}),Na(Yn(e,n)))):(l!==Si&&(t=Error(v(423),{cause:l}),Na(Yn(t,n))),e=e.current.alternate,e.flags|=65536,u&=-u,e.lanes|=u,l=Yn(l,n),u=ys(e.stateNode,l,u),bl(e,u),En!==4&&(En=2)),!1;var d=Error(v(520),{cause:l});if(d=Yn(d,n),Rf===null?Rf=[d]:Rf.push(d),En!==4&&(En=2),t===null)return!0;l=Yn(l,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=u&-u,n.lanes|=e,e=ys(n.stateNode,l,e),bl(n,e),!1;case 1:if(t=n.type,d=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||d!==null&&typeof d.componentDidCatch=="function"&&(Fc===null||!Fc.has(d))))return n.flags|=65536,u&=-u,n.lanes|=u,u=Au(u),ps(u,e,n,l),bl(n,u),!1}n=n.return}while(n!==null);return!1}var gf=Error(v(461)),Sn=!1;function In(e,t,n,l){t.child=e===null?pc(t,null,n,l):rl(t,e.child,n,l)}function kc(e,t,n,l,u){n=n.render;var d=t.ref;if("ref"in l){var x={};for(var A in l)A!=="ref"&&(x[A]=l[A])}else x=l;return El(t),l=Hl(e,t,n,x,d,u),A=Yr(),e!==null&&!Sn?(Pa(e,t,u),Ul(e,t,u)):(nt&&A&&oo(t),t.flags|=1,In(e,t,l,u),t.child)}function Nc(e,t,n,l,u){if(e===null){var d=n.type;return typeof d=="function"&&!ft(d)&&d.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=d,Lc(e,t,d,l,u)):(e=Jt(n.type,null,l,t,t.mode,u),e.ref=t.ref,e.return=t,t.child=e)}if(d=e.child,!ql(e,u)){var x=d.memoizedProps;if(n=n.compare,n=n!==null?n:Il,n(x,l)&&e.ref===t.ref)return Ul(e,t,u)}return t.flags|=1,e=en(d,l),e.ref=t.ref,e.return=t,t.child=e}function Lc(e,t,n,l,u){if(e!==null){var d=e.memoizedProps;if(Il(d,l)&&e.ref===t.ref)if(Sn=!1,t.pendingProps=l=d,ql(e,u))(e.flags&131072)!==0&&(Sn=!0);else return t.lanes=e.lanes,Ul(e,t,u)}return Ou(e,t,n,l,u)}function Mu(e,t,n,l){var u=l.children,d=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((t.flags&128)!==0){if(d=d!==null?d.baseLanes|n:n,e!==null){for(l=t.child=e.child,u=0;l!==null;)u=u|l.lanes|l.childLanes,l=l.sibling;l=u&~d}else l=0,t.child=null;return Rd(e,t,d,n,l)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Ai(t,d!==null?d.cachePool:null),d!==null?y(t,d):C(),ae(t);else return l=t.lanes=536870912,Rd(e,t,d!==null?d.baseLanes|n:n,n,l)}else d!==null?(Ai(t,d.cachePool),y(t,d),xe(),t.memoizedState=null):(e!==null&&Ai(t,null),C(),xe());return In(e,t,u,n),t.child}function Za(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function Rd(e,t,n,l,u){var d=Ri();return d=d===null?null:{parent:Xt._currentValue,pool:d},t.memoizedState={baseLanes:n,cachePool:d},e!==null&&Ai(t,null),C(),ae(t),e!==null&&Mn(e,t,l,!0),t.childLanes=u,null}function Nn(e,t){return t=Nu({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Zn(e,t,n){return rl(t,e.child,null,n),e=Nn(t,t.pendingProps),e.flags|=2,Se(t),t.memoizedState=null,e}function Ad(e,t,n){var l=t.pendingProps,u=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(nt){if(l.mode==="hidden")return e=Nn(t,l),t.lanes=536870912,Za(null,e);if(ee(t),(e=Lt)?(e=Gm(e,xn),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:tl!==null?{id:Mt,overflow:Pn}:null,retryLane:536870912,hydrationErrors:null},n=Fn(e),n.return=t,t.child=n,nn=t,Lt=null)):e=null,e===null)throw nl(t);return t.lanes=536870912,null}return Nn(t,l)}var d=e.memoizedState;if(d!==null){var x=d.dehydrated;if(ee(t),u)if(t.flags&256)t.flags&=-257,t=Zn(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(v(558));else if(Sn||Mn(e,t,n,!1),u=(n&e.childLanes)!==0,Sn||u){if(l=Kt,l!==null&&(x=bn(l,n),x!==0&&x!==d.retryLane))throw d.retryLane=x,xt(e,x),va(l,e,x),gf;Hd(),t=Zn(e,t,n)}else e=d.treeContext,Lt=fr(x.nextSibling),nn=t,nt=!0,_n=null,xn=!1,e!==null&&vc(t,e),t=Nn(t,l),t.flags|=4096;return t}return e=en(e.child,{mode:l.mode,children:l.children}),e.ref=t.ref,t.child=e,e.return=t,e}function Xr(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(v(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function Ou(e,t,n,l,u){return El(t),n=Hl(e,t,n,l,void 0,u),l=Yr(),e!==null&&!Sn?(Pa(e,t,u),Ul(e,t,u)):(nt&&l&&oo(t),t.flags|=1,In(e,t,n,u),t.child)}function Bi(e,t,n,l,u,d){return El(t),t.updateQueue=null,n=Al(t,l,n,u),wn(e),l=Yr(),e!==null&&!Sn?(Pa(e,t,d),Ul(e,t,d)):(nt&&l&&oo(t),t.flags|=1,In(e,t,n,d),t.child)}function xs(e,t,n,l,u){if(El(t),t.stateNode===null){var d=ot,x=n.contextType;typeof x=="object"&&x!==null&&(d=Ct(x)),d=new n(l,d),t.memoizedState=d.state!==null&&d.state!==void 0?d.state:null,d.updater=ms,t.stateNode=d,d._reactInternals=t,d=t.stateNode,d.props=l,d.state=t.memoizedState,d.refs={},jl(t),x=n.contextType,d.context=typeof x=="object"&&x!==null?Ct(x):ot,d.state=t.memoizedState,x=n.getDerivedStateFromProps,typeof x=="function"&&(Ni(t,n,x,l),d.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof d.getSnapshotBeforeUpdate=="function"||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(x=d.state,typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount(),x!==d.state&&ms.enqueueReplaceState(d,d.state,null),ca(t,l,d,u),Fr(),d.state=t.memoizedState),typeof d.componentDidMount=="function"&&(t.flags|=4194308),l=!0}else if(e===null){d=t.stateNode;var A=t.memoizedProps,F=Ia(n,A);d.props=F;var q=d.context,ue=n.contextType;x=ot,typeof ue=="object"&&ue!==null&&(x=Ct(ue));var ge=n.getDerivedStateFromProps;ue=typeof ge=="function"||typeof d.getSnapshotBeforeUpdate=="function",A=t.pendingProps!==A,ue||typeof d.UNSAFE_componentWillReceiveProps!="function"&&typeof d.componentWillReceiveProps!="function"||(A||q!==x)&&Tu(t,d,l,x),oa=!1;var te=t.memoizedState;d.state=te,ca(t,l,d,u),Fr(),q=t.memoizedState,A||te!==q||oa?(typeof ge=="function"&&(Ni(t,n,ge,l),q=t.memoizedState),(F=oa||Dc(t,n,F,l,te,q,x))?(ue||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount()),typeof d.componentDidMount=="function"&&(t.flags|=4194308)):(typeof d.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=l,t.memoizedState=q),d.props=l,d.state=q,d.context=x,l=F):(typeof d.componentDidMount=="function"&&(t.flags|=4194308),l=!1)}else{d=t.stateNode,Ur(e,t),x=t.memoizedProps,ue=Ia(n,x),d.props=ue,ge=t.pendingProps,te=d.context,q=n.contextType,F=ot,typeof q=="object"&&q!==null&&(F=Ct(q)),A=n.getDerivedStateFromProps,(q=typeof A=="function"||typeof d.getSnapshotBeforeUpdate=="function")||typeof d.UNSAFE_componentWillReceiveProps!="function"&&typeof d.componentWillReceiveProps!="function"||(x!==ge||te!==F)&&Tu(t,d,l,F),oa=!1,te=t.memoizedState,d.state=te,ca(t,l,d,u),Fr();var re=t.memoizedState;x!==ge||te!==re||oa||e!==null&&e.dependencies!==null&&Wl(e.dependencies)?(typeof A=="function"&&(Ni(t,n,A,l),re=t.memoizedState),(ue=oa||Dc(t,n,ue,l,te,re,F)||e!==null&&e.dependencies!==null&&Wl(e.dependencies))?(q||typeof d.UNSAFE_componentWillUpdate!="function"&&typeof d.componentWillUpdate!="function"||(typeof d.componentWillUpdate=="function"&&d.componentWillUpdate(l,re,F),typeof d.UNSAFE_componentWillUpdate=="function"&&d.UNSAFE_componentWillUpdate(l,re,F)),typeof d.componentDidUpdate=="function"&&(t.flags|=4),typeof d.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof d.componentDidUpdate!="function"||x===e.memoizedProps&&te===e.memoizedState||(t.flags|=4),typeof d.getSnapshotBeforeUpdate!="function"||x===e.memoizedProps&&te===e.memoizedState||(t.flags|=1024),t.memoizedProps=l,t.memoizedState=re),d.props=l,d.state=re,d.context=F,l=ue):(typeof d.componentDidUpdate!="function"||x===e.memoizedProps&&te===e.memoizedState||(t.flags|=4),typeof d.getSnapshotBeforeUpdate!="function"||x===e.memoizedProps&&te===e.memoizedState||(t.flags|=1024),l=!1)}return d=l,Xr(e,t),l=(t.flags&128)!==0,d||l?(d=t.stateNode,n=l&&typeof n.getDerivedStateFromError!="function"?null:d.render(),t.flags|=1,e!==null&&l?(t.child=rl(t,e.child,null,u),t.child=rl(t,null,n,u)):In(e,t,n,u),t.memoizedState=d.state,e=t.child):e=Ul(e,t,u),e}function bf(e,t,n,l){return kl(),t.flags|=256,In(e,t,n,l),t.child}var Ir={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function zu(e){return{baseLanes:e,cachePool:$t()}}function Du(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=Qa),e}function mf(e,t,n){var l=t.pendingProps,u=!1,d=(t.flags&128)!==0,x;if((x=d)||(x=e!==null&&e.memoizedState===null?!1:(Le.current&2)!==0),x&&(u=!0,t.flags&=-129),x=(t.flags&32)!==0,t.flags&=-33,e===null){if(nt){if(u?I(t):xe(),(e=Lt)?(e=Gm(e,xn),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:tl!==null?{id:Mt,overflow:Pn}:null,retryLane:536870912,hydrationErrors:null},n=Fn(e),n.return=t,t.child=n,nn=t,Lt=null)):e=null,e===null)throw nl(t);return Mv(e)?t.lanes=32:t.lanes=536870912,null}var A=l.children;return l=l.fallback,u?(xe(),u=t.mode,A=Nu({mode:"hidden",children:A},u),l=Ft(l,u,n,null),A.return=t,l.return=t,A.sibling=l,t.child=A,l=t.child,l.memoizedState=zu(n),l.childLanes=Du(e,x,n),t.memoizedState=Ir,Za(null,l)):(I(t),ku(t,A))}var F=e.memoizedState;if(F!==null&&(A=F.dehydrated,A!==null)){if(d)t.flags&256?(I(t),t.flags&=-257,t=Lu(e,t,n)):t.memoizedState!==null?(xe(),t.child=e.child,t.flags|=128,t=null):(xe(),A=l.fallback,u=t.mode,l=Nu({mode:"visible",children:l.children},u),A=Ft(A,u,n,null),A.flags|=2,l.return=t,A.return=t,l.sibling=A,t.child=l,rl(t,e.child,null,n),l=t.child,l.memoizedState=zu(n),l.childLanes=Du(e,x,n),t.memoizedState=Ir,t=Za(null,l));else if(I(t),Mv(A)){if(x=A.nextSibling&&A.nextSibling.dataset,x)var q=x.dgst;x=q,l=Error(v(419)),l.stack="",l.digest=x,Na({value:l,source:null,stack:null}),t=Lu(e,t,n)}else if(Sn||Mn(e,t,n,!1),x=(n&e.childLanes)!==0,Sn||x){if(x=Kt,x!==null&&(l=bn(x,n),l!==0&&l!==F.retryLane))throw F.retryLane=l,xt(e,l),va(x,e,l),gf;_v(A)||Hd(),t=Lu(e,t,n)}else _v(A)?(t.flags|=192,t.child=e.child,t=null):(e=F.treeContext,Lt=fr(A.nextSibling),nn=t,nt=!0,_n=null,xn=!1,e!==null&&vc(t,e),t=ku(t,l.children),t.flags|=4096);return t}return u?(xe(),A=l.fallback,u=t.mode,F=e.child,q=F.sibling,l=en(F,{mode:"hidden",children:l.children}),l.subtreeFlags=F.subtreeFlags&65011712,q!==null?A=en(q,A):(A=Ft(A,u,n,null),A.flags|=2),A.return=t,l.return=t,l.sibling=A,t.child=l,Za(null,l),l=t.child,A=e.child.memoizedState,A===null?A=zu(n):(u=A.cachePool,u!==null?(F=Xt._currentValue,u=u.parent!==F?{parent:F,pool:F}:u):u=$t(),A={baseLanes:A.baseLanes|n,cachePool:u}),l.memoizedState=A,l.childLanes=Du(e,x,n),t.memoizedState=Ir,Za(e.child,l)):(I(t),n=e.child,e=n.sibling,n=en(n,{mode:"visible",children:l.children}),n.return=t,n.sibling=null,e!==null&&(x=t.deletions,x===null?(t.deletions=[e],t.flags|=16):x.push(e)),t.child=n,t.memoizedState=null,n)}function ku(e,t){return t=Nu({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function Nu(e,t){return e=kt(22,e,null,t),e.lanes=0,e}function Lu(e,t,n){return rl(t,e.child,null,n),e=ku(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function yf(e,t,n){e.lanes|=t;var l=e.alternate;l!==null&&(l.lanes|=t),ia(e.return,t,n)}function Bu(e,t,n,l,u,d){var x=e.memoizedState;x===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:l,tail:n,tailMode:u,treeForkCount:d}:(x.isBackwards=t,x.rendering=null,x.renderingStartTime=0,x.last=l,x.tail=n,x.tailMode=u,x.treeForkCount=d)}function pf(e,t,n){var l=t.pendingProps,u=l.revealOrder,d=l.tail;l=l.children;var x=Le.current,A=(x&2)!==0;if(A?(x=x&1|2,t.flags|=128):x&=1,Ae(Le,x),In(e,t,l,n),l=nt?el:0,!A&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&yf(e,n,t);else if(e.tag===19)yf(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(u){case"forwards":for(n=t.child,u=null;n!==null;)e=n.alternate,e!==null&&tt(e)===null&&(u=n),n=n.sibling;n=u,n===null?(u=t.child,t.child=null):(u=n.sibling,n.sibling=null),Bu(t,!1,u,n,d,l);break;case"backwards":case"unstable_legacy-backwards":for(n=null,u=t.child,t.child=null;u!==null;){if(e=u.alternate,e!==null&&tt(e)===null){t.child=u;break}e=u.sibling,u.sibling=n,n=u,u=e}Bu(t,!0,n,null,d,l);break;case"together":Bu(t,!1,null,null,void 0,l);break;default:t.memoizedState=null}return t.child}function Ul(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Uc|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(Mn(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(v(153));if(t.child!==null){for(e=t.child,n=en(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=en(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function ql(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&Wl(e)))}function _d(e,t,n){switch(t.tag){case 3:Vt(t,t.stateNode.containerInfo),ll(t,Xt,e.memoizedState.cache),kl();break;case 27:case 5:ea(t);break;case 4:Vt(t,t.stateNode.containerInfo);break;case 10:ll(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,ee(t),null;break;case 13:var l=t.memoizedState;if(l!==null)return l.dehydrated!==null?(I(t),t.flags|=128,null):(n&t.child.childLanes)!==0?mf(e,t,n):(I(t),e=Ul(e,t,n),e!==null?e.sibling:null);I(t);break;case 19:var u=(e.flags&128)!==0;if(l=(n&t.childLanes)!==0,l||(Mn(e,t,n,!1),l=(n&t.childLanes)!==0),u){if(l)return pf(e,t,n);t.flags|=128}if(u=t.memoizedState,u!==null&&(u.rendering=null,u.tail=null,u.lastEffect=null),Ae(Le,Le.current),l)break;return null;case 22:return t.lanes=0,Mu(e,t,n,t.pendingProps);case 24:ll(t,Xt,e.memoizedState.cache)}return Ul(e,t,n)}function H0(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)Sn=!0;else{if(!ql(e,n)&&(t.flags&128)===0)return Sn=!1,_d(e,t,n);Sn=(e.flags&131072)!==0}else Sn=!1,nt&&(t.flags&1048576)!==0&&dc(t,el,t.index);switch(t.lanes=0,t.tag){case 16:e:{var l=t.pendingProps;if(e=Jl(t.elementType),t.type=e,typeof e=="function")ft(e)?(l=Ia(e,l),t.tag=1,t=xs(null,t,e,l,n)):(t.tag=0,t=Ou(null,t,e,l,n));else{if(e!=null){var u=e.$$typeof;if(u===ve){t.tag=11,t=kc(null,t,e,l,n);break e}else if(u===be){t.tag=14,t=Nc(null,t,e,l,n);break e}}throw t=Ge(e)||e,Error(v(306,t,""))}}return t;case 0:return Ou(e,t,t.type,t.pendingProps,n);case 1:return l=t.type,u=Ia(l,t.pendingProps),xs(e,t,l,u,n);case 3:e:{if(Vt(t,t.stateNode.containerInfo),e===null)throw Error(v(387));l=t.pendingProps;var d=t.memoizedState;u=d.element,Ur(e,t),ca(t,l,null,n);var x=t.memoizedState;if(l=x.cache,ll(t,Xt,l),l!==d.cache&&Ei(t,[Xt],n,!0),Fr(),l=x.element,d.isDehydrated)if(d={element:l,isDehydrated:!1,cache:x.cache},t.updateQueue.baseState=d,t.memoizedState=d,t.flags&256){t=bf(e,t,l,n);break e}else if(l!==u){u=Yn(Error(v(424)),t),Na(u),t=bf(e,t,l,n);break e}else{switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName==="HTML"?e.ownerDocument.body:e}for(Lt=fr(e.firstChild),nn=t,nt=!0,_n=null,xn=!0,n=pc(t,null,l,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling}else{if(kl(),l===u){t=Ul(e,t,n);break e}In(e,t,l,n)}t=t.child}return t;case 26:return Xr(e,t),e===null?(n=Wm(t.type,null,t.pendingProps,null))?t.memoizedState=n:nt||(n=t.type,e=t.pendingProps,l=Id(_e.current).createElement(n),l[mn]=t,l[Wn]=e,_l(l,n,e),dn(l),t.stateNode=l):t.memoizedState=Wm(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return ea(t),e===null&&nt&&(l=t.stateNode=Zm(t.type,t.pendingProps,_e.current),nn=t,xn=!0,u=Lt,Xc(t.type)?(Ov=u,Lt=fr(l.firstChild)):Lt=u),In(e,t,t.pendingProps.children,n),Xr(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&nt&&((u=l=Lt)&&(l=nE(l,t.type,t.pendingProps,xn),l!==null?(t.stateNode=l,nn=t,Lt=fr(l.firstChild),xn=!1,u=!0):u=!1),u||nl(t)),ea(t),u=t.type,d=t.pendingProps,x=e!==null?e.memoizedProps:null,l=d.children,Tv(u,d)?l=null:x!==null&&Tv(u,x)&&(t.flags|=32),t.memoizedState!==null&&(u=Hl(e,t,fo,null,null,n),Nf._currentValue=u),Xr(e,t),In(e,t,l,n),t.child;case 6:return e===null&&nt&&((e=n=Lt)&&(n=lE(n,t.pendingProps,xn),n!==null?(t.stateNode=n,nn=t,Lt=null,e=!0):e=!1),e||nl(t)),null;case 13:return mf(e,t,n);case 4:return Vt(t,t.stateNode.containerInfo),l=t.pendingProps,e===null?t.child=rl(t,null,l,n):In(e,t,l,n),t.child;case 11:return kc(e,t,t.type,t.pendingProps,n);case 7:return In(e,t,t.pendingProps,n),t.child;case 8:return In(e,t,t.pendingProps.children,n),t.child;case 12:return In(e,t,t.pendingProps.children,n),t.child;case 10:return l=t.pendingProps,ll(t,t.type,l.value),In(e,t,l.children,n),t.child;case 9:return u=t.type._context,l=t.pendingProps.children,El(t),u=Ct(u),l=l(u),t.flags|=1,In(e,t,l,n),t.child;case 14:return Nc(e,t,t.type,t.pendingProps,n);case 15:return Lc(e,t,t.type,t.pendingProps,n);case 19:return pf(e,t,n);case 31:return Ad(e,t,n);case 22:return Mu(e,t,n,t.pendingProps);case 24:return El(t),l=Ct(Xt),e===null?(u=Ri(),u===null&&(u=Kt,d=bc(),u.pooledCache=d,d.refCount++,d!==null&&(u.pooledCacheLanes|=n),u=d),t.memoizedState={parent:l,cache:u},jl(t),ll(t,Xt,u)):((e.lanes&n)!==0&&(Ur(e,t),ca(t,null,null,n),Fr()),u=e.memoizedState,d=t.memoizedState,u.parent!==l?(u={parent:l,cache:l},t.memoizedState=u,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=u),ll(t,Xt,l)):(l=d.cache,ll(t,Xt,l),l!==u.cache&&Ei(t,[Xt],n,!0))),In(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(v(156,t.tag))}function xo(e){e.flags|=4}function qh(e,t,n,l,u){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(u&335544128)===u)if(e.stateNode.complete)e.flags|=8192;else if(sm())e.flags|=8192;else throw al=ur,cr}else e.flags&=-16777217}function U0(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!$m(t))if(sm())e.flags|=8192;else throw al=ur,cr}function Md(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?ru():536870912,e.lanes|=t,Cs|=t)}function xf(e,t){if(!nt)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var l=null;n!==null;)n.alternate!==null&&(l=n),n=n.sibling;l===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null}}function ln(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,l=0;if(t)for(var u=e.child;u!==null;)n|=u.lanes|u.childLanes,l|=u.subtreeFlags&65011712,l|=u.flags&65011712,u.return=e,u=u.sibling;else for(u=e.child;u!==null;)n|=u.lanes|u.childLanes,l|=u.subtreeFlags,l|=u.flags,u.return=e,u=u.sibling;return e.subtreeFlags|=l,e.childLanes=n,t}function AS(e,t,n){var l=t.pendingProps;switch(hc(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return ln(t),null;case 1:return ln(t),null;case 3:return n=t.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),t.memoizedState.cache!==l&&(t.flags|=2048),hl(Xt),Qe(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(ra(t)?xo(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,or())),ln(t),null;case 26:var u=t.type,d=t.memoizedState;return e===null?(xo(t),d!==null?(ln(t),U0(t,d)):(ln(t),qh(t,u,null,l,n))):d?d!==e.memoizedState?(xo(t),ln(t),U0(t,d)):(ln(t),t.flags&=-16777217):(e=e.memoizedProps,e!==l&&xo(t),ln(t),qh(t,u,e,l,n)),null;case 27:if(_t(t),n=_e.current,u=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&xo(t);else{if(!l){if(t.stateNode===null)throw Error(v(166));return ln(t),null}e=Re.current,ra(t)?gc(t):(e=Zm(u,l,n),t.stateNode=e,xo(t))}return ln(t),null;case 5:if(_t(t),u=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&xo(t);else{if(!l){if(t.stateNode===null)throw Error(v(166));return ln(t),null}if(d=Re.current,ra(t))gc(t);else{var x=Id(_e.current);switch(d){case 1:d=x.createElementNS("http://www.w3.org/2000/svg",u);break;case 2:d=x.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;default:switch(u){case"svg":d=x.createElementNS("http://www.w3.org/2000/svg",u);break;case"math":d=x.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;case"script":d=x.createElement("div"),d.innerHTML="<script><\/script>",d=d.removeChild(d.firstChild);break;case"select":d=typeof l.is=="string"?x.createElement("select",{is:l.is}):x.createElement("select"),l.multiple?d.multiple=!0:l.size&&(d.size=l.size);break;default:d=typeof l.is=="string"?x.createElement(u,{is:l.is}):x.createElement(u)}}d[mn]=t,d[Wn]=l;e:for(x=t.child;x!==null;){if(x.tag===5||x.tag===6)d.appendChild(x.stateNode);else if(x.tag!==4&&x.tag!==27&&x.child!==null){x.child.return=x,x=x.child;continue}if(x===t)break e;for(;x.sibling===null;){if(x.return===null||x.return===t)break e;x=x.return}x.sibling.return=x.return,x=x.sibling}t.stateNode=d;e:switch(_l(d,u,l),u){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}l&&xo(t)}}return ln(t),qh(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==l&&xo(t);else{if(typeof l!="string"&&t.stateNode===null)throw Error(v(166));if(e=_e.current,ra(t)){if(e=t.stateNode,n=t.memoizedProps,l=null,u=nn,u!==null)switch(u.tag){case 27:case 5:l=u.memoizedProps}e[mn]=t,e=!!(e.nodeValue===n||l!==null&&l.suppressHydrationWarning===!0||Nm(e.nodeValue,n)),e||nl(t,!0)}else e=Id(e).createTextNode(l),e[mn]=t,t.stateNode=e}return ln(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(l=ra(t),n!==null){if(e===null){if(!l)throw Error(v(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(v(557));e[mn]=t}else kl(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;ln(t),e=!1}else n=or(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(Se(t),t):(Se(t),null);if((t.flags&128)!==0)throw Error(v(558))}return ln(t),null;case 13:if(l=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(u=ra(t),l!==null&&l.dehydrated!==null){if(e===null){if(!u)throw Error(v(318));if(u=t.memoizedState,u=u!==null?u.dehydrated:null,!u)throw Error(v(317));u[mn]=t}else kl(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;ln(t),u=!1}else u=or(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=u),u=!0;if(!u)return t.flags&256?(Se(t),t):(Se(t),null)}return Se(t),(t.flags&128)!==0?(t.lanes=n,t):(n=l!==null,e=e!==null&&e.memoizedState!==null,n&&(l=t.child,u=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(u=l.alternate.memoizedState.cachePool.pool),d=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(d=l.memoizedState.cachePool.pool),d!==u&&(l.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),Md(t,t.updateQueue),ln(t),null);case 4:return Qe(),e===null&&xv(t.stateNode.containerInfo),ln(t),null;case 10:return hl(t.type),ln(t),null;case 19:if(se(Le),l=t.memoizedState,l===null)return ln(t),null;if(u=(t.flags&128)!==0,d=l.rendering,d===null)if(u)xf(l,!1);else{if(En!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(d=tt(e),d!==null){for(t.flags|=128,xf(l,!1),e=d.updateQueue,t.updateQueue=e,Md(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)wt(n,e),n=n.sibling;return Ae(Le,Le.current&1|2),nt&&wl(t,l.treeForkCount),t.child}e=e.sibling}l.tail!==null&&cl()>Nd&&(t.flags|=128,u=!0,xf(l,!1),t.lanes=4194304)}else{if(!u)if(e=tt(d),e!==null){if(t.flags|=128,u=!0,e=e.updateQueue,t.updateQueue=e,Md(t,e),xf(l,!0),l.tail===null&&l.tailMode==="hidden"&&!d.alternate&&!nt)return ln(t),null}else 2*cl()-l.renderingStartTime>Nd&&n!==536870912&&(t.flags|=128,u=!0,xf(l,!1),t.lanes=4194304);l.isBackwards?(d.sibling=t.child,t.child=d):(e=l.last,e!==null?e.sibling=d:t.child=d,l.last=d)}return l.tail!==null?(e=l.tail,l.rendering=e,l.tail=e.sibling,l.renderingStartTime=cl(),e.sibling=null,n=Le.current,Ae(Le,u?n&1|2:n&1),nt&&wl(t,l.treeForkCount),e):(ln(t),null);case 22:case 23:return Se(t),z(),l=t.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(t.flags|=8192):l&&(t.flags|=8192),l?(n&536870912)!==0&&(t.flags&128)===0&&(ln(t),t.subtreeFlags&6&&(t.flags|=8192)):ln(t),n=t.updateQueue,n!==null&&Md(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),l=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(l=t.memoizedState.cachePool.pool),l!==n&&(t.flags|=2048),e!==null&&se(Ha),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),hl(Xt),ln(t),null;case 25:return null;case 30:return null}throw Error(v(156,t.tag))}function _S(e,t){switch(hc(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return hl(Xt),Qe(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return _t(t),null;case 31:if(t.memoizedState!==null){if(Se(t),t.alternate===null)throw Error(v(340));kl()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Se(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(v(340));kl()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return se(Le),null;case 4:return Qe(),null;case 10:return hl(t.type),null;case 22:case 23:return Se(t),z(),e!==null&&se(Ha),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return hl(Xt),null;case 25:return null;default:return null}}function F0(e,t){switch(hc(t),t.tag){case 3:hl(Xt),Qe();break;case 26:case 27:case 5:_t(t);break;case 4:Qe();break;case 31:t.memoizedState!==null&&Se(t);break;case 13:Se(t);break;case 19:se(Le);break;case 10:hl(t.type);break;case 22:case 23:Se(t),z(),e!==null&&se(Ha);break;case 24:hl(Xt)}}function wf(e,t){try{var n=t.updateQueue,l=n!==null?n.lastEffect:null;if(l!==null){var u=l.next;n=u;do{if((n.tag&e)===e){l=void 0;var d=n.create,x=n.inst;l=d(),x.destroy=l}n=n.next}while(n!==u)}}catch(A){Pt(t,t.return,A)}}function Bc(e,t,n){try{var l=t.updateQueue,u=l!==null?l.lastEffect:null;if(u!==null){var d=u.next;l=d;do{if((l.tag&e)===e){var x=l.inst,A=x.destroy;if(A!==void 0){x.destroy=void 0,u=t;var F=n,q=A;try{q()}catch(ue){Pt(u,F,ue)}}}l=l.next}while(l!==d)}}catch(ue){Pt(t,t.return,ue)}}function Y0(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{o(t,n)}catch(l){Pt(e,e.return,l)}}}function P0(e,t,n){n.props=Ia(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(l){Pt(e,t,l)}}function Sf(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var l=e.stateNode;break;case 30:l=e.stateNode;break;default:l=e.stateNode}typeof n=="function"?e.refCleanup=n(l):n.current=l}}catch(u){Pt(e,t,u)}}function Hi(e,t){var n=e.ref,l=e.refCleanup;if(n!==null)if(typeof l=="function")try{l()}catch(u){Pt(e,t,u)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(u){Pt(e,t,u)}else n.current=null}function G0(e){var t=e.type,n=e.memoizedProps,l=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&l.focus();break e;case"img":n.src?l.src=n.src:n.srcSet&&(l.srcset=n.srcSet)}}catch(u){Pt(e,e.return,u)}}function $h(e,t,n){try{var l=e.stateNode;KS(l,e.type,n,t),l[Wn]=t}catch(u){Pt(e,e.return,u)}}function X0(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Xc(e.type)||e.tag===4}function ev(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||X0(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Xc(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function tv(e,t,n){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Ra));else if(l!==4&&(l===27&&Xc(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(tv(e,t,n),e=e.sibling;e!==null;)tv(e,t,n),e=e.sibling}function Od(e,t,n){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(l!==4&&(l===27&&Xc(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(Od(e,t,n),e=e.sibling;e!==null;)Od(e,t,n),e=e.sibling}function I0(e){var t=e.stateNode,n=e.memoizedProps;try{for(var l=e.type,u=t.attributes;u.length;)t.removeAttributeNode(u[0]);_l(t,l,n),t[mn]=e,t[Wn]=n}catch(d){Pt(e,e.return,d)}}var wo=!1,Vn=!1,nv=!1,Z0=typeof WeakSet=="function"?WeakSet:Set,ml=null;function MS(e,t){if(e=e.containerInfo,Ev=jd,e=sc(e),fc(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var l=n.getSelection&&n.getSelection();if(l&&l.rangeCount!==0){n=l.anchorNode;var u=l.anchorOffset,d=l.focusNode;l=l.focusOffset;try{n.nodeType,d.nodeType}catch{n=null;break e}var x=0,A=-1,F=-1,q=0,ue=0,ge=e,te=null;t:for(;;){for(var re;ge!==n||u!==0&&ge.nodeType!==3||(A=x+u),ge!==d||l!==0&&ge.nodeType!==3||(F=x+l),ge.nodeType===3&&(x+=ge.nodeValue.length),(re=ge.firstChild)!==null;)te=ge,ge=re;for(;;){if(ge===e)break t;if(te===n&&++q===u&&(A=x),te===d&&++ue===l&&(F=x),(re=ge.nextSibling)!==null)break;ge=te,te=ge.parentNode}ge=re}n=A===-1||F===-1?null:{start:A,end:F}}else n=null}n=n||{start:0,end:0}}else n=null;for(Cv={focusedElem:e,selectionRange:n},jd=!1,ml=t;ml!==null;)if(t=ml,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,ml=e;else for(;ml!==null;){switch(t=ml,d=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(n=0;n<e.length;n++)u=e[n],u.ref.impl=u.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&d!==null){e=void 0,n=t,u=d.memoizedProps,d=d.memoizedState,l=n.stateNode;try{var ze=Ia(n.type,u);e=l.getSnapshotBeforeUpdate(ze,d),l.__reactInternalSnapshotBeforeUpdate=e}catch(Ie){Pt(n,n.return,Ie)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)Av(e);else if(n===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Av(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(v(163))}if(e=t.sibling,e!==null){e.return=t.return,ml=e;break}ml=t.return}}function V0(e,t,n){var l=n.flags;switch(n.tag){case 0:case 11:case 15:Eo(e,n),l&4&&wf(5,n);break;case 1:if(Eo(e,n),l&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(x){Pt(n,n.return,x)}else{var u=Ia(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(u,t,e.__reactInternalSnapshotBeforeUpdate)}catch(x){Pt(n,n.return,x)}}l&64&&Y0(n),l&512&&Sf(n,n.return);break;case 3:if(Eo(e,n),l&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{o(e,t)}catch(x){Pt(n,n.return,x)}}break;case 27:t===null&&l&4&&I0(n);case 26:case 5:Eo(e,n),t===null&&l&4&&G0(n),l&512&&Sf(n,n.return);break;case 12:Eo(e,n);break;case 31:Eo(e,n),l&4&&J0(e,n);break;case 13:Eo(e,n),l&4&&K0(e,n),l&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=US.bind(null,n),aE(e,n))));break;case 22:if(l=n.memoizedState!==null||wo,!l){t=t!==null&&t.memoizedState!==null||Vn,u=wo;var d=Vn;wo=l,(Vn=t)&&!d?Co(e,n,(n.subtreeFlags&8772)!==0):Eo(e,n),wo=u,Vn=d}break;case 30:break;default:Eo(e,n)}}function Q0(e){var t=e.alternate;t!==null&&(e.alternate=null,Q0(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&mr(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var sn=null,sa=!1;function So(e,t,n){for(n=n.child;n!==null;)W0(e,t,n),n=n.sibling}function W0(e,t,n){if(gn&&typeof gn.onCommitFiberUnmount=="function")try{gn.onCommitFiberUnmount(ja,n)}catch{}switch(n.tag){case 26:Vn||Hi(n,t),So(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:Vn||Hi(n,t);var l=sn,u=sa;Xc(n.type)&&(sn=n.stateNode,sa=!1),So(e,t,n),zf(n.stateNode),sn=l,sa=u;break;case 5:Vn||Hi(n,t);case 6:if(l=sn,u=sa,sn=null,So(e,t,n),sn=l,sa=u,sn!==null)if(sa)try{(sn.nodeType===9?sn.body:sn.nodeName==="HTML"?sn.ownerDocument.body:sn).removeChild(n.stateNode)}catch(d){Pt(n,t,d)}else try{sn.removeChild(n.stateNode)}catch(d){Pt(n,t,d)}break;case 18:sn!==null&&(sa?(e=sn,Ym(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),Ds(e)):Ym(sn,n.stateNode));break;case 4:l=sn,u=sa,sn=n.stateNode.containerInfo,sa=!0,So(e,t,n),sn=l,sa=u;break;case 0:case 11:case 14:case 15:Bc(2,n,t),Vn||Bc(4,n,t),So(e,t,n);break;case 1:Vn||(Hi(n,t),l=n.stateNode,typeof l.componentWillUnmount=="function"&&P0(n,t,l)),So(e,t,n);break;case 21:So(e,t,n);break;case 22:Vn=(l=Vn)||n.memoizedState!==null,So(e,t,n),Vn=l;break;default:So(e,t,n)}}function J0(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Ds(e)}catch(n){Pt(t,t.return,n)}}}function K0(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Ds(e)}catch(n){Pt(t,t.return,n)}}function OS(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new Z0),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new Z0),t;default:throw Error(v(435,e.tag))}}function zd(e,t){var n=OS(e);t.forEach(function(l){if(!n.has(l)){n.add(l);var u=FS.bind(null,e,l);l.then(u,u)}})}function fa(e,t){var n=t.deletions;if(n!==null)for(var l=0;l<n.length;l++){var u=n[l],d=e,x=t,A=x;e:for(;A!==null;){switch(A.tag){case 27:if(Xc(A.type)){sn=A.stateNode,sa=!1;break e}break;case 5:sn=A.stateNode,sa=!1;break e;case 3:case 4:sn=A.stateNode.containerInfo,sa=!0;break e}A=A.return}if(sn===null)throw Error(v(160));W0(d,x,u),sn=null,sa=!1,d=u.alternate,d!==null&&(d.return=null),u.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)j0(t,e),t=t.sibling}var Zr=null;function j0(e,t){var n=e.alternate,l=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:fa(t,e),da(e),l&4&&(Bc(3,e,e.return),wf(3,e),Bc(5,e,e.return));break;case 1:fa(t,e),da(e),l&512&&(Vn||n===null||Hi(n,n.return)),l&64&&wo&&(e=e.updateQueue,e!==null&&(l=e.callbacks,l!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?l:n.concat(l))));break;case 26:var u=Zr;if(fa(t,e),da(e),l&512&&(Vn||n===null||Hi(n,n.return)),l&4){var d=n!==null?n.memoizedState:null;if(l=e.memoizedState,n===null)if(l===null)if(e.stateNode===null){e:{l=e.type,n=e.memoizedProps,u=u.ownerDocument||u;t:switch(l){case"title":d=u.getElementsByTagName("title")[0],(!d||d[St]||d[mn]||d.namespaceURI==="http://www.w3.org/2000/svg"||d.hasAttribute("itemprop"))&&(d=u.createElement(l),u.head.insertBefore(d,u.querySelector("head > title"))),_l(d,l,n),d[mn]=e,dn(d),l=d;break e;case"link":var x=jm("link","href",u).get(l+(n.href||""));if(x){for(var A=0;A<x.length;A++)if(d=x[A],d.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&d.getAttribute("rel")===(n.rel==null?null:n.rel)&&d.getAttribute("title")===(n.title==null?null:n.title)&&d.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){x.splice(A,1);break t}}d=u.createElement(l),_l(d,l,n),u.head.appendChild(d);break;case"meta":if(x=jm("meta","content",u).get(l+(n.content||""))){for(A=0;A<x.length;A++)if(d=x[A],d.getAttribute("content")===(n.content==null?null:""+n.content)&&d.getAttribute("name")===(n.name==null?null:n.name)&&d.getAttribute("property")===(n.property==null?null:n.property)&&d.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&d.getAttribute("charset")===(n.charSet==null?null:n.charSet)){x.splice(A,1);break t}}d=u.createElement(l),_l(d,l,n),u.head.appendChild(d);break;default:throw Error(v(468,l))}d[mn]=e,dn(d),l=d}e.stateNode=l}else qm(u,e.type,e.stateNode);else e.stateNode=Km(u,l,e.memoizedProps);else d!==l?(d===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):d.count--,l===null?qm(u,e.type,e.stateNode):Km(u,l,e.memoizedProps)):l===null&&e.stateNode!==null&&$h(e,e.memoizedProps,n.memoizedProps)}break;case 27:fa(t,e),da(e),l&512&&(Vn||n===null||Hi(n,n.return)),n!==null&&l&4&&$h(e,e.memoizedProps,n.memoizedProps);break;case 5:if(fa(t,e),da(e),l&512&&(Vn||n===null||Hi(n,n.return)),e.flags&32){u=e.stateNode;try{ui(u,"")}catch(ze){Pt(e,e.return,ze)}}l&4&&e.stateNode!=null&&(u=e.memoizedProps,$h(e,u,n!==null?n.memoizedProps:u)),l&1024&&(nv=!0);break;case 6:if(fa(t,e),da(e),l&4){if(e.stateNode===null)throw Error(v(162));l=e.memoizedProps,n=e.stateNode;try{n.nodeValue=l}catch(ze){Pt(e,e.return,ze)}}break;case 3:if(Qd=null,u=Zr,Zr=Zd(t.containerInfo),fa(t,e),Zr=u,da(e),l&4&&n!==null&&n.memoizedState.isDehydrated)try{Ds(t.containerInfo)}catch(ze){Pt(e,e.return,ze)}nv&&(nv=!1,q0(e));break;case 4:l=Zr,Zr=Zd(e.stateNode.containerInfo),fa(t,e),da(e),Zr=l;break;case 12:fa(t,e),da(e);break;case 31:fa(t,e),da(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,zd(e,l)));break;case 13:fa(t,e),da(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(kd=cl()),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,zd(e,l)));break;case 22:u=e.memoizedState!==null;var F=n!==null&&n.memoizedState!==null,q=wo,ue=Vn;if(wo=q||u,Vn=ue||F,fa(t,e),Vn=ue,wo=q,da(e),l&8192)e:for(t=e.stateNode,t._visibility=u?t._visibility&-2:t._visibility|1,u&&(n===null||F||wo||Vn||Hu(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){F=n=t;try{if(d=F.stateNode,u)x=d.style,typeof x.setProperty=="function"?x.setProperty("display","none","important"):x.display="none";else{A=F.stateNode;var ge=F.memoizedProps.style,te=ge!=null&&ge.hasOwnProperty("display")?ge.display:null;A.style.display=te==null||typeof te=="boolean"?"":(""+te).trim()}}catch(ze){Pt(F,F.return,ze)}}}else if(t.tag===6){if(n===null){F=t;try{F.stateNode.nodeValue=u?"":F.memoizedProps}catch(ze){Pt(F,F.return,ze)}}}else if(t.tag===18){if(n===null){F=t;try{var re=F.stateNode;u?Pm(re,!0):Pm(F.stateNode,!1)}catch(ze){Pt(F,F.return,ze)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}l&4&&(l=e.updateQueue,l!==null&&(n=l.retryQueue,n!==null&&(l.retryQueue=null,zd(e,n))));break;case 19:fa(t,e),da(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,zd(e,l)));break;case 30:break;case 21:break;default:fa(t,e),da(e)}}function da(e){var t=e.flags;if(t&2){try{for(var n,l=e.return;l!==null;){if(X0(l)){n=l;break}l=l.return}if(n==null)throw Error(v(160));switch(n.tag){case 27:var u=n.stateNode,d=ev(e);Od(e,d,u);break;case 5:var x=n.stateNode;n.flags&32&&(ui(x,""),n.flags&=-33);var A=ev(e);Od(e,A,x);break;case 3:case 4:var F=n.stateNode.containerInfo,q=ev(e);tv(e,q,F);break;default:throw Error(v(161))}}catch(ue){Pt(e,e.return,ue)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function q0(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;q0(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function Eo(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)V0(e,t.alternate,t),t=t.sibling}function Hu(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Bc(4,t,t.return),Hu(t);break;case 1:Hi(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount=="function"&&P0(t,t.return,n),Hu(t);break;case 27:zf(t.stateNode);case 26:case 5:Hi(t,t.return),Hu(t);break;case 22:t.memoizedState===null&&Hu(t);break;case 30:Hu(t);break;default:Hu(t)}e=e.sibling}}function Co(e,t,n){for(n=n&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var l=t.alternate,u=e,d=t,x=d.flags;switch(d.tag){case 0:case 11:case 15:Co(u,d,n),wf(4,d);break;case 1:if(Co(u,d,n),l=d,u=l.stateNode,typeof u.componentDidMount=="function")try{u.componentDidMount()}catch(q){Pt(l,l.return,q)}if(l=d,u=l.updateQueue,u!==null){var A=l.stateNode;try{var F=u.shared.hiddenCallbacks;if(F!==null)for(u.shared.hiddenCallbacks=null,u=0;u<F.length;u++)r(F[u],A)}catch(q){Pt(l,l.return,q)}}n&&x&64&&Y0(d),Sf(d,d.return);break;case 27:I0(d);case 26:case 5:Co(u,d,n),n&&l===null&&x&4&&G0(d),Sf(d,d.return);break;case 12:Co(u,d,n);break;case 31:Co(u,d,n),n&&x&4&&J0(u,d);break;case 13:Co(u,d,n),n&&x&4&&K0(u,d);break;case 22:d.memoizedState===null&&Co(u,d,n),Sf(d,d.return);break;case 30:break;default:Co(u,d,n)}t=t.sibling}}function lv(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&Ci(n))}function av(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Ci(e))}function Vr(e,t,n,l){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)$0(e,t,n,l),t=t.sibling}function $0(e,t,n,l){var u=t.flags;switch(t.tag){case 0:case 11:case 15:Vr(e,t,n,l),u&2048&&wf(9,t);break;case 1:Vr(e,t,n,l);break;case 3:Vr(e,t,n,l),u&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Ci(e)));break;case 12:if(u&2048){Vr(e,t,n,l),e=t.stateNode;try{var d=t.memoizedProps,x=d.id,A=d.onPostCommit;typeof A=="function"&&A(x,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(F){Pt(t,t.return,F)}}else Vr(e,t,n,l);break;case 31:Vr(e,t,n,l);break;case 13:Vr(e,t,n,l);break;case 23:break;case 22:d=t.stateNode,x=t.alternate,t.memoizedState!==null?d._visibility&2?Vr(e,t,n,l):Ef(e,t):d._visibility&2?Vr(e,t,n,l):(d._visibility|=2,ws(e,t,n,l,(t.subtreeFlags&10256)!==0||!1)),u&2048&&lv(x,t);break;case 24:Vr(e,t,n,l),u&2048&&av(t.alternate,t);break;default:Vr(e,t,n,l)}}function ws(e,t,n,l,u){for(u=u&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var d=e,x=t,A=n,F=l,q=x.flags;switch(x.tag){case 0:case 11:case 15:ws(d,x,A,F,u),wf(8,x);break;case 23:break;case 22:var ue=x.stateNode;x.memoizedState!==null?ue._visibility&2?ws(d,x,A,F,u):Ef(d,x):(ue._visibility|=2,ws(d,x,A,F,u)),u&&q&2048&&lv(x.alternate,x);break;case 24:ws(d,x,A,F,u),u&&q&2048&&av(x.alternate,x);break;default:ws(d,x,A,F,u)}t=t.sibling}}function Ef(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,l=t,u=l.flags;switch(l.tag){case 22:Ef(n,l),u&2048&&lv(l.alternate,l);break;case 24:Ef(n,l),u&2048&&av(l.alternate,l);break;default:Ef(n,l)}t=t.sibling}}var Cf=8192;function Ss(e,t,n){if(e.subtreeFlags&Cf)for(e=e.child;e!==null;)em(e,t,n),e=e.sibling}function em(e,t,n){switch(e.tag){case 26:Ss(e,t,n),e.flags&Cf&&e.memoizedState!==null&&bE(n,Zr,e.memoizedState,e.memoizedProps);break;case 5:Ss(e,t,n);break;case 3:case 4:var l=Zr;Zr=Zd(e.stateNode.containerInfo),Ss(e,t,n),Zr=l;break;case 22:e.memoizedState===null&&(l=e.alternate,l!==null&&l.memoizedState!==null?(l=Cf,Cf=16777216,Ss(e,t,n),Cf=l):Ss(e,t,n));break;default:Ss(e,t,n)}}function tm(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Tf(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var l=t[n];ml=l,lm(l,e)}tm(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)nm(e),e=e.sibling}function nm(e){switch(e.tag){case 0:case 11:case 15:Tf(e),e.flags&2048&&Bc(9,e,e.return);break;case 3:Tf(e);break;case 12:Tf(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Dd(e)):Tf(e);break;default:Tf(e)}}function Dd(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var l=t[n];ml=l,lm(l,e)}tm(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Bc(8,t,t.return),Dd(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Dd(t));break;default:Dd(t)}e=e.sibling}}function lm(e,t){for(;ml!==null;){var n=ml;switch(n.tag){case 0:case 11:case 15:Bc(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var l=n.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:Ci(n.memoizedState.cache)}if(l=n.child,l!==null)l.return=n,ml=l;else e:for(n=e;ml!==null;){l=ml;var u=l.sibling,d=l.return;if(Q0(l),l===n){ml=null;break e}if(u!==null){u.return=d,ml=u;break e}ml=d}}}var zS={getCacheForType:function(e){var t=Ct(Xt),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return Ct(Xt).controller.signal}},DS=typeof WeakMap=="function"?WeakMap:Map,zt=0,Kt=null,ht=null,bt=0,Yt=0,Va=null,Hc=!1,Es=!1,rv=!1,To=0,En=0,Uc=0,Uu=0,iv=0,Qa=0,Cs=0,Rf=null,ha=null,ov=!1,kd=0,am=0,Nd=1/0,Ld=null,Fc=null,il=0,Yc=null,Ts=null,Ro=0,cv=0,uv=null,rm=null,Af=0,sv=null;function Wa(){return(zt&2)!==0&&bt!==0?bt&-bt:D.T!==null?bv():Vi()}function im(){if(Qa===0)if((bt&536870912)===0||nt){var e=li;li<<=1,(li&3932160)===0&&(li=262144),Qa=e}else Qa=536870912;return e=X.current,e!==null&&(e.flags|=32),Qa}function va(e,t,n){(e===Kt&&(Yt===2||Yt===9)||e.cancelPendingCommit!==null)&&(Rs(e,0),Pc(e,bt,Qa,!1)),Zi(e,n),((zt&2)===0||e!==Kt)&&(e===Kt&&((zt&2)===0&&(Uu|=n),En===4&&Pc(e,bt,Qa,!1)),Ui(e))}function om(e,t,n){if((zt&6)!==0)throw Error(v(327));var l=!n&&(t&127)===0&&(t&e.expiredLanes)===0||pa(e,t),u=l?LS(e,t):dv(e,t,!0),d=l;do{if(u===0){Es&&!l&&Pc(e,t,0,!1);break}else{if(n=e.current.alternate,d&&!kS(n)){u=dv(e,t,!1),d=!1;continue}if(u===2){if(d=t,e.errorRecoveryDisabledLanes&d)var x=0;else x=e.pendingLanes&-536870913,x=x!==0?x:x&536870912?536870912:0;if(x!==0){t=x;e:{var A=e;u=Rf;var F=A.current.memoizedState.isDehydrated;if(F&&(Rs(A,x).flags|=256),x=dv(A,x,!1),x!==2){if(rv&&!F){A.errorRecoveryDisabledLanes|=d,Uu|=d,u=4;break e}d=ha,ha=u,d!==null&&(ha===null?ha=d:ha.push.apply(ha,d))}u=x}if(d=!1,u!==2)continue}}if(u===1){Rs(e,0),Pc(e,t,0,!0);break}e:{switch(l=e,d=u,d){case 0:case 1:throw Error(v(345));case 4:if((t&4194048)!==t)break;case 6:Pc(l,t,Qa,!Hc);break e;case 2:ha=null;break;case 3:case 5:break;default:throw Error(v(329))}if((t&62914560)===t&&(u=kd+300-cl(),10<u)){if(Pc(l,t,Qa,!Hc),br(l,0,!0)!==0)break e;Ro=t,l.timeoutHandle=Um(cm.bind(null,l,n,ha,Ld,ov,t,Qa,Uu,Cs,Hc,d,"Throttled",-0,0),u);break e}cm(l,n,ha,Ld,ov,t,Qa,Uu,Cs,Hc,d,null,-0,0)}}break}while(!0);Ui(e)}function cm(e,t,n,l,u,d,x,A,F,q,ue,ge,te,re){if(e.timeoutHandle=-1,ge=t.subtreeFlags,ge&8192||(ge&16785408)===16785408){ge={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Ra},em(t,d,ge);var ze=(d&62914560)===d?kd-cl():(d&4194048)===d?am-cl():0;if(ze=mE(ge,ze),ze!==null){Ro=d,e.cancelPendingCommit=ze(bm.bind(null,e,t,d,n,l,u,x,A,F,ue,ge,null,te,re)),Pc(e,d,x,!q);return}}bm(e,t,d,n,l,u,x,A,F)}function kS(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var l=0;l<n.length;l++){var u=n[l],d=u.getSnapshot;u=u.value;try{if(!An(d(),u))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Pc(e,t,n,l){t&=~iv,t&=~Uu,e.suspendedLanes|=t,e.pingedLanes&=~t,l&&(e.warmLanes|=t),l=e.expirationTimes;for(var u=t;0<u;){var d=31-Bn(u),x=1<<d;l[d]=-1,u&=~x}n!==0&&ai(e,n,t)}function Bd(){return(zt&6)===0?(_f(0),!1):!0}function fv(){if(ht!==null){if(Yt===0)var e=ht.return;else e=ht,Ot=La=null,Pr(e),Rl=null,Br=0,e=ht;for(;e!==null;)F0(e.alternate,e),e=e.return;ht=null}}function Rs(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,$S(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),Ro=0,fv(),Kt=e,ht=n=en(e.current,null),bt=t,Yt=0,Va=null,Hc=!1,Es=pa(e,t),rv=!1,Cs=Qa=iv=Uu=Uc=En=0,ha=Rf=null,ov=!1,(t&8)!==0&&(t|=t&32);var l=e.entangledLanes;if(l!==0)for(e=e.entanglements,l&=t;0<l;){var u=31-Bn(l),d=1<<u;t|=e[u],l&=~d}return To=t,Je(),n}function um(e,t){Me=null,D.H=Eu,t===Ua||t===Fa?(t=vl(),Yt=3):t===cr?(t=vl(),Yt=4):Yt=t===gf?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Va=t,ht===null&&(En=1,Ru(e,Yn(t,e.current)))}function sm(){var e=X.current;return e===null?!0:(bt&4194048)===bt?B===null:(bt&62914560)===bt||(bt&536870912)!==0?e===B:!1}function fm(){var e=D.H;return D.H=Eu,e===null?Eu:e}function dm(){var e=D.A;return D.A=zS,e}function Hd(){En=4,Hc||(bt&4194048)!==bt&&X.current!==null||(Es=!0),(Uc&134217727)===0&&(Uu&134217727)===0||Kt===null||Pc(Kt,bt,Qa,!1)}function dv(e,t,n){var l=zt;zt|=2;var u=fm(),d=dm();(Kt!==e||bt!==t)&&(Ld=null,Rs(e,t)),t=!1;var x=En;e:do try{if(Yt!==0&&ht!==null){var A=ht,F=Va;switch(Yt){case 8:fv(),x=6;break e;case 3:case 2:case 9:case 6:X.current===null&&(t=!0);var q=Yt;if(Yt=0,Va=null,As(e,A,F,q),n&&Es){x=0;break e}break;default:q=Yt,Yt=0,Va=null,As(e,A,F,q)}}NS(),x=En;break}catch(ue){um(e,ue)}while(!0);return t&&e.shellSuspendCounter++,Ot=La=null,zt=l,D.H=u,D.A=d,ht===null&&(Kt=null,bt=0,Je()),x}function NS(){for(;ht!==null;)hm(ht)}function LS(e,t){var n=zt;zt|=2;var l=fm(),u=dm();Kt!==e||bt!==t?(Ld=null,Nd=cl()+500,Rs(e,t)):Es=pa(e,t);e:do try{if(Yt!==0&&ht!==null){t=ht;var d=Va;t:switch(Yt){case 1:Yt=0,Va=null,As(e,t,d,1);break;case 2:case 9:if(so(d)){Yt=0,Va=null,vm(t);break}t=function(){Yt!==2&&Yt!==9||Kt!==e||(Yt=7),Ui(e)},d.then(t,t);break e;case 3:Yt=7;break e;case 4:Yt=5;break e;case 7:so(d)?(Yt=0,Va=null,vm(t)):(Yt=0,Va=null,As(e,t,d,7));break;case 5:var x=null;switch(ht.tag){case 26:x=ht.memoizedState;case 5:case 27:var A=ht;if(x?$m(x):A.stateNode.complete){Yt=0,Va=null;var F=A.sibling;if(F!==null)ht=F;else{var q=A.return;q!==null?(ht=q,Ud(q)):ht=null}break t}}Yt=0,Va=null,As(e,t,d,5);break;case 6:Yt=0,Va=null,As(e,t,d,6);break;case 8:fv(),En=6;break e;default:throw Error(v(462))}}BS();break}catch(ue){um(e,ue)}while(!0);return Ot=La=null,D.H=l,D.A=u,zt=n,ht!==null?0:(Kt=null,bt=0,Je(),En)}function BS(){for(;ht!==null&&!xl();)hm(ht)}function hm(e){var t=H0(e.alternate,e,To);e.memoizedProps=e.pendingProps,t===null?Ud(e):ht=t}function vm(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Bi(n,t,t.pendingProps,t.type,void 0,bt);break;case 11:t=Bi(n,t,t.pendingProps,t.type.render,t.ref,bt);break;case 5:Pr(t);default:F0(n,t),t=ht=wt(t,To),t=H0(n,t,To)}e.memoizedProps=e.pendingProps,t===null?Ud(e):ht=t}function As(e,t,n,l){Ot=La=null,Pr(t),Rl=null,Br=0;var u=t.return;try{if(_u(e,u,t,n,bt)){En=1,Ru(e,Yn(n,e.current)),ht=null;return}}catch(d){if(u!==null)throw ht=u,d;En=1,Ru(e,Yn(n,e.current)),ht=null;return}t.flags&32768?(nt||l===1?e=!0:Es||(bt&536870912)!==0?e=!1:(Hc=e=!0,(l===2||l===9||l===3||l===6)&&(l=X.current,l!==null&&l.tag===13&&(l.flags|=16384))),gm(t,e)):Ud(t)}function Ud(e){var t=e;do{if((t.flags&32768)!==0){gm(t,Hc);return}e=t.return;var n=AS(t.alternate,t,To);if(n!==null){ht=n;return}if(t=t.sibling,t!==null){ht=t;return}ht=t=e}while(t!==null);En===0&&(En=5)}function gm(e,t){do{var n=_S(e.alternate,e);if(n!==null){n.flags&=32767,ht=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){ht=e;return}ht=e=n}while(e!==null);En=6,ht=null}function bm(e,t,n,l,u,d,x,A,F){e.cancelPendingCommit=null;do Fd();while(il!==0);if((zt&6)!==0)throw Error(v(327));if(t!==null){if(t===e.current)throw Error(v(177));if(d=t.lanes|t.childLanes,d|=je,$u(e,n,d,x,A,F),e===Kt&&(ht=Kt=null,bt=0),Ts=t,Yc=e,Ro=n,cv=d,uv=u,rm=l,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,YS(ti,function(){return wm(),null})):(e.callbackNode=null,e.callbackPriority=0),l=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||l){l=D.T,D.T=null,u=J.p,J.p=2,x=zt,zt|=4;try{MS(e,t,n)}finally{zt=x,J.p=u,D.T=l}}il=1,mm(),ym(),pm()}}function mm(){if(il===1){il=0;var e=Yc,t=Ts,n=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||n){n=D.T,D.T=null;var l=J.p;J.p=2;var u=zt;zt|=4;try{j0(t,e);var d=Cv,x=sc(e.containerInfo),A=d.focusedElem,F=d.selectionRange;if(x!==A&&A&&A.ownerDocument&&ir(A.ownerDocument.documentElement,A)){if(F!==null&&fc(A)){var q=F.start,ue=F.end;if(ue===void 0&&(ue=q),"selectionStart"in A)A.selectionStart=q,A.selectionEnd=Math.min(ue,A.value.length);else{var ge=A.ownerDocument||document,te=ge&&ge.defaultView||window;if(te.getSelection){var re=te.getSelection(),ze=A.textContent.length,Ie=Math.min(F.start,ze),Zt=F.end===void 0?Ie:Math.min(F.end,ze);!re.extend&&Ie>Zt&&(x=Zt,Zt=Ie,Ie=x);var Q=rr(A,Ie),G=rr(A,Zt);if(Q&&G&&(re.rangeCount!==1||re.anchorNode!==Q.node||re.anchorOffset!==Q.offset||re.focusNode!==G.node||re.focusOffset!==G.offset)){var j=ge.createRange();j.setStart(Q.node,Q.offset),re.removeAllRanges(),Ie>Zt?(re.addRange(j),re.extend(G.node,G.offset)):(j.setEnd(G.node,G.offset),re.addRange(j))}}}}for(ge=[],re=A;re=re.parentNode;)re.nodeType===1&&ge.push({element:re,left:re.scrollLeft,top:re.scrollTop});for(typeof A.focus=="function"&&A.focus(),A=0;A<ge.length;A++){var fe=ge[A];fe.element.scrollLeft=fe.left,fe.element.scrollTop=fe.top}}jd=!!Ev,Cv=Ev=null}finally{zt=u,J.p=l,D.T=n}}e.current=t,il=2}}function ym(){if(il===2){il=0;var e=Yc,t=Ts,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=D.T,D.T=null;var l=J.p;J.p=2;var u=zt;zt|=4;try{V0(e,t.alternate,t)}finally{zt=u,J.p=l,D.T=n}}il=3}}function pm(){if(il===4||il===3){il=0,gr();var e=Yc,t=Ts,n=Ro,l=rm;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?il=5:(il=0,Ts=Yc=null,xm(e,e.pendingLanes));var u=e.pendingLanes;if(u===0&&(Fc=null),Ht(n),t=t.stateNode,gn&&typeof gn.onCommitFiberRoot=="function")try{gn.onCommitFiberRoot(ja,t,void 0,(t.current.flags&128)===128)}catch{}if(l!==null){t=D.T,u=J.p,J.p=2,D.T=null;try{for(var d=e.onRecoverableError,x=0;x<l.length;x++){var A=l[x];d(A.value,{componentStack:A.stack})}}finally{D.T=t,J.p=u}}(Ro&3)!==0&&Fd(),Ui(e),u=e.pendingLanes,(n&261930)!==0&&(u&42)!==0?e===sv?Af++:(Af=0,sv=e):Af=0,_f(0)}}function xm(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,Ci(t)))}function Fd(){return mm(),ym(),pm(),wm()}function wm(){if(il!==5)return!1;var e=Yc,t=cv;cv=0;var n=Ht(Ro),l=D.T,u=J.p;try{J.p=32>n?32:n,D.T=null,n=uv,uv=null;var d=Yc,x=Ro;if(il=0,Ts=Yc=null,Ro=0,(zt&6)!==0)throw Error(v(331));var A=zt;if(zt|=4,nm(d.current),$0(d,d.current,x,n),zt=A,_f(0,!1),gn&&typeof gn.onPostCommitFiberRoot=="function")try{gn.onPostCommitFiberRoot(ja,d)}catch{}return!0}finally{J.p=u,D.T=l,xm(e,t)}}function Sm(e,t,n){t=Yn(n,t),t=ys(e.stateNode,t,2),e=Xn(e,t,2),e!==null&&(Zi(e,2),Ui(e))}function Pt(e,t,n){if(e.tag===3)Sm(e,e,n);else for(;t!==null;){if(t.tag===3){Sm(t,e,n);break}else if(t.tag===1){var l=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(Fc===null||!Fc.has(l))){e=Yn(n,e),n=Au(2),l=Xn(t,n,2),l!==null&&(ps(n,l,t,e),Zi(l,2),Ui(l));break}}t=t.return}}function hv(e,t,n){var l=e.pingCache;if(l===null){l=e.pingCache=new DS;var u=new Set;l.set(t,u)}else u=l.get(t),u===void 0&&(u=new Set,l.set(t,u));u.has(n)||(rv=!0,u.add(n),e=HS.bind(null,e,t,n),t.then(e,e))}function HS(e,t,n){var l=e.pingCache;l!==null&&l.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,Kt===e&&(bt&n)===n&&(En===4||En===3&&(bt&62914560)===bt&&300>cl()-kd?(zt&2)===0&&Rs(e,0):iv|=n,Cs===bt&&(Cs=0)),Ui(e)}function Em(e,t){t===0&&(t=ru()),e=xt(e,t),e!==null&&(Zi(e,t),Ui(e))}function US(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Em(e,n)}function FS(e,t){var n=0;switch(e.tag){case 31:case 13:var l=e.stateNode,u=e.memoizedState;u!==null&&(n=u.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(v(314))}l!==null&&l.delete(t),Em(e,n)}function YS(e,t){return Yo(e,t)}var Yd=null,_s=null,vv=!1,Pd=!1,gv=!1,Gc=0;function Ui(e){e!==_s&&e.next===null&&(_s===null?Yd=_s=e:_s=_s.next=e),Pd=!0,vv||(vv=!0,GS())}function _f(e,t){if(!gv&&Pd){gv=!0;do for(var n=!1,l=Yd;l!==null;){if(e!==0){var u=l.pendingLanes;if(u===0)var d=0;else{var x=l.suspendedLanes,A=l.pingedLanes;d=(1<<31-Bn(42|e)+1)-1,d&=u&~(x&~A),d=d&201326741?d&201326741|1:d?d|2:0}d!==0&&(n=!0,Am(l,d))}else d=bt,d=br(l,l===Kt?d:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(d&3)===0||pa(l,d)||(n=!0,Am(l,d));l=l.next}while(n);gv=!1}}function PS(){Cm()}function Cm(){Pd=vv=!1;var e=0;Gc!==0&&qS()&&(e=Gc);for(var t=cl(),n=null,l=Yd;l!==null;){var u=l.next,d=Tm(l,t);d===0?(l.next=null,n===null?Yd=u:n.next=u,u===null&&(_s=n)):(n=l,(e!==0||(d&3)!==0)&&(Pd=!0)),l=u}il!==0&&il!==5||_f(e),Gc!==0&&(Gc=0)}function Tm(e,t){for(var n=e.suspendedLanes,l=e.pingedLanes,u=e.expirationTimes,d=e.pendingLanes&-62914561;0<d;){var x=31-Bn(d),A=1<<x,F=u[x];F===-1?((A&n)===0||(A&l)!==0)&&(u[x]=Pl(A,t)):F<=t&&(e.expiredLanes|=A),d&=~A}if(t=Kt,n=bt,n=br(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l=e.callbackNode,n===0||e===t&&(Yt===2||Yt===9)||e.cancelPendingCommit!==null)return l!==null&&l!==null&&pl(l),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||pa(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(l!==null&&pl(l),Ht(n)){case 2:case 8:n=qu;break;case 32:n=ti;break;case 268435456:n=Po;break;default:n=ti}return l=Rm.bind(null,e),n=Yo(n,l),e.callbackPriority=t,e.callbackNode=n,t}return l!==null&&l!==null&&pl(l),e.callbackPriority=2,e.callbackNode=null,2}function Rm(e,t){if(il!==0&&il!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Fd()&&e.callbackNode!==n)return null;var l=bt;return l=br(e,e===Kt?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l===0?null:(om(e,l,t),Tm(e,cl()),e.callbackNode!=null&&e.callbackNode===n?Rm.bind(null,e):null)}function Am(e,t){if(Fd())return null;om(e,t,!0)}function GS(){eE(function(){(zt&6)!==0?Yo(ul,PS):Cm()})}function bv(){if(Gc===0){var e=Tl;e===0&&(e=rn,rn<<=1,(rn&261888)===0&&(rn=256)),Gc=e}return Gc}function _m(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Hn(""+e)}function Mm(e,t){var n=t.ownerDocument.createElement("input");return n.name=t.name,n.value=t.value,e.id&&n.setAttribute("form",e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function XS(e,t,n,l,u){if(t==="submit"&&n&&n.stateNode===u){var d=_m((u[Wn]||null).action),x=l.submitter;x&&(t=(t=x[Wn]||null)?_m(t.formAction):x.getAttribute("formAction"),t!==null&&(d=t,x=null));var A=new $i("action","action",null,l,u);e.push({event:A,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(Gc!==0){var F=x?Mm(u,x):new FormData(u);_c(n,{pending:!0,data:F,method:u.method,action:d},null,F)}}else typeof d=="function"&&(A.preventDefault(),F=x?Mm(u,x):new FormData(u),_c(n,{pending:!0,data:F,method:u.method,action:d},d,F))},currentTarget:u}]})}}for(var mv=0;mv<he.length;mv++){var yv=he[mv],IS=yv.toLowerCase(),ZS=yv[0].toUpperCase()+yv.slice(1);ie(IS,"on"+ZS)}ie(g,"onAnimationEnd"),ie(m,"onAnimationIteration"),ie(w,"onAnimationStart"),ie("dblclick","onDoubleClick"),ie("focusin","onFocus"),ie("focusout","onBlur"),ie(M,"onTransitionRun"),ie(N,"onTransitionStart"),ie(ne,"onTransitionCancel"),ie(P,"onTransitionEnd"),xa("onMouseEnter",["mouseout","mouseover"]),xa("onMouseLeave",["mouseout","mouseover"]),xa("onPointerEnter",["pointerout","pointerover"]),xa("onPointerLeave",["pointerout","pointerover"]),Ut("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),Ut("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),Ut("onBeforeInput",["compositionend","keypress","textInput","paste"]),Ut("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),Ut("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),Ut("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Mf="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),VS=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Mf));function Om(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var l=e[n],u=l.event;l=l.listeners;e:{var d=void 0;if(t)for(var x=l.length-1;0<=x;x--){var A=l[x],F=A.instance,q=A.currentTarget;if(A=A.listener,F!==d&&u.isPropagationStopped())break e;d=A,u.currentTarget=q;try{d(u)}catch(ue){Ce(ue)}u.currentTarget=null,d=F}else for(x=0;x<l.length;x++){if(A=l[x],F=A.instance,q=A.currentTarget,A=A.listener,F!==d&&u.isPropagationStopped())break e;d=A,u.currentTarget=q;try{d(u)}catch(ue){Ce(ue)}u.currentTarget=null,d=F}}}}function vt(e,t){var n=t[Io];n===void 0&&(n=t[Io]=new Set);var l=e+"__bubble";n.has(l)||(zm(t,e,2,!1),n.add(l))}function pv(e,t,n){var l=0;t&&(l|=4),zm(n,e,l,t)}var Gd="_reactListening"+Math.random().toString(36).slice(2);function xv(e){if(!e[Gd]){e[Gd]=!0,ts.forEach(function(n){n!=="selectionchange"&&(VS.has(n)||pv(n,!1,e),pv(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Gd]||(t[Gd]=!0,pv("selectionchange",!1,t))}}function zm(e,t,n,l){switch(iy(t)){case 2:var u=xE;break;case 8:u=wE;break;default:u=Lv}n=u.bind(null,t,n,e),u=void 0,!Et||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(u=!0),l?u!==void 0?e.addEventListener(t,n,{capture:!0,passive:u}):e.addEventListener(t,n,!0):u!==void 0?e.addEventListener(t,n,{passive:u}):e.addEventListener(t,n,!1)}function wv(e,t,n,l,u){var d=l;if((t&1)===0&&(t&2)===0&&l!==null)e:for(;;){if(l===null)return;var x=l.tag;if(x===3||x===4){var A=l.stateNode.containerInfo;if(A===u)break;if(x===4)for(x=l.return;x!==null;){var F=x.tag;if((F===3||F===4)&&x.stateNode.containerInfo===u)return;x=x.return}for(;A!==null;){if(x=yn(A),x===null)return;if(F=x.tag,F===5||F===6||F===26||F===27){l=d=x;continue e}A=A.parentNode}}l=l.return}Qo(function(){var q=d,ue=fi(n),ge=[];e:{var te=le.get(e);if(te!==void 0){var re=$i,ze=e;switch(e){case"keypress":if(Tr(n)===0)break e;case"keydown":case"keyup":re=Ks;break;case"focusin":ze="focus",re=to;break;case"focusout":ze="blur",re=to;break;case"beforeblur":case"afterblur":re=to;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":re=ls;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":re=Vs;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":re=yi;break;case g:case m:case w:re=Ws;break;case P:re=$o;break;case"scroll":case"scrollend":re=vi;break;case"wheel":re=_r;break;case"copy":case"cut":case"paste":re=Jo;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":re=os;break;case"toggle":case"beforetoggle":re=no}var Ie=(t&4)!==0,Zt=!Ie&&(e==="scroll"||e==="scrollend"),Q=Ie?te!==null?te+"Capture":null:te;Ie=[];for(var G=q,j;G!==null;){var fe=G;if(j=fe.stateNode,fe=fe.tag,fe!==5&&fe!==26&&fe!==27||j===null||Q===null||(fe=Er(G,Q),fe!=null&&Ie.push(Of(G,fe,j))),Zt)break;G=G.return}0<Ie.length&&(te=new re(te,ze,null,n,ue),ge.push({event:te,listeners:Ie}))}}if((t&7)===0){e:{if(te=e==="mouseover"||e==="pointerover",re=e==="mouseout"||e==="pointerout",te&&n!==si&&(ze=n.relatedTarget||n.fromElement)&&(yn(ze)||ze[qa]))break e;if((re||te)&&(te=ue.window===ue?ue:(te=ue.ownerDocument)?te.defaultView||te.parentWindow:window,re?(ze=n.relatedTarget||n.toElement,re=q,ze=ze?yn(ze):null,ze!==null&&(Zt=S(ze),Ie=ze.tag,ze!==Zt||Ie!==5&&Ie!==27&&Ie!==6)&&(ze=null)):(re=null,ze=q),re!==ze)){if(Ie=ls,fe="onMouseLeave",Q="onMouseEnter",G="mouse",(e==="pointerout"||e==="pointerover")&&(Ie=os,fe="onPointerLeave",Q="onPointerEnter",G="pointer"),Zt=re==null?te:yr(re),j=ze==null?te:yr(ze),te=new Ie(fe,G+"leave",re,n,ue),te.target=Zt,te.relatedTarget=j,fe=null,yn(ue)===q&&(Ie=new Ie(Q,G+"enter",ze,n,ue),Ie.target=j,Ie.relatedTarget=Zt,fe=Ie),Zt=fe,re&&ze)t:{for(Ie=QS,Q=re,G=ze,j=0,fe=Q;fe;fe=Ie(fe))j++;fe=0;for(var Ye=G;Ye;Ye=Ie(Ye))fe++;for(;0<j-fe;)Q=Ie(Q),j--;for(;0<fe-j;)G=Ie(G),fe--;for(;j--;){if(Q===G||G!==null&&Q===G.alternate){Ie=Q;break t}Q=Ie(Q),G=Ie(G)}Ie=null}else Ie=null;re!==null&&Dm(ge,te,re,Ie,!1),ze!==null&&Zt!==null&&Dm(ge,Zt,ze,Ie,!0)}}e:{if(te=q?yr(q):window,re=te.nodeName&&te.nodeName.toLowerCase(),re==="select"||re==="input"&&te.type==="file")var Rt=ao;else if(ac(te))if(hn)Rt=us;else{Rt=ro;var Ne=uc}else re=te.nodeName,!re||re.toLowerCase()!=="input"||te.type!=="checkbox"&&te.type!=="radio"?q&&uu(q.elementType)&&(Rt=ao):Rt=ar;if(Rt&&(Rt=Rt(e,q))){lo(ge,Rt,n,ue);break e}Ne&&Ne(e,te,q),e==="focusout"&&q&&te.type==="number"&&q.memoizedProps.value!=null&&Ki(te,"number",te.value)}switch(Ne=q?yr(q):window,e){case"focusin":(ac(Ne)||Ne.contentEditable==="true")&&(aa=Ne,xi=q,Zl=null);break;case"focusout":Zl=xi=aa=null;break;case"mousedown":wi=!0;break;case"contextmenu":case"mouseup":case"dragend":wi=!1,vu(ge,n,ue);break;case"selectionchange":if(kr)break;case"keydown":case"keyup":vu(ge,n,ue)}var rt;if(pn)e:{switch(e){case"compositionstart":var mt="onCompositionStart";break e;case"compositionend":mt="onCompositionEnd";break e;case"compositionupdate":mt="onCompositionUpdate";break e}mt=void 0}else Mr?du(e,n)&&(mt="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(mt="onCompositionStart");mt&&(Xl&&n.locale!=="ko"&&(Mr||mt!=="onCompositionStart"?mt==="onCompositionEnd"&&Mr&&(rt=hi()):(Gl=ue,Cr="value"in Gl?Gl.value:Gl.textContent,Mr=!0)),Ne=Xd(q,mt),0<Ne.length&&(mt=new Ko(mt,e,null,n,ue),ge.push({event:mt,listeners:Ne}),rt?mt.data=rt:(rt=tc(n),rt!==null&&(mt.data=rt)))),(rt=Dt?nc(e,n):lc(e,n))&&(mt=Xd(q,"onBeforeInput"),0<mt.length&&(Ne=new Ko("onBeforeInput","beforeinput",null,n,ue),ge.push({event:Ne,listeners:mt}),Ne.data=rt)),XS(ge,e,q,n,ue)}Om(ge,t)})}function Of(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Xd(e,t){for(var n=t+"Capture",l=[];e!==null;){var u=e,d=u.stateNode;if(u=u.tag,u!==5&&u!==26&&u!==27||d===null||(u=Er(e,n),u!=null&&l.unshift(Of(e,u,d)),u=Er(e,t),u!=null&&l.push(Of(e,u,d))),e.tag===3)return l;e=e.return}return[]}function QS(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Dm(e,t,n,l,u){for(var d=t._reactName,x=[];n!==null&&n!==l;){var A=n,F=A.alternate,q=A.stateNode;if(A=A.tag,F!==null&&F===l)break;A!==5&&A!==26&&A!==27||q===null||(F=q,u?(q=Er(n,d),q!=null&&x.unshift(Of(n,q,F))):u||(q=Er(n,d),q!=null&&x.push(Of(n,q,F)))),n=n.return}x.length!==0&&e.push({event:t,listeners:x})}var WS=/\n?/g,JS=/\u0000|\uFFFD/g;function km(e){return(typeof e=="string"?e:""+e).replace(WS,`
`).replace(JS,"")}function Nm(e,t){return t=km(t),km(e)===t}function It(e,t,n,l,u,d){switch(n){case"children":typeof l=="string"?t==="body"||t==="textarea"&&l===""||ui(e,l):(typeof l=="number"||typeof l=="bigint")&&t!=="body"&&ui(e,""+l);break;case"className":Sa(e,"class",l);break;case"tabIndex":Sa(e,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":Sa(e,n,l);break;case"style":ns(e,l,d);break;case"data":if(t!=="object"){Sa(e,"data",l);break}case"src":case"href":if(l===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(n);break}l=Hn(""+l),e.setAttribute(n,l);break;case"action":case"formAction":if(typeof l=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof d=="function"&&(n==="formAction"?(t!=="input"&&It(e,t,"name",u.name,u,null),It(e,t,"formEncType",u.formEncType,u,null),It(e,t,"formMethod",u.formMethod,u,null),It(e,t,"formTarget",u.formTarget,u,null)):(It(e,t,"encType",u.encType,u,null),It(e,t,"method",u.method,u,null),It(e,t,"target",u.target,u,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(n);break}l=Hn(""+l),e.setAttribute(n,l);break;case"onClick":l!=null&&(e.onclick=Ra);break;case"onScroll":l!=null&&vt("scroll",e);break;case"onScrollEnd":l!=null&&vt("scrollend",e);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(v(61));if(n=l.__html,n!=null){if(u.children!=null)throw Error(v(60));e.innerHTML=n}}break;case"multiple":e.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":e.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){e.removeAttribute("xlink:href");break}n=Hn(""+l),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,""+l):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":l===!0?e.setAttribute(n,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,l):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?e.setAttribute(n,l):e.removeAttribute(n);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?e.removeAttribute(n):e.setAttribute(n,l);break;case"popover":vt("beforetoggle",e),vt("toggle",e),Vo(e,"popover",l);break;case"xlinkActuate":Ol(e,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":Ol(e,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":Ol(e,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":Ol(e,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":Ol(e,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":Ol(e,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":Ol(e,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":Ol(e,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":Ol(e,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":Vo(e,"is",l);break;case"innerText":case"textContent":break;default:(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(n=Is.get(n)||n,Vo(e,n,l))}}function Sv(e,t,n,l,u,d){switch(n){case"style":ns(e,l,d);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(v(61));if(n=l.__html,n!=null){if(u.children!=null)throw Error(v(60));e.innerHTML=n}}break;case"children":typeof l=="string"?ui(e,l):(typeof l=="number"||typeof l=="bigint")&&ui(e,""+l);break;case"onScroll":l!=null&&vt("scroll",e);break;case"onScrollEnd":l!=null&&vt("scrollend",e);break;case"onClick":l!=null&&(e.onclick=Ra);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!oi.hasOwnProperty(n))e:{if(n[0]==="o"&&n[1]==="n"&&(u=n.endsWith("Capture"),t=n.slice(2,u?n.length-7:void 0),d=e[Wn]||null,d=d!=null?d[n]:null,typeof d=="function"&&e.removeEventListener(t,d,u),typeof l=="function")){typeof d!="function"&&d!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,l,u);break e}n in e?e[n]=l:l===!0?e.setAttribute(n,""):Vo(e,n,l)}}}function _l(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":vt("error",e),vt("load",e);var l=!1,u=!1,d;for(d in n)if(n.hasOwnProperty(d)){var x=n[d];if(x!=null)switch(d){case"src":l=!0;break;case"srcSet":u=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(v(137,t));default:It(e,t,d,x,n,null)}}u&&It(e,t,"srcSet",n.srcSet,n,null),l&&It(e,t,"src",n.src,n,null);return;case"input":vt("invalid",e);var A=d=x=u=null,F=null,q=null;for(l in n)if(n.hasOwnProperty(l)){var ue=n[l];if(ue!=null)switch(l){case"name":u=ue;break;case"type":x=ue;break;case"checked":F=ue;break;case"defaultChecked":q=ue;break;case"value":d=ue;break;case"defaultValue":A=ue;break;case"children":case"dangerouslySetInnerHTML":if(ue!=null)throw Error(v(137,t));break;default:It(e,t,l,ue,n,null)}}Ca(e,d,A,F,q,x,u,!1);return;case"select":vt("invalid",e),l=x=d=null;for(u in n)if(n.hasOwnProperty(u)&&(A=n[u],A!=null))switch(u){case"value":d=A;break;case"defaultValue":x=A;break;case"multiple":l=A;default:It(e,t,u,A,n,null)}t=d,n=x,e.multiple=!!l,t!=null?$a(e,!!l,t,!1):n!=null&&$a(e,!!l,n,!0);return;case"textarea":vt("invalid",e),d=u=l=null;for(x in n)if(n.hasOwnProperty(x)&&(A=n[x],A!=null))switch(x){case"value":l=A;break;case"defaultValue":u=A;break;case"children":d=A;break;case"dangerouslySetInnerHTML":if(A!=null)throw Error(v(91));break;default:It(e,t,x,A,n,null)}cu(e,l,u,d);return;case"option":for(F in n)if(n.hasOwnProperty(F)&&(l=n[F],l!=null))switch(F){case"selected":e.selected=l&&typeof l!="function"&&typeof l!="symbol";break;default:It(e,t,F,l,n,null)}return;case"dialog":vt("beforetoggle",e),vt("toggle",e),vt("cancel",e),vt("close",e);break;case"iframe":case"object":vt("load",e);break;case"video":case"audio":for(l=0;l<Mf.length;l++)vt(Mf[l],e);break;case"image":vt("error",e),vt("load",e);break;case"details":vt("toggle",e);break;case"embed":case"source":case"link":vt("error",e),vt("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(q in n)if(n.hasOwnProperty(q)&&(l=n[q],l!=null))switch(q){case"children":case"dangerouslySetInnerHTML":throw Error(v(137,t));default:It(e,t,q,l,n,null)}return;default:if(uu(t)){for(ue in n)n.hasOwnProperty(ue)&&(l=n[ue],l!==void 0&&Sv(e,t,ue,l,n,void 0));return}}for(A in n)n.hasOwnProperty(A)&&(l=n[A],l!=null&&It(e,t,A,l,n,null))}function KS(e,t,n,l){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var u=null,d=null,x=null,A=null,F=null,q=null,ue=null;for(re in n){var ge=n[re];if(n.hasOwnProperty(re)&&ge!=null)switch(re){case"checked":break;case"value":break;case"defaultValue":F=ge;default:l.hasOwnProperty(re)||It(e,t,re,null,l,ge)}}for(var te in l){var re=l[te];if(ge=n[te],l.hasOwnProperty(te)&&(re!=null||ge!=null))switch(te){case"type":d=re;break;case"name":u=re;break;case"checked":q=re;break;case"defaultChecked":ue=re;break;case"value":x=re;break;case"defaultValue":A=re;break;case"children":case"dangerouslySetInnerHTML":if(re!=null)throw Error(v(137,t));break;default:re!==ge&&It(e,t,te,re,l,ge)}}Ji(e,x,A,F,q,ue,d,u);return;case"select":re=x=A=te=null;for(d in n)if(F=n[d],n.hasOwnProperty(d)&&F!=null)switch(d){case"value":break;case"multiple":re=F;default:l.hasOwnProperty(d)||It(e,t,d,null,l,F)}for(u in l)if(d=l[u],F=n[u],l.hasOwnProperty(u)&&(d!=null||F!=null))switch(u){case"value":te=d;break;case"defaultValue":A=d;break;case"multiple":x=d;default:d!==F&&It(e,t,u,d,l,F)}t=A,n=x,l=re,te!=null?$a(e,!!n,te,!1):!!l!=!!n&&(t!=null?$a(e,!!n,t,!0):$a(e,!!n,n?[]:"",!1));return;case"textarea":re=te=null;for(A in n)if(u=n[A],n.hasOwnProperty(A)&&u!=null&&!l.hasOwnProperty(A))switch(A){case"value":break;case"children":break;default:It(e,t,A,null,l,u)}for(x in l)if(u=l[x],d=n[x],l.hasOwnProperty(x)&&(u!=null||d!=null))switch(x){case"value":te=u;break;case"defaultValue":re=u;break;case"children":break;case"dangerouslySetInnerHTML":if(u!=null)throw Error(v(91));break;default:u!==d&&It(e,t,x,u,l,d)}Ta(e,te,re);return;case"option":for(var ze in n)if(te=n[ze],n.hasOwnProperty(ze)&&te!=null&&!l.hasOwnProperty(ze))switch(ze){case"selected":e.selected=!1;break;default:It(e,t,ze,null,l,te)}for(F in l)if(te=l[F],re=n[F],l.hasOwnProperty(F)&&te!==re&&(te!=null||re!=null))switch(F){case"selected":e.selected=te&&typeof te!="function"&&typeof te!="symbol";break;default:It(e,t,F,te,l,re)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var Ie in n)te=n[Ie],n.hasOwnProperty(Ie)&&te!=null&&!l.hasOwnProperty(Ie)&&It(e,t,Ie,null,l,te);for(q in l)if(te=l[q],re=n[q],l.hasOwnProperty(q)&&te!==re&&(te!=null||re!=null))switch(q){case"children":case"dangerouslySetInnerHTML":if(te!=null)throw Error(v(137,t));break;default:It(e,t,q,te,l,re)}return;default:if(uu(t)){for(var Zt in n)te=n[Zt],n.hasOwnProperty(Zt)&&te!==void 0&&!l.hasOwnProperty(Zt)&&Sv(e,t,Zt,void 0,l,te);for(ue in l)te=l[ue],re=n[ue],!l.hasOwnProperty(ue)||te===re||te===void 0&&re===void 0||Sv(e,t,ue,te,l,re);return}}for(var Q in n)te=n[Q],n.hasOwnProperty(Q)&&te!=null&&!l.hasOwnProperty(Q)&&It(e,t,Q,null,l,te);for(ge in l)te=l[ge],re=n[ge],!l.hasOwnProperty(ge)||te===re||te==null&&re==null||It(e,t,ge,te,l,re)}function Lm(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function jS(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),l=0;l<n.length;l++){var u=n[l],d=u.transferSize,x=u.initiatorType,A=u.duration;if(d&&A&&Lm(x)){for(x=0,A=u.responseEnd,l+=1;l<n.length;l++){var F=n[l],q=F.startTime;if(q>A)break;var ue=F.transferSize,ge=F.initiatorType;ue&&Lm(ge)&&(F=F.responseEnd,x+=ue*(F<A?1:(A-q)/(F-q)))}if(--l,t+=8*(d+x)/(u.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Ev=null,Cv=null;function Id(e){return e.nodeType===9?e:e.ownerDocument}function Bm(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Hm(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function Tv(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Rv=null;function qS(){var e=window.event;return e&&e.type==="popstate"?e===Rv?!1:(Rv=e,!0):(Rv=null,!1)}var Um=typeof setTimeout=="function"?setTimeout:void 0,$S=typeof clearTimeout=="function"?clearTimeout:void 0,Fm=typeof Promise=="function"?Promise:void 0,eE=typeof queueMicrotask=="function"?queueMicrotask:typeof Fm<"u"?function(e){return Fm.resolve(null).then(e).catch(tE)}:Um;function tE(e){setTimeout(function(){throw e})}function Xc(e){return e==="head"}function Ym(e,t){var n=t,l=0;do{var u=n.nextSibling;if(e.removeChild(n),u&&u.nodeType===8)if(n=u.data,n==="/$"||n==="/&"){if(l===0){e.removeChild(u),Ds(t);return}l--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")l++;else if(n==="html")zf(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,zf(n);for(var d=n.firstChild;d;){var x=d.nextSibling,A=d.nodeName;d[St]||A==="SCRIPT"||A==="STYLE"||A==="LINK"&&d.rel.toLowerCase()==="stylesheet"||n.removeChild(d),d=x}}else n==="body"&&zf(e.ownerDocument.body);n=u}while(n);Ds(t)}function Pm(e,t){var n=e;e=0;do{var l=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=l}while(n)}function Av(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":Av(n),mr(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function nE(e,t,n,l){for(;e.nodeType===1;){var u=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!l&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(l){if(!e[St])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(d=e.getAttribute("rel"),d==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(d!==u.rel||e.getAttribute("href")!==(u.href==null||u.href===""?null:u.href)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin)||e.getAttribute("title")!==(u.title==null?null:u.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(d=e.getAttribute("src"),(d!==(u.src==null?null:u.src)||e.getAttribute("type")!==(u.type==null?null:u.type)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin))&&d&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var d=u.name==null?null:""+u.name;if(u.type==="hidden"&&e.getAttribute("name")===d)return e}else return e;if(e=fr(e.nextSibling),e===null)break}return null}function lE(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=fr(e.nextSibling),e===null))return null;return e}function Gm(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=fr(e.nextSibling),e===null))return null;return e}function _v(e){return e.data==="$?"||e.data==="$~"}function Mv(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function aE(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var l=function(){t(),n.removeEventListener("DOMContentLoaded",l)};n.addEventListener("DOMContentLoaded",l),e._reactRetry=l}}function fr(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Ov=null;function Xm(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return fr(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function Im(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function Zm(e,t,n){switch(t=Id(n),e){case"html":if(e=t.documentElement,!e)throw Error(v(452));return e;case"head":if(e=t.head,!e)throw Error(v(453));return e;case"body":if(e=t.body,!e)throw Error(v(454));return e;default:throw Error(v(451))}}function zf(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);mr(e)}var dr=new Map,Vm=new Set;function Zd(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var Ao=J.d;J.d={f:rE,r:iE,D:oE,C:cE,L:uE,m:sE,X:dE,S:fE,M:hE};function rE(){var e=Ao.f(),t=Bd();return e||t}function iE(e){var t=ii(e);t!==null&&t.tag===5&&t.type==="form"?hs(t):Ao.r(e)}var Ms=typeof document>"u"?null:document;function Qm(e,t,n){var l=Ms;if(l&&typeof t=="string"&&t){var u=Kn(t);u='link[rel="'+e+'"][href="'+u+'"]',typeof n=="string"&&(u+='[crossorigin="'+n+'"]'),Vm.has(u)||(Vm.add(u),e={rel:e,crossOrigin:n,href:t},l.querySelector(u)===null&&(t=l.createElement("link"),_l(t,"link",e),dn(t),l.head.appendChild(t)))}}function oE(e){Ao.D(e),Qm("dns-prefetch",e,null)}function cE(e,t){Ao.C(e,t),Qm("preconnect",e,t)}function uE(e,t,n){Ao.L(e,t,n);var l=Ms;if(l&&e&&t){var u='link[rel="preload"][as="'+Kn(t)+'"]';t==="image"&&n&&n.imageSrcSet?(u+='[imagesrcset="'+Kn(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(u+='[imagesizes="'+Kn(n.imageSizes)+'"]')):u+='[href="'+Kn(e)+'"]';var d=u;switch(t){case"style":d=Os(e);break;case"script":d=zs(e)}dr.has(d)||(e=L({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),dr.set(d,e),l.querySelector(u)!==null||t==="style"&&l.querySelector(Df(d))||t==="script"&&l.querySelector(kf(d))||(t=l.createElement("link"),_l(t,"link",e),dn(t),l.head.appendChild(t)))}}function sE(e,t){Ao.m(e,t);var n=Ms;if(n&&e){var l=t&&typeof t.as=="string"?t.as:"script",u='link[rel="modulepreload"][as="'+Kn(l)+'"][href="'+Kn(e)+'"]',d=u;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":d=zs(e)}if(!dr.has(d)&&(e=L({rel:"modulepreload",href:e},t),dr.set(d,e),n.querySelector(u)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(kf(d)))return}l=n.createElement("link"),_l(l,"link",e),dn(l),n.head.appendChild(l)}}}function fE(e,t,n){Ao.S(e,t,n);var l=Ms;if(l&&e){var u=pr(l).hoistableStyles,d=Os(e);t=t||"default";var x=u.get(d);if(!x){var A={loading:0,preload:null};if(x=l.querySelector(Df(d)))A.loading=5;else{e=L({rel:"stylesheet",href:e,"data-precedence":t},n),(n=dr.get(d))&&zv(e,n);var F=x=l.createElement("link");dn(F),_l(F,"link",e),F._p=new Promise(function(q,ue){F.onload=q,F.onerror=ue}),F.addEventListener("load",function(){A.loading|=1}),F.addEventListener("error",function(){A.loading|=2}),A.loading|=4,Vd(x,t,l)}x={type:"stylesheet",instance:x,count:1,state:A},u.set(d,x)}}}function dE(e,t){Ao.X(e,t);var n=Ms;if(n&&e){var l=pr(n).hoistableScripts,u=zs(e),d=l.get(u);d||(d=n.querySelector(kf(u)),d||(e=L({src:e,async:!0},t),(t=dr.get(u))&&Dv(e,t),d=n.createElement("script"),dn(d),_l(d,"link",e),n.head.appendChild(d)),d={type:"script",instance:d,count:1,state:null},l.set(u,d))}}function hE(e,t){Ao.M(e,t);var n=Ms;if(n&&e){var l=pr(n).hoistableScripts,u=zs(e),d=l.get(u);d||(d=n.querySelector(kf(u)),d||(e=L({src:e,async:!0,type:"module"},t),(t=dr.get(u))&&Dv(e,t),d=n.createElement("script"),dn(d),_l(d,"link",e),n.head.appendChild(d)),d={type:"script",instance:d,count:1,state:null},l.set(u,d))}}function Wm(e,t,n,l){var u=(u=_e.current)?Zd(u):null;if(!u)throw Error(v(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(t=Os(n.href),n=pr(u).hoistableStyles,l=n.get(t),l||(l={type:"style",instance:null,count:0,state:null},n.set(t,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=Os(n.href);var d=pr(u).hoistableStyles,x=d.get(e);if(x||(u=u.ownerDocument||u,x={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},d.set(e,x),(d=u.querySelector(Df(e)))&&!d._p&&(x.instance=d,x.state.loading=5),dr.has(e)||(n={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},dr.set(e,n),d||vE(u,e,n,x.state))),t&&l===null)throw Error(v(528,""));return x}if(t&&l!==null)throw Error(v(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=zs(n),n=pr(u).hoistableScripts,l=n.get(t),l||(l={type:"script",instance:null,count:0,state:null},n.set(t,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(v(444,e))}}function Os(e){return'href="'+Kn(e)+'"'}function Df(e){return'link[rel="stylesheet"]['+e+"]"}function Jm(e){return L({},e,{"data-precedence":e.precedence,precedence:null})}function vE(e,t,n,l){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?l.loading=1:(t=e.createElement("link"),l.preload=t,t.addEventListener("load",function(){return l.loading|=1}),t.addEventListener("error",function(){return l.loading|=2}),_l(t,"link",n),dn(t),e.head.appendChild(t))}function zs(e){return'[src="'+Kn(e)+'"]'}function kf(e){return"script[async]"+e}function Km(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var l=e.querySelector('style[data-href~="'+Kn(n.href)+'"]');if(l)return t.instance=l,dn(l),l;var u=L({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return l=(e.ownerDocument||e).createElement("style"),dn(l),_l(l,"style",u),Vd(l,n.precedence,e),t.instance=l;case"stylesheet":u=Os(n.href);var d=e.querySelector(Df(u));if(d)return t.state.loading|=4,t.instance=d,dn(d),d;l=Jm(n),(u=dr.get(u))&&zv(l,u),d=(e.ownerDocument||e).createElement("link"),dn(d);var x=d;return x._p=new Promise(function(A,F){x.onload=A,x.onerror=F}),_l(d,"link",l),t.state.loading|=4,Vd(d,n.precedence,e),t.instance=d;case"script":return d=zs(n.src),(u=e.querySelector(kf(d)))?(t.instance=u,dn(u),u):(l=n,(u=dr.get(d))&&(l=L({},n),Dv(l,u)),e=e.ownerDocument||e,u=e.createElement("script"),dn(u),_l(u,"link",l),e.head.appendChild(u),t.instance=u);case"void":return null;default:throw Error(v(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(l=t.instance,t.state.loading|=4,Vd(l,n.precedence,e));return t.instance}function Vd(e,t,n){for(var l=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),u=l.length?l[l.length-1]:null,d=u,x=0;x<l.length;x++){var A=l[x];if(A.dataset.precedence===t)d=A;else if(d!==u)break}d?d.parentNode.insertBefore(e,d.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function zv(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function Dv(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var Qd=null;function jm(e,t,n){if(Qd===null){var l=new Map,u=Qd=new Map;u.set(n,l)}else u=Qd,l=u.get(n),l||(l=new Map,u.set(n,l));if(l.has(e))return l;for(l.set(e,null),n=n.getElementsByTagName(e),u=0;u<n.length;u++){var d=n[u];if(!(d[St]||d[mn]||e==="link"&&d.getAttribute("rel")==="stylesheet")&&d.namespaceURI!=="http://www.w3.org/2000/svg"){var x=d.getAttribute(t)||"";x=e+x;var A=l.get(x);A?A.push(d):l.set(x,[d])}}return l}function qm(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function gE(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;switch(t.rel){case"stylesheet":return e=t.disabled,typeof t.precedence=="string"&&e==null;default:return!0}case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function $m(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function bE(e,t,n,l){if(n.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var u=Os(l.href),d=t.querySelector(Df(u));if(d){t=d._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=Wd.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=d,dn(d);return}d=t.ownerDocument||t,l=Jm(l),(u=dr.get(u))&&zv(l,u),d=d.createElement("link"),dn(d);var x=d;x._p=new Promise(function(A,F){x.onload=A,x.onerror=F}),_l(d,"link",l),n.instance=d}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=Wd.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var kv=0;function mE(e,t){return e.stylesheets&&e.count===0&&Kd(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var l=setTimeout(function(){if(e.stylesheets&&Kd(e,e.stylesheets),e.unsuspend){var d=e.unsuspend;e.unsuspend=null,d()}},6e4+t);0<e.imgBytes&&kv===0&&(kv=62500*jS());var u=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Kd(e,e.stylesheets),e.unsuspend)){var d=e.unsuspend;e.unsuspend=null,d()}},(e.imgBytes>kv?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(l),clearTimeout(u)}}:null}function Wd(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Kd(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Jd=null;function Kd(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Jd=new Map,t.forEach(yE,e),Jd=null,Wd.call(e))}function yE(e,t){if(!(t.state.loading&4)){var n=Jd.get(e);if(n)var l=n.get(null);else{n=new Map,Jd.set(e,n);for(var u=e.querySelectorAll("link[data-precedence],style[data-precedence]"),d=0;d<u.length;d++){var x=u[d];(x.nodeName==="LINK"||x.getAttribute("media")!=="not all")&&(n.set(x.dataset.precedence,x),l=x)}l&&n.set(null,l)}u=t.instance,x=u.getAttribute("data-precedence"),d=n.get(x)||l,d===l&&n.set(null,u),n.set(x,u),this.count++,l=Wd.bind(this),u.addEventListener("load",l),u.addEventListener("error",l),d?d.parentNode.insertBefore(u,d.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(u,e.firstChild)),t.state.loading|=4}}var Nf={$$typeof:de,Provider:null,Consumer:null,_currentValue:we,_currentValue2:we,_threadCount:0};function pE(e,t,n,l,u,d,x,A,F){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Xo(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Xo(0),this.hiddenUpdates=Xo(null),this.identifierPrefix=l,this.onUncaughtError=u,this.onCaughtError=d,this.onRecoverableError=x,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=F,this.incompleteTransitions=new Map}function ey(e,t,n,l,u,d,x,A,F,q,ue,ge){return e=new pE(e,t,n,x,F,q,ue,ge,A),t=1,d===!0&&(t|=24),d=kt(3,null,null,t),e.current=d,d.stateNode=e,t=bc(),t.refCount++,e.pooledCache=t,t.refCount++,d.memoizedState={element:l,isDehydrated:n,cache:t},jl(d),e}function ty(e){return e?(e=ot,e):ot}function ny(e,t,n,l,u,d){u=ty(u),l.context===null?l.context=u:l.pendingContext=u,l=gl(t),l.payload={element:n},d=d===void 0?null:d,d!==null&&(l.callback=d),n=Xn(e,l,t),n!==null&&(va(n,e,t),Bl(n,e,t))}function ly(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Nv(e,t){ly(e,t),(e=e.alternate)&&ly(e,t)}function ay(e){if(e.tag===13||e.tag===31){var t=xt(e,67108864);t!==null&&va(t,e,67108864),Nv(e,67108864)}}function ry(e){if(e.tag===13||e.tag===31){var t=Wa();t=sl(t);var n=xt(e,t);n!==null&&va(n,e,t),Nv(e,t)}}var jd=!0;function xE(e,t,n,l){var u=D.T;D.T=null;var d=J.p;try{J.p=2,Lv(e,t,n,l)}finally{J.p=d,D.T=u}}function wE(e,t,n,l){var u=D.T;D.T=null;var d=J.p;try{J.p=8,Lv(e,t,n,l)}finally{J.p=d,D.T=u}}function Lv(e,t,n,l){if(jd){var u=Bv(l);if(u===null)wv(e,t,l,qd,n),oy(e,l);else if(EE(u,e,t,n,l))l.stopPropagation();else if(oy(e,l),t&4&&-1<SE.indexOf(e)){for(;u!==null;){var d=ii(u);if(d!==null)switch(d.tag){case 3:if(d=d.stateNode,d.current.memoizedState.isDehydrated){var x=ya(d.pendingLanes);if(x!==0){var A=d;for(A.pendingLanes|=2,A.entangledLanes|=2;x;){var F=1<<31-Bn(x);A.entanglements[1]|=F,x&=~F}Ui(d),(zt&6)===0&&(Nd=cl()+500,_f(0))}}break;case 31:case 13:A=xt(d,2),A!==null&&va(A,d,2),Bd(),Nv(d,2)}if(d=Bv(l),d===null&&wv(e,t,l,qd,n),d===u)break;u=d}u!==null&&l.stopPropagation()}else wv(e,t,l,null,n)}}function Bv(e){return e=fi(e),Hv(e)}var qd=null;function Hv(e){if(qd=null,e=yn(e),e!==null){var t=S(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=E(t),e!==null)return e;e=null}else if(n===31){if(e=T(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return qd=e,null}function iy(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(gt()){case ul:return 2;case qu:return 8;case ti:case Cn:return 32;case Po:return 268435456;default:return 32}default:return 32}}var Uv=!1,Ic=null,Zc=null,Vc=null,Lf=new Map,Bf=new Map,Qc=[],SE="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function oy(e,t){switch(e){case"focusin":case"focusout":Ic=null;break;case"dragenter":case"dragleave":Zc=null;break;case"mouseover":case"mouseout":Vc=null;break;case"pointerover":case"pointerout":Lf.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Bf.delete(t.pointerId)}}function Hf(e,t,n,l,u,d){return e===null||e.nativeEvent!==d?(e={blockedOn:t,domEventName:n,eventSystemFlags:l,nativeEvent:d,targetContainers:[u]},t!==null&&(t=ii(t),t!==null&&ay(t)),e):(e.eventSystemFlags|=l,t=e.targetContainers,u!==null&&t.indexOf(u)===-1&&t.push(u),e)}function EE(e,t,n,l,u){switch(t){case"focusin":return Ic=Hf(Ic,e,t,n,l,u),!0;case"dragenter":return Zc=Hf(Zc,e,t,n,l,u),!0;case"mouseover":return Vc=Hf(Vc,e,t,n,l,u),!0;case"pointerover":var d=u.pointerId;return Lf.set(d,Hf(Lf.get(d)||null,e,t,n,l,u)),!0;case"gotpointercapture":return d=u.pointerId,Bf.set(d,Hf(Bf.get(d)||null,e,t,n,l,u)),!0}return!1}function cy(e){var t=yn(e.target);if(t!==null){var n=S(t);if(n!==null){if(t=n.tag,t===13){if(t=E(n),t!==null){e.blockedOn=t,fl(e.priority,function(){ry(n)});return}}else if(t===31){if(t=T(n),t!==null){e.blockedOn=t,fl(e.priority,function(){ry(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function $d(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Bv(e.nativeEvent);if(n===null){n=e.nativeEvent;var l=new n.constructor(n.type,n);si=l,n.target.dispatchEvent(l),si=null}else return t=ii(n),t!==null&&ay(t),e.blockedOn=n,!1;t.shift()}return!0}function uy(e,t,n){$d(e)&&n.delete(t)}function CE(){Uv=!1,Ic!==null&&$d(Ic)&&(Ic=null),Zc!==null&&$d(Zc)&&(Zc=null),Vc!==null&&$d(Vc)&&(Vc=null),Lf.forEach(uy),Bf.forEach(uy)}function eh(e,t){e.blockedOn===t&&(e.blockedOn=null,Uv||(Uv=!0,a.unstable_scheduleCallback(a.unstable_NormalPriority,CE)))}var th=null;function sy(e){th!==e&&(th=e,a.unstable_scheduleCallback(a.unstable_NormalPriority,function(){th===e&&(th=null);for(var t=0;t<e.length;t+=3){var n=e[t],l=e[t+1],u=e[t+2];if(typeof l!="function"){if(Hv(l||n)===null)continue;break}var d=ii(n);d!==null&&(e.splice(t,3),t-=3,_c(d,{pending:!0,data:u,method:n.method,action:l},l,u))}}))}function Ds(e){function t(F){return eh(F,e)}Ic!==null&&eh(Ic,e),Zc!==null&&eh(Zc,e),Vc!==null&&eh(Vc,e),Lf.forEach(t),Bf.forEach(t);for(var n=0;n<Qc.length;n++){var l=Qc[n];l.blockedOn===e&&(l.blockedOn=null)}for(;0<Qc.length&&(n=Qc[0],n.blockedOn===null);)cy(n),n.blockedOn===null&&Qc.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(l=0;l<n.length;l+=3){var u=n[l],d=n[l+1],x=u[Wn]||null;if(typeof d=="function")x||sy(n);else if(x){var A=null;if(d&&d.hasAttribute("formAction")){if(u=d,x=d[Wn]||null)A=x.formAction;else if(Hv(u)!==null)continue}else A=x.action;typeof A=="function"?n[l+1]=A:(n.splice(l,3),l-=3),sy(n)}}}function fy(){function e(d){d.canIntercept&&d.info==="react-transition"&&d.intercept({handler:function(){return new Promise(function(x){return u=x})},focusReset:"manual",scroll:"manual"})}function t(){u!==null&&(u(),u=null),l||setTimeout(n,20)}function n(){if(!l&&!navigation.transition){var d=navigation.currentEntry;d&&d.url!=null&&navigation.navigate(d.url,{state:d.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,u=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){l=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),u!==null&&(u(),u=null)}}}function Fv(e){this._internalRoot=e}nh.prototype.render=Fv.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(v(409));var n=t.current,l=Wa();ny(n,l,e,t,null,null)},nh.prototype.unmount=Fv.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;ny(e.current,2,null,e,null,null),Bd(),t[qa]=null}};function nh(e){this._internalRoot=e}nh.prototype.unstable_scheduleHydration=function(e){if(e){var t=Vi();e={blockedOn:null,target:e,priority:t};for(var n=0;n<Qc.length&&t!==0&&t<Qc[n].priority;n++);Qc.splice(n,0,e),n===0&&cy(e)}};var dy=s.version;if(dy!=="19.2.4")throw Error(v(527,dy,"19.2.4"));J.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(v(188)):(e=Object.keys(e).join(","),Error(v(268,e)));return e=R(t),e=e!==null?k(e):null,e=e===null?null:e.stateNode,e};var TE={bundleType:0,version:"19.2.4",rendererPackageName:"react-dom",currentDispatcherRef:D,reconcilerVersion:"19.2.4"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var lh=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!lh.isDisabled&&lh.supportsFiber)try{ja=lh.inject(TE),gn=lh}catch{}}return Ls.createRoot=function(e,t){if(!p(e))throw Error(v(299));var n=!1,l="",u=hf,d=Li,x=vf;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(l=t.identifierPrefix),t.onUncaughtError!==void 0&&(u=t.onUncaughtError),t.onCaughtError!==void 0&&(d=t.onCaughtError),t.onRecoverableError!==void 0&&(x=t.onRecoverableError)),t=ey(e,1,!1,null,null,n,l,null,u,d,x,fy),e[qa]=t.current,xv(e),new Fv(t)},Ls.hydrateRoot=function(e,t,n){if(!p(e))throw Error(v(299));var l=!1,u="",d=hf,x=Li,A=vf,F=null;return n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(u=n.identifierPrefix),n.onUncaughtError!==void 0&&(d=n.onUncaughtError),n.onCaughtError!==void 0&&(x=n.onCaughtError),n.onRecoverableError!==void 0&&(A=n.onRecoverableError),n.formState!==void 0&&(F=n.formState)),t=ey(e,1,!0,t,n??null,l,u,F,d,x,A,fy),t.context=ty(null),n=t.current,l=Wa(),l=sl(l),u=gl(l),u.callback=null,Xn(n,u,l),n=l,t.current.lanes=n,Zi(t,n),Ui(t),e[qa]=t.current,xv(e),new nh(t)},Ls.version="19.2.4",Ls}var jv;function wy(){if(jv)return ih.exports;jv=1;function a(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a)}catch(s){console.error(s)}}return a(),ih.exports=xy(),ih.exports}var Sy=wy();function an(a,s,{checkForDefaultPrevented:f=!0}={}){return function(p){if(a?.(p),f===!1||!p.defaultPrevented)return s?.(p)}}function qv(a,s){if(typeof a=="function")return a(s);a!=null&&(a.current=s)}function $v(...a){return s=>{let f=!1;const v=a.map(p=>{const S=qv(p,s);return!f&&typeof S=="function"&&(f=!0),S});if(f)return()=>{for(let p=0;p<v.length;p++){const S=v[p];typeof S=="function"?S():qv(a[p],null)}}}}function yl(...a){return H.useCallback($v(...a),a)}function Fu(a,s=[]){let f=[];function v(S,E){const T=H.createContext(E),O=f.length;f=[...f,E];const R=L=>{const{scope:U,children:V,...K}=L,Z=U?.[a]?.[O]||T,$=H.useMemo(()=>K,Object.values(K));return Y.jsx(Z.Provider,{value:$,children:V})};R.displayName=S+"Provider";function k(L,U){const V=U?.[a]?.[O]||T,K=H.useContext(V);if(K)return K;if(E!==void 0)return E;throw new Error(`\`${L}\` must be used within \`${S}\``)}return[R,k]}const p=()=>{const S=f.map(E=>H.createContext(E));return function(T){const O=T?.[a]||S;return H.useMemo(()=>({[`__scope${a}`]:{...T,[a]:O}}),[T,O])}};return p.scopeName=a,[v,Ey(p,...s)]}function Ey(...a){const s=a[0];if(a.length===1)return s;const f=()=>{const v=a.map(p=>({useScope:p(),scopeName:p.scopeName}));return function(S){const E=v.reduce((T,{useScope:O,scopeName:R})=>{const L=O(S)[`__scope${R}`];return{...T,...L}},{});return H.useMemo(()=>({[`__scope${s.scopeName}`]:E}),[E])}};return f.scopeName=s.scopeName,f}var Ff=Uf();const Cy=Yv(Ff);function Yf(a){const s=Ty(a),f=H.forwardRef((v,p)=>{const{children:S,...E}=v,T=H.Children.toArray(S),O=T.find(Ay);if(O){const R=O.props.children,k=T.map(L=>L===O?H.Children.count(R)>1?H.Children.only(null):H.isValidElement(R)?R.props.children:null:L);return Y.jsx(s,{...E,ref:p,children:H.isValidElement(R)?H.cloneElement(R,void 0,k):null})}return Y.jsx(s,{...E,ref:p,children:S})});return f.displayName=`${a}.Slot`,f}function Ty(a){const s=H.forwardRef((f,v)=>{const{children:p,...S}=f;if(H.isValidElement(p)){const E=My(p),T=_y(S,p.props);return p.type!==H.Fragment&&(T.ref=v?$v(v,E):E),H.cloneElement(p,T)}return H.Children.count(p)>1?H.Children.only(null):null});return s.displayName=`${a}.SlotClone`,s}var Ry=Symbol("radix.slottable");function Ay(a){return H.isValidElement(a)&&typeof a.type=="function"&&"__radixId"in a.type&&a.type.__radixId===Ry}function _y(a,s){const f={...s};for(const v in s){const p=a[v],S=s[v];/^on[A-Z]/.test(v)?p&&S?f[v]=(...T)=>{const O=S(...T);return p(...T),O}:p&&(f[v]=p):v==="style"?f[v]={...p,...S}:v==="className"&&(f[v]=[p,S].filter(Boolean).join(" "))}return{...a,...f}}function My(a){let s=Object.getOwnPropertyDescriptor(a.props,"ref")?.get,f=s&&"isReactWarning"in s&&s.isReactWarning;return f?a.ref:(s=Object.getOwnPropertyDescriptor(a,"ref")?.get,f=s&&"isReactWarning"in s&&s.isReactWarning,f?a.props.ref:a.props.ref||a.ref)}var Oy=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"],Ln=Oy.reduce((a,s)=>{const f=Yf(`Primitive.${s}`),v=H.forwardRef((p,S)=>{const{asChild:E,...T}=p,O=E?f:s;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),Y.jsx(O,{...T,ref:S})});return v.displayName=`Primitive.${s}`,{...a,[s]:v}},{});function zy(a,s){a&&Ff.flushSync(()=>a.dispatchEvent(s))}function $l(a){const s=H.useRef(a);return H.useEffect(()=>{s.current=a}),H.useMemo(()=>(...f)=>s.current?.(...f),[])}function Dy(a,s=globalThis?.document){const f=$l(a);H.useEffect(()=>{const v=p=>{p.key==="Escape"&&f(p)};return s.addEventListener("keydown",v,{capture:!0}),()=>s.removeEventListener("keydown",v,{capture:!0})},[f,s])}var ky="DismissableLayer",sh="dismissableLayer.update",Ny="dismissableLayer.pointerDownOutside",Ly="dismissableLayer.focusOutside",eg,tg=H.createContext({layers:new Set,layersWithOutsidePointerEventsDisabled:new Set,branches:new Set}),ng=H.forwardRef((a,s)=>{const{disableOutsidePointerEvents:f=!1,onEscapeKeyDown:v,onPointerDownOutside:p,onFocusOutside:S,onInteractOutside:E,onDismiss:T,...O}=a,R=H.useContext(tg),[k,L]=H.useState(null),U=k?.ownerDocument??globalThis?.document,[,V]=H.useState({}),K=yl(s,be=>L(be)),Z=Array.from(R.layers),[$]=[...R.layersWithOutsidePointerEventsDisabled].slice(-1),oe=Z.indexOf($),me=k?Z.indexOf(k):-1,de=R.layersWithOutsidePointerEventsDisabled.size>0,ve=me>=oe,Te=Uy(be=>{const ce=be.target,ye=[...R.branches].some(He=>He.contains(ce));!ve||ye||(p?.(be),E?.(be),be.defaultPrevented||T?.())},U),Ee=Fy(be=>{const ce=be.target;[...R.branches].some(He=>He.contains(ce))||(S?.(be),E?.(be),be.defaultPrevented||T?.())},U);return Dy(be=>{me===R.layers.size-1&&(v?.(be),!be.defaultPrevented&&T&&(be.preventDefault(),T()))},U),H.useEffect(()=>{if(k)return f&&(R.layersWithOutsidePointerEventsDisabled.size===0&&(eg=U.body.style.pointerEvents,U.body.style.pointerEvents="none"),R.layersWithOutsidePointerEventsDisabled.add(k)),R.layers.add(k),lg(),()=>{f&&R.layersWithOutsidePointerEventsDisabled.size===1&&(U.body.style.pointerEvents=eg)}},[k,U,f,R]),H.useEffect(()=>()=>{k&&(R.layers.delete(k),R.layersWithOutsidePointerEventsDisabled.delete(k),lg())},[k,R]),H.useEffect(()=>{const be=()=>V({});return document.addEventListener(sh,be),()=>document.removeEventListener(sh,be)},[]),Y.jsx(Ln.div,{...O,ref:K,style:{pointerEvents:de?ve?"auto":"none":void 0,...a.style},onFocusCapture:an(a.onFocusCapture,Ee.onFocusCapture),onBlurCapture:an(a.onBlurCapture,Ee.onBlurCapture),onPointerDownCapture:an(a.onPointerDownCapture,Te.onPointerDownCapture)})});ng.displayName=ky;var By="DismissableLayerBranch",Hy=H.forwardRef((a,s)=>{const f=H.useContext(tg),v=H.useRef(null),p=yl(s,v);return H.useEffect(()=>{const S=v.current;if(S)return f.branches.add(S),()=>{f.branches.delete(S)}},[f.branches]),Y.jsx(Ln.div,{...a,ref:p})});Hy.displayName=By;function Uy(a,s=globalThis?.document){const f=$l(a),v=H.useRef(!1),p=H.useRef(()=>{});return H.useEffect(()=>{const S=T=>{if(T.target&&!v.current){let O=function(){ag(Ny,f,R,{discrete:!0})};const R={originalEvent:T};T.pointerType==="touch"?(s.removeEventListener("click",p.current),p.current=O,s.addEventListener("click",p.current,{once:!0})):O()}else s.removeEventListener("click",p.current);v.current=!1},E=window.setTimeout(()=>{s.addEventListener("pointerdown",S)},0);return()=>{window.clearTimeout(E),s.removeEventListener("pointerdown",S),s.removeEventListener("click",p.current)}},[s,f]),{onPointerDownCapture:()=>v.current=!0}}function Fy(a,s=globalThis?.document){const f=$l(a),v=H.useRef(!1);return H.useEffect(()=>{const p=S=>{S.target&&!v.current&&ag(Ly,f,{originalEvent:S},{discrete:!1})};return s.addEventListener("focusin",p),()=>s.removeEventListener("focusin",p)},[s,f]),{onFocusCapture:()=>v.current=!0,onBlurCapture:()=>v.current=!1}}function lg(){const a=new CustomEvent(sh);document.dispatchEvent(a)}function ag(a,s,f,{discrete:v}){const p=f.originalEvent.target,S=new CustomEvent(a,{bubbles:!1,cancelable:!0,detail:f});s&&p.addEventListener(a,s,{once:!0}),v?zy(p,S):p.dispatchEvent(S)}var fh=0;function Yy(){H.useEffect(()=>{const a=document.querySelectorAll("[data-radix-focus-guard]");return document.body.insertAdjacentElement("afterbegin",a[0]??rg()),document.body.insertAdjacentElement("beforeend",a[1]??rg()),fh++,()=>{fh===1&&document.querySelectorAll("[data-radix-focus-guard]").forEach(s=>s.remove()),fh--}},[])}function rg(){const a=document.createElement("span");return a.setAttribute("data-radix-focus-guard",""),a.tabIndex=0,a.style.outline="none",a.style.opacity="0",a.style.position="fixed",a.style.pointerEvents="none",a}var dh="focusScope.autoFocusOnMount",hh="focusScope.autoFocusOnUnmount",ig={bubbles:!1,cancelable:!0},Py="FocusScope",og=H.forwardRef((a,s)=>{const{loop:f=!1,trapped:v=!1,onMountAutoFocus:p,onUnmountAutoFocus:S,...E}=a,[T,O]=H.useState(null),R=$l(p),k=$l(S),L=H.useRef(null),U=yl(s,Z=>O(Z)),V=H.useRef({paused:!1,pause(){this.paused=!0},resume(){this.paused=!1}}).current;H.useEffect(()=>{if(v){let Z=function(de){if(V.paused||!T)return;const ve=de.target;T.contains(ve)?L.current=ve:Mo(L.current,{select:!0})},$=function(de){if(V.paused||!T)return;const ve=de.relatedTarget;ve!==null&&(T.contains(ve)||Mo(L.current,{select:!0}))},oe=function(de){if(document.activeElement===document.body)for(const Te of de)Te.removedNodes.length>0&&Mo(T)};document.addEventListener("focusin",Z),document.addEventListener("focusout",$);const me=new MutationObserver(oe);return T&&me.observe(T,{childList:!0,subtree:!0}),()=>{document.removeEventListener("focusin",Z),document.removeEventListener("focusout",$),me.disconnect()}}},[v,T,V.paused]),H.useEffect(()=>{if(T){sg.add(V);const Z=document.activeElement;if(!T.contains(Z)){const oe=new CustomEvent(dh,ig);T.addEventListener(dh,R),T.dispatchEvent(oe),oe.defaultPrevented||(Gy(Qy(cg(T)),{select:!0}),document.activeElement===Z&&Mo(T))}return()=>{T.removeEventListener(dh,R),setTimeout(()=>{const oe=new CustomEvent(hh,ig);T.addEventListener(hh,k),T.dispatchEvent(oe),oe.defaultPrevented||Mo(Z??document.body,{select:!0}),T.removeEventListener(hh,k),sg.remove(V)},0)}}},[T,R,k,V]);const K=H.useCallback(Z=>{if(!f&&!v||V.paused)return;const $=Z.key==="Tab"&&!Z.altKey&&!Z.ctrlKey&&!Z.metaKey,oe=document.activeElement;if($&&oe){const me=Z.currentTarget,[de,ve]=Xy(me);de&&ve?!Z.shiftKey&&oe===ve?(Z.preventDefault(),f&&Mo(de,{select:!0})):Z.shiftKey&&oe===de&&(Z.preventDefault(),f&&Mo(ve,{select:!0})):oe===me&&Z.preventDefault()}},[f,v,V.paused]);return Y.jsx(Ln.div,{tabIndex:-1,...E,ref:U,onKeyDown:K})});og.displayName=Py;function Gy(a,{select:s=!1}={}){const f=document.activeElement;for(const v of a)if(Mo(v,{select:s}),document.activeElement!==f)return}function Xy(a){const s=cg(a),f=ug(s,a),v=ug(s.reverse(),a);return[f,v]}function cg(a){const s=[],f=document.createTreeWalker(a,NodeFilter.SHOW_ELEMENT,{acceptNode:v=>{const p=v.tagName==="INPUT"&&v.type==="hidden";return v.disabled||v.hidden||p?NodeFilter.FILTER_SKIP:v.tabIndex>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(;f.nextNode();)s.push(f.currentNode);return s}function ug(a,s){for(const f of a)if(!Iy(f,{upTo:s}))return f}function Iy(a,{upTo:s}){if(getComputedStyle(a).visibility==="hidden")return!0;for(;a;){if(s!==void 0&&a===s)return!1;if(getComputedStyle(a).display==="none")return!0;a=a.parentElement}return!1}function Zy(a){return a instanceof HTMLInputElement&&"select"in a}function Mo(a,{select:s=!1}={}){if(a&&a.focus){const f=document.activeElement;a.focus({preventScroll:!0}),a!==f&&Zy(a)&&s&&a.select()}}var sg=Vy();function Vy(){let a=[];return{add(s){const f=a[0];s!==f&&f?.pause(),a=fg(a,s),a.unshift(s)},remove(s){a=fg(a,s),a[0]?.resume()}}}function fg(a,s){const f=[...a],v=f.indexOf(s);return v!==-1&&f.splice(v,1),f}function Qy(a){return a.filter(s=>s.tagName!=="A")}var Fi=globalThis?.document?H.useLayoutEffect:()=>{},Wy=Zv[" useId ".trim().toString()]||(()=>{}),Jy=0;function vh(a){const[s,f]=H.useState(Wy());return Fi(()=>{f(v=>v??String(Jy++))},[a]),a||(s?`radix-${s}`:"")}const Ky=["top","right","bottom","left"],Oo=Math.min,ga=Math.max,Pf=Math.round,Gf=Math.floor,Qr=a=>({x:a,y:a}),jy={left:"right",right:"left",bottom:"top",top:"bottom"};function gh(a,s,f){return ga(a,Oo(s,f))}function Yi(a,s){return typeof a=="function"?a(s):a}function Pi(a){return a.split("-")[0]}function Yu(a){return a.split("-")[1]}function bh(a){return a==="x"?"y":"x"}function mh(a){return a==="y"?"height":"width"}function Wr(a){const s=a[0];return s==="t"||s==="b"?"y":"x"}function yh(a){return bh(Wr(a))}function qy(a,s,f){f===void 0&&(f=!1);const v=Yu(a),p=yh(a),S=mh(p);let E=p==="x"?v===(f?"end":"start")?"right":"left":v==="start"?"bottom":"top";return s.reference[S]>s.floating[S]&&(E=Xf(E)),[E,Xf(E)]}function $y(a){const s=Xf(a);return[ph(a),s,ph(s)]}function ph(a){return a.includes("start")?a.replace("start","end"):a.replace("end","start")}const dg=["left","right"],hg=["right","left"],ep=["top","bottom"],tp=["bottom","top"];function np(a,s,f){switch(a){case"top":case"bottom":return f?s?hg:dg:s?dg:hg;case"left":case"right":return s?ep:tp;default:return[]}}function lp(a,s,f,v){const p=Yu(a);let S=np(Pi(a),f==="start",v);return p&&(S=S.map(E=>E+"-"+p),s&&(S=S.concat(S.map(ph)))),S}function Xf(a){const s=Pi(a);return jy[s]+a.slice(s.length)}function ap(a){return{top:0,right:0,bottom:0,left:0,...a}}function vg(a){return typeof a!="number"?ap(a):{top:a,right:a,bottom:a,left:a}}function If(a){const{x:s,y:f,width:v,height:p}=a;return{width:v,height:p,top:f,left:s,right:s+v,bottom:f+p,x:s,y:f}}function gg(a,s,f){let{reference:v,floating:p}=a;const S=Wr(s),E=yh(s),T=mh(E),O=Pi(s),R=S==="y",k=v.x+v.width/2-p.width/2,L=v.y+v.height/2-p.height/2,U=v[T]/2-p[T]/2;let V;switch(O){case"top":V={x:k,y:v.y-p.height};break;case"bottom":V={x:k,y:v.y+v.height};break;case"right":V={x:v.x+v.width,y:L};break;case"left":V={x:v.x-p.width,y:L};break;default:V={x:v.x,y:v.y}}switch(Yu(s)){case"start":V[E]-=U*(f&&R?-1:1);break;case"end":V[E]+=U*(f&&R?-1:1);break}return V}async function rp(a,s){var f;s===void 0&&(s={});const{x:v,y:p,platform:S,rects:E,elements:T,strategy:O}=a,{boundary:R="clippingAncestors",rootBoundary:k="viewport",elementContext:L="floating",altBoundary:U=!1,padding:V=0}=Yi(s,a),K=vg(V),$=T[U?L==="floating"?"reference":"floating":L],oe=If(await S.getClippingRect({element:(f=await(S.isElement==null?void 0:S.isElement($)))==null||f?$:$.contextElement||await(S.getDocumentElement==null?void 0:S.getDocumentElement(T.floating)),boundary:R,rootBoundary:k,strategy:O})),me=L==="floating"?{x:v,y:p,width:E.floating.width,height:E.floating.height}:E.reference,de=await(S.getOffsetParent==null?void 0:S.getOffsetParent(T.floating)),ve=await(S.isElement==null?void 0:S.isElement(de))?await(S.getScale==null?void 0:S.getScale(de))||{x:1,y:1}:{x:1,y:1},Te=If(S.convertOffsetParentRelativeRectToViewportRelativeRect?await S.convertOffsetParentRelativeRectToViewportRelativeRect({elements:T,rect:me,offsetParent:de,strategy:O}):me);return{top:(oe.top-Te.top+K.top)/ve.y,bottom:(Te.bottom-oe.bottom+K.bottom)/ve.y,left:(oe.left-Te.left+K.left)/ve.x,right:(Te.right-oe.right+K.right)/ve.x}}const ip=50,op=async(a,s,f)=>{const{placement:v="bottom",strategy:p="absolute",middleware:S=[],platform:E}=f,T=E.detectOverflow?E:{...E,detectOverflow:rp},O=await(E.isRTL==null?void 0:E.isRTL(s));let R=await E.getElementRects({reference:a,floating:s,strategy:p}),{x:k,y:L}=gg(R,v,O),U=v,V=0;const K={};for(let Z=0;Z<S.length;Z++){const $=S[Z];if(!$)continue;const{name:oe,fn:me}=$,{x:de,y:ve,data:Te,reset:Ee}=await me({x:k,y:L,initialPlacement:v,placement:U,strategy:p,middlewareData:K,rects:R,platform:T,elements:{reference:a,floating:s}});k=de??k,L=ve??L,K[oe]={...K[oe],...Te},Ee&&V<ip&&(V++,typeof Ee=="object"&&(Ee.placement&&(U=Ee.placement),Ee.rects&&(R=Ee.rects===!0?await E.getElementRects({reference:a,floating:s,strategy:p}):Ee.rects),{x:k,y:L}=gg(R,U,O)),Z=-1)}return{x:k,y:L,placement:U,strategy:p,middlewareData:K}},cp=a=>({name:"arrow",options:a,async fn(s){const{x:f,y:v,placement:p,rects:S,platform:E,elements:T,middlewareData:O}=s,{element:R,padding:k=0}=Yi(a,s)||{};if(R==null)return{};const L=vg(k),U={x:f,y:v},V=yh(p),K=mh(V),Z=await E.getDimensions(R),$=V==="y",oe=$?"top":"left",me=$?"bottom":"right",de=$?"clientHeight":"clientWidth",ve=S.reference[K]+S.reference[V]-U[V]-S.floating[K],Te=U[V]-S.reference[V],Ee=await(E.getOffsetParent==null?void 0:E.getOffsetParent(R));let be=Ee?Ee[de]:0;(!be||!await(E.isElement==null?void 0:E.isElement(Ee)))&&(be=T.floating[de]||S.floating[K]);const ce=ve/2-Te/2,ye=be/2-Z[K]/2-1,He=Oo(L[oe],ye),Ze=Oo(L[me],ye),$e=He,st=be-Z[K]-Ze,Ge=be/2-Z[K]/2+ce,Ve=gh($e,Ge,st),D=!O.arrow&&Yu(p)!=null&&Ge!==Ve&&S.reference[K]/2-(Ge<$e?He:Ze)-Z[K]/2<0,J=D?Ge<$e?Ge-$e:Ge-st:0;return{[V]:U[V]+J,data:{[V]:Ve,centerOffset:Ge-Ve-J,...D&&{alignmentOffset:J}},reset:D}}}),up=function(a){return a===void 0&&(a={}),{name:"flip",options:a,async fn(s){var f,v;const{placement:p,middlewareData:S,rects:E,initialPlacement:T,platform:O,elements:R}=s,{mainAxis:k=!0,crossAxis:L=!0,fallbackPlacements:U,fallbackStrategy:V="bestFit",fallbackAxisSideDirection:K="none",flipAlignment:Z=!0,...$}=Yi(a,s);if((f=S.arrow)!=null&&f.alignmentOffset)return{};const oe=Pi(p),me=Wr(T),de=Pi(T)===T,ve=await(O.isRTL==null?void 0:O.isRTL(R.floating)),Te=U||(de||!Z?[Xf(T)]:$y(T)),Ee=K!=="none";!U&&Ee&&Te.push(...lp(T,Z,K,ve));const be=[T,...Te],ce=await O.detectOverflow(s,$),ye=[];let He=((v=S.flip)==null?void 0:v.overflows)||[];if(k&&ye.push(ce[oe]),L){const Ge=qy(p,E,ve);ye.push(ce[Ge[0]],ce[Ge[1]])}if(He=[...He,{placement:p,overflows:ye}],!ye.every(Ge=>Ge<=0)){var Ze,$e;const Ge=(((Ze=S.flip)==null?void 0:Ze.index)||0)+1,Ve=be[Ge];if(Ve&&(!(L==="alignment"?me!==Wr(Ve):!1)||He.every(we=>Wr(we.placement)===me?we.overflows[0]>0:!0)))return{data:{index:Ge,overflows:He},reset:{placement:Ve}};let D=($e=He.filter(J=>J.overflows[0]<=0).sort((J,we)=>J.overflows[1]-we.overflows[1])[0])==null?void 0:$e.placement;if(!D)switch(V){case"bestFit":{var st;const J=(st=He.filter(we=>{if(Ee){const Pe=Wr(we.placement);return Pe===me||Pe==="y"}return!0}).map(we=>[we.placement,we.overflows.filter(Pe=>Pe>0).reduce((Pe,W)=>Pe+W,0)]).sort((we,Pe)=>we[1]-Pe[1])[0])==null?void 0:st[0];J&&(D=J);break}case"initialPlacement":D=T;break}if(p!==D)return{reset:{placement:D}}}return{}}}};function bg(a,s){return{top:a.top-s.height,right:a.right-s.width,bottom:a.bottom-s.height,left:a.left-s.width}}function mg(a){return Ky.some(s=>a[s]>=0)}const sp=function(a){return a===void 0&&(a={}),{name:"hide",options:a,async fn(s){const{rects:f,platform:v}=s,{strategy:p="referenceHidden",...S}=Yi(a,s);switch(p){case"referenceHidden":{const E=await v.detectOverflow(s,{...S,elementContext:"reference"}),T=bg(E,f.reference);return{data:{referenceHiddenOffsets:T,referenceHidden:mg(T)}}}case"escaped":{const E=await v.detectOverflow(s,{...S,altBoundary:!0}),T=bg(E,f.floating);return{data:{escapedOffsets:T,escaped:mg(T)}}}default:return{}}}}},yg=new Set(["left","top"]);async function fp(a,s){const{placement:f,platform:v,elements:p}=a,S=await(v.isRTL==null?void 0:v.isRTL(p.floating)),E=Pi(f),T=Yu(f),O=Wr(f)==="y",R=yg.has(E)?-1:1,k=S&&O?-1:1,L=Yi(s,a);let{mainAxis:U,crossAxis:V,alignmentAxis:K}=typeof L=="number"?{mainAxis:L,crossAxis:0,alignmentAxis:null}:{mainAxis:L.mainAxis||0,crossAxis:L.crossAxis||0,alignmentAxis:L.alignmentAxis};return T&&typeof K=="number"&&(V=T==="end"?K*-1:K),O?{x:V*k,y:U*R}:{x:U*R,y:V*k}}const dp=function(a){return a===void 0&&(a=0),{name:"offset",options:a,async fn(s){var f,v;const{x:p,y:S,placement:E,middlewareData:T}=s,O=await fp(s,a);return E===((f=T.offset)==null?void 0:f.placement)&&(v=T.arrow)!=null&&v.alignmentOffset?{}:{x:p+O.x,y:S+O.y,data:{...O,placement:E}}}}},hp=function(a){return a===void 0&&(a={}),{name:"shift",options:a,async fn(s){const{x:f,y:v,placement:p,platform:S}=s,{mainAxis:E=!0,crossAxis:T=!1,limiter:O={fn:oe=>{let{x:me,y:de}=oe;return{x:me,y:de}}},...R}=Yi(a,s),k={x:f,y:v},L=await S.detectOverflow(s,R),U=Wr(Pi(p)),V=bh(U);let K=k[V],Z=k[U];if(E){const oe=V==="y"?"top":"left",me=V==="y"?"bottom":"right",de=K+L[oe],ve=K-L[me];K=gh(de,K,ve)}if(T){const oe=U==="y"?"top":"left",me=U==="y"?"bottom":"right",de=Z+L[oe],ve=Z-L[me];Z=gh(de,Z,ve)}const $=O.fn({...s,[V]:K,[U]:Z});return{...$,data:{x:$.x-f,y:$.y-v,enabled:{[V]:E,[U]:T}}}}}},vp=function(a){return a===void 0&&(a={}),{options:a,fn(s){const{x:f,y:v,placement:p,rects:S,middlewareData:E}=s,{offset:T=0,mainAxis:O=!0,crossAxis:R=!0}=Yi(a,s),k={x:f,y:v},L=Wr(p),U=bh(L);let V=k[U],K=k[L];const Z=Yi(T,s),$=typeof Z=="number"?{mainAxis:Z,crossAxis:0}:{mainAxis:0,crossAxis:0,...Z};if(O){const de=U==="y"?"height":"width",ve=S.reference[U]-S.floating[de]+$.mainAxis,Te=S.reference[U]+S.reference[de]-$.mainAxis;V<ve?V=ve:V>Te&&(V=Te)}if(R){var oe,me;const de=U==="y"?"width":"height",ve=yg.has(Pi(p)),Te=S.reference[L]-S.floating[de]+(ve&&((oe=E.offset)==null?void 0:oe[L])||0)+(ve?0:$.crossAxis),Ee=S.reference[L]+S.reference[de]+(ve?0:((me=E.offset)==null?void 0:me[L])||0)-(ve?$.crossAxis:0);K<Te?K=Te:K>Ee&&(K=Ee)}return{[U]:V,[L]:K}}}},gp=function(a){return a===void 0&&(a={}),{name:"size",options:a,async fn(s){var f,v;const{placement:p,rects:S,platform:E,elements:T}=s,{apply:O=()=>{},...R}=Yi(a,s),k=await E.detectOverflow(s,R),L=Pi(p),U=Yu(p),V=Wr(p)==="y",{width:K,height:Z}=S.floating;let $,oe;L==="top"||L==="bottom"?($=L,oe=U===(await(E.isRTL==null?void 0:E.isRTL(T.floating))?"start":"end")?"left":"right"):(oe=L,$=U==="end"?"top":"bottom");const me=Z-k.top-k.bottom,de=K-k.left-k.right,ve=Oo(Z-k[$],me),Te=Oo(K-k[oe],de),Ee=!s.middlewareData.shift;let be=ve,ce=Te;if((f=s.middlewareData.shift)!=null&&f.enabled.x&&(ce=de),(v=s.middlewareData.shift)!=null&&v.enabled.y&&(be=me),Ee&&!U){const He=ga(k.left,0),Ze=ga(k.right,0),$e=ga(k.top,0),st=ga(k.bottom,0);V?ce=K-2*(He!==0||Ze!==0?He+Ze:ga(k.left,k.right)):be=Z-2*($e!==0||st!==0?$e+st:ga(k.top,k.bottom))}await O({...s,availableWidth:ce,availableHeight:be});const ye=await E.getDimensions(T.floating);return K!==ye.width||Z!==ye.height?{reset:{rects:!0}}:{}}}};function Zf(){return typeof window<"u"}function Pu(a){return pg(a)?(a.nodeName||"").toLowerCase():"#document"}function ba(a){var s;return(a==null||(s=a.ownerDocument)==null?void 0:s.defaultView)||window}function Jr(a){var s;return(s=(pg(a)?a.ownerDocument:a.document)||window.document)==null?void 0:s.documentElement}function pg(a){return Zf()?a instanceof Node||a instanceof ba(a).Node:!1}function hr(a){return Zf()?a instanceof Element||a instanceof ba(a).Element:!1}function Gi(a){return Zf()?a instanceof HTMLElement||a instanceof ba(a).HTMLElement:!1}function xg(a){return!Zf()||typeof ShadowRoot>"u"?!1:a instanceof ShadowRoot||a instanceof ba(a).ShadowRoot}function Bs(a){const{overflow:s,overflowX:f,overflowY:v,display:p}=vr(a);return/auto|scroll|overlay|hidden|clip/.test(s+v+f)&&p!=="inline"&&p!=="contents"}function bp(a){return/^(table|td|th)$/.test(Pu(a))}function Vf(a){try{if(a.matches(":popover-open"))return!0}catch{}try{return a.matches(":modal")}catch{return!1}}const mp=/transform|translate|scale|rotate|perspective|filter/,yp=/paint|layout|strict|content/,Jc=a=>!!a&&a!=="none";let xh;function wh(a){const s=hr(a)?vr(a):a;return Jc(s.transform)||Jc(s.translate)||Jc(s.scale)||Jc(s.rotate)||Jc(s.perspective)||!Sh()&&(Jc(s.backdropFilter)||Jc(s.filter))||mp.test(s.willChange||"")||yp.test(s.contain||"")}function pp(a){let s=zo(a);for(;Gi(s)&&!Gu(s);){if(wh(s))return s;if(Vf(s))return null;s=zo(s)}return null}function Sh(){return xh==null&&(xh=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),xh}function Gu(a){return/^(html|body|#document)$/.test(Pu(a))}function vr(a){return ba(a).getComputedStyle(a)}function Qf(a){return hr(a)?{scrollLeft:a.scrollLeft,scrollTop:a.scrollTop}:{scrollLeft:a.scrollX,scrollTop:a.scrollY}}function zo(a){if(Pu(a)==="html")return a;const s=a.assignedSlot||a.parentNode||xg(a)&&a.host||Jr(a);return xg(s)?s.host:s}function wg(a){const s=zo(a);return Gu(s)?a.ownerDocument?a.ownerDocument.body:a.body:Gi(s)&&Bs(s)?s:wg(s)}function Hs(a,s,f){var v;s===void 0&&(s=[]),f===void 0&&(f=!0);const p=wg(a),S=p===((v=a.ownerDocument)==null?void 0:v.body),E=ba(p);if(S){const T=Eh(E);return s.concat(E,E.visualViewport||[],Bs(p)?p:[],T&&f?Hs(T):[])}else return s.concat(p,Hs(p,[],f))}function Eh(a){return a.parent&&Object.getPrototypeOf(a.parent)?a.frameElement:null}function Sg(a){const s=vr(a);let f=parseFloat(s.width)||0,v=parseFloat(s.height)||0;const p=Gi(a),S=p?a.offsetWidth:f,E=p?a.offsetHeight:v,T=Pf(f)!==S||Pf(v)!==E;return T&&(f=S,v=E),{width:f,height:v,$:T}}function Ch(a){return hr(a)?a:a.contextElement}function Xu(a){const s=Ch(a);if(!Gi(s))return Qr(1);const f=s.getBoundingClientRect(),{width:v,height:p,$:S}=Sg(s);let E=(S?Pf(f.width):f.width)/v,T=(S?Pf(f.height):f.height)/p;return(!E||!Number.isFinite(E))&&(E=1),(!T||!Number.isFinite(T))&&(T=1),{x:E,y:T}}const xp=Qr(0);function Eg(a){const s=ba(a);return!Sh()||!s.visualViewport?xp:{x:s.visualViewport.offsetLeft,y:s.visualViewport.offsetTop}}function wp(a,s,f){return s===void 0&&(s=!1),!f||s&&f!==ba(a)?!1:s}function Kc(a,s,f,v){s===void 0&&(s=!1),f===void 0&&(f=!1);const p=a.getBoundingClientRect(),S=Ch(a);let E=Qr(1);s&&(v?hr(v)&&(E=Xu(v)):E=Xu(a));const T=wp(S,f,v)?Eg(S):Qr(0);let O=(p.left+T.x)/E.x,R=(p.top+T.y)/E.y,k=p.width/E.x,L=p.height/E.y;if(S){const U=ba(S),V=v&&hr(v)?ba(v):v;let K=U,Z=Eh(K);for(;Z&&v&&V!==K;){const $=Xu(Z),oe=Z.getBoundingClientRect(),me=vr(Z),de=oe.left+(Z.clientLeft+parseFloat(me.paddingLeft))*$.x,ve=oe.top+(Z.clientTop+parseFloat(me.paddingTop))*$.y;O*=$.x,R*=$.y,k*=$.x,L*=$.y,O+=de,R+=ve,K=ba(Z),Z=Eh(K)}}return If({width:k,height:L,x:O,y:R})}function Wf(a,s){const f=Qf(a).scrollLeft;return s?s.left+f:Kc(Jr(a)).left+f}function Cg(a,s){const f=a.getBoundingClientRect(),v=f.left+s.scrollLeft-Wf(a,f),p=f.top+s.scrollTop;return{x:v,y:p}}function Sp(a){let{elements:s,rect:f,offsetParent:v,strategy:p}=a;const S=p==="fixed",E=Jr(v),T=s?Vf(s.floating):!1;if(v===E||T&&S)return f;let O={scrollLeft:0,scrollTop:0},R=Qr(1);const k=Qr(0),L=Gi(v);if((L||!L&&!S)&&((Pu(v)!=="body"||Bs(E))&&(O=Qf(v)),L)){const V=Kc(v);R=Xu(v),k.x=V.x+v.clientLeft,k.y=V.y+v.clientTop}const U=E&&!L&&!S?Cg(E,O):Qr(0);return{width:f.width*R.x,height:f.height*R.y,x:f.x*R.x-O.scrollLeft*R.x+k.x+U.x,y:f.y*R.y-O.scrollTop*R.y+k.y+U.y}}function Ep(a){return Array.from(a.getClientRects())}function Cp(a){const s=Jr(a),f=Qf(a),v=a.ownerDocument.body,p=ga(s.scrollWidth,s.clientWidth,v.scrollWidth,v.clientWidth),S=ga(s.scrollHeight,s.clientHeight,v.scrollHeight,v.clientHeight);let E=-f.scrollLeft+Wf(a);const T=-f.scrollTop;return vr(v).direction==="rtl"&&(E+=ga(s.clientWidth,v.clientWidth)-p),{width:p,height:S,x:E,y:T}}const Tg=25;function Tp(a,s){const f=ba(a),v=Jr(a),p=f.visualViewport;let S=v.clientWidth,E=v.clientHeight,T=0,O=0;if(p){S=p.width,E=p.height;const k=Sh();(!k||k&&s==="fixed")&&(T=p.offsetLeft,O=p.offsetTop)}const R=Wf(v);if(R<=0){const k=v.ownerDocument,L=k.body,U=getComputedStyle(L),V=k.compatMode==="CSS1Compat"&&parseFloat(U.marginLeft)+parseFloat(U.marginRight)||0,K=Math.abs(v.clientWidth-L.clientWidth-V);K<=Tg&&(S-=K)}else R<=Tg&&(S+=R);return{width:S,height:E,x:T,y:O}}function Rp(a,s){const f=Kc(a,!0,s==="fixed"),v=f.top+a.clientTop,p=f.left+a.clientLeft,S=Gi(a)?Xu(a):Qr(1),E=a.clientWidth*S.x,T=a.clientHeight*S.y,O=p*S.x,R=v*S.y;return{width:E,height:T,x:O,y:R}}function Rg(a,s,f){let v;if(s==="viewport")v=Tp(a,f);else if(s==="document")v=Cp(Jr(a));else if(hr(s))v=Rp(s,f);else{const p=Eg(a);v={x:s.x-p.x,y:s.y-p.y,width:s.width,height:s.height}}return If(v)}function Ag(a,s){const f=zo(a);return f===s||!hr(f)||Gu(f)?!1:vr(f).position==="fixed"||Ag(f,s)}function Ap(a,s){const f=s.get(a);if(f)return f;let v=Hs(a,[],!1).filter(T=>hr(T)&&Pu(T)!=="body"),p=null;const S=vr(a).position==="fixed";let E=S?zo(a):a;for(;hr(E)&&!Gu(E);){const T=vr(E),O=wh(E);!O&&T.position==="fixed"&&(p=null),(S?!O&&!p:!O&&T.position==="static"&&!!p&&(p.position==="absolute"||p.position==="fixed")||Bs(E)&&!O&&Ag(a,E))?v=v.filter(k=>k!==E):p=T,E=zo(E)}return s.set(a,v),v}function _p(a){let{element:s,boundary:f,rootBoundary:v,strategy:p}=a;const E=[...f==="clippingAncestors"?Vf(s)?[]:Ap(s,this._c):[].concat(f),v],T=Rg(s,E[0],p);let O=T.top,R=T.right,k=T.bottom,L=T.left;for(let U=1;U<E.length;U++){const V=Rg(s,E[U],p);O=ga(V.top,O),R=Oo(V.right,R),k=Oo(V.bottom,k),L=ga(V.left,L)}return{width:R-L,height:k-O,x:L,y:O}}function Mp(a){const{width:s,height:f}=Sg(a);return{width:s,height:f}}function Op(a,s,f){const v=Gi(s),p=Jr(s),S=f==="fixed",E=Kc(a,!0,S,s);let T={scrollLeft:0,scrollTop:0};const O=Qr(0);function R(){O.x=Wf(p)}if(v||!v&&!S)if((Pu(s)!=="body"||Bs(p))&&(T=Qf(s)),v){const V=Kc(s,!0,S,s);O.x=V.x+s.clientLeft,O.y=V.y+s.clientTop}else p&&R();S&&!v&&p&&R();const k=p&&!v&&!S?Cg(p,T):Qr(0),L=E.left+T.scrollLeft-O.x-k.x,U=E.top+T.scrollTop-O.y-k.y;return{x:L,y:U,width:E.width,height:E.height}}function Th(a){return vr(a).position==="static"}function _g(a,s){if(!Gi(a)||vr(a).position==="fixed")return null;if(s)return s(a);let f=a.offsetParent;return Jr(a)===f&&(f=f.ownerDocument.body),f}function Mg(a,s){const f=ba(a);if(Vf(a))return f;if(!Gi(a)){let p=zo(a);for(;p&&!Gu(p);){if(hr(p)&&!Th(p))return p;p=zo(p)}return f}let v=_g(a,s);for(;v&&bp(v)&&Th(v);)v=_g(v,s);return v&&Gu(v)&&Th(v)&&!wh(v)?f:v||pp(a)||f}const zp=async function(a){const s=this.getOffsetParent||Mg,f=this.getDimensions,v=await f(a.floating);return{reference:Op(a.reference,await s(a.floating),a.strategy),floating:{x:0,y:0,width:v.width,height:v.height}}};function Dp(a){return vr(a).direction==="rtl"}const kp={convertOffsetParentRelativeRectToViewportRelativeRect:Sp,getDocumentElement:Jr,getClippingRect:_p,getOffsetParent:Mg,getElementRects:zp,getClientRects:Ep,getDimensions:Mp,getScale:Xu,isElement:hr,isRTL:Dp};function Og(a,s){return a.x===s.x&&a.y===s.y&&a.width===s.width&&a.height===s.height}function Np(a,s){let f=null,v;const p=Jr(a);function S(){var T;clearTimeout(v),(T=f)==null||T.disconnect(),f=null}function E(T,O){T===void 0&&(T=!1),O===void 0&&(O=1),S();const R=a.getBoundingClientRect(),{left:k,top:L,width:U,height:V}=R;if(T||s(),!U||!V)return;const K=Gf(L),Z=Gf(p.clientWidth-(k+U)),$=Gf(p.clientHeight-(L+V)),oe=Gf(k),de={rootMargin:-K+"px "+-Z+"px "+-$+"px "+-oe+"px",threshold:ga(0,Oo(1,O))||1};let ve=!0;function Te(Ee){const be=Ee[0].intersectionRatio;if(be!==O){if(!ve)return E();be?E(!1,be):v=setTimeout(()=>{E(!1,1e-7)},1e3)}be===1&&!Og(R,a.getBoundingClientRect())&&E(),ve=!1}try{f=new IntersectionObserver(Te,{...de,root:p.ownerDocument})}catch{f=new IntersectionObserver(Te,de)}f.observe(a)}return E(!0),S}function Lp(a,s,f,v){v===void 0&&(v={});const{ancestorScroll:p=!0,ancestorResize:S=!0,elementResize:E=typeof ResizeObserver=="function",layoutShift:T=typeof IntersectionObserver=="function",animationFrame:O=!1}=v,R=Ch(a),k=p||S?[...R?Hs(R):[],...s?Hs(s):[]]:[];k.forEach(oe=>{p&&oe.addEventListener("scroll",f,{passive:!0}),S&&oe.addEventListener("resize",f)});const L=R&&T?Np(R,f):null;let U=-1,V=null;E&&(V=new ResizeObserver(oe=>{let[me]=oe;me&&me.target===R&&V&&s&&(V.unobserve(s),cancelAnimationFrame(U),U=requestAnimationFrame(()=>{var de;(de=V)==null||de.observe(s)})),f()}),R&&!O&&V.observe(R),s&&V.observe(s));let K,Z=O?Kc(a):null;O&&$();function $(){const oe=Kc(a);Z&&!Og(Z,oe)&&f(),Z=oe,K=requestAnimationFrame($)}return f(),()=>{var oe;k.forEach(me=>{p&&me.removeEventListener("scroll",f),S&&me.removeEventListener("resize",f)}),L?.(),(oe=V)==null||oe.disconnect(),V=null,O&&cancelAnimationFrame(K)}}const Bp=dp,Hp=hp,Up=up,Fp=gp,Yp=sp,zg=cp,Pp=vp,Gp=(a,s,f)=>{const v=new Map,p={platform:kp,...f},S={...p.platform,_c:v};return op(a,s,{...p,platform:S})};var Xp=typeof document<"u",Ip=function(){},Jf=Xp?H.useLayoutEffect:Ip;function Kf(a,s){if(a===s)return!0;if(typeof a!=typeof s)return!1;if(typeof a=="function"&&a.toString()===s.toString())return!0;let f,v,p;if(a&&s&&typeof a=="object"){if(Array.isArray(a)){if(f=a.length,f!==s.length)return!1;for(v=f;v--!==0;)if(!Kf(a[v],s[v]))return!1;return!0}if(p=Object.keys(a),f=p.length,f!==Object.keys(s).length)return!1;for(v=f;v--!==0;)if(!{}.hasOwnProperty.call(s,p[v]))return!1;for(v=f;v--!==0;){const S=p[v];if(!(S==="_owner"&&a.$$typeof)&&!Kf(a[S],s[S]))return!1}return!0}return a!==a&&s!==s}function Dg(a){return typeof window>"u"?1:(a.ownerDocument.defaultView||window).devicePixelRatio||1}function kg(a,s){const f=Dg(a);return Math.round(s*f)/f}function Rh(a){const s=H.useRef(a);return Jf(()=>{s.current=a}),s}function Zp(a){a===void 0&&(a={});const{placement:s="bottom",strategy:f="absolute",middleware:v=[],platform:p,elements:{reference:S,floating:E}={},transform:T=!0,whileElementsMounted:O,open:R}=a,[k,L]=H.useState({x:0,y:0,strategy:f,placement:s,middlewareData:{},isPositioned:!1}),[U,V]=H.useState(v);Kf(U,v)||V(v);const[K,Z]=H.useState(null),[$,oe]=H.useState(null),me=H.useCallback(we=>{we!==Ee.current&&(Ee.current=we,Z(we))},[]),de=H.useCallback(we=>{we!==be.current&&(be.current=we,oe(we))},[]),ve=S||K,Te=E||$,Ee=H.useRef(null),be=H.useRef(null),ce=H.useRef(k),ye=O!=null,He=Rh(O),Ze=Rh(p),$e=Rh(R),st=H.useCallback(()=>{if(!Ee.current||!be.current)return;const we={placement:s,strategy:f,middleware:U};Ze.current&&(we.platform=Ze.current),Gp(Ee.current,be.current,we).then(Pe=>{const W={...Pe,isPositioned:$e.current!==!1};Ge.current&&!Kf(ce.current,W)&&(ce.current=W,Ff.flushSync(()=>{L(W)}))})},[U,s,f,Ze,$e]);Jf(()=>{R===!1&&ce.current.isPositioned&&(ce.current.isPositioned=!1,L(we=>({...we,isPositioned:!1})))},[R]);const Ge=H.useRef(!1);Jf(()=>(Ge.current=!0,()=>{Ge.current=!1}),[]),Jf(()=>{if(ve&&(Ee.current=ve),Te&&(be.current=Te),ve&&Te){if(He.current)return He.current(ve,Te,st);st()}},[ve,Te,st,He,ye]);const Ve=H.useMemo(()=>({reference:Ee,floating:be,setReference:me,setFloating:de}),[me,de]),D=H.useMemo(()=>({reference:ve,floating:Te}),[ve,Te]),J=H.useMemo(()=>{const we={position:f,left:0,top:0};if(!D.floating)return we;const Pe=kg(D.floating,k.x),W=kg(D.floating,k.y);return T?{...we,transform:"translate("+Pe+"px, "+W+"px)",...Dg(D.floating)>=1.5&&{willChange:"transform"}}:{position:f,left:Pe,top:W}},[f,T,D.floating,k.x,k.y]);return H.useMemo(()=>({...k,update:st,refs:Ve,elements:D,floatingStyles:J}),[k,st,Ve,D,J])}const Vp=a=>{function s(f){return{}.hasOwnProperty.call(f,"current")}return{name:"arrow",options:a,fn(f){const{element:v,padding:p}=typeof a=="function"?a(f):a;return v&&s(v)?v.current!=null?zg({element:v.current,padding:p}).fn(f):{}:v?zg({element:v,padding:p}).fn(f):{}}}},Qp=(a,s)=>{const f=Bp(a);return{name:f.name,fn:f.fn,options:[a,s]}},Wp=(a,s)=>{const f=Hp(a);return{name:f.name,fn:f.fn,options:[a,s]}},Jp=(a,s)=>({fn:Pp(a).fn,options:[a,s]}),Kp=(a,s)=>{const f=Up(a);return{name:f.name,fn:f.fn,options:[a,s]}},jp=(a,s)=>{const f=Fp(a);return{name:f.name,fn:f.fn,options:[a,s]}},qp=(a,s)=>{const f=Yp(a);return{name:f.name,fn:f.fn,options:[a,s]}},$p=(a,s)=>{const f=Vp(a);return{name:f.name,fn:f.fn,options:[a,s]}};var ex="Arrow",Ng=H.forwardRef((a,s)=>{const{children:f,width:v=10,height:p=5,...S}=a;return Y.jsx(Ln.svg,{...S,ref:s,width:v,height:p,viewBox:"0 0 30 10",preserveAspectRatio:"none",children:a.asChild?f:Y.jsx("polygon",{points:"0,0 30,0 15,10"})})});Ng.displayName=ex;var tx=Ng;function nx(a){const[s,f]=H.useState(void 0);return Fi(()=>{if(a){f({width:a.offsetWidth,height:a.offsetHeight});const v=new ResizeObserver(p=>{if(!Array.isArray(p)||!p.length)return;const S=p[0];let E,T;if("borderBoxSize"in S){const O=S.borderBoxSize,R=Array.isArray(O)?O[0]:O;E=R.inlineSize,T=R.blockSize}else E=a.offsetWidth,T=a.offsetHeight;f({width:E,height:T})});return v.observe(a,{box:"border-box"}),()=>v.unobserve(a)}else f(void 0)},[a]),s}var Ah="Popper",[Lg,Bg]=Fu(Ah),[lx,Hg]=Lg(Ah),Ug=a=>{const{__scopePopper:s,children:f}=a,[v,p]=H.useState(null);return Y.jsx(lx,{scope:s,anchor:v,onAnchorChange:p,children:f})};Ug.displayName=Ah;var Fg="PopperAnchor",Yg=H.forwardRef((a,s)=>{const{__scopePopper:f,virtualRef:v,...p}=a,S=Hg(Fg,f),E=H.useRef(null),T=yl(s,E),O=H.useRef(null);return H.useEffect(()=>{const R=O.current;O.current=v?.current||E.current,R!==O.current&&S.onAnchorChange(O.current)}),v?null:Y.jsx(Ln.div,{...p,ref:T})});Yg.displayName=Fg;var _h="PopperContent",[ax,rx]=Lg(_h),Pg=H.forwardRef((a,s)=>{const{__scopePopper:f,side:v="bottom",sideOffset:p=0,align:S="center",alignOffset:E=0,arrowPadding:T=0,avoidCollisions:O=!0,collisionBoundary:R=[],collisionPadding:k=0,sticky:L="partial",hideWhenDetached:U=!1,updatePositionStrategy:V="optimized",onPlaced:K,...Z}=a,$=Hg(_h,f),[oe,me]=H.useState(null),de=yl(s,Xe=>me(Xe)),[ve,Te]=H.useState(null),Ee=nx(ve),be=Ee?.width??0,ce=Ee?.height??0,ye=v+(S!=="center"?"-"+S:""),He=typeof k=="number"?k:{top:0,right:0,bottom:0,left:0,...k},Ze=Array.isArray(R)?R:[R],$e=Ze.length>0,st={padding:He,boundary:Ze.filter(ox),altBoundary:$e},{refs:Ge,floatingStyles:Ve,placement:D,isPositioned:J,middlewareData:we}=Zp({strategy:"fixed",placement:ye,whileElementsMounted:(...Xe)=>Lp(...Xe,{animationFrame:V==="always"}),elements:{reference:$.anchor},middleware:[Qp({mainAxis:p+ce,alignmentAxis:E}),O&&Wp({mainAxis:!0,crossAxis:!1,limiter:L==="partial"?Jp():void 0,...st}),O&&Kp({...st}),jp({...st,apply:({elements:Xe,rects:Vt,availableWidth:Qe,availableHeight:ea})=>{const{width:_t,height:Fl}=Vt.reference,Ue=Xe.floating.style;Ue.setProperty("--radix-popper-available-width",`${Qe}px`),Ue.setProperty("--radix-popper-available-height",`${ea}px`),Ue.setProperty("--radix-popper-anchor-width",`${_t}px`),Ue.setProperty("--radix-popper-anchor-height",`${Fl}px`)}}),ve&&$p({element:ve,padding:T}),cx({arrowWidth:be,arrowHeight:ce}),U&&qp({strategy:"referenceHidden",...st})]}),[Pe,W]=Ig(D),_=$l(K);Fi(()=>{J&&_?.()},[J,_]);const se=we.arrow?.x,Ae=we.arrow?.y,Re=we.arrow?.centerOffset!==0,[pe,_e]=H.useState();return Fi(()=>{oe&&_e(window.getComputedStyle(oe).zIndex)},[oe]),Y.jsx("div",{ref:Ge.setFloating,"data-radix-popper-content-wrapper":"",style:{...Ve,transform:J?Ve.transform:"translate(0, -200%)",minWidth:"max-content",zIndex:pe,"--radix-popper-transform-origin":[we.transformOrigin?.x,we.transformOrigin?.y].join(" "),...we.hide?.referenceHidden&&{visibility:"hidden",pointerEvents:"none"}},dir:a.dir,children:Y.jsx(ax,{scope:f,placedSide:Pe,onArrowChange:Te,arrowX:se,arrowY:Ae,shouldHideArrow:Re,children:Y.jsx(Ln.div,{"data-side":Pe,"data-align":W,...Z,ref:de,style:{...Z.style,animation:J?void 0:"none"}})})})});Pg.displayName=_h;var Gg="PopperArrow",ix={top:"bottom",right:"left",bottom:"top",left:"right"},Xg=H.forwardRef(function(s,f){const{__scopePopper:v,...p}=s,S=rx(Gg,v),E=ix[S.placedSide];return Y.jsx("span",{ref:S.onArrowChange,style:{position:"absolute",left:S.arrowX,top:S.arrowY,[E]:0,transformOrigin:{top:"",right:"0 0",bottom:"center 0",left:"100% 0"}[S.placedSide],transform:{top:"translateY(100%)",right:"translateY(50%) rotate(90deg) translateX(-50%)",bottom:"rotate(180deg)",left:"translateY(50%) rotate(-90deg) translateX(50%)"}[S.placedSide],visibility:S.shouldHideArrow?"hidden":void 0},children:Y.jsx(tx,{...p,ref:f,style:{...p.style,display:"block"}})})});Xg.displayName=Gg;function ox(a){return a!==null}var cx=a=>({name:"transformOrigin",options:a,fn(s){const{placement:f,rects:v,middlewareData:p}=s,E=p.arrow?.centerOffset!==0,T=E?0:a.arrowWidth,O=E?0:a.arrowHeight,[R,k]=Ig(f),L={start:"0%",center:"50%",end:"100%"}[k],U=(p.arrow?.x??0)+T/2,V=(p.arrow?.y??0)+O/2;let K="",Z="";return R==="bottom"?(K=E?L:`${U}px`,Z=`${-O}px`):R==="top"?(K=E?L:`${U}px`,Z=`${v.floating.height+O}px`):R==="right"?(K=`${-O}px`,Z=E?L:`${V}px`):R==="left"&&(K=`${v.floating.width+O}px`,Z=E?L:`${V}px`),{data:{x:K,y:Z}}}});function Ig(a){const[s,f="center"]=a.split("-");return[s,f]}var ux=Ug,Zg=Yg,sx=Pg,fx=Xg,dx="Portal",Vg=H.forwardRef((a,s)=>{const{container:f,...v}=a,[p,S]=H.useState(!1);Fi(()=>S(!0),[]);const E=f||p&&globalThis?.document?.body;return E?Cy.createPortal(Y.jsx(Ln.div,{...v,ref:s}),E):null});Vg.displayName=dx;function hx(a,s){return H.useReducer((f,v)=>s[f][v]??f,a)}var Do=a=>{const{present:s,children:f}=a,v=vx(s),p=typeof f=="function"?f({present:v.isPresent}):H.Children.only(f),S=yl(v.ref,gx(p));return typeof f=="function"||v.isPresent?H.cloneElement(p,{ref:S}):null};Do.displayName="Presence";function vx(a){const[s,f]=H.useState(),v=H.useRef(null),p=H.useRef(a),S=H.useRef("none"),E=a?"mounted":"unmounted",[T,O]=hx(E,{mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}});return H.useEffect(()=>{const R=jf(v.current);S.current=T==="mounted"?R:"none"},[T]),Fi(()=>{const R=v.current,k=p.current;if(k!==a){const U=S.current,V=jf(R);a?O("MOUNT"):V==="none"||R?.display==="none"?O("UNMOUNT"):O(k&&U!==V?"ANIMATION_OUT":"UNMOUNT"),p.current=a}},[a,O]),Fi(()=>{if(s){let R;const k=s.ownerDocument.defaultView??window,L=V=>{const Z=jf(v.current).includes(CSS.escape(V.animationName));if(V.target===s&&Z&&(O("ANIMATION_END"),!p.current)){const $=s.style.animationFillMode;s.style.animationFillMode="forwards",R=k.setTimeout(()=>{s.style.animationFillMode==="forwards"&&(s.style.animationFillMode=$)})}},U=V=>{V.target===s&&(S.current=jf(v.current))};return s.addEventListener("animationstart",U),s.addEventListener("animationcancel",L),s.addEventListener("animationend",L),()=>{k.clearTimeout(R),s.removeEventListener("animationstart",U),s.removeEventListener("animationcancel",L),s.removeEventListener("animationend",L)}}else O("ANIMATION_END")},[s,O]),{isPresent:["mounted","unmountSuspended"].includes(T),ref:H.useCallback(R=>{v.current=R?getComputedStyle(R):null,f(R)},[])}}function jf(a){return a?.animationName||"none"}function gx(a){let s=Object.getOwnPropertyDescriptor(a.props,"ref")?.get,f=s&&"isReactWarning"in s&&s.isReactWarning;return f?a.ref:(s=Object.getOwnPropertyDescriptor(a,"ref")?.get,f=s&&"isReactWarning"in s&&s.isReactWarning,f?a.props.ref:a.props.ref||a.ref)}var bx=Zv[" useInsertionEffect ".trim().toString()]||Fi;function Mh({prop:a,defaultProp:s,onChange:f=()=>{},caller:v}){const[p,S,E]=mx({defaultProp:s,onChange:f}),T=a!==void 0,O=T?a:p;{const k=H.useRef(a!==void 0);H.useEffect(()=>{const L=k.current;L!==T&&console.warn(`${v} is changing from ${L?"controlled":"uncontrolled"} to ${T?"controlled":"uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`),k.current=T},[T,v])}const R=H.useCallback(k=>{if(T){const L=yx(k)?k(a):k;L!==a&&E.current?.(L)}else S(k)},[T,a,S,E]);return[O,R]}function mx({defaultProp:a,onChange:s}){const[f,v]=H.useState(a),p=H.useRef(f),S=H.useRef(s);return bx(()=>{S.current=s},[s]),H.useEffect(()=>{p.current!==f&&(S.current?.(f),p.current=f)},[f,p]),[f,v,S]}function yx(a){return typeof a=="function"}var px=function(a){if(typeof document>"u")return null;var s=Array.isArray(a)?a[0]:a;return s.ownerDocument.body},Iu=new WeakMap,qf=new WeakMap,$f={},Oh=0,Qg=function(a){return a&&(a.host||Qg(a.parentNode))},xx=function(a,s){return s.map(function(f){if(a.contains(f))return f;var v=Qg(f);return v&&a.contains(v)?v:(console.error("aria-hidden",f,"in not contained inside",a,". Doing nothing"),null)}).filter(function(f){return!!f})},wx=function(a,s,f,v){var p=xx(s,Array.isArray(a)?a:[a]);$f[f]||($f[f]=new WeakMap);var S=$f[f],E=[],T=new Set,O=new Set(p),R=function(L){!L||T.has(L)||(T.add(L),R(L.parentNode))};p.forEach(R);var k=function(L){!L||O.has(L)||Array.prototype.forEach.call(L.children,function(U){if(T.has(U))k(U);else try{var V=U.getAttribute(v),K=V!==null&&V!=="false",Z=(Iu.get(U)||0)+1,$=(S.get(U)||0)+1;Iu.set(U,Z),S.set(U,$),E.push(U),Z===1&&K&&qf.set(U,!0),$===1&&U.setAttribute(f,"true"),K||U.setAttribute(v,"true")}catch(oe){console.error("aria-hidden: cannot operate on ",U,oe)}})};return k(s),T.clear(),Oh++,function(){E.forEach(function(L){var U=Iu.get(L)-1,V=S.get(L)-1;Iu.set(L,U),S.set(L,V),U||(qf.has(L)||L.removeAttribute(v),qf.delete(L)),V||L.removeAttribute(f)}),Oh--,Oh||(Iu=new WeakMap,Iu=new WeakMap,qf=new WeakMap,$f={})}},Sx=function(a,s,f){f===void 0&&(f="data-aria-hidden");var v=Array.from(Array.isArray(a)?a:[a]),p=px(a);return p?(v.push.apply(v,Array.from(p.querySelectorAll("[aria-live], script"))),wx(v,p,f,"aria-hidden")):function(){return null}},Kr=function(){return Kr=Object.assign||function(s){for(var f,v=1,p=arguments.length;v<p;v++){f=arguments[v];for(var S in f)Object.prototype.hasOwnProperty.call(f,S)&&(s[S]=f[S])}return s},Kr.apply(this,arguments)};function Wg(a,s){var f={};for(var v in a)Object.prototype.hasOwnProperty.call(a,v)&&s.indexOf(v)<0&&(f[v]=a[v]);if(a!=null&&typeof Object.getOwnPropertySymbols=="function")for(var p=0,v=Object.getOwnPropertySymbols(a);p<v.length;p++)s.indexOf(v[p])<0&&Object.prototype.propertyIsEnumerable.call(a,v[p])&&(f[v[p]]=a[v[p]]);return f}function Ex(a,s,f){if(f||arguments.length===2)for(var v=0,p=s.length,S;v<p;v++)(S||!(v in s))&&(S||(S=Array.prototype.slice.call(s,0,v)),S[v]=s[v]);return a.concat(S||Array.prototype.slice.call(s))}typeof SuppressedError=="function"&&SuppressedError;var ed="right-scroll-bar-position",td="width-before-scroll-bar",Cx="with-scroll-bars-hidden",Tx="--removed-body-scroll-bar-size";function zh(a,s){return typeof a=="function"?a(s):a&&(a.current=s),a}function Rx(a,s){var f=H.useState(function(){return{value:a,callback:s,facade:{get current(){return f.value},set current(v){var p=f.value;p!==v&&(f.value=v,f.callback(v,p))}}}})[0];return f.callback=s,f.facade}var Ax=typeof window<"u"?H.useLayoutEffect:H.useEffect,Jg=new WeakMap;function _x(a,s){var f=Rx(null,function(v){return a.forEach(function(p){return zh(p,v)})});return Ax(function(){var v=Jg.get(f);if(v){var p=new Set(v),S=new Set(a),E=f.current;p.forEach(function(T){S.has(T)||zh(T,null)}),S.forEach(function(T){p.has(T)||zh(T,E)})}Jg.set(f,a)},[a]),f}function Mx(a){return a}function Ox(a,s){s===void 0&&(s=Mx);var f=[],v=!1,p={read:function(){if(v)throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");return f.length?f[f.length-1]:a},useMedium:function(S){var E=s(S,v);return f.push(E),function(){f=f.filter(function(T){return T!==E})}},assignSyncMedium:function(S){for(v=!0;f.length;){var E=f;f=[],E.forEach(S)}f={push:function(T){return S(T)},filter:function(){return f}}},assignMedium:function(S){v=!0;var E=[];if(f.length){var T=f;f=[],T.forEach(S),E=f}var O=function(){var k=E;E=[],k.forEach(S)},R=function(){return Promise.resolve().then(O)};R(),f={push:function(k){E.push(k),R()},filter:function(k){return E=E.filter(k),f}}}};return p}function zx(a){a===void 0&&(a={});var s=Ox(null);return s.options=Kr({async:!0,ssr:!1},a),s}var Kg=function(a){var s=a.sideCar,f=Wg(a,["sideCar"]);if(!s)throw new Error("Sidecar: please provide `sideCar` property to import the right car");var v=s.read();if(!v)throw new Error("Sidecar medium not found");return H.createElement(v,Kr({},f))};Kg.isSideCarExport=!0;function Dx(a,s){return a.useMedium(s),Kg}var jg=zx(),Dh=function(){},nd=H.forwardRef(function(a,s){var f=H.useRef(null),v=H.useState({onScrollCapture:Dh,onWheelCapture:Dh,onTouchMoveCapture:Dh}),p=v[0],S=v[1],E=a.forwardProps,T=a.children,O=a.className,R=a.removeScrollBar,k=a.enabled,L=a.shards,U=a.sideCar,V=a.noRelative,K=a.noIsolation,Z=a.inert,$=a.allowPinchZoom,oe=a.as,me=oe===void 0?"div":oe,de=a.gapMode,ve=Wg(a,["forwardProps","children","className","removeScrollBar","enabled","shards","sideCar","noRelative","noIsolation","inert","allowPinchZoom","as","gapMode"]),Te=U,Ee=_x([f,s]),be=Kr(Kr({},ve),p);return H.createElement(H.Fragment,null,k&&H.createElement(Te,{sideCar:jg,removeScrollBar:R,shards:L,noRelative:V,noIsolation:K,inert:Z,setCallbacks:S,allowPinchZoom:!!$,lockRef:f,gapMode:de}),E?H.cloneElement(H.Children.only(T),Kr(Kr({},be),{ref:Ee})):H.createElement(me,Kr({},be,{className:O,ref:Ee}),T))});nd.defaultProps={enabled:!0,removeScrollBar:!0,inert:!1},nd.classNames={fullWidth:td,zeroRight:ed};var kx=function(){if(typeof __webpack_nonce__<"u")return __webpack_nonce__};function Nx(){if(!document)return null;var a=document.createElement("style");a.type="text/css";var s=kx();return s&&a.setAttribute("nonce",s),a}function Lx(a,s){a.styleSheet?a.styleSheet.cssText=s:a.appendChild(document.createTextNode(s))}function Bx(a){var s=document.head||document.getElementsByTagName("head")[0];s.appendChild(a)}var Hx=function(){var a=0,s=null;return{add:function(f){a==0&&(s=Nx())&&(Lx(s,f),Bx(s)),a++},remove:function(){a--,!a&&s&&(s.parentNode&&s.parentNode.removeChild(s),s=null)}}},Ux=function(){var a=Hx();return function(s,f){H.useEffect(function(){return a.add(s),function(){a.remove()}},[s&&f])}},qg=function(){var a=Ux(),s=function(f){var v=f.styles,p=f.dynamic;return a(v,p),null};return s},Fx={left:0,top:0,right:0,gap:0},kh=function(a){return parseInt(a||"",10)||0},Yx=function(a){var s=window.getComputedStyle(document.body),f=s[a==="padding"?"paddingLeft":"marginLeft"],v=s[a==="padding"?"paddingTop":"marginTop"],p=s[a==="padding"?"paddingRight":"marginRight"];return[kh(f),kh(v),kh(p)]},Px=function(a){if(a===void 0&&(a="margin"),typeof window>"u")return Fx;var s=Yx(a),f=document.documentElement.clientWidth,v=window.innerWidth;return{left:s[0],top:s[1],right:s[2],gap:Math.max(0,v-f+s[2]-s[0])}},Gx=qg(),Zu="data-scroll-locked",Xx=function(a,s,f,v){var p=a.left,S=a.top,E=a.right,T=a.gap;return f===void 0&&(f="margin"),`
  .`.concat(Cx,` {
   overflow: hidden `).concat(v,`;
   padding-right: `).concat(T,"px ").concat(v,`;
  }
  body[`).concat(Zu,`] {
    overflow: hidden `).concat(v,`;
    overscroll-behavior: contain;
    `).concat([s&&"position: relative ".concat(v,";"),f==="margin"&&`
    padding-left: `.concat(p,`px;
    padding-top: `).concat(S,`px;
    padding-right: `).concat(E,`px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(T,"px ").concat(v,`;
    `),f==="padding"&&"padding-right: ".concat(T,"px ").concat(v,";")].filter(Boolean).join(""),`
  }
  
  .`).concat(ed,` {
    right: `).concat(T,"px ").concat(v,`;
  }
  
  .`).concat(td,` {
    margin-right: `).concat(T,"px ").concat(v,`;
  }
  
  .`).concat(ed," .").concat(ed,` {
    right: 0 `).concat(v,`;
  }
  
  .`).concat(td," .").concat(td,` {
    margin-right: 0 `).concat(v,`;
  }
  
  body[`).concat(Zu,`] {
    `).concat(Tx,": ").concat(T,`px;
  }
`)},$g=function(){var a=parseInt(document.body.getAttribute(Zu)||"0",10);return isFinite(a)?a:0},Ix=function(){H.useEffect(function(){return document.body.setAttribute(Zu,($g()+1).toString()),function(){var a=$g()-1;a<=0?document.body.removeAttribute(Zu):document.body.setAttribute(Zu,a.toString())}},[])},Zx=function(a){var s=a.noRelative,f=a.noImportant,v=a.gapMode,p=v===void 0?"margin":v;Ix();var S=H.useMemo(function(){return Px(p)},[p]);return H.createElement(Gx,{styles:Xx(S,!s,p,f?"":"!important")})},Nh=!1;if(typeof window<"u")try{var ld=Object.defineProperty({},"passive",{get:function(){return Nh=!0,!0}});window.addEventListener("test",ld,ld),window.removeEventListener("test",ld,ld)}catch{Nh=!1}var Vu=Nh?{passive:!1}:!1,Vx=function(a){return a.tagName==="TEXTAREA"},eb=function(a,s){if(!(a instanceof Element))return!1;var f=window.getComputedStyle(a);return f[s]!=="hidden"&&!(f.overflowY===f.overflowX&&!Vx(a)&&f[s]==="visible")},Qx=function(a){return eb(a,"overflowY")},Wx=function(a){return eb(a,"overflowX")},tb=function(a,s){var f=s.ownerDocument,v=s;do{typeof ShadowRoot<"u"&&v instanceof ShadowRoot&&(v=v.host);var p=nb(a,v);if(p){var S=lb(a,v),E=S[1],T=S[2];if(E>T)return!0}v=v.parentNode}while(v&&v!==f.body);return!1},Jx=function(a){var s=a.scrollTop,f=a.scrollHeight,v=a.clientHeight;return[s,f,v]},Kx=function(a){var s=a.scrollLeft,f=a.scrollWidth,v=a.clientWidth;return[s,f,v]},nb=function(a,s){return a==="v"?Qx(s):Wx(s)},lb=function(a,s){return a==="v"?Jx(s):Kx(s)},jx=function(a,s){return a==="h"&&s==="rtl"?-1:1},qx=function(a,s,f,v,p){var S=jx(a,window.getComputedStyle(s).direction),E=S*v,T=f.target,O=s.contains(T),R=!1,k=E>0,L=0,U=0;do{if(!T)break;var V=lb(a,T),K=V[0],Z=V[1],$=V[2],oe=Z-$-S*K;(K||oe)&&nb(a,T)&&(L+=oe,U+=K);var me=T.parentNode;T=me&&me.nodeType===Node.DOCUMENT_FRAGMENT_NODE?me.host:me}while(!O&&T!==document.body||O&&(s.contains(T)||s===T));return(k&&Math.abs(L)<1||!k&&Math.abs(U)<1)&&(R=!0),R},ad=function(a){return"changedTouches"in a?[a.changedTouches[0].clientX,a.changedTouches[0].clientY]:[0,0]},ab=function(a){return[a.deltaX,a.deltaY]},rb=function(a){return a&&"current"in a?a.current:a},$x=function(a,s){return a[0]===s[0]&&a[1]===s[1]},e1=function(a){return`
  .block-interactivity-`.concat(a,` {pointer-events: none;}
  .allow-interactivity-`).concat(a,` {pointer-events: all;}
`)},t1=0,Qu=[];function n1(a){var s=H.useRef([]),f=H.useRef([0,0]),v=H.useRef(),p=H.useState(t1++)[0],S=H.useState(qg)[0],E=H.useRef(a);H.useEffect(function(){E.current=a},[a]),H.useEffect(function(){if(a.inert){document.body.classList.add("block-interactivity-".concat(p));var Z=Ex([a.lockRef.current],(a.shards||[]).map(rb),!0).filter(Boolean);return Z.forEach(function($){return $.classList.add("allow-interactivity-".concat(p))}),function(){document.body.classList.remove("block-interactivity-".concat(p)),Z.forEach(function($){return $.classList.remove("allow-interactivity-".concat(p))})}}},[a.inert,a.lockRef.current,a.shards]);var T=H.useCallback(function(Z,$){if("touches"in Z&&Z.touches.length===2||Z.type==="wheel"&&Z.ctrlKey)return!E.current.allowPinchZoom;var oe=ad(Z),me=f.current,de="deltaX"in Z?Z.deltaX:me[0]-oe[0],ve="deltaY"in Z?Z.deltaY:me[1]-oe[1],Te,Ee=Z.target,be=Math.abs(de)>Math.abs(ve)?"h":"v";if("touches"in Z&&be==="h"&&Ee.type==="range")return!1;var ce=window.getSelection(),ye=ce&&ce.anchorNode,He=ye?ye===Ee||ye.contains(Ee):!1;if(He)return!1;var Ze=tb(be,Ee);if(!Ze)return!0;if(Ze?Te=be:(Te=be==="v"?"h":"v",Ze=tb(be,Ee)),!Ze)return!1;if(!v.current&&"changedTouches"in Z&&(de||ve)&&(v.current=Te),!Te)return!0;var $e=v.current||Te;return qx($e,$,Z,$e==="h"?de:ve)},[]),O=H.useCallback(function(Z){var $=Z;if(!(!Qu.length||Qu[Qu.length-1]!==S)){var oe="deltaY"in $?ab($):ad($),me=s.current.filter(function(Te){return Te.name===$.type&&(Te.target===$.target||$.target===Te.shadowParent)&&$x(Te.delta,oe)})[0];if(me&&me.should){$.cancelable&&$.preventDefault();return}if(!me){var de=(E.current.shards||[]).map(rb).filter(Boolean).filter(function(Te){return Te.contains($.target)}),ve=de.length>0?T($,de[0]):!E.current.noIsolation;ve&&$.cancelable&&$.preventDefault()}}},[]),R=H.useCallback(function(Z,$,oe,me){var de={name:Z,delta:$,target:oe,should:me,shadowParent:l1(oe)};s.current.push(de),setTimeout(function(){s.current=s.current.filter(function(ve){return ve!==de})},1)},[]),k=H.useCallback(function(Z){f.current=ad(Z),v.current=void 0},[]),L=H.useCallback(function(Z){R(Z.type,ab(Z),Z.target,T(Z,a.lockRef.current))},[]),U=H.useCallback(function(Z){R(Z.type,ad(Z),Z.target,T(Z,a.lockRef.current))},[]);H.useEffect(function(){return Qu.push(S),a.setCallbacks({onScrollCapture:L,onWheelCapture:L,onTouchMoveCapture:U}),document.addEventListener("wheel",O,Vu),document.addEventListener("touchmove",O,Vu),document.addEventListener("touchstart",k,Vu),function(){Qu=Qu.filter(function(Z){return Z!==S}),document.removeEventListener("wheel",O,Vu),document.removeEventListener("touchmove",O,Vu),document.removeEventListener("touchstart",k,Vu)}},[]);var V=a.removeScrollBar,K=a.inert;return H.createElement(H.Fragment,null,K?H.createElement(S,{styles:e1(p)}):null,V?H.createElement(Zx,{noRelative:a.noRelative,gapMode:a.gapMode}):null)}function l1(a){for(var s=null;a!==null;)a instanceof ShadowRoot&&(s=a.host,a=a.host),a=a.parentNode;return s}const a1=Dx(jg,n1);var ib=H.forwardRef(function(a,s){return H.createElement(nd,Kr({},a,{ref:s,sideCar:a1}))});ib.classNames=nd.classNames;var rd="Popover",[ob]=Fu(rd,[Bg]),Us=Bg(),[r1,ko]=ob(rd),cb=a=>{const{__scopePopover:s,children:f,open:v,defaultOpen:p,onOpenChange:S,modal:E=!1}=a,T=Us(s),O=H.useRef(null),[R,k]=H.useState(!1),[L,U]=Mh({prop:v,defaultProp:p??!1,onChange:S,caller:rd});return Y.jsx(ux,{...T,children:Y.jsx(r1,{scope:s,contentId:vh(),triggerRef:O,open:L,onOpenChange:U,onOpenToggle:H.useCallback(()=>U(V=>!V),[U]),hasCustomAnchor:R,onCustomAnchorAdd:H.useCallback(()=>k(!0),[]),onCustomAnchorRemove:H.useCallback(()=>k(!1),[]),modal:E,children:f})})};cb.displayName=rd;var ub="PopoverAnchor",i1=H.forwardRef((a,s)=>{const{__scopePopover:f,...v}=a,p=ko(ub,f),S=Us(f),{onCustomAnchorAdd:E,onCustomAnchorRemove:T}=p;return H.useEffect(()=>(E(),()=>T()),[E,T]),Y.jsx(Zg,{...S,...v,ref:s})});i1.displayName=ub;var sb="PopoverTrigger",fb=H.forwardRef((a,s)=>{const{__scopePopover:f,...v}=a,p=ko(sb,f),S=Us(f),E=yl(s,p.triggerRef),T=Y.jsx(Ln.button,{type:"button","aria-haspopup":"dialog","aria-expanded":p.open,"aria-controls":p.contentId,"data-state":bb(p.open),...v,ref:E,onClick:an(a.onClick,p.onOpenToggle)});return p.hasCustomAnchor?T:Y.jsx(Zg,{asChild:!0,...S,children:T})});fb.displayName=sb;var Lh="PopoverPortal",[o1,c1]=ob(Lh,{forceMount:void 0}),db=a=>{const{__scopePopover:s,forceMount:f,children:v,container:p}=a,S=ko(Lh,s);return Y.jsx(o1,{scope:s,forceMount:f,children:Y.jsx(Do,{present:f||S.open,children:Y.jsx(Vg,{asChild:!0,container:p,children:v})})})};db.displayName=Lh;var Wu="PopoverContent",hb=H.forwardRef((a,s)=>{const f=c1(Wu,a.__scopePopover),{forceMount:v=f.forceMount,...p}=a,S=ko(Wu,a.__scopePopover);return Y.jsx(Do,{present:v||S.open,children:S.modal?Y.jsx(s1,{...p,ref:s}):Y.jsx(f1,{...p,ref:s})})});hb.displayName=Wu;var u1=Yf("PopoverContent.RemoveScroll"),s1=H.forwardRef((a,s)=>{const f=ko(Wu,a.__scopePopover),v=H.useRef(null),p=yl(s,v),S=H.useRef(!1);return H.useEffect(()=>{const E=v.current;if(E)return Sx(E)},[]),Y.jsx(ib,{as:u1,allowPinchZoom:!0,children:Y.jsx(vb,{...a,ref:p,trapFocus:f.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:an(a.onCloseAutoFocus,E=>{E.preventDefault(),S.current||f.triggerRef.current?.focus()}),onPointerDownOutside:an(a.onPointerDownOutside,E=>{const T=E.detail.originalEvent,O=T.button===0&&T.ctrlKey===!0,R=T.button===2||O;S.current=R},{checkForDefaultPrevented:!1}),onFocusOutside:an(a.onFocusOutside,E=>E.preventDefault(),{checkForDefaultPrevented:!1})})})}),f1=H.forwardRef((a,s)=>{const f=ko(Wu,a.__scopePopover),v=H.useRef(!1),p=H.useRef(!1);return Y.jsx(vb,{...a,ref:s,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:S=>{a.onCloseAutoFocus?.(S),S.defaultPrevented||(v.current||f.triggerRef.current?.focus(),S.preventDefault()),v.current=!1,p.current=!1},onInteractOutside:S=>{a.onInteractOutside?.(S),S.defaultPrevented||(v.current=!0,S.detail.originalEvent.type==="pointerdown"&&(p.current=!0));const E=S.target;f.triggerRef.current?.contains(E)&&S.preventDefault(),S.detail.originalEvent.type==="focusin"&&p.current&&S.preventDefault()}})}),vb=H.forwardRef((a,s)=>{const{__scopePopover:f,trapFocus:v,onOpenAutoFocus:p,onCloseAutoFocus:S,disableOutsidePointerEvents:E,onEscapeKeyDown:T,onPointerDownOutside:O,onFocusOutside:R,onInteractOutside:k,...L}=a,U=ko(Wu,f),V=Us(f);return Yy(),Y.jsx(og,{asChild:!0,loop:!0,trapped:v,onMountAutoFocus:p,onUnmountAutoFocus:S,children:Y.jsx(ng,{asChild:!0,disableOutsidePointerEvents:E,onInteractOutside:k,onEscapeKeyDown:T,onPointerDownOutside:O,onFocusOutside:R,onDismiss:()=>U.onOpenChange(!1),children:Y.jsx(sx,{"data-state":bb(U.open),role:"dialog",id:U.contentId,...V,...L,ref:s,style:{...L.style,"--radix-popover-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-popover-content-available-width":"var(--radix-popper-available-width)","--radix-popover-content-available-height":"var(--radix-popper-available-height)","--radix-popover-trigger-width":"var(--radix-popper-anchor-width)","--radix-popover-trigger-height":"var(--radix-popper-anchor-height)"}})})})}),gb="PopoverClose",d1=H.forwardRef((a,s)=>{const{__scopePopover:f,...v}=a,p=ko(gb,f);return Y.jsx(Ln.button,{type:"button",...v,ref:s,onClick:an(a.onClick,()=>p.onOpenChange(!1))})});d1.displayName=gb;var h1="PopoverArrow",v1=H.forwardRef((a,s)=>{const{__scopePopover:f,...v}=a,p=Us(f);return Y.jsx(fx,{...p,...v,ref:s})});v1.displayName=h1;function bb(a){return a?"open":"closed"}var g1=cb,b1=fb,m1=db,y1=hb,p1=H.createContext(void 0);function Bh(a){const s=H.useContext(p1);return a||s||"ltr"}function x1(a,[s,f]){return Math.min(f,Math.max(s,a))}function w1(a,s){return H.useReducer((f,v)=>s[f][v]??f,a)}var Hh="ScrollArea",[mb]=Fu(Hh),[S1,Ja]=mb(Hh),yb=H.forwardRef((a,s)=>{const{__scopeScrollArea:f,type:v="hover",dir:p,scrollHideDelay:S=600,...E}=a,[T,O]=H.useState(null),[R,k]=H.useState(null),[L,U]=H.useState(null),[V,K]=H.useState(null),[Z,$]=H.useState(null),[oe,me]=H.useState(0),[de,ve]=H.useState(0),[Te,Ee]=H.useState(!1),[be,ce]=H.useState(!1),ye=yl(s,Ze=>O(Ze)),He=Bh(p);return Y.jsx(S1,{scope:f,type:v,dir:He,scrollHideDelay:S,scrollArea:T,viewport:R,onViewportChange:k,content:L,onContentChange:U,scrollbarX:V,onScrollbarXChange:K,scrollbarXEnabled:Te,onScrollbarXEnabledChange:Ee,scrollbarY:Z,onScrollbarYChange:$,scrollbarYEnabled:be,onScrollbarYEnabledChange:ce,onCornerWidthChange:me,onCornerHeightChange:ve,children:Y.jsx(Ln.div,{dir:He,...E,ref:ye,style:{position:"relative","--radix-scroll-area-corner-width":oe+"px","--radix-scroll-area-corner-height":de+"px",...a.style}})})});yb.displayName=Hh;var pb="ScrollAreaViewport",xb=H.forwardRef((a,s)=>{const{__scopeScrollArea:f,children:v,nonce:p,...S}=a,E=Ja(pb,f),T=H.useRef(null),O=yl(s,T,E.onViewportChange);return Y.jsxs(Y.Fragment,{children:[Y.jsx("style",{dangerouslySetInnerHTML:{__html:"[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}"},nonce:p}),Y.jsx(Ln.div,{"data-radix-scroll-area-viewport":"",...S,ref:O,style:{overflowX:E.scrollbarXEnabled?"scroll":"hidden",overflowY:E.scrollbarYEnabled?"scroll":"hidden",...a.style},children:Y.jsx("div",{ref:E.onContentChange,style:{minWidth:"100%",display:"table"},children:v})})]})});xb.displayName=pb;var jr="ScrollAreaScrollbar",wb=H.forwardRef((a,s)=>{const{forceMount:f,...v}=a,p=Ja(jr,a.__scopeScrollArea),{onScrollbarXEnabledChange:S,onScrollbarYEnabledChange:E}=p,T=a.orientation==="horizontal";return H.useEffect(()=>(T?S(!0):E(!0),()=>{T?S(!1):E(!1)}),[T,S,E]),p.type==="hover"?Y.jsx(E1,{...v,ref:s,forceMount:f}):p.type==="scroll"?Y.jsx(C1,{...v,ref:s,forceMount:f}):p.type==="auto"?Y.jsx(Sb,{...v,ref:s,forceMount:f}):p.type==="always"?Y.jsx(Uh,{...v,ref:s}):null});wb.displayName=jr;var E1=H.forwardRef((a,s)=>{const{forceMount:f,...v}=a,p=Ja(jr,a.__scopeScrollArea),[S,E]=H.useState(!1);return H.useEffect(()=>{const T=p.scrollArea;let O=0;if(T){const R=()=>{window.clearTimeout(O),E(!0)},k=()=>{O=window.setTimeout(()=>E(!1),p.scrollHideDelay)};return T.addEventListener("pointerenter",R),T.addEventListener("pointerleave",k),()=>{window.clearTimeout(O),T.removeEventListener("pointerenter",R),T.removeEventListener("pointerleave",k)}}},[p.scrollArea,p.scrollHideDelay]),Y.jsx(Do,{present:f||S,children:Y.jsx(Sb,{"data-state":S?"visible":"hidden",...v,ref:s})})}),C1=H.forwardRef((a,s)=>{const{forceMount:f,...v}=a,p=Ja(jr,a.__scopeScrollArea),S=a.orientation==="horizontal",E=ud(()=>O("SCROLL_END"),100),[T,O]=w1("hidden",{hidden:{SCROLL:"scrolling"},scrolling:{SCROLL_END:"idle",POINTER_ENTER:"interacting"},interacting:{SCROLL:"interacting",POINTER_LEAVE:"idle"},idle:{HIDE:"hidden",SCROLL:"scrolling",POINTER_ENTER:"interacting"}});return H.useEffect(()=>{if(T==="idle"){const R=window.setTimeout(()=>O("HIDE"),p.scrollHideDelay);return()=>window.clearTimeout(R)}},[T,p.scrollHideDelay,O]),H.useEffect(()=>{const R=p.viewport,k=S?"scrollLeft":"scrollTop";if(R){let L=R[k];const U=()=>{const V=R[k];L!==V&&(O("SCROLL"),E()),L=V};return R.addEventListener("scroll",U),()=>R.removeEventListener("scroll",U)}},[p.viewport,S,O,E]),Y.jsx(Do,{present:f||T!=="hidden",children:Y.jsx(Uh,{"data-state":T==="hidden"?"hidden":"visible",...v,ref:s,onPointerEnter:an(a.onPointerEnter,()=>O("POINTER_ENTER")),onPointerLeave:an(a.onPointerLeave,()=>O("POINTER_LEAVE"))})})}),Sb=H.forwardRef((a,s)=>{const f=Ja(jr,a.__scopeScrollArea),{forceMount:v,...p}=a,[S,E]=H.useState(!1),T=a.orientation==="horizontal",O=ud(()=>{if(f.viewport){const R=f.viewport.offsetWidth<f.viewport.scrollWidth,k=f.viewport.offsetHeight<f.viewport.scrollHeight;E(T?R:k)}},10);return Ju(f.viewport,O),Ju(f.content,O),Y.jsx(Do,{present:v||S,children:Y.jsx(Uh,{"data-state":S?"visible":"hidden",...p,ref:s})})}),Uh=H.forwardRef((a,s)=>{const{orientation:f="vertical",...v}=a,p=Ja(jr,a.__scopeScrollArea),S=H.useRef(null),E=H.useRef(0),[T,O]=H.useState({content:0,viewport:0,scrollbar:{size:0,paddingStart:0,paddingEnd:0}}),R=Rb(T.viewport,T.content),k={...v,sizes:T,onSizesChange:O,hasThumb:R>0&&R<1,onThumbChange:U=>S.current=U,onThumbPointerUp:()=>E.current=0,onThumbPointerDown:U=>E.current=U};function L(U,V){return z1(U,E.current,T,V)}return f==="horizontal"?Y.jsx(T1,{...k,ref:s,onThumbPositionChange:()=>{if(p.viewport&&S.current){const U=p.viewport.scrollLeft,V=Ab(U,T,p.dir);S.current.style.transform=`translate3d(${V}px, 0, 0)`}},onWheelScroll:U=>{p.viewport&&(p.viewport.scrollLeft=U)},onDragScroll:U=>{p.viewport&&(p.viewport.scrollLeft=L(U,p.dir))}}):f==="vertical"?Y.jsx(R1,{...k,ref:s,onThumbPositionChange:()=>{if(p.viewport&&S.current){const U=p.viewport.scrollTop,V=Ab(U,T);S.current.style.transform=`translate3d(0, ${V}px, 0)`}},onWheelScroll:U=>{p.viewport&&(p.viewport.scrollTop=U)},onDragScroll:U=>{p.viewport&&(p.viewport.scrollTop=L(U))}}):null}),T1=H.forwardRef((a,s)=>{const{sizes:f,onSizesChange:v,...p}=a,S=Ja(jr,a.__scopeScrollArea),[E,T]=H.useState(),O=H.useRef(null),R=yl(s,O,S.onScrollbarXChange);return H.useEffect(()=>{O.current&&T(getComputedStyle(O.current))},[O]),Y.jsx(Cb,{"data-orientation":"horizontal",...p,ref:R,sizes:f,style:{bottom:0,left:S.dir==="rtl"?"var(--radix-scroll-area-corner-width)":0,right:S.dir==="ltr"?"var(--radix-scroll-area-corner-width)":0,"--radix-scroll-area-thumb-width":cd(f)+"px",...a.style},onThumbPointerDown:k=>a.onThumbPointerDown(k.x),onDragScroll:k=>a.onDragScroll(k.x),onWheelScroll:(k,L)=>{if(S.viewport){const U=S.viewport.scrollLeft+k.deltaX;a.onWheelScroll(U),Mb(U,L)&&k.preventDefault()}},onResize:()=>{O.current&&S.viewport&&E&&v({content:S.viewport.scrollWidth,viewport:S.viewport.offsetWidth,scrollbar:{size:O.current.clientWidth,paddingStart:od(E.paddingLeft),paddingEnd:od(E.paddingRight)}})}})}),R1=H.forwardRef((a,s)=>{const{sizes:f,onSizesChange:v,...p}=a,S=Ja(jr,a.__scopeScrollArea),[E,T]=H.useState(),O=H.useRef(null),R=yl(s,O,S.onScrollbarYChange);return H.useEffect(()=>{O.current&&T(getComputedStyle(O.current))},[O]),Y.jsx(Cb,{"data-orientation":"vertical",...p,ref:R,sizes:f,style:{top:0,right:S.dir==="ltr"?0:void 0,left:S.dir==="rtl"?0:void 0,bottom:"var(--radix-scroll-area-corner-height)","--radix-scroll-area-thumb-height":cd(f)+"px",...a.style},onThumbPointerDown:k=>a.onThumbPointerDown(k.y),onDragScroll:k=>a.onDragScroll(k.y),onWheelScroll:(k,L)=>{if(S.viewport){const U=S.viewport.scrollTop+k.deltaY;a.onWheelScroll(U),Mb(U,L)&&k.preventDefault()}},onResize:()=>{O.current&&S.viewport&&E&&v({content:S.viewport.scrollHeight,viewport:S.viewport.offsetHeight,scrollbar:{size:O.current.clientHeight,paddingStart:od(E.paddingTop),paddingEnd:od(E.paddingBottom)}})}})}),[A1,Eb]=mb(jr),Cb=H.forwardRef((a,s)=>{const{__scopeScrollArea:f,sizes:v,hasThumb:p,onThumbChange:S,onThumbPointerUp:E,onThumbPointerDown:T,onThumbPositionChange:O,onDragScroll:R,onWheelScroll:k,onResize:L,...U}=a,V=Ja(jr,f),[K,Z]=H.useState(null),$=yl(s,ye=>Z(ye)),oe=H.useRef(null),me=H.useRef(""),de=V.viewport,ve=v.content-v.viewport,Te=$l(k),Ee=$l(O),be=ud(L,10);function ce(ye){if(oe.current){const He=ye.clientX-oe.current.left,Ze=ye.clientY-oe.current.top;R({x:He,y:Ze})}}return H.useEffect(()=>{const ye=He=>{const Ze=He.target;K?.contains(Ze)&&Te(He,ve)};return document.addEventListener("wheel",ye,{passive:!1}),()=>document.removeEventListener("wheel",ye,{passive:!1})},[de,K,ve,Te]),H.useEffect(Ee,[v,Ee]),Ju(K,be),Ju(V.content,be),Y.jsx(A1,{scope:f,scrollbar:K,hasThumb:p,onThumbChange:$l(S),onThumbPointerUp:$l(E),onThumbPositionChange:Ee,onThumbPointerDown:$l(T),children:Y.jsx(Ln.div,{...U,ref:$,style:{position:"absolute",...U.style},onPointerDown:an(a.onPointerDown,ye=>{ye.button===0&&(ye.target.setPointerCapture(ye.pointerId),oe.current=K.getBoundingClientRect(),me.current=document.body.style.webkitUserSelect,document.body.style.webkitUserSelect="none",V.viewport&&(V.viewport.style.scrollBehavior="auto"),ce(ye))}),onPointerMove:an(a.onPointerMove,ce),onPointerUp:an(a.onPointerUp,ye=>{const He=ye.target;He.hasPointerCapture(ye.pointerId)&&He.releasePointerCapture(ye.pointerId),document.body.style.webkitUserSelect=me.current,V.viewport&&(V.viewport.style.scrollBehavior=""),oe.current=null})})})}),id="ScrollAreaThumb",Tb=H.forwardRef((a,s)=>{const{forceMount:f,...v}=a,p=Eb(id,a.__scopeScrollArea);return Y.jsx(Do,{present:f||p.hasThumb,children:Y.jsx(_1,{ref:s,...v})})}),_1=H.forwardRef((a,s)=>{const{__scopeScrollArea:f,style:v,...p}=a,S=Ja(id,f),E=Eb(id,f),{onThumbPositionChange:T}=E,O=yl(s,L=>E.onThumbChange(L)),R=H.useRef(void 0),k=ud(()=>{R.current&&(R.current(),R.current=void 0)},100);return H.useEffect(()=>{const L=S.viewport;if(L){const U=()=>{if(k(),!R.current){const V=D1(L,T);R.current=V,T()}};return T(),L.addEventListener("scroll",U),()=>L.removeEventListener("scroll",U)}},[S.viewport,k,T]),Y.jsx(Ln.div,{"data-state":E.hasThumb?"visible":"hidden",...p,ref:O,style:{width:"var(--radix-scroll-area-thumb-width)",height:"var(--radix-scroll-area-thumb-height)",...v},onPointerDownCapture:an(a.onPointerDownCapture,L=>{const V=L.target.getBoundingClientRect(),K=L.clientX-V.left,Z=L.clientY-V.top;E.onThumbPointerDown({x:K,y:Z})}),onPointerUp:an(a.onPointerUp,E.onThumbPointerUp)})});Tb.displayName=id;var Fh="ScrollAreaCorner",M1=H.forwardRef((a,s)=>{const f=Ja(Fh,a.__scopeScrollArea),v=!!(f.scrollbarX&&f.scrollbarY);return f.type!=="scroll"&&v?Y.jsx(O1,{...a,ref:s}):null});M1.displayName=Fh;var O1=H.forwardRef((a,s)=>{const{__scopeScrollArea:f,...v}=a,p=Ja(Fh,f),[S,E]=H.useState(0),[T,O]=H.useState(0),R=!!(S&&T);return Ju(p.scrollbarX,()=>{const k=p.scrollbarX?.offsetHeight||0;p.onCornerHeightChange(k),O(k)}),Ju(p.scrollbarY,()=>{const k=p.scrollbarY?.offsetWidth||0;p.onCornerWidthChange(k),E(k)}),R?Y.jsx(Ln.div,{...v,ref:s,style:{width:S,height:T,position:"absolute",right:p.dir==="ltr"?0:void 0,left:p.dir==="rtl"?0:void 0,bottom:0,...a.style}}):null});function od(a){return a?parseInt(a,10):0}function Rb(a,s){const f=a/s;return isNaN(f)?0:f}function cd(a){const s=Rb(a.viewport,a.content),f=a.scrollbar.paddingStart+a.scrollbar.paddingEnd,v=(a.scrollbar.size-f)*s;return Math.max(v,18)}function z1(a,s,f,v="ltr"){const p=cd(f),S=p/2,E=s||S,T=p-E,O=f.scrollbar.paddingStart+E,R=f.scrollbar.size-f.scrollbar.paddingEnd-T,k=f.content-f.viewport,L=v==="ltr"?[0,k]:[k*-1,0];return _b([O,R],L)(a)}function Ab(a,s,f="ltr"){const v=cd(s),p=s.scrollbar.paddingStart+s.scrollbar.paddingEnd,S=s.scrollbar.size-p,E=s.content-s.viewport,T=S-v,O=f==="ltr"?[0,E]:[E*-1,0],R=x1(a,O);return _b([0,E],[0,T])(R)}function _b(a,s){return f=>{if(a[0]===a[1]||s[0]===s[1])return s[0];const v=(s[1]-s[0])/(a[1]-a[0]);return s[0]+v*(f-a[0])}}function Mb(a,s){return a>0&&a<s}var D1=(a,s=()=>{})=>{let f={left:a.scrollLeft,top:a.scrollTop},v=0;return(function p(){const S={left:a.scrollLeft,top:a.scrollTop},E=f.left!==S.left,T=f.top!==S.top;(E||T)&&s(),f=S,v=window.requestAnimationFrame(p)})(),()=>window.cancelAnimationFrame(v)};function ud(a,s){const f=$l(a),v=H.useRef(0);return H.useEffect(()=>()=>window.clearTimeout(v.current),[]),H.useCallback(()=>{window.clearTimeout(v.current),v.current=window.setTimeout(f,s)},[f,s])}function Ju(a,s){const f=$l(s);Fi(()=>{let v=0;if(a){const p=new ResizeObserver(()=>{cancelAnimationFrame(v),v=window.requestAnimationFrame(f)});return p.observe(a),()=>{window.cancelAnimationFrame(v),p.unobserve(a)}}},[a,f])}var k1=yb,N1=xb,L1=wb,B1=Tb;function H1(a){const s=a+"CollectionProvider",[f,v]=Fu(s),[p,S]=f(s,{collectionRef:{current:null},itemMap:new Map}),E=Z=>{const{scope:$,children:oe}=Z,me=_o.useRef(null),de=_o.useRef(new Map).current;return Y.jsx(p,{scope:$,itemMap:de,collectionRef:me,children:oe})};E.displayName=s;const T=a+"CollectionSlot",O=Yf(T),R=_o.forwardRef((Z,$)=>{const{scope:oe,children:me}=Z,de=S(T,oe),ve=yl($,de.collectionRef);return Y.jsx(O,{ref:ve,children:me})});R.displayName=T;const k=a+"CollectionItemSlot",L="data-radix-collection-item",U=Yf(k),V=_o.forwardRef((Z,$)=>{const{scope:oe,children:me,...de}=Z,ve=_o.useRef(null),Te=yl($,ve),Ee=S(k,oe);return _o.useEffect(()=>(Ee.itemMap.set(ve,{ref:ve,...de}),()=>void Ee.itemMap.delete(ve))),Y.jsx(U,{[L]:"",ref:Te,children:me})});V.displayName=k;function K(Z){const $=S(a+"CollectionConsumer",Z);return _o.useCallback(()=>{const me=$.collectionRef.current;if(!me)return[];const de=Array.from(me.querySelectorAll(`[${L}]`));return Array.from($.itemMap.values()).sort((Ee,be)=>de.indexOf(Ee.ref.current)-de.indexOf(be.ref.current))},[$.collectionRef,$.itemMap])}return[{Provider:E,Slot:R,ItemSlot:V},K,v]}var Yh="rovingFocusGroup.onEntryFocus",U1={bubbles:!1,cancelable:!0},Fs="RovingFocusGroup",[Ph,Ob,F1]=H1(Fs),[Y1,zb]=Fu(Fs,[F1]),[P1,G1]=Y1(Fs),Db=H.forwardRef((a,s)=>Y.jsx(Ph.Provider,{scope:a.__scopeRovingFocusGroup,children:Y.jsx(Ph.Slot,{scope:a.__scopeRovingFocusGroup,children:Y.jsx(X1,{...a,ref:s})})}));Db.displayName=Fs;var X1=H.forwardRef((a,s)=>{const{__scopeRovingFocusGroup:f,orientation:v,loop:p=!1,dir:S,currentTabStopId:E,defaultCurrentTabStopId:T,onCurrentTabStopIdChange:O,onEntryFocus:R,preventScrollOnEntryFocus:k=!1,...L}=a,U=H.useRef(null),V=yl(s,U),K=Bh(S),[Z,$]=Mh({prop:E,defaultProp:T??null,onChange:O,caller:Fs}),[oe,me]=H.useState(!1),de=$l(R),ve=Ob(f),Te=H.useRef(!1),[Ee,be]=H.useState(0);return H.useEffect(()=>{const ce=U.current;if(ce)return ce.addEventListener(Yh,de),()=>ce.removeEventListener(Yh,de)},[de]),Y.jsx(P1,{scope:f,orientation:v,dir:K,loop:p,currentTabStopId:Z,onItemFocus:H.useCallback(ce=>$(ce),[$]),onItemShiftTab:H.useCallback(()=>me(!0),[]),onFocusableItemAdd:H.useCallback(()=>be(ce=>ce+1),[]),onFocusableItemRemove:H.useCallback(()=>be(ce=>ce-1),[]),children:Y.jsx(Ln.div,{tabIndex:oe||Ee===0?-1:0,"data-orientation":v,...L,ref:V,style:{outline:"none",...a.style},onMouseDown:an(a.onMouseDown,()=>{Te.current=!0}),onFocus:an(a.onFocus,ce=>{const ye=!Te.current;if(ce.target===ce.currentTarget&&ye&&!oe){const He=new CustomEvent(Yh,U1);if(ce.currentTarget.dispatchEvent(He),!He.defaultPrevented){const Ze=ve().filter(D=>D.focusable),$e=Ze.find(D=>D.active),st=Ze.find(D=>D.id===Z),Ve=[$e,st,...Ze].filter(Boolean).map(D=>D.ref.current);Lb(Ve,k)}}Te.current=!1}),onBlur:an(a.onBlur,()=>me(!1))})})}),kb="RovingFocusGroupItem",Nb=H.forwardRef((a,s)=>{const{__scopeRovingFocusGroup:f,focusable:v=!0,active:p=!1,tabStopId:S,children:E,...T}=a,O=vh(),R=S||O,k=G1(kb,f),L=k.currentTabStopId===R,U=Ob(f),{onFocusableItemAdd:V,onFocusableItemRemove:K,currentTabStopId:Z}=k;return H.useEffect(()=>{if(v)return V(),()=>K()},[v,V,K]),Y.jsx(Ph.ItemSlot,{scope:f,id:R,focusable:v,active:p,children:Y.jsx(Ln.span,{tabIndex:L?0:-1,"data-orientation":k.orientation,...T,ref:s,onMouseDown:an(a.onMouseDown,$=>{v?k.onItemFocus(R):$.preventDefault()}),onFocus:an(a.onFocus,()=>k.onItemFocus(R)),onKeyDown:an(a.onKeyDown,$=>{if($.key==="Tab"&&$.shiftKey){k.onItemShiftTab();return}if($.target!==$.currentTarget)return;const oe=V1($,k.orientation,k.dir);if(oe!==void 0){if($.metaKey||$.ctrlKey||$.altKey||$.shiftKey)return;$.preventDefault();let de=U().filter(ve=>ve.focusable).map(ve=>ve.ref.current);if(oe==="last")de.reverse();else if(oe==="prev"||oe==="next"){oe==="prev"&&de.reverse();const ve=de.indexOf($.currentTarget);de=k.loop?Q1(de,ve+1):de.slice(ve+1)}setTimeout(()=>Lb(de))}}),children:typeof E=="function"?E({isCurrentTabStop:L,hasTabStop:Z!=null}):E})})});Nb.displayName=kb;var I1={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function Z1(a,s){return s!=="rtl"?a:a==="ArrowLeft"?"ArrowRight":a==="ArrowRight"?"ArrowLeft":a}function V1(a,s,f){const v=Z1(a.key,f);if(!(s==="vertical"&&["ArrowLeft","ArrowRight"].includes(v))&&!(s==="horizontal"&&["ArrowUp","ArrowDown"].includes(v)))return I1[v]}function Lb(a,s=!1){const f=document.activeElement;for(const v of a)if(v===f||(v.focus({preventScroll:s}),document.activeElement!==f))return}function Q1(a,s){return a.map((f,v)=>a[(s+v)%a.length])}var W1=Db,J1=Nb,sd="Tabs",[K1]=Fu(sd,[zb]),Bb=zb(),[j1,Gh]=K1(sd),Hb=H.forwardRef((a,s)=>{const{__scopeTabs:f,value:v,onValueChange:p,defaultValue:S,orientation:E="horizontal",dir:T,activationMode:O="automatic",...R}=a,k=Bh(T),[L,U]=Mh({prop:v,onChange:p,defaultProp:S??"",caller:sd});return Y.jsx(j1,{scope:f,baseId:vh(),value:L,onValueChange:U,orientation:E,dir:k,activationMode:O,children:Y.jsx(Ln.div,{dir:k,"data-orientation":E,...R,ref:s})})});Hb.displayName=sd;var Ub="TabsList",Fb=H.forwardRef((a,s)=>{const{__scopeTabs:f,loop:v=!0,...p}=a,S=Gh(Ub,f),E=Bb(f);return Y.jsx(W1,{asChild:!0,...E,orientation:S.orientation,dir:S.dir,loop:v,children:Y.jsx(Ln.div,{role:"tablist","aria-orientation":S.orientation,...p,ref:s})})});Fb.displayName=Ub;var Yb="TabsTrigger",Pb=H.forwardRef((a,s)=>{const{__scopeTabs:f,value:v,disabled:p=!1,...S}=a,E=Gh(Yb,f),T=Bb(f),O=Xb(E.baseId,v),R=Ib(E.baseId,v),k=v===E.value;return Y.jsx(J1,{asChild:!0,...T,focusable:!p,active:k,children:Y.jsx(Ln.button,{type:"button",role:"tab","aria-selected":k,"aria-controls":R,"data-state":k?"active":"inactive","data-disabled":p?"":void 0,disabled:p,id:O,...S,ref:s,onMouseDown:an(a.onMouseDown,L=>{!p&&L.button===0&&L.ctrlKey===!1?E.onValueChange(v):L.preventDefault()}),onKeyDown:an(a.onKeyDown,L=>{[" ","Enter"].includes(L.key)&&E.onValueChange(v)}),onFocus:an(a.onFocus,()=>{const L=E.activationMode!=="manual";!k&&!p&&L&&E.onValueChange(v)})})})});Pb.displayName=Yb;var Gb="TabsContent",q1=H.forwardRef((a,s)=>{const{__scopeTabs:f,value:v,forceMount:p,children:S,...E}=a,T=Gh(Gb,f),O=Xb(T.baseId,v),R=Ib(T.baseId,v),k=v===T.value,L=H.useRef(k);return H.useEffect(()=>{const U=requestAnimationFrame(()=>L.current=!1);return()=>cancelAnimationFrame(U)},[]),Y.jsx(Do,{present:p||k,children:({present:U})=>Y.jsx(Ln.div,{"data-state":k?"active":"inactive","data-orientation":T.orientation,role:"tabpanel","aria-labelledby":O,hidden:!U,id:R,tabIndex:0,...E,ref:s,style:{...a.style,animationDuration:L.current?"0s":void 0},children:U&&S})})});q1.displayName=Gb;function Xb(a,s){return`${a}-trigger-${s}`}function Ib(a,s){return`${a}-content-${s}`}var $1=Hb,ew=Fb,tw=Pb;/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nw=a=>a.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),lw=a=>a.replace(/^([A-Z])|[\s-_]+(\w)/g,(s,f,v)=>v?v.toUpperCase():f.toLowerCase()),Zb=a=>{const s=lw(a);return s.charAt(0).toUpperCase()+s.slice(1)},Vb=(...a)=>a.filter((s,f,v)=>!!s&&s.trim()!==""&&v.indexOf(s)===f).join(" ").trim(),aw=a=>{for(const s in a)if(s.startsWith("aria-")||s==="role"||s==="title")return!0};/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var rw={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iw=H.forwardRef(({color:a="currentColor",size:s=24,strokeWidth:f=2,absoluteStrokeWidth:v,className:p="",children:S,iconNode:E,...T},O)=>H.createElement("svg",{ref:O,...rw,width:s,height:s,stroke:a,strokeWidth:v?Number(f)*24/Number(s):f,className:Vb("lucide",p),...!S&&!aw(T)&&{"aria-hidden":"true"},...T},[...E.map(([R,k])=>H.createElement(R,k)),...Array.isArray(S)?S:[S]]));/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ka=(a,s)=>{const f=H.forwardRef(({className:v,...p},S)=>H.createElement(iw,{ref:S,iconNode:s,className:Vb(`lucide-${nw(Zb(a))}`,`lucide-${a}`,v),...p}));return f.displayName=Zb(a),f};/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qb=Ka("arrow-up",[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]]);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wb=Ka("bug",[["path",{d:"m8 2 1.88 1.88",key:"fmnt4t"}],["path",{d:"M14.12 3.88 16 2",key:"qol33r"}],["path",{d:"M9 7.13v-1a3.003 3.003 0 1 1 6 0v1",key:"d7y7pr"}],["path",{d:"M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6",key:"xs1cw7"}],["path",{d:"M12 20v-9",key:"1qisl0"}],["path",{d:"M6.53 9C4.6 8.8 3 7.1 3 5",key:"32zzws"}],["path",{d:"M6 13H2",key:"82j7cp"}],["path",{d:"M3 21c0-2.1 1.7-3.9 3.8-4",key:"4p0ekp"}],["path",{d:"M20.97 5c0 2.1-1.6 3.8-3.5 4",key:"18gb23"}],["path",{d:"M22 13h-4",key:"1jl80f"}],["path",{d:"M17.2 17c2.1.1 3.8 1.9 3.8 4",key:"k3fwyw"}]]);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fd=Ka("calendar-days",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]]);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dd=Ka("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jb=Ka("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kb=Ka("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jb=Ka("earth",[["path",{d:"M21.54 15H17a2 2 0 0 0-2 2v4.54",key:"1djwo0"}],["path",{d:"M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",key:"1tzkfa"}],["path",{d:"M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05",key:"14pb5j"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hd=Ka("link-2",[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2",key:"8i5ue5"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2",key:"1b9ql8"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qb=Ka("refresh-cw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ku=Ka("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $b=Ka("sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e0=Ka("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);function t0(a){var s,f,v="";if(typeof a=="string"||typeof a=="number")v+=a;else if(typeof a=="object")if(Array.isArray(a)){var p=a.length;for(s=0;s<p;s++)a[s]&&(f=t0(a[s]))&&(v&&(v+=" "),v+=f)}else for(f in a)a[f]&&(v&&(v+=" "),v+=f);return v}function n0(){for(var a,s,f=0,v="",p=arguments.length;f<p;f++)(a=arguments[f])&&(s=t0(a))&&(v&&(v+=" "),v+=s);return v}const ow=(a,s)=>{const f=new Array(a.length+s.length);for(let v=0;v<a.length;v++)f[v]=a[v];for(let v=0;v<s.length;v++)f[a.length+v]=s[v];return f},cw=(a,s)=>({classGroupId:a,validator:s}),l0=(a=new Map,s=null,f)=>({nextPart:a,validators:s,classGroupId:f}),vd="-",a0=[],uw="arbitrary..",sw=a=>{const s=dw(a),{conflictingClassGroups:f,conflictingClassGroupModifiers:v}=a;return{getClassGroupId:E=>{if(E.startsWith("[")&&E.endsWith("]"))return fw(E);const T=E.split(vd),O=T[0]===""&&T.length>1?1:0;return r0(T,O,s)},getConflictingClassGroupIds:(E,T)=>{if(T){const O=v[E],R=f[E];return O?R?ow(R,O):O:R||a0}return f[E]||a0}}},r0=(a,s,f)=>{if(a.length-s===0)return f.classGroupId;const p=a[s],S=f.nextPart.get(p);if(S){const R=r0(a,s+1,S);if(R)return R}const E=f.validators;if(E===null)return;const T=s===0?a.join(vd):a.slice(s).join(vd),O=E.length;for(let R=0;R<O;R++){const k=E[R];if(k.validator(T))return k.classGroupId}},fw=a=>a.slice(1,-1).indexOf(":")===-1?void 0:(()=>{const s=a.slice(1,-1),f=s.indexOf(":"),v=s.slice(0,f);return v?uw+v:void 0})(),dw=a=>{const{theme:s,classGroups:f}=a;return hw(f,s)},hw=(a,s)=>{const f=l0();for(const v in a){const p=a[v];Xh(p,f,v,s)}return f},Xh=(a,s,f,v)=>{const p=a.length;for(let S=0;S<p;S++){const E=a[S];vw(E,s,f,v)}},vw=(a,s,f,v)=>{if(typeof a=="string"){gw(a,s,f);return}if(typeof a=="function"){bw(a,s,f,v);return}mw(a,s,f,v)},gw=(a,s,f)=>{const v=a===""?s:i0(s,a);v.classGroupId=f},bw=(a,s,f,v)=>{if(yw(a)){Xh(a(v),s,f,v);return}s.validators===null&&(s.validators=[]),s.validators.push(cw(f,a))},mw=(a,s,f,v)=>{const p=Object.entries(a),S=p.length;for(let E=0;E<S;E++){const[T,O]=p[E];Xh(O,i0(s,T),f,v)}},i0=(a,s)=>{let f=a;const v=s.split(vd),p=v.length;for(let S=0;S<p;S++){const E=v[S];let T=f.nextPart.get(E);T||(T=l0(),f.nextPart.set(E,T)),f=T}return f},yw=a=>"isThemeGetter"in a&&a.isThemeGetter===!0,pw=a=>{if(a<1)return{get:()=>{},set:()=>{}};let s=0,f=Object.create(null),v=Object.create(null);const p=(S,E)=>{f[S]=E,s++,s>a&&(s=0,v=f,f=Object.create(null))};return{get(S){let E=f[S];if(E!==void 0)return E;if((E=v[S])!==void 0)return p(S,E),E},set(S,E){S in f?f[S]=E:p(S,E)}}},Ih="!",o0=":",xw=[],c0=(a,s,f,v,p)=>({modifiers:a,hasImportantModifier:s,baseClassName:f,maybePostfixModifierPosition:v,isExternal:p}),ww=a=>{const{prefix:s,experimentalParseClassName:f}=a;let v=p=>{const S=[];let E=0,T=0,O=0,R;const k=p.length;for(let Z=0;Z<k;Z++){const $=p[Z];if(E===0&&T===0){if($===o0){S.push(p.slice(O,Z)),O=Z+1;continue}if($==="/"){R=Z;continue}}$==="["?E++:$==="]"?E--:$==="("?T++:$===")"&&T--}const L=S.length===0?p:p.slice(O);let U=L,V=!1;L.endsWith(Ih)?(U=L.slice(0,-1),V=!0):L.startsWith(Ih)&&(U=L.slice(1),V=!0);const K=R&&R>O?R-O:void 0;return c0(S,V,U,K)};if(s){const p=s+o0,S=v;v=E=>E.startsWith(p)?S(E.slice(p.length)):c0(xw,!1,E,void 0,!0)}if(f){const p=v;v=S=>f({className:S,parseClassName:p})}return v},Sw=a=>{const s=new Map;return a.orderSensitiveModifiers.forEach((f,v)=>{s.set(f,1e6+v)}),f=>{const v=[];let p=[];for(let S=0;S<f.length;S++){const E=f[S],T=E[0]==="[",O=s.has(E);T||O?(p.length>0&&(p.sort(),v.push(...p),p=[]),v.push(E)):p.push(E)}return p.length>0&&(p.sort(),v.push(...p)),v}},Ew=a=>({cache:pw(a.cacheSize),parseClassName:ww(a),sortModifiers:Sw(a),...sw(a)}),Cw=/\s+/,Tw=(a,s)=>{const{parseClassName:f,getClassGroupId:v,getConflictingClassGroupIds:p,sortModifiers:S}=s,E=[],T=a.trim().split(Cw);let O="";for(let R=T.length-1;R>=0;R-=1){const k=T[R],{isExternal:L,modifiers:U,hasImportantModifier:V,baseClassName:K,maybePostfixModifierPosition:Z}=f(k);if(L){O=k+(O.length>0?" "+O:O);continue}let $=!!Z,oe=v($?K.substring(0,Z):K);if(!oe){if(!$){O=k+(O.length>0?" "+O:O);continue}if(oe=v(K),!oe){O=k+(O.length>0?" "+O:O);continue}$=!1}const me=U.length===0?"":U.length===1?U[0]:S(U).join(":"),de=V?me+Ih:me,ve=de+oe;if(E.indexOf(ve)>-1)continue;E.push(ve);const Te=p(oe,$);for(let Ee=0;Ee<Te.length;++Ee){const be=Te[Ee];E.push(de+be)}O=k+(O.length>0?" "+O:O)}return O},Rw=(...a)=>{let s=0,f,v,p="";for(;s<a.length;)(f=a[s++])&&(v=u0(f))&&(p&&(p+=" "),p+=v);return p},u0=a=>{if(typeof a=="string")return a;let s,f="";for(let v=0;v<a.length;v++)a[v]&&(s=u0(a[v]))&&(f&&(f+=" "),f+=s);return f},Aw=(a,...s)=>{let f,v,p,S;const E=O=>{const R=s.reduce((k,L)=>L(k),a());return f=Ew(R),v=f.cache.get,p=f.cache.set,S=T,T(O)},T=O=>{const R=v(O);if(R)return R;const k=Tw(O,f);return p(O,k),k};return S=E,(...O)=>S(Rw(...O))},_w=[],Qn=a=>{const s=f=>f[a]||_w;return s.isThemeGetter=!0,s},s0=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,f0=/^\((?:(\w[\w-]*):)?(.+)\)$/i,Mw=/^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,Ow=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,zw=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,Dw=/^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,kw=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,Nw=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,No=a=>Mw.test(a),ut=a=>!!a&&!Number.isNaN(Number(a)),Lo=a=>!!a&&Number.isInteger(Number(a)),Zh=a=>a.endsWith("%")&&ut(a.slice(0,-1)),Xi=a=>Ow.test(a),d0=()=>!0,Lw=a=>zw.test(a)&&!Dw.test(a),Vh=()=>!1,Bw=a=>kw.test(a),Hw=a=>Nw.test(a),Uw=a=>!De(a)&&!ke(a),Fw=a=>Bo(a,y0,Vh),De=a=>s0.test(a),jc=a=>Bo(a,p0,Lw),h0=a=>Bo(a,Qw,ut),Yw=a=>Bo(a,w0,d0),Pw=a=>Bo(a,x0,Vh),v0=a=>Bo(a,b0,Vh),Gw=a=>Bo(a,m0,Hw),gd=a=>Bo(a,S0,Bw),ke=a=>f0.test(a),Ys=a=>qc(a,p0),Xw=a=>qc(a,x0),g0=a=>qc(a,b0),Iw=a=>qc(a,y0),Zw=a=>qc(a,m0),bd=a=>qc(a,S0,!0),Vw=a=>qc(a,w0,!0),Bo=(a,s,f)=>{const v=s0.exec(a);return v?v[1]?s(v[1]):f(v[2]):!1},qc=(a,s,f=!1)=>{const v=f0.exec(a);return v?v[1]?s(v[1]):f:!1},b0=a=>a==="position"||a==="percentage",m0=a=>a==="image"||a==="url",y0=a=>a==="length"||a==="size"||a==="bg-size",p0=a=>a==="length",Qw=a=>a==="number",x0=a=>a==="family-name",w0=a=>a==="number"||a==="weight",S0=a=>a==="shadow",Ww=Aw(()=>{const a=Qn("color"),s=Qn("font"),f=Qn("text"),v=Qn("font-weight"),p=Qn("tracking"),S=Qn("leading"),E=Qn("breakpoint"),T=Qn("container"),O=Qn("spacing"),R=Qn("radius"),k=Qn("shadow"),L=Qn("inset-shadow"),U=Qn("text-shadow"),V=Qn("drop-shadow"),K=Qn("blur"),Z=Qn("perspective"),$=Qn("aspect"),oe=Qn("ease"),me=Qn("animate"),de=()=>["auto","avoid","all","avoid-page","page","left","right","column"],ve=()=>["center","top","bottom","left","right","top-left","left-top","top-right","right-top","bottom-right","right-bottom","bottom-left","left-bottom"],Te=()=>[...ve(),ke,De],Ee=()=>["auto","hidden","clip","visible","scroll"],be=()=>["auto","contain","none"],ce=()=>[ke,De,O],ye=()=>[No,"full","auto",...ce()],He=()=>[Lo,"none","subgrid",ke,De],Ze=()=>["auto",{span:["full",Lo,ke,De]},Lo,ke,De],$e=()=>[Lo,"auto",ke,De],st=()=>["auto","min","max","fr",ke,De],Ge=()=>["start","end","center","between","around","evenly","stretch","baseline","center-safe","end-safe"],Ve=()=>["start","end","center","stretch","center-safe","end-safe"],D=()=>["auto",...ce()],J=()=>[No,"auto","full","dvw","dvh","lvw","lvh","svw","svh","min","max","fit",...ce()],we=()=>[No,"screen","full","dvw","lvw","svw","min","max","fit",...ce()],Pe=()=>[No,"screen","full","lh","dvh","lvh","svh","min","max","fit",...ce()],W=()=>[a,ke,De],_=()=>[...ve(),g0,v0,{position:[ke,De]}],se=()=>["no-repeat",{repeat:["","x","y","space","round"]}],Ae=()=>["auto","cover","contain",Iw,Fw,{size:[ke,De]}],Re=()=>[Zh,Ys,jc],pe=()=>["","none","full",R,ke,De],_e=()=>["",ut,Ys,jc],Xe=()=>["solid","dashed","dotted","double"],Vt=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],Qe=()=>[ut,Zh,g0,v0],ea=()=>["","none",K,ke,De],_t=()=>["none",ut,ke,De],Fl=()=>["none",ut,ke,De],Ue=()=>[ut,ke,De],ol=()=>[No,"full",...ce()];return{cacheSize:500,theme:{animate:["spin","ping","pulse","bounce"],aspect:["video"],blur:[Xi],breakpoint:[Xi],color:[d0],container:[Xi],"drop-shadow":[Xi],ease:["in","out","in-out"],font:[Uw],"font-weight":["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"],"inset-shadow":[Xi],leading:["none","tight","snug","normal","relaxed","loose"],perspective:["dramatic","near","normal","midrange","distant","none"],radius:[Xi],shadow:[Xi],spacing:["px",ut],text:[Xi],"text-shadow":[Xi],tracking:["tighter","tight","normal","wide","wider","widest"]},classGroups:{aspect:[{aspect:["auto","square",No,De,ke,$]}],container:["container"],columns:[{columns:[ut,De,ke,T]}],"break-after":[{"break-after":de()}],"break-before":[{"break-before":de()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],sr:["sr-only","not-sr-only"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:Te()}],overflow:[{overflow:Ee()}],"overflow-x":[{"overflow-x":Ee()}],"overflow-y":[{"overflow-y":Ee()}],overscroll:[{overscroll:be()}],"overscroll-x":[{"overscroll-x":be()}],"overscroll-y":[{"overscroll-y":be()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:ye()}],"inset-x":[{"inset-x":ye()}],"inset-y":[{"inset-y":ye()}],start:[{"inset-s":ye(),start:ye()}],end:[{"inset-e":ye(),end:ye()}],"inset-bs":[{"inset-bs":ye()}],"inset-be":[{"inset-be":ye()}],top:[{top:ye()}],right:[{right:ye()}],bottom:[{bottom:ye()}],left:[{left:ye()}],visibility:["visible","invisible","collapse"],z:[{z:[Lo,"auto",ke,De]}],basis:[{basis:[No,"full","auto",T,...ce()]}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["nowrap","wrap","wrap-reverse"]}],flex:[{flex:[ut,No,"auto","initial","none",De]}],grow:[{grow:["",ut,ke,De]}],shrink:[{shrink:["",ut,ke,De]}],order:[{order:[Lo,"first","last","none",ke,De]}],"grid-cols":[{"grid-cols":He()}],"col-start-end":[{col:Ze()}],"col-start":[{"col-start":$e()}],"col-end":[{"col-end":$e()}],"grid-rows":[{"grid-rows":He()}],"row-start-end":[{row:Ze()}],"row-start":[{"row-start":$e()}],"row-end":[{"row-end":$e()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":st()}],"auto-rows":[{"auto-rows":st()}],gap:[{gap:ce()}],"gap-x":[{"gap-x":ce()}],"gap-y":[{"gap-y":ce()}],"justify-content":[{justify:[...Ge(),"normal"]}],"justify-items":[{"justify-items":[...Ve(),"normal"]}],"justify-self":[{"justify-self":["auto",...Ve()]}],"align-content":[{content:["normal",...Ge()]}],"align-items":[{items:[...Ve(),{baseline:["","last"]}]}],"align-self":[{self:["auto",...Ve(),{baseline:["","last"]}]}],"place-content":[{"place-content":Ge()}],"place-items":[{"place-items":[...Ve(),"baseline"]}],"place-self":[{"place-self":["auto",...Ve()]}],p:[{p:ce()}],px:[{px:ce()}],py:[{py:ce()}],ps:[{ps:ce()}],pe:[{pe:ce()}],pbs:[{pbs:ce()}],pbe:[{pbe:ce()}],pt:[{pt:ce()}],pr:[{pr:ce()}],pb:[{pb:ce()}],pl:[{pl:ce()}],m:[{m:D()}],mx:[{mx:D()}],my:[{my:D()}],ms:[{ms:D()}],me:[{me:D()}],mbs:[{mbs:D()}],mbe:[{mbe:D()}],mt:[{mt:D()}],mr:[{mr:D()}],mb:[{mb:D()}],ml:[{ml:D()}],"space-x":[{"space-x":ce()}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":ce()}],"space-y-reverse":["space-y-reverse"],size:[{size:J()}],"inline-size":[{inline:["auto",...we()]}],"min-inline-size":[{"min-inline":["auto",...we()]}],"max-inline-size":[{"max-inline":["none",...we()]}],"block-size":[{block:["auto",...Pe()]}],"min-block-size":[{"min-block":["auto",...Pe()]}],"max-block-size":[{"max-block":["none",...Pe()]}],w:[{w:[T,"screen",...J()]}],"min-w":[{"min-w":[T,"screen","none",...J()]}],"max-w":[{"max-w":[T,"screen","none","prose",{screen:[E]},...J()]}],h:[{h:["screen","lh",...J()]}],"min-h":[{"min-h":["screen","lh","none",...J()]}],"max-h":[{"max-h":["screen","lh",...J()]}],"font-size":[{text:["base",f,Ys,jc]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:[v,Vw,Yw]}],"font-stretch":[{"font-stretch":["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded",Zh,De]}],"font-family":[{font:[Xw,Pw,s]}],"font-features":[{"font-features":[De]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:[p,ke,De]}],"line-clamp":[{"line-clamp":[ut,"none",ke,h0]}],leading:[{leading:[S,...ce()]}],"list-image":[{"list-image":["none",ke,De]}],"list-style-position":[{list:["inside","outside"]}],"list-style-type":[{list:["disc","decimal","none",ke,De]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"placeholder-color":[{placeholder:W()}],"text-color":[{text:W()}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...Xe(),"wavy"]}],"text-decoration-thickness":[{decoration:[ut,"from-font","auto",ke,jc]}],"text-decoration-color":[{decoration:W()}],"underline-offset":[{"underline-offset":[ut,"auto",ke,De]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:ce()}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",ke,De]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],wrap:[{wrap:["break-word","anywhere","normal"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",ke,De]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:_()}],"bg-repeat":[{bg:se()}],"bg-size":[{bg:Ae()}],"bg-image":[{bg:["none",{linear:[{to:["t","tr","r","br","b","bl","l","tl"]},Lo,ke,De],radial:["",ke,De],conic:[Lo,ke,De]},Zw,Gw]}],"bg-color":[{bg:W()}],"gradient-from-pos":[{from:Re()}],"gradient-via-pos":[{via:Re()}],"gradient-to-pos":[{to:Re()}],"gradient-from":[{from:W()}],"gradient-via":[{via:W()}],"gradient-to":[{to:W()}],rounded:[{rounded:pe()}],"rounded-s":[{"rounded-s":pe()}],"rounded-e":[{"rounded-e":pe()}],"rounded-t":[{"rounded-t":pe()}],"rounded-r":[{"rounded-r":pe()}],"rounded-b":[{"rounded-b":pe()}],"rounded-l":[{"rounded-l":pe()}],"rounded-ss":[{"rounded-ss":pe()}],"rounded-se":[{"rounded-se":pe()}],"rounded-ee":[{"rounded-ee":pe()}],"rounded-es":[{"rounded-es":pe()}],"rounded-tl":[{"rounded-tl":pe()}],"rounded-tr":[{"rounded-tr":pe()}],"rounded-br":[{"rounded-br":pe()}],"rounded-bl":[{"rounded-bl":pe()}],"border-w":[{border:_e()}],"border-w-x":[{"border-x":_e()}],"border-w-y":[{"border-y":_e()}],"border-w-s":[{"border-s":_e()}],"border-w-e":[{"border-e":_e()}],"border-w-bs":[{"border-bs":_e()}],"border-w-be":[{"border-be":_e()}],"border-w-t":[{"border-t":_e()}],"border-w-r":[{"border-r":_e()}],"border-w-b":[{"border-b":_e()}],"border-w-l":[{"border-l":_e()}],"divide-x":[{"divide-x":_e()}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":_e()}],"divide-y-reverse":["divide-y-reverse"],"border-style":[{border:[...Xe(),"hidden","none"]}],"divide-style":[{divide:[...Xe(),"hidden","none"]}],"border-color":[{border:W()}],"border-color-x":[{"border-x":W()}],"border-color-y":[{"border-y":W()}],"border-color-s":[{"border-s":W()}],"border-color-e":[{"border-e":W()}],"border-color-bs":[{"border-bs":W()}],"border-color-be":[{"border-be":W()}],"border-color-t":[{"border-t":W()}],"border-color-r":[{"border-r":W()}],"border-color-b":[{"border-b":W()}],"border-color-l":[{"border-l":W()}],"divide-color":[{divide:W()}],"outline-style":[{outline:[...Xe(),"none","hidden"]}],"outline-offset":[{"outline-offset":[ut,ke,De]}],"outline-w":[{outline:["",ut,Ys,jc]}],"outline-color":[{outline:W()}],shadow:[{shadow:["","none",k,bd,gd]}],"shadow-color":[{shadow:W()}],"inset-shadow":[{"inset-shadow":["none",L,bd,gd]}],"inset-shadow-color":[{"inset-shadow":W()}],"ring-w":[{ring:_e()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:W()}],"ring-offset-w":[{"ring-offset":[ut,jc]}],"ring-offset-color":[{"ring-offset":W()}],"inset-ring-w":[{"inset-ring":_e()}],"inset-ring-color":[{"inset-ring":W()}],"text-shadow":[{"text-shadow":["none",U,bd,gd]}],"text-shadow-color":[{"text-shadow":W()}],opacity:[{opacity:[ut,ke,De]}],"mix-blend":[{"mix-blend":[...Vt(),"plus-darker","plus-lighter"]}],"bg-blend":[{"bg-blend":Vt()}],"mask-clip":[{"mask-clip":["border","padding","content","fill","stroke","view"]},"mask-no-clip"],"mask-composite":[{mask:["add","subtract","intersect","exclude"]}],"mask-image-linear-pos":[{"mask-linear":[ut]}],"mask-image-linear-from-pos":[{"mask-linear-from":Qe()}],"mask-image-linear-to-pos":[{"mask-linear-to":Qe()}],"mask-image-linear-from-color":[{"mask-linear-from":W()}],"mask-image-linear-to-color":[{"mask-linear-to":W()}],"mask-image-t-from-pos":[{"mask-t-from":Qe()}],"mask-image-t-to-pos":[{"mask-t-to":Qe()}],"mask-image-t-from-color":[{"mask-t-from":W()}],"mask-image-t-to-color":[{"mask-t-to":W()}],"mask-image-r-from-pos":[{"mask-r-from":Qe()}],"mask-image-r-to-pos":[{"mask-r-to":Qe()}],"mask-image-r-from-color":[{"mask-r-from":W()}],"mask-image-r-to-color":[{"mask-r-to":W()}],"mask-image-b-from-pos":[{"mask-b-from":Qe()}],"mask-image-b-to-pos":[{"mask-b-to":Qe()}],"mask-image-b-from-color":[{"mask-b-from":W()}],"mask-image-b-to-color":[{"mask-b-to":W()}],"mask-image-l-from-pos":[{"mask-l-from":Qe()}],"mask-image-l-to-pos":[{"mask-l-to":Qe()}],"mask-image-l-from-color":[{"mask-l-from":W()}],"mask-image-l-to-color":[{"mask-l-to":W()}],"mask-image-x-from-pos":[{"mask-x-from":Qe()}],"mask-image-x-to-pos":[{"mask-x-to":Qe()}],"mask-image-x-from-color":[{"mask-x-from":W()}],"mask-image-x-to-color":[{"mask-x-to":W()}],"mask-image-y-from-pos":[{"mask-y-from":Qe()}],"mask-image-y-to-pos":[{"mask-y-to":Qe()}],"mask-image-y-from-color":[{"mask-y-from":W()}],"mask-image-y-to-color":[{"mask-y-to":W()}],"mask-image-radial":[{"mask-radial":[ke,De]}],"mask-image-radial-from-pos":[{"mask-radial-from":Qe()}],"mask-image-radial-to-pos":[{"mask-radial-to":Qe()}],"mask-image-radial-from-color":[{"mask-radial-from":W()}],"mask-image-radial-to-color":[{"mask-radial-to":W()}],"mask-image-radial-shape":[{"mask-radial":["circle","ellipse"]}],"mask-image-radial-size":[{"mask-radial":[{closest:["side","corner"],farthest:["side","corner"]}]}],"mask-image-radial-pos":[{"mask-radial-at":ve()}],"mask-image-conic-pos":[{"mask-conic":[ut]}],"mask-image-conic-from-pos":[{"mask-conic-from":Qe()}],"mask-image-conic-to-pos":[{"mask-conic-to":Qe()}],"mask-image-conic-from-color":[{"mask-conic-from":W()}],"mask-image-conic-to-color":[{"mask-conic-to":W()}],"mask-mode":[{mask:["alpha","luminance","match"]}],"mask-origin":[{"mask-origin":["border","padding","content","fill","stroke","view"]}],"mask-position":[{mask:_()}],"mask-repeat":[{mask:se()}],"mask-size":[{mask:Ae()}],"mask-type":[{"mask-type":["alpha","luminance"]}],"mask-image":[{mask:["none",ke,De]}],filter:[{filter:["","none",ke,De]}],blur:[{blur:ea()}],brightness:[{brightness:[ut,ke,De]}],contrast:[{contrast:[ut,ke,De]}],"drop-shadow":[{"drop-shadow":["","none",V,bd,gd]}],"drop-shadow-color":[{"drop-shadow":W()}],grayscale:[{grayscale:["",ut,ke,De]}],"hue-rotate":[{"hue-rotate":[ut,ke,De]}],invert:[{invert:["",ut,ke,De]}],saturate:[{saturate:[ut,ke,De]}],sepia:[{sepia:["",ut,ke,De]}],"backdrop-filter":[{"backdrop-filter":["","none",ke,De]}],"backdrop-blur":[{"backdrop-blur":ea()}],"backdrop-brightness":[{"backdrop-brightness":[ut,ke,De]}],"backdrop-contrast":[{"backdrop-contrast":[ut,ke,De]}],"backdrop-grayscale":[{"backdrop-grayscale":["",ut,ke,De]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[ut,ke,De]}],"backdrop-invert":[{"backdrop-invert":["",ut,ke,De]}],"backdrop-opacity":[{"backdrop-opacity":[ut,ke,De]}],"backdrop-saturate":[{"backdrop-saturate":[ut,ke,De]}],"backdrop-sepia":[{"backdrop-sepia":["",ut,ke,De]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":ce()}],"border-spacing-x":[{"border-spacing-x":ce()}],"border-spacing-y":[{"border-spacing-y":ce()}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["","all","colors","opacity","shadow","transform","none",ke,De]}],"transition-behavior":[{transition:["normal","discrete"]}],duration:[{duration:[ut,"initial",ke,De]}],ease:[{ease:["linear","initial",oe,ke,De]}],delay:[{delay:[ut,ke,De]}],animate:[{animate:["none",me,ke,De]}],backface:[{backface:["hidden","visible"]}],perspective:[{perspective:[Z,ke,De]}],"perspective-origin":[{"perspective-origin":Te()}],rotate:[{rotate:_t()}],"rotate-x":[{"rotate-x":_t()}],"rotate-y":[{"rotate-y":_t()}],"rotate-z":[{"rotate-z":_t()}],scale:[{scale:Fl()}],"scale-x":[{"scale-x":Fl()}],"scale-y":[{"scale-y":Fl()}],"scale-z":[{"scale-z":Fl()}],"scale-3d":["scale-3d"],skew:[{skew:Ue()}],"skew-x":[{"skew-x":Ue()}],"skew-y":[{"skew-y":Ue()}],transform:[{transform:[ke,De,"","none","gpu","cpu"]}],"transform-origin":[{origin:Te()}],"transform-style":[{transform:["3d","flat"]}],translate:[{translate:ol()}],"translate-x":[{"translate-x":ol()}],"translate-y":[{"translate-y":ol()}],"translate-z":[{"translate-z":ol()}],"translate-none":["translate-none"],accent:[{accent:W()}],appearance:[{appearance:["none","auto"]}],"caret-color":[{caret:W()}],"color-scheme":[{scheme:["normal","dark","light","light-dark","only-dark","only-light"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",ke,De]}],"field-sizing":[{"field-sizing":["fixed","content"]}],"pointer-events":[{"pointer-events":["auto","none"]}],resize:[{resize:["none","","y","x"]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scroll-m":[{"scroll-m":ce()}],"scroll-mx":[{"scroll-mx":ce()}],"scroll-my":[{"scroll-my":ce()}],"scroll-ms":[{"scroll-ms":ce()}],"scroll-me":[{"scroll-me":ce()}],"scroll-mbs":[{"scroll-mbs":ce()}],"scroll-mbe":[{"scroll-mbe":ce()}],"scroll-mt":[{"scroll-mt":ce()}],"scroll-mr":[{"scroll-mr":ce()}],"scroll-mb":[{"scroll-mb":ce()}],"scroll-ml":[{"scroll-ml":ce()}],"scroll-p":[{"scroll-p":ce()}],"scroll-px":[{"scroll-px":ce()}],"scroll-py":[{"scroll-py":ce()}],"scroll-ps":[{"scroll-ps":ce()}],"scroll-pe":[{"scroll-pe":ce()}],"scroll-pbs":[{"scroll-pbs":ce()}],"scroll-pbe":[{"scroll-pbe":ce()}],"scroll-pt":[{"scroll-pt":ce()}],"scroll-pr":[{"scroll-pr":ce()}],"scroll-pb":[{"scroll-pb":ce()}],"scroll-pl":[{"scroll-pl":ce()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",ke,De]}],fill:[{fill:["none",...W()]}],"stroke-w":[{stroke:[ut,Ys,jc,h0]}],stroke:[{stroke:["none",...W()]}],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","inset-bs","inset-be","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pbs","pbe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mbs","mbe","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-x","border-w-y","border-w-s","border-w-e","border-w-bs","border-w-be","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-x","border-color-y","border-color-s","border-color-e","border-color-bs","border-color-be","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],translate:["translate-x","translate-y","translate-none"],"translate-none":["translate","translate-x","translate-y","translate-z"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mbs","scroll-mbe","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pbs","scroll-pbe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]},orderSensitiveModifiers:["*","**","after","backdrop","before","details-content","file","first-letter","first-line","marker","placeholder","selection"]}});function md(...a){return Ww(n0(a))}const E0=a=>typeof a=="boolean"?`${a}`:a===0?"0":a,C0=n0,Jw=((a,s)=>f=>{var v;if(s?.variants==null)return C0(a,f?.class,f?.className);const{variants:p,defaultVariants:S}=s,E=Object.keys(p).map(R=>{const k=f?.[R],L=S?.[R];if(k===null)return null;const U=E0(k)||E0(L);return p[R][U]}),T=f&&Object.entries(f).reduce((R,k)=>{let[L,U]=k;return U===void 0||(R[L]=U),R},{}),O=s==null||(v=s.compoundVariants)===null||v===void 0?void 0:v.reduce((R,k)=>{let{class:L,className:U,...V}=k;return Object.entries(V).every(K=>{let[Z,$]=K;return Array.isArray($)?$.includes({...S,...T}[Z]):{...S,...T}[Z]===$})?[...R,L,U]:R},[]);return C0(a,E,O,f?.class,f?.className)})("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border text-sm font-medium transition-colors outline-none disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"border-white/10 bg-white/[0.04] text-slate-100 hover:border-sky-400/40 hover:bg-white/[0.07]",ghost:"border-transparent bg-transparent text-slate-300 hover:bg-white/[0.05] hover:text-slate-50",subtle:"border-white/8 bg-slate-950/60 text-slate-300 hover:border-sky-400/25 hover:text-slate-50"},size:{default:"h-9 px-3",sm:"h-8 px-2.5 text-xs",icon:"h-9 w-9"}},defaultVariants:{variant:"default",size:"default"}}),$c=H.forwardRef(({className:a,variant:s,size:f,...v},p)=>Y.jsx("button",{ref:p,className:md(Jw({variant:s,size:f}),a),...v}));$c.displayName="Button";const Kw=[{id:"overview",label:"\uAC1C\uC694",icon:dd},{id:"daily",label:"\uC77C\uBCC4",icon:fd},{id:"urls",label:"URL",icon:hd},{id:"queries",label:"\uAC80\uC0C9\uC5B4",icon:Ku},{id:"crawl",label:"\uD06C\uB864",icon:Wb},{id:"backlink",label:"\uBC31\uB9C1\uD06C",icon:hd},{id:"diagnosis",label:"\uBA54\uD0C0",icon:$b}];function jw(a){const[s,f]=H.useState(()=>a.getState());return H.useEffect(()=>a.subscribe(v=>{f({...v,rows:[...v.rows],allSites:[...v.allSites]})}),[a]),s}function T0(a){return a?a.replace(/^https?:\/\//,""):"\uC0AC\uC774\uD2B8 \uC120\uD0DD"}function qw(a,s){const f=s.map(p=>p.site).filter(p=>a.includes(p)),v=new Set(f);return[...f,...a.filter(p=>!v.has(p))]}function $w(a){return a?new Intl.DateTimeFormat("ko-KR",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:!1}).format(a):"\uC5C6\uC74C"}function eS(a){if(a==null)return"\uC5C6\uC74C";if(a<=0)return"\uB9CC\uB8CC";const s=Math.max(1,Math.ceil(a/6e4)),f=Math.floor(s/1440),v=Math.floor(s%1440/60),p=s%60;return f>0?`${f}\uC77C ${v}\uC2DC\uAC04`:v>0?`${v}\uC2DC\uAC04 ${p}\uBD84`:`${p}\uBD84`}function tS({api:a,portalContainer:s}){const f=jw(a),[v,p]=H.useState(""),[S,E]=H.useState(!1),[T,O]=H.useState(()=>Date.now()),R=H.useMemo(()=>qw(f.allSites,f.rows),[f.allSites,f.rows]),k=H.useMemo(()=>{const K=v.trim().toLowerCase();return K?R.filter(Z=>Z.toLowerCase().includes(K)):R},[R,v]);H.useEffect(()=>{S||p("")},[S]),H.useEffect(()=>{const K=window.setInterval(()=>{O(Date.now())},3e4);return()=>window.clearInterval(K)},[]);const L=f.cacheMeta?.remainingMs==null?null:Math.max(0,f.cacheMeta.remainingMs-(T-f.cacheMeta.measuredAt)),U=f.curMode==="all",V=()=>{document.getElementById("sadv-bd")?.scrollTo({top:0,behavior:"smooth"}),window.scrollTo({top:0,behavior:"smooth"})};return Y.jsxs(Y.Fragment,{children:[Y.jsxs("div",{className:"sadvx-shell",children:[Y.jsxs("div",{className:"px-3.5 pt-2.5 pb-2.5",children:[Y.jsxs("div",{className:"grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-1.5",children:[Y.jsx("div",{className:"min-w-0",children:Y.jsxs("div",{className:"flex min-w-0 items-center gap-2",children:[Y.jsx("div",{className:"flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-sky-400/18 bg-white/[0.03] text-sky-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",children:Y.jsx(Ku,{className:"h-4 w-4"})}),Y.jsxs("div",{className:"truncate text-[16px] font-semibold tracking-[-0.025em] text-slate-50",children:["Search",Y.jsx("span",{className:"text-emerald-400",children:"Advisor"})]}),f.accountLabel?Y.jsx("div",{className:"max-w-[150px] shrink truncate rounded-full border border-sky-400/15 bg-sky-400/[0.08] px-2 py-1 text-[9px] font-semibold leading-none text-sky-100",children:f.accountLabel}):null]})}),Y.jsxs("div",{className:"flex shrink-0 items-center justify-end gap-1",children:[Y.jsx($c,{size:"icon",variant:"subtle",title:"\uC0C8\uB85C\uACE0\uCE68",onClick:()=>a.refresh(),children:Y.jsx(qb,{className:"h-4 w-4"})}),Y.jsxs($c,{variant:"subtle",size:"sm",title:"\uD604\uC7AC \uD654\uBA74 \uC800\uC7A5",onClick:()=>a.download(),children:[Y.jsx(Kb,{className:"h-3.5 w-3.5"}),"HTML"]}),Y.jsx($c,{size:"icon",variant:"subtle",title:"\uB2EB\uAE30",onClick:()=>{document.getElementById("sadv-react-style")?.remove(),a.close()},children:Y.jsx(e0,{className:"h-4 w-4"})})]}),Y.jsxs("div",{className:"col-span-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 border-b border-white/6 pb-2 text-[10px] leading-4 text-slate-400",children:[Y.jsx("span",{className:"min-w-0 truncate",children:f.curMode==="all"?Y.jsxs("span",{children:[f.allSites.length,"\uAC1C \uC0AC\uC774\uD2B8 \uB4F1\uB85D\uB428"]}):Y.jsx("span",{children:T0(f.curSite)})}),Y.jsxs("span",{className:"ml-auto flex flex-wrap items-center justify-end gap-1.5 text-[9px] leading-none text-slate-500",children:[Y.jsxs("span",{className:"rounded-full border border-white/8 bg-white/[0.03] px-2 py-1",children:["v ",f.runtimeVersion||"dev"]}),Y.jsxs("span",{className:"rounded-full border border-white/8 bg-white/[0.03] px-2 py-1",title:f.cacheMeta?`${f.cacheMeta.label} \uAE30\uC900 \uCD5C\uADFC \uAC31\uC2E0`:"\uCE90\uC2DC \uAE30\uC900 \uC5C6\uC74C",children:["\uCE90\uC2DC\uC800\uC7A5 ",$w(f.cacheMeta?.updatedAt??null)]}),U?Y.jsxs("span",{className:"rounded-full border border-white/8 bg-white/[0.03] px-2 py-1",title:f.cacheMeta?`${f.cacheMeta.label} \uAE30\uC900 \uC790\uB3D9 \uAC31\uC2E0 \uC794\uC5EC \uC2DC\uAC04`:"\uCE90\uC2DC \uAE30\uC900 \uC5C6\uC74C",children:["\uC7AC\uC870\uD68C\uAE4C\uC9C0 ",eS(L)]}):null]})]})]}),Y.jsxs("div",{className:"mt-2.5 grid grid-cols-2 gap-1.5",children:[Y.jsxs($c,{variant:f.curMode==="all"?"default":"subtle",className:md("h-9.5 rounded-xl font-semibold tracking-[-0.01em]",f.curMode==="all"&&"border-sky-400/35 bg-sky-400/[0.08] text-sky-50"),onClick:()=>a.switchMode("all"),children:[Y.jsx(jb,{className:"h-3.5 w-3.5"}),"\uC804\uCCB4\uD604\uD669"]}),Y.jsxs($c,{variant:f.curMode==="site"?"default":"subtle",className:md("h-9.5 rounded-xl font-semibold tracking-[-0.01em]",f.curMode==="site"&&"border-sky-400/35 bg-sky-400/[0.08] text-sky-50"),onClick:()=>a.switchMode("site"),children:[Y.jsx(dd,{className:"h-3.5 w-3.5"}),"\uC0AC\uC774\uD2B8\uBCC4"]})]}),f.curMode==="site"?Y.jsx("div",{className:"mt-3",children:Y.jsxs(g1,{open:S,onOpenChange:E,children:[Y.jsx(b1,{asChild:!0,children:Y.jsxs("button",{className:"flex h-11 w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-left text-sm text-slate-100 transition-colors hover:border-sky-400/30 focus:outline-none",children:[Y.jsx("span",{className:"h-2.5 w-2.5 rounded-full bg-emerald-400/90 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]"}),Y.jsx("span",{className:"min-w-0 flex-1 truncate font-medium",children:T0(f.curSite)}),Y.jsx(Jb,{className:"h-4 w-4 text-slate-400"})]})}),Y.jsx(m1,{container:s??void 0,children:Y.jsxs(y1,{sideOffset:8,align:"center",className:"z-[10000001] w-[min(var(--radix-popover-trigger-width),448px)] min-w-[min(var(--radix-popover-trigger-width),448px)] max-w-[calc(100vw-32px)] rounded-2xl border border-white/10 bg-slate-950/96 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur",children:[Y.jsxs("div",{className:"border-b border-white/8 px-2 pb-2",children:[Y.jsxs("div",{className:"relative",children:[Y.jsx(Ku,{className:"pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"}),Y.jsx("input",{value:v,onChange:K=>p(K.target.value),placeholder:"\uC0AC\uC774\uD2B8 \uAC80\uC0C9...",className:"h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400/30"})]}),Y.jsxs("div",{className:"mt-2 text-[10px] font-medium tracking-[0.14em] text-slate-500",children:["\uC804\uCCB4 ",R.length,"\uAC1C · \uD074\uB9AD\uC21C \uC815\uB82C"]})]}),Y.jsxs(k1,{className:"mt-2 h-[280px] overflow-hidden",children:[Y.jsx(N1,{className:"h-full",children:Y.jsx("div",{className:"space-y-1 pr-1",children:k.map(K=>{const Z=f.rows.find(oe=>oe.site===K),$=f.curSite===K;return Y.jsxs("button",{onClick:()=>{a.setSite(K),E(!1)},className:md("flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",$?"border-sky-400/35 bg-sky-400/[0.08]":"border-transparent bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.05]"),children:[Y.jsx("span",{className:"h-2.5 w-2.5 rounded-full bg-slate-500"}),Y.jsxs("div",{className:"min-w-0 flex-1",children:[Y.jsx("div",{className:"truncate text-[12px] font-medium text-slate-100",children:K.replace(/^https?:\/\//,"")}),Y.jsx("div",{className:"truncate text-[10px] text-slate-500",children:K})]}),Y.jsx("div",{className:"shrink-0 text-[11px] font-semibold text-emerald-400",children:Z?`${Z.totalC.toLocaleString()} \uD074\uB9AD`:"-"})]},K)})})}),Y.jsx(L1,{orientation:"vertical",className:"flex w-2.5 p-[1px]",children:Y.jsx(B1,{className:"flex-1 rounded-full bg-white/10"})})]})]})})]})}):null]}),f.curMode==="site"?Y.jsx("div",{className:"border-t border-white/6 bg-black/10 px-2.5 pb-2 pt-1.5",children:Y.jsx($1,{value:f.curTab,onValueChange:K=>a.setTab(K),children:Y.jsx(ew,{className:"flex flex-wrap items-center justify-center gap-1.5",children:Kw.map(K=>{const Z=K.icon;return Y.jsxs(tw,{value:K.id,className:"inline-flex h-8.5 items-center gap-1.5 rounded-lg border border-transparent px-2.5 text-[11px] font-medium tracking-[-0.01em] text-slate-400 outline-none transition-colors data-[state=active]:border-sky-400/30 data-[state=active]:bg-sky-400/[0.08] data-[state=active]:text-slate-50 hover:bg-white/[0.04] hover:text-slate-100",children:[Y.jsx(Z,{className:"h-3.5 w-3.5"}),K.label]},K.id)})})})}):null]}),Ff.createPortal(Y.jsx($c,{type:"button",size:"icon",title:"\uCD5C\uC0C1\uB2E8 \uC774\uB3D9",onClick:V,className:"fixed right-5 bottom-5 z-[10000012] h-10 w-10 rounded-full border border-sky-300/45 bg-linear-to-b from-sky-300 to-sky-500 text-slate-950 shadow-[0_14px_32px_rgba(56,189,248,0.35)] backdrop-blur transition-all hover:-translate-y-0.5 hover:from-sky-200 hover:to-sky-400 hover:shadow-[0_18px_38px_rgba(56,189,248,0.42)]",children:Y.jsx(Qb,{className:"h-4 w-4"})}),s??document.body)]})}})()
const CONFIG = {
  UI: {
    PANEL_WIDTH: 490,
    PANEL_PADDING: 32,
    Z_INDEX_TOOLTIP: 10000000
  },
  CHART: {
    MIN_HEIGHT: 65,
    PADDING: { LEFT: 4, RIGHT: 4, TOP: 6, BOTTOM: 6 },
    TOOLTIP_OFFSET: { X: 14, Y: 36 },
    BAR_GAP: 3,
    MIN_BAR_WIDTH: 3,
    Y_AXIS_COLLISION_THRESHOLD: 8
  },
  RETRY: {
    JITTER_MS: 500,
    BASE_DELAY_MS: 1000,
    MAX_DELAY_MS: 4000
  },
  MODE: {
    ALL: 'all',
    SITE: 'site'
  },
  PROGRESS: {
    BASE_RATIO_START: 0.08,
    EXPOSE_PHASE_RATIO_RANGE: 0.42,
    META_PHASE_RATIO_START: 0.55,
    META_PHASE_RATIO_RANGE: 0.38
  }
};

// ============================================================
// ERROR TRACKING SYSTEM
// ============================================================
const ERROR_TRACKING = {
  enabled: false, // 기본 비활성, 사용자 설정으로 활성화 가능
  endpoint: null, // 추후 엔드포인트 설정 시 사용
  sampleRate: 1.0,
  maxQueueSize: 10,
  errorQueue: [],

  /**
   * 에러 리포팅 (전송 또는 대기열 저장)
   * @param {Object} errorContext - 에러 컨텍스트
   */
  reportError: function(errorContext) {
    if (!this.enabled) {
      // 비활성 상태에서는 콘솔에만 출력
      console.error('[Error Tracking]', errorContext);
      return;
    }

    const enrichedError = {
      ...errorContext,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      page: window.location.href,
      appVersion: window.__SEARCHADVISOR_VERSION__ || '1.0.0',
      siteCount: window.__sadvInitData?.sites?.length || 0,
      isMultiAccount: window.__sadvAccountState?.isMultiAccount || false
    };

    // 샘플링
    if (Math.random() > this.sampleRate) {
      return;
    }

    // 엔드포인트가 있으면 전송
    if (this.endpoint) {
      this.sendToEndpoint(enrichedError);
    } else {
      // 대기열에 저장 (최대 크기 제한)
      if (this.errorQueue.length >= this.maxQueueSize) {
        this.errorQueue.shift(); // 가장 오래된 에러 제거
      }
      this.errorQueue.push(enrichedError);
    }
  },

  /**
   * 엔드포인트로 에러 전송
   */
  sendToEndpoint: function(errorData) {
    if (!this.endpoint) return;

    fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData),
      keepalive: true
    }).catch(err => {
      console.error('[Error Tracking] Failed to report error:', err);
      // 실패 시 대기열에 저장
      if (this.errorQueue.length < this.maxQueueSize) {
        this.errorQueue.push(errorData);
      }
    });
  },

  /**
   * 대기열에 있는 에러 모두 전송
   */
  flushQueue: function() {
    if (!this.endpoint || this.errorQueue.length === 0) return;

    const errorsToSend = [...this.errorQueue];
    this.errorQueue = [];

    errorsToSend.forEach(error => {
      this.sendToEndpoint(error);
    });
  },

  /**
   * 에러 추적 활성화 및 엔드포인트 설정
   */
  enable: function(endpoint) {
    this.enabled = true;
    this.endpoint = endpoint;
    console.log('[Error Tracking] Enabled with endpoint:', endpoint);
  },

  /**
   * 에러 추적 비활성화
   */
  disable: function() {
    this.enabled = false;
    console.log('[Error Tracking] Disabled');
  }
};

// 전역 에러 핸들러 등록
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    ERROR_TRACKING.reportError({
      type: 'unhandledError',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    ERROR_TRACKING.reportError({
      type: 'unhandledRejection',
      reason: event.reason?.message || String(event.reason),
      stack: event.reason?.stack
    });
  });
}

const ICONS = {
  // KPI / 통계 아이콘
  click: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 11 4-7"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="m9 11 1 9"/><path d="m15 11-1 9"/></svg>',
  eye: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  chart: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
  calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  up: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  down: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
  index: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  link: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  search: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  external: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  // 탭 전용 아이콘 (13px)
  dashboard: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',
  calendarDays: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>',
  urlLink: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  searchTab: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  database: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>',
  activity: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  backLinkTab: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  barChart: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  lightbulb: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>',
  // UI 컨트롤 아이콘
  globe: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  layers: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
  refresh: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
  save: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
  xMark: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  chevronDown: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  logoSearch: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  trendUp: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
  linkInsight: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  pieChart: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>',
};
const C = {
  green: "#10b981",
  blue: "#0ea5e9",
  amber: "#f59e0b",
  red: "#ef4444",
  purple: "#a855f7",
  teal: "#14b8a6",
  orange: "#f97316",
  pink: "#ec4899",
  bg0: "#020617",
  bg1: "#0f172a",
  bg2: "#1e293b",
  border: "#334155",
  text: "#f8fafc",
  muted: "#64748b",
  sub: "#94a3b8",
};
const COLORS = [C.green, C.blue, C.amber, C.teal, C.purple, C.orange, C.pink];

// ============================================================
// V2 PAYLOAD SCHEMA CONSTANTS
// ============================================================

const P = {
  // 스키마 버전 (하드코딩 제거)
  VERSION: "1.0",
  MODE: CONFIG.MODE.ALL,  // "all" | "site"

  // 최상위 필드 (v1 호환성)
  ROOT: {
    META: "__meta",
    SAVED_AT: "savedAt",
    ALL_SITES: "allSites",
    CUR_MODE: "curMode",
    CUR_SITE: "curSite",
    CUR_TAB: "curTab",
    DATA_BY_SITE: "dataBySite",
    SITE_META: "siteMeta",
    MERGED_META: "mergedMeta",
    ACCOUNTS: "accounts",
    UI: "ui",
    STATS: "stats"
  },

  // 사이트 메타 필드
  SITE_META: {
    CACHE_SAVED_AT: "__cacheSavedAt",
    SOURCE: "__source",
    META: "__meta",
    FETCHED_AT: "__fetched_at"
  },

  // 데이터 상태 필드
  FIELD_STATE: {
    DETAIL_LOADED: "detailLoaded",
    CACHE_SAVED_AT: "__cacheSavedAt"
  },

  // 기본값
  DEFAULTS: {
    MODE: CONFIG.MODE.ALL,
    VERSION: "1.0",
    SAVED_AT: null,
    ALL_SITES: [],
    CUR_SITE: null,
    CUR_TAB: "overview"
  }
};

// 스키마 검증용
const PAYLOAD_SCHEMA = {
  VERSION: "1.0",

  ROOT: {
    REQUIRED: ["savedAt", "allSites", "curMode", "dataBySite"],
    OPTIONAL: ["curSite", "curTab", "siteMeta", "mergedMeta"]
  },

  SITE: {
    REQUIRED: [],
    OPTIONAL: ["expose", "crawl", "backlink", "diagnosisMeta", "__cacheSavedAt", "__meta"]
  },

  DEFAULTS: {
    curMode: CONFIG.MODE.ALL,
    curTab: "overview",
    savedAt: null,
    allSites: [],
    curSite: null,
    siteMeta: {},
    mergedMeta: null,
    dataBySite: {}
  }
};

// ============================================================
// V2 PAYLOAD FIELD NAMES (for helper functions)
// ============================================================

const PAYLOAD_FIELDS = {
  // Root fields
  META: "__meta",
  VERSION: "version",
  SAVED_AT: "savedAt",
  ACCOUNT_COUNT: "accountCount",

  // Account fields
  ACCOUNTS: "accounts",
  SITES: "sites",
  SITE_META: "siteMeta",
  DATA_BY_SITE: "dataBySite",
  ENC_ID: "encId",

  // UI fields
  UI: "ui",
  CUR_MODE: "curMode",
  CUR_SITE: "curSite",
  CUR_TAB: "curTab",

  // Site metadata
  LABEL: "label",

  // Summary fields
  SUMMARY: "_summary"
};

// V2 Payload version constant
const PAYLOAD_V2 = {
  VERSION: "1.0"
};

// Performance: Reusable style strings (reduces string allocation)
const S = {
  card: "background:#0f172a;border:1px solid #334155;border-radius:12px;padding:16px;margin-bottom:12px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1)",
  row: "display:flex;justify-content:space-between;align-items:center;padding:16px;background:#0f172a;border:1px solid #334155;border-radius:12px;margin-bottom:12px;transition:all 0.2s",
  flexBetween: "display:flex;justify-content:space-between;align-items:center",
  muted: "font-size:12px;color:#94a3b8",
  valueGreen: "font-size:12px;font-weight:600;color:#10b981",
};

// Performance: Hoisted helper functions (avoids recreation on each call)
const isFiniteValue = (v) => typeof v === "number" && Number.isFinite(v);
const fmt = (v) => Number(v).toLocaleString();
const fmtD = (s) =>
  s ? s.slice(0, 4) + "-" + s.slice(4, 6) + "-" + s.slice(6, 8) : "";
const fmtB = (s) => (s ? s.slice(4, 6) + "/" + s.slice(6, 8) : "");
const PNL = CONFIG.UI.PANEL_WIDTH;
const CHART_W = PNL - CONFIG.UI.PANEL_PADDING;
const DOW = ["\uC77C", "\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0"];
const SITE_COLORS_MAP = {};
const SITE_LS_KEY = "sadv_sites_v1";
const DATA_LS_PREFIX = "sadv_data_v2_";
const UI_STATE_LS_KEY = "sadv_ui_state_v1";
const DATA_TTL = 12 * 60 * 60 * 1000;

// ============================================================
// P0-3: ACCOUNT_UTILS - 계정 유틸리티 통합
// ============================================================
// 다중 계정 지원을 위한 중앙 집중식 계정 관리 유틸리티
// 중복 제거: getAccountLabel(), getAccountInfo() 등을 이 객체로 통합
const ACCOUNT_UTILS = {
  /**
   * 현재 사용자의 계정 이메일(라벨)을 반환
   * @returns {string} 계정 이메일 또는 빈 문자열
   */
  getAccountLabel: function() {
    try {
      const authUser = window.__NUXT__?.state?.authUser;
      return authUser?.email || "";
    } catch (e) {
      return "";
    }
  },

  /**
   * 현재 사용자의 encId를 반환
   * @returns {string} encId 또는 빈 문자열
   */
  getEncId: function() {
    try {
      return window.__NUXT__?.state?.authUser?.encId || "";
    } catch (e) {
      return "";
    }
  },

  /**
   * 계정 정보 전체를 반환 (라벨 + encId)
   * @returns {Object} { accountLabel, encId }
   */
  getAccountInfo: function() {
    try {
      const authUser = window.__NUXT__?.state?.authUser;
      return {
        accountLabel: authUser?.email || "",
        encId: authUser?.encId || ""
      };
    } catch (e) {
      return { accountLabel: "", encId: "" };
    }
  },

  /**
   * 다중 계정 모드에서 현재 활성 계정 반환
   * @returns {string} 현재 계정 이메일
   */
  getCurrentAccount: function() {
    return window.__sadvAccountState?.currentAccount ||
           ACCOUNT_UTILS.getAccountLabel();
  },

  /**
   * 다중 계정 모드인지 확인
   * @returns {boolean} 다중 계정 여부
   */
  isMultiAccount: function() {
    return window.__sadvAccountState?.isMultiAccount || false;
  },

  /**
   * 모든 계정 목록 반환
   * @returns {string[]} 계정 이메일 배열 (복사본)
   */
  getAllAccounts: function() {
    if (!ACCOUNT_UTILS.isMultiAccount()) {
      const label = ACCOUNT_UTILS.getAccountLabel();
      return label ? [label] : [];
    }
    // 배열 복사본 반환으로 원본 데이터 보호
    const accounts = window.__sadvAccountState?.allAccounts;
    return accounts ? [...accounts] : [];
  },

  /**
   * 특정 계정의 데이터를 반환
   * @param {string} accountEmail - 계정 이메일
   * @returns {Object|null} 계정 데이터 또는 null
   */
  getAccountData: function(accountEmail) {
    if (!window.__sadvAccountState?.isMultiAccount) {
      return null;
    }
    return window.__sadvAccountState.accountsData?.[accountEmail] || null;
  },

  /**
   * 현재 계정 상태 객체 반환 (다중 계정 정보 포함)
   * @returns {Object|null} 계정 상태 또는 null
   */
  getAccountState: function() {
    return window.__sadvAccountState || null;
  }
};

// ============================================================
// P1: V2 DATA VALIDATION CONSTANTS
// ============================================================
const DATA_VALIDATION = {
  /**
   * 객체 타입 검증
   */
  isObject: function(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  },

  /**
   * 비어있지 않은 배열 검증
   */
  isNonEmptyArray: function(value) {
    return Array.isArray(value) && value.length > 0;
  },

  /**
   * 유효한 이메일 검증
   * @param {string} email - 검증할 이메일 주소
   * @returns {boolean} 유효함 여부
   */
  isValidEmail: function(email) {
    if (typeof email !== 'string') return false;
    // 기본 형식: local@domain.tld
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * 유효한 타임스탬프 검증
   * @param {number} ts - 검증할 타임스탬프 (밀리초)
   * @returns {boolean} 유효함 여부
   */
  isValidTimestamp: function(ts) {
    if (typeof ts !== 'number') return false;
    // 2000년 이후, 현재로부터 1년 후까지
    const minTimestamp = 946684800000; // 2000-01-01
    const maxTimestamp = Date.now() + 31536000000; // 현재 + 1년
    return ts > minTimestamp && ts < maxTimestamp;
  },

  /**
   * V2 payload 기본 검증
   */
  isValidV2Payload: function(payload) {
    if (!DATA_VALIDATION.isObject(payload)) return false;
    if (!payload.__meta || !payload.accounts) return false;
    if (!DATA_VALIDATION.isObject(payload.__meta)) return false;
    if (!DATA_VALIDATION.isObject(payload.accounts)) return false;
    return true;
  },

  /**
   * 계정 구조 검증
   */
  isValidAccount: function(account) {
    if (!DATA_VALIDATION.isObject(account)) return false;
    if (!account.encId || typeof account.encId !== 'string') return false;
    if (!Array.isArray(account.sites)) return false;
    return true;
  },

  /**
   * 계정 데이터 일관성 검증
   * sites 배열과 dataBySite 키 불일치 감지
   */
  validateAccountData: function(account) {
    const sites = account?.sites || [];
    const dataBySite = account?.dataBySite || {};

    // 성능 최적화: Set을 사용하여 O(1) 조회
    const sitesSet = new Set(sites);

    const missingData = [];
    for (const site of sites) {
      if (!dataBySite[site]) {
        missingData.push(site);
      }
    }

    const orphanSites = Object.keys(dataBySite).filter(url => !sitesSet.has(url));

    return {
      valid: missingData.length === 0 && orphanSites.length === 0,
      missingData,
      orphanSites,
      sitesCount: sites.length,
      dataCount: Object.keys(dataBySite).length
    };
  }
};

// ============================================================
// P1: V2 SCHEMA VERSION CONSTANTS
// ============================================================
const SCHEMA_VERSIONS = {
  // 현재 지원하는 스키마 버전
  CURRENT: '1.0',

  // 지원 가능한 버전 목록
  SUPPORTED: ['1.0'],

  /**
   * 버전이 지원되는지 확인
   */
  isSupported: function(version) {
    return SCHEMA_VERSIONS.SUPPORTED.includes(version);
  },

  /**
   * 버전 비교
   * @param {string} v1 - 첫 번째 버전
   * @param {string} v2 - 두 번째 버전
   * @returns {number} -1: v1 < v2, 0: v1 == v2, 1: v1 > v2
   */
  compare: function(v1, v2) {
    // 명시적인 null/undefined 체크 (빈 문자열과 구분)
    if (v1 == null && v2 == null) return 0;
    if (v1 == null) return -1;
    if (v2 == null) return 1;

    // 타입 검증
    if (typeof v1 !== 'string' || typeof v2 !== 'string') {
      console.warn('[SCHEMA_VERSIONS.compare] Invalid version types:', v1, v2);
      return 0;
    }

    // 빈 문자열 체크
    const t1 = v1.trim();
    const t2 = v2.trim();
    if (!t1 && !t2) return 0;
    if (!t1) return -1;
    if (!t2) return 1;

    const parts1 = t1.split('.').map(p => {
      const num = parseInt(p, 10);
      return isNaN(num) ? 0 : num;
    });
    const parts2 = t2.split('.').map(p => {
      const num = parseInt(p, 10);
      return isNaN(num) ? 0 : num;
    });

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;
      if (p1 < p2) return -1;
      if (p1 > p2) return 1;
    }
    return 0;
  }
};

// ============================================================
// P1: V2 MERGE STRATEGY CONSTANTS
// ============================================================
const MERGE_STRATEGIES = {
  // 전략 유형
  NEWER: 'newer',      // 최신 데이터 우선
  FIRST: 'first',      // 첫 번째 계정 데이터 우선
  ALL: 'all',          // 모든 데이터 병합
  SOURCE: 'source',    // 소스 데이터 우선
  TARGET: 'target',    // 타겟 데이터 우선

  // 기본 전략
  DEFAULT: 'newer',

  /**
   * 전략 유효성 검증
   */
  isValid: function(strategy) {
    const validStrategies = [MERGE_STRATEGIES.NEWER, MERGE_STRATEGIES.FIRST, MERGE_STRATEGIES.ALL, MERGE_STRATEGIES.SOURCE, MERGE_STRATEGIES.TARGET];
    return validStrategies.includes(strategy);
  },

  /**
   * 전략별 설명
   */
  DESCRIPTIONS: {
    newer: '가장 최신 데이터(__fetched_at 기준)를 사용합니다',
    first: '첫 번째 계정의 데이터를 우선 사용합니다',
    all: '모든 데이터를 병합하여 중복을 제거합니다',
    source: '가져오는 데이터를 우선 적용합니다',
    target: '기존 데이터를 유지합니다'
  }
};

const ALL_SITES_BATCH = 4;
const FULL_REFRESH_BATCH_SIZE = 1;
const FULL_REFRESH_SITE_DELAY_MS = 350;
const FULL_REFRESH_JITTER_MS = 150;

// ============================================================
// P1: USER-FRIENDLY ERROR MESSAGES
// ============================================================
const ERROR_MESSAGES = {
  // Network/Fetch Errors
  NETWORK_ERROR: "네트워크 연결을 확인하고 다시 시도해주세요.",
  REQUEST_TIMEOUT: "요청 시간이 초과했어요. 잠시 후 다시 시도해주세요.",
  MAX_RETRIES_EXCEEDED: "데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.",
  INVALID_ENCID: "사용자 정보를 찾을 수 없어요. 서치어드바이저 페이지에서 다시 실행해주세요.",

  // Data Loading Errors
  DATA_LOAD_ERROR: "데이터를 불러오는 중 오류가 발생했어요.",
  DATA_LOAD_FAILED: "데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.",
  NO_SITE_DATA: "이 사이트의 데이터가 없습니다.",
  EXPOSE_DATA_MISSING: "기본 리포트 데이터가 없어요.",
  DETAIL_DATA_MISSING: "상세 정보를 불러올 수 없어요.",

  // Download/Export Errors
  DOWNLOAD_FAILED: "파일 다운로드에 실패했어요. 다시 시도해주세요.",
  HTML_SAVE_ERROR: "HTML 저장 중 오류가 발생했어요. 다시 시도해주세요.",
  EXPORT_INCOMPLETE: "일부 사이트 데이터를 내보내지 못했어요.",

  // Import/Merge Errors
  IMPORT_FAILED: "데이터 가져오기에 실패했어요.",
  IMPORT_FORMAT_ERROR: "지원하지 않는 파일 형식이에요. V2 형식 파일을 사용해주세요.",
  MERGE_FAILED: "데이터 병합에 실패했어요.",
  NO_VALID_ACCOUNTS: "가져올 계정 데이터가 없어요.",

  // UI Errors
  SITE_NOT_FOUND: "사이트를 찾을 수 없어요.",
  SNAPSHOT_PANEL_NOT_FOUND: "패널을 찾을 수 없어요.",
  RENDER_ERROR: "화면 표시 중 오류가 발생했어요.",

  // Storage Errors
  STORAGE_ERROR: "데이터 저장 중 오류가 발생했어요.",
  CACHE_ERROR: "캐시 데이터를 읽는 중 오류가 발생했어요.",

  // Validation Errors
  INVALID_PAYLOAD: "데이터 형식이 올바르지 않아요.",
  INVALID_ACCOUNT_DATA: "계정 데이터가 올바르지 않아요.",
  DATA_INCONSISTENCY: "데이터 일관성 검사에 실패했어요.",

  // Generic Errors
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
  RETRY_LATER: "잠시 후 다시 시도해주세요.",
  CONTACT_SUPPORT: "문제가 지속되면 고객센터에 문의해주세요."
};

// Helper function to display user-friendly errors
function showError(userMessage, technicalError = null, context = null) {
  // Log technical error for debugging
  if (technicalError) {
    console.error('[Error]', context || 'Unknown', technicalError);
  }

  // Report to error tracking system
  if (typeof ERROR_TRACKING !== 'undefined' && ERROR_TRACKING.reportError) {
    ERROR_TRACKING.reportError({
      type: 'userError',
      message: userMessage,
      technicalError: technicalError?.message || String(technicalError),
      context: context
    });
  }

  return userMessage;
}

// Helper function to create inline error message element
function createInlineError(message, actionCallback = null, actionText = '다시 시도') {
  const container = document.createElement('div');
  container.style.cssText = 'padding:20px;text-align:center;background:#0f172a;border:1px solid #334155;border-radius:12px;margin:16px 0';

  const icon = document.createElement('div');
  icon.style.cssText = 'font-size:32px;margin-bottom:12px;color:#ef4444';
  icon.textContent = '⚠️';

  const messageEl = document.createElement('div');
  messageEl.style.cssText = 'color:#f8fafc;font-weight:700;font-size:14px;margin-bottom:8px';
  messageEl.textContent = message;

  container.appendChild(icon);
  container.appendChild(messageEl);

  if (actionCallback) {
    const button = document.createElement('button');
    button.style.cssText = 'margin-top:12px;padding:8px 16px;background:#0ea5e9;color:#f8fafc;border:none;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;transition:background 0.2s';
    button.textContent = actionText;
    button.onmouseover = () => button.style.background = '#0284c7';
    button.onmouseout = () => button.style.background = '#0ea5e9';
    button.onclick = actionCallback;
    container.appendChild(button);
  }

  return container;
}

async function fetchWithRetry(url, options, maxRetries = 2) {
  let attempt = 0;
  while (attempt <= maxRetries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) return res;
      if (res.status !== 429 && res.status < 500) return res; // Don't retry 4xx (except 429)
    } catch (e) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        console.error('[fetchWithRetry] Request timeout:', url);
        throw new Error(ERROR_MESSAGES.REQUEST_TIMEOUT);
      }
      if (attempt === maxRetries) throw new Error(ERROR_MESSAGES.MAX_RETRIES_EXCEEDED);
    }
    attempt++;
    if (attempt <= maxRetries) {
      const delay = Math.min(CONFIG.RETRY.BASE_DELAY_MS * Math.pow(2, attempt - 1), CONFIG.RETRY.MAX_DELAY_MS);
      const jitter = Math.floor(Math.random() * CONFIG.RETRY.JITTER_MS);
      await new Promise((r) => setTimeout(r, delay + jitter));
    }
  }
  throw new Error(ERROR_MESSAGES.MAX_RETRIES_EXCEEDED);
}

// Tooltip helper functions
let TIP = null;
function tip() {
  if (!TIP) {
    TIP = document.createElement("div");
    TIP.style.cssText =
      "position:fixed;background:rgba(15,23,42,0.9);backdrop-filter:blur(8px);border:1px solid #334155;border-radius:8px;padding:8px 12px;font-size:12px;color:#f8fafc;pointer-events:none;z-index:" + CONFIG.UI.Z_INDEX_TOOLTIP + ";display:none;white-space:nowrap;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);font-family:Pretendard,system-ui";
    document.body.appendChild(TIP);
  }
  return TIP;
}
function showTip(e, h) {
  const t = tip();
  t.innerHTML = escHtml(h);
  t.style.display = "block";
  moveTip(e);
}
function moveTip(e) {
  const t = tip();
  if (t.style.display === "none") return;
  const tw = t.offsetWidth;
  t.style.left =
    (e.clientX + CONFIG.CHART.TOOLTIP_OFFSET.X + tw > window.innerWidth
      ? e.clientX - tw - 10
      : e.clientX + CONFIG.CHART.TOOLTIP_OFFSET.X) + "px";
  t.style.top = e.clientY - CONFIG.CHART.TOOLTIP_OFFSET.Y + "px";
}
function hideTip() {
  tip().style.display = "none";
}

// Sparkline chart function (SVG line chart)
function sparkline(vals, labels, H, col, unit, opts) {
  unit = unit || "";
  opts = opts || {};
  if (!vals || vals.length < 2) return document.createElement("div");
  const W2 = CHART_W;
  const definedVals = vals.filter(isFiniteValue);
  if (!definedVals.length) return document.createElement("div");
  const floorMin =
    typeof opts.minValue === "number" && Number.isFinite(opts.minValue)
      ? opts.minValue
      : null;
  const pL = CONFIG.CHART.PADDING.LEFT,
    pR = CONFIG.CHART.PADDING.RIGHT,
    pT = CONFIG.CHART.PADDING.TOP,
    pB = CONFIG.CHART.PADDING.BOTTOM,
    mx = Math.max(...definedVals),
    mn = floorMin == null ? Math.min(...definedVals) : Math.min(floorMin, Math.min(...definedVals)),
    rng = mx - mn || 1;
  const showYAxisGuides = H >= CONFIG.CHART.MIN_HEIGHT;
  const formatAxisValue = function (value) {
    const rounded =
      Math.abs(value - Math.round(value)) < 0.05
        ? Math.round(value)
        : Math.round(value * 10) / 10;
    return fmt(rounded) + unit;
  };
  const uid = "g" + Math.random().toString(36).slice(2, 6),
    cid = "c" + uid,
    wid = "w" + uid;
  const pts = vals.map((v, i) => {
    const x = +(pL + (i * (W2 - pL - pR)) / (vals.length - 1)).toFixed(1);
    return isFiniteValue(v)
      ? [x, +(pT + (1 - (v - mn) / rng) * (H - pT - pB)).toFixed(1)]
      : [x, null];
  });
  const cleanSegments = [];
  let currentSegment = null;
  pts.forEach(function (pt) {
    if (pt[1] == null) {
      if (currentSegment && currentSegment.length) {
        cleanSegments.push(currentSegment);
        currentSegment = null;
      }
      return;
    }
    if (!currentSegment) {
      currentSegment = [];
    }
    currentSegment.push(pt);
  });
  if (currentSegment && currentSegment.length) {
    cleanSegments.push(currentSegment);
  }
  const path = cleanSegments
    .map(function (seg) {
      return "M" + seg.map((p) => p.join(",")).join(" L");
    })
    .join(" ");
  const area = cleanSegments
    .map(function (seg) {
      return (
        "M" +
        seg[0][0] +
        "," +
        H +
        " L" +
        seg.map((p) => p.join(",")).join(" L") +
        " L" +
        seg[seg.length - 1][0] +
        "," +
        H +
        " Z"
      );
    })
    .join(" ");
  const guideMarkup = showYAxisGuides
    ? [mx, mn + (mx - mn) / 2, mn]
        .reduce(function (acc, value) {
          const y = +(
            pT +
            (1 - (value - mn) / rng) * (H - pT - pB)
          ).toFixed(1);
          if (
            !acc.some(function (entry) {
              return Math.abs(entry.y - y) < CONFIG.CHART.Y_AXIS_COLLISION_THRESHOLD;
            })
          ) {
            acc.push({ value, y });
          }
          return acc;
        }, [])
        .map(function (entry) {
          return (
            '<line x1="' +
            pL +
            '" y1="' +
            entry.y +
            '" x2="' +
            (W2 - pR) +
            '" y2="' +
            entry.y +
            '" stroke="#9cb6cf" stroke-width="1" stroke-dasharray="4,4" opacity="0.34"/>' +
            '<text x="' +
            +(W2 / 2).toFixed(1) +
            '" y="' +
            entry.y +
            '" fill="#d7e5f4" font-size="9" font-weight="700" text-anchor="middle" dominant-baseline="middle" opacity="0.78" style="paint-order:stroke;stroke:#07111d;stroke-width:4;stroke-linejoin:round">' +
            formatAxisValue(entry.value) +
            "</text>"
          );
        })
        .join("")
    : "";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", H);
  svg.setAttribute("viewBox", "0 0 " + W2 + " " + H);
  svg.setAttribute("preserveAspectRatio", "none");
  svg.style.cssText = "display:block;width:100%;height:auto;cursor:crosshair";
  svg.innerHTML =

    '<defs><linearGradient id="' +

    uid +

    '" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="' +

    col +

    '" stop-opacity="0.22"/><stop offset="100%" stop-color="' +

    col +

    '" stop-opacity="0.01"/></linearGradient></defs>' +

    guideMarkup +

    '<path d="' +

    area +

    '" fill="url(#' +

    uid +

    ')"/><path d="' +

    path +

    '" fill="none" stroke="' +

    col +

    '" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/><line id="' +

    wid +

    '" x1="0" y1="0" x2="0" y2="' +

    H +

    '" stroke="#3d5a78" stroke-width="1" stroke-dasharray="3,2" opacity="0"/><circle id="' +

    cid +

    '" cx="0" cy="0" r="3.5" fill="' +

    col +

    '" stroke="#060b14" stroke-width="1.5" opacity="0"/>';

  svg.addEventListener("mousemove", function (e) {
    const rect = svg.getBoundingClientRect(),
      rx = e.clientX - rect.left,
      chartX = rect.width ? (rx / rect.width) * W2 : rx;
    const idx = Math.max(
        0,
        Math.min(
          vals.length - 1,
          Math.round(((chartX - pL) / (W2 - pL - pR)) * (vals.length - 1)),
        ),
      ),
      pt = pts[idx];
    svg.querySelector("#" + wid).setAttribute("x1", pt[0]);
    svg.querySelector("#" + wid).setAttribute("x2", pt[0]);
    svg.querySelector("#" + wid).setAttribute("opacity", "1");
    const c = svg.querySelector("#" + cid);
    if (pt[1] == null) {
      c.setAttribute("opacity", "0");
    } else {
      c.setAttribute("cx", pt[0]);
      c.setAttribute("cy", pt[1]);
      c.setAttribute("opacity", "1");
    }
    showTip(
      e,
      '<span style="color:#7a9ab8;font-size:10px">' +
        ((labels && labels[idx]) || "") +
        '</span><br><b style="color:' +
        col +
        '">' +
        (isFiniteValue(vals[idx])
          ? fmt(vals[idx]) + unit
          : "\uB370\uC774\uD130 \uC5C6\uC74C") +
        "</b>",
    );
  });
  svg.addEventListener("mouseleave", function () {
    svg.querySelector("#" + wid).setAttribute("opacity", "0");
    svg.querySelector("#" + cid).setAttribute("opacity", "0");
    hideTip();
  });
  svg.addEventListener("mousemove", moveTip);
  return svg;
}

// Bar chart function
function barchart(vals, labels, H, col, unit) {
  unit = unit || "";
  if (!vals || !vals.length) return document.createElement("div");
  const W2 = CHART_W;
  const mx = Math.max(...vals) || 1,
    gap = CONFIG.CHART.BAR_GAP,
    bw = Math.max(CONFIG.CHART.MIN_BAR_WIDTH, (W2 - gap * (vals.length + 1)) / vals.length);
  const showYAxisGuides = H >= CONFIG.CHART.MIN_HEIGHT;
  const formatAxisValue = function (value) {
    const rounded =
      Math.abs(value - Math.round(value)) < 0.05
        ? Math.round(value)
        : Math.round(value * 10) / 10;
    return fmt(rounded) + unit;
  };
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", H);
  svg.setAttribute("viewBox", "0 0 " + W2 + " " + H);
  svg.setAttribute("preserveAspectRatio", "none");
  svg.style.cssText = "display:block;width:100%;height:auto";
  const uid = "b" + Math.random().toString(36).slice(2, 5);
  const guideMarkup = showYAxisGuides
    ? [mx, mx / 2, 0]
        .reduce(function (acc, value) {
          const y = +(H - Math.max(2, (value / mx) * (H - 4))).toFixed(1);
          if (
            !acc.some(function (entry) {
              return Math.abs(entry.y - y) < CONFIG.CHART.Y_AXIS_COLLISION_THRESHOLD;
            })
          ) {
            acc.push({ value, y });
          }
          return acc;
        }, [])
        .map(function (entry) {
          return (
            '<line x1="0" y1="' +
            entry.y +
            '" x2="' +
            W2 +
            '" y2="' +
            entry.y +
            '" stroke="#9cb6cf" stroke-width="1" stroke-dasharray="4,4" opacity="0.34"/>' +
            '<text x="' +
            +(W2 / 2).toFixed(1) +
            '" y="' +
            entry.y +
            '" fill="#d7e5f4" font-size="9" font-weight="700" text-anchor="middle" dominant-baseline="middle" opacity="0.78" style="paint-order:stroke;stroke:#07111d;stroke-width:4;stroke-linejoin:round">' +
            formatAxisValue(entry.value) +
            "</text>"
          );
        })
        .join("")
      : "";
  svg.innerHTML = `<defs><linearGradient id="${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${col}" stop-opacity="0.9"/><stop offset="100%" stop-color="${col}" stop-opacity="0.35"/></linearGradient></defs>${guideMarkup}`;
  vals.forEach(function (v, i) {
    const bh = Math.max(2, (v / mx) * (H - 4)),
      x = gap + i * (bw + gap),
      y = H - bh,
      isBest = v === mx;
    const rect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    rect.setAttribute("x", +x.toFixed(1));
    rect.setAttribute("y", +y.toFixed(1));
    rect.setAttribute("width", +bw.toFixed(1));
    rect.setAttribute("height", +bh.toFixed(1));
    rect.setAttribute("rx", "2");
    rect.setAttribute("fill", isBest ? C.green : "url(#" + uid + ")");
    rect.setAttribute("opacity", isBest ? "1" : "0.7");
    rect.addEventListener("mouseenter", function (e) {
      rect.setAttribute("opacity", "1");
      showTip(
        e,
        `<span style="color:#7a9ab8;font-size:10px">${escHtml((labels && labels[i]) || "")}</span><br><b style="color:${col}">${fmt(v)}${unit}</b>`,
      );
    });
    rect.addEventListener("mouseleave", function () {
      rect.setAttribute("opacity", isBest ? "1" : "0.7");
      hideTip();
    });
    rect.addEventListener("mousemove", moveTip);
    svg.appendChild(rect);
  });
  return svg;
}

// X-axis labels function
function xlbl(arr) {
  if (!arr || !arr.length) return "";
  const rankLike = arr.every(function (v) {
    return /^#\d+$/.test(v || "");
  });
  const labels = [];
  if (rankLike && arr.length >= 20) {
    labels.push(arr[0]);
    for (let i = 9; i < arr.length; i += 10) labels.push(arr[i]);
    if (labels[labels.length - 1] !== arr[arr.length - 1]) {
      labels.push(arr[arr.length - 1]);
    }
  } else {
    labels.push(arr[0]);
    if (arr.length > 2) labels.push(arr[Math.floor(arr.length / 2)]);
    if (arr.length > 1) labels.push(arr[arr.length - 1]);
  }
  return `<div style="display:flex;justify-content:space-between;gap:8px;padding:4px 2px 0">${labels
    .map(function (label) {
      return `<span style="font-size:9px;color:#3d5a78">${escHtml(label || "")}</span>`;
    })
    .join("")}</div>`;
}

// Chart card wrapper function
function chartCard(title, valueStr, valueCol, svgEl, labelsArr) {
  const wrap = document.createElement("div");
  wrap.style.cssText =
    "background:#0f172a;border:1px solid #334155;border-radius:12px;padding:16px;margin-bottom:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)";
  const hd = document.createElement("div");
  hd.style.cssText =
    "display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:12px";
  hd.innerHTML = `<span style="font-size:12px;line-height:1.4;color:#94a3b8;font-weight:600">${escHtml(title)}</span><span style="font-size:14px;line-height:1.2;font-weight:800;color:${valueCol};text-align:right;letter-spacing:-0.01em">${escHtml(valueStr)}</span>`;
  wrap.appendChild(hd);
  wrap.appendChild(svgEl);
  if (labelsArr) {
    const lbl = document.createElement("div");
    lbl.innerHTML = xlbl(labelsArr);
    wrap.appendChild(lbl);
  }
  return wrap;
}

// KPI grid function
function kpiGrid(items) {
  const g = document.createElement("div");
  g.style.cssText = `display:grid;grid-template-columns:repeat(${Math.min(items.length, 4)},minmax(0,1fr));gap:8px;margin-bottom:12px`;
  items.forEach(function (it) {
    const d = document.createElement("div");
    d.style.cssText =
      "background:#0f172a;border:1px solid #334155;border-radius:12px;padding:16px 8px;text-align:center;min-width:0;min-height:90px;display:flex;flex-direction:column;justify-content:center;align-items:center;transition:all 0.2s;box-shadow:0 1px 2px rgba(0,0,0,0.05)";
    const iconHtml = it.icon ? `<div style="margin-bottom:8px;color:${it.color || '#94a3b8'};opacity:0.8">${it.icon}</div>` : "";
    d.innerHTML = `${iconHtml}<div style="font-size:16px;font-weight:800;color:${it.color || C.text};line-height:1.1;letter-spacing:-0.02em;word-break:keep-all">${escHtml(it.value)}</div><div style="font-size:10px;color:#64748b;line-height:1.4;margin-top:4px;visibility:${it.sub ? "visible" : "hidden"}">${escHtml(it.sub || "&nbsp;")}</div><div style="font-size:10px;color:#94a3b8;line-height:1.4;margin-top:6px;word-break:keep-all;font-weight:500">${escHtml(it.label)}</div>`;
    g.appendChild(d);
  });
  return g;
}

// Section title function
function secTitle(t) {
  const d = document.createElement("div");
  d.style.cssText =
    "font-size:11px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#64748b;margin:24px 0 12px;display:flex;align-items:center;gap:10px";
  d.innerHTML =
    escHtml(t) +
    ' <span style="flex:1;height:1px;background:#334155;display:inline-block;opacity:0.3"></span>';
  return d;
}

// Info box function
// Security Note: This function uses innerHTML for HTML content. All dynamic values in
// call sites MUST be escaped using escHtml(). Fixed: 08-renderers.js line 558 (slug value).
// When adding new ibox() calls with dynamic content, always use escHtml() for user/API data.
// P0-1: XSS 취약점 수정 - 개발 환경에서 보안 경고 추가
function ibox(type, html) {
  // 개발 환경에서 잠재적 XSS 위험 경고
  if (typeof window !== "undefined" &&
      typeof html === "string" &&
      html.includes("<") &&
      !html.includes("&lt;") &&
      // 이미 escape된 HTML인지 확인 (안전한 패턴)
      !/^(<span|<div|<b>|<strong>|<em>|<i>|<br|<hr|\/[a-z]+>|\s+)*$/i.test(html)) {
    console.warn("[SECURITY] ibox() 호출에 원시 HTML이 포함되어 있습니다. 동적 값에는 escHtml()를 사용하세요.");
    console.warn("[SECURITY] HTML 내용:", html.substring(0, 100));
    console.trace("[SECURITY] 호출 스택:");
  }

  const col =
    { green: C.green, amber: C.amber, red: C.red, blue: C.blue }[type] ||
      C.blue;
  const d = document.createElement("div");
  d.style.cssText = `border-left:3px solid ${col};background:${col}0d;border-radius:12px;padding:16px;margin-bottom:12px;font-size:12px;line-height:1.6;color:#94a3b8;border:1px solid ${col}22`;
  d.innerHTML = html; // SECURITY WARNING: Ensure html parameter is sanitized before use
  return d;
}

// CTR badge function
function ctrBadge(v) {
  const n = parseFloat(v);
  if (isNaN(n)) {
    return '<span style="display:inline-block;background:#1e293b;border:1px solid #334155;color:#64748b;font-size:10px;font-weight:700;padding:1px 6px;border-radius:20px">-</span>';
  }
  const col = n >= 3 ? C.green : n >= 1.5 ? C.amber : C.blue;
  return `<span style="display:inline-block;background:${col}18;border:1px solid ${col}44;color:${col};font-size:10px;font-weight:700;padding:1px 6px;border-radius:20px">${n.toFixed(2)}%</span>`;
}

// Horizontal bar function
function hbar(v, mx, col) {
  const pct = mx ? Math.round((v / mx) * 100) : 0;
  return `<div style="height:6px;background:#1e293b;border-radius:3px;margin:8px 0 10px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${col};border-radius:3px;transition:width 0.5s ease-out"></div></div>`;
}

// Statistics function (mean, std, cv, slope, outliers)
function st(arr) {
  if (!arr || !arr.length)
    return { mean: 0, std: 0, cv: 0, slope: 0, outliers: [] };
  const n = arr.length,
    mean = arr.reduce((a, b) => a + b, 0) / n;
  const sorted = [...arr].sort((a, b) => a - b);
  const std = Math.sqrt(arr.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
  const cv = mean ? std / mean : 0;
  const xs = arr.map((_, i) => i),
    xm = xs.reduce((a, b) => a + b, 0) / n;
  const slope =
    xs.reduce((a, x, i) => a + (x - xm) * (arr[i] - mean), 0) /
    (xs.reduce((a, x) => a + (x - xm) ** 2, 0) || 1);
  const q1 = sorted[Math.floor(n * 0.25)],
    q3 = sorted[Math.floor(n * 0.75)],
    iqr = q3 - q1;
  const outliers = arr.filter(
    (v) => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr,
  );
  return { mean, std, cv, slope, outliers };
}

// Pearson correlation coefficient function
function pearson(xs, ys) {
  const n = xs.length,
    mx = xs.reduce((a, b) => a + b, 0) / n,
    my = ys.reduce((a, b) => a + b, 0) / n;
  const num = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0);
  const den = Math.sqrt(
    xs.reduce((a, x) => a + (x - mx) ** 2, 0) *
      ys.reduce((a, y) => a + (y - my) ** 2, 0),
  );
  return den ? num / den : 0;
}

// HTML escape function (must be defined before functions that use it)
function escHtml(v) {
  return String(v || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\//g, "&#x2F;");
}

// ============================================================
// V2 PAYLOAD HELPER FUNCTIONS - FINAL VERSION
// ============================================================
// Integration Point: After line 485 (after escHtml function)
// Dependencies: Uses P, PAYLOAD_SCHEMA, PAYLOAD_FIELDS from 00-constants.js
// Strategy: Big Bang Migration (v1 legacy removed)
// ============================================================

// ============================================================
// CACHE IMPLEMENTATION (Map + TTL 5 minutes)
// ============================================================

const V2_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const v2Cache = new Map();

/**
 * Create cache entry with timestamp
 * @private
 */
function createV2CacheEntry(value) {
  return {
    value,
    expiresAt: Date.now() + V2_CACHE_TTL_MS
  };
}

/**
 * Get cached value if not expired
 * @private
 */
function getV2Cached(key) {
  const entry = v2Cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    v2Cache.delete(key);
    return null;
  }

  return entry.value;
}

/**
 * Set cached value with TTL
 * @private
 */
function setV2Cached(key, value) {
  v2Cache.set(key, createV2CacheEntry(value));

  // Prevent unbounded growth: clean old entries periodically
  if (v2Cache.size > 100) {
    const now = Date.now();
    for (const [k, v] of v2Cache.entries()) {
      if (now > v.expiresAt) {
        v2Cache.delete(k);
      }
    }
  }
}

/**
 * Clear all V2 cache entries
 * @public
 */
function clearV2Cache() {
  v2Cache.clear();
}

// ============================================================
// URL NORMALIZATION (Extracted to reduce duplication)
// ============================================================

/**
 * Normalize site URL to canonical form
 * Removes trailing slashes, ensures https:// prefix
 * @param {string} url - Site URL
 * @returns {string} Normalized URL
 */
function normalizeSiteUrl(url) {
  if (!url || typeof url !== 'string') return '';

  let normalized = url.trim().toLowerCase();

  // Remove trailing slashes
  normalized = normalized.replace(/\/+$/, '');

  // Ensure protocol
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = 'https://' + normalized;
  }

  return normalized;
}

// ============================================================
// V2 PAYLOAD DETECTION & VALIDATION
// ============================================================

/**
 * Check if payload is V2 format
 * Uses P constants from 00-constants.js for field names
 * @param {Object} payload - Payload object to check
 * @returns {boolean} True if V2 payload
 */
function isV2Payload(payload) {
  if (!payload || typeof payload !== 'object') return false;

  // Check for __meta field (V2 marker)
  const meta = payload[P.ROOT.META] || payload.__meta;
  if (!meta || typeof meta !== 'object') return false;

  // Check version (use P constant or fallback)
  const version = meta[PAYLOAD_FIELDS.VERSION] || meta.version;
  return version === PAYLOAD_V2.VERSION;
}

/**
 * Validate V2 payload structure
 * @param {Object} payload - Payload to validate
 * @returns {Object} Validation result {valid, errors}
 */
function validateV2Payload(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    errors.push('Payload must be an object');
    return { valid: false, errors };
  }

  // Check required root fields
  const meta = payload[PAYLOAD_FIELDS.META] || payload.__meta;
  if (!meta) errors.push('Missing __meta field');

  const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || payload.accounts;
  if (!accounts || typeof accounts !== 'object') {
    errors.push('Missing or invalid accounts field');
  }

  const ui = payload[PAYLOAD_FIELDS.UI] || payload.ui;
  if (!ui || typeof ui !== 'object') {
    errors.push('Missing or invalid ui field');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// ============================================================
// ACCOUNT OPERATIONS
// ============================================================

/**
 * Get account count from payload
 * @param {Object} payload - V2 payload
 * @returns {number} Account count (0 if invalid)
 */
function getAccountCount(payload) {
  if (!payload) return 0;

  const meta = payload[PAYLOAD_FIELDS.META] || payload.__meta;
  if (meta) {
    return meta[PAYLOAD_FIELDS.ACCOUNT_COUNT] || meta.accountCount || 0;
  }

  // Fallback: count actual accounts
  const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || payload.accounts;
  if (accounts && typeof accounts === 'object') {
    return Object.keys(accounts).length;
  }

  return 0;
}

/**
 * Get all account emails from payload
 * @param {Object} payload - V2 payload
 * @returns {string[]} Array of email addresses
 */
function getAccountEmails(payload) {
  if (!payload) return [];

  const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || payload.accounts;
  if (!accounts || typeof accounts !== 'object') return [];

  return Object.keys(accounts);
}

/**
 * Get specific account data by email
 * @param {Object} payload - V2 payload
 * @param {string} email - Account email
 * @returns {Object|null} Account object or null
 */
function getAccountByEmail(payload, email) {
  if (!payload || !email) return null;

  const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || payload.accounts;
  if (!accounts || typeof accounts !== 'object') return null;

  return accounts[email] || null;
}

// ============================================================
// SITE OPERATIONS (O(1) optimized with index)
// ============================================================

/**
 * Build site-to-account index for O(1) lookups
 * Cached for 5 minutes to avoid rebuilding
 * @private
 */
function buildSiteToAccountIndex(payload) {
  const cacheKey = 'siteIndex_' + (payload?.__meta?.savedAt || 'unknown');
  let index = getV2Cached(cacheKey);

  if (index) return index;

  index = new Map();

  const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || payload.accounts;
  if (!accounts || typeof accounts !== 'object') {
    setV2Cached(cacheKey, index);
    return index;
  }

  for (const [email, account] of Object.entries(accounts)) {
    const sites = account[PAYLOAD_FIELDS.SITES] || account.sites || [];
    for (const site of sites) {
      const normalized = normalizeSiteUrl(site);
      if (normalized) {
        index.set(normalized, email);
      }
    }
  }

  setV2Cached(cacheKey, index);
  return index;
}

/**
 * Get all unique sites from all accounts (deduplicated, sorted)
 * @param {Object} payload - V2 payload
 * @returns {string[]} Sorted array of unique site URLs
 */
function getAllSites(payload) {
  if (!payload) return [];

  const cacheKey = 'allSites_' + (payload?.__meta?.savedAt || 'unknown');
  let cached = getV2Cached(cacheKey);
  if (cached) return cached;

  const sites = new Set();

  const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || payload.accounts;
  if (!accounts || typeof accounts !== 'object') {
    return [];
  }

  for (const account of Object.values(accounts)) {
    const accountSites = account[PAYLOAD_FIELDS.SITES] || account.sites || [];
    for (const site of accountSites) {
      const normalized = normalizeSiteUrl(site);
      if (normalized) {
        sites.add(normalized);
      }
    }
  }

  const result = Array.from(sites).sort();
  setV2Cached(cacheKey, result);
  return result;
}

/**
 * Find account email that owns a specific site
 * Uses index for O(1) lookup instead of O(n) iteration
 * @param {string} siteUrl - Site URL to find
 * @param {Object} payload - V2 payload
 * @returns {string|null} Account email or null
 */
function getAccountForSite(siteUrl, payload) {
  if (!payload || !siteUrl) return null;

  const normalized = normalizeSiteUrl(siteUrl);
  if (!normalized) return null;

  const index = buildSiteToAccountIndex(payload);
  return index.get(normalized) || null;
}

/**
 * Check if a site exists in the payload
 * @param {string} siteUrl - Site URL to check
 * @param {Object} payload - V2 payload
 * @returns {boolean} True if site exists
 */
function hasSite(siteUrl, payload) {
  return getAccountForSite(siteUrl, payload) !== null;
}

// ============================================================
// SITE DATA OPERATIONS
// ============================================================

/**
 * Get data for a specific site
 * @param {string} siteUrl - Site URL
 * @param {Object} payload - V2 payload
 * @returns {Object|null} Site data object or null
 */
function getSiteData(siteUrl, payload) {
  if (!payload || !siteUrl) return null;

  const email = getAccountForSite(siteUrl, payload);
  if (!email) return null;

  const account = getAccountByEmail(payload, email);
  if (!account) return null;

  const normalized = normalizeSiteUrl(siteUrl);
  const dataBySite = account[PAYLOAD_FIELDS.DATA_BY_SITE] || account.dataBySite;

  return dataBySite?.[normalized] || null;
}

/**
 * Get metadata for a specific site
 * @param {string} siteUrl - Site URL
 * @param {Object} payload - V2 payload
 * @returns {Object|null} Site metadata or null
 */
function getSiteMeta(siteUrl, payload) {
  if (!payload || !siteUrl) return null;

  const email = getAccountForSite(siteUrl, payload);
  if (!email) return null;

  const account = getAccountByEmail(payload, email);
  if (!account) return null;

  const normalized = normalizeSiteUrl(siteUrl);
  const siteMeta = account[PAYLOAD_FIELDS.SITE_META] || account.siteMeta;

  return siteMeta?.[normalized] || null;
}

/**
 * Get site label (display name)
 * @param {string} siteUrl - Site URL
 * @param {Object} payload - V2 payload
 * @returns {string} Label or URL fallback
 */
function getSiteLabel(siteUrl, payload) {
  const meta = getSiteMeta(siteUrl, payload);
  if (meta) {
    return meta[PAYLOAD_FIELDS.LABEL] || meta.label || siteUrl;
  }
  return siteUrl || '';
}

// ============================================================
// UI STATE OPERATIONS
// ============================================================

/**
 * Get current UI state from payload
 * @param {Object} payload - V2 payload
 * @returns {Object} {curMode, curSite, curTab}
 */
function getUIState(payload) {
  if (!payload) {
    return {
      curMode: P.DEFAULTS.MODE,
      curSite: P.DEFAULTS.CUR_SITE,
      curTab: P.DEFAULTS.CUR_TAB
    };
  }

  const ui = payload[PAYLOAD_FIELDS.UI] || payload.ui || {};

  return {
    curMode: ui[PAYLOAD_FIELDS.CUR_MODE] || ui.curMode || P.DEFAULTS.MODE,
    curSite: ui[PAYLOAD_FIELDS.CUR_SITE] || ui.curSite || P.DEFAULTS.CUR_SITE,
    curTab: ui[PAYLOAD_FIELDS.CUR_TAB] || ui.curTab || P.DEFAULTS.CUR_TAB
  };
}

/**
 * Set UI state in payload
 * @param {Object} payload - V2 payload (modified in place)
 * @param {Object} state - {curMode, curSite, curTab}
 * @returns {Object} Modified payload
 */
function setUIState(payload, state) {
  if (!payload || !state) return payload;

  if (!payload.ui) payload.ui = {};
  const ui = payload.ui;

  if (state.curMode !== undefined) ui.curMode = state.curMode;
  if (state.curSite !== undefined) ui.curSite = state.curSite;
  if (state.curTab !== undefined) ui.curTab = state.curTab;

  return payload;
}

// ============================================================
// STATS & SUMMARY OPERATIONS
// ============================================================

/**
 * Get stats from payload
 * @param {Object} payload - V2 payload
 * @returns {Object} {success, partial, failed, errors}
 */
function getStats(payload) {
  if (!payload) {
    return { success: 0, partial: 0, failed: 0, errors: [] };
  }

  const stats = payload.stats || {};
  return {
    success: stats.success || 0,
    partial: stats.partial || 0,
    failed: stats.failed || 0,
    errors: Array.isArray(stats.errors) ? stats.errors : []
  };
}

/**
 * Get summary data (for merged reports)
 * @param {Object} payload - V2 payload
 * @returns {Object|null} Summary object or null
 */
function getSummary(payload) {
  if (!payload) return null;
  return payload[PAYLOAD_FIELDS.SUMMARY] || payload._summary || null;
}

/**
 * Get site ownership map (for conflict resolution)
 * @param {Object} payload - V2 payload
 * @returns {Object} Map of site -> [emails]
 */
function getSiteOwnership(payload) {
  const summary = getSummary(payload);
  if (!summary) return {};

  return summary.siteOwnership || {};
}

// ============================================================
// MIGRATION HELPERS (Big Bang - no v1 support)
// ============================================================

/**
 * Create empty V2 payload structure
 * @param {string} email - Account email
 * @param {string} encId - Encrypted ID
 * @returns {Object} Empty V2 payload
 */
function createEmptyV2Payload(email, encId) {
  return {
    __meta: {
      version: PAYLOAD_V2.VERSION,
      savedAt: new Date().toISOString(),
      accountCount: 1
    },
    accounts: {
      [email]: {
        encId: encId || 'unknown',
        sites: [],
        siteMeta: {},
        dataBySite: {}
      }
    },
    ui: {
      curMode: P.DEFAULTS.MODE,
      curSite: P.DEFAULTS.CUR_SITE,
      curTab: P.DEFAULTS.CUR_TAB
    },
    stats: {
      success: 0,
      partial: 0,
      failed: 0,
      errors: []
    }
  };
}

/**
 * Clone V2 payload (deep copy)
 * @param {Object} payload - V2 payload
 * @returns {Object} Cloned payload
 */
function cloneV2Payload(payload) {
  if (!payload) return null;

  try {
    return JSON.parse(JSON.stringify(payload));
  } catch (e) {
    console.error('[cloneV2Payload] Failed to clone:', e);
    return null;
  }
}

// ============================================================
// END OF V2 HELPER FUNCTIONS
// ============================================================

// DOM Initialization Module
// This module handles the creation and initialization of the SearchAdvisor UI DOM elements
// Note: escHtml() function is provided by 01-helpers.js

// Remove old panel if it exists
const old = document.getElementById("sadv-p");
if (old) {
  old.remove();
  document.getElementById("sadv-inj") &&
    document.getElementById("sadv-inj").remove();
  return;
}

// Inject style to adjust HTML margin for the panel
const inj = document.createElement("style");
inj.id = "sadv-inj";
inj.textContent = `html{margin-right:min(${PNL}px,100vw) !important;transition:margin-right .25s ease;box-sizing:border-box;}`;
document.head.appendChild(inj);

// Create main panel
const p = document.createElement("div");
p.id = "sadv-p";
p.style.cssText = `position:fixed;top:0;right:0;width:min(${PNL}px,100vw);max-width:100vw;height:100vh;display:flex;flex-direction:column;background:#020617;z-index:9999999;font-family:Pretendard,system-ui,sans-serif;font-size:13px;color:#f8fafc;border-left:1px solid #334155;box-sizing:border-box;box-shadow:-10px 0 15px -3px rgba(0,0,0,0.1)`;
p.innerHTML = `<style>#sadv-p *{box-sizing:border-box}#sadv-p ::-webkit-scrollbar{width:6px}#sadv-p ::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}#sadv-header{padding:20px;border-bottom:1px solid #1e293b;background:rgba(2,6,23,0.8);backdrop-filter:blur(12px)}#sadv-mode-bar{display:flex;gap:4px;margin-top:16px;background:#0f172a;padding:4px;border-radius:12px;border:1px solid #334155}.sadv-mode{flex:1;background:transparent;border:none;color:#94a3b8;border-radius:8px;padding:8px;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}.sadv-mode.on{background:#1e293b;color:#0ea5e9;box-shadow:0 4px 6px -1px rgba(0,0,0,0.2)}#sadv-site-bar{margin-top:12px;position:relative;display:none}#sadv-site-bar.show{display:block}#sadv-combo-wrap{position:relative}#sadv-combo-btn{width:100%;background:#0f172a;border:1px solid #334155;color:#f8fafc;border-radius:10px;padding:10px 36px 10px 12px;font-size:13px;cursor:pointer;text-align:left;font-family:inherit;transition:all .2s;display:flex;align-items:center;gap:10px}#sadv-combo-btn:hover{border-color:#0ea5e9;background:#1e293b}#sadv-combo-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;background:#64748b}#sadv-combo-label{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:500}#sadv-combo-arrow{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:#64748b;font-size:12px;pointer-events:none;transition:transform .2s}#sadv-combo-wrap.open #sadv-combo-arrow{transform:translateY(-50%) rotate(180deg)}#sadv-combo-drop{display:none;position:absolute;top:calc(100% + 8px);left:0;right:0;background:#0f172a;border:1px solid #334155;border-radius:12px;padding:6px;z-index:100;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);max-height:300px;overflow-y:auto}#sadv-combo-wrap.open #sadv-combo-drop{display:block}.sadv-combo-item{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;cursor:pointer;transition:all .1s;border:1px solid transparent}.sadv-combo-item:hover{background:#1e293b}.sadv-combo-item.active{background:#1e293b;border-color:#334155;color:#0ea5e9}#sadv-tabs{display:none;flex-wrap:wrap;gap:6px;padding:12px 20px;background:#020617;border-bottom:1px solid #1e293b;justify-content:center}#sadv-tabs.show{display:flex;justify-content:center}#sadv-tabs::-webkit-scrollbar{display:none}.sadv-t{background:transparent;border:1px solid transparent;color:#64748b;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}.sadv-t:hover{color:#f8fafc;background:#1e293b}.sadv-t.on{background:rgba(14,165,233,0.1);border-color:rgba(14,165,233,0.2);color:#0ea5e9}#sadv-refresh-btn{display:inline-flex;align-items:center;gap:6px;background:#0f172a;border:1px solid #334155;color:#94a3b8;border-radius:8px;padding:6px 10px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s}#sadv-refresh-btn:hover{border-color:#0ea5e9;color:#0ea5e9;background:#1e293b}#sadv-bd{flex:1;overflow-y:auto;overflow-x:hidden;padding:20px}#sadv-tabpanel{flex:1;overflow-y:auto;overflow-x:hidden;padding:20px}.sadv-allcard{background:#0f172a;border:1px solid #1e293b;border-radius:16px;padding:20px;margin-bottom:16px;cursor:pointer;transition:all .2s}.sadv-allcard:hover{border-color:#334155;transform:translateY(-2px)}</style><div id="sadv-header"><div style="display:flex;justify-content:space-between;align-items:center"><div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><div style="display:flex;align-items:center;gap:7px;font-size:18px;font-weight:800;letter-spacing:-0.03em"><span style="display:inline-flex;opacity:0.95">${ICONS.logoSearch}</span>Search<span style="color:#10b981">Advisor</span></div><div id="sadv-account-badge" style="display:none;padding:4px 12px;border-radius:999px;border:1px solid #1e293b;color:#0ea5e9;background:rgba(15,23,42,0.6);font-size:11px;font-weight:600;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></div></div><div id="sadv-site-label" style="font-size:11px;color:#64748b;margin-top:4px;display:flex;align-items:center;gap:4px">\ub85c\ub529 \uc911...</div></div><div style="display:flex;gap:8px;align-items:center"><button id="sadv-refresh-btn" class="sadv-btn" title="새로고침" style="display:inline-flex;align-items:center;gap:5px">${ICONS.refresh} 새로고침</button><button id="sadv-save-btn" class="sadv-btn" title="현재 화면 저장" style="display:inline-flex;align-items:center;gap:5px">${ICONS.save} 저장</button><button id="sadv-x" style="background:none;border:1px solid #1e293b;color:#475569;width:32px;height:32px;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s">${ICONS.xMark}</button></div></div><div id="sadv-mode-bar"><button class="sadv-mode on" data-m="all" style="display:inline-flex;align-items:center;justify-content:center;gap:5px">${ICONS.globe} 전체현황</button><button class="sadv-mode" data-m="site" style="display:inline-flex;align-items:center;justify-content:center;gap:5px">${ICONS.layers} 사이트별</button></div><div id="sadv-site-bar"><div id="sadv-combo-wrap"><button id="sadv-combo-btn"><span id="sadv-combo-dot"></span><span id="sadv-combo-label">\uc0ac\uc774\ud2b8 \uc120\ud0dd</span></button><span id="sadv-combo-arrow" style="display:inline-flex;align-items:center">${ICONS.chevronDown}</span><div id="sadv-combo-drop"></div></div></div></div><div id="sadv-tabs"></div><div id="sadv-bd"><div style="padding:60px 20px;text-align:center;color:#64748b">⏳ \ub85c\ub529 \uc911...</div></div>`;
document.body.appendChild(p);

// Add additional UI styles
const siteUiStyle = document.createElement("style");
siteUiStyle.textContent = `
#sadv-tabs{
  position:relative;
}
#sadv-tabs.show{
  display:flex !important;
  flex-wrap:wrap;
  gap:6px;
  padding:12px 20px;
  background:#020617;
  border-bottom:1px solid #1e293b;
}
.sadv-t{
  position:relative;
  min-height:32px;
  padding:6px 12px;
  border-radius:8px;
  border:1px solid transparent;
  background:transparent;
  color:#64748b;
  font-size:12px;
  font-weight:600;
  transition:all 0.2s ease;
  margin:0;
}
.sadv-t:hover{
  color:#f8fafc;
  background:#1e293b;
}
.sadv-t.on{
  background:rgba(14, 165, 233, 0.1);
  border-color:rgba(14, 165, 233, 0.2);
  color:#0ea5e9;
}
#sadv-bd{
  padding:20px;
}
#sadv-save-btn{
  display:inline-flex;
  align-items:center;
  gap:6px;
  background:#0f172a;
  border:1px solid #334155;
  color:#94a3b8;
  border-radius:8px;
  padding:6px 10px;
  font-size:12px;
  font-weight:600;
  cursor:pointer;
  font-family:inherit;
  transition:all 0.2s ease;
}
#sadv-save-btn:hover{
  border-color:#0ea5e9;
  color:#0ea5e9;
  background:#1e293b;
}
#sadv-x:hover {
  border-color:#ef4444;
  color:#ef4444;
  background:rgba(239,68,68,0.1);
}
`;
p.appendChild(siteUiStyle);

// Setup close button handler
document.getElementById("sadv-x").onclick = function () {
  p.remove();
  document.getElementById("sadv-inj") &&
    document.getElementById("sadv-inj").remove();
  if (TIP) {
    TIP.remove();
    TIP = null;
  }
};

// Helper functions
// Note: escHtml() is provided by 01-helpers.js
function pad2(v) {
  return String(v).padStart(2, "0");
}

function stampFile(d) {
  return (
    d.getFullYear() +
    pad2(d.getMonth() + 1) +
    pad2(d.getDate()) +
    "-" +
    pad2(d.getHours()) +
    pad2(d.getMinutes()) +
    pad2(d.getSeconds())
  );
}

function stampLabel(d) {
  return (
    d.getFullYear() +
    "." +
    pad2(d.getMonth() + 1) +
    "." +
    pad2(d.getDate()) +
    " " +
    pad2(d.getHours()) +
    ":" +
    pad2(d.getMinutes()) +
    ":" +
    pad2(d.getSeconds())
  );
}

function fileSafe(v) {
  return String(v || "snapshot")
    .replace(/^https?:\/\//, "")
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function accountIdFromLabel(v) {
  const raw = String(v || "").trim();
  const localPart = raw.includes("@") ? raw.split("@")[0] : raw;
  return fileSafe(localPart || "unknown");
}

// P0-3: ACCOUNT_UTILS 통합 - 중복 제거
// 이제 ACCOUNT_UTILS.getAccountLabel()을 사용하세요.
// getAccountLabel()은 ACCOUNT_UTILS로 이동됨.

function applyAccountBadge(accountLabel) {
  const badge = document.getElementById("sadv-account-badge");
  if (!badge) return;
  if (!accountLabel) {
    badge.style.display = "none";
    badge.textContent = "";
    badge.removeAttribute("title");
    return;
  }
  badge.style.display = "inline-flex";
  badge.textContent = accountLabel;
  badge.title = accountLabel;
}

// Initialize tabsEl for global access
window.__sadvTabsEl = document.getElementById("sadv-tabs");

// ============================================================
// DATA-MANAGER - Data storage and caching utilities
// ============================================================

let allSites = [];
const memCache = {};

function getCacheNamespace() {
  // For demo/test mode, use a fixed namespace
  if (IS_DEMO_MODE) return 'demo';
  // For production, use account-based namespace
  return 'default';
}

// P0-3: ACCOUNT_UTILS 통합 - 중복 제거
// 이제 ACCOUNT_UTILS.getAccountLabel()을 사용하세요.
// getAccountLabel()은 ACCOUNT_UTILS로 이동됨.

function lsGet(k) {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : null;
  } catch (e) {
    console.error('[lsGet] Error:', e);
    return null;
  }
}

function lsSet(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {
    console.error('[lsSet] Error:', e);
  }
}

function getCachedData(site) {
  const d = lsGet(getSiteDataCacheKey(site));
  if (!d) return null;
  if (!d.data || typeof d.data !== "object") return null;
  // TTL 검증 (타입 체크 추가)
  if (d.ts && typeof d.ts === "number" && Date.now() - d.ts > DATA_TTL) return null;
  return {
    ...d.data,
    __cacheSavedAt: typeof d.ts === "number" ? d.ts : null,
  };
}

function setCachedData(site, data) {
  lsSet(getSiteDataCacheKey(site), {
    ts: Date.now(),
    data,
  });
}

function clearCachedData(site) {
  try {
    localStorage.removeItem(getSiteDataCacheKey(site));
  } catch (e) {
    console.error('[clearCachedData] Error:', e);
  }
}

function getSiteListCacheKey() {
  return SITE_LS_KEY + "_" + getCacheNamespace();
}

function getSiteDataCacheKey(site) {
  try {
    // 유니코드 지원을 위해 encodeURIComponent 후 인코딩
    const encoded = btoa(encodeURIComponent(site));
    return DATA_LS_PREFIX + getCacheNamespace() + "_" + encoded.replace(/=/g, "");
  } catch (e) {
    console.error('[getSiteDataCacheKey] Encoding error for site:', site, e);
    // 실패 시 타임스탬프 기반 폴백 키 사용
    return DATA_LS_PREFIX + getCacheNamespace() + "_" + Date.now();
  }
}

function getSiteListCacheStamp() {
  const cached = lsGet(getSiteListCacheKey());
  return cached && typeof cached.ts === "number" ? cached.ts : null;
}

function getSiteDataCacheStamp(site) {
  const cached = lsGet(getSiteDataCacheKey(site));
  return cached && typeof cached.ts === "number" ? cached.ts : null;
}

function getUiStateCacheKey() {
  return UI_STATE_LS_KEY + "_" + getCacheNamespace();
}

function getCachedUiState() {
  const cached = lsGet(getUiStateCacheKey());
  if (!cached || typeof cached !== "object") return null;
  if (cached.ts && Date.now() - cached.ts > 7 * 24 * 60 * 60 * 1000) return null; // 7일 TTL
  const mode = cached.mode === "site" ? "site" : cached.mode === "all" ? "all" : null;
  const tab = typeof cached.tab === "string" ? cached.tab : null;
  const site = typeof cached.site === "string" ? cached.site : null;
  if (!mode && !tab && !site) return null;
  return {
    mode,
    tab,
    site,
  };
}

function setCachedUiState() {
  lsSet(getUiStateCacheKey(), {
    ts: Date.now(),
    mode: curMode,
    tab: curTab,
    site: curSite,
  });
}

const FIELD_FAILURE_RETRY_MS = 5 * 60 * 1000;
const FIELD_SUCCESS_TTL_MS = DATA_TTL;

function hasOwnDataField(data, key) {
  return !!data && Object.prototype.hasOwnProperty.call(data, key);
}

function getFieldSnapshotFetchedAt(data, key) {
  if (!data) return null;
  const fetchedAt = data[key + "FetchedAt"];
  if (typeof fetchedAt === "number") return fetchedAt;
  return typeof data.__cacheSavedAt === "number" ? data.__cacheSavedAt : null;
}

function hasFreshFieldSnapshot(data, key, ttlMs = FIELD_SUCCESS_TTL_MS) {
  const fetchedAt = getFieldSnapshotFetchedAt(data, key);
  return typeof fetchedAt === "number" && Date.now() - fetchedAt < ttlMs;
}

function hasLegacySuccessfulFieldSnapshot(data, key) {
  if (!data) return false;
  if (key === "expose") return data.expose != null;
  if ((key === "crawl" || key === "backlink") && data.detailLoaded === true) {
    return data[key] != null;
  }
  return false;
}

function hasSuccessfulFieldSnapshot(data, key) {
  return !!(
    data &&
    hasFreshFieldSnapshot(data, key) &&
    hasOwnDataField(data, key) &&
    (data[key + "FetchState"] === "success" ||
      hasLegacySuccessfulFieldSnapshot(data, key))
  );
}

function hasRecentFieldFailure(data, key, cooldownMs = FIELD_FAILURE_RETRY_MS) {
  return !!(
    data &&
    data[key + "FetchState"] === "failure" &&
    typeof data[key + "FetchedAt"] === "number" &&
    Date.now() - data[key + "FetchedAt"] < cooldownMs
  );
}

function shouldFetchField(data, key, options) {
  if (options && options.force) return true;
  if (hasSuccessfulFieldSnapshot(data, key)) return false;
  if (options && options.retryIncomplete) return true;
  return !hasRecentFieldFailure(data, key);
}

function hasDetailSnapshot(data) {
  return hasSuccessfulFieldSnapshot(data, "crawl") && hasSuccessfulFieldSnapshot(data, "backlink");
}

function normalizeSiteData(data) {
  if (!data) return null;
  const normalized = {
    expose: hasOwnDataField(data, "expose") ? data.expose ?? null : null,
    crawl: hasOwnDataField(data, "crawl") ? data.crawl ?? null : null,
    backlink: hasOwnDataField(data, "backlink") ? data.backlink ?? null : null,
    detailLoaded:
      typeof data.detailLoaded === "boolean"
        ? data.detailLoaded || hasDetailSnapshot(data)
        : hasDetailSnapshot(data),
  };
  if (hasOwnDataField(data, "diagnosisMeta")) normalized.diagnosisMeta = data.diagnosisMeta ?? null;
  if (hasOwnDataField(data, "diagnosisMetaStatus"))
    normalized.diagnosisMetaStatus = data.diagnosisMetaStatus ?? null;
  if (hasOwnDataField(data, "diagnosisMetaRange"))
    normalized.diagnosisMetaRange = data.diagnosisMetaRange ?? null;
  if (hasOwnDataField(data, "diagnosisMetaFetchState"))
    normalized.diagnosisMetaFetchState = data.diagnosisMetaFetchState ?? null;
  if (hasOwnDataField(data, "diagnosisMetaFetchedAt"))
    normalized.diagnosisMetaFetchedAt = data.diagnosisMetaFetchedAt ?? null;
  if (hasOwnDataField(data, "exposeFetchState")) normalized.exposeFetchState = data.exposeFetchState ?? null;
  if (hasOwnDataField(data, "exposeFetchedAt")) normalized.exposeFetchedAt = data.exposeFetchedAt ?? null;
  if (hasOwnDataField(data, "exposeStatus")) normalized.exposeStatus = data.exposeStatus ?? null;
  if (hasOwnDataField(data, "crawlFetchState")) normalized.crawlFetchState = data.crawlFetchState ?? null;
  if (hasOwnDataField(data, "crawlFetchedAt")) normalized.crawlFetchedAt = data.crawlFetchedAt ?? null;
  if (hasOwnDataField(data, "crawlStatus")) normalized.crawlStatus = data.crawlStatus ?? null;
  if (hasOwnDataField(data, "backlinkFetchState"))
    normalized.backlinkFetchState = data.backlinkFetchState ?? null;
  if (hasOwnDataField(data, "backlinkFetchedAt"))
    normalized.backlinkFetchedAt = data.backlinkFetchedAt ?? null;
  if (hasOwnDataField(data, "backlinkStatus")) normalized.backlinkStatus = data.backlinkStatus ?? null;
  if (hasOwnDataField(data, "__cacheSavedAt")) normalized.__cacheSavedAt = data.__cacheSavedAt ?? null;

  // Merge metadata for multi-account support
  normalized.__source = hasOwnDataField(data, "__source") ? data.__source : null;
  normalized.__fetchedAt = hasOwnDataField(data, "__fetchedAt") ? data.__fetchedAt : null;
  normalized.__version = hasOwnDataField(data, "__version") ? data.__version : 1;
  normalized.__accountId = hasOwnDataField(data, "__accountId") ? data.__accountId : null;
  normalized.__importedFrom = hasOwnDataField(data, "__importedFrom") ? data.__importedFrom : null;
  normalized.__importedAt = hasOwnDataField(data, "__importedAt") ? data.__importedAt : null;

  return normalized;
}

/**
 * Merge data from multiple accounts into a single dataset
 * @param {Object} target - Target memCache object
 * @param {Object} source - Source data to merge
 * @param {Object} options - Merge options { overwrite: boolean, mergeStrategy: 'newer'|'all' }
 * @returns {Object} Merged data
 */
function mergeSiteData(target, source, options = {}) {
  const { overwrite = false, mergeStrategy = 'newer' } = options;

  if (!source) return target;
  if (!target) return source;

  const result = { ...target };

  for (const site of Object.keys(source)) {
    const sourceData = source[site];
    const targetData = result[site];

    if (!targetData) {
      // New site - just add it
      result[site] = sourceData;
    } else {
      // Existing site - merge based on strategy
      const shouldOverwrite = overwrite ||
        (mergeStrategy === 'newer' &&
         (sourceData.__fetchedAt || 0) > (targetData.__fetchedAt || 0));

      if (shouldOverwrite) {
        result[site] = sourceData;
      } else {
        // Merge individual fields
        for (const key of Object.keys(sourceData)) {
          if (!targetData[key] || overwrite) {
            result[site][key] = sourceData[key];
          }
        }
      }
    }
  }

  return result;
}

/**
 * Export data for backup/transfer
 * @param {Object} memCache - Memory cache to export
 * @returns {Object} Exportable data with metadata
 */
function exportSiteData(memCache) {
  return {
    __exportVersion: 1,
    __exportedAt: Date.now(),
    __exportSource: 'SearchAdvisor Runtime',
    sites: Object.keys(memCache).reduce((acc, site) => {
      acc[site] = { ...memCache[site] };
      return acc;
    }, {})
  };
}

/**
 * Import data from export
 * @param {Object} memCache - Target memory cache
 * @param {Object} exportData - Data to import
 * @param {Object} options - Import options
 * @returns {Object} Merged memCache
 */
function importSiteData(memCache, exportData, options = {}) {
  if (!exportData || !exportData.sites) return memCache;

  const importedCache = { ...memCache };

  // Add import metadata
  for (const site of Object.keys(exportData.sites)) {
    const data = exportData.sites[site];
    data.__importedFrom = exportData.__exportSource || 'unknown';
    data.__importedAt = Date.now();

    if (!importedCache[site]) {
      importedCache[site] = data;
    } else {
      // Use merge function
      importedCache[site] = mergeSiteData(
        { [site]: importedCache[site] },
        { [site]: data },
        options
      )[site];
    }
  }

  return importedCache;
}

function getCachedSiteSnapshot(site) {
  const cached = normalizeSiteData(getCachedData(site));
  const live = normalizeSiteData(memCache[site]);
  if (!cached && !live) return null;
  return normalizeSiteData({ ...(cached || {}), ...(live || {}) });
}

function emptySiteData() {
  return {
    expose: null,
    crawl: null,
    backlink: null,
    detailLoaded: false,
  };
}

function persistSiteData(site, data) {
  const next =
    normalizeSiteData({ ...(getCachedSiteSnapshot(site) || emptySiteData()), ...(data || {}) }) ||
    emptySiteData();
  memCache[site] = next;
  setCachedData(site, next);
  return next;
}

function hasSuccessfulDiagnosisMetaSnapshot(data) {
  return !!(
    data &&
    hasFreshFieldSnapshot(data, "diagnosisMeta") &&
    ((data.diagnosisMeta && data.diagnosisMeta.code === 0 && data.diagnosisMetaRange) ||
      data.diagnosisMetaFetchState === "success")
  );
}

function hasRecentDiagnosisMetaFailure(
  data,
  cooldownMs = FIELD_FAILURE_RETRY_MS,
) {
  return !!(
    data &&
    data.diagnosisMetaFetchState === "failure" &&
    typeof data.diagnosisMetaFetchedAt === "number" &&
    Date.now() - data.diagnosisMetaFetchedAt < cooldownMs
  );
}

function hasDiagnosisMetaSnapshot(data) {
  return hasSuccessfulDiagnosisMetaSnapshot(data) || hasRecentDiagnosisMetaFailure(data);
}

function shouldFetchDiagnosisMeta(data, options) {
  if (options && options.force) return true;
  if (hasSuccessfulDiagnosisMetaSnapshot(data)) return false;
  if (options && options.retryIncomplete) return true;
  return !hasRecentDiagnosisMetaFailure(data);
}

async function loadSiteList(refresh = false) {
  console.log('[loadSiteList] Called with refresh:', refresh);

  // Check V2 format EXPORT_PAYLOAD first
  const exportPayload = window.__SEARCHADVISOR_EXPORT_PAYLOAD__;
  if (exportPayload) {
    console.log('[loadSiteList] Found EXPORT_PAYLOAD');

    // P0-2: V2 다중 계정 구조 지원 완성
    if (exportPayload.__meta && exportPayload.accounts) {
      return handleV2MultiAccount(exportPayload);
    }

    // 레거시 V1 포맷은 지원하지 않음 (Big Bang Migration 완료)
    // V2 포맷이 아닌 경우 빈 배열 반환
    if (exportPayload && !exportPayload.__meta) {
      console.warn('[loadSiteList] Unsupported payload format (missing __meta)');
      return [];
    }
  }

  // Check if we have init data
  const initData = window.__sadvInitData;
  if (initData && initData.sites) {
    const sites = Object.keys(initData.sites);
    console.log('[loadSiteList] Found init data with sites:', sites);
    allSites.length = 0;
    allSites.push(...sites);
    return sites;
  }

  // Check merged data
  const mergedData = window.__sadvMergedData;
  if (mergedData && mergedData.sites) {
    const sites = Object.keys(mergedData.sites);
    console.log('[loadSiteList] Found merged data with sites:', sites);
    allSites.length = 0;
    allSites.push(...sites);
    return sites;
  }

  // Check cache
  if (!refresh) {
    const cached = lsGet(getSiteListCacheKey());
    if (cached && cached.sites && Array.isArray(cached.sites)) {
      console.log('[loadSiteList] Found cached sites:', cached.sites);
      allSites.length = 0;
      allSites.push(...cached.sites);
      return cached.sites;
    }
  }

  console.log('[loadSiteList] No sites found, returning empty array');
  return [];
}

// ============================================================================
// P0-2: V2 다중 계정 구조 지원 완성
// ============================================================================
// V2 다중 계정 감지 및 병합 처리
// ============================================================================
function handleV2MultiAccount(payload, mergeStrategy = MERGE_STRATEGIES.DEFAULT) {
  // P1: V2 데이터 검증
  // 1. 기본 V2 포맷 검증
  if (!DATA_VALIDATION.isValidV2Payload(payload)) {
    console.error('[V2 Multi-Account] Invalid V2 payload format');
    return [];
  }

  // 2. 메타데이터 검증
  const meta = payload.__meta;
  if (!meta.version || !meta.exportedAt) {
    console.error('[V2 Multi-Account] Invalid metadata');
    return [];
  }

  // 3. 스키마 버전 검증
  if (!SCHEMA_VERSIONS.isSupported(meta.version)) {
    console.warn(`[V2 Multi-Account] Unsupported schema version: ${meta.version}`);
  }

  // 4. 계정 데이터 검증 및 유효한 계정만 필터링
  const accountKeys = Object.keys(payload.accounts);
  if (accountKeys.length === 0) {
    console.error('[V2 Multi-Account] No accounts found');
    return [];
  }

  const validAccounts = [];
  for (const accKey of accountKeys) {
    const account = payload.accounts[accKey];
    if (DATA_VALIDATION.isValidAccount(account)) {
      // P1: 데이터 일관성 검증
      const validation = DATA_VALIDATION.validateAccountData(account);
      if (!validation.valid) {
        console.warn(`[V2 Multi-Account] Account ${accKey} data inconsistency:`, validation);

        // 불일치가 있는 계정은 유효 목록에 추가하지 않음 (원본 데이터 보존)
        if (validation.missingData.length > 0 || validation.orphanSites.length > 0) {
          console.warn(`[V2 Multi-Account] Skipping ${accKey}: ${validation.missingData.length} missing, ${validation.orphanSites.length} orphan sites`);
        }
      } else {
        validAccounts.push(accKey);
      }
    } else {
      console.warn(`[V2 Multi-Account] Invalid account structure: ${accKey}`);
    }
  }

  if (validAccounts.length === 0) {
    console.error('[V2 Multi-Account] No valid accounts found');
    return [];
  }

  console.log(`[V2 Multi-Account] Found ${validAccounts.length} valid accounts (out of ${accountKeys.length} total)`);

  // P0-2: 다중 계정 상태 저장
  window.__sadvAccountState = {
    isMultiAccount: validAccounts.length > 1,
    currentAccount: validAccounts[0],
    allAccounts: validAccounts,
    accountsData: {},
    mergeStrategy: mergeStrategy
  };

  // 모든 계정 데이터 사이트별 병합
  const mergedSites = {};
  const siteOwnership = {}; // site -> [accountEmails]

  for (const accKey of validAccounts) {
    const account = payload.accounts[accKey];
    const sites = account.sites || [];

    for (const site of sites) {
      // 사이트별로 계정 목록 추적
      if (!siteOwnership[site]) {
        siteOwnership[site] = [];
      }
      siteOwnership[site].push(accKey);

      // 데이터 병합 (전략에 따라 처리)
      const siteData = account.dataBySite?.[site];
      if (siteData) {
        let shouldMerge = false;

        switch (mergeStrategy) {
          case MERGE_STRATEGIES.NEWER:
            // 최신 데이터 우선
            const existingTime = mergedSites[site]?.__meta?.__fetched_at ||
                                 mergedSites[site]?._merge?.__fetchedAt || 0;
            const newTime = siteData.__meta?.__fetched_at ||
                           siteData._merge?.__fetchedAt || 0;
            shouldMerge = !mergedSites[site] || newTime > existingTime;
            break;

          case MERGE_STRATEGIES.FIRST:
            // 첫 번째 계정 데이터 우선 (이미 병합된 데이터 유지)
            shouldMerge = !mergedSites[site];
            break;

          case MERGE_STRATEGIES.SOURCE:
            // 소스 데이터 우선 (나중에 들어온 데이터로 덮어쓰기)
            shouldMerge = true;
            break;

          case MERGE_STRATEGIES.ALL:
            // 모든 데이터 보존 - 현재는 첫 번째만 사용 (향후 확장)
            shouldMerge = !mergedSites[site];
            break;

          default:
            // 알 수 없는 전략은 NEWER로 처리
            const defTime = mergedSites[site]?.__meta?.__fetched_at ||
                            mergedSites[site]?._merge?.__fetchedAt || 0;
            const srcTime = siteData.__meta?.__fetched_at ||
                           siteData._merge?.__fetchedAt || 0;
            shouldMerge = !mergedSites[site] || srcTime > defTime;
        }

        if (shouldMerge) {
          mergedSites[site] = siteData;
        }
      }
    }

    // 계정별 데이터 저장
    window.__sadvAccountState.accountsData[accKey] = {
      encId: account.encId,
      sites: sites,
      siteMeta: account.siteMeta || {},
      dataBySite: account.dataBySite || {}
    };
  }

  // 병합된 사이트 데이터를 __sadvInitData에 저장
  window.__sadvInitData = {
    sites: mergedSites,
    siteOwnership: siteOwnership,
    isV2: true,
    currentAccount: accountKeys[0],
    _rawPayload: payload
  };

  const siteList = Object.keys(mergedSites);
  console.log(`[V2 Multi-Account] Merged ${siteList.length} sites from ${accountKeys.length} accounts`);

  allSites.length = 0;
  allSites.push(...siteList);

  return siteList;
}

// ============================================================================
// P0-2: 계정 전환 UI 추가
// ============================================================================
function switchAccount(accountEmail) {
  if (!window.__sadvAccountState || !window.__sadvAccountState.isMultiAccount) {
    console.warn('[Account] Not multi-account mode');
    return;
  }

  const prevAccount = window.__sadvAccountState.currentAccount;

  // 현재 계정 업데이트
  window.__sadvAccountState.currentAccount = accountEmail;

  console.log(`[Account] Switching from ${prevAccount} to ${accountEmail}`);

  // 계정별 데이터 로드
  const accountData = window.__sadvAccountState.accountsData[accountEmail];
  if (!accountData) {
    console.error(`[Account] No data found for account: ${accountEmail}`);
    return;
  }

  // 현재 사이트가 이 계정에 있는지 확인
  const currentSite = curSite || null;
  const sitesInAccount = accountData.sites || [];

  // __sadvInitData 업데이트
  window.__sadvInitData.sites = accountData.dataBySite || {};
  window.__sadvInitData.currentAccount = accountEmail;

  // UI 업데이트
  if (typeof updateUIState === 'function') {
    updateUIState({ curAccount: accountEmail });
  }

  // 현재 사이트가 이 계정에 없으면 첫 번째 사이트로 변경
  if (currentSite && !sitesInAccount.includes(currentSite)) {
    const newSite = sitesInAccount[0] || null;
    if (typeof updateUIState === 'function') {
      updateUIState({ curSite: newSite });
    }
    if (newSite && typeof setComboSite === 'function') {
      setComboSite(newSite);
    }
  }

  // 사이트 콤보 재구축
  if (typeof buildCombo === 'function') {
    buildCombo(window.__sadvRows || null);
  }

  // 현재 뷰 다시 렌더링
  if (curMode === CONFIG.MODE.SITE && curSite) {
    if (typeof loadSiteView === 'function') {
      loadSiteView(curSite);
    }
  } else if (curMode === CONFIG.MODE.ALL) {
    if (typeof renderAllSites === 'function') {
      renderAllSites();
    }
  }

  if (typeof __sadvNotify === 'function') {
    __sadvNotify();
  }
}

// 계정 정보 반환 함수
function getAccountList() {
  if (!window.__sadvAccountState || !window.__sadvAccountState.isMultiAccount) {
    return [];
  }

  return window.__sadvAccountState.allAccounts.map(accKey => {
    const accData = window.__sadvAccountState.accountsData[accKey];
    return {
      email: accKey,
      label: accKey.split('@')[0],
      fullLabel: accKey,
      encId: accData?.encId || '',
      siteCount: accData?.sites?.length || 0
    };
  });
}

// fetchWithRetry function is provided by 00-constants.js

// In-flight request tracking (prevents duplicate concurrent requests)
const inflightExpose = {};
const inflightCrawl = {};
const inflightBacklink = {};
const inflightDiagnosisMeta = {};

/**
 * Fetch expose data for a site
 * @param {string} site - Site URL
 * @param {object} options - Options { force, retryIncomplete }
 * @returns {Promise<object>} Site data with expose information
 */
async function fetchExposeData(site, options) {
  if (!encId || typeof encId !== 'string') {
    showError(ERROR_MESSAGES.INVALID_ENCID, null, 'fetchExposeData');
    return null;
  }
  if (memCache[site] && !shouldFetchField(memCache[site], "expose", options)) {
    return normalizeSiteData(memCache[site]);
  }
  const cached = getCachedSiteSnapshot(site);
  if (cached && !shouldFetchField(cached, "expose", options)) {
    memCache[site] = cached;
    return cached;
  }
  if (!(options && options.force) && inflightExpose[site]) return inflightExpose[site];
  const enc = encodeURIComponent(site),
    base = "https://searchadvisor.naver.com/api-console/report";
  inflightExpose[site] = (async function () {
    try {
      const exposeFetchedAt = Date.now();
      const exposeRes = await fetchWithRetry(
        base + "/expose/" + encId + "?site=" + enc + "&period=90&device=&topN=50",
        { credentials: "include", headers: { accept: "application/json" } },
      );
      const expose = exposeRes.ok ? await exposeRes.json() : null;
      return persistSiteData(site, {
        expose: exposeRes.ok ? expose : null,
        exposeFetchState: exposeRes.ok ? "success" : "failure",
        exposeFetchedAt,
        exposeStatus: exposeRes.status,
        detailLoaded: false,
      });
    } catch (e) {
      showError(ERROR_MESSAGES.DATA_LOAD_FAILED, e, 'fetchExposeData');
      return persistSiteData(site, {
        expose: null,
        exposeFetchState: "failure",
        exposeFetchedAt: Date.now(),
        exposeStatus: null,
        detailLoaded: false,
      });
    } finally {
      delete inflightExpose[site];
    }
  })();
  return inflightExpose[site];
}

/**
 * Fetch crawl data for a site
 * @param {string} site - Site URL
 * @param {object} options - Options { force, retryIncomplete }
 * @returns {Promise<object>} Site data with crawl information
 */
async function fetchCrawlData(site, options) {
  if (!encId || typeof encId !== 'string') {
    showError(ERROR_MESSAGES.INVALID_ENCID, null, 'fetchCrawlData');
    return null;
  }
  const baseData = await fetchExposeData(site, options);
  if (!shouldFetchField(baseData, "crawl", options)) return baseData;
  if (!(options && options.force) && inflightCrawl[site]) return inflightCrawl[site];

  const enc = encodeURIComponent(site);
  const base = "https://searchadvisor.naver.com/api-console/report";
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const d90 = new Date(Date.now() - 90 * 864e5)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");

  inflightCrawl[site] = (async function () {
    try {
      const crawlFetchedAt = Date.now();
      const crawlRes = await fetchWithRetry(
        base +
          "/crawl/" +
          encId +
          "?site=" +
          enc +
          "&start_date=" +
          d90 +
          "&end_date=" +
          today +
          "&isAlly=false&count=5",
        { credentials: "include", headers: { accept: "application/json" } },
      );
      const crawl = crawlRes.ok ? await crawlRes.json() : null;
      return persistSiteData(site, {
        ...baseData,
        crawl: crawlRes.ok ? crawl : null,
        crawlFetchState: crawlRes.ok ? "success" : "failure",
        crawlFetchedAt,
        crawlStatus: crawlRes.status,
        detailLoaded: baseData.detailLoaded,
      });
    } catch (e) {
      showError(ERROR_MESSAGES.DETAIL_DATA_MISSING, e, 'fetchCrawlData');
      return persistSiteData(site, {
        ...baseData,
        crawl: null,
        crawlFetchState: "failure",
        crawlFetchedAt: Date.now(),
        crawlStatus: null,
        detailLoaded: baseData.detailLoaded,
      });
    } finally {
      delete inflightCrawl[site];
    }
  })();

  return inflightCrawl[site];
}

/**
 * Fetch backlink data for a site
 * @param {string} site - Site URL
 * @param {object} options - Options { force, retryIncomplete }
 * @returns {Promise<object>} Site data with backlink information
 */
async function fetchBacklinkData(site, options) {
  if (!encId || typeof encId !== 'string') {
    showError(ERROR_MESSAGES.INVALID_ENCID, null, 'fetchBacklinkData');
    return null;
  }
  const baseData = await fetchExposeData(site, options);
  if (!shouldFetchField(baseData, "backlink", options)) return baseData;
  if (!(options && options.force) && inflightBacklink[site]) return inflightBacklink[site];

  const enc = encodeURIComponent(site);
  const base = "https://searchadvisor.naver.com/api-console/report";
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const d90 = new Date(Date.now() - 90 * 864e5)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");

  inflightBacklink[site] = (async function () {
    try {
      const backlinkFetchedAt = Date.now();
      const backlinkRes = await fetchWithRetry(
        base +
          "/backlink/" +
          encId +
          "?site=" +
          enc +
          "&start_date=" +
          d90 +
          "&end_date=" +
          today,
        { credentials: "include", headers: { accept: "application/json" } },
      );
      const backlink = backlinkRes.ok ? await backlinkRes.json() : null;
      return persistSiteData(site, {
        ...baseData,
        backlink: backlinkRes.ok ? backlink : null,
        backlinkFetchState: backlinkRes.ok ? "success" : "failure",
        backlinkFetchedAt,
        backlinkStatus: backlinkRes.status,
        detailLoaded: baseData.detailLoaded,
      });
    } catch (e) {
      showError(ERROR_MESSAGES.DETAIL_DATA_MISSING, e, 'fetchBacklinkData');
      return persistSiteData(site, {
        ...baseData,
        backlink: null,
        backlinkFetchState: "failure",
        backlinkFetchedAt: Date.now(),
        backlinkStatus: null,
        detailLoaded: baseData.detailLoaded,
      });
    } finally {
      delete inflightBacklink[site];
    }
  })();

  return inflightBacklink[site];
}

/**
 * Fetch complete site data (expose + crawl + backlink)
 * @param {string} site - Site URL
 * @param {object} options - Options { force, retryIncomplete }
 * @returns {Promise<object>} Complete site data
 */
async function fetchSiteData(site, options) {
  if (!encId || typeof encId !== 'string') {
    showError(ERROR_MESSAGES.INVALID_ENCID, null, 'fetchSiteData');
    return null;
  }
  const baseData = await fetchDiagnosisMeta(site, null, options);
  const needCrawl = shouldFetchField(baseData, "crawl", options);
  const needBacklink = shouldFetchField(baseData, "backlink", options);
  if (!needCrawl && !needBacklink) return baseData;
  if (!(options && options.force) && inflightDetail[site]) return inflightDetail[site];
  const enc = encodeURIComponent(site),
    base = "https://searchadvisor.naver.com/api-console/report";
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const d90 = new Date(Date.now() - 90 * 864e5)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  inflightDetail[site] = (async function () {
    try {
      const requests = await Promise.all([
        needCrawl
          ? fetchWithRetry(
              base +
                "/crawl/" +
                encId +
                "?site=" +
                enc +
                "&start_date=" +
                d90 +
                "&end_date=" +
                today +
                "&isAlly=false&count=5",
              { credentials: "include", headers: { accept: "application/json" } },
            )
              .then(async function (response) {
                return {
                  key: "crawl",
                  ok: response.ok,
                  status: response.status,
                  data: response.ok ? await response.json() : null,
                  fetchedAt: Date.now(),
                };
              })
              .catch(function (e) {
                showError(ERROR_MESSAGES.DETAIL_DATA_MISSING, e, 'fetchSiteData-crawl');
                return {
                  key: "crawl",
                  ok: false,
                  status: null,
                  data: null,
                  fetchedAt: Date.now(),
                };
              })
          : Promise.resolve({
              key: "crawl",
              ok: hasSuccessfulFieldSnapshot(baseData, "crawl"),
              status: baseData.crawlStatus ?? null,
              data: baseData.crawl ?? null,
              fetchedAt: baseData.crawlFetchedAt ?? null,
            }),
        needBacklink
          ? fetchWithRetry(
              base +
                "/backlink/" +
                encId +
                "?site=" +
                enc +
                "&start_date=" +
                d90 +
                "&end_date=" +
                today,
              { credentials: "include", headers: { accept: "application/json" } },
            )
              .then(async function (response) {
                return {
                  key: "backlink",
                  ok: response.ok,
                  status: response.status,
                  data: response.ok ? await response.json() : null,
                  fetchedAt: Date.now(),
                };
              })
              .catch(function (e) {
                showError(ERROR_MESSAGES.DETAIL_DATA_MISSING, e, 'fetchSiteData-backlink');
                return {
                  key: "backlink",
                  ok: false,
                  status: null,
                  data: null,
                  fetchedAt: Date.now(),
                };
              })
          : Promise.resolve({
              key: "backlink",
              ok: hasSuccessfulFieldSnapshot(baseData, "backlink"),
              status: baseData.backlinkStatus ?? null,
              data: baseData.backlink ?? null,
              fetchedAt: baseData.backlinkFetchedAt ?? null,
            }),
      ]);
      const next = { ...baseData };
      requests.forEach(function (result) {
        next[result.key] = result.ok ? result.data : null;
        next[result.key + "FetchState"] = result.ok ? "success" : "failure";
        next[result.key + "FetchedAt"] = result.fetchedAt;
        next[result.key + "Status"] = result.status;
      });
      next.detailLoaded =
        next.crawlFetchState === "success" && next.backlinkFetchState === "success";
      return persistSiteData(site, next);
    } finally {
      delete inflightDetail[site];
    }
  })();
  return inflightDetail[site];
}

/**
 * Fetch diagnosis meta data for a site
 * @param {string} site - Site URL
 * @param {object} seedData - Base data to use if available
 * @param {object} options - Options { force, retryIncomplete }
 * @returns {Promise<object>} Site data with diagnosis meta information
 */
async function fetchDiagnosisMeta(site, seedData, options) {
  if (!encId || typeof encId !== 'string') {
    showError(ERROR_MESSAGES.INVALID_ENCID, null, 'fetchDiagnosisMeta');
    return null;
  }
  const baseData = seedData || (await fetchExposeData(site, options));
  if (!shouldFetchDiagnosisMeta(baseData, options)) return baseData;
  if (!(options && options.force) && inflightDiagnosisMeta[site]) return inflightDiagnosisMeta[site];
  const enc = encodeURIComponent(site),
    base = "https://searchadvisor.naver.com/api-console/report";
  const range = getDiagnosisMetaRange();
  inflightDiagnosisMeta[site] = (async function () {
    try {
      let response = null;
      let diagnosisMeta = null;
      let diagnosisMetaFetchState = "failure";
      const diagnosisMetaFetchedAt = Date.now();
      try {
        response = await fetchWithRetry(
          base +
            "/diagnosis/meta/" +
            encId +
            "?site=" +
            enc +
            "&startDate=" +
            range.startDate +
            "&endDate=" +
            range.endDate,
          { credentials: "include", headers: { accept: "application/json" } },
        );
        diagnosisMeta = response.ok ? await response.json() : null;
        if (response.ok && diagnosisMeta && diagnosisMeta.code === 0) {
          diagnosisMetaFetchState = "success";
        }
      } catch (e) {
        showError(ERROR_MESSAGES.DATA_LOAD_ERROR, e, 'fetchDiagnosisMeta');
      }
      return persistSiteData(site, {
        ...baseData,
        diagnosisMeta: diagnosisMetaFetchState === "success" ? diagnosisMeta : null,
        diagnosisMetaStatus: response ? response.status : null,
        diagnosisMetaRange: range,
        diagnosisMetaFetchState,
        diagnosisMetaFetchedAt,
        detailLoaded: !!baseData.detailLoaded,
      });
    } finally {
      delete inflightDiagnosisMeta[site];
    }
  })();
  return inflightDiagnosisMeta[site];
}

/**
 * Fetch expose data for multiple sites in batches
 * @param {string[]} sites - Array of site URLs
 * @returns {Promise<PromiseSettledResult<?>[]>} Array of settled promises
 */
async function fetchExposeDataBatch(sites) {
  const results = [];
  for (let i = 0; i < sites.length; i += ALL_SITES_BATCH) {
    results.push(
      ...(await Promise.allSettled(
        sites.slice(i, i + ALL_SITES_BATCH).map((s) => fetchExposeData(s)),
      )),
    );
    if (i + ALL_SITES_BATCH < sites.length) {
      await new Promise(r => setTimeout(r, 150 + Math.floor(Math.random() * 100)));
    }
  }
  return results;
}

/**
 * Calculate date range for diagnosis meta requests
 * @returns {object} Date range with startDate and endDate in YYYYMMDD format
 */
function getDiagnosisMetaRange() {
  const formatYmd = function (date) {
    if (!date) return "";
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return String(year) + month + day;
  };
  const todayKstLocal = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }),
  );
  const todayKst = new Date(
    Date.UTC(
      todayKstLocal.getFullYear(),
      todayKstLocal.getMonth(),
      todayKstLocal.getDate(),
    ),
  );
  const effectiveEndDate = todayKst;
  const effectiveStartDate = new Date(effectiveEndDate.getTime() - 40 * 864e5);
  return {
    startDate: formatYmd(effectiveStartDate),
    endDate: formatYmd(effectiveEndDate),
  };
}

// Demo Mode Module
// ============================================================
// This module provides demo mode functionality for local development
// and testing. It generates mock data for SearchAdvisor APIs when
// running on localhost, local networks, or file:// protocol.
// ============================================================

const IS_DEMO_MODE = (function() {
  try {
    const protocol = (location && location.protocol) || "";
    const host = (location && location.hostname) || "";
    // Enable demo mode for localhost, local networks, and file:// protocol
    return protocol === "file:" ||
           host === "localhost" ||
           host === "127.0.0.1" ||
           host.startsWith("192.168.") ||
           host.startsWith("10.") ||
           host.startsWith("172.");
  } catch (e) {
    return false;
  }
})();

if (IS_DEMO_MODE) {
  window.__DEMO_MODE__ = true;
  console.log("%c[SearchAdvisor Demo Mode] Running with dummy data", "color: #40c4ff; font-weight: bold");
}

// Define demo constants (used later, after allSites is declared)
const DEMO_ENC_ID = IS_DEMO_MODE ? "demo_mode_00000000000000000000000000000000000000000000000000000000000000" : null;
const DEMO_SITES = IS_DEMO_MODE ? [
  "https://example-shop.com",
  "https://tech-blog.kr",
  "https://online-store.net",
  "https://company-site.co.kr"
] : [];


// Mock API data for demo mode
if (IS_DEMO_MODE) {
  const DEMO_SITE_DATA = {};
  const now = Date.now();
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 14);

  DEMO_SITES.forEach((site, idx) => {
    const baseClicks = Math.floor(Math.random() * 5000) + 1000;
    const baseExposes = Math.floor(baseClicks * (1.5 + Math.random()));

    // Generate proper date format (YYYYMMDD)
    const logs = Array.from({length: 15}, (_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
      return {
        date: dateStr,
        clickCount: Math.floor(Math.random() * 400) + 50,
        exposeCount: Math.floor(Math.random() * 800) + 100
      };
    });

    // Calculate totals from logs
    const totalClicks = logs.reduce((sum, log) => sum + log.clickCount, 0);
    const totalExposes = logs.reduce((sum, log) => sum + log.exposeCount, 0);

    DEMO_SITE_DATA[site] = {
      expose: {
        items: [{
          period: {
            start: "20260301",
            end: "20260315",
            prevClickRatio: (Math.random() * 20 - 5).toFixed(1),
            prevExposeRatio: (Math.random() * 15 - 3).toFixed(1)
          },
          logs: logs.map(log => ({
            ...log,
            ctr: log.exposeCount > 0 ? ((log.clickCount / log.exposeCount) * 100).toFixed(2) : "0.00"
          })),
          urls: Array.from({length: 20}, (_, i) => ({
            key: `${site}/page-${i+1}`,
            clickCount: Math.floor(Math.random() * 200) + 10,
            exposeCount: Math.floor(Math.random() * 500) + 50,
            ctr: (Math.random() * 5 + 0.5).toFixed(2)
          })),
          querys: Array.from({length: 15}, (_, i) => ({
            key: `검색어${idx+1}-${i+1}`,
            clickCount: Math.floor(Math.random() * 100) + 5,
            exposeCount: Math.floor(Math.random() * 300) + 20,
            ctr: (Math.random() * 3 + 0.5).toFixed(2)
          }))
        }]
      },
      crawl: {
        items: [{
          stats: logs.map(log => ({
            date: log.date,
            pageCount: Math.floor(Math.random() * 5000) + 1000,
            downloadSize: Math.floor(Math.random() * 50000000) + 10000000,
            sumTryCount: Math.floor(Math.random() * 100) + 50,
            sumErrorCount: Math.random() > 0.8 ? Math.floor(Math.random() * 5) + 1 : 0,
            notFound: Math.random() > 0.9 ? Math.floor(Math.random() * 3) + 1 : 0,
            serverError: Math.random() > 0.95 ? Math.floor(Math.random() * 2) + 1 : 0,
            connectTimeout: 0
          })),
          sitemaps: [{ url: `${site}/sitemap.xml`, status: "ok", count: 156 }]
        }]
      },
      backlink: {
        items: [{
          total: Math.floor(Math.random() * 1000) + 200,
          domains: Math.floor(Math.random() * 50) + 10,
          countTime: logs.map(log => ({
            timeStamp: log.date,
            backlinkCnt: Math.floor(Math.random() * 200) + 180
          })),
          topDomain: [
            { domain: `backlink-source-${idx+1}.com`, backlinkCnt: Math.floor(Math.random() * 100) + 50 },
            { domain: `partner-site-${idx+1}.net`, backlinkCnt: Math.floor(Math.random() * 80) + 30 },
            { domain: `news-portal-${idx+1}.kr`, backlinkCnt: Math.floor(Math.random() * 60) + 20 },
            { domain: `blog-platform-${idx+1}.com`, backlinkCnt: Math.floor(Math.random() * 40) + 10 }
          ]
        }]
      },
      diagnosisMeta: {
        code: 0,  // 0 = success for diagnosis API
        items: [{
          meta: Array.from({length: 15}, (_, i) => {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            const dateStr = d.toISOString().slice(0, 10).replace(/-/g, '');
            return {
              date: dateStr,
              stateCount: {
                "1": 1000 + idx * 100 + i * 10,
                "2": Math.floor(Math.random() * 50) + 10,
                "3": Math.floor(Math.random() * 30) + 5,
                "4": Math.floor(Math.random() * 20) + 2
              }
            };
          })
        }]
      },
      diagnosisMetaRange: { start: "20260301", end: "20260315" }
    };

  });

  // Override fetch to return demo data
  const originalFetch = window.fetch.bind(window);
  window.fetch = function(url, options) {
    const urlStr = String(url);

    if (urlStr.includes("searchadvisor.naver.com")) {
      console.log("[Demo Mode API]", urlStr);

      return new Promise((resolve) => {
        setTimeout(() => {
          if (urlStr.includes("/api-board/list/")) {
            // Use custom sites if available, otherwise fall back to DEMO_SITES
            const customInitData = window.__sadvInitData;
            const customMergedData = window.__sadvMergedData;
            const customSites = customMergedData?.sites || customInitData?.sites || null;
            const sitesToUse = customSites ? Object.keys(customSites) : DEMO_SITES;

            resolve({
              ok: true,
              json: () => ({ items: sitesToUse.map(s => ({ site: s, verified: true })) }),
              text: () => JSON.stringify({ items: sitesToUse.map(s => ({ site: s, verified: true })) })
            });
            return;
          }

          const siteMatch = urlStr.match(/site=([^&]+)/);
          const customInitData = window.__sadvInitData;
          const customMergedData = window.__sadvMergedData;
          const customSites = customMergedData?.sites || customInitData?.sites || null;
          const customSitesList = customSites ? Object.keys(customSites) : DEMO_SITES;
          const site = siteMatch ? decodeURIComponent(siteMatch[1]) : customSitesList[0];

          // Priority: custom injected data > DEMO_SITE_DATA > memCache
          let siteData = null;
          if (customSites && customSites[site]) {
            siteData = customSites[site];
          } else if (DEMO_SITE_DATA[site]) {
            siteData = DEMO_SITE_DATA[site];
          } else {
            siteData = memCache[site] || {};
          }
          console.log('[Demo Mode] API call - site:', site, 'source:', customSites && customSites[site] ? 'custom' : (DEMO_SITE_DATA[site] ? 'DEMO_SITE_DATA' : 'memCache'));

          if (urlStr.includes("/report/expose/") || urlStr.includes("field=expose")) {
            const exposeData = siteData.expose || { items: [] };
            console.log('[Demo Mode] Returning expose data for', site, 'logs:', exposeData.items?.[0]?.logs?.length || 0);
            resolve({ ok: true, json: () => exposeData, text: () => JSON.stringify(exposeData) });
          } else if (urlStr.includes("/report/crawl/") || urlStr.includes("field=crawl")) {
            const crawlData = siteData.crawl || { items: [] };
            resolve({ ok: true, json: () => crawlData, text: () => JSON.stringify(crawlData) });
          } else if (urlStr.includes("/report/backlink/") || urlStr.includes("field=backlink")) {
            const backlinkData = siteData.backlink || { items: [] };
            resolve({ ok: true, json: () => backlinkData, text: () => JSON.stringify(backlinkData) });
          } else if (urlStr.includes("/diagnosis/meta") || urlStr.includes("field=diagnosisMeta")) {
            const diagnosisData = siteData.diagnosisMeta || { code: 1, items: [] };
            resolve({ ok: true, json: () => diagnosisData, text: () => JSON.stringify(diagnosisData) });
          } else {
            resolve({ ok: true, json: () => ({ items: [] }), text: () => "{}" });
          }
        }, 50);
      });
    }

    return originalFetch(url, options);
  };
}


// Demo mode: inject mock data when running on localhost or file://
function injectDemoData() {
  const protocol = (location && location.protocol) || "";
  const host = (location && location.hostname) || "";
  console.log('[injectDemoData] protocol:', protocol, 'host:', host);
  // Enable demo mode for localhost, local networks, file:// protocol, or forced demo mode
  const isDemoMode = window.__FORCE_DEMO_MODE__ ||
                     protocol === "file:" ||
                     host === "localhost" ||
                     host === "127.0.0.1" ||
                     host.startsWith("192.168.") ||
                     host.startsWith("10.") ||
                     host.startsWith("172.") ||
                     host.includes("local");
  console.log('[injectDemoData] isDemoMode:', isDemoMode);
  if (!isDemoMode) return false;

  console.log('[Demo Mode] Setting up demo sites and data...');

  // Check for custom injected data first (from generate-html-files.js)
  const customInitData = window.__sadvInitData;
  const customMergedData = window.__sadvMergedData;
  const hasCustomData = !!(customInitData || customMergedData);

  if (hasCustomData) {
    console.log('[Demo Mode] Found custom injected data, using it instead of DEMO_SITES');

    // Get sites from custom data
    const customSites = customMergedData?.sites || customInitData?.sites || {};
    const siteUrls = Object.keys(customSites);

    if (siteUrls.length > 0) {
      allSites = siteUrls;
      assignColors();

      // Populate memCache with custom data
      siteUrls.forEach((siteUrl) => {
        const siteData = customSites[siteUrl];
        if (siteData) {
          memCache[siteUrl] = {
            ...siteData,
            __source:
              (siteData._merge && siteData._merge.__source) ||
              siteData.__source ||
              "demo",
            exposeFetchedAt: Date.now(),
            exposeFetchState: 'success',
            crawlFetchedAt: Date.now(),
            crawlFetchState: 'success',
            backlinkFetchedAt: Date.now(),
            backlinkFetchState: 'success',
            diagnosisMetaFetchedAt: Date.now(),
            diagnosisMetaFetchState: 'success',
            diagnosisMetaRange: (siteData.diagnosisMeta && siteData.diagnosisMeta.items && siteData.diagnosisMeta.items.length > 0 && siteData.diagnosisMeta.items[0].meta && siteData.diagnosisMeta.items[0].meta.length > 0) ?
              { start: siteData.diagnosisMeta.items[0].meta[0].date, end: siteData.diagnosisMeta.items[0].meta[siteData.diagnosisMeta.items[0].meta.length - 1].date } :
              { start: "20260301", end: "20260315" },
            detailLoaded: true,
            __cacheSavedAt: Date.now()
          };
          console.log('[Demo Mode] Custom data loaded for', siteUrl);
        }
      });

      // Set up mergedMeta for merged view header
      if (customMergedData) {
        const accountsMerged = customMergedData.accounts_merged || [];
        const sourceCount = accountsMerged.length || 1;

        window.__SEARCHADVISOR_EXPORT_PAYLOAD__ = {
          siteMeta: {},
          mergedMeta: {
            isMerged: true,
            sourceCount: sourceCount,
            accounts: accountsMerged.map((acc, i) => ({
              encId: acc,
              label: acc
            })),
            naverIds: accountsMerged
          },
          mode: 'saved-html'
        };

        // Update snapshotMetaState
        setSnapshotMetaState({
          siteMeta: {},
          mergedMeta: window.__SEARCHADVISOR_EXPORT_PAYLOAD__.mergedMeta
        });

        console.log('[Demo Mode] Merged meta set for', sourceCount, 'accounts');
      }

      console.log('[Demo Mode] Complete: Custom data injected for', allSites.length, 'sites');
      return true;
    }
  }

  // Fall back to DEMO_SITES for consistency
  allSites = DEMO_SITES.slice();
  assignColors();

  // Populate memCache with complete data for each site
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 14);

  allSites.forEach((site, idx) => {
    // Generate logs with proper date format (YYYYMMDD)
    const logs = Array.from({length: 15}, (_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10).replace(/-/g, '');
      return {
        date: dateStr,
        clickCount: Math.floor(Math.random() * 400) + 50,
        exposeCount: Math.floor(Math.random() * 800) + 100
      };
    });

    const exposeData = {
      items: [{
        period: {
          start: "20260301",
          end: "20260315",
          prevClickRatio: (Math.random() * 20 - 5).toFixed(1),
          prevExposeRatio: (Math.random() * 15 - 3).toFixed(1)
        },
        logs: logs.map(log => ({
          ...log,
          ctr: log.exposeCount > 0 ? ((log.clickCount / log.exposeCount) * 100).toFixed(2) : "0.00"
        })),
        urls: Array.from({length: 20}, (_, i) => ({
          key: `${site}/page-${i+1}`,
          clickCount: Math.floor(Math.random() * 200) + 10,
          exposeCount: Math.floor(Math.random() * 500) + 50,
          ctr: (Math.random() * 5 + 0.5).toFixed(2)
        })),
        querys: Array.from({length: 15}, (_, i) => ({
          key: `검색어${idx+1}-${i+1}`,
          clickCount: Math.floor(Math.random() * 100) + 5,
          exposeCount: Math.floor(Math.random() * 300) + 20,
          ctr: (Math.random() * 3 + 0.5).toFixed(2)
        }))
      }]
    };

    const crawlData = {
      items: [{
        stats: logs.map(log => ({
          date: log.date,
          pageCount: 1000 + Math.floor(Math.random() * 500),
          downloadSize: 50000 + Math.floor(Math.random() * 10000),
          sumTryCount: 200 + Math.floor(Math.random() * 100),
          sumErrorCount: Math.floor(Math.random() * 10),
          notFound: Math.floor(Math.random() * 5),
          serverError: Math.floor(Math.random() * 2),
          connectTimeout: 0,
        })),
        sitemaps: [{ url: `${site}/sitemap.xml`, status: "ok", count: 156 }]
      }]
    };

    const backlinkData = {
      items: [{
        total: Math.floor(Math.random() * 1000) + 200,
        domains: Math.floor(Math.random() * 50) + 10,
        countTime: logs.map(log => ({
          timeStamp: log.date,
          backlinkCnt: Math.floor(Math.random() * 20) + 180
        })),
        topDomain: [
          { domain: `backlink-source-${idx+1}.com`, backlinkCnt: Math.floor(Math.random() * 100) + 50 },
          { domain: `partner-site-${idx+1}.net`, backlinkCnt: Math.floor(Math.random() * 80) + 30 },
          { domain: `news-portal-${idx+1}.kr`, backlinkCnt: Math.floor(Math.random() * 60) + 20 },
          { domain: `blog-platform-${idx+1}.com`, backlinkCnt: Math.floor(Math.random() * 40) + 10 }
        ]
      }]
    };

    const diagnosisData = {
      code: 0,
      items: [{
        meta: Array.from({length: 15}, (_, i) => {
          const d = new Date(startDate);
          d.setDate(startDate.getDate() + i);
          const dateStr = d.toISOString().slice(0, 10).replace(/-/g, '');
          return {
            date: dateStr,
            stateCount: {
              "1": 1000 + idx * 100 + i * 10,
              "2": Math.floor(Math.random() * 50) + 10,
              "3": Math.floor(Math.random() * 30) + 5,
              "4": Math.floor(Math.random() * 20) + 2
            }
          };
        })
      }]
    };

    // Store in memCache with merge metadata
    memCache[site] = {
      // Core data
      expose: exposeData,
      crawl: crawlData,
      backlink: backlinkData,
      diagnosisMeta: diagnosisData,
      // Fetch metadata
      exposeFetchedAt: Date.now(),
      exposeFetchState: 'success',
      crawlFetchedAt: Date.now(),
      crawlFetchState: 'success',
      backlinkFetchedAt: Date.now(),
      backlinkFetchState: 'success',
      diagnosisMetaFetchedAt: Date.now(),
      diagnosisMetaFetchState: 'success',
      diagnosisMetaRange: { start: "20260301", end: "20260315" },
      detailLoaded: true,
      __cacheSavedAt: Date.now(),
      // Merge metadata for multi-account support
      __source: 'demo',
      __fetchedAt: Date.now(),
      __version: 1
    };

    console.log('[Demo Mode] Data injected for', site, '- logs:', logs.length, 'clicks:', logs.reduce((s, l) => s + l.clickCount, 0));
  });

  console.log('[Demo Mode] Complete: All mock data injected for', allSites.length, 'sites');

  // Remove snapshot shell hide CSS in demo mode
  const hideStyle = document.getElementById("sadv-snapshot-shell-hide");
  if (hideStyle) {
    hideStyle.remove();
    console.log('[Demo Mode] Removed snapshot shell hide CSS');
  }

  return true;
}

  // ============================================================================
  // CONSTANTS & CONFIGURATION
  // ============================================================================
  const SCHEMA_VERSION = "1.0";
  const MERGE_REGISTRY_KEY = "sadv_merge_registry";

  // P0-3: ACCOUNT_UTILS 통합 - 중복 제거
  // 이제 ACCOUNT_UTILS.getAccountInfo()을 사용하세요.
  // getAccountInfo()는 ACCOUNT_UTILS로 이동됨.

  // ============================================================================
  // P1: V2 레거시 제거 - validateDataSchema, migrateSchema 함수 제거됨
  // V2 포맷만 지원하며 레거시 마이그레이션은 불필요
  // ============================================================================

  /**
   * Detect conflicts between multiple accounts
   * @param {Object} accounts - Map of account data { encId: { sites: {...} } }
   * @returns {Object} { conflicts: [], bySite: {} }
   */
  function detectConflicts(accounts) {
    const result = { conflicts: [], bySite: {} };

    if (!accounts || typeof accounts !== 'object') {
      return result;
    }

    // Collect all sites from all accounts
    const siteAccounts = {}; // { site: [encId1, encId2, ...] }

    for (const [encId, accountData] of Object.entries(accounts)) {
      if (!accountData.sites) continue;

      for (const site of Object.keys(accountData.sites)) {
        if (!siteAccounts[site]) {
          siteAccounts[site] = [];
        }
        siteAccounts[site].push(encId);
      }
    }

    // Find sites that appear in multiple accounts
    for (const [site, accountList] of Object.entries(siteAccounts)) {
      if (accountList.length > 1) {
        result.bySite[site] = {
          accounts: accountList,
          count: accountList.length,
          severity: accountList.length > 2 ? 'high' : 'medium'
        };
        result.conflicts.push({
          site: site,
          accounts: accountList,
          message: `Site "${site}" exists in ${accountList.length} accounts`
        });
      }
    }

    return result;
  }

  /**
   * Merge data from multiple accounts
   * @param {Object} targetData - Base data
   * @param {Object} sourceData - Data to merge in
   * @param {Object} options - Merge options
   * @returns {Object} Merged data
   */
  function mergeAccounts(targetData, sourceData, options = {}) {
    const {
      strategy = 'newer',      // 'newer', 'all', 'target', 'source'
      onConflict = null,        // Custom conflict handler
      mergeLogs = true,         // Merge logs arrays
      mergeDates = true,        // Merge date ranges
      preserveSources = true    // Track data sources
    } = options;

    if (!sourceData || !sourceData.sites) {
      return targetData;
    }

    if (!targetData || !targetData.sites) {
      return sourceData;
    }

    const result = {
      ...targetData,
      sites: { ...targetData.sites }
    };

    const mergeInfo = [];

    for (const [site, sourceSiteData] of Object.entries(sourceData.sites)) {
      const targetSiteData = result.sites[site];

      if (!targetSiteData) {
        // New site - just add it
        result.sites[site] = sourceSiteData;
        mergeInfo.push({ site, action: 'added', source: 'source' });
      } else {
        // Site exists in both - merge based on strategy
        let mergedSiteData;

        switch (strategy) {
          case 'newer':
            // Support both _merge and __meta formats
            const sourceTime = sourceSiteData.__meta?.__fetched_at ||
                              sourceSiteData._merge?.__fetchedAt || 0;
            const targetTime = targetSiteData.__meta?.__fetched_at ||
                              targetSiteData._merge?.__fetchedAt || 0;
            mergedSiteData = sourceTime > targetTime ? sourceSiteData : targetSiteData;
            mergeInfo.push({ site, action: sourceTime > targetTime ? 'newer_source' : 'kept_target' });
            break;

          case 'source':
            mergedSiteData = sourceSiteData;
            mergeInfo.push({ site, action: 'overwrote_source' });
            break;

          case 'target':
            mergedSiteData = targetSiteData;
            mergeInfo.push({ site, action: 'kept_target' });
            break;

          case 'all':
            mergedSiteData = deepMergeSiteData(targetSiteData, sourceSiteData, {
              mergeLogs,
              mergeDates,
              preserveSources
            });
            mergeInfo.push({ site, action: 'deep_merged' });
            break;

          default:
            mergedSiteData = targetSiteData;
            mergeInfo.push({ site, action: 'kept_target_default' });
        }

        result.sites[site] = mergedSiteData;

        // Track sources if requested
        if (preserveSources) {
          if (!mergedSiteData.__sources) {
            mergedSiteData.__sources = [];
          }
          if (!mergedSiteData.__sources.includes(sourceData.__source_account)) {
            mergedSiteData.__sources.push(sourceData.__source_account);
          }
        }
      }
    }

    // Add merge metadata
    result.__merge_info = {
      merged_at: Date.now(),
      merge_count: mergeInfo.length,
      details: mergeInfo,
      strategy_used: strategy
    };

    return result;
  }

  /**
   * Deep merge site data (for 'all' strategy)
   */
  function deepMergeSiteData(target, source, options = {}) {
    const { mergeLogs = true, mergeDates = true, preserveSources = true } = options;

    const merged = { ...target };

    // Merge each data type (expose, crawl, backlink, diagnosisMeta)
    const dataTypes = ['expose', 'crawl', 'backlink', 'diagnosisMeta'];

    for (const type of dataTypes) {
      if (source[type] && target[type]) {
        merged[type] = deepMergeDataType(target[type], source[type], type, options);
      } else if (source[type]) {
        merged[type] = source[type];
      }
    }

    // Merge metadata (support both __meta and _merge)
    if (source.__meta && target.__meta) {
      merged.__meta = {
        ...target.__meta,
        __merged_at: Date.now(),
        __merge_sources: [
          ...(target.__meta.__merge_sources || [target.__meta.__source]),
          source.__meta.__source
        ].filter(Boolean)
      };
    }

    // Also merge _merge for compatibility
    if (source._merge && target._merge) {
      merged._merge = {
        ...target._merge,
        __mergedAt: Date.now(),
        __mergedFrom: [
          ...(target._merge.__mergedFrom || [target._merge.__source]),
          source._merge.__source
        ].filter(Boolean)
      };
    }

    return merged;
  }

  /**
   * Deep merge specific data type
   */
  function deepMergeDataType(target, source, type, options) {
    const { mergeLogs = true } = options;

    if (!target.items || !source.items) {
      return source || target;
    }

    const targetItem = target.items[0] || {};
    const sourceItem = source.items[0] || {};

    const mergedItem = { ...targetItem };

    // Merge logs by date
    if (mergeLogs && targetItem.logs && sourceItem.logs) {
      const logsMap = new Map();

      for (const log of [...targetItem.logs, ...sourceItem.logs]) {
        if (log && log.date) {
          const existing = logsMap.get(log.date);
          if (!existing || (log.__fetched_at || 0) > (existing.__fetched_at || 0)) {
            logsMap.set(log.date, log);
          }
        }
      }

      mergedItem.logs = Array.from(logsMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    }

    // Merge other arrays (urls, querys, stats, countTime)
    const arrayFields = {
      expose: ['urls', 'querys'],
      crawl: ['stats'],
      backlink: ['countTime'],
      diagnosisMeta: ['meta']
    }[type] || [];

    for (const field of arrayFields) {
      if (targetItem[field] && sourceItem[field]) {
        const map = new Map();
        for (const item of [...targetItem[field], ...sourceItem[field]]) {
          if (item && (item.url || item.key || item.domain || item.date || item.timeStamp)) {
            const key = item.url || item.key || item.domain || item.date || item.timeStamp;
            const existing = map.get(key);
            if (!existing) {
              map.set(key, item);
            }
          }
        }
        mergedItem[field] = Array.from(map.values());
      } else if (sourceItem[field]) {
        mergedItem[field] = sourceItem[field];
      }
    }

    // Merge topDomain if exists
    if (type === 'backlink' && (targetItem.topDomain || sourceItem.topDomain)) {
      mergedItem.topDomain = [...(targetItem.topDomain || []), ...(sourceItem.topDomain || [])];
    }

    return { items: [mergedItem] };
  }

  /**
   * P0-4: Export current account data with multi-account support
   * @param {Object} options - Export options { mode: 'current'|'all', includeAll: boolean }
   * @returns {Object} Exportable data object
   */
  function exportCurrentAccountData(options = {}) {
    const { mode = 'current', includeAll = false } = options;
    const now = new Date().toISOString();
    // P0-3: ACCOUNT_UTILS 사용
    const { accountLabel, encId } = ACCOUNT_UTILS.getAccountInfo();

    // 다중 계정 확인
    const isMultiAccount = window.__sadvAccountState?.isMultiAccount || false;

    // 다중 계정 모드에서 includeAll이 true면 모든 계정 내보내기
    if (isMultiAccount && includeAll) {
      return exportSingleAccount(null, encId, now, true);
    }

    // 단일 계정 모드이거나 현재 계정만 내보내기
    const currentAcc = isMultiAccount
      ? (window.__sadvAccountState?.currentAccount || accountLabel)
      : accountLabel;
    return exportSingleAccount(currentAcc, encId, now, false);
  }

  /**
   * P0-4: Export single account data
   * @param {string} accountEmail - Account email to export
   * @param {string} encId - Encrypted ID
   * @param {string} now - ISO timestamp
   * @param {boolean} includeAll - Whether to include all accounts
   * @returns {Object} Exportable V2 payload
   */
  function exportSingleAccount(accountEmail, encId, now, includeAll) {
    // 파라미터 검증 및 기본값 설정
    if (!now) {
      now = new Date().toISOString();
    }
    if (!encId) {
      encId = 'unknown';
    }

    let sites = {};
    let sitesList = [];
    let siteMeta = {};

    // 다중 계정 모드에서 includeAll이 true면 모든 계정 내보내기
    const shouldExportAll = includeAll && window.__sadvAccountState?.isMultiAccount;

    if (shouldExportAll) {
      // 모든 계정 내보내기
      const allAccounts = window.__sadvAccountState.allAccounts;

      // null 체크 및 유효성 검증
      if (!allAccounts || !Array.isArray(allAccounts) || allAccounts.length === 0) {
        console.warn('[exportSingleAccount] No valid accounts for export, falling back to single account mode');
        // 단일 계정 모드로 폴백
      } else {
        for (const accKey of allAccounts) {
          const accData = window.__sadvAccountState.accountsData[accKey];
          if (!accData) {
            console.warn(`[exportSingleAccount] Missing data for account: ${accKey}`);
            continue;
          }
          const accSites = accData?.sites || [];
          sitesList.push(...accSites);

          if (accData?.dataBySite) {
            Object.assign(sites, accData.dataBySite);
          }

          if (accData?.siteMeta) {
            Object.assign(siteMeta, accData.siteMeta);
          }
        }
        // 모든 계정 처리 성공
        if (sitesList.length > 0) {
          siteMeta = typeof getSiteMetaMap === "function" ? getSiteMetaMap() : {};
          return buildExportPayload(accountEmail, encId, now, sitesList, sites, siteMeta, true);
        } else {
          console.warn('[exportSingleAccount] No sites found in any account, falling back to single account mode');
        }
      }
    }

    // 단일 계정 모드이거나 다중 계정 모드 실패 시 폴백
    if (!shouldExportAll || sitesList.length === 0) {
      // 현재 계정만 내보내기 (localStorage에서 데이터 수집)
      const keysToCheck = Object.keys(localStorage);

      for (const key of keysToCheck) {
        if (!key.startsWith(DATA_LS_PREFIX)) continue;
        if (!key.includes(getCacheNamespace())) continue;

        try {
          const value = localStorage.getItem(key);
          if (!value) continue;

          const data = JSON.parse(value);

          // Extract site from key
          const match = key.match(/_([^_]+)$/);
          if (!match) continue;

          let site;
          try {
            site = atob(match[1]);
          } catch (decodeError) {
            showError(ERROR_MESSAGES.DATA_INCONSISTENCY, decodeError, 'exportSingleAccount-decode');
            continue;
          }

          // Structure site data
          const fetchedAt = data.__cacheSavedAt || data.__fetched_at || Date.now();
          sites[site] = {
            // Current format (__meta)
            __meta: {
              __source: encId || 'unknown',
              __fetched_at: fetchedAt,
              __schema: SCHEMA_VERSION,
              __namespace: getCacheNamespace()
            },
            // Legacy format (_merge) for test compatibility
            _merge: {
              __source: accountEmail || 'unknown',
              __accountId: encId || 'unknown',
              __fetchedAt: fetchedAt,
              __version: 1
            },
            expose: data.expose || null,
            crawl: data.crawl || null,
            backlink: data.backlink || null,
            diagnosisMeta: data.diagnosisMeta || null,
            diagnosisMetaRange: data.diagnosisMetaRange || null,
            detailLoaded: data.detailLoaded || false
          };
        } catch (e) {
          showError(ERROR_MESSAGES.EXPORT_INCOMPLETE, e, 'exportSingleAccount');
        }
      }

      sitesList = Object.keys(sites);
      siteMeta = typeof getSiteMetaMap === "function" ? getSiteMetaMap() : {};
    }

    // V2: Nested accounts structure
    // 계정 이메일 검증 강화 (공백 문자열, null, undefined 체크)
    const validAccountEmail = (accountEmail && typeof accountEmail === 'string' &&
                          accountEmail.trim() && accountEmail.includes('@'))
      ? accountEmail.trim()
      : 'unknown@naver.com';

    // Get current UI state for V2 payload
    const currentCurMode = (typeof curMode !== "undefined") ? curMode : "all";
    const currentCurSite = (typeof curSite !== "undefined") ? curSite : null;
    const currentCurTab = (typeof curTab !== "undefined") ? curTab : "overview";

    return {
      __meta: {
        version: PAYLOAD_V2.VERSION,
        exportedAt: now,
        generator: 'SearchAdvisor Runtime',
        generatorVersion: window.__SEARCHADVISOR_RUNTIME_VERSION__ || 'unknown',
        accountCount: includeAll ? (window.__sadvAccountState?.allAccounts?.length || 1) : 1
      },
      accounts: includeAll ? window.__sadvAccountState?.accountsData : {
        [validAccountEmail]: {
          encId: encId || 'unknown',
          sites: sitesList,
          siteMeta: siteMeta,
          dataBySite: sites
        }
      },
      ui: {
        curMode: currentCurMode,
        curSite: currentCurSite,
        curTab: currentCurTab,
        curAccount: (typeof window.__sadvAccountState?.currentAccount !== "undefined")
          ? window.__sadvAccountState.currentAccount
          : validAccountEmail
      },
      stats: {
        success: sitesList.length,
        partial: 0,
        failed: 0,
        errors: []
      },
      _siteOwnership: window.__sadvInitData?.siteOwnership || {}
    };
  }

  /**
   * Import account data from exported format
   * @param {Object} exportData - Data from exportCurrentAccountData()
   * @param {Object} options - Import options
   * @returns {Object} Import result
   */
  function importAccountData(exportData, options = {}) {
    const {
      overwrite = false,
      mergeStrategy = 'newer',
      validate = true
    } = options;

    // Handle V2 format
    let data, sourceAccount, sourceEncId, sitesToImport;

    if (exportData.__meta && exportData.accounts) {
      // V2 format
      const accounts = exportData.accounts;
      const accountKeys = Object.keys(accounts);
      if (accountKeys.length === 0) {
        return {
          success: false,
          error: ERROR_MESSAGES.NO_VALID_ACCOUNTS
        };
      }

      // For now, handle single account (first one found)
      const accountEmail = accountKeys[0];
      const account = accounts[accountEmail];

      data = exportData.__meta;
      sourceAccount = accountEmail;
      sourceEncId = account.encId || 'unknown';
      sitesToImport = account.dataBySite || {};
    } else {
      // V2 포맷이 아닌 레거시 데이터는 지원하지 않음
      return {
        success: false,
        error: ERROR_MESSAGES.IMPORT_FORMAT_ERROR
      };
    }

    const registry = getMergeRegistry();

    // Track this account
    registry.accounts[sourceEncId] = {
      label: sourceAccount,
      importedAt: Date.now(),
      encId: sourceEncId,
      schemaVersion: data.version || data.__schema_version
    };

    let importedCount = 0;
    let mergedCount = 0;
    let skippedCount = 0;
    const errors = [];

    // Import each site
    for (const [site, siteData] of Object.entries(sitesToImport)) {
      try {
        const cacheKey = getSiteDataCacheKey(site);
        const existing = localStorage.getItem(cacheKey);

        if (existing && !overwrite) {
          const existingData = JSON.parse(existing);
          // Support both _merge and __meta formats
          const sourceTime = siteData.__meta?.__fetched_at ||
                            siteData._merge?.__fetchedAt || 0;
          const targetTime = existingData.__cacheSavedAt ||
                            existingData.__meta?.__fetched_at ||
                            existingData._merge?.__fetchedAt || 0;

          if (mergeStrategy === 'newer' && sourceTime > targetTime) {
            // Import newer data
            siteData.__meta.__imported_from = sourceEncId;
            siteData.__meta.__imported_at = Date.now();
            localStorage.setItem(cacheKey, JSON.stringify(siteData));
            mergedCount++;
          } else {
            skippedCount++;
          }
        } else {
          // No existing data or overwrite
          siteData.__meta = siteData.__meta || {};
          siteData.__meta.__imported_from = sourceEncId;
          siteData.__meta.__imported_at = Date.now();
          localStorage.setItem(cacheKey, JSON.stringify(siteData));
          importedCount++;
        }

        // Track in registry
        if (!registry.mergedSites) {
          registry.mergedSites = {};
        }
        if (!registry.mergedSites[site]) {
          registry.mergedSites[site] = [];
        }
        registry.mergedSites[site].push({
          encId: sourceEncId,
          importedAt: Date.now(),
          strategy: mergeStrategy
        });

      } catch (e) {
        errors.push({ site, error: e.message });
        showError(`${ERROR_MESSAGES.IMPORT_FAILED}: ${site}`, e, 'importAccountData');
      }
    }

    saveMergeRegistry(registry);

    return {
      success: true,
      importedCount,
      mergedCount,
      skippedCount,
      errors,
      sourceAccount,
      sourceEncId
    };
  }

  /**
   * Get merge registry (tracks all imported accounts)
   */
  function getMergeRegistry() {
    try {
      const reg = localStorage.getItem(MERGE_REGISTRY_KEY);
      return reg ? JSON.parse(reg) : { accounts: {}, mergedSites: {} };
    } catch (e) {
      return { accounts: {}, mergedSites: {} };
    }
  }

  /**
   * Save merge registry
   */
  function saveMergeRegistry(registry) {
    try {
      localStorage.setItem(MERGE_REGISTRY_KEY, JSON.stringify(registry));
    } catch (e) {}
  }

  /**
   * Get imported accounts list
   * @returns {Array} List of imported account info
   */
  function getImportedAccounts() {
    const registry = getMergeRegistry();
    return Object.values(registry.accounts).map(acc => ({
      label: acc.label,
      encId: acc.encId,
      importedAt: acc.importedAt,
      schemaVersion: acc.schemaVersion
    }));
  }

  /**
   * Get sites from a specific account
   * @param {string} encId - Account encId
   * @returns {Array} List of sites
   */
  function getSitesByAccount(encId) {
    const registry = getMergeRegistry();
    const sites = [];

    for (const [site, merges] of Object.entries(registry.mergedSites)) {
      if (merges && merges.some(m => m.encId === encId)) {
        sites.push(site);
      }
    }
    return sites;
  }

// UI State Management
// 이 파일은 SearchAdvisor 런타임의 UI 상태 관리 코드를 포함합니다.

// ============================================================================
// 상태 변수
// ============================================================================

let curMode = CONFIG.MODE.ALL,
  curSite = null,
  curTab = "overview";
let siteViewReqId = 0;
let allViewReqId = 0;
const __sadvListeners = new Set();
let __sadvInitialReady = false;
const __sadvReadyResolvers = [];

// ============================================================================
// 스냅샷 상태 함수들
// ============================================================================

function __sadvSnapshot() {
  return {
    curMode,
    curSite,
    curTab,
    allSites: [...allSites],
    rows: window.__sadvRows || [],
    accountLabel,
  };
}

function __sadvNotify() {
  const snap = __sadvSnapshot();
  __sadvListeners.forEach(function (fn) {
    try {
      fn(snap);
    } catch (e) {
      console.error('[__sadvNotify] Error:', e);
    }
  });
}

function __sadvMarkReady() {
  if (__sadvInitialReady) return;
  __sadvInitialReady = true;
  while (__sadvReadyResolvers.length) {
    const resolve = __sadvReadyResolvers.shift();
    try {
      resolve(true);
    } catch (e) {
      console.error('[__sadvMarkReady] Error:', e);
    }
  }
  __sadvNotify();
}

// ============================================================================
// 스냅샷 쉘 상태 관리 함수들
// ============================================================================

function buildSnapshotShellState(payload) {
  // Handle V2 format
  let allSites, dataBySite, summaryRows, siteMeta, accountLabel, savedAt, curMode, curSite, curTab;

  if (payload.__meta && payload.accounts) {
    // V2 format
    const accountKeys = Object.keys(payload.accounts);
    const firstAccount = accountKeys.length > 0 ? payload.accounts[accountKeys[0]] : null;

    accountLabel = accountKeys[0] || "";
    allSites = firstAccount?.sites || [];
    dataBySite = firstAccount?.dataBySite || {};
    summaryRows = payload.summaryRows || [];
    siteMeta = firstAccount?.siteMeta || {};
    savedAt = payload.__meta.savedAt;
    curMode = payload.ui?.curMode || CONFIG.MODE.ALL;
    curSite = payload.ui?.curSite || null;
    curTab = payload.ui?.curTab || "overview";
  } else {
    // V2 포맷이 아닌 경우 빈 값 반환
    accountLabel = "";
    allSites = [];
    dataBySite = {};
    summaryRows = [];
    siteMeta = {};
    savedAt = null;
    curMode = CONFIG.MODE.ALL;
    curSite = null;
    curTab = "overview";
  }

  const snapshotTabIds = [
    "overview",
    "daily",
    "queries",
    "pages",
    "crawl",
    "backlink",
    "diagnosis",
    "insight",
  ];
  const cacheSavedAtValues = allSites
    .map(function (site) {
      const siteData = dataBySite && dataBySite[site];
      return siteData && typeof siteData.__cacheSavedAt === "number"
        ? siteData.__cacheSavedAt
        : null;
    })
    .filter(function (value) {
      return typeof value === "number";
    });
  const savedAtValue =
    savedAt && !Number.isNaN(new Date(savedAt).getTime())
      ? new Date(savedAt)
      : null;
  const updatedAt = cacheSavedAtValues.length
    ? new Date(Math.max.apply(null, cacheSavedAtValues))
    : savedAtValue;
  return {
    accountLabel: accountLabel,
    allSites: Array.isArray(allSites) ? allSites : [],
    rows: Array.isArray(summaryRows) ? summaryRows.slice() : [],
    siteMeta: siteMeta && typeof siteMeta === "object" ? siteMeta : {},
    curMode: curMode === CONFIG.MODE.SITE ? CONFIG.MODE.SITE : CONFIG.MODE.ALL,
    curSite:
      typeof curSite === "string"
        ? curSite
        : (Array.isArray(allSites) && allSites[0]) || null,
    curTab: snapshotTabIds.indexOf(curTab) !== -1
      ? curTab
      : "overview",
    runtimeVersion: window.__SEARCHADVISOR_RUNTIME_VERSION__ || "snapshot",
    cacheMeta: updatedAt
      ? {
          label: "snapshot",
          updatedAt,
          remainingMs: null,
          sourceCount: Array.isArray(allSites) ? allSites.length : 0,
          measuredAt: Date.now(),
        }
      : null,
  };
}

// ============================================================================
// 메타데이터 상태 관리
// ============================================================================

let snapshotMetaState = { siteMeta: {}, mergedMeta: null };

function setSnapshotMetaState(state) {
  snapshotMetaState = {
    siteMeta: state && state.siteMeta ? state.siteMeta : {},
    mergedMeta: state && state.mergedMeta ? state.mergedMeta : null,
  };
}

function getSiteMetaMap() {
  const liveMap = snapshotMetaState.siteMeta;
  if (liveMap && Object.keys(liveMap).length) return liveMap;
  const payload =
    typeof window !== "undefined" && window.__SEARCHADVISOR_EXPORT_PAYLOAD__
      ? window.__SEARCHADVISOR_EXPORT_PAYLOAD__
      : null;
  if (!payload) return {};

  // Handle V2 format
  if (payload.__meta && payload.accounts) {
    const accountKeys = Object.keys(payload.accounts);
    if (accountKeys.length > 0) {
      return payload.accounts[accountKeys[0]]?.siteMeta || {};
    }
  }

  // Legacy format
  return payload.siteMeta || {};
}

function getMergedMetaState() {
  if (snapshotMetaState.mergedMeta) return snapshotMetaState.mergedMeta;
  const payload =
    typeof window !== "undefined" && window.__SEARCHADVISOR_EXPORT_PAYLOAD__
      ? window.__SEARCHADVISOR_EXPORT_PAYLOAD__
      : null;
  return payload && payload.mergedMeta ? payload.mergedMeta : null;
}

// ============================================================================
// 전역 노출 (IIFE로 감싸진 환경에서도 접근 가능하도록)
// ============================================================================
if (typeof window !== "undefined") {
  // UI 상태 변수들을 window 객체에 노출
  Object.defineProperty(window, "curMode", {
    get: function() { return curMode; },
    set: function(v) { curMode = v; },
    enumerable: true
  });
  Object.defineProperty(window, "curSite", {
    get: function() { return curSite; },
    set: function(v) { curSite = v; },
    enumerable: true
  });
  Object.defineProperty(window, "curTab", {
    get: function() { return curTab; },
    set: function(v) { curTab = v; },
    enumerable: true
  });
  Object.defineProperty(window, "siteViewReqId", {
    get: function() { return siteViewReqId; },
    set: function(v) { siteViewReqId = v; },
    enumerable: true
  });
  Object.defineProperty(window, "allViewReqId", {
    get: function() { return allViewReqId; },
    set: function(v) { allViewReqId = v; },
    enumerable: true
  });
}

  function buildRenderers(expose, crawlData, backlinkData, diagnosisMeta) {
    const item = (expose && expose.items && expose.items[0]) || {};
    const period = item.period || {},
      rawLogs = item.logs || [],
      urls = item.urls || [],
      queries = item.querys || [];
    const logs = [...rawLogs].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    const dates = logs.map((r) => fmtB(r.date)),
      clicks = logs.map((r) => Number(r.clickCount) || 0),
      exposes = logs.map((r) => Number(r.exposeCount) || 0),
      ctrs = logs.map((r) => { const n = parseFloat(r.ctr); return Number.isFinite(n) ? n : 0; });
    const cSt = st(clicks),
      totalC = clicks.reduce((a, b) => a + b, 0),
      totalE = exposes.reduce((a, b) => a + b, 0),
      avgCtr = totalE ? ((totalC / totalE) * 100).toFixed(2) : "0.00",
      corr = pearson(exposes, clicks);

    // Extract diagnosis data
    const diagnosisItem = (diagnosisMeta && diagnosisMeta.items && diagnosisMeta.items[0]) || {};
    const diagnosisLogs = [...(diagnosisItem.meta || [])].sort((a, b) =>
      (a.date || "").localeCompare(b.date || ""),
    );
    const diagnosisLatest = diagnosisLogs.length > 0 ? diagnosisLogs[diagnosisLogs.length - 1] : null;
    const diagnosisLatestCounts = diagnosisLatest && diagnosisLatest.stateCount ? diagnosisLatest.stateCount : {};
    const diagnosisIndexedCurrent = diagnosisLatestCounts["1"] || 0;
    const diagnosisIndexedValues = diagnosisLogs.map(function (row) {
      return (row.stateCount && row.stateCount["1"]) || 0;
    });
    const diagnosisIndexedSeries = {
      current: diagnosisIndexedCurrent,
      values: diagnosisIndexedValues,
      color: C.purple,
    };
    const diagnosisIndexedOverviewValues = diagnosisIndexedValues.slice(-15);
    const dowAcc = {};
    logs.forEach(function (r) {
      const dw = new Date(fmtD(r.date)).getDay();
      if (!dowAcc[dw]) dowAcc[dw] = { c: 0, n: 0 };
      dowAcc[dw].c += r.clickCount;
      dowAcc[dw].n++;
    });
    const dowRows = DOW.map(function (l, i) {
      return {
        label: l,
        avgC: dowAcc[i] ? Math.round(dowAcc[i].c / dowAcc[i].n) : 0,
        n: dowAcc[i] ? dowAcc[i].n : 0,
      };
    });
    const bestDow = dowRows.reduce(
        (a, b) => (b.avgC > a.avgC ? b : a),
        dowRows[0],
      ),
      worstDow = dowRows
        .filter((x) => x.n > 0)
        .reduce((a, b) => (b.avgC < a.avgC ? b : a), dowRows[0]);
    const crawlStats =
      (crawlData &&
        crawlData.items &&
        crawlData.items[0] &&
        crawlData.items[0].stats) ||
      [];
    const crawlSorted = [...crawlStats].sort((a, b) =>
      (a.date || "").localeCompare(b.date || ""),
    );
    const blData =
      (backlinkData && backlinkData.items && backlinkData.items[0]) || {};
    const blTime = (blData.countTime || []).sort((a, b) =>
      a.timeStamp.localeCompare(b.timeStamp),
    );
    const blTopDomains = blData.topDomain || [];
    return {
      overview: function () {
        const wrap = document.createElement("div");
        wrap.appendChild(
          kpiGrid([
            {
              label: "총 클릭",
              value: fmt(totalC) + "회",
              sub: "90일 합계",
              color: C.green,
              icon: ICONS.click,
            },
            {
              label: "총 노출",
              value: (totalE / 10000).toFixed(1) + "만",
              sub: "90일 합계",
              color: C.blue,
              icon: ICONS.eye,
            },
            {
              label: "평균 CTR",
              value: avgCtr + "%",
              color: C.amber,
              sub: "90일 평균",
              icon: ICONS.chart,
            },
            {
              label: "분석기간",
              value: logs.length + "일",
              color: C.sub,
              icon: ICONS.calendar,
            },
          ]),
        );
        const prevCR = period.prevClickRatio != null ? parseFloat(period.prevClickRatio) : null;
        const prevER = period.prevExposeRatio != null ? parseFloat(period.prevExposeRatio) : null;
        if (prevCR !== null || prevER !== null)
          wrap.appendChild(
            kpiGrid(
              [
                prevCR !== null && {
                  label: "클릭 전기비",
                  value: (prevCR >= 0 ? "+" : "") + prevCR + "%",
                  color: prevCR >= 0 ? C.green : C.red,
                  sub: "90일 전 대비",
                  icon: prevCR >= 0 ? ICONS.up : ICONS.down,
                },
                prevER !== null && {
                  label: "노출 전기비",
                  value: (prevER >= 0 ? "+" : "") + prevER + "%",
                  color: prevER >= 0 ? C.green : C.red,
                  sub: "90일 전 대비",
                  icon: prevER >= 0 ? ICONS.up : ICONS.down,
                },
              ].filter(Boolean),
            ),
          );
        wrap.appendChild(
          chartCard(
            "일별 클릭수",
            "최고 " + fmt(Math.max(...clicks)) + "회",
            C.green,
            sparkline(clicks, dates, 80, C.green, "회"),
            dates,
          ),
        );
        wrap.appendChild(
          chartCard(
            "일별 노출수",
            "최고 " + fmt(Math.max(...exposes)),
            C.blue,
            sparkline(exposes, dates, 65, C.blue, "회"),
            dates,
          ),
        );
        wrap.appendChild(
          chartCard(
            "일별 CTR",
            "평균 " + avgCtr + "%",
            C.amber,
            sparkline(ctrs, dates, 55, C.amber, "%"),
            dates,
          ),
        );
        if (diagnosisLogs.length) {
          wrap.appendChild(
            chartCard(
              "색인 추이",
              fmt(diagnosisIndexedSeries.current) + "건",
              diagnosisIndexedSeries.color,
              sparkline(
                diagnosisIndexedOverviewValues,
                dates,
                80,
                diagnosisIndexedSeries.color,
                "건",
                { minValue: 0 },
              ),
              dates,
            ),
          );
        }
        const topEl = document.createElement("div");
        topEl.appendChild(secTitle("클릭 TOP 3"));
        [...logs]
          .sort((a, b) => b.clickCount - a.clickCount)
          .slice(0, 3)
          .forEach(function (r, i) {
            const d = document.createElement("div");
            d.style.cssText = S.row + ";border-color:" + (i === 0 ? C.green + "44" : C.border);
            d.innerHTML = `<span>${["🥇", "🥈", "🥉"][i]} <span style="font-size:12px;color:#94a3b8;margin-left:8px">${escHtml(fmtD(r.date))}</span></span><b style="color:${C.green};font-size:14px">${escHtml(fmt(r.clickCount))}회</b>`;
            topEl.appendChild(d);
          });
        wrap.appendChild(topEl);
        return wrap;
      },
      daily: function () {
        const wrap = document.createElement("div"),
          mxC = Math.max(...clicks) || 1;
        wrap.appendChild(
          chartCard(
            "일별 클릭 추이",
            "최고 " + fmt(mxC) + "회",
            C.green,
            sparkline(clicks, dates, 90, C.green, "회"),
            dates,
          ),
        );
        wrap.appendChild(secTitle("날짜별 상세"));
        [...logs].reverse().forEach(function (r) {
          const isOut = cSt.outliers && cSt.outliers.includes(r.clickCount),
            d = document.createElement("div");
          d.style.cssText = "margin-bottom:12px;padding:4px 0";
          d.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><span style="font-size:12px;color:#94a3b8;font-weight:500">${escHtml(fmtD(r.date))} (${escHtml(DOW[new Date(fmtD(r.date)).getDay()])})${isOut ? ' <span style="color:' + C.red + ';font-size:10px;background:' + C.red + '15;padding:1px 4px;border-radius:4px">이상치</span>' : ""}</span><span style="font-size:13px;font-weight:700;color:${r.clickCount >= (cSt.mean || 0) ? C.green : C.text}">${escHtml(fmt(r.clickCount))}회</span></div>${hbar(r.clickCount, mxC, r.clickCount >= (cSt.mean || 0) ? C.green : C.blue)}<div style="display:flex;gap:12px;font-size:11px;color:#64748b;margin-top:4px"><span>노출 <b style="color:#94a3b8">${escHtml(fmt(r.exposeCount))}</b></span><span>CTR ${ctrBadge(r.ctr)}</span></div>`;
          wrap.appendChild(d);
        });
        return wrap;
      },
      urls: function () {
        const wrap = document.createElement("div"),
          mxC = Math.max(...urls.map((u) => u.clickCount)) || 1;
        if (!urls.length) {
          const em = document.createElement("div");
          em.style.cssText = "text-align:center;padding:40px 20px;color:#64748b;font-size:13px";
          em.innerHTML = `<div style="margin-bottom:12px;opacity:0.5">${ICONS.link}</div>URL 데이터 없음`;
          wrap.appendChild(em);
          return wrap;
        }
        wrap.appendChild(
          chartCard(
            "URL별 클릭 TOP 10",
            "총 " + urls.length + "개",
            C.green,
            barchart(
              urls.slice(0, 10).map((u) => u.clickCount),
              urls.slice(0, 10).map((_, i) => "#" + (i + 1)),
              65,
              C.green,
              "회",
            ),
            urls.slice(0, 10).map((_, i) => "#" + (i + 1)),
          ),
        );
        wrap.appendChild(secTitle("URL 상세"));
        urls.forEach(function (u, i) {
          const pageUrl = (() => {
              try {
                return /^https?:\/\//.test(u.key)
                  ? u.key
                  : new URL(u.key, curSite).toString();
              } catch (e) {
                return u.key;
              }
            })(),
            linkLabel =
              pageUrl.length > 92 ? pageUrl.slice(0, 92) + "..." : pageUrl,
            d = document.createElement("div");
          d.style.cssText = S.row + ";flex-direction:column;align-items:stretch;gap:8px;border-color:" + (i === 0 ? C.green + "44" : C.border);
          d.innerHTML = `<div style="display:flex;gap:10px;align-items:flex-start"><span style="font-size:11px;font-weight:800;color:${i === 0 ? C.green : "#64748b"};min-width:24px;margin-top:2px">#${i + 1}</span><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:6px;margin-bottom:6px"><a href="${pageUrl.replace(/"/g, "&quot;")}" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:${C.blue};line-height:1.4;word-break:break-all;text-decoration:none;font-weight:500">${escHtml(linkLabel)}</a><span style="flex-shrink:0;opacity:0.5">${ICONS.external}</span></div>${hbar(u.clickCount, mxC, i === 0 ? C.green : C.blue)}<div style="display:flex;gap:12px;font-size:11px;color:#64748b"><span>클릭 <b style="color:${C.green}">${escHtml(fmt(u.clickCount))}</b></span><span>노출 <b style="color:${C.blue}">${escHtml(fmt(u.exposeCount))}</b></span><span>CTR ${ctrBadge(u.ctr)}</span></div></div></div>`;
          wrap.appendChild(d);
        });
        return wrap;
      },
      queries: function () {
        const wrap = document.createElement("div"),
          mxC = Math.max(...queries.map((q) => q.clickCount)) || 1;
        if (!queries.length) {
          const em = document.createElement("div");
          em.style.cssText = "text-align:center;padding:40px 20px;color:#64748b;font-size:13px";
          em.innerHTML = `<div style="margin-bottom:12px;opacity:0.5">${ICONS.search}</div>검색어 데이터 없음`;
          wrap.appendChild(em);
          return wrap;
        }
        wrap.appendChild(
          chartCard(
            "검색어별 클릭 TOP 10",
            "총 " + queries.length + "개",
            C.teal,
            barchart(
              queries.slice(0, 10).map((q) => q.clickCount),
              queries.slice(0, 10).map((_, i) => "#" + (i + 1)),
              65,
              C.teal,
              "회",
            ),
            queries.slice(0, 10).map((_, i) => "#" + (i + 1)),
          ),
        );
        wrap.appendChild(secTitle("검색어 상세"));
        queries.forEach(function (q, i) {
          const searchUrl =
              "https://search.naver.com/search.naver?query=" +
              encodeURIComponent(q.key),
            safeKey = escHtml(q.key),
            d = document.createElement("div");
          d.style.cssText = S.row + ";flex-direction:column;align-items:stretch;gap:8px;border-color:" + (i === 0 ? C.teal + "44" : C.border);
          d.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><div style="display:flex;align-items:center;gap:8px;min-width:0"><span style="font-size:11px;font-weight:800;color:${i < 3 ? C.teal : "#64748b"}">#${i + 1}</span><a href="${searchUrl}" target="_blank" rel="noopener noreferrer" style="font-size:13px;font-weight:600;color:${C.blue};text-decoration:none;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(safeKey)}</a><span style="opacity:0.5">${ICONS.external}</span></div><span style="font-size:13px;font-weight:700;color:${C.green}">${escHtml(fmt(q.clickCount))}회</span></div>${hbar(q.clickCount, mxC, C.teal)}<div style="display:flex;gap:12px;font-size:11px;color:#64748b"><span>노출 <b style="color:#94a3b8">${escHtml(fmt(q.exposeCount))}</b></span><span>CTR ${ctrBadge(q.ctr)}</span></div>`;
          wrap.appendChild(d);
        });
        return wrap;
      },
      pattern: function () {
        const wrap = document.createElement("div"),
          mxC = Math.max(...dowRows.map((x) => x.avgC)) || 1;
        wrap.appendChild(
          chartCard(
            "요일별 평균 클릭",
            bestDow.label + "요일 최고 " + fmt(bestDow.avgC) + "회",
            C.green,
            barchart(
              dowRows.map((x) => x.avgC),
              dowRows.map((d) => d.label + "요일"),
              70,
              C.purple,
              "회",
            ),
            dowRows.map((d) => d.label),
          ),
        );
        const grid = document.createElement("div");
        grid.style.cssText =
          "display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:20px";
        dowRows.forEach(function (d) {
          const isB = d.label === bestDow.label,
            isW = d.label === worstDow.label && d.n > 0,
            hh = d.avgC ? Math.max(4, Math.round((d.avgC / mxC) * 40)) : 2;
          const cell = document.createElement("div");
          cell.style.cssText =
            "background:#1e293b;border:1px solid " +
            (isB ? C.green + "44" : isW ? C.red + "44" : C.border) +
            ";border-radius:10px;padding:10px 4px;text-align:center;transition:all 0.2s";
          cell.innerHTML = `<div style="font-size:11px;color:#94a3b8;margin-bottom:6px;font-weight:600">${escHtml(d.label)}</div><div style="height:40px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:8px"><div style="height:${hh}px;background:${isB ? C.green : isW ? C.red : C.blue};border-radius:3px;width:16px;min-height:2px;opacity:0.8;box-shadow:0 0 8px ${isB ? C.green : isW ? C.red : C.blue}33"></div></div><div style="font-size:11px;font-weight:700;color:${isB ? C.green : isW ? C.red : C.text}">${d.avgC ? escHtml(fmt(d.avgC)) : "-"}</div><div style="font-size:10px;color:#64748b;margin-top:2px">${escHtml(d.n)}일</div>`;
          grid.appendChild(cell);
        });
        wrap.appendChild(secTitle("요일별 분석"));
        wrap.appendChild(grid);
        if (logs.length > 0) {
          const lastDate = new Date(fmtD(logs[logs.length - 1].date));
          const fc = Array.from({ length: 7 }, function (_, i) {
            const fd = new Date(lastDate);
            fd.setDate(fd.getDate() + i + 1);
            return {
              date: fd.toISOString().slice(0, 10),
              pred: Math.max(
                0,
                Math.round(
                  (cSt.mean || 0) + (cSt.slope || 0) * (logs.length + i),
                ),
              ),
              dow: DOW[fd.getDay()],
            };
          });
          wrap.appendChild(secTitle("향후 7일 예상"));
          wrap.appendChild(ibox("amber", `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.lightbulb}</span>추세 기반 참고용 예상치입니다.`));
          wrap.appendChild(
            chartCard(
              "예상 클릭",
              "",
              `#f59e0b`,
              sparkline(
                fc.map((x) => x.pred),
                fc.map((x) => x.date.slice(5)),
                65,
                "#f59e0b",
                "회",
              ),
              fc.map((x) => x.date.slice(5)),
            ),
          );
          fc.forEach(function (x, i) {
            const d = document.createElement("div");
            d.style.cssText = S.row + ";margin-bottom:6px";
            d.innerHTML = `<span style="font-size:12px;color:#94a3b8;font-weight:500">${escHtml(x.date)} (${escHtml(x.dow)}) <span style="font-size:10px;color:#64748b;margin-left:4px">+${i + 1}일</span></span><b style="color:${cSt.slope >= 0 ? C.green : C.red};font-size:14px">약 ${escHtml(fmt(x.pred))}회</b>`;
            wrap.appendChild(d);
          });
        }
        return wrap;
      },
      crawl: function () {
        const wrap = document.createElement("div");
        if (!crawlSorted.length) {
          wrap.innerHTML =
            '<div style="padding:30px;text-align:center;color:#3d5a78">\ud06c\ub864 \ub370\uc774\ud130 \uc5c6\uc74c</div>';
          return wrap;
        }
        const pageCounts = crawlSorted.map((r) => r.pageCount),
          cDates = crawlSorted.map((r) => fmtB(r.date)),
          totalPages = pageCounts.reduce((a, b) => a + b, 0),
          totalSize = crawlSorted.reduce((a, r) => a + r.downloadSize, 0),
          avgPage = Math.round(totalPages / crawlSorted.length),
          maxPage = Math.max(...pageCounts);
        const errDays = crawlSorted.filter(
          (r) => r.sumErrorCount > 0 || r.notFound > 0,
        ).length;
        const total404 = crawlSorted.reduce((a, r) => a + (r.notFound || 0), 0);
        wrap.appendChild(
          kpiGrid([
            {
              label: "\ucd1d \ud06c\ub864",
              value: (totalPages / 10000).toFixed(1) + "\ub9cc",
              sub: "90\uc77c \ud569\uacc4",
              color: C.blue,
            },
            { label: "\uc77c\ud3c9\uade0", value: fmt(avgPage), color: C.teal },
            {
              label: "\uc5d0\ub7ec·404\uc77c",
              value: errDays + "\uc77c",
              color: errDays > 5 ? C.red : errDays > 0 ? C.amber : C.green,
            },
            {
              label: "\ucd1d \uc6a9\ub7c9",
              value: (totalSize / 1024 / 1024 / 1024).toFixed(1) + "GB",
              color: C.sub,
            },
          ]),
        );
        wrap.appendChild(
          chartCard(
            "\uc77c\ubcc4 \ud06c\ub864 \ud398\uc774\uc9c0",
            "\ucd5c\uace0 " + fmt(maxPage) + "p",
            C.blue,
            sparkline(pageCounts, cDates, 80, C.blue, "p"),
            cDates,
          ),
        );
        if (total404 > 0)
          wrap.appendChild(
            ibox(
              "amber",
              `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.lightbulb}</span>404 Not Found 누적 <b style="color:${C.amber}">${fmt(total404)}건</b> · 삭제된 URL 확인 권장`,
            ),
          );
        wrap.appendChild(secTitle("\uc5d0\ub7ec \uc0c1\uc138"));
        const errRows = crawlSorted
          .filter((r) => r.sumErrorCount > 0 || r.notFound > 0)
          .reverse();
        if (!errRows.length) {
          const ok = document.createElement("div");
          ok.style.cssText =
            "text-align:center;padding:20px;color:#00e676;font-size:13px";
          ok.innerHTML = `<span style="display:inline-flex;align-items:center;gap:6px;color:#10b981">${ICONS.trendUp} 크롤 상태 양호!</span>`;
          wrap.appendChild(ok);
        } else {
          errRows.forEach(function (r) {
            const hasServerErr = r.sumErrorCount > 0,
              has404 = r.notFound > 0;
            const d = document.createElement("div");
            d.style.cssText =
              "background:#0d1829;border:1px solid " +
              (hasServerErr ? "#ff525233" : has404 ? "#ffca2833" : "#1a2d45") +
              ";border-radius:9px;padding:10px 12px;margin-bottom:6px";
            const errs =
              [
                r.serverError && `\uC11C\uBC84\uC624\uB958 ${escHtml(r.serverError)}`,
                r.notFound && `404 ${escHtml(r.notFound)}`,
                r.connectTimeout && `\ud0c0\uc784\uc544\uc6c3 ${escHtml(r.connectTimeout)}`,
              ]
                .filter(Boolean)
                .join(" · ") || "-";
            const dispErrCnt = (r.sumErrorCount || 0) + (r.notFound || 0);
            d.innerHTML = `<div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:12px;color:#94a3b8;font-weight:500">${escHtml(fmtD(r.date))}</span><span style="font-size:13px;font-weight:700;color:${hasServerErr ? C.red : C.amber}">에러·404 ${escHtml(fmt(dispErrCnt))}건</span></div><div style="font-size:11px;color:${hasServerErr ? C.red : C.amber};opacity:0.8">${escHtml(errs)}</div><div style="font-size:10px;color:#64748b;margin-top:4px">크롤 ${escHtml(fmt(r.pageCount))}p · 시도 ${escHtml(fmt(r.sumTryCount))}</div>`;
            wrap.appendChild(d);
          });
        }
        return wrap;
      },
      backlink: function () {
        const wrap = document.createElement("div");
        if (!blTime.length) {
          wrap.innerHTML =
            '<div style="padding:40px 20px;text-align:center;color:#64748b;font-size:13px"><div style="margin-bottom:12px;opacity:0.5">' + ICONS.link + '</div>백링크 데이터 없음</div>';
          return wrap;
        }
        const blVals = blTime.map((r) => r.backlinkCnt),
          blDates = blTime.map((r) => fmtB(r.timeStamp)),
          latestBl = blVals[blVals.length - 1] || 0,
          maxBl = Math.max(...blVals),
          minBl = Math.min(...blVals),
          blChange = latestBl - blVals[0];
        wrap.appendChild(
          kpiGrid([
            { label: "현재 백링크", value: fmt(latestBl), color: C.teal, icon: ICONS.link },
            { label: "기간 최고", value: fmt(maxBl), color: C.green, icon: ICONS.up },
            { label: "기간 최저", value: fmt(minBl), color: C.sub, icon: ICONS.down },
            {
              label: "증감",
              value: (blChange >= 0 ? "+" : "") + blChange,
              color: blChange >= 0 ? C.green : C.red,
              icon: ICONS.chart,
            },
          ]),
        );
        wrap.appendChild(
          chartCard(
            "백링크 추이 (기간별)",
            "현재 " + fmt(latestBl) + "개",
            C.teal,
            sparkline(blVals, blDates, 80, C.teal, "개"),
            blDates,
          ),
        );
        if (blTopDomains.length) {
          wrap.appendChild(
            secTitle(
              '탑 도메인 <span style="font-size:10px;font-weight:400;letter-spacing:0;text-transform:none;color:#64748b;margin-left:6px">도메인별 누적 링크수</span>',
            ),
          );
          const mxD = Math.max(...blTopDomains.map((d) => d.backlinkCnt)) || 1;
          blTopDomains.forEach(function (d, i) {
            const row = document.createElement("div");
            row.style.cssText = S.row + ";flex-direction:column;align-items:stretch;gap:8px;border-color:" + (i === 0 ? C.teal + "44" : C.border);
            row.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:11px;font-weight:800;color:${i === 0 ? C.teal : "#64748b"}">#${i + 1}</span><span style="font-size:13px;color:#f8fafc;font-weight:600">${escHtml(d.domain)}</span></div><span style="font-size:13px;color:${C.teal};font-weight:700">${escHtml(fmt(d.backlinkCnt))}개</span></div>${hbar(d.backlinkCnt, mxD, C.teal)}`;
            wrap.appendChild(row);
          });
        }
        return wrap;
      },
      insight: function () {
        const wrap = document.createElement("div"),
          ctrNum = Number(avgCtr) || 0;
        wrap.appendChild(secTitle("\uC885\uD569 \uBD84\uC11D"));
        wrap.appendChild(
          ibox(
            cSt.slope >= 0 ? "green" : "red",
            `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.trendUp}</span><b>클릭 추세:</b> ${cSt.slope >= 0 ? '하루 평균 <b style="color:#10b981">+' + fmt(Math.round(cSt.slope)) + '회</b> 증가' : '하루 평균 <b style="color:#ef4444">' + fmt(Math.round(Math.abs(cSt.slope || 0))) + '회</b> 감소'}`,
          ),
        );
        wrap.appendChild(
          ibox(
            ctrNum >= 3 ? "green" : ctrNum >= 1.5 ? "amber" : "red",
            `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.pieChart}</span><b>평균 CTR ${avgCtr}%:</b> ${ctrNum >= 3 ? "우수해요." : ctrNum >= 1.5 ? "보통이에요. 제목을 개선하세요." : "낮아요. 메타 타이틀을 전면 개선하세요."}`,
          ),
        );
        wrap.appendChild(
          ibox(
            Math.abs(corr) > 0.7
              ? "green"
              : Math.abs(corr) > 0.4
                ? "amber"
                : "red",
            `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.linkInsight}</span><b>노출↔클릭 상관 ${corr.toFixed(2)}:</b> ${Math.abs(corr) > 0.7 ? "노출 확대가 효과적이에요." : Math.abs(corr) > 0.4 ? "CTR 개선과 노출 확대를 병행하세요." : "클릭 전환이 낮아요. 콘텐츠 품질을 점검하세요."}`,
          ),
        );
        wrap.appendChild(
          ibox(
            "green",
            `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.calendarDays}</span><b>${bestDow.label}요일</b> 평균 ${fmt(bestDow.avgC)}회 최고, <b>${worstDow.label}요일</b> ${fmt(worstDow.avgC)}회 최저`,
          ),
        );
        if (cSt.outliers && cSt.outliers.length)
          wrap.appendChild(
            ibox("amber", `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.lightbulb}</span>이상치 <b>${cSt.outliers.length}개</b> 감지`),
          );
        wrap.appendChild(
          ibox(
            cSt.cv < 0.3 ? "green" : cSt.cv < 0.5 ? "amber" : "red",
            `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.barChart}</span><b>안정성 CV=${((cSt.cv || 0) * 100).toFixed(0)}%:</b> ${cSt.cv < 0.3 ? "매우 안정적" : cSt.cv < 0.5 ? "약간 변동 있음" : "일별 편차 큼"}`,
          ),
        );
        if (urls.length > 0) {
          const top = urls[0],
            slug =
              decodeURIComponent(top.key).split("/").filter(Boolean).pop() ||
              "";
          wrap.appendChild(
            ibox(
              "blue",
              `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.dashboard}</span><b>최고 URL:</b> "${escHtml(slug.replace(/-/g, " ").slice(0, 30))}…" CTR <b style="color:#f59e0b">${top.ctr}%</b> 클릭 <b style="color:#10b981">${fmt(top.clickCount)}회</b>`,
            ),
          );
        }
        const todo = document.createElement("div");
        todo.style.cssText =
          "background:#0d1829;border:1px solid #00e67622;border-radius:9px;padding:11px 13px;margin-top:6px";
        todo.innerHTML =
          `<div style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:#f8fafc;margin-bottom:10px"><span style="display:inline-flex;color:#10b981">${ICONS.lightbulb}</span>지금 바로 해볼 것</div>` +
          [
            bestDow
              ? bestDow.label + "\uC694\uC77C\uC5D0 \uC2E0\uADDC \uCF58\uD150\uCE20 \uC9D1\uC911 \uBC1C\uD589"
              : "\uAFB8\uC900\uD55C \uBC1C\uD589 \uC8FC\uAE30 \uD655\uB9BD",
            ctrNum < 2
              ? "\uC0C1\uC704 URL \uC81C\uBAA9/\uBA54\uD0C0\uC124\uBA85 A/B \uD14C\uC2A4\uD2B8"
              : "\uD604\uC7AC CTR \uC720\uC9C0, \uB178\uCD9C \uD655\uB300 \uC9D1\uC911",
            (cSt.slope || 0) < 0
              ? "\uD074\uB9AD \uAC10\uC18C \uC6D0\uC778 \uD30C\uC545"
              : "\uC0C1\uC2B9 \uD328\uD134 \uBD84\uC11D \uD6C4 \uC131\uACF5 \uACF5\uC2DD \uBC18\uBCF5",
            queries.length
              ? `"${escHtml(queries[0].key)}" \ud0a4\uc6cc\ub4dc \ubcc0\ud615 \uae00 \ubc1c\ud589`
              : "\uAC80\uC0C9\uC5B4 \uB2E4\uC591\uD654\uB85C \uB835\uD14C\uC778 \uD2B8\uB799\uD53C \uD655\uBCF4",
          ]
            .map(
              (a) =>
                `<div style="font-size:12px;color:#7a9ab8;padding:5px 0;border-bottom:1px solid #1a2d45;display:flex;gap:7px"><span style="color:#00e676">→</span>${a}</div>`,
            )
            .join("");
        wrap.appendChild(todo);
        return wrap;
      },
      indexed: function () {
        const wrap = document.createElement("div");
        if (!diagnosisLogs.length) {
          wrap.innerHTML =
            '<div style="padding:30px;text-align:center;color:#3d5a78">\uC0C9\uC778 \uB370\uC774\uD130 \uC5C6\uC74C</div>';
          return wrap;
        }

        // Extract all state counts for each day
        const indexedDates = diagnosisLogs.map((r) => fmtB(r.date || ""));
        const indexedValues = diagnosisLogs.map((r) => (r.stateCount && r.stateCount["1"]) || 0);
        const pendingValues = diagnosisLogs.map((r) => (r.stateCount && r.stateCount["2"]) || 0);
        const errorValues = diagnosisLogs.map((r) => (r.stateCount && r.stateCount["3"]) || 0);
        const droppedValues = diagnosisLogs.map((r) => (r.stateCount && r.stateCount["4"]) || 0);

        const currentIndexed = indexedValues[indexedValues.length - 1] || 0;
        const currentPending = pendingValues[pendingValues.length - 1] || 0;
        const currentError = errorValues[errorValues.length - 1] || 0;
        const currentDropped = droppedValues[droppedValues.length - 1] || 0;

        const maxIndexed = Math.max(...indexedValues);
        const minIndexed = Math.min(...indexedValues);
        const indexedChange = currentIndexed - (indexedValues[0] || 0);
        const indexedTrend = st(indexedValues);
        const avgIndexed = Math.round(indexedValues.reduce((a, b) => a + b, 0) / indexedValues.length);

        wrap.appendChild(
          kpiGrid([
            {
              label: "\uD604\uC7AC \uC0C9\uC778",
              value: fmt(currentIndexed) + "\uAC74",
              sub: "\uCD5C\uACE0 " + fmt(maxIndexed),
              color: C.purple,
            },
            {
              label: "\uB300\uAE30\uC911",
              value: fmt(currentPending) + "\uAC74",
              color: C.amber,
            },
            {
              label: "\uC624\uB958",
              value: fmt(currentError) + "\uAC74",
              color: currentError > 0 ? C.red : C.sub,
            },
            {
              label: "\uC0C9\uC778\uC5D0\uB7EC",
              value: fmt(currentDropped) + "\uAC74",
              color: currentDropped > 0 ? C.red : C.sub,
            },
          ]),
        );

        wrap.appendChild(
          chartCard(
            "\uC0C9\uC778 \uCD94\uC774",
            "\uD604\uC7AC " + fmt(currentIndexed) + "\uAC74",
            C.purple,
            sparkline(indexedValues, indexedDates, 80, C.purple, "\uAC74", { minValue: 0 }),
            indexedDates,
          ),
        );

        if (indexedChange !== 0) {
          wrap.appendChild(
            ibox(
              indexedChange > 0 ? "green" : "red",
              `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.trendUp}</span>기간 대비 <b style="color:${indexedChange > 0 ? C.green : C.red}">${indexedChange > 0 ? "+" : ""}${fmt(indexedChange)}건</b> ${indexedChange > 0 ? "증가" : "감소"}`,
            ),
          );
        }

        if (currentError > 0 || currentDropped > 0) {
          wrap.appendChild(
            ibox(
              "amber",
              `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.lightbulb}</span>주의: 오류 ${fmt(currentError)}건, 색인에러 ${fmt(currentDropped)}건 발생`,
            ),
          );
        }

        wrap.appendChild(secTitle("\uC77C\uCBDC \uC0C9\uC778 \uD604\uD669"));
        const mxVal = Math.max(...indexedValues, ...pendingValues) || 1;

        diagnosisLogs.slice().reverse().slice(0, 14).forEach(function (r, i) {
          const indexed = (r.stateCount && r.stateCount["1"]) || 0;
          const pending = (r.stateCount && r.stateCount["2"]) || 0;
          const error = (r.stateCount && r.stateCount["3"]) || 0;
          const dropped = (r.stateCount && r.stateCount["4"]) || 0;
          const total = indexed + pending + error + dropped;

          const row = document.createElement("div");
          row.style.cssText =
            "background:#0d1829;border:1px solid " +
            (error > 0 || dropped > 0 ? "#ff525222" : "#1a2d45") +
            ";border-radius:9px;padding:10px 12px;margin-bottom:6px";

          row.innerHTML = `
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
              <span style="font-size:11px;color:#7a9ab8">${escHtml(fmtD(r.date))}</span>
              <span style="font-size:11px;font-weight:700;color:${C.purple}">\uC0C9\uC778 ${escHtml(fmt(indexed))}\uAC74</span>
            </div>
            <div style="display:flex;gap:2px;height:8px;margin-bottom:4px">
              <div style="flex:${indexed};background:${C.purple};border-radius:2px 0 0 2px;min-width:${indexed > 0 ? 2 : 0}px"></div>
              <div style="flex:${pending};background:${C.amber};min-width:${pending > 0 ? 2 : 0}px"></div>
              <div style="flex:${error};background:${C.red};min-width:${error > 0 ? 2 : 0}px"></div>
              <div style="flex:${dropped};background:#ff525288;border-radius:0 2px 2px 0;min-width:${dropped > 0 ? 2 : 0}px"></div>
            </div>
            <div style="display:flex;gap:12px;font-size:10px;color:#3d5a78">
              <span style="color:${C.purple}">\uC0C9\uC778 <b>${escHtml(fmt(indexed))}</b></span>
              <span style="color:${C.amber}">\uB300\uAE30 <b>${escHtml(fmt(pending))}</b></span>
              ${error > 0 ? `<span style="color:${C.red}">\uC624\uB958 <b>${escHtml(fmt(error))}</b></span>` : ""}
              ${dropped > 0 ? `<span style="color:#ff5252">\uC5D0\uB7EC <b>${escHtml(fmt(dropped))}</b></span>` : ""}
            </div>
          `;
          wrap.appendChild(row);
        });

        // Legend
        const legend = document.createElement("div");
        legend.style.cssText =
          "display:flex;gap:16px;justify-content:center;padding:10px;background:#0d1829;border-radius:8px;margin-top:8px";
        legend.innerHTML = `
          <span style="font-size:10px;color:${C.purple}">■ \uC0C9\uC778</span>
          <span style="font-size:10px;color:${C.amber}">■ \uB300\uAE30\uC911</span>
          <span style="font-size:10px;color:${C.red}">■ \uC624\uB958</span>
          <span style="font-size:10px;color:#ff5252">■ \uC0C9\uC778\uC5D0\uB7EC</span>
        `;
        wrap.appendChild(legend);

        return wrap;
      },
    };
  };

  function assignColors() {
    allSites.forEach((s, i) => {
      if (!SITE_COLORS_MAP[s]) SITE_COLORS_MAP[s] = COLORS[i % COLORS.length];
    });
  }
  function ensureCurrentSite() {
    if (!allSites.length) {
      curSite = null;
      return null;
    }
    if (!curSite || !allSites.includes(curSite)) curSite = allSites[0];
    return curSite;
  }
  function setAllSitesLabel() {
    const mergedMeta = getMergedMetaState();
    const summary = isMergedReport() && mergedMeta && mergedMeta.sourceCount
      ? `${allSites.length}개 사이트 등록됨 · ${mergedMeta.sourceCount}개 스냅샷 병합`
      : `${allSites.length}개 사이트 등록됨`;
    labelEl.textContent = summary;
  }
  function buildCombo(rows) {
    console.log('[buildCombo] Called, allSites:', allSites, 'rows:', rows);
    const drop = document.getElementById("sadv-combo-drop");
    if (!drop) {
      console.error('[buildCombo] sadv-combo-drop not found!');
      return;
    }
    const rowsMap = {};
    if (rows && rows.length)
      rows.forEach((r) => {
        if (allSites.includes(r.site)) rowsMap[r.site] = r;
      });
    const rowSites =
      rows && rows.length
        ? rows.map((r) => r.site).filter((site) => allSites.includes(site))
        : [];
    const restSites = allSites.filter((s) => !rowsMap[s]);
    const orderedSites = [...rowSites, ...restSites];
    console.log('[buildCombo] orderedSites:', orderedSites);

    // Create search container
    const searchDiv = document.createElement("div");
    searchDiv.style.cssText = "padding:6px 6px 4px;position:relative";

    const input = document.createElement("input");
    input.id = "sadv-combo-search";
    input.placeholder = "사이트 검색...";

    searchDiv.appendChild(input);

    // Create count display
    const countDiv = document.createElement("div");
    countDiv.style.cssText = "font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#3d5a78;padding:3px 9px 6px;border-bottom:1px solid #1a2d45;margin-bottom:3px";
    countDiv.textContent = "전체 " + orderedSites.length + " 개 · 클릭증은순";

    drop.replaceChildren(searchDiv, countDiv);
    orderedSites.forEach(function (s) {
      const col = SITE_COLORS_MAP[s] || C.muted,
        shortName = getSiteLabel(s),
        row = rowsMap[s],
        clickStr = row ? fmt(row.totalC) + "\uD074\uB9AD" : "—",
        clickCol = row ? C.green : C.muted;
      const item = document.createElement("div");
      item.className = "sadv-copt" + (s === curSite ? " active" : "");
      item.dataset.site = s;
      item.innerHTML = `<div class="sadv-combo-item-dot" style="background:${col}"></div><div class="sadv-combo-item-info"><div class="sadv-combo-item-name">${escHtml(shortName.split("/")[0])}</div><div class="sadv-combo-item-url">${escHtml(shortName)}</div></div><div class="sadv-combo-item-click" style="color:${clickCol}">${escHtml(clickStr)}</div>`;
      item.addEventListener("click", function () {
        setComboSite(s);
        const wrap = document.getElementById("sadv-combo-wrap");
        wrap.classList.remove("open");
        wrap.setAttribute("aria-expanded", "false");
      });
      drop.appendChild(item);
    });
    console.log('[buildCombo] Built', orderedSites.length, 'combo items');
  }
  function setComboSite(site) {
    if (!site || !allSites.includes(site)) return;
    const sameSite = curSite === site;
    curSite = site;
    const col = SITE_COLORS_MAP[site] || C.muted,
      shortName = getSiteLabel(site);
    document.getElementById("sadv-combo-dot").style.background = col;
    document.getElementById("sadv-combo-label").textContent = shortName;
    document.querySelectorAll(".sadv-combo-item").forEach((el) => {
      el.classList.toggle("active", el.dataset.site === site);
    });
    setCachedUiState();
    if (typeof notifySnapshotShellState === "function") notifySnapshotShellState();
    if (curMode === CONFIG.MODE.SITE && !sameSite) loadSiteView(site);
    __sadvNotify();
  }
  const comboWrapMain = document.getElementById("sadv-combo-wrap");
  if (comboWrapMain) {
    comboWrapMain.setAttribute("role", "combobox");
    comboWrapMain.setAttribute("aria-expanded", "false");
  }

  document
    .getElementById("sadv-combo-btn")
    .addEventListener("click", function (e) {
      e.stopPropagation();
      const wrap = document.getElementById("sadv-combo-wrap");
      wrap.classList.toggle("open");
      wrap.setAttribute("aria-expanded", wrap.classList.contains("open") ? "true" : "false");
      if (wrap.classList.contains("open")) {
        setTimeout(function () {
          const inp = document.getElementById("sadv-combo-search");
          if (inp) {
            inp.style.display = "block";
            inp.value = "";
            inp.focus();
            inp.oninput = function () {
              const q = inp.value.toLowerCase();
              document
                .querySelectorAll(".sadv-combo-item")
                .forEach(function (el) {
                  el.style.display =
                    !q ||
                    (((el.dataset.site || "") + " " + getSiteLabel(el.dataset.site || "")).toLowerCase().includes(q))
                      ? "flex"
                      : "none";
                });
            };
          }
        }, 50);
      }
    });
  document.addEventListener("click", function (e) {
    const wrap = document.getElementById("sadv-combo-wrap");
    if (wrap && !wrap.contains(e.target)) {
      wrap.classList.remove("open");
      wrap.setAttribute("aria-expanded", "false");
    }
  });
  const TABS = [
    { id: "overview", label: "개요", icon: ICONS.dashboard },
    { id: "daily", label: "일별", icon: ICONS.calendarDays },
    { id: "urls", label: "URL", icon: ICONS.urlLink },
    { id: "queries", label: "검색어", icon: ICONS.searchTab },
    { id: "indexed", label: "색인", icon: ICONS.database },
    { id: "crawl", label: "크롤", icon: ICONS.activity },
    { id: "backlink", label: "백링크", icon: ICONS.backLinkTab },
    { id: "pattern", label: "패턴", icon: ICONS.barChart },
    { id: "insight", label: "인사이트", icon: ICONS.lightbulb },
  ];
  tabsEl.setAttribute("role", "tablist");
  tabsEl.replaceChildren(...TABS.map((t) => {
    const btn = document.createElement("button");
    btn.className = `sadv-t${t.id === curTab ? " on" : ""}`;
    btn.dataset.t = t.id;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", t.id === curTab);
    btn.setAttribute("aria-controls", "sadv-tabpanel");
    btn.style.cssText = "display:inline-flex;align-items:center;gap:5px";
    btn.innerHTML = `${t.icon}${escHtml(t.label)}`;
    return btn;
  }));
  tabsEl.addEventListener("click", function (e) {
    const t = e.target.closest("[data-t]");
    if (!t || t.dataset.t === curTab) return;
    curTab = t.dataset.t;
    tabsEl.querySelectorAll(".sadv-t").forEach((b) => {
      b.classList.remove("on");
      b.setAttribute("aria-selected", "false");
    });
    t.classList.add("on");
    t.setAttribute("aria-selected", "true");
    setCachedUiState();
    if (window.__sadvR) renderTab(window.__sadvR);
    __sadvNotify();
  });
  function renderTab(R) {
    bdEl.setAttribute("role", "tabpanel");
    bdEl.id = "sadv-tabpanel";
    bdEl.replaceChildren(R[curTab]());
    bdEl.scrollTop = 0;
  }
  modeBar.setAttribute("role", "tablist");
  modeBar.addEventListener("click", function (e) {
    const m = e.target.closest("[data-m]");
    if (!m) return;
    switchMode(m.dataset.m);
  });
  function switchMode(mode) {
    if (mode === curMode) return;
    curMode = mode;
    modeBar
      .querySelectorAll(".sadv-mode")
      .forEach((b) => {
        b.classList.remove("on");
        b.setAttribute("aria-selected", "false");
      });
    const targetBtn = modeBar.querySelector(`[data-m="${mode}"]`);
    if (targetBtn) {
      targetBtn.classList.add("on");
      targetBtn.setAttribute("aria-selected", "true");
    }
    if (mode === CONFIG.MODE.ALL) {
      siteBar.classList.remove("show");
      tabsEl.classList.remove("show");
      setAllSitesLabel();
      renderAllSites();
    } else {
      siteBar.classList.add("show");
      tabsEl.classList.add("show");
      ensureCurrentSite();
      if (curSite) loadSiteView(curSite);
    }
    setCachedUiState();
    if (typeof notifySnapshotShellState === "function") notifySnapshotShellState();
    __sadvNotify();
  }

// ============================================================
// ALL-SITES-VIEW - All sites view rendering and export
// ============================================================

async function renderAllSites() {
  const requestId = ++allViewReqId;
  setAllSitesLabel();
  const loading = document.createElement("div");
  loading.style.cssText =
    "padding:24px 18px 20px;color:#7a9ab8;text-align:left;line-height:1.6";

  // 예상 소요 시간 계산 (사이트당 약 0.5초로 가정)
  const estimatedTimeSeconds = Math.ceil(allSites.length * 0.5);
  const estimatedTimeText = estimatedTimeSeconds > 60
    ? `${Math.floor(estimatedTimeSeconds / 60)}분 ${estimatedTimeSeconds % 60}초`
    : `${estimatedTimeSeconds}초`;

  loading.innerHTML =
    '<div style="font-size:13px;font-weight:700;color:#d4ecff;margin-bottom:8px">전체 현황을 준비 중입니다</div>' +
    `<div id="sadv-all-progress-detail" style="font-size:11px;margin-bottom:10px">기본 리포트를 불러오는 중입니다. (예상: ${estimatedTimeText})</div>` +
    '<div style="height:10px;border-radius:999px;background:#0d1829;border:1px solid #1a2d45;overflow:hidden"><div id="sadv-all-progress-bar" style="width:6%;height:100%;background:linear-gradient(90deg,#40c4ff,#00e676)"></div></div>' +
    '<div id="sadv-all-progress-meta" style="font-size:10px;color:#3d5a78;margin-top:8px">메타 진단은 2개씩 천천히 요청합니다.</div>' +
    '<div id="sadv-all-progress-percent" style="font-size:11px;color:#40c4ff;margin-top:4px;font-weight:600">0%</div>';
  bdEl.innerHTML = "";
  bdEl.appendChild(loading);

  if (!allSites.length) {
    bdEl.innerHTML =
      '<div style="padding:30px 20px;text-align:center"><div style="font-size:32px">⚠️</div><div style="color:#ffca28;font-weight:700;margin:10px 0">사이트 목록을 찾을 수 없어요</div><div style="color:#7a9ab8;font-size:12px;line-height:2">↻ 버튼을 눌러 새로고침 해보세요<br>또는 서치어드바이저 콘솔 페이지에서 실행해주세요</div></div>';
    return;
  }
  const sitesToLoad = allSites;
  const siteDataBySite = {};
  const loadingDetail = loading.querySelector("#sadv-all-progress-detail");
  const loadingBar = loading.querySelector("#sadv-all-progress-bar");
  const loadingMeta = loading.querySelector("#sadv-all-progress-meta");
  const loadingPercent = loading.querySelector("#sadv-all-progress-percent");
  let missingDiagnosisMetaCount = null;

  // 시작 시간 기록 (예상 시간 정확도 개선)
  const startTime = Date.now();

  const setProgress = function (label, ratio, note) {
    if (requestId !== allViewReqId || curMode !== CONFIG.MODE.ALL) return;
    if (ratio >= CONFIG.PROGRESS.META_PHASE_RATIO_START && missingDiagnosisMetaCount === 0) return;
    if (loadingDetail) loadingDetail.textContent = label;
    if (loadingBar) loadingBar.style.width = Math.max(6, Math.round(ratio * 100)) + "%";
    if (loadingPercent) {
      const percent = Math.round(ratio * 100);
      loadingPercent.textContent = `${percent}%`;
      // 진행률 색상 변경 (완료 시 녹색)
      loadingPercent.style.color = percent >= 100 ? '#00e676' : '#40c4ff';
    }
    if (loadingMeta && note) loadingMeta.textContent = note;

    // 경과 시간 및 남은 시간 표시
    if (loadingMeta && ratio < 1) {
      const elapsed = Date.now() - startTime;
      const estimatedTotal = elapsed / ratio;
      const remaining = Math.max(0, estimatedTotal - elapsed);
      const remainingSeconds = Math.ceil(remaining / 1000);
      if (remainingSeconds > 5) {
        const remainingText = remainingSeconds > 60
          ? `${Math.floor(remainingSeconds / 60)}분 ${remainingSeconds % 60}초`
          : `${remainingSeconds}초`;
        loadingMeta.textContent = `${note} (남은 시간: 약 ${remainingText})`;
      }
    }
  };
  const exposeResults = [];
  for (let i = 0; i < sitesToLoad.length; i += ALL_SITES_BATCH) {
    const batchSites = sitesToLoad.slice(i, i + ALL_SITES_BATCH);
    setProgress(
      "기본 리포트 " +
        Math.min(i + batchSites.length, sitesToLoad.length) +
        " / " +
        sitesToLoad.length,
      CONFIG.PROGRESS.BASE_RATIO_START + (Math.min(i + batchSites.length, sitesToLoad.length) / sitesToLoad.length) * CONFIG.PROGRESS.EXPOSE_PHASE_RATIO_RANGE,
    );
    const batchResults = await Promise.allSettled(batchSites.map((site) => fetchExposeData(site)));
    if (requestId !== allViewReqId || curMode !== "all") return;
    let failedCount = 0;
    batchResults.forEach(function (result, offset) {
      exposeResults[i + offset] = result;
      if (result.status === "fulfilled") {
        siteDataBySite[batchSites[offset]] = result.value;
      } else {
        // 실패한 사이트 에러 추적
        failedCount++;
        const errorDetail = result.reason?.message || result.reason || '알 수 없는 오류';
        showError(
          `${batchSites[offset]} 사이트 데이터 로딩 실패`,
          result.reason,
          'renderAllSites-expose'
        );
      }
    });
    // 배치 실패 시 진행률 메타에 표시
    if (failedCount > 0 && loadingMeta) {
      const currentNote = loadingMeta.textContent;
      loadingMeta.textContent = `${currentNote} (${failedCount}개 사이트 실패 - 자동 재시도됨)`;
    }
  }
  const metaSitesToLoad = sitesToLoad.filter(function (site) {
    return !hasDiagnosisMetaSnapshot(siteDataBySite[site] || null);
  });
  missingDiagnosisMetaCount = metaSitesToLoad.length;
  let metaLoaded = 0;
  for (let i = 0; i < metaSitesToLoad.length; i += 2) {
    const batchSites = metaSitesToLoad.slice(i, i + 2);
    setProgress(
      "색인 진단 " + metaLoaded + " / " + metaSitesToLoad.length,
      CONFIG.PROGRESS.META_PHASE_RATIO_START + (metaLoaded / Math.max(1, metaSitesToLoad.length)) * CONFIG.PROGRESS.META_PHASE_RATIO_RANGE,
      "메타 진단은 2개씩 천천히 요청해 차단 위험을 낮춥니다.",
    );
    const batchResults = await Promise.allSettled(
      batchSites.map((site) => fetchDiagnosisMeta(site, siteDataBySite[site] || null)),
    );
    if (requestId !== allViewReqId || curMode !== "all") return;
    batchResults.forEach(function (result, offset) {
      metaLoaded += 1;
      if (result.status === "fulfilled") {
        siteDataBySite[batchSites[offset]] = result.value;
      }
    });
    setProgress(
      "색인 진단 " + metaLoaded + " / " + metaSitesToLoad.length,
      CONFIG.PROGRESS.META_PHASE_RATIO_START + (metaLoaded / Math.max(1, metaSitesToLoad.length)) * CONFIG.PROGRESS.META_PHASE_RATIO_RANGE,
      "가져온 색인 진단 캐시는 사이트별 테이블에서도 그대로 재사용합니다.",
    );
    if (i + 2 < metaSitesToLoad.length) {
      await new Promise((resolve) => setTimeout(resolve, 140));
    }
  }
  const rows = sitesToLoad.map((site, i) =>
    siteDataBySite[site]
      ? buildSiteSummaryRow(site, siteDataBySite[site])
      : exposeResults[i] && exposeResults[i].status === "fulfilled"
        ? buildSiteSummaryRow(site, exposeResults[i].value)
        : buildSiteSummaryRow(site, null),
  );
  rows.sort((a, b) => b.totalC - a.totalC);
  window.__sadvRows = rows;
  buildCombo(rows);
  const wrap = document.createElement("div");
  const mergedMeta = getMergedMetaState();
  if (isMergedReport() && mergedMeta && mergedMeta.accounts) {
    wrap.appendChild(createMergedAccountsInfo(mergedMeta));
  }
  const grandC = rows.reduce((a, r) => a + r.totalC, 0);
  const grandE = rows.reduce((a, r) => a + r.totalE, 0);
  const avgCtrAll = grandE ? (grandC / grandE) * 100 : 0;
  wrap.appendChild(
    kpiGrid([
      { label: "전체 클릭", value: (grandC / 10000).toFixed(1) + "만", sub: "90일 합계", color: C.green },
      { label: "전체 노출", value: (grandE / 10000000).toFixed(1) + "천만", sub: "90일 합계", color: C.blue },
      { label: "평균CTR", value: avgCtrAll.toFixed(2) + "%", sub: "90일 평균", color: C.amber },
      { label: "활성사이트", value: rows.filter((r) => r.totalC > 0).length + "개", color: C.teal },
    ]),
  );
  wrap.appendChild(
    secTitle(
      "클릭 랭킹 TOP " +
        Math.min(rows.length, 30) +
        ' <span style="font-size:9px;font-weight:400;color:#3d5a78;letter-spacing:0">90일 합계</span>',
    ),
  );
  const top30 = rows.slice(0, 30);
  wrap.appendChild(
    chartCard(
      "TOP " + top30.length + " 클릭",
      "",
      C.green,
      barchart(
        top30.map((r) => r.totalC),
        top30.map((r) => r.site.replace(/^https?:\/\//, "")),
        80,
        C.green,
        "회",
      ),
      top30.map((_, i) => "#" + (i + 1)),
    ),
  );
  wrap.appendChild(secTitle("사이트별 상세"));
  rows.forEach(function (r, i) {
    const allCardColors = [C.green, C.blue, C.amber, C.teal, C.purple];
    const col = allCardColors[i % allCardColors.length];
    const card = document.createElement("div");
    card.className = "sadv-allcard";
    card.style.borderTop = "2px solid " + col + "44";
    const shortName = typeof getSiteLabel === "function" ? getSiteLabel(r.site) : r.site.replace(/^https?:\/\//, "");
    const sourceBadge =
      r.sourceAccount && (typeof r.sourceAccount === "string" ? r.sourceAccount.trim() : "")
        ? `<span style="font-size:10px;color:#64748b;background:#1e293b;padding:2px 6px;border-radius:4px;margin-left:8px;white-space:nowrap;border:1px solid #334155" title="${escHtml(r.sourceAccount)}">${escHtml(r.sourceAccount.split("@")[0])}</span>`
        : "";
    card.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><div style="display:flex;align-items:center;gap:8px;min-width:0"><div style="width:10px;height:10px;border-radius:50%;background:' +
      col +
      ';flex-shrink:0;box-shadow:0 0 0 4px ' +
      col +
      '15"></div><span style="font-size:14px;font-weight:700;line-height:1.3;color:#f8fafc;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:240px">' +
      escHtml(shortName) +
      '</span>' +
      sourceBadge +
      '</div></div><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:12px"><div style="text-align:center;min-width:0;background:rgba(30,41,59,0.3);padding:8px;border-radius:8px"><div style="font-size:15px;font-weight:800;line-height:1.1;color:' +
      C.green +
      '">' +
      escHtml(fmt(r.totalC)) +
      '</div><div style="font-size:10px;line-height:1.4;color:#64748b;margin-top:4px">클릭</div></div><div style="text-align:center;min-width:0;background:rgba(30,41,59,0.3);padding:8px;border-radius:8px"><div style="font-size:15px;font-weight:800;line-height:1.1;color:' +
      C.blue +
      '">' +
      escHtml((r.totalE / 10000).toFixed(1)) +
      '만</div><div style="font-size:10px;line-height:1.4;color:#64748b;margin-top:4px">노출</div></div><div style="text-align:center;min-width:0;background:rgba(30,41,59,0.3);padding:8px;border-radius:8px"><div style="font-size:15px;font-weight:800;line-height:1.1;color:' +
      C.amber +
      '">' +
      escHtml(r.avgCtr) +
      '%</div><div style="font-size:10px;line-height:1.4;color:#64748b;margin-top:4px">CTR</div></div></div>';
    if (r.clicks && r.clicks.length > 1) {
      const miniDates = (r.logs || []).map(function (log) {
        return fmtB(log.date);
      });
      const mini = sparkline(r.clicks, miniDates, 36, col, "");
      mini.style.cssText += "opacity:.9";
      card.appendChild(mini);
    }
    const indexBlock = document.createElement("div");
    indexBlock.style.cssText = "margin-top:12px;padding-top:12px;border-top:1px solid #334155";
    if (r.diagnosisIndexedValues && r.diagnosisIndexedValues.length > 1) {
      indexBlock.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px"><span style="font-size:11px;font-weight:700;color:#94a3b8">색인 추이</span><span style="font-size:13px;font-weight:800;color:' +
        col +
        '">' +
        fmt(r.diagnosisIndexedCurrent) +
        '건</span></div>';
      const indexMini = sparkline(r.diagnosisIndexedValues, r.diagnosisIndexedDates, 44, col, "건", { minValue: 0 });
      indexMini.style.cssText += "opacity:.9";
      indexBlock.appendChild(indexMini);
    } else {
      const metaCode = r.diagnosisMetaCode == null ? "-" : String(r.diagnosisMetaCode);
      const httpText = r.diagnosisMetaStatus == null ? "-" : String(r.diagnosisMetaStatus);
      indexBlock.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px"><span style="font-size:11px;font-weight:700;color:#94a3b8">색인 추이</span><span style="font-size:12px;color:#64748b">응답 확인</span></div><div style="font-size:11px;line-height:1.5;color:#64748b">HTTP ' +
        escHtml(httpText) +
        " / code " +
        escHtml(metaCode) +
        "</div>";
    }
    card.appendChild(indexBlock);
    card.dataset.site = r.site;
    card.dataset.col = col;
    wrap.appendChild(card);
  });

  wrap.addEventListener("mouseenter", function (e) {
    const card = e.target.closest(".sadv-allcard");
    if (card && card.dataset.col) {
      card.style.borderColor = card.dataset.col + "88";
    }
  }, true);
  wrap.addEventListener("mouseleave", function (e) {
    const card = e.target.closest(".sadv-allcard");
    if (card && card.dataset.col) {
      card.style.borderColor = "#334155";
      card.style.borderTopColor = card.dataset.col + "44";
    }
  }, true);
  wrap.addEventListener("click", function (e) {
    const card = e.target.closest(".sadv-allcard");
    if (card && card.dataset.site) {
      curSite = card.dataset.site;
      switchMode("site");
    }
  });

  if (requestId !== allViewReqId || curMode !== "all") return;
  bdEl.replaceChildren(wrap);
  bdEl.scrollTop = 0;
}

async function collectExportData(onProgress, options) {
  const dataBySite = {};
  const summaryRows = [];
  const batchSize = FULL_REFRESH_BATCH_SIZE;
  const refreshMode = options && options.refreshMode === "refresh" ? "refresh" : "cache-first";
  await ensureExportSiteList(refreshMode);
  const total = allSites.length;
  let done = 0;
  const stats = { success: 0, partial: 0, failed: 0, errors: [] };
  for (let i = 0; i < allSites.length; i += batchSize) {
    const batch = allSites.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map(function (site) {
        return resolveExportSiteData(site, { refreshMode });
      }),
    );
    results.forEach(function (res, idx) {
      const site = batch[idx];
      let siteData;
      if (res.status === "fulfilled") {
        siteData = normalizeSiteData(res.value);
        const hasExpose = siteData && siteData.expose != null;
        const hasDetail = siteData && siteData.detailLoaded === true;
        if (hasExpose && hasDetail) {
          stats.success++;
        } else if (hasExpose) {
          stats.partial++;
        } else {
          stats.failed++;
          if (res.reason && res.reason.message) {
            stats.errors.push({ site, error: res.reason.message.slice(0, 100) });
          } else {
            stats.errors.push({ site, error: "expose data missing" });
          }
        }
      } else {
        siteData = { expose: null, crawl: null, backlink: null, detailLoaded: false };
        stats.failed++;
        if (res.reason && res.reason.message) {
          stats.errors.push({ site, error: res.reason.message.slice(0, 100) });
        } else {
          stats.errors.push({ site, error: "request rejected" });
        }
      }
      dataBySite[site] = {
        ...siteData,
        __source: {
          accountLabel: accountLabel || "unknown",
          accountEncId: encId || "unknown",
          fetchedAt: siteData.__cacheSavedAt || new Date().toISOString(),
          exportedAt: savedAtIso(new Date()),
        }
      };
      summaryRows.push(buildSiteSummaryRow(site, siteData));
      done++;
      if (onProgress) onProgress(done, total, site, stats);
    });
    if (refreshMode === "refresh" && i + batchSize < allSites.length) {
      const jitter = Math.floor(Math.random() * FULL_REFRESH_JITTER_MS);
      await new Promise(function (resolve) {
        setTimeout(resolve, FULL_REFRESH_SITE_DELAY_MS + jitter);
      });
    }
  }
  summaryRows.sort((a, b) => b.totalC - a.totalC);

  // V2: Nested accounts structure
  // Use email as key (fallback to unknown@naver.com if not available)
  const accountEmail = (accountLabel && accountLabel.includes('@'))
    ? accountLabel
    : 'unknown@naver.com';

  const savedAt = savedAtIso(new Date());

  return {
    __meta: {
      version: PAYLOAD_V2.VERSION,
      savedAt: savedAt,
      generatorVersion: window.__SEARCHADVISOR_RUNTIME_VERSION__ || "unknown",
      exportFormat: "snapshot-v2",
      accountCount: 1
    },
    accounts: {
      [accountEmail]: {
        encId: encId || "unknown",
        sites: [...allSites],
        siteMeta: typeof getSiteMetaMap === "function" ? getSiteMetaMap() : {},
        dataBySite: dataBySite
      }
    },
    ui: {
      curMode,
      curSite,
      curTab
    },
    mergedMeta: typeof getMergedMetaState === "function" ? getMergedMetaState() : null,
    summaryRows,
    stats
  };
}

function savedAtIso(d) {
  return (
    d.getFullYear() +
    "-" +
    pad2(d.getMonth() + 1) +
    "-" +
    pad2(d.getDate()) +
    "T" +
    pad2(d.getHours()) +
    ":" +
    pad2(d.getMinutes()) +
    ":" +
    pad2(d.getSeconds())
  );
}

  async function downloadSnapshot() {
    const btn = document.getElementById("sadv-save-btn");
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "0/" + allSites.length;
    try {
      const savedAt = new Date();
      const payload = await collectExportData(
        function (done, total) {
          btn.textContent = done + "/" + total;
        },
        { refreshMode: "refresh" },
      );
      const html = injectSnapshotReactShell(buildSnapshotHtml(savedAt, payload), payload);
      const fileName =
        "searchadvisor-" +
        accountIdFromLabel(accountLabel) +
        "-" +
        stampFile(savedAt) +
        ".html";
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(function () {
        URL.revokeObjectURL(link.href);
      }, 1000);
    } catch (e) {
      showError(ERROR_MESSAGES.HTML_SAVE_ERROR, e, 'downloadSnapshot');
      bdEl.innerHTML = createInlineError(
        ERROR_MESSAGES.HTML_SAVE_ERROR,
        () => downloadSnapshot(),
        '다시 시도'
      ).outerHTML;
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }
  function buildSnapshotShellState(payload) {
    // Handle V2 format
    let allSites, dataBySite, summaryRows, siteMeta, accountLabel, savedAt, curMode, curSite, curTab;

    if (payload.__meta && payload.accounts) {
      // V2 format
      const accountKeys = Object.keys(payload.accounts);
      const firstAccount = accountKeys.length > 0 ? payload.accounts[accountKeys[0]] : null;

      accountLabel = accountKeys[0] || "";
      allSites = firstAccount?.sites || [];
      dataBySite = firstAccount?.dataBySite || {};
      summaryRows = payload.summaryRows || [];
      siteMeta = firstAccount?.siteMeta || {};
      savedAt = payload.__meta.savedAt;
      curMode = payload.ui?.curMode || "all";
      curSite = payload.ui?.curSite || null;
      curTab = payload.ui?.curTab || "overview";
    } else {
      // V2 포맷이 아닌 경우 빈 값 반환
      accountLabel = "";
      allSites = [];
      dataBySite = {};
      summaryRows = [];
      siteMeta = {};
      savedAt = null;
      curMode = "all";
      curSite = null;
      curTab = "overview";
    }

    const snapshotTabIds = [
      "overview",
      "daily",
      "queries",
      "pages",
      "crawl",
      "backlink",
      "diagnosis",
      "insight",
    ];
    const cacheSavedAtValues = allSites
      .map(function (site) {
        const siteData = dataBySite && dataBySite[site];
        return siteData && typeof siteData.__cacheSavedAt === "number"
          ? siteData.__cacheSavedAt
          : null;
      })
      .filter(function (value) {
        return typeof value === "number";
      });
    const savedAtValue =
      savedAt && !Number.isNaN(new Date(savedAt).getTime())
        ? new Date(savedAt)
        : null;
    const updatedAt = cacheSavedAtValues.length
      ? new Date(Math.max.apply(null, cacheSavedAtValues))
      : savedAtValue;
    return {
      accountLabel: accountLabel,
      allSites: Array.isArray(allSites) ? allSites : [],
      rows: Array.isArray(summaryRows) ? summaryRows.slice() : [],
      siteMeta: siteMeta && typeof siteMeta === "object" ? siteMeta : {},
      curMode: curMode === "site" ? "site" : "all",
      curSite:
        typeof curSite === "string"
          ? curSite
          : (Array.isArray(allSites) && allSites[0]) || null,
      curTab: snapshotTabIds.indexOf(curTab) !== -1
        ? curTab
        : "overview",
      runtimeVersion: window.__SEARCHADVISOR_RUNTIME_VERSION__ || "snapshot",
      cacheMeta: updatedAt
        ? {
            label: "snapshot",
            updatedAt,
            remainingMs: null,
            sourceCount: Array.isArray(allSites) ? allSites.length : 0,
            measuredAt: Date.now(),
          }
        : null,
    };
  }
  function buildSnapshotHtml(savedAt, payload) {
    const clone = p.cloneNode(true);
    clone
      .querySelectorAll(
        '#sadv-react-shell-host,#sadv-react-shell-root,#sadv-react-portal-root,[data-sadvx="snapshot-shell"],[data-sadvx-action="top"]',
      )
      .forEach(function (node) {
        node.remove();
      });
    clone.style.setProperty("display", "flex");
    clone.style.setProperty("visibility", "visible");
    clone.style.setProperty("opacity", "1");
    clone.style.removeProperty("transform");
    clone.style.removeProperty("pointer-events");
    clone.style.removeProperty("background");
    clone.style.removeProperty("border-left-color");
    delete clone.dataset.sadvSaveHidden;
    delete clone.dataset.sadvPrevVisibility;
    delete clone.dataset.sadvPrevPointerEvents;
    delete clone.dataset.sadvPrevBackground;
    delete clone.dataset.sadvPrevBorderLeftColor;
    const savedLabel = stampLabel(savedAt);

    // Handle V2 format for UI state
    let curMode, curSite, curTab, allSites;
    if (payload.__meta && payload.accounts) {
      // V2 format
      curMode = payload.ui?.curMode || "all";
      curSite = payload.ui?.curSite || null;
      curTab = payload.ui?.curTab || "overview";
      const accountKeys = Object.keys(payload.accounts);
      allSites = accountKeys.length > 0 ? (payload.accounts[accountKeys[0]]?.sites || []) : [];
    } else {
      // V2 포맷이 아닌 경우 기본값 사용
      curMode = "all";
      curSite = null;
      curTab = "overview";
      allSites = [];
    }

    const modeLabel = curMode === "site" ? "\uc0ac\uc774\ud2b8\ubcc4" : "\uc804\uccb4\ud604\ud669";
    const activeTab = TABS.find(function (t) {
      return t.id === curTab;
    });
    const activeTabLabel = activeTab ? activeTab.label : modeLabel;
    const siteLabel =
      curMode === "site" && curSite
        ? curSite.replace(/^https?:\/\//, "")
        : allSites.length + "\uac1c \uc0ac\uc774\ud2b8";
    const topRow = clone.querySelector("#sadv-header > div");
    const siteLabelEl = clone.querySelector("#sadv-site-label");
    const comboWrap = clone.querySelector("#sadv-combo-wrap");
    if (comboWrap) comboWrap.classList.remove("open");
    if (siteLabelEl) {
      siteLabelEl.innerHTML = `<span>${escHtml(siteLabel)}</span><span style="display:inline-flex;align-items:center;padding:2px 7px;border-radius:999px;border:1px solid #284766;color:#a8d8ff;background:rgba(12,23,38,.72)">${escHtml(activeTabLabel)}</span>`;
    }
    ["sadv-refresh-btn", "sadv-save-btn", "sadv-x"].forEach(function (id) {
      const el = clone.querySelector("#" + id);
      if (el) el.remove();
    });
    if (topRow && topRow.lastElementChild) {
      const meta = document.createElement("div");
      meta.style.cssText =
        "display:flex;align-items:center;padding:6px 10px;border-radius:999px;border:1px solid #284766;color:#d4ecff;background:rgba(7,13,22,.62);font-size:10px;font-weight:800";
      meta.textContent = "Saved " + savedLabel;
      topRow.lastElementChild.replaceWith(meta);
    }
    const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escHtml("SearchAdvisor Snapshot - " + siteLabel)}</title>
  <style>
    html,body{margin:0;padding:0;background:#06101a;color:#e0ecff;font-family:Apple SD Gothic Neo,system-ui,sans-serif}
    body{padding:28px 18px 40px}
    a{color:#40c4ff}
    :root{--snapshot-panel-width:520px}
    .snapshot-meta{
      width:min(100%,var(--snapshot-panel-width));
      box-sizing:border-box;
      margin:0 auto 12px;
      padding:10px 12px;
      border:1px solid #1a2d45;
      border-radius:20px;
      background:
        radial-gradient(circle at top right, rgba(64,196,255,.12), transparent 34%),
        linear-gradient(180deg, rgba(13,24,41,.98), rgba(7,13,22,.98));
      box-shadow:0 26px 60px rgba(0,0,0,.3);
      overflow:hidden;
    }
    .snapshot-meta-details{display:block}
    .snapshot-meta-details[open]{padding-bottom:2px}
    .snapshot-meta-summary{
      list-style:none;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      cursor:pointer;
      user-select:none;
      outline:none;
    }
    .snapshot-meta-summary::-webkit-details-marker{display:none}
    .snapshot-meta-summary::after{
      content:"\uba54\ud0c0 \ubcf4\uae30";
      flex-shrink:0;
      padding:4px 9px;
      border-radius:999px;
      border:1px solid rgba(255,255,255,.1);
      background:rgba(255,255,255,.03);
      font-size:10px;
      font-weight:700;
      line-height:1;
      color:#8fb4d6;
    }
    .snapshot-meta-details[open] .snapshot-meta-summary::after{content:"\uba54\ud0c0 \uc811\uae30"}
    .snapshot-meta-title{font-size:13px;font-weight:800;line-height:1.2;color:#f3fbff}
    .snapshot-meta-copy{margin-top:6px;font-size:11px;line-height:1.7;color:#7f9cbc}
    #sadv-p{
      position:relative !important;
      top:auto !important;
      right:auto !important;
      width:min(100%,var(--snapshot-panel-width)) !important;
      box-sizing:border-box !important;
      height:auto !important;
      margin:0 auto !important;
      border:1px solid #1a2d45 !important;
      border-radius:20px !important;
      overflow:hidden !important;
      box-shadow:0 26px 60px rgba(0,0,0,.3) !important;
    }
    #sadv-bd{
      overflow:visible !important;
      max-height:none !important;
      height:auto !important;
    }
  </style>
</head>
<body>
  <div class="snapshot-meta">
    <details class="snapshot-meta-details">
      <summary class="snapshot-meta-summary">
        <span class="snapshot-meta-title">SearchAdvisor Snapshot</span>
      </summary>
      <div class="snapshot-meta-copy">\uc800\uc7a5 \uc2dc\uac01: ${escHtml(savedLabel)}<br>\ud504\ub85c\uadf8\ub7a8 \ubc84\uc804: ${escHtml((window.__SEARCHADVISOR_RUNTIME_VERSION__ || "snapshot"))}</div>
    </details>
  </div>
  ${clone.outerHTML}
  <script>
    // <!-- SADV_PAYLOAD_START -->
    const EXPORT_PAYLOAD_RAW = ${JSON.stringify(payload)};
    // Normalize V2 format to legacy format for snapshot HTML compatibility
    const EXPORT_PAYLOAD = (function normalizePayload(p) {
      if (p.__meta && p.accounts) {
        // V2 format - convert to legacy format
        const accountKeys = Object.keys(p.accounts);
        const firstAccount = accountKeys.length > 0 ? p.accounts[accountKeys[0]] : null;
        return {
          savedAt: p.__meta.savedAt || p.savedAt,
          accountLabel: accountKeys[0] || "",
          accountEncId: firstAccount?.encId || "unknown",
          generatorVersion: p.__meta.generatorVersion || "unknown",
          exportFormat: p.__meta.exportFormat || "snapshot-v2",
          allSites: firstAccount?.sites || [],
          summaryRows: p.summaryRows || [],
          dataBySite: firstAccount?.dataBySite || {},
          siteMeta: firstAccount?.siteMeta || {},
          mergedMeta: p.mergedMeta || null,
          curMode: p.ui?.curMode || "all",
          curSite: p.ui?.curSite || null,
          curTab: p.ui?.curTab || "overview"
        };
      }
      // Legacy format - return as is
      return p;
    })(EXPORT_PAYLOAD_RAW);
    // <!-- SADV_PAYLOAD_END -->
    window.__SEARCHADVISOR_EXPORT_PAYLOAD__ = EXPORT_PAYLOAD;
    const SITE_META_MAP = EXPORT_PAYLOAD.siteMeta || {};
    const MERGED_META = EXPORT_PAYLOAD.mergedMeta || null;
    var snapshotShellMetaState = {
      siteMeta: SITE_META_MAP,
      mergedMeta: MERGED_META,
    };
    function setSnapshotMetaState(state) {
      snapshotShellMetaState = {
        siteMeta:
          state && state.siteMeta
            ? state.siteMeta
            : SITE_META_MAP,
        mergedMeta:
          state && Object.prototype.hasOwnProperty.call(state, "mergedMeta")
            ? state.mergedMeta
            : MERGED_META,
      };
      if (typeof notifySnapshotShellState === "function") notifySnapshotShellState();
    }
    function getSiteMetaMap() {
      return snapshotShellMetaState && snapshotShellMetaState.siteMeta
        ? snapshotShellMetaState.siteMeta
        : SITE_META_MAP;
    }
    function getMergedMetaState() {
      return snapshotShellMetaState ? snapshotShellMetaState.mergedMeta : MERGED_META;
    }
    const FIELD_FAILURE_RETRY_MS = 5 * 60 * 1000;
    function hasSuccessfulDiagnosisMetaSnapshot(data) {
      return !!(
        data &&
        ((data.diagnosisMeta && data.diagnosisMeta.code === 0 && data.diagnosisMetaRange) ||
          data.diagnosisMetaFetchState === "success")
      );
    }
    function hasRecentDiagnosisMetaFailure(data, cooldownMs = FIELD_FAILURE_RETRY_MS) {
      return !!(
        data &&
        data.diagnosisMetaFetchState === "failure" &&
        typeof data.diagnosisMetaFetchedAt === "number" &&
        Date.now() - data.diagnosisMetaFetchedAt < cooldownMs
      );
    }
    function hasDiagnosisMetaSnapshot(data) {
      return hasSuccessfulDiagnosisMetaSnapshot(data) || hasRecentDiagnosisMetaFailure(data);
    }
    function getSiteShortName(a) {
      const s = a ? getSiteMetaMap()[a] || null : null;
      const f = s ? (s.displayLabel || s.label || s.shortName || "").trim() : "";
      return f || (a ? a.replace(/^https?:\\\\/\\\\//, "") : "\uc0ac\uc774\ud2b8 \uc120\ud0dd");
    }
    function getSiteLabel(a) {
      if (!a) return "\uc0ac\uc774\ud2b8 \uc120\ud0dd";
      const s = getSiteMetaMap()[a] || null;
      const f = s ? (s.displayLabel || s.label || s.shortName || "").trim() : "";
      return f || getSiteShortName(a);
    }
    function isMergedReport() {
      return !!getMergedMetaState();
    }
    function fmtDateTime(value) {
      if (!value) return "";
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return String(value);
      return (
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0") +
        " " +
        String(d.getHours()).padStart(2, "0") +
        ":" +
        String(d.getMinutes()).padStart(2, "0") +
        ":" +
        String(d.getSeconds()).padStart(2, "0")
      );
    }
    function buildDefaultReportDecoration() {
      const mergedMeta = getMergedMetaState();
      if (!mergedMeta || !mergedMeta.isMerged) return null;
      const siteCount = Array.isArray(allSites) ? allSites.length : 0;
      const naverIds = Array.isArray(mergedMeta.naverIds) ? mergedMeta.naverIds.filter(Boolean) : [];
      const fileNames = Array.isArray(mergedMeta.fileNames) ? mergedMeta.fileNames.filter(Boolean) : [];
      const snapshotLines = [
        "Saved at: " + fmtDateTime(EXPORT_PAYLOAD.savedAt || ""),
        "Merged accounts: " + naverIds.length + " / sites: " + siteCount,
      ];
      if (fileNames.length) snapshotLines.push("Sources: " + fileNames.join(", "));
      return {
        title: "SearchAdvisor Merged Report - " + siteCount + " sites",
        snapshotTitle: "SearchAdvisor Merged Report",
        snapshotLines,
        accountBadge: "MERGED " + naverIds.length + " IDs",
        accountTitle: naverIds.join(", "),
        siteStatus: siteCount + " sites loaded",
        siteSummary: "All " + siteCount + " sites sorted by clicks",
        currentSite: curSite || "",
      };
    }
    function applySnapshotReportDecorations(decoration) {
      const patch = decoration || buildDefaultReportDecoration();
      if (!patch) return;
      if (patch.title) document.title = patch.title;
      const snapshotTitleEl = document.querySelector(".snapshot-meta-title");
      if (snapshotTitleEl && patch.snapshotTitle) snapshotTitleEl.textContent = patch.snapshotTitle;
      const snapshotCopyEl = document.querySelector(".snapshot-meta-copy");
      if (snapshotCopyEl && Array.isArray(patch.snapshotLines)) {
        snapshotCopyEl.replaceChildren();
        patch.snapshotLines.forEach(function (line, index) {
          if (index > 0) snapshotCopyEl.appendChild(document.createElement("br"));
          snapshotCopyEl.appendChild(document.createTextNode(String(line)));
        });
      }
      const accountBadgeEl = document.getElementById("sadv-account-badge");
      if (accountBadgeEl && patch.accountBadge) {
        accountBadgeEl.textContent = patch.accountBadge;
        accountBadgeEl.title = patch.accountTitle || "";
      }
      const siteLabelEl = document.querySelector("#sadv-site-label span");
      if (siteLabelEl && patch.siteStatus) siteLabelEl.textContent = patch.siteStatus;
      const comboLabelEl = document.getElementById("sadv-combo-label");
      if (comboLabelEl && patch.currentSite) comboLabelEl.textContent = getSiteLabel(patch.currentSite);
      const statusTextEl = document.querySelector('[data-sadvx="status-text"] span');
      if (statusTextEl && patch.siteStatus) statusTextEl.textContent = patch.siteStatus;
      const currentSiteEl = document.querySelector('[data-sadvx="current-site"]');
      if (currentSiteEl) {
        currentSiteEl.textContent = patch.currentSite ? getSiteLabel(patch.currentSite) : "Select site";
      }
      const siteSummaryEl = document.querySelector('[data-sadvx="site-summary"]');
      if (siteSummaryEl && patch.siteSummary) siteSummaryEl.textContent = patch.siteSummary;
      document.querySelectorAll("[data-sadvx-site]").forEach(function (button) {
        const site = button.getAttribute("data-sadvx-site") || "";
        const labelWrap = button.children[1];
        const titleEl = labelWrap ? labelWrap.firstElementChild : null;
        if (titleEl) titleEl.textContent = getSiteLabel(site);
        if (patch.currentSite) button.dataset.active = site === patch.currentSite ? "true" : "false";
      });
    }
    window.__SEARCHADVISOR_APPLY_REPORT_DECORATIONS__ = applySnapshotReportDecorations;
    window.__SEARCHADVISOR_PAYLOAD_CONTRACT__ = {
      version: "20260314-payload-contract-v1",
      mode: "saved-html",
      getSiteMetaMap,
      getMergedMetaState,
      getSiteShortName,
      getSiteLabel,
      applyReportDecorations: applySnapshotReportDecorations,
    };
    const ICONS = ${JSON.stringify(ICONS)};
    const C = ${JSON.stringify(C)};
    const COLORS = ${JSON.stringify(COLORS)};
    const DOW = ${JSON.stringify(DOW)};
    const PNL = ${JSON.stringify(PNL)};
    const CHART_W = PNL - 32;
    const TABS = ${JSON.stringify(TABS)};
    let TIP = null;
    const fmt = (v) => Number(v).toLocaleString();
    const fmtD = (s) => s ? s.slice(0, 4) + "-" + s.slice(4, 6) + "-" + s.slice(6, 8) : "";
    const fmtB = (s) => s ? s.slice(4, 6) + "/" + s.slice(6, 8) : "";
    ${tip.toString()}
    ${showTip.toString()}
    ${moveTip.toString()}
    ${hideTip.toString()}
    ${sparkline.toString()}
    ${barchart.toString()}
    ${xlbl.toString()}
    ${chartCard.toString()}
    ${kpiGrid.toString()}
    ${secTitle.toString()}
    ${ibox.toString()}
    ${ctrBadge.toString()}
    ${hbar.toString()}
    ${st.toString()}
    ${pearson.toString()}
    ${buildSiteSummaryRow.toString()}
    ${buildRenderers.toString()}
    ${assignColors.toString()}
    ${ensureCurrentSite.toString()}
    ${buildCombo.toString()}
    ${setComboSite.toString()}
    ${renderTab.toString()}
    ${switchMode.toString()}
    ${setAllSitesLabel.toString()}
    ${renderSnapshotAllSites.toString()}
    ${loadSiteView.toString()}
    async function fetchExposeData(site) {
      return (
        EXPORT_PAYLOAD.dataBySite[site] || {
          expose: null,
          crawl: null,
          backlink: null,
          detailLoaded: false,
        }
      );
    }
    async function fetchSiteData(site) {
      return fetchExposeData(site);
    }
    async function fetchExposeDataBatch(sites) {
      return sites.map(function (site) {
        return {
          status: "fulfilled",
          value:
            EXPORT_PAYLOAD.dataBySite[site] || {
              expose: null,
              crawl: null,
              backlink: null,
              detailLoaded: false,
            },
        };
      });
    }
    let allSites = EXPORT_PAYLOAD.allSites || [];
    const INITIAL_MODE = EXPORT_PAYLOAD.curMode || "all";
    let curMode = null;  // Initialize to null so switchMode() triggers on first call
    let curSite = EXPORT_PAYLOAD.curSite || (allSites[0] || null);
    let curTab = EXPORT_PAYLOAD.curTab || "overview";
    const SNAPSHOT_SHELL_LISTENERS = new Set();
    function cloneSnapshotShellState() {
      const cacheSavedAtValues = allSites
        .map(function (site) {
          const dataBySite = EXPORT_PAYLOAD.dataBySite && EXPORT_PAYLOAD.dataBySite[site];
          return dataBySite && typeof dataBySite.__cacheSavedAt === "number"
            ? dataBySite.__cacheSavedAt
            : null;
        })
        .filter(function (value) {
          return typeof value === "number";
        });
      const savedAtValue =
        EXPORT_PAYLOAD.savedAt && !Number.isNaN(new Date(EXPORT_PAYLOAD.savedAt).getTime())
          ? new Date(EXPORT_PAYLOAD.savedAt)
          : null;
      const updatedAt = cacheSavedAtValues.length
        ? new Date(Math.max.apply(null, cacheSavedAtValues))
        : savedAtValue;
      return {
        accountLabel: EXPORT_PAYLOAD.accountLabel || "",
        allSites: Array.isArray(allSites) ? allSites.slice() : [],
        rows: Array.isArray(window.__sadvRows) ? window.__sadvRows.slice() : [],
        siteMeta: getSiteMetaMap(),
        mergedMeta: getMergedMetaState(),
        curMode: curMode === "site" ? "site" : "all",
        curSite: typeof curSite === "string" ? curSite : allSites[0] || null,
        curTab: TABS.some(function (tab) {
          return tab.id === curTab;
        })
          ? curTab
          : "overview",
        runtimeVersion: window.__SEARCHADVISOR_RUNTIME_VERSION__ || "snapshot",
        cacheMeta: updatedAt
          ? {
              label: "snapshot",
              updatedAt,
              remainingMs: null,
              sourceCount: allSites.length,
              measuredAt: Date.now(),
            }
          : null,
      };
    }
    function notifySnapshotShellState() {
      const nextState = cloneSnapshotShellState();
      SNAPSHOT_SHELL_LISTENERS.forEach(function (listener) {
        try {
          listener(nextState);
        } catch (e) {
          console.error('[notifySnapshotShellState] Error:', e);
        }
      });
    }
    const SNAPSHOT_UI_STATE_KEY =
      "sadv_snapshot_ui_v1::" +
      String(EXPORT_PAYLOAD.savedAt || "") +
      "::" +
      String(EXPORT_PAYLOAD.curSite || "");
    function lsGet(k) {
      try {
        const v = localStorage.getItem(k);
        return v ? JSON.parse(v) : null;
      } catch (e) {
        return null;
      }
    }
    function lsSet(k, v) {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch (e) {
        console.error('[lsSet] Error:', e);
      }
    }
    function getUiStateCacheKey() {
      return SNAPSHOT_UI_STATE_KEY;
    }
    function getCachedUiState() {
      const cached = lsGet(getUiStateCacheKey());
      if (!cached || typeof cached !== "object") return null;
      const mode = cached.mode === "site" ? "site" : cached.mode === "all" ? "all" : null;
      const tab = typeof cached.tab === "string" ? cached.tab : null;
      const site = typeof cached.site === "string" ? cached.site : null;
      if (!mode && !tab && !site) return null;
      return {
        mode,
        tab,
        site,
      };
    }
    function setCachedUiState() {
      lsSet(getUiStateCacheKey(), {
        ts: Date.now(),
        mode: curMode,
        tab: curTab,
        site: curSite,
      });
    }
    const SITE_COLORS_MAP = {};
    const memCache = {};
    let siteViewReqId = 0;
    let allViewReqId = 0;
    const p = document.getElementById("sadv-p");
    const modeBar = document.getElementById("sadv-mode-bar");
    const siteBar = document.getElementById("sadv-site-bar");
    window.__sadvTabsEl = document.getElementById("sadv-tabs"); // Export to global scope
    const tabsEl = window.__sadvTabsEl;
    const bdEl = document.getElementById("sadv-bd");
    const labelEl = document.getElementById("sadv-site-label");
    tabsEl.innerHTML = TABS.map(function (t) {
      return '<button class="sadv-t' + (t.id === curTab ? " on" : "") + '" data-t="' + t.id + '">' + t.label + "</button>";
    }).join("");
    function setTab(tab) {
      if (!tab || tab === curTab) return;
      const t = tabsEl.querySelector('[data-t="' + tab + '"]');
      if (!t) return;
      curTab = tab;
      tabsEl.querySelectorAll(".sadv-t").forEach(function (b) {
        b.classList.remove("on");
      });
      t.classList.add("on");
      if (window.__sadvR) renderTab(window.__sadvR);
      setCachedUiState();
      notifySnapshotShellState();
    }
    tabsEl.addEventListener("click", function (e) {
      const t = e.target.closest("[data-t]");
      if (!t) return;
      setTab(t.dataset.t);
    });
    document.getElementById("sadv-combo-btn").addEventListener("click", function (e) {
      e.stopPropagation();
      const wrap = document.getElementById("sadv-combo-wrap");
      wrap.classList.toggle("open");
      if (wrap.classList.contains("open")) {
        setTimeout(function () {
          const inp = document.getElementById("sadv-combo-search");
          if (inp) {
            inp.style.display = "block";
            inp.value = "";
            inp.focus();
            inp.oninput = function () {
              const q = inp.value.toLowerCase();
              document.querySelectorAll(".sadv-combo-item").forEach(function (el) {
                const searchTarget = ((el.dataset.site || "") + " " + getSiteLabel(el.dataset.site || "")).toLowerCase();
                el.style.display = !q || searchTarget.includes(q) ? "flex" : "none";
              });
            };
          }
        }, 50);
      }
    });
    document.addEventListener("click", function (e) {
      const wrap = document.getElementById("sadv-combo-wrap");
      if (wrap && !wrap.contains(e.target)) wrap.classList.remove("open");
    });
    modeBar.addEventListener("click", function (e) {
      const m = e.target.closest("[data-m]");
      if (!m) return;
      switchMode(m.dataset.m);
    });
    window.__SEARCHADVISOR_SNAPSHOT_API__ = {
      getState: cloneSnapshotShellState,
      isReady: function () {
        return true;
      },
      waitUntilReady: function () {
        return Promise.resolve(true);
      },
      subscribe: function (listener) {
        SNAPSHOT_SHELL_LISTENERS.add(listener);
        return function () {
          SNAPSHOT_SHELL_LISTENERS.delete(listener);
        };
      },
      switchMode: function (mode) {
        switchMode(mode);
      },
      setSite: function (site) {
        setComboSite(site);
        if (curMode !== "site") switchMode("site");
      },
      setTab: function (tab) {
        setTab(tab);
      },
      refresh: function () {
        alert("??ν\ube44 HTML? ?\ube60\uc744 ?\uc5bc\uaca9? 좌측 상단 메뉴에서 다운로드하세요.");
      },
      download: function () {
        alert("??ν\ube33 HTML ?\ubd84\uc5d0 \ub2e4\uc2dc ?\uc800\uc7a5\ud560 \uc218 ?右?uc2b5\ub2c8\ub2e4. ??ν\uc6d0\ud3a0? ?\ub3d9\uc791? \uc774\uc0c1\uc774 ?\uc0ac\ub77c\uc9c0\uba74 ?\uc885\ub8cc\ud574 \uc8fc\uc138\uc694.");
      },
      close: function () {
        const unmountShell = window.__SEARCHADVISOR_SNAPSHOT_SHELL_UNMOUNT__;
        if (typeof unmountShell === "function") {
          try {
            unmountShell();
          } catch (e) {
            console.error('[close] Error:', e);
          }
        }
        const panel = document.getElementById("sadv-p");
        if (panel) panel.remove();
        const meta = document.querySelector(".snapshot-meta");
        if (meta) meta.remove();
        const host = document.getElementById("sadv-react-shell-host");
        if (host) host.remove();
        delete window.__SEARCHADVISOR_SNAPSHOT_API__;
        delete window.__SEARCHADVISOR_SNAPSHOT_SHELL_ROOT__;
      },
    };
    assignColors();
    window.__sadvRows = (EXPORT_PAYLOAD.summaryRows || []).filter(function (row) {
      return row && allSites.includes(row.site);
    });
    ensureCurrentSite();
    buildCombo(window.__sadvRows.length ? window.__sadvRows : null);
    if (curSite) setComboSite(curSite);
    setAllSitesLabel();
    switchMode(INITIAL_MODE);
    applySnapshotReportDecorations();
    notifySnapshotShellState();
  <\/script>
</body>
</html>`;
    return html;
  }
  function buildSnapshotShellBootstrapScript() {
    return [
      "(function () {",
      '  const host = document.getElementById("sadv-react-shell-host");',
      "  const snapshotApi = window.__SEARCHADVISOR_SNAPSHOT_API__ || null;",
      "  if (!host || !snapshotApi) return;",
      '  host.setAttribute("style", "display:block !important;width:100% !important;flex-shrink:0;");',
      '  let portal = host.querySelector("#sadv-react-portal-root");',
      "  if (!portal) {",
      '    portal = document.createElement("div");',
      '    portal.id = "sadv-react-portal-root";',
      "    host.appendChild(portal);",
      "  }",
      '  let mount = host.querySelector("#sadv-react-shell-root");',
      "  if (!mount) {",
      '    mount = document.createElement("div");',
      '    mount.id = "sadv-react-shell-root";',
      "  }",
      '  mount.setAttribute("data-sadvx", "snapshot-shell");',
      '  const shellIds = ["sadv-header", "sadv-mode-bar", "sadv-site-bar", "sadv-tabs"];',
      "  const moved = [];",
      "  shellIds.forEach(function (id) {",
      "    const node = document.getElementById(id);",
      "    if (!node || !node.parentNode) return;",
      "    moved.push({ node: node, parent: node.parentNode, next: node.nextSibling });",
      "    mount.appendChild(node);",
      "  });",
      "  const previousUnmount = window.__SEARCHADVISOR_SNAPSHOT_SHELL_UNMOUNT__;",
      '  if (typeof previousUnmount === "function") {',
      "    try { previousUnmount(); } catch (_) {}",
      "  }",
      '  const hideStyle = document.getElementById("sadv-snapshot-shell-hide");',
      "  if (hideStyle) hideStyle.remove();",
      "  host.replaceChildren(mount);",
      "  host.appendChild(portal);",
      "  window.__SEARCHADVISOR_SNAPSHOT_SHELL_UNMOUNT__ = function () {",
      "    moved.forEach(function (entry) {",
      "      if (entry.parent) entry.parent.insertBefore(entry.node, entry.next);",
      "    });",
      "    host.replaceChildren();",
      "    host.appendChild(portal);",
      "    delete window.__SEARCHADVISOR_SNAPSHOT_SHELL_UNMOUNT__;",
      "  };",
      "})();",
    ].join(String.fromCharCode(10));
  }
  function buildSnapshotApiCompatScript() {
    return [
      "(function () {",
      "  if (window.__SEARCHADVISOR_SNAPSHOT_API__) return;",
      "  const shellStateSource = window.__SEARCHADVISOR_SNAPSHOT_SHELL_STATE__ || {};",
      "  const snapshotState = {",
      '    accountLabel: shellStateSource.accountLabel || "",',
      "    allSites: Array.isArray(shellStateSource.allSites) ? shellStateSource.allSites.slice() : [],",
      "    rows: Array.isArray(shellStateSource.rows) ? shellStateSource.rows.slice() : [],",
      '    siteMeta: shellStateSource.siteMeta && typeof shellStateSource.siteMeta === "object" ? shellStateSource.siteMeta : {},',
      '    curMode: shellStateSource.curMode === "site" ? "site" : "all",',
      '    curSite: typeof shellStateSource.curSite === "string" ? shellStateSource.curSite : null,',
      '    curTab: typeof shellStateSource.curTab === "string" ? shellStateSource.curTab : "overview",',
      '    runtimeVersion: shellStateSource.runtimeVersion || "snapshot",',
      "    cacheMeta: shellStateSource.cacheMeta",
      "      ? {",
      '          label: shellStateSource.cacheMeta.label || "snapshot",',
      "          updatedAt: shellStateSource.cacheMeta.updatedAt ? new Date(shellStateSource.cacheMeta.updatedAt) : null,",
      '          remainingMs: typeof shellStateSource.cacheMeta.remainingMs === "number" ? shellStateSource.cacheMeta.remainingMs : null,',
      '          sourceCount: typeof shellStateSource.cacheMeta.sourceCount === "number" ? shellStateSource.cacheMeta.sourceCount : (Array.isArray(shellStateSource.allSites) ? shellStateSource.allSites.length : 0),',
      '          measuredAt: typeof shellStateSource.cacheMeta.measuredAt === "number" ? shellStateSource.cacheMeta.measuredAt : Date.now(),',
      "        }",
      "      : null,",
      "  };",
      "  const listeners = new Set();",
      "  function cloneState() {",
      "    return {",
      "      accountLabel: snapshotState.accountLabel,",
      "      allSites: Array.isArray(snapshotState.allSites) ? snapshotState.allSites.slice() : [],",
      "      rows: Array.isArray(snapshotState.rows) ? snapshotState.rows.slice() : [],",
      '      siteMeta: snapshotState.siteMeta && typeof snapshotState.siteMeta === "object" ? snapshotState.siteMeta : {},',
      '      curMode: snapshotState.curMode === "site" ? "site" : "all",',
      '      curSite: typeof snapshotState.curSite === "string" ? snapshotState.curSite : null,',
      '      curTab: typeof snapshotState.curTab === "string" ? snapshotState.curTab : "overview",',
      '      runtimeVersion: snapshotState.runtimeVersion || "snapshot",',
      "      cacheMeta: snapshotState.cacheMeta",
      "        ? {",
      '            label: snapshotState.cacheMeta.label || "snapshot",',
      "            updatedAt: snapshotState.cacheMeta.updatedAt instanceof Date ? snapshotState.cacheMeta.updatedAt : null,",
      '            remainingMs: typeof snapshotState.cacheMeta.remainingMs === "number" ? snapshotState.cacheMeta.remainingMs : null,',
      '            sourceCount: typeof snapshotState.cacheMeta.sourceCount === "number" ? snapshotState.cacheMeta.sourceCount : snapshotState.allSites.length,',
      '            measuredAt: typeof snapshotState.cacheMeta.measuredAt === "number" ? snapshotState.cacheMeta.measuredAt : Date.now(),',
      "          }",
      "        : null,",
      "    };",
      "  }",
      "  function notify() {",
      "    const nextState = cloneState();",
      "    listeners.forEach(function (listener) {",
      "      try { listener(nextState); } catch (_) {}",
      "    });",
      "  }",
      "  function getSiteShortName(site) {",
      '    if (!site) return "site";',
      '    if (site.indexOf("https://") === 0) return site.slice(8);',
      '    if (site.indexOf("http://") === 0) return site.slice(7);',
      "    return site;",
      "  }",
      "  function getSiteLabel(site) {",
      '    if (!site) return "site";',
      '    const meta = snapshotState.siteMeta && typeof snapshotState.siteMeta === "object" ? snapshotState.siteMeta[site] || null : null;',
      '    const label = meta ? (meta.displayLabel || meta.label || meta.shortName || "").trim() : "";',
      "    return label || getSiteShortName(site);",
      "  }",
      "  function resolveSiteFromLegacyLabel(labelText) {",
      '    const trimmed = (labelText || "").trim();',
      "    if (!trimmed) return null;",
      "    const exact = snapshotState.allSites.find(function (site) {",
      "      return site === trimmed || getSiteShortName(site) === trimmed || getSiteLabel(site) === trimmed;",
      "    });",
      "    if (exact) return exact;",
      "    const normalized = trimmed.toLowerCase();",
      "    return snapshotState.allSites.find(function (site) {",
      "      return site.toLowerCase() === normalized || getSiteShortName(site).toLowerCase() === normalized || getSiteLabel(site).toLowerCase() === normalized;",
      "    }) || null;",
      "  }",
      "  function syncFromLegacy() {",
      '    const activeMode = document.querySelector("#sadv-mode-bar .sadv-mode.on");',
      '    const activeTab = document.querySelector("#sadv-tabs .sadv-t.on");',
      '    const comboLabel = document.getElementById("sadv-combo-label");',
      '    const siteLabel = document.querySelector("#sadv-site-label span") || document.getElementById("sadv-site-label");',
      "    if (activeMode) snapshotState.curMode = activeMode.getAttribute('data-m') === 'site' ? 'site' : 'all';",
      "    if (activeTab) snapshotState.curTab = activeTab.getAttribute('data-t') || 'overview';",
      "    const resolvedSite =",
      '      resolveSiteFromLegacyLabel(comboLabel ? comboLabel.textContent : "") ||',
      '      resolveSiteFromLegacyLabel(siteLabel ? siteLabel.textContent : "") ||',
      "      snapshotState.curSite ||",
      "      snapshotState.allSites[0] ||",
      "      null;",
      "    snapshotState.curSite = resolvedSite;",
      "    notify();",
      "  }",
      "  function scheduleSync() { Promise.resolve().then(syncFromLegacy); }",
      "  const api = {",
      "    getState: cloneState,",
      "    isReady: function () { return true; },",
      "    waitUntilReady: function () { return Promise.resolve(true); },",
      "    subscribe: function (listener) { listeners.add(listener); return function () { listeners.delete(listener); }; },",
      '    switchMode: function (mode) { if (typeof switchMode === "function") switchMode(mode); else { const button = document.querySelector("#sadv-mode-bar [data-m=\\"" + mode + "\\"]"); if (button) button.click(); } scheduleSync(); },',
      '    setSite: function (site) { if (typeof setComboSite === "function") setComboSite(site); else { const items = Array.from(document.querySelectorAll(".sadv-combo-item")); const button = items.find(function (item) { return (item.getAttribute("data-site") || "") === site; }); if (button) button.click(); } if (typeof switchMode === "function") switchMode("site"); scheduleSync(); },',
      '    setTab: function (tab) { if (typeof setTab === "function") setTab(tab); else { const button = document.querySelector("#sadv-tabs [data-t=\\"" + tab + "\\"]"); if (button) button.click(); } scheduleSync(); },',
      '    refresh: function () { alert("\uc800\uc7a5\ub41c HTML\uc740 \uc815\uc801 \uc2a4\ub0c5\uc0f7\uc785\ub2c8\ub2e4. \uc6d0\ubcf8 \ud328\ub110\uc5d0\uc11c \ub2e4\uc2dc \uac31\uc2e0\ud574 \uc8fc\uc138\uc694."); },',
      '    download: function () { alert("\uc800\uc7a5\ub41c HTML \ud30c\uc77c\uc5d0\uc11c\ub294 \ub2e4\uc2dc \uc800\uc7a5\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4. \uc6d0\ubcf8 \ud328\ub110\uc5d0\uc11c \ub2e4\uc2dc \uc800\uc7a5\ud574 \uc8fc\uc138\uc694."); },',
      '    close: function () { const unmountShell = window.__SEARCHADVISOR_SNAPSHOT_SHELL_UNMOUNT__; if (typeof unmountShell === "function") { try { unmountShell(); } catch (_) {} } const panel = document.getElementById("sadv-p"); if (panel) panel.remove(); const meta = document.querySelector(".snapshot-meta"); if (meta) meta.remove(); const host = document.getElementById("sadv-react-shell-host"); if (host) host.remove(); delete window.__SEARCHADVISOR_SNAPSHOT_API__; delete window.__SEARCHADVISOR_SNAPSHOT_SHELL_ROOT__; },',
      "  };",
      "  window.__SEARCHADVISOR_SNAPSHOT_API__ = api;",
      '  const target = document.getElementById("sadv-p") || document.body;',
      '  if (target && typeof MutationObserver === "function") {',
      "    const observer = new MutationObserver(function () { scheduleSync(); });",
      "    observer.observe(target, { subtree: true, childList: true, attributes: true, characterData: true });",
      "  }",
      "  syncFromLegacy();",
      "})();",
    ].join("\n");
  }
  function injectSnapshotReactShell(html, payload) {
    if (!html.includes('<div id="sadv-bd">')) {
      throw new Error("snapshot panel not found");
    }
    const reactShellCss = vS(document.getElementById("sadv-react-style")?.textContent || "");
    const shellState = buildSnapshotShellState(payload);
    html = html.replace(
      "</head>",
      `<style id="sadv-react-style">${reactShellCss}</style><style id="sadv-snapshot-shell-hide">#sadv-header,#sadv-mode-bar,#sadv-site-bar{display:none !important}#sadv-react-shell-host{display:block !important;width:100% !important;flex-shrink:0}</style></head>`,
    );
    html = html.replace(
      "<body>",
      `<body><script>window.__SEARCHADVISOR_SNAPSHOT_SHELL_STATE__=${JSON.stringify(shellState)};<\/script>`,
    );
    html = html.replace('<div id="sadv-bd">', `<div id="sadv-react-shell-host"></div><div id="sadv-bd">`);
    html = html.replace(
      "</body>",
      `<script>${gS(buildSnapshotShellBootstrapScript())}<\/script></body>`,
    );
    return html;
  }
  /**
   * 병합된 계정 정보를 표시하는 DOM 요소를 생성합니다.
   * @param {Object} mergedMeta - 병합 메타데이터 (accounts, mergedAt 포함)
   * @returns {HTMLElement} 병합된 계정 정보를 표시하는 div 요소
   */
  function createMergedAccountsInfo(mergedMeta) {
    const mergedInfo = document.createElement("div");
    mergedInfo.style.cssText = "background:linear-gradient(135deg,#1a2d45,#0d1829);border:1px solid #2a4060;border-radius:8px;padding:12px 16px;margin-bottom:16px";
    const validAccounts = mergedMeta.accounts.filter(Boolean);
    const accountLabels = validAccounts.map((acc, i) => {
      const fullLabel = acc.label || acc.encId?.slice(0, 8) || `계정${i + 1}`;
      const shortLabel = fullLabel.includes('@') ? fullLabel.split('@')[0] : fullLabel;
      return `<span tabindex="0" role="button" aria-describedby="merged-acc-full-${i}" style="display:inline-block;background:#2a4060;color:#8bb8e8;padding:3px 8px;border-radius:4px;font-size:11px;margin:2px;cursor:default" title="${escHtml(fullLabel)}">${escHtml(shortLabel)}<span id="merged-acc-full-${i}" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">전체: ${escHtml(fullLabel)}</span></span>`;
    }).join(" ");
    mergedInfo.setAttribute("role", "region");
    mergedInfo.setAttribute("aria-label", `병합된 계정 정보, ${validAccounts.length}개 계정`);
    mergedInfo.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <span style="font-size:16px" aria-hidden="true">🔀</span>
          <span style="font-size:13px;font-weight:700;color:#e0ecff">병합된 계정</span>
          <span style="font-size:10px;color:#6482a2;background:#0d1829;padding:2px 6px;border-radius:4px">${validAccounts.length}개 계정</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px">${accountLabels}</div>
        <div style="font-size:9px;color:#6482a2;margin-top:8px">병합 시각: ${mergedMeta.mergedAt ? new Date(mergedMeta.mergedAt).toLocaleString('ko-KR') : '-'}</div>
      `;
    return mergedInfo;
  }

  async function loadSiteView(site) {
    if (!site) {
      bdEl.innerHTML = createInlineError(
        ERROR_MESSAGES.SITE_NOT_FOUND,
        () => window.location.reload(),
        '새로고침'
      ).outerHTML;
      return;
    }
    const requestId = ++siteViewReqId;
    labelEl.innerHTML = `<span>${escHtml(getSiteLabel(site))}</span>`;
    bdEl.innerHTML = `<div style="padding:50px 20px;text-align:center;color:#64748b"><div style="display:inline-flex;align-items:center;gap:8px">${ICONS.refresh.replace('width="13" height="13"','width="16" height="16"')} 로딩 중...</div></div>`;
    let d;
    try {
      d = await fetchSiteData(site);
    } catch (e) {
      bdEl.innerHTML = createInlineError(
        ERROR_MESSAGES.DATA_LOAD_FAILED,
        () => loadSiteView(site),
        '다시 시도'
      ).outerHTML;
      return;
    }
    if (requestId !== siteViewReqId || site !== curSite) return;
    if (!d || !d.expose || !d.expose.items || !d.expose.items.length) {
      bdEl.innerHTML =
        `<div style="padding:40px 20px;text-align:center"><div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;background:#0f172a;border:1px solid #334155;border-radius:12px;margin-bottom:16px;color:#ef4444">${ICONS.xMark.replace('width="14" height="14"','width="22" height="22"')}</div><div style="color:#f8fafc;font-weight:700;font-size:14px;margin-bottom:6px">데이터 없음</div><div style="color:#64748b;font-size:12px">이 사이트의 데이터가 없습니다</div></div>`;
      return;
    }
    const R = buildRenderers(d.expose, d.crawl, d.backlink, d.diagnosisMeta);
    window.__sadvR = R;
    renderTab(R);
    if (typeof notifySnapshotShellState === "function") notifySnapshotShellState();
  }

  function buildSiteSummaryRow(site, data) {
    const item = (data && data.expose && data.expose.items && data.expose.items[0]) || {};
    const logs = (item.logs || []).sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    const clicks = logs.map((r) => Number(r.clickCount) || 0);
    const exposes = logs.map((r) => Number(r.exposeCount) || 0);
    const totalC = clicks.reduce((a, b) => a + b, 0);
    const totalE = exposes.reduce((a, b) => a + b, 0);
    const avgCtr = totalE ? (totalC / totalE) * 100 : 0;
    const cSt = st(clicks);
    const period = item.period || {};
    const diagnosisItem =
      (data && data.diagnosisMeta && data.diagnosisMeta.items && data.diagnosisMeta.items[0]) || {};
    const diagnosisLogs = [...(diagnosisItem.meta || [])].sort((a, b) =>
      (a.date || "").localeCompare(b.date || ""),
    );

    // Debug logging for diagnosis data
    if (diagnosisLogs.length > 0) {
      }
    const diagnosisLatest =
      diagnosisLogs.length > 0 ? diagnosisLogs[diagnosisLogs.length - 1] : null;
    const diagnosisLatestCounts =
      diagnosisLatest && diagnosisLatest.stateCount ? diagnosisLatest.stateCount : {};
    const diagnosisIndexedValues = diagnosisLogs.map(function (row) {
      return (row.stateCount && row.stateCount["1"]) || 0;
    });
    const diagnosisIndexedDates = diagnosisLogs.map(function (row) {
      const digits = String(row.date || "").replace(/[^\d]/g, "");
      return digits.length === 8 ? fmtB(digits) : row.date || "";
    });
    // Get source account from active payload/merge metadata
    const initSiteData =
      (typeof window !== "undefined" && window.__sadvMergedData && window.__sadvMergedData.sites
        ? window.__sadvMergedData.sites[site]
        : null) ||
      (typeof window !== "undefined" && window.__sadvInitData && window.__sadvInitData.sites
        ? window.__sadvInitData.sites[site]
        : null) ||
      (typeof window !== "undefined" && window.__SEARCHADVISOR_EXPORT_PAYLOAD__ && window.__SEARCHADVISOR_EXPORT_PAYLOAD__.siteData
        ? window.__SEARCHADVISOR_EXPORT_PAYLOAD__.siteData[site]
        : null);
    const sourceAccount =
      (data && data._merge && data._merge.__source) ||
      (data && data.__meta && data.__meta.__source) ||
      (data && data.__source) ||
      (initSiteData && initSiteData._merge && initSiteData._merge.__source) ||
      (initSiteData && initSiteData.__meta && initSiteData.__meta.__source) ||
      null;

    return {
      site,
      totalC,
      totalE,
      avgCtr: +avgCtr.toFixed(2),
      trend: cSt.slope || 0,
      latestClick: clicks.slice(-7).reduce((a, b) => a + b, 0),
      prevClickRatio: period.prevClickRatio != null && Number.isFinite(parseFloat(period.prevClickRatio)) ? parseFloat(period.prevClickRatio) : undefined,
      logs,
      clicks,
      diagnosisIndexedCurrent: diagnosisLatestCounts["1"] || 0,
      diagnosisIndexedValues,
      diagnosisIndexedDates,
      diagnosisLatestDate: diagnosisLatest && diagnosisLatest.date ? diagnosisLatest.date : "-",
      diagnosisMetaCode:
        data && data.diagnosisMeta && typeof data.diagnosisMeta.code !== "undefined"
          ? data.diagnosisMeta.code
          : null,
      diagnosisMetaStatus:
        data && typeof data.diagnosisMetaStatus !== "undefined"
          ? data.diagnosisMetaStatus
          : null,
      diagnosisMetaRange:
        data && typeof data.diagnosisMetaRange !== "undefined"
          ? data.diagnosisMetaRange
          : null,
      sourceAccount: sourceAccount,
    };
  }

function renderFullRefreshProgress(label, detail, progress, stats) {
  const ratio =
    typeof progress === "number" && isFinite(progress)
      ? Math.max(0.06, Math.min(1, progress))
      : 0.06;
  const st = stats || { success: 0, partial: 0, failed: 0, errors: [] };
  const pct = Math.round(ratio * 100);
  let statsHtml = "";
  if (st.success > 0 || st.partial > 0 || st.failed > 0) {
    statsHtml =
      '<div style="display:flex;gap:12px;margin-top:8px;font-size:10px">' +
      '<span style="color:#4ade80">' + st.success + ' success</span>' +
      '<span style="color:#fbbf24">' + st.partial + ' partial</span>' +
      '<span style="color:#f87171">' + st.failed + ' failed</span>' +
      "</div>";
  }
  let errorsHtml = "";
  if (st.errors && st.errors.length > 0 && st.errors.length <= 3) {
    errorsHtml =
      '<div style="margin-top:10px;font-size:10px;color:#f87171;line-height:1.4">' +
      st.errors.map(function (e) { return escHtml(e.site) + ": " + escHtml(e.error); }).join("<br>") +
      "</div>";
  }
  bdEl.innerHTML =
    '<div style="padding:24px 18px 20px;color:#7a9ab8;text-align:left;line-height:1.6">' +
    '<div style="font-size:13px;font-weight:700;color:#d4ecff;margin-bottom:8px">' +
    label +
    "</div>" +
    '<div style="font-size:11px;margin-bottom:10px">' +
    (detail || "") +
    "</div>" +
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">' +
    '<div style="flex:1;height:10px;border-radius:999px;background:#0d1829;border:1px solid #1a2d45;overflow:hidden">' +
    '<div style="width:' +
    pct +
    '%;height:100%;background:linear-gradient(90deg,#40c4ff,#00e676)"></div>' +
    "</div>" +
    '<span style="font-size:11px;font-weight:700;color:#d4ecff;min-width:48px;text-align:right">' +
    pct +
    "%</span>" +
    "</div>" +
    statsHtml +
    errorsHtml +
    "</div>";
}

function shouldBootstrapFullRefresh() {
  if (!allSites.length) return false;
  const now = Date.now();
  const siteListTs = getSiteListCacheStamp();
  if (!(typeof siteListTs === "number") || now - siteListTs >= DATA_TTL) return true;
  return allSites.some(function (site) {
    const siteTs = getSiteDataCacheStamp(site);
    return !(typeof siteTs === "number") || now - siteTs >= DATA_TTL;
  });
}

async function runFullRefreshPipeline(options = {}) {
  const trigger = options && options.trigger ? options.trigger : "manual";
  const triggerLabel =
    trigger === "cache-expiry"
      ? "\uce90\uc2dc\uac00 \ub9cc\ub8cc\ub418\uc5b4 \uc804\uccb4 \ub370\uc774\ud130\ub97c \ub2e4\uc2dc \uc218\uc9d1\ud558\uace0 \uc788\uc5b4\uc694."
      : "\uc804\uccb4 \ub370\uc774\ud130\ub97c \ub2e4\uc2dc \uc218\uc9d1\ud558\uace0 \uc788\uc5b4\uc694.";
  const triggerDetail =
    trigger === "cache-expiry"
      ? "\uc804\uccb4\ud604\ud669\uacfc \uc0ac\uc774\ud2b8\ubcc4 \uc0c1\uc138\ud0ed\uc744 \ubaa8\ub450 \ucd5c\uc2e0 \uc0c1\ud0dc\ub85c \ub9de\ucd94\ub294 \uc911\uc785\ub2c8\ub2e4."
      : "\uc0ac\uc774\ud2b8 \ubaa9\ub85d\ubd80\ud130 expose, diagnosisMeta, crawl, backlink\uae4c\uc9c0 \uc21c\uc11c\ub300\ub85c \uac31\uc2e0\ud569\ub2c8\ub2e4.";
  renderFullRefreshProgress(triggerLabel, triggerDetail, 0);
  labelEl.innerHTML = "<span>\uc804\uccb4 \uc7ac\uc218\uc9d1 \uc9c4\ud589 \uc911</span>";
  const btn = options && options.button ? options.button : null;
  const payload = await collectExportData(
    function (done, total, site, stats) {
      const safeTotal = Math.max(1, total);
      const shortSite = site
        ? site.replace("https://", "").replace("http://", "")
        : "";
      const detail =
        done +
        " / " +
        safeTotal +
        " \uc0ac\uc774\ud2b8 \ucc98\ub9ac \uc911" +
        (shortSite ? " · " + shortSite : "");
      renderFullRefreshProgress(triggerLabel, detail, done / safeTotal, stats);
      if (btn) btn.textContent = done + "/" + safeTotal;
    },
    { refreshMode: "refresh" },
  );
  window.__sadvRows = payload.summaryRows;
  buildCombo(payload.summaryRows);
  assignColors();
  ensureCurrentSite();
  if (curSite) setComboSite(curSite);
  if (curMode === "site" && curSite) {
    await loadSiteView(curSite);
  } else {
    setAllSitesLabel();
    await renderAllSites();
  }
  setCachedUiState();
  if (payload.stats && (payload.stats.failed > 0 || payload.stats.errors.length > 0)) {
    renderFailureSummary(payload.stats);
  }
  return payload;
}

function renderFailureSummary(stats) {
  if (!stats || (stats.failed === 0 && stats.errors.length === 0)) return;
  const summaryEl = document.createElement("div");
  summaryEl.id = "sadv-failure-summary";
  summaryEl.style.cssText =
    "position:fixed;bottom:12px;right:12px;background:#1a1a2e;border:1px solid #f87171;border-radius:8px;padding:12px 16px;font-size:11px;color:#f87171;max-width:320px;z-index:10000000;box-shadow:0 4px 20px rgba(0,0,0,.5);font-family:Apple SD Gothic Neo,system-ui";
  const failedCount = stats.failed || 0;
  const partialCount = stats.partial || 0;
  const errorItems = (stats.errors || []).slice(0, 5);
  const headerRow = document.createElement("div");
  headerRow.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-bottom:4px";
  const titleSpan = document.createElement("span");
  titleSpan.style.fontWeight = "700";
  titleSpan.textContent = "Data Collection Issues";
  headerRow.appendChild(titleSpan);
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "\u00d7";
  closeBtn.style.cssText = "background:none;border:none;color:#f87171;cursor:pointer;font-size:14px;padding:0 4px";
  closeBtn.onclick = function () { summaryEl.remove(); };
  headerRow.appendChild(closeBtn);
  summaryEl.appendChild(headerRow);
  const countDiv = document.createElement("div");
  countDiv.style.color = "#fcd34d";
  countDiv.textContent = failedCount + " failed" + (partialCount > 0 ? ", " + partialCount + " partial" : "");
  summaryEl.appendChild(countDiv);
  if (errorItems.length > 0) {
    const errorDiv = document.createElement("div");
    errorDiv.style.cssText = "margin-top:8px;padding-top:8px;border-top:1px solid #f8717155;font-size:10px;line-height:1.5";
    errorItems.forEach(function (e) {
      const line = document.createElement("div");
      const siteShort = e.site ? e.site.replace(/^https?:\/\//, "").slice(0, 30) : "unknown";
      line.textContent = siteShort + ": " + (e.error || "unknown error");
      errorDiv.appendChild(line);
    });
    if (stats.errors.length > 5) {
      const moreLine = document.createElement("div");
      moreLine.style.color = "#fbbf24";
      moreLine.textContent = "... +" + (stats.errors.length - 5) + " more";
      errorDiv.appendChild(moreLine);
    }
    summaryEl.appendChild(errorDiv);
  }
  const existing = document.getElementById("sadv-failure-summary");
  if (existing) existing.remove();
  document.body.appendChild(summaryEl);
  setTimeout(function () {
    if (summaryEl && summaryEl.parentElement) summaryEl.remove();
  }, 30000);
}

  // Async initialization - wait for site list to load
  console.log('[Init] Starting async initialization...');
  (async function() {
    console.log('[Init] Inside async IIFE, calling loadSiteList...');
    await loadSiteList(false);
    injectDemoData(); // Inject mock data if on localhost
    assignColors();
    const cachedUiState = getCachedUiState();
    shouldBootstrapFullRefresh() && runFullRefreshPipeline({ trigger: "cache-expiry" });
    let bootMode = CONFIG.MODE.ALL;
    let bootSite = null;
    // In demo mode, default to site mode with first demo site
    if (IS_DEMO_MODE && allSites.length > 0) {
      bootMode = CONFIG.MODE.SITE;
      bootSite = allSites[0];
    }
    const curSiteMatch = location.search.match(/site=([^&]+)/);
    if (curSiteMatch) {
      const cur = decodeURIComponent(curSiteMatch[1]);
      if (allSites.includes(cur)) {
        bootSite = cur;
        bootMode = CONFIG.MODE.SITE;
      }
    } else if (cachedUiState) {
      if (cachedUiState.site && allSites.includes(cachedUiState.site)) bootSite = cachedUiState.site;
      if (cachedUiState.mode === CONFIG.MODE.SITE && bootSite) bootMode = CONFIG.MODE.SITE;
      if (cachedUiState.mode === CONFIG.MODE.ALL) bootMode = CONFIG.MODE.ALL;
      if (
        cachedUiState.tab &&
        TABS.some(function (tab) {
          return tab.id === cachedUiState.tab;
        })
      ) {
        curTab = cachedUiState.tab;
        tabsEl.querySelectorAll(".sadv-t").forEach(function (btn) {
          btn.classList.toggle("on", btn.dataset.t === curTab);
        });
      }
    }
    if (bootSite) curSite = bootSite;
    ensureCurrentSite();
    buildCombo(null);
    if (curSite) setComboSite(curSite);
    if (bootMode === CONFIG.MODE.SITE && curSite) {
      curMode = CONFIG.MODE.SITE;
      modeBar.querySelectorAll(".sadv-mode").forEach((b) => b.classList.remove("on"));
      modeBar.querySelector('[data-m="site"]').classList.add("on");
      siteBar.classList.add("show");
      tabsEl.classList.add("show");
      loadSiteView(curSite);
    } else {
      setAllSitesLabel();
      renderAllSites();
    }
    setCachedUiState();
    __sadvMarkReady();
  })().catch((e) => {
    console.error('[Init Error]', e);
  });

})();