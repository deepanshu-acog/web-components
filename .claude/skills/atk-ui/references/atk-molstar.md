<!-- Generated from the component source. Do not edit; run `make generate`. -->

# `<atk-molstar>`

Interactive 3D macromolecular structure viewer.

**Use it when:** Displaying 3D protein, ligand, or nucleic acid structures in biological and chemical research reports.

**Do not use it when:** Do not use for 2D chemical structure diagrams (use SMILES/2D drawer) or non-molecular 3D graphics.

## Example

```html
<atk-molstar pdb-id="1CRN" height="400"></atk-molstar>
```

## Attributes

| Name | Description |
|---|---|
| `pdb-id` | RCSB PDB accession code (e.g. "1CRN" or "7KRN"). |
| `url` | Direct URL to a structure file (.cif, .pdb, .sdf). Takes precedence over pdb-id. |
| `format` | Structure file format. Inferred from URL when omitted. |
| `height` | Height of the 3D viewport in pixels. Defaults to 500. |

## Notes

3D molecular structure viewer powered by Mol* (Molstar).

Renders macromolecular structures from RCSB PDB IDs or direct structure file URLs
with interactive 3D rotation, zooming, and representation styles.
