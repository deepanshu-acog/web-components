# record-list (pattern)

A list of records, each with a name, a status, secondary detail, and a category.

**Use it when:** Showing a set of similar records where each one has a name, some kind of status or severity, and a short supporting detail. Medicines, problems, alerts, tasks, findings, activity. Use it whenever the alternative would be a table with two or three columns.

**Do not use it when:** Do not use it when the records have four or more attributes worth comparing across rows, or when the user needs to sort or filter — that is a table, not a list. Do not use it for navigation menus (use wa-dropdown) or for a list of links (use plain markup).

Records vary a lot in length, so this pattern is built to stay readable when
one record has a two-word detail and the next has a paragraph.

## Markup

```html
<ul class="atk-record-list">
  <li class="atk-record">
    <div class="atk-record-heading">
      <span class="atk-record-name">Hypokalemia</span>
      <wa-badge variant="warning">Moderate</wa-badge>
    </div>
    <span class="atk-record-meta">Metabolic</span>
    <p class="atk-record-detail atk-record-detail--clamped">
      Documented on 27 July as a relevant active condition. Requires ongoing
      monitoring and replacement.
    </p>
  </li>
</ul>
```

## Classes

| Class | What it does |
|---|---|
| `atk-record-list` | The list. Establishes the container for the narrow layout. |
| `atk-record` | One record. Use on an `<li>`. |
| `atk-record-heading` | Wraps the name and its status so they wrap together. |
| `atk-record-name` | The record's name. |
| `atk-record-meta` | The category, shown on the right. Optional. |
| `atk-record-detail` | Supporting text below the name. Optional. |
| `atk-record-detail--clamped` | Limits detail text to two lines. |

## Notes

**Use a real list.** `<ul>` and `<li>`, not `<div>`. Screen readers announce
how many records there are, which is the main thing a user needs from a list
like this. A `<div>` gives them nothing.

**The status is a `<wa-badge>`, not our own element.** Match `variant` to
meaning: `danger` for high, `warning` for moderate, `neutral` for low. Do not
invent colours for severity levels — the theme decides what danger looks like.

**Clamping hides text visually but keeps it in the page.** Search and assistive
technology still find the full text. If the full detail genuinely matters at a
glance, leave the clamp off rather than adding a "show more" control to every
record.

**The narrow layout uses a container query, not a media query.** The record
list reflows based on the width of its own container, so it works the same
inside a narrow sidebar as it does on a small screen. This only works because
`atk-record-list` sets `container-type`. Do not remove that.
