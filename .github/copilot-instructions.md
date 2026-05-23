# Relish Pilates — Copilot Instructions

## Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript 5**
- **Tailwind CSS v4** — config is in `src/app/globals.css` via `@theme inline`, not `tailwind.config.js`
- No state management library; keep components simple and stateless where possible

## Project Structure

```
src/
  app/           # Next.js App Router — layout, page, globals.css
  components/    # One file per component, default export
public/
  fonts/         # Self-hosted TT Ramillas woff/woff2
  images/        # Static images and GIFs
```

## Fonts

Three font families are available as Tailwind utilities:

| Utility         | Family          | Notes                                |
|-----------------|-----------------|--------------------------------------|
| `font-ramillas` | TT Ramillas     | Self-hosted, black weight only (900) |
| `font-nunito`   | Nunito Sans     | Light (300) and regular (400)        |
| `font-press`    | Press Start 2P  | Monospace, decorative use            |

- Headlines use `font-ramillas font-black`
- Body copy uses `font-nunito font-light`

## Brand Colors

All defined in `globals.css` as `--color-*` and usable as Tailwind utilities:

| Utility           | Hex       |
|-------------------|-----------|
| `bg-light`        | `#fbf2ea` |
| `bg-dark-pickle`  | `#1f5534` |
| `text-dark`       | `#1d1d1f` |
| `bg-lavender`     | `#d4c5f9` |
| `bg-light-sage`   | `#c5ccba` |
| `bg-relish-main`  | `#397c52` |
| `bg-mid-olive`    | `#8fa68a` |
| `bg-lime`         | `#dfff92` |

## Design Conventions

- **Buttons / pills**: `rounded-full` with `border border-dark`, offset box-shadow e.g. `shadow-[6px_6px_0px_#1d1d1f]`
- **Cards**: `rounded-2xl` or `rounded-3xl`, green offset shadow `shadow-[8px_8px_0px_#1f5534]`
- **Responsive breakpoint**: primarily `lg:` (desktop) over `md:`; mobile-first
- **Images**: always use `next/image` (`<Image>`) with `fill` + `object-cover` inside a positioned container
- **Links**: always use `next/link` (`<Link>`), never `<a>` directly
- **Accessibility**: include `aria-label` on nav/form elements, `aria-labelledby` on sections, `aria-hidden="true"` on decorative elements

## Component Conventions

- One component per file, default export, named function (not arrow function assigned to `const`)
- Props typed inline or with a local `interface`, not exported unless reused
- Static data arrays (e.g. nav links) defined at module scope above the component

## Build & Dev

```bash
yarn dev       # start dev server
yarn build     # production build
yarn lint      # ESLint
npx tsc --noEmit  # type-check without emitting
```
