# Icons

WordPress icons from `@wordpress/icons`.

## Source

321 SVG files in `svg/`, each named `{icon-name}.svg`.

Originally from: `gutenberg/packages/icons/src/library/`

## Usage

To use an icon, read the SVG file:

```bash
cat skill/icons/svg/plus.svg
```

Then paste the SVG inline in your mockup HTML.

## Icon Specs

- Viewbox: `0 0 24 24`
- Size: 24×24 default
- Fill: Use `fill="currentColor"` to inherit text color

## Example

```html
<button class="components-button has-icon">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M11 12.5V17.5H12.5V12.5H17.5V11H12.5V6H11V11H6V12.5H11Z" />
  </svg>
</button>
```

## Common Icons

| Action | Icon |
|--------|------|
| Add | `plus` |
| Close | `close`, `close-small` |
| Confirm | `check` |
| Expand | `chevron-down` |
| Navigate | `chevron-left`, `chevron-right` |
| Menu | `more-vertical`, `more-horizontal` |
| Edit | `pencil` |
| Delete | `trash` |
| Settings | `settings`, `cog` |
| Search | `search` |
| Help | `help` |

## All Icons (321)

```
add-card          add-submenu       add-template      align-center
align-justify     align-left        align-none        align-right
archive           arrow-down        arrow-down-left   arrow-down-right
arrow-left        arrow-right       arrow-up          arrow-up-left
arrow-up-right    aspect-ratio      at-symbol         audio
background        backup            bell              bell-unread
block-default     block-meta        block-table       border
box               breadcrumbs       brush             bug
button            buttons           calendar          cancel-circle-filled
caption           capture-photo     capture-video     cart
category          caution           caution-filled    chart-bar
check             chevron-down      chevron-down-small chevron-left
chevron-left-small chevron-right    chevron-right-small chevron-up
chevron-up-down   chevron-up-small  classic           close
close-small       cloud             cloud-download    cloud-upload
code              cog               color             column
columns           comment           comment-author-avatar comment-author-name
comment-content   comment-edit-link comment-reply-link connection
copy              copy-small        corner-all        corner-bottom-left
corner-bottom-right corner-top-left corner-top-right  cover
create            crop              currency-dollar   currency-euro
currency-pound    custom-link       custom-post-type  dashboard
desktop           details           download          drafts
drag-handle       drawer-left       drawer-right      envelope
error             external          file              filter
flip-horizontal   flip-vertical     footer            format-bold
format-capitalize format-indent     format-indent-rtl format-italic
format-list-bullets format-list-bullets-rtl format-list-numbered format-list-numbered-rtl
format-lowercase  format-ltr        format-outdent    format-outdent-rtl
format-rtl        format-strikethrough format-underline format-uppercase
fullscreen        funnel            gallery           gift
globe             grid              group             handle
header            heading           heading-level-1   heading-level-2
heading-level-3   heading-level-4   heading-level-5   heading-level-6
help              help-filled       home              home-button
html              image             inbox             info
insert-after      insert-before     institution       justify-bottom
justify-center    justify-center-vertical justify-left justify-right
justify-space-between justify-space-between-vertical justify-stretch justify-stretch-vertical
justify-top       key               keyboard          keyboard-close
keyboard-return   language          layout            level-up
lifesaver         line-dashed       line-dotted       line-solid
link              link-off          list              list-item
list-view         lock              lock-outline      lock-small
login             loop              map-marker        math
media             media-and-text    megaphone         menu
mobile            more              more-horizontal   more-vertical
move-to           navigation        next              not-allowed
not-found         offline           overlay-text      page
page-break        pages             paragraph         payment
pencil            pending           people            percent
pin               pin-small         plugins           plus
plus-circle       plus-circle-filled position-center  position-left
position-right    post              post-author       post-categories
post-comments     post-comments-count post-comments-form post-content
post-date         post-excerpt      post-featured-image post-list
post-terms        preformatted      previous          published
pull-left         pull-right        pullquote         query-pagination
query-pagination-next query-pagination-numbers query-pagination-previous quote
receipt           redo              remove-bug        remove-submenu
replace           reset             resize-corner-n-e reusable-block
rotate-left       rotate-right      row               rss
scheduled         search            seen              send
separator         settings          shadow            share
shield            shipping          shortcode         shuffle
sidebar           sides-all         sides-axial       sides-bottom
sides-horizontal  sides-left        sides-right       sides-top
sides-vertical    site-logo         square            stack
star-empty        star-filled       star-half         store
stretch-full-width stretch-wide     styles            subscript
superscript       swatch            symbol            symbol-filled
table             table-column-after table-column-before table-column-delete
table-of-contents table-row-after   table-row-before  table-row-delete
tablet            tag               term-count        term-description
term-name         text-color        text-horizontal   text-vertical
thumbs-down       thumbs-up         time-to-read      tip
title             tool              trash             trending-down
trending-up       typography        undo              ungroup
unlock            unseen            update            upload
verse             video             widget            word-count
wordpress
```
