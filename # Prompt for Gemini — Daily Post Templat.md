# Prompt for Gemini — Daily Post Template Redesign (The Beauty Bar Kenya)

Paste this whole thing into Gemini, then attach the reference images and the 4 current output screenshots when it asks (or attach them alongside this prompt).

---

## A. Context

You are working inside my existing "Daily Post" generator codebase (VS Code project). This tool takes product data (image, title, description, price, category) for a WhatsApp/Instagram seller — currently "The Beauty Bar Kenya," Jamia Mall Shop F47, Nairobi CBD — and renders it into a branded, ready-to-post promotional image.

The end customer for this tool is a small seller who posts 40+ times a day to WhatsApp status and groups. The person viewing the finished image is a scrolling phone user who will keep scrolling in under two seconds unless the design looks genuinely premium and trustworthy. This is not a personal design project — it has to look good enough that people stop and buy. Generic-looking output is a failed output, not an acceptable one.

I'm attaching two sets of images:
1. **Reference images** — outside examples of product ad design, some excellent, some deliberately bad (explained below).
2. **My current output** — 4 real renders from the pipeline as it stands today.

Study both sets before writing or changing any code. Do not just make it "nicer" — diagnose specifically what separates the good references from the bad ones, and specifically what's broken in my current output, then fix root causes.

## B. Reading the reference images — what to copy and what to avoid

Not all the reference images are good examples. Sort them like this:

**Copy the approach of:**
- The purple "Chic & Unique" handbag flyer — cohesive single-brand color palette, curated multi-product arrangement, real product photography, a short brand tagline, and a complete footer (social handles, phone number, delivery badge).
- "Sandra's Luxury Bags" — WhatsApp-first contact (QR code + WhatsApp number), consistent branding, product arrangement that looks intentional rather than randomly placed.
- The dark "SUMMER 2025 SALE" single-bag image — restrained, premium, editorial lighting and negative space. Note what's missing though: no contact info at all, so on its own it's an incomplete template, not a finished one.

**Avoid the approach of:**
- "YOUR FASHION STORE" (blue bag) and "OnlineShop" (red/blue beach bag with visible "Lorem ipsum dolor sit amet..." placeholder text) and the black "www.website.com / +0123 456 789" flyer. These are unfilled stock templates — placeholder copy, placeholder URLs, placeholder phone numbers, generic clip-art-style layout. This is exactly the generic look we must never ship. If a design would look like this with real Beauty Bar Kenya data dropped in, redesign it.

The dividing line: a good template still looks intentional and premium even before you've customized a single value. A bad template only looks acceptable once you imagine someone else's finished content in it. Every template in this system must pass the first test.

## C. Auditing my actual current output — exact bugs found

Of the 4 renders I generated from real Beauty Bar Kenya data, 2 worked and 2 are broken. Fix the broken ones by cause, not by cosmetic patch:

1. **Saltair Lip Oil Balm (green template)** — correct. Clean text, correct product-title-price match, working footer. This is the baseline quality bar for every template going forward.
2. **Revlon PhotoReady Insta-Filter Foundation (flash-sale green/red template)** — correct. Same standard: keep this.
3. **"Essence Lash Without Limits" (dark gold "Signature Collection" template)** — broken in 3 distinct ways:
   - Raw HTML entities are printing literally on the image instead of being decoded: `&#038;` should render as `&`, `&#8220;`/`&#8221;` should render as curly quotes. This means the product text source is HTML-encoded (e.g. pulled from a WordPress/WooCommerce-style feed) and the renderer is inserting it as-is instead of decoding entities before layout.
   - The product photo shown is the e.l.f Brightening Face Primer, but the title/description text is for a completely different product ("Lash Without Limits... Mascara"). Image and text are out of sync — check wherever the code pairs `image`, `title`, `description`, and `price` for a product: they must travel together as one bound object through the entire pipeline, never zipped from separate parallel arrays/lists that can drift out of order.
   - Title and description text overlap each other and overflow past the right edge of the card. There's no width constraint + wrap rule on the text container, and the layout appears to assume a fixed text height instead of letting the container grow or the text shrink to fit.
4. **"Maybelline Grippy Serum" (same dark gold template)** — same 3 bugs as #3, confirming this is a template-level defect, not a one-off.

## D. Fix these first, before anything else

1. Decode all HTML entities in every text field (title, description, any copy pulled from source data) at the point where text enters the render pipeline — before font sizing, before layout, before it ever reaches the canvas/DOM.
2. Refactor the data flow so every product is one bound object: `{ image, title, description, price, category, badge }`. No code path should combine image and text for a product from two different lists/indices. Add a validation step that fails loudly (not silently) if any field is missing or mismatched before rendering.
3. Rebuild the text layout to be defensive: fixed-width text container, `overflow-wrap`/word-break enabled, auto-shrinking font size (or a max-line-clamp with ellipsis) so long titles/descriptions never overlap another element or run off the card edge. Test every template against the longest realistic title and description you can find in the product data, not just short ones.

## E. Then: build real design variety, not just one fixed skin per category

I have roughly 172 real products across these categories, and I want close to 1900 ready, distinct-feeling designs available so the output never looks like the same template reused over and over:

- Handbags & Bags — 84
- Makeup & Prep — 30
- Lip Care — 18
- Bath & Body — 10
- Skincare & Face — 10
- Serums & Actives — 10
- Classic Clothes — 4
- Household & Bedding — 3
- Household & Kitchen — 1
- Skincare — 1

That number only makes sense as **multiple distinct template skins per category that the system can rotate through** (e.g. 4–6 elegant, genuinely different-looking templates per category, applied across the products in that category and across different post types — new arrival, flash sale, restock, bestseller). Do not attempt to hand-design 1900 one-off layouts; design a strong small set of template skins per category plus a badge/tag system (flash sale, new arrival, restock, best seller, limited stock) that recombine to produce non-repetitive output.

For each category, propose a distinct visual mood so a Handbags post never looks like a Lip Care post:
- Handbags & Bags — editorial/luxury: deep jewel tones or neutral cream/brown, generous negative space, single hero product or a small curated group shot.
- Makeup & Prep — vibrant, glossy, high-contrast, close-up product photography.
- Lip Care — soft, warm pastel palette, smaller/cuter card feel.
- Bath & Body — spa-like: soft greens/creams, airy.
- Skincare & Face — clean, clinical: white/soft green, lots of whitespace, minimal ornamentation.
- Serums & Actives — precise, lab-clean: cool tones, sharp typography, ingredient-forward feel.
- Classic Clothes — fashion-editorial: bold typography, model/product photography treated like a lookbook.
- Household & Bedding / Household & Kitchen — warm, homey tones, straightforward and practical rather than glossy.

Every template, regardless of category, must always keep: real product photo (never AI-generated product imagery), one consistent brand block (shop name + location), a price treatment that's readable at a glance, and the WhatsApp/M-Pesa ordering footer — that part of the brand identity should never change between templates, only the design around it should.

## F. Before you write final code

1. First, tell me your read on the bug causes in section C — confirm you've located the actual entity-decoding, data-pairing, and layout bugs in the current codebase.
2. Propose the category-by-category template skins (rough visual description per skin) before generating final code, so I can approve the direction.
3. Once approved, implement the 3 core fixes first (section D), verify against the two "Signature Collection" products above, then build out the template skin library (section E).
4. Self-check every template against the longest real title/description in the data before calling it done — don't assume short test strings.